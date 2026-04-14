// ─── scanner.js  ─────────────────────────────────────────────────────────────
//  Flow:  Open camera → Scan (AI or Barcode) → Confirm item → Pick category
// ─────────────────────────────────────────────────────────────────────────────

/* ══════════════════════ COCO-SSD class → item key ══════════════════════ */
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

/* ══════════════════════ MobileNet class → item key ══════════════════════ */
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
    { keys: ['newspaper','envelope','paper bag'],                                                                   item: 'paper'          }
];

/* ══════════════════════ Category keyword scoring ══════════════════════ */
// Used to find the 2 closest categories for ANY detected item/product text
const CATEGORY_KEYWORDS = {
    'plastic bottle':   ['plastic bottle','pet bottle','bottle','water','soda','cola','juice','smoothie','drink',
                         'beverage','squash','energy drink','fizzy','sparkling','mineral','pop','soft drink','lemonade'],
    'glass bottle':     ['glass bottle','glass jar','glass','wine','beer','spirits','whiskey','vodka','rum','gin',
                         'champagne','prosecco','cider','liqueur','ale','lager','stout','mead','sake'],
    'book':             ['book','novel','textbook','paperback','hardcover','magazine','comic','guide','manual',
                         'biography','encyclopedia','journal','publication','diary','literature','reading'],
    'laptop':           ['laptop','computer','tablet','smartphone','phone','mobile','electronic','device',
                         'keyboard','monitor','headphone','earphone','speaker','charger','cable','gadget',
                         'tech','digital','console','camera','printer','usb','wifi','bluetooth'],
    'batteries':        ['battery','batteries','alkaline','rechargeable','lithium','cell','aa','aaa','9v',
                         'button cell','coin cell','power cell'],
    'shirts':           ['shirt','blouse','polo','jersey','top','vest','tank','apparel','clothing','tee',
                         'fashion','garment','wear','dress','t-shirt','uniform'],
    'sweater':          ['sweater','jumper','pullover','cardigan','knitwear','sweatshirt','hoodie','fleece',
                         'knit','wool','woollen'],
    'shoes':            ['shoe','boot','sneaker','trainer','sandal','slipper','heel','loafer','footwear',
                         'oxford','pump','clog','moccasin','stiletto'],
    'house textile':    ['towel','curtain','bedding','duvet','pillow','blanket','sheet','linen','textile',
                         'fabric','rug','mat','quilt','cushion','throw'],
    'plastic box':      ['plastic container','plastic box','plastic tub','storage','food container',
                         'lunch box','tupperware','bin','tray','plastic pot','crate'],
    'cardboard box':    ['cardboard','carton','corrugated','kraft','packaging','shipping','box','parcel'],
    'paper':            ['paper','tissue','napkin','kitchen roll','toilet paper','newspaper','notepad',
                         'envelope','stationery','document','receipt','print','paper bag'],
    'wooden furniture': ['chair','table','desk','shelf','wardrobe','cabinet','furniture','wooden','stool',
                         'bookcase','drawer','bench','sofa','couch','dresser','wood','timber'],
    'pens':             ['pen','marker','highlighter','ballpoint','rollerball','felt tip','fineliner',
                         'gel pen','ink pen','biro','quill'],
    'pencils':          ['pencil','graphite','coloured pencil','crayon','charcoal pencil','drawing pencil']
};

const CATEGORY_ICONS = {
    'plastic bottle':   '🥤',
    'glass bottle':     '🍾',
    'book':             '📚',
    'laptop':           '💻',
    'batteries':        '🔋',
    'shirts':           '👕',
    'sweater':          '🧥',
    'shoes':            '👟',
    'house textile':    '🛏️',
    'plastic box':      '📦',
    'cardboard box':    '🗃️',
    'paper':            '📄',
    'wooden furniture': '🪑',
    'pens':             '🖊️',
    'pencils':          '✏️'
};

/* ══════════════════════ Top-N category matcher ══════════════════════ */
function getTopCategories(text, count = 2) {
    const lower = (text || '').toLowerCase();
    const scores = Object.entries(CATEGORY_KEYWORDS).map(([cat, keys]) => {
        let score = 0;
        for (const k of keys) {
            if (lower.includes(k)) {
                score += k.trim().split(/\s+/).length; // multi-word keys = higher weight
            }
        }
        return { cat, score };
    });
    scores.sort((a, b) => b.score - a.score);
    return scores.slice(0, count);
}

