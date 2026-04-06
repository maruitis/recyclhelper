// ─── scanner.js – AI visual recognition, flicker-free & stable ───────────────

// ─── COCO-SSD (80 classes) → itemDatabase key ────────────────────────────────
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

// ─── MobileNet (1000 ImageNet classes) → itemDatabase key ────────────────────
const MOBILENET_MAP = [
    { keys: ['water bottle','pop bottle','pill bottle','medicine bottle','plastic bottle','canteen','carboy','jug','bucket'], item: 'plastic bottle' },
    { keys: ['wine bottle','beer bottle','whiskey jug','wine glass','beer glass','goblet','cocktail shaker'],               item: 'glass bottle'   },
    { keys: ['book jacket','book','library','comic book','binder','bookshelf','bookcase'],                                  item: 'book'           },
    { keys: ['running shoe','sandal','boot','loafer','clog','sneaker','moccasin','shoe','slipper'],                        item: 'shoes'          },
    { keys: ['t-shirt','jersey','polo shirt','suit','shirt','blouse','tank top','lab coat','military uniform'],            item: 'shirts'         },
    { keys: ['sweatshirt','cardigan','pullover','wool','sweater','jumper','knitwear'],                                     item: 'sweater'        },
    { keys: ['laptop','notebook computer','desktop computer','monitor','computer tablet','personal computer'],              item: 'laptop'         },
    { keys: ['electric battery','battery'],                                                                                item: 'batteries'      },
    { keys: ['ballpoint pen','fountain pen','quill','marker','felt pen'],                                                  item: 'pens'           },
    { keys: ['pencil box','pencil','crayon'],                                                                              item: 'pencils'        },
    { keys: ['carton','cardboard','corrugated','crate','packing box'],                                                     item: 'cardboard box'  },
    { keys: ['plastic bag','shopping bag','barrel','tub','plastic container'],                                             item: 'plastic box'    },
    { keys: ['desk','folding chair','rocking chair','cabinet','wardrobe','chest of drawers','stool','park bench','coffee table','cedar'], item: 'wooden furniture' },
    { keys: ['bath towel','beach towel','shower curtain','curtain','blanket','quilt','pillow','dishcloth','dishrag'],      item: 'house textile'  },
    { keys: ['newspaper','envelope','paper bag'],                                                                          item: 'paper'          },
];

// ─── State ────────────────────────────────────────────────────────────────────
let cocoModel    = null;
let mobileNet    = null;
let modelsLoaded = false;
let activeStream = null;
let loopTimer    = null;

// Bug fix #2: guard flag so detections never overlap
let isDetecting  = false;

// Bug fix #3: stability counter – same item must appear twice before showing
let hitCount     = 0;
let lastHitItem  = null;

// Bug fix #1: track canvas size separately so we only reset when it changes
let canvasW = 0;
let canvasH = 0;

// ─── Lazy-load TF.js + models on first use (cached by browser after that) ─────
function loadScript(src) {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
        const s = document.createElement('script');
        s.src = src;
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
    });
}

async function ensureModels() {
    if (modelsLoaded) return;
    // TF core must finish before model scripts start
    await loadScript('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.21.0/dist/tf.min.js');
    await Promise.all([
        loadScript('https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd@2.2.3/dist/coco-ssd.min.js'),
        loadScript('https://cdn.jsdelivr.net/npm/@tensorflow-models/mobilenet@2.1.0/dist/mobilenet.min.js'),
    ]);
    [cocoModel, mobileNet] = await Promise.all([cocoSsd.load(), mobilenet.load()]);
    modelsLoaded = true;
}

// ─── Map any label string to an itemDatabase key ──────────────────────────────
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

