// ─── Item mapping: barcode lookup keywords → itemDatabase keys ───────────────
const BARCODE_ITEM_MAP = [
    // packaging keywords
    { keywords: ['plastic bottle', 'pet bottle', 'hdpe bottle'], item: 'plastic bottle' },
    { keywords: ['glass bottle', 'glass jar'],                   item: 'glass bottle' },
    { keywords: ['cardboard', 'corrugated', 'carton'],           item: 'cardboard box' },
    { keywords: ['plastic box', 'plastic container', 'plastic tray'], item: 'plastic box' },
    // category / product-name keywords
    { keywords: ['water', 'juice', 'soda', 'beverage', 'drink', 'cola', 'beer', 'wine', 'spirits', 'alcohol', 'sparkling'], item: 'plastic bottle' },
    { keywords: ['glass'],                                        item: 'glass bottle' },
    { keywords: ['book', 'novel', 'textbook', 'magazine'],        item: 'book' },
    { keywords: ['shirt', 't-shirt', 'tshirt', 'blouse', 'top'], item: 'shirts' },
    { keywords: ['sweater', 'jumper', 'pullover', 'knitwear'],    item: 'sweater' },
    { keywords: ['shoe', 'sneaker', 'boot', 'sandal', 'footwear'], item: 'shoes' },
    { keywords: ['laptop', 'notebook', 'computer', 'tablet', 'phone', 'electronic'], item: 'laptop' },
    { keywords: ['battery', 'batteries', 'alkaline', 'rechargeable'], item: 'batteries' },
    { keywords: ['pen', 'ballpoint', 'marker', 'biro'],           item: 'pens' },
    { keywords: ['pencil'],                                        item: 'pencils' },
    { keywords: ['textile', 'towel', 'curtain', 'linen', 'bedding'], item: 'house textile' },
    { keywords: ['furniture', 'wood', 'wooden', 'stool', 'chair', 'table'], item: 'wooden furniture' },
];

function mapToItem(product) {
    const haystack = [
        product.product_name || '',
        product.packaging || '',
        product.categories || '',
        product.labels || '',
    ].join(' ').toLowerCase();

    for (const { keywords, item } of BARCODE_ITEM_MAP) {
        if (keywords.some(k => haystack.includes(k))) return item;
    }
    return null;
}

// ─── Product lookup ───────────────────────────────────────────────────────────
async function lookupBarcode(code) {
    // 1. Try Open Food Facts (covers most consumer barcodes)
    try {
        const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${code}.json`);
        const data = await res.json();
        if (data.status === 1 && data.product) return data.product;
    } catch (_) {}

    // 2. Try Open Library for ISBN barcodes (books)
    if (code.length === 13 && (code.startsWith('978') || code.startsWith('979'))) {
        try {
            const res = await fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${code}&format=json&jscmd=data`);
            const data = await res.json();
            const key = `ISBN:${code}`;
            if (data[key]) return { product_name: data[key].title, categories: 'book', packaging: '' };
        } catch (_) {}
    }

    return null;
}

// ─── Scanner UI ───────────────────────────────────────────────────────────────
function buildModal() {
    const modal = document.createElement('div');
    modal.id = 'scannerModal';
    modal.innerHTML = `
        <div class="scanner-box">
            <h3>📷 Scan Item Barcode</h3>
            <div class="scanner-viewport">
                <video id="scannerVideo" autoplay playsinline muted></video>
                <div class="scanner-line"></div>
            </div>
            <p id="scannerStatus">Point the camera at a barcode or QR code…</p>
            <button id="closeScannerBtn">✕ Close</button>
        </div>
    `;
    document.body.appendChild(modal);
    return modal;
}

// ─── Core scanner logic ───────────────────────────────────────────────────────
let activeStream = null;
let activeReader = null;

function stopScanner() {
    if (activeReader) { try { activeReader.reset(); } catch (_) {} activeReader = null; }
    if (activeStream) { activeStream.getTracks().forEach(t => t.stop()); activeStream = null; }
    const modal = document.getElementById('scannerModal');
    if (modal) modal.remove();
}