/* ══════════════════════ State ══════════════════════ */
let cocoModel    = null;
let mobileNet    = null;
let modelsLoaded = false;
let activeStream = null;
let loopTimer    = null;
let isDetecting  = false;
let scanPhase    = 'scanning'; // 'scanning' | 'confirm' | 'categories'

// AI mode
let hitCount     = 0;
let lastHitLabel = null;
let noCocoCount  = 0;
let canvasW      = 0;
let canvasH      = 0;

// Barcode mode
let barcodeMode      = false;
let zxingReader      = null;
let lastScannedCode  = null;
let barcodeSearching = false;

// Pending confirm data
let pendingLabel      = '';
let pendingSearchText = '';

/* ══════════════════════ Script loader ══════════════════════ */
function loadScript(src) {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
        const s = document.createElement('script');
        s.src = src; s.onload = resolve; s.onerror = reject;
        document.head.appendChild(s);
    });
}

/* ══════════════════════ Model loaders ══════════════════════ */
async function ensureModels() {
    if (modelsLoaded) return;
    await loadScript('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.21.0/dist/tf.min.js');
    await Promise.all([
        loadScript('https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd@2.2.3/dist/coco-ssd.min.js'),
        loadScript('https://cdn.jsdelivr.net/npm/@tensorflow-models/mobilenet@2.1.0/dist/mobilenet.min.js')
    ]);
    [cocoModel, mobileNet] = await Promise.all([cocoSsd.load(), mobilenet.load()]);
    modelsLoaded = true;
}

async function ensureZXing() {
    if (window.ZXing) return;
    await loadScript('https://unpkg.com/@zxing/library@0.20.0/umd/index.min.js');
}

/* ══════════════════════ AI helpers ══════════════════════ */
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
        if (!item && p.score < 0.55) continue;
        const [x, y, w, h] = p.bbox;
        const col = item ? 'rgba(80,255,120,0.92)' : 'rgba(255,200,70,0.8)';
        ctx.strokeStyle = col; ctx.lineWidth = 2.5;
        ctx.strokeRect(x * sx, y * sy, w * sx, h * sy);
        const lbl = item
            ? `${item}  ${Math.round(p.score * 100)}%`
            : `${p.class}  ${Math.round(p.score * 100)}%`;
        ctx.font = 'bold 12px sans-serif';
        const tw = ctx.measureText(lbl).width + 10;
        ctx.fillStyle = col;
        ctx.fillRect(x * sx, y * sy - 22, tw, 22);
        ctx.fillStyle = '#000';
        ctx.fillText(lbl, x * sx + 5, y * sy - 6);
    }
}

/* ══════════════════════ Modal HTML ══════════════════════ */
function buildModal() {
    if (document.getElementById('scannerModal')) return;
    const m = document.createElement('div');
    m.id = 'scannerModal';
    m.innerHTML = `
        <div class="scanner-box">
            <button class="scanner-close-btn" id="closeScannerBtn">✕ Close</button>

            <!-- ── VIEW 1: Live scan ── -->
            <div class="scanner-view" id="viewScanning">
                <h3>📷 Scan Item</h3>
                <div class="scanner-mode-tabs">
                    <button class="scanner-tab" id="tabAI"
                            onclick="switchScanMode('ai')">🤖 AI Vision</button>
                    <button class="scanner-tab scanner-tab-active" id="tabBarcode"
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
            </div>

            <!-- ── VIEW 2: Confirm detected item ── -->
            <div class="scanner-view" id="viewConfirm" style="display:none">
                <h3>Found it!</h3>
                <div class="detected-card">
                    <div class="detected-icon" id="detectedIcon">📦</div>
                    <div class="detected-name" id="detectedName">Item</div>
                    <div class="detected-sub"  id="detectedSub"></div>
                </div>
                <p class="confirm-question">Is this your item?</p>
                <div class="confirm-btns">
                    <button class="confirm-yes-btn" id="confirmYesBtn">✅ Yes, that's it!</button>
                    <button class="confirm-no-btn"  id="confirmNoBtn">🔄 Try again</button>
                </div>
            </div>

            <!-- ── VIEW 3: Category selection ── -->
            <div class="scanner-view" id="viewCategory" style="display:none">
                <h3>♻ Recycle as…</h3>
                <p class="category-prompt">Pick the best category for your item:</p>
                <div class="category-choices" id="categoryChoices"></div>
                <button class="scanner-back-btn" id="backToScanBtn">← Scan again</button>
            </div>
        </div>
    `;
    document.body.appendChild(m);

    document.getElementById('closeScannerBtn').addEventListener('click', stopScanner);
    document.getElementById('scannerModal').addEventListener('click', e => {
        if (e.target.id === 'scannerModal') stopScanner();
    });
    document.getElementById('confirmYesBtn').addEventListener('click', onConfirmYes);
    document.getElementById('confirmNoBtn').addEventListener('click',  onBackToScan);
    document.getElementById('backToScanBtn').addEventListener('click', onBackToScan);
}

