// ─── scanner.js  (AI vision + Barcode scan, two modes) ───────────────────────
//
// AI mode   : COCO-SSD + MobileNet auto-fallback  (unchanged)
// Barcode   : BarcodeDetector API (Chrome/Android) → ZXing fallback (iOS/Safari)
//             → Open Food Facts API → UPCitemdb API → itemDatabase routing

// ─── COCO-SSD map ─────────────────────────────────────────────────────────────
const COCO_MAP = {
    'bottle':        'plastic bottle',
    'wine glass':    'glass bottle',
    'cup':           'glass bottle',
    'vase':          'glass bottle',
    'book':          'book',
    'laptop':        'laptop',
    'tv':            'laptop',
    'keyboard':      'laptop',
    'mouse':         'laptop',
    'cell phone':    'laptop',
    'remote':        'laptop',
    'chair':         'wooden furniture',
    'couch':         'wooden furniture',
    'dining table':  'wooden furniture',
    'bench':         'wooden furniture',
    'tie':           'shirts',
    'handbag':       'house textile',
    'umbrella':      'house textile',
    'suitcase':      'house textile',
    'backpack':      'house textile',
    'scissors':      'pens',
    'sports ball':   'plastic bottle',
    'frisbee':       'plastic bottle',
};

// ─── MobileNet map ────────────────────────────────────────────────────────────
const MOBILENET_MAP = [
    { keys: ['water bottle','pop bottle','pill bottle','medicine bottle','plastic bottle','canteen','carboy','jug'], item: 'plastic bottle' },
    { keys: ['wine bottle','beer bottle','whiskey jug','wine glass','beer glass','goblet','cocktail shaker'],       item: 'glass bottle'   },
    { keys: ['book jacket','book','library','comic book','binder','bookshelf','bookcase'],                          item: 'book'           },
    { keys: ['running shoe','sandal','boot','loafer','clog','sneaker','moccasin','shoe','slipper','oxford'],        item: 'shoes'          },
    { keys: ['jersey','t-shirt','tee shirt','polo shirt','suit','shirt','blouse','tank top','lab coat'],            item: 'shirts'         },
    { keys: ['sweatshirt','cardigan','pullover','wool','sweater','jumper','knitwear'],                              item: 'sweater'        },
    { keys: ['laptop','notebook computer','desktop computer','monitor','computer tablet','personal computer'],       item: 'laptop'         },
    { keys: ['electric battery','voltaic battery','galvanic battery','battery','galvanic pile'],                    item: 'batteries'      },
    { keys: ['ballpoint','ballpen','biro','fountain pen','quill','marker','felt pen'],                              item: 'pens'           },
    { keys: ['pencil box','pencil case','pencil','crayon'],                                                         item: 'pencils'        },
    { keys: ['carton','cardboard','crate','packing box','packing case','corrugated'],                               item: 'cardboard box'  },
    { keys: ['plastic bag','polybag','shopping bag','barrel','tub','bucket','plastic container'],                   item: 'plastic box'    },
    { keys: ['desk','stool','rocking chair','folding chair','cabinet','wardrobe','chest of drawers','park bench','coffee table','cedar'], item: 'wooden furniture' },
    { keys: ['bath towel','beach towel','shower curtain','curtain','blanket','quilt','pillow','dishcloth','dishrag'], item: 'house textile' },
    { keys: ['newspaper','envelope','paper bag'],                                                                   item: 'paper'          },
];