async function handleDetected(code) {
    const statusEl = document.getElementById('scannerStatus');
    if (statusEl) statusEl.textContent = `Barcode detected: ${code} — looking up product…`;

    const product = await lookupBarcode(code);
    let itemName = null;

    if (product) {
        itemName = mapToItem(product);
        // Also try matching the raw product name against itemDatabase keys
        if (!itemName && typeof itemDatabase !== 'undefined') {
            const pname = (product.product_name || '').toLowerCase();
            for (const key of Object.keys(itemDatabase)) {
                if (pname.includes(key)) { itemName = key; break; }
            }
        }
    }

    stopScanner();

    const searchInput = document.getElementById('searchInput');
    const searchForm  = document.getElementById('searchForm');

    if (itemName && typeof itemDatabase !== 'undefined' && itemDatabase[itemName]) {
        searchInput.value = itemName;
        searchForm.dispatchEvent(new Event('submit'));
    } else if (product && product.product_name) {
        searchInput.value = product.product_name;
        alert(`Found: "${product.product_name}"\nWe couldn't auto-match it — please refine your search.`);
    } else {
        alert(`Barcode "${code}" not found in our database.\nPlease search manually.`);
    }
}

async function startScanner() {
    if (document.getElementById('scannerModal')) return; // already open
    buildModal();

    const video    = document.getElementById('scannerVideo');
    const statusEl = document.getElementById('scannerStatus');
    document.getElementById('closeScannerBtn').addEventListener('click', stopScanner);

    // Request camera (prefer rear camera on mobile)
    try {
        activeStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { ideal: 'environment' } }
        });
        video.srcObject = activeStream;
    } catch (err) {
        statusEl.textContent = '⚠ Camera access denied. Please allow camera permissions and try again.';
        return;
    }

    // ── Use ZXing (works in all major browsers) ────────────────────────────
    if (typeof ZXing !== 'undefined') {
        try {
            const hints = new Map();
            const formats = [
                ZXing.BarcodeFormat.EAN_13,
                ZXing.BarcodeFormat.EAN_8,
                ZXing.BarcodeFormat.UPC_A,
                ZXing.BarcodeFormat.UPC_E,
                ZXing.BarcodeFormat.CODE_128,
                ZXing.BarcodeFormat.CODE_39,
                ZXing.BarcodeFormat.QR_CODE,
                ZXing.BarcodeFormat.DATA_MATRIX,
            ];
            hints.set(ZXing.DecodeHintType.POSSIBLE_FORMATS, formats);

            activeReader = new ZXing.BrowserMultiFormatReader(hints);
            activeReader.decodeFromStream(activeStream, video, (result, err) => {
                if (result) {
                    handleDetected(result.getText());
                }
            });
            statusEl.textContent = 'Point the camera at a barcode or QR code…';
            return;
        } catch (e) { /* fall through */ }
    }

    // ── Fallback: BarcodeDetector API (Chrome/Edge) ────────────────────────
    if ('BarcodeDetector' in window) {
        const detector = new BarcodeDetector({
            formats: ['ean_13','ean_8','upc_a','upc_e','code_128','code_39','qr_code']
        });
        let scanning = true;
        const tick = async () => {
            if (!scanning || !document.getElementById('scannerModal')) return;
            try {
                const results = await detector.detect(video);
                if (results.length > 0) {
                    scanning = false;
                    handleDetected(results[0].rawValue);
                    return;
                }
            } catch (_) {}
            requestAnimationFrame(tick);
        };
        await new Promise(r => video.addEventListener('loadeddata', r, { once: true }));
        tick();
        return;
    }

    statusEl.textContent = '⚠ Barcode scanning is not supported in this browser. Please use Chrome or Edge.';
}

// ─── Wire up button after DOM is ready ───────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    const scanBtn = document.getElementById('scanBtn');
    if (scanBtn) scanBtn.addEventListener('click', startScanner);
});