/* ══════════════════════ View navigation ══════════════════════ */
function showView(id) {
    ['viewScanning', 'viewConfirm', 'viewCategory'].forEach(v => {
        const el = document.getElementById(v);
        if (el) el.style.display = (v === id) ? '' : 'none';
    });
}

/* ══════════════════════ Confirm view ══════════════════════ */
function showConfirmView(label, subLabel, searchText) {
    scanPhase         = 'confirm';
    pendingLabel      = label;
    pendingSearchText = searchText || label;

    // Stop any running loop
    if (loopTimer) { clearTimeout(loopTimer); loopTimer = null; }

    // Pick an icon using the top category
    const topCat  = getTopCategories(pendingSearchText, 1)[0];
    const icon    = (topCat && CATEGORY_ICONS[topCat.cat]) || '📦';

    document.getElementById('detectedIcon').textContent = icon;
    document.getElementById('detectedName').textContent = label;
    document.getElementById('detectedSub').textContent  = subLabel || '';

    showView('viewConfirm');
}

function onConfirmYes() {
    scanPhase = 'categories';

    const tops      = getTopCategories(pendingSearchText, 2);
    const choicesEl = document.getElementById('categoryChoices');
    choicesEl.innerHTML = '';

    // If nothing matched at all, widen to 4 choices
    const noMatch = tops.every(t => t.score === 0);
    const display = noMatch ? getTopCategories(pendingSearchText, 4) : tops;

    if (noMatch) {
        const note = document.createElement('p');
        note.className   = 'category-note';
        note.textContent = "We couldn't find an exact match — here are our best guesses:";
        choicesEl.appendChild(note);
    }

    display.forEach(({ cat }) => {
        const btn = document.createElement('button');
        btn.className = 'category-choice-btn';
        btn.innerHTML = `
            <span class="choice-icon">${CATEGORY_ICONS[cat] || '♻️'}</span>
            <span class="choice-name">${cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
        `;
        btn.addEventListener('click', () => navigateToItem(cat));
        choicesEl.appendChild(btn);
    });

    showView('viewCategory');
}

function onBackToScan() {
    scanPhase        = 'scanning';
    lastScannedCode  = null;
    barcodeSearching = false;
    hitCount         = 0;
    lastHitLabel     = null;
    noCocoCount      = 0;

    // Clear canvas
    const canvas = document.getElementById('scannerCanvas');
    if (canvas) canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

    const statusEl = document.getElementById('scannerStatus');
    if (statusEl) statusEl.textContent = barcodeMode
        ? '📊 Point camera at a barcode…'
        : 'Point camera at your item…';

    showView('viewScanning');

    // Restart the appropriate loop
    if (barcodeMode) {
        loopTimer = setTimeout(barcodeLoop, 400);
    } else {
        loopTimer = setTimeout(detectionLoop, 700);
    }
}

/* ══════════════════════ Navigate to item page ══════════════════════ */
function navigateToItem(name) {
    stopScanner();
    const inp  = document.getElementById('searchInput');
    const form = document.getElementById('searchForm');
    if (inp && form) { inp.value = name; form.dispatchEvent(new Event('submit')); }
}

/* ══════════════════════ Mode switching ══════════════════════ */
function switchScanMode(mode) {
    if ((mode === 'barcode') === barcodeMode) return; // no change

    document.getElementById('tabAI')?.classList.toggle('scanner-tab-active',      mode === 'ai');
    document.getElementById('tabBarcode')?.classList.toggle('scanner-tab-active', mode === 'barcode');

    if (loopTimer) { clearTimeout(loopTimer); loopTimer = null; }
    isDetecting      = false;
    hitCount         = 0;
    lastHitLabel     = null;
    noCocoCount      = 0;
    lastScannedCode  = null;
    barcodeSearching = false;

    const canvas = document.getElementById('scannerCanvas');
    if (canvas) canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

    const statusEl = document.getElementById('scannerStatus');

    if (mode === 'barcode') {
        barcodeMode = true;
        if (statusEl) statusEl.textContent = '📊 Point camera at a barcode…';
        startBarcodeLoop();
    } else {
        barcodeMode = false;
        if (statusEl) statusEl.textContent = '⏳ Loading AI models…';
        ensureModels()
            .then(() => {
                if (barcodeMode) return; // user switched back
                if (statusEl) statusEl.textContent = 'Point camera at your item…';
                loopTimer = setTimeout(detectionLoop, 700);
            })
            .catch(() => {
                if (statusEl) statusEl.textContent = '⚠ Could not load AI — check your connection.';
            });
    }
}