// ─── Barcode → itemDatabase category map ─────────────────────────────────────
// Matched against product name + category + description text from APIs
const BARCODE_ITEM_MAP = [
    { keys: ['water bottle','plastic bottle','pet bottle','water','soda','cola','lemonade','juice','smoothie','energy drink','sports drink','sparkling','mineral','soft drink','squash','fizzy'], item: 'plastic bottle' },
    { keys: ['wine','beer','spirits','whiskey','vodka','rum','gin','champagne','prosecco','cider','liqueur','mead','sake','ale','lager','stout'], item: 'glass bottle' },
    { keys: ['book','novel','textbook','paperback','hardcover','magazine','comic','guide','manual','biography','fiction','nonfiction','encyclopedia'], item: 'book' },
    { keys: ['pen','marker','highlighter','ballpoint','rollerball','felt tip','fineliner','gel pen','ink pen'], item: 'pens' },
    { keys: ['pencil','graphite pencil','coloured pencil','crayon','charcoal pencil'], item: 'pencils' },
    { keys: ['laptop','notebook computer','tablet','smartphone','phone','headphone','earphone','earbuds','speaker','keyboard','charger','cable','electronic','computer','monitor','camera'], item: 'laptop' },
    { keys: ['battery','batteries','alkaline','rechargeable','lithium cell','aaa battery','aa battery','9v battery','button cell'], item: 'batteries' },
    { keys: ['t-shirt','tee shirt','shirt','blouse','polo','jersey','top','vest','tank top','apparel','clothing'], item: 'shirts' },
    { keys: ['sweater','jumper','pullover','cardigan','knitwear','sweatshirt','hoodie','fleece'], item: 'sweater' },
    { keys: ['shoe','boot','sneaker','trainer','sandal','slipper','heel','loafer','oxford shoe','footwear'], item: 'shoes' },
    { keys: ['towel','curtain','bedding','duvet','pillow','blanket','sheet','linen','textile','fabric','rug','mat'], item: 'house textile' },
    { keys: ['storage box','plastic container','plastic tub','plastic storage','food container','lunch box'], item: 'plastic box' },
    { keys: ['cardboard','carton','corrugated box','kraft','paper box','shipping box'], item: 'cardboard box' },
    { keys: ['paper','tissue','napkin','kitchen roll','toilet paper','newspaper','notepad','stationery','envelope'], item: 'paper' },
    { keys: ['chair','table','desk','shelf','wardrobe','cabinet','furniture','wooden','stool','bookcase','drawer'], item: 'wooden furniture' },
];

function resolveFromBarcodeText(text) {
    const lower = (text || '').toLowerCase();
    for (const { keys, item } of BARCODE_ITEM_MAP) {
        for (const k of keys) {
            if (lower.includes(k)) return item;
        }
    }
    return null;
}

// ─── State ────────────────────────────────────────────────────────────────────
let cocoModel    = null;
let mobileNet    = null;
let modelsLoaded = false;
let activeStream = null;
let loopTimer    = null;
let isDetecting  = false;
let hitCount     = 0;
let lastHitItem  = null;
let noCocoCount  = 0;
let canvasW      = 0;
let canvasH      = 0;

// Barcode-mode state
let barcodeMode      = false;
let zxingReader      = null;
let lastScannedCode  = null;
let barcodeSearching = false;

// ─── Script loader ────────────────────────────────────────────────────────────
function loadScript(src) {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
        const s = document.createElement('script');
        s.src = src; s.onload = resolve; s.onerror = reject;
        document.head.appendChild(s);
    });
}

// ─── AI models loader ─────────────────────────────────────────────────────────
async function ensureModels() {
    if (modelsLoaded) return;
    await loadScript('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.21.0/dist/tf.min.js');
    await Promise.all([
        loadScript('https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd@2.2.3/dist/coco-ssd.min.js'),
        loadScript('https://cdn.jsdelivr.net/npm/@tensorflow-models/mobilenet@2.1.0/dist/mobilenet.min.js'),
    ]);
    [cocoModel, mobileNet] = await Promise.all([cocoSsd.load(), mobilenet.load()]);
    modelsLoaded = true;
}

// ─── ZXing loader (barcode fallback for non-Chrome) ─────────────────────────
async function ensureZXing() {
    if (window.ZXing) return;
    await loadScript('https://unpkg.com/@zxing/library@0.20.0/umd/index.min.js');
}

// ─── AI helpers ───────────────────────────────────────────────────────────────
function resolveItem(label) {
    const cn = label.toLowerCase();
    if (COCO_MAP[cn]) return COCO_MAP[cn];
    for (const { keys, item } of MOBILENET_MAP) {
        for (const k of keys) {
            if (cn.includes(k) || k.includes(cn)) return item;
        }
    }
    return null;
}