// ─── Build modal (only once) ──────────────────────────────────────────────────
function buildModal() {
    if (document.getElementById('scannerModal')) return;
    const m = document.createElement('div');
    m.id = 'scannerModal';
    m.innerHTML = `
        <div class="scanner-box">
            <h3>📷 AI Item Scanner</h3>
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

// ─── Draw bounding boxes ──────────────────────────────────────────────────────
// FIX #1: canvas.width/height are ONLY updated when the element actually
// changes size — NOT every frame. clearRect() clears without any reflow/flash.
function drawBoxes(canvas, video, preds) {
    const dw = canvas.offsetWidth  || 320;
    const dh = canvas.offsetHeight || 240;

    // Only reset the bitmap when dimensions genuinely change (avoids the flash)
    if (canvasW !== dw || canvasH !== dh) {
        canvas.width  = dw;
        canvas.height = dh;
        canvasW = dw;
        canvasH = dh;
    }

    const sx  = dw / (video.videoWidth  || dw);
    const sy  = dh / (video.videoHeight || dh);
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, dw, dh);   // ← no bitmap reset, no flash

    for (const p of preds) {
        const item = resolveItem(p.class);
        if (!item && p.score < 0.65) continue;   // skip unrelated low-conf objects

        const [x, y, w, h] = p.bbox;
        const col = item ? 'rgba(80,255,120,0.92)' : 'rgba(255,200,70,0.8)';

        ctx.strokeStyle = col;
        ctx.lineWidth   = 2.5;
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

// ─── Update UI after each detection batch ─────────────────────────────────────
// FIX #3: result only shows after same item detected TWICE in a row
function updateUI(preds) {
    const canvas     = document.getElementById('scannerCanvas');
    const video      = document.getElementById('scannerVideo');
    const statusEl   = document.getElementById('scannerStatus');
    const resultDiv  = document.getElementById('scannerResult');
    const resultText = document.getElementById('resultText');
    const identBtn   = document.getElementById('identifyBtn');
    if (!statusEl) return;

    if (canvas && video) drawBoxes(canvas, video, preds);

    // Best confident detection that maps to a known item
    const best = preds
        .filter(p => p.score > 0.42 && resolveItem(p.class))
        .sort((a, b) => b.score - a.score)[0];

    const detected = best ? resolveItem(best.class) : null;

    // Stability counter: only commit to a result after 2 consecutive hits
    if (detected && detected === lastHitItem) {
        hitCount++;
    } else {
        lastHitItem = detected;
        hitCount    = detected ? 1 : 0;
    }

    if (detected && hitCount >= 2) {
        // Stable detection → show result and arm the button
        statusEl.textContent          = `Detected: ${best.class}`;
        resultDiv.style.display       = 'flex';
        resultText.textContent        = detected;
        identBtn.textContent          = `➜ Go to: ${detected}`;
        identBtn.dataset.confirmed    = detected;
        identBtn.disabled             = false;
    } else if (!detected && hitCount === 0) {
        // Nothing seen for two consecutive frames → clear result
        statusEl.textContent    = 'Point camera at your item…';
        resultDiv.style.display = 'none';
        if (!identBtn.dataset.confirmed) {
            identBtn.textContent = '🔍 Scan Now';
        }
    }
    // (if hitCount===1 we do nothing — wait for the next frame to confirm)
}

// ─── Detection loop ───────────────────────────────────────────────────────────
// FIX #2: isDetecting guard ensures only ONE cocoModel.detect() runs at a time
async function detectionLoop() {
    if (!document.getElementById('scannerModal')) return;

    if (!isDetecting && cocoModel) {
        const video = document.getElementById('scannerVideo');
        if (video && video.videoWidth > 0) {
            isDetecting = true;
            try {
                const preds = await cocoModel.detect(video);
                updateUI(preds);
            } catch (_) { /* swallow transient errors */ }
            isDetecting = false;
        }
    }

    // Schedule next cycle only while modal is still open
    if (document.getElementById('scannerModal')) {
        loopTimer = setTimeout(detectionLoop, 600);
    }
}

// ─── "Scan Now" / "Go to item" button ────────────────────────────────────────
async function onIdentifyClick() {
    const identBtn = document.getElementById('identifyBtn');

    // COCO already locked on something → navigate right away
    if (identBtn.dataset.confirmed) {
        navigateToItem(identBtn.dataset.confirmed);
        return;
    }

    // Nothing locked → run MobileNet for a single deep classification pass
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
            if (item && p.probability > bestScore) {
                bestItem  = item;
                bestScore = p.probability;
            }
        }

        if (bestItem) {
            navigateToItem(bestItem);
        } else {
            statusEl.textContent = '⚠ Can\'t identify — move closer or improve lighting.';
            identBtn.disabled    = false;
        }
    } catch (_) {
        statusEl.textContent = '⚠ Error — please try again.';
        identBtn.disabled    = false;
    }
}

// ─── Navigate to identified item ──────────────────────────────────────────────
function navigateToItem(name) {
    stopScanner();
    const inp  = document.getElementById('searchInput');
    const form = document.getElementById('searchForm');
    if (inp && form) {
        inp.value = name;
        form.dispatchEvent(new Event('submit'));
    }
}

// ─── Stop everything cleanly ──────────────────────────────────────────────────
function stopScanner() {
    if (loopTimer)    { clearTimeout(loopTimer); loopTimer = null; }
    if (activeStream) { activeStream.getTracks().forEach(t => t.stop()); activeStream = null; }
    isDetecting = false;
    hitCount    = 0;
    lastHitItem = null;
    canvasW     = 0;
    canvasH     = 0;
    const modal = document.getElementById('scannerModal');
    if (modal) modal.remove();
}

// ─── Entry point ──────────────────────────────────────────────────────────────
async function startScanner() {
    buildModal();

    const video    = document.getElementById('scannerVideo');
    const statusEl = document.getElementById('scannerStatus');
    const identBtn = document.getElementById('identifyBtn');

    document.getElementById('closeScannerBtn').addEventListener('click', stopScanner);
    identBtn.addEventListener('click', onIdentifyClick);

    // 1. Start camera (prefer rear-facing on phones)
    try {
        activeStream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: { ideal: 'environment' },
                width:  { ideal: 1280 },
                height: { ideal: 720  },
            }
        });
        video.srcObject = activeStream;
        // Wait for video to be ready — check readyState first to avoid a missed event
        await new Promise(r => {
            if (video.readyState >= 2) { r(); return; }
            video.addEventListener('loadeddata', r, { once: true });
        });
    } catch (_) {
        statusEl.textContent = '⚠ Camera access denied — please allow permissions and try again.';
        return;
    }

    // 2. Load TF.js + AI models (downloaded once, then browser-cached)
    if (!modelsLoaded) {
        statusEl.textContent = '⏳ Loading AI models (first time only, ~5 s)…';
        try {
            await ensureModels();
        } catch (_) {
            statusEl.textContent = '⚠ Failed to load AI — check your internet connection.';
            return;
        }
    }

    // 3. Ready — start the detection loop
    statusEl.textContent = '✅ Point camera at your item.';
    identBtn.disabled    = false;
    hitCount    = 0;
    lastHitItem = null;
    detectionLoop();
}

// ─── Wire up the scan button ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('scanBtn');
    if (btn) btn.addEventListener('click', startScanner);
});