/* ══════════════════════ BARCODE MODE ══════════════════════ */
async function startBarcodeLoop() {
    if (!('BarcodeDetector' in window)) {
        try { await ensureZXing(); } catch (_) {}
    }
    barcodeLoop();
}

async function barcodeLoop() {
    if (!barcodeMode || !document.getElementById('scannerModal') || scanPhase !== 'scanning') return;

    const video = document.getElementById('scannerVideo');
    if (video && video.videoWidth > 0 && !isDetecting && !barcodeSearching) {
        isDetecting = true;
        const code  = await readBarcodeFromVideo(video);
        isDetecting = false;

        if (code && code !== lastScannedCode) {
            lastScannedCode  = code;
            barcodeSearching = true;
            await handleBarcodeResult(code);
            barcodeSearching = false;
        }
    }

    if (barcodeMode && document.getElementById('scannerModal') && scanPhase === 'scanning') {
        loopTimer = setTimeout(barcodeLoop, 500);
    }
}

async function readBarcodeFromVideo(video) {
    // Native BarcodeDetector (Chrome 83+, Edge, Android)
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

    // ZXing fallback (Firefox, Safari, iOS)
    if (window.ZXing) {
        try {
            if (!zxingReader) zxingReader = new ZXing.BrowserMultiFormatReader();
            const tmp = document.createElement('canvas');
            tmp.width  = video.videoWidth;
            tmp.height = video.videoHeight;
            tmp.getContext('2d').drawImage(video, 0, 0);
            const result = zxingReader.decodeFromCanvas(tmp);
            return result ? result.getText() : null;
        } catch (_) { return null; }
    }
    return null;
}

function fetchTimeout(url, ms = 5000) {
    const ctrl = new AbortController();
    const id   = setTimeout(() => ctrl.abort(), ms);
    return fetch(url, { signal: ctrl.signal }).finally(() => clearTimeout(id));
}

async function lookupBarcode(code) {
    // 1. Open Food Facts — great for food & drinks
    try {
        const r = await fetchTimeout(
            `https://world.openfoodfacts.org/api/v2/product/${code}?fields=product_name,categories,packaging`
        );
        const d = await r.json();
        if (d.status === 1 && d.product) {
            const p = d.product;
            return {
                name:       p.product_name || code,
                searchText: [p.product_name, p.categories, p.packaging].join(' ')
            };
        }
    } catch (_) {}

    // 2. UPCitemdb — great for retail (electronics, clothing, books…)
    try {
        const r = await fetchTimeout(
            `https://api.upcitemdb.com/prod/trial/lookup?upc=${code}`
        );
        const d = await r.json();
        if (d.code === 'OK' && d.items && d.items.length > 0) {
            const p = d.items[0];
            return {
                name:       p.title || code,
                searchText: [p.category, p.title, p.description].join(' ')
            };
        }
    } catch (_) {}

    // Fallback — barcode itself as search text
    return { name: `Barcode: ${code}`, searchText: code };
}

async function handleBarcodeResult(code) {
    const statusEl = document.getElementById('scannerStatus');
    if (!statusEl || scanPhase !== 'scanning') return;

    statusEl.textContent = '🔎 Reading barcode…';

    const found = await lookupBarcode(code);
    if (scanPhase !== 'scanning') return; // navigated away during lookup

    showConfirmView(
        found.name,
        found.name.startsWith('Barcode:') ? 'Unknown product' : `Barcode: ${code}`,
        found.searchText
    );
}