function drawBoxes(canvas, video, preds) {
    const dw = canvas.offsetWidth  || 320;
    const dh = canvas.offsetHeight || 240;
    if (canvasW !== dw || canvasH !== dh) {
        canvas.width = dw; canvas.height = dh;
        canvasW = dw; canvasH = dh;
    }
    const sx = dw / (video.videoWidth  || dw);
    const sy = dh / (video.videoHeight || dh);
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, dw, dh);
    for (const p of preds) {
        const item = resolveItem(p.class);
        if (!item && p.score < 0.65) continue;
        const [x, y, w, h] = p.bbox;
        const col = item ? 'rgba(80,255,120,0.92)' : 'rgba(255,200,70,0.8)';
        ctx.strokeStyle = col; ctx.lineWidth = 2.5;
        ctx.strokeRect(x * sx, y * sy, w * sx, h * sy);
        const lbl = item ? `${item}  ${Math.round(p.score * 100)}%` : `${p.class}  ${Math.round(p.score * 100)}%`;
        ctx.font = 'bold 12px sans-serif';
        const tw = ctx.measureText(lbl).width + 10;
        ctx.fillStyle = col;
        ctx.fillRect(x * sx, y * sy - 22, tw, 22);
        ctx.fillStyle = '#000';
        ctx.fillText(lbl, x * sx + 5, y * sy - 6);
    }
}

// ─── Build modal ──────────────────────────────────────────────────────────────
function buildModal() {
    if (document.getElementById('scannerModal')) return;
    const m = document.createElement('div');
    m.id = 'scannerModal';
    m.innerHTML = `
        <div class="scanner-box">
            <h3>📷 Scan Item</h3>

            <div class="scanner-mode-tabs">
                <button class="scanner-tab scanner-tab-active" id="tabAI"
                        onclick="switchScanMode('ai')">🤖 AI Vision</button>
                <button class="scanner-tab" id="tabBarcode"
                        onclick="switchScanMode('barcode')">📊 Barcode</button>
            </div>

            <div class="scanner-viewport">
                <video id="scannerVideo" autoplay playsinline muted></video>
                <canvas id="scannerCanvas"></canvas>
                <div class="scanner-corners">
                    <span class="s-corner tl"></span><span class="s-corner tr"></span>
                    <span class="s-corner bl"></span><span class="s-corner br"></span>
                </div>
            </div>

            <p id="scannerStatus">Starting camera…</p>

            <div class="scanner-result" id="scannerResult">
                <span id="resultIcon">✅</span>
                <span id="resultText"></span>
            </div>

            <div class="scanner-actions">
                <button class="scanner-identify-btn" id="identifyBtn" disabled>🔍 Scan Now</button>
                <button class="scanner-close-btn"    id="closeScannerBtn">✕ Close</button>
            </div>
        </div>
    `;
    document.body.appendChild(m);
}

// ─── Mode switching ───────────────────────────────────────────────────────────
function switchScanMode(mode) {
    if (mode === (barcodeMode ? 'barcode' : 'ai')) return; // no change

    // Update tab styles
    document.getElementById('tabAI')     ?.classList.toggle('scanner-tab-active', mode === 'ai');
    document.getElementById('tabBarcode')?.classList.toggle('scanner-tab-active', mode === 'barcode');

    // Clear current loop
    if (loopTimer) { clearTimeout(loopTimer); loopTimer = null; }
    isDetecting = false;

    // Reset result UI
    const canvas = document.getElementById('scannerCanvas');
    if (canvas) { const ctx = canvas.getContext('2d'); ctx.clearRect(0, 0, canvas.width, canvas.height); }
    lastScannedCode = null;
    barcodeSearching = false;
    hitCount = 0; lastHitItem = null; noCocoCount = 0;

    const statusEl = document.getElementById('scannerStatus');
    const resultDiv = document.getElementById('scannerResult');
    const identBtn  = document.getElementById('identifyBtn');
    if (resultDiv) resultDiv.style.display = 'none';
    if (identBtn)  { identBtn.disabled = true; identBtn.textContent = '🔍 Scan Now'; delete identBtn.dataset.confirmed; }

    if (mode === 'barcode') {
        barcodeMode = true;
        if (statusEl) statusEl.textContent = '📊 Point at a barcode or QR code…';
        startBarcodeLoop();
    } else {
        barcodeMode = false;
        if (statusEl) statusEl.textContent = 'Point camera at your item…';
        loopTimer = setTimeout(detectionLoop, 700);
    }
}

