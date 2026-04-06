// ─── scanner.js – AI-powered visual item recognition ─────────────────────────
// Uses TensorFlow.js (COCO-SSD + MobileNet) loaded on demand.
// No barcode lookup – camera sees the item and the AI identifies it.

// ─── COCO-SSD detected object → itemDatabase key ─────────────────────────────
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
    'clock':         'laptop',
};

// ─── MobileNet class keywords → itemDatabase key ──────────────────────────────
// MobileNet returns ImageNet labels (1000 classes) – we match substrings.
const MOBILENET_MAP = [
    // Plastic bottles & containers
    {
        keys: ['water bottle', 'pop bottle', 'pill bottle', 'medicine bottle',
               'plastic bottle', 'canteen', 'carboy', 'jug', 'bucket'],
        item: 'plastic bottle'
    },
    // Glass bottles & glassware
    {
        keys: ['wine bottle', 'beer bottle', 'whiskey jug', 'wine glass',
               'beer glass', 'goblet', 'cocktail shaker'],
        item: 'glass bottle'
    },
    // Books
    {
        keys: ['book jacket', 'book', 'library', 'comic book', 'menu',
               'binder', 'bookshelf', 'bookcase'],
        item: 'book'
    },
    // Shoes
    {
        keys: ['running shoe', 'sandal', 'boot', 'loafer', 'clog',
               'sneaker', 'moccasin', 'shoe', 'slipper', 'oxford shoe'],
        item: 'shoes'
    },
    // Shirts
    {
        keys: ['t-shirt', 'jersey', 'polo shirt', 'suit', 'shirt',
               'blouse', 'tank top', 'lab coat', 'military uniform'],
        item: 'shirts'
    },
    // Sweaters
    {
        keys: ['sweatshirt', 'cardigan', 'pullover', 'wool', 'knitting',
               'sweater', 'jumper', 'knitwear'],
        item: 'sweater'
    },
    // Electronics / laptops
    {
        keys: ['laptop', 'notebook computer', 'desktop computer',
               'monitor', 'computer tablet', 'personal computer', 'screen'],
        item: 'laptop'
    },
    // Batteries
    {
        keys: ['electric battery', 'battery', 'flashlight'],
        item: 'batteries'
    },
    // Pens
    {
        keys: ['ballpoint pen', 'fountain pen', 'quill', 'marker',
               'felt pen', 'ballpen'],
        item: 'pens'
    },
    // Pencils
    {
        keys: ['pencil box', 'pencil', 'crayon'],
        item: 'pencils'
    },
    // Cardboard boxes
    {
        keys: ['carton', 'cardboard', 'corrugated', 'crate',
               'moving van', 'packing box'],
        item: 'cardboard box'
    },
    // Plastic boxes
    {
        keys: ['plastic bag', 'shopping bag', 'barrel', 'tub',
               'plastic container', 'storage box'],
        item: 'plastic box'
    },
    // Wooden furniture
    {
        keys: ['desk', 'table lamp', 'folding chair', 'rocking chair',
               'studio couch', 'cabinet', 'wardrobe', 'chest of drawers',
               'cedar', 'stool', 'rocking chair', 'park bench',
               'dining table', 'coffee table'],
        item: 'wooden furniture'
    },
    // House textiles
    {
        keys: ['bath towel', 'beach towel', 'shower curtain', 'curtain',
               'blanket', 'quilt', 'pillow', 'dishcloth', 'dishrag',
               'toilet tissue', 'paper towel'],
        item: 'house textile'
    },
    // Paper
    {
        keys: ['newspaper', 'envelope', 'paper bag', 'paper'],
        item: 'paper'
    },
];

// ─── State ────────────────────────────────────────────────────────────────────
let cocoModel      = null;
let mobileNetModel = null;
let modelsLoaded   = false;
let activeStream   = null;
let detectionTimer = null;

// ─── Lazy-load TensorFlow.js + models on first scan ──────────────────────────
function loadScript(src) {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
        const s  = document.createElement('script');
        s.src    = src;
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
    });
}

async function loadTF() {
    // TF.js core must finish before the model scripts run
    await loadScript('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.21.0/dist/tf.min.js');
    await Promise.all([
        loadScript('https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd@2.2.3/dist/coco-ssd.min.js'),
        loadScript('https://cdn.jsdelivr.net/npm/@tensorflow-models/mobilenet@2.1.0/dist/mobilenet.min.js'),
    ]);
}