/* ══════════════════════ AI MODE ══════════════════════ */
async function detectionLoop() {
    if (!document.getElementById('scannerModal') || barcodeMode || scanPhase !== 'scanning') return;

    if (!isDetecting) {
        const video  = document.getElementById('scannerVideo');
        const canvas = document.getElementById('scannerCanvas');

        if (video && video.videoWidth > 0) {
            isDetecting = true;

            let mappedItem   = null; // resolved DB key
            let rawLabel     = null; // raw model label

            // ── COCO-SSD ──
            if (cocoModel) {
                try {
                    const preds = await cocoModel.detect(video);
                    if (canvas) drawBoxes(canvas, video, preds);
                    const best = preds
                        .filter(p => p.score > 0.42)
                        .sort((a, b) => b.score - a.score)[0];
                    if (best) {
                        rawLabel   = best.class;
                        mappedItem = resolveItem(best.class);
                        noCocoCount = 0;
                    } else {
                        noCocoCount++;
                    }
                } catch (_) {}
            }

            // ── MobileNet fallback ──
            if (!mappedItem && noCocoCount >= 2 && mobileNet) {
                noCocoCount = 0;
                try {
                    const mobilePreds = await mobileNet.classify(video, 10);
                    for (const p of mobilePreds) {
                        if (p.probability < 0.05) continue;
                        const item = resolveItem(p.className);
                        if (item) { mappedItem = item; rawLabel = p.className; break; }
                        if (!rawLabel) rawLabel = p.className; // capture even unmapped label
                    }
                } catch (_) {}
            }

            // ── Count consistent frames ──
            const currentLabel = mappedItem || rawLabel;
            if (currentLabel && currentLabel === lastHitLabel) {
                hitCount++;
            } else {
                lastHitLabel = currentLabel;
                hitCount     = currentLabel ? 1 : 0;
            }

            // ── After 2 consistent frames → show confirm ──
            if (hitCount >= 2 && currentLabel) {
                const display = mappedItem
                    ? mappedItem.charAt(0).toUpperCase() + mappedItem.slice(1)
                    : rawLabel.charAt(0).toUpperCase() + rawLabel.slice(1);

                showConfirmView(
                    display,
                    mappedItem
                        ? `Matched: ${mappedItem}`
                        : `Detected: ${rawLabel}`,
                    (mappedItem || '') + ' ' + (rawLabel || '')
                );
                isDetecting = false;
                return;
            }

            // ── Status feedback ──
            const statusEl = document.getElementById('scannerStatus');
            if (statusEl && scanPhase === 'scanning') {
                statusEl.textContent = currentLabel
                    ? `👀 Seeing: ${currentLabel}… hold still`
                    : 'Point camera at your item…';
            }

            isDetecting = false;
        }
    }

    if (!barcodeMode && document.getElementById('scannerModal') && scanPhase === 'scanning') {
        loopTimer = setTimeout(detectionLoop, 700);
    }
}

/* ══════════════════════ Stop scanner ══════════════════════ */
function stopScanner() {
    if (loopTimer)    { clearTimeout(loopTimer); loopTimer = null; }
    if (activeStream) { activeStream.getTracks().forEach(t => t.stop()); activeStream = null; }
    if (zxingReader)  { try { zxingReader.reset(); } catch (_) {} zxingReader = null; }
    isDetecting      = false;
    hitCount         = 0;
    lastHitLabel     = null;
    noCocoCount      = 0;
    canvasW          = 0;
    canvasH          = 0;
    barcodeMode      = false;
    lastScannedCode  = null;
    barcodeSearching = false;
    scanPhase        = 'scanning';
    const modal = document.getElementById('scannerModal');
    if (modal) modal.remove();
}

/* ══════════════════════ Open scanner ══════════════════════ */
async function startScanner() {
    if (document.getElementById('scannerModal')) return; // already open

    buildModal();

    const video    = document.getElementById('scannerVideo');
    const statusEl = document.getElementById('scannerStatus');

    // ── Request camera ──
    try {
        activeStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } }
        });
        video.srcObject = activeStream;
        await new Promise(r => {
            if (video.readyState >= 2) { r(); return; }
            video.addEventListener('loadeddata', r, { once: true });
        });
    } catch (_) {
        statusEl.textContent = '⚠ Camera access denied — please allow camera permissions and reload.';
        return;
    }

    // ── Default: barcode mode (instant start, no heavy model) ──
    barcodeMode = true;
    scanPhase   = 'scanning';
    statusEl.textContent = '📊 Point camera at a barcode…';

    // Pre-load ZXing for non-Chrome browsers silently
    if (!('BarcodeDetector' in window)) ensureZXing().catch(() => {});

    startBarcodeLoop();
}

/* ══════════════════════ Wire button on page load ══════════════════════ */
(function () {
    function attachBtn() {
        const btn = document.getElementById('scanBtn');
        if (btn) btn.addEventListener('click', startScanner);
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', attachBtn);
    } else {
        attachBtn();
    }
})();