// ═══════════════════════════════════════════════════════════
//  BARCODE MODE
// ═══════════════════════════════════════════════════════════

async function startBarcodeLoop() {
    // Ensure ZXing is loaded for non-BarcodeDetector browsers
    if (!('BarcodeDetector' in window)) {
        try { await ensureZXing(); } catch (_) {}
    }
    barcodeLoop();
}

async function barcodeLoop() {
    if (!barcodeMode || !document.getElementById('scannerModal')) return;

    const video = document.getElementById('scannerVideo');
    if (video && video.videoWidth > 0 && !isDetecting && !barcodeSearching) {
        isDetecting = true;
        const code = await readBarcodeFromVideo(video);
        isDetecting = false;

        if (code && code !== lastScannedCode) {
            lastScannedCode  = code;
            barcodeSearching = true;
            await handleBarcodeResult(code);
            barcodeSearching = false;
        }
    }

    if (barcodeMode && document.getElementById('scannerModal')) {
        loopTimer = setTimeout(barcodeLoop, 500);
    }
}

// Read one barcode frame — tries native BarcodeDetector first, then ZXing
async function readBarcodeFromVideo(video) {
    // ── Native BarcodeDetector (Chrome 83+, Edge, Android WebView) ──────────
    if ('BarcodeDetector' in window) {
        try {
            const detector = new BarcodeDetector({
                formats: ['ean_13','ean_8','upc_a','upc_e','code_128',
                          'code_39','code_93','qr_code','data_matrix','itf','aztec']
            });
            const results = await detector.detect(video);
            if (results.length > 0) return results[0].rawValue;
        } catch (_) {}
        return null;
    }

    // ── ZXing snapshot fallback (Firefox, Safari, iOS) ──────────────────────
    if (window.ZXing) {
        try {
            if (!zxingReader) zxingReader = new ZXing.BrowserMultiFormatReader();
            // Snapshot the current video frame into a temp canvas
            const tmp = document.createElement('canvas');
            tmp.width  = video.videoWidth;
            tmp.height = video.videoHeight;
            tmp.getContext('2d').drawImage(video, 0, 0);
            const result = zxingReader.decodeFromCanvas(tmp);
            return result ? result.getText() : null;
        } catch (_) {
            return null; // ZXing throws when nothing found — that's normal
        }
    }

    return null;
}

// ─── Fetch with timeout helper ────────────────────────────────────────────────
function fetchTimeout(url, ms = 5000) {
    const ctrl = new AbortController();
    const id   = setTimeout(() => ctrl.abort(), ms);
    return fetch(url, { signal: ctrl.signal }).finally(() => clearTimeout(id));
}

// ─── Barcode → product info via APIs ─────────────────────────────────────────
async function lookupBarcode(code) {
    // 1️⃣  Open Food Facts (best for food & beverage barcodes)
    try {
        const r = await fetchTimeout(
            `https://world.openfoodfacts.org/api/v2/product/${code}?fields=product_name,categories,packaging`
        );
        const d = await r.json();
        if (d.status === 1 && d.product) {
            const p    = d.product;
            const text = [p.product_name, p.categories, p.packaging].join(' ');
            const item = resolveFromBarcodeText(text);
            if (item) return { item, name: p.product_name || code };
            // Generic beverage fallback
            const cat = (p.categories || '').toLowerCase();
            if (cat.includes('beverage') || cat.includes('drink') || cat.includes('water'))
                return { item: 'plastic bottle', name: p.product_name || code };
        }
    } catch (_) {}

    // 2️⃣  UPCitemdb (covers general retail — clothing, electronics, books, etc.)
    try {
        const r = await fetchTimeout(
            `https://api.upcitemdb.com/prod/trial/lookup?upc=${code}`
        );
        const d = await r.json();
        if (d.code === 'OK' && d.items && d.items.length > 0) {
            const p    = d.items[0];
            const text = [p.category, p.title, p.description].join(' ');
            const item = resolveFromBarcodeText(text);
            if (item) return { item, name: p.title || code };
        }
    } catch (_) {}

    return null; // neither API could identify it
}