// ─── Item-name resolver ───────────────────────────────────────────────────────
function resolveItem(rawLabel) {
    const cn = rawLabel.toLowerCase();

    // 1. Exact COCO match
    if (COCO_MAP[cn]) return COCO_MAP[cn];

    // 2. MobileNet keyword match (label contains keyword OR keyword contains label)
    for (const { keys, item } of MOBILENET_MAP) {
        for (const k of keys) {
            if (cn.includes(k) || k.includes(cn)) return item;
        }
    }
    return null;
}

// ─── Build scanner modal ──────────────────────────────────────────────────────
function buildModal() {
    if (document.getElementById('scannerModal')) return;
    const modal = document.createElement('div');
    modal.id = 'scannerModal';
    modal.innerHTML = `
        <div class="scanner-box">
            <h3>📷 AI Item Scanner</h3>
            <div class="scanner-viewport">
                <video id="scannerVideo" autoplay playsinline muted></video>
                <canvas id="scannerCanvas"></canvas>
                <div class="scanner-corners">
                    <span class="s-corner tl"></span>
                    <span class="s-corner tr"></span>
                    <span class="s-corner bl"></span>
                    <span class="s-corner br"></span>
                </div>
            </div>
            <p id="scannerStatus">Starting camera…</p>
            <div class="scanner-result" id="scannerResult">
                <span id="resultIcon">✅</span>
                <span id="resultText"></span>
            </div>
            <div class="scanner-actions">
                <button class="scanner-identify-btn" id="identifyBtn" disabled>🔍 Identify Item</button>
                <button class="scanner-close-btn"    id="closeScannerBtn">✕ Close</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// ─── Draw COCO bounding boxes on the canvas overlay ──────────────────────────
function drawBoxes(canvas, video, predictions) {
    // Match canvas display size (CSS pixels) to actual rendered size
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const scaleX = canvas.width  / (video.videoWidth  || 1);
    const scaleY = canvas.height / (video.videoHeight || 1);

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const pred of predictions) {
        const itemKey = resolveItem(pred.class);
        const [x, y, w, h] = pred.bbox;
        const color = itemKey ? 'rgba(80,255,120,0.9)' : 'rgba(255,200,70,0.75)';

        // Box
        ctx.strokeStyle = color;
        ctx.lineWidth   = 2.5;
        ctx.strokeRect(x * scaleX, y * scaleY, w * scaleX, h * scaleY);

        // Label background + text
        const label     = itemKey
            ? `${itemKey}  ${Math.round(pred.score * 100)}%`
            : `${pred.class}  ${Math.round(pred.score * 100)}%`;
        const textW     = ctx.measureText(label).width + 10;
        const labelY    = y * scaleY;

        ctx.fillStyle = color;
        ctx.fillRect(x * scaleX, labelY - 22, textW, 22);
        ctx.fillStyle = '#000';
        ctx.font      = 'bold 12px sans-serif';
        ctx.fillText(label, x * scaleX + 5, labelY - 6);
    }
}

// ─── Continuous COCO-SSD real-time detection (runs every ~450 ms) ─────────────
async function runRealtime() {
    const video       = document.getElementById('scannerVideo');
    const canvas      = document.getElementById('scannerCanvas');
    const statusEl    = document.getElementById('scannerStatus');
    const resultDiv   = document.getElementById('scannerResult');
    const resultText  = document.getElementById('resultText');
    const identifyBtn = document.getElementById('identifyBtn');

    if (!video || !cocoModel || !document.getElementById('scannerModal')) return;

    try {
        const preds = await cocoModel.detect(video);

        if (canvas) drawBoxes(canvas, video, preds);

        // Find highest-confidence detection that maps to a known item
        const best = preds
            .filter(p => p.score > 0.45 && resolveItem(p.class))
            .sort((a, b) => b.score - a.score)[0];

        if (best) {
            const itemName = resolveItem(best.class);
            statusEl.textContent           = `Detected: ${best.class}`;
            resultDiv.style.display        = 'flex';
            resultText.textContent         = itemName;
            identifyBtn.dataset.liveResult = itemName;
        } else {
            statusEl.textContent           = 'Point camera at your item…';
            resultDiv.style.display        = 'none';
            identifyBtn.dataset.liveResult = '';
        }
    } catch (_) { /* ignore transient errors */ }

    // Schedule next frame only if modal is still open
    if (document.getElementById('scannerModal')) {
        detectionTimer = setTimeout(runRealtime, 450);
    }
}

// ─── Deep MobileNet classification (runs on button click) ────────────────────
async function identifyItem() {
    const video       = document.getElementById('scannerVideo');
    const statusEl    = document.getElementById('scannerStatus');
    const resultDiv   = document.getElementById('scannerResult');
    const resultIcon  = document.getElementById('resultIcon');
    const resultText  = document.getElementById('resultText');
    const identifyBtn = document.getElementById('identifyBtn');

    // If we already have a confirmed result, navigate to it
    if (identifyBtn.dataset.confirmed) {
        navigateToItem(identifyBtn.dataset.confirmed);
        return;
    }

    identifyBtn.disabled = true;
    statusEl.textContent = '🤖 Deep-analyzing with AI…';

    try {
        // MobileNet returns top-N ImageNet predictions
        const preds = await mobileNetModel.classify(video, 12);

        let bestItem  = null;
        let bestScore = 0;
        let bestClass = '';

        for (const p of preds) {
            const item = resolveItem(p.className);
            if (item && p.probability > bestScore) {
                bestItem  = item;
                bestScore = p.probability;
                bestClass = p.className;
            }
        }

        // Fallback to whatever COCO already spotted in real time
        const liveResult = identifyBtn.dataset.liveResult || '';
        const finalItem  = bestItem || (liveResult || null);

        if (finalItem) {
            statusEl.textContent        = 'Found! Tap the button again to open the item.';
            resultIcon.textContent      = '✅';
            resultText.textContent      = finalItem;
            resultDiv.style.display     = 'flex';
            identifyBtn.textContent     = `➜ Go to: ${finalItem}`;
            identifyBtn.disabled        = false;
            identifyBtn.dataset.confirmed = finalItem;
        } else {
            statusEl.textContent = '⚠ Couldn\'t identify — try moving closer or better lighting.';
            resultDiv.style.display = 'none';
            identifyBtn.textContent = '🔍 Identify Item';
            identifyBtn.disabled    = false;
        }
    } catch (_) {
        statusEl.textContent    = '⚠ Recognition error — please try again.';
        identifyBtn.disabled    = false;
    }
}

// ─── Navigate: fill search input and submit ───────────────────────────────────
function navigateToItem(itemName) {
    stopScanner();
    const searchInput = document.getElementById('searchInput');
    const searchForm  = document.getElementById('searchForm');
    if (searchInput && searchForm) {
        searchInput.value = itemName;
        searchForm.dispatchEvent(new Event('submit'));
    }
}

// ─── Stop camera and remove modal ────────────────────────────────────────────
function stopScanner() {
    if (detectionTimer) { clearTimeout(detectionTimer); detectionTimer = null; }
    if (activeStream)   { activeStream.getTracks().forEach(t => t.stop()); activeStream = null; }
    const modal = document.getElementById('scannerModal');
    if (modal) modal.remove();
}

// ─── Open scanner ─────────────────────────────────────────────────────────────
async function startScanner() {
    buildModal();

    const video       = document.getElementById('scannerVideo');
    const statusEl    = document.getElementById('scannerStatus');
    const identifyBtn = document.getElementById('identifyBtn');
    const closeBtn    = document.getElementById('closeScannerBtn');

    closeBtn.addEventListener('click', stopScanner);
    identifyBtn.addEventListener('click', identifyItem);

    // ── 1. Start camera ───────────────────────────────────────────────────────
    try {
        activeStream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: { ideal: 'environment' },  // rear camera on phones
                width:  { ideal: 1280 },
                height: { ideal: 720  },
            }
        });
        video.srcObject = activeStream;
        await new Promise(resolve => { video.onloadeddata = resolve; });
    } catch (err) {
        statusEl.textContent = '⚠ Camera access denied. Please allow camera permissions and try again.';
        return;
    }

    // ── 2. Load AI models (scripts cached after first use) ────────────────────
    if (!modelsLoaded) {
        statusEl.textContent = '⏳ Loading AI models (first time only, ~5 s)…';
        try {
            await loadTF();
            [cocoModel, mobileNetModel] = await Promise.all([
                cocoSsd.load(),
                mobilenet.load(),
            ]);
            modelsLoaded = true;
        } catch (e) {
            statusEl.textContent = '⚠ Failed to load AI. Check your internet connection.';
            return;
        }
    }

    // ── 3. Start detection ────────────────────────────────────────────────────
    statusEl.textContent  = '✅ Ready! Point camera at your item.';
    identifyBtn.disabled  = false;
    runRealtime();
}

// ─── Wire up button ───────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('scanBtn');
    if (btn) btn.addEventListener('click', startScanner);
});