// ─── Handle a confirmed barcode scan ─────────────────────────────────────────
async function handleBarcodeResult(code) {
    const statusEl  = document.getElementById('scannerStatus');
    const resultDiv = document.getElementById('scannerResult');
    const resultTxt = document.getElementById('resultText');
    const identBtn  = document.getElementById('identifyBtn');
    if (!statusEl) return;

    // Stop the loop while we look up
    if (loopTimer) { clearTimeout(loopTimer); loopTimer = null; }

    statusEl.textContent = `🔎 Reading barcode ${code}…`;

    const found = await lookupBarcode(code);

    if (found) {
        const displayName = (found.name && found.name !== code) ? found.name : code;
        statusEl.textContent       = `✅ "${displayName}" → ${found.item}`;
        resultDiv.style.display    = 'flex';
        resultTxt.textContent      = found.item;
        identBtn.textContent       = `➜ Go to: ${found.item}`;
        identBtn.dataset.confirmed = found.item;
        identBtn.disabled          = false;

        // Auto-navigate after 1.5 s so user can see the result
        setTimeout(() => navigateToItem(found.item), 1500);
    } else {
        statusEl.textContent = `⚠ Barcode not recognised — try again or switch to AI mode.`;
        // Reset so a new scan attempt can happen
        lastScannedCode  = null;
        barcodeSearching = false;
        // Restart loop
        if (barcodeMode) loopTimer = setTimeout(barcodeLoop, 800);
    }
}

// ═══════════════════════════════════════════════════════════
//  AI MODE  (unchanged logic)
// ═══════════════════════════════════════════════════════════

function updateUI(detectedItem) {
    const statusEl   = document.getElementById('scannerStatus');
    const resultDiv  = document.getElementById('scannerResult');
    const resultText = document.getElementById('resultText');
    const identBtn   = document.getElementById('identifyBtn');
    if (!statusEl) return;

    if (detectedItem && detectedItem === lastHitItem) {
        hitCount++;
    } else {
        lastHitItem = detectedItem;
        hitCount    = detectedItem ? 1 : 0;
    }

    if (detectedItem && hitCount >= 2) {
        statusEl.textContent       = `✅ Detected: ${detectedItem}`;
        resultDiv.style.display    = 'flex';
        resultText.textContent     = detectedItem;
        identBtn.textContent       = `➜ Go to: ${detectedItem}`;
        identBtn.dataset.confirmed = detectedItem;
        identBtn.disabled          = false;
    } else if (!detectedItem && hitCount === 0) {
        statusEl.textContent    = 'Point camera at your item…';
        resultDiv.style.display = 'none';
        if (!identBtn.dataset.confirmed) identBtn.textContent = '🔍 Scan Now';
    }
}

async function detectionLoop() {
    if (!document.getElementById('scannerModal') || barcodeMode) return;

    if (!isDetecting) {
        const video  = document.getElementById('scannerVideo');
        const canvas = document.getElementById('scannerCanvas');

        if (video && video.videoWidth > 0) {
            isDetecting = true;
            let detectedItem = null;

            if (cocoModel) {
                try {
                    const cocoPreds = await cocoModel.detect(video);
                    if (canvas) drawBoxes(canvas, video, cocoPreds);
                    const best = cocoPreds
                        .filter(p => p.score > 0.42 && resolveItem(p.class))
                        .sort((a, b) => b.score - a.score)[0];
                    if (best) { detectedItem = resolveItem(best.class); noCocoCount = 0; }
                    else noCocoCount++;
                } catch (_) {}
            }

            if (!detectedItem && noCocoCount >= 2 && mobileNet) {
                noCocoCount = 0;
                try {
                    const mobilePreds = await mobileNet.classify(video, 10);
                    for (const p of mobilePreds) {
                        const item = resolveItem(p.className);
                        if (item && p.probability > 0.05) { detectedItem = item; break; }
                    }
                } catch (_) {}
            }

            updateUI(detectedItem);
            isDetecting = false;
        }
    }

    if (!barcodeMode && document.getElementById('scannerModal')) {
        loopTimer = setTimeout(detectionLoop, 700);
    }
}

// ─── Manual "Scan Now" / "Go to item" button ─────────────────────────────────
async function onIdentifyClick() {
    const identBtn = document.getElementById('identifyBtn');

    if (identBtn.dataset.confirmed) {
        navigateToItem(identBtn.dataset.confirmed);
        return;
    }

    // AI mode manual deep scan
    if (!barcodeMode) {
        const video    = document.getElementById('scannerVideo');
        const statusEl = document.getElementById('scannerStatus');
        if (!video || !mobileNet) return;
        identBtn.disabled    = true;
        statusEl.textContent = '🤖 Deep scanning…';
        try {
            const preds = await mobileNet.classify(video, 12);
            let bestItem = null, bestScore = 0;
            for (const p of preds) {
                const item = resolveItem(p.className);
                if (item && p.probability > bestScore) { bestItem = item; bestScore = p.probability; }
            }
            if (bestItem) { navigateToItem(bestItem); }
            else { statusEl.textContent = '⚠ Can\'t identify — move closer or try better lighting.'; identBtn.disabled = false; }
        } catch (_) {
            statusEl.textContent = '⚠ Error — please try again.';
            identBtn.disabled = false;
        }
    }
}

function navigateToItem(name) {
    stopScanner();
    const inp  = document.getElementById('searchInput');
    const form = document.getElementById('searchForm');
    if (inp && form) { inp.value = name; form.dispatchEvent(new Event('submit')); }
}

function stopScanner() {
    if (loopTimer)    { clearTimeout(loopTimer); loopTimer = null; }
    if (activeStream) { activeStream.getTracks().forEach(t => t.stop()); activeStream = null; }
    if (zxingReader)  { try { zxingReader.reset(); } catch (_) {} zxingReader = null; }
    isDetecting = false; hitCount = 0; lastHitItem = null;
    noCocoCount = 0; canvasW = 0; canvasH = 0;
    barcodeMode = false; lastScannedCode = null; barcodeSearching = false;
    const modal = document.getElementById('scannerModal');
    if (modal) modal.remove();
}

async function startScanner() {
    buildModal();
    const video    = document.getElementById('scannerVideo');
    const statusEl = document.getElementById('scannerStatus');
    const identBtn = document.getElementById('identifyBtn');
    document.getElementById('closeScannerBtn').addEventListener('click', stopScanner);
    identBtn.addEventListener('click', onIdentifyClick);

    // Close modal when clicking outside the scanner box
    document.getElementById('scannerModal').addEventListener('click', function(e) {
        if (e.target === this) stopScanner();
    });

    // Start camera
    try {
        activeStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } }
        });
        video.srcObject = activeStream;
        await new Promise(r => {
            if (video.readyState >= 2) { r(); return; }
            video.addEventListener('loadeddata', r, { once: true });
        });
    } catch (err) {
        statusEl.textContent = '⚠ Camera access denied — please allow camera permissions and try again.';
        identBtn.disabled = true;
        return;
    }

    // Default to BARCODE mode — lightweight, no TF model needed
    barcodeMode = true;
    document.getElementById('tabBarcode')?.classList.add('scanner-tab-active');
    document.getElementById('tabAI')?.classList.remove('scanner-tab-active');
    identBtn.disabled = true;
    statusEl.textContent = '📊 Point camera at a barcode…';

    // Pre-load ZXing for non-Chrome browsers in background
    if (!('BarcodeDetector' in window)) {
        ensureZXing().catch(() => {});
    }

    startBarcodeLoop();
}

// ─── Wire up scan button(s) on page load ──────────────────────────────────────
(function () {
    function attachScanBtn() {
        const btn = document.getElementById('scanBtn');
        if (btn) {
            btn.addEventListener('click', startScanner);
        }
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', attachScanBtn);
    } else {
        attachScanBtn();
    }
})();
