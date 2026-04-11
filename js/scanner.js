// ─── scanner.js – AI visual recognition (COCO-SSD + MobileNet auto-fallback) ──
//
// Strategy:
//   • COCO-SSD runs every 700 ms  → fast detection of bottles, books, laptops, furniture
//   • After 2 consecutive COCO misses, MobileNet fires automatically → catches
//     shoes, shirts, sweaters, batteries, pens, pencils, textiles, boxes, etc.
//   • Same stability counter (hitCount ≥ 2) prevents flickering results.

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
// Keys are substrings of actual ImageNet class labels (case-insensitive match).
const MOBILENET_MAP = [
    // Plastic bottles
    { keys: ['water bottle','pop bottle','pill bottle','medicine bottle','plastic bottle','canteen','carboy','jug'], item: 'plastic bottle' },
    // Glass bottles / glassware
    { keys: ['wine bottle','beer bottle','whiskey jug','wine glass','beer glass','goblet','cocktail shaker'],       item: 'glass bottle'   },
    // Books
    { keys: ['book jacket','book','library','comic book','binder','bookshelf','bookcase'],                          item: 'book'           },
    // Shoes  – ImageNet: "running shoe", "sandal", "loafer", "clog", "moccasin", etc.
    { keys: ['running shoe','sandal','boot','loafer','clog','sneaker','moccasin','shoe','slipper','oxford'],        item: 'shoes'          },
    // Shirts – ImageNet: "jersey, T-shirt, tee shirt", "polo shirt", etc.
    { keys: ['jersey','t-shirt','tee shirt','polo shirt','suit','shirt','blouse','tank top','lab coat'],            item: 'shirts'         },
    // Sweaters – ImageNet: "sweatshirt", "cardigan", "wool"
    { keys: ['sweatshirt','cardigan','pullover','wool','sweater','jumper','knitwear'],                              item: 'sweater'        },
    // Laptops / electronics
    { keys: ['laptop','notebook computer','desktop computer','monitor','computer tablet','personal computer'],       item: 'laptop'         },
    // Batteries – ImageNet: "electric battery, voltaic battery, galvanic battery, galvanic pile, pile"
    { keys: ['electric battery','voltaic battery','galvanic battery','battery','galvanic pile'],                    item: 'batteries'      },
    // Pens – ImageNet: "ballpoint, ballpoint pen, ballpen, Biro", "fountain pen"
    { keys: ['ballpoint','ballpen','biro','fountain pen','quill','marker','felt pen'],                              item: 'pens'           },
    // Pencils – ImageNet: "pencil box, pencil case"
    { keys: ['pencil box','pencil case','pencil','crayon'],                                                         item: 'pencils'        },
    // Cardboard boxes – ImageNet: "carton, cardboard", "crate, packing box, packing case"
    { keys: ['carton','cardboard','crate','packing box','packing case','corrugated'],                               item: 'cardboard box'  },
    // Plastic boxes / containers – ImageNet: "plastic bag, polybag", "barrel", etc.
    { keys: ['plastic bag','polybag','shopping bag','barrel','tub','bucket','plastic container'],                   item: 'plastic box'    },
    // Wooden furniture
    { keys: ['desk','stool','rocking chair','folding chair','cabinet','wardrobe','chest of drawers','park bench','coffee table','cedar'], item: 'wooden furniture' },
    // House textiles – ImageNet: "bath towel", "beach towel", "shower curtain"
    { keys: ['bath towel','beach towel','shower curtain','curtain','blanket','quilt','pillow','dishcloth','dishrag'], item: 'house textile' },
    // Paper
    { keys: ['newspaper','envelope','paper bag'],                                                                   item: 'paper'          },
];

// ─── State ────────────────────────────────────────────────────────────────────
let cocoModel    = null;
let mobileNet    = null;
let modelsLoaded = false;
let activeStream = null;
let loopTimer    = null;
let isDetecting  = false;   // guard: only one detection at a time
let hitCount     = 0;       // stability counter
let lastHitItem  = null;
let noCocoCount  = 0;       // how many consecutive COCO-miss cycles
let canvasW      = 0;
let canvasH      = 0;

// ─── Lazy-load TF.js scripts on first use ────────────────────────────────────
function loadScript(src) {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
        const s = document.createElement('script');
        s.src = src; s.onload = resolve; s.onerror = reject;
        document.head.appendChild(s);
    });
}
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

// ─── Label → itemDatabase key ─────────────────────────────────────────────────
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

// ─── Build modal ──────────────────────────────────────────────────────────────
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

// ─── Draw COCO bounding boxes (flicker-free) ──────────────────────────────────
function drawBoxes(canvas, video, preds) {
    const dw = canvas.offsetWidth  || 320;
    const dh = canvas.offsetHeight || 240;
    if (canvasW !== dw || canvasH !== dh) {     // only reset bitmap when size changes
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
        const lbl = item ? `${item}  ${Math.round(p.score * 100)}%`
                         : `${p.class}  ${Math.round(p.score * 100)}%`;
        ctx.font = 'bold 12px sans-serif';
        const tw = ctx.measureText(lbl).width + 10;
        ctx.fillStyle = col;
        ctx.fillRect(x * sx, y * sy - 22, tw, 22);
        ctx.fillStyle = '#000';
        ctx.fillText(lbl, x * sx + 5, y * sy - 6);
    }
}

// ─── Update result UI (with stability debounce) ───────────────────────────────
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
        statusEl.textContent          = `✅ Detected: ${detectedItem}`;
        resultDiv.style.display       = 'flex';
        resultText.textContent        = detectedItem;
        identBtn.textContent          = `➜ Go to: ${detectedItem}`;
        identBtn.dataset.confirmed    = detectedItem;
        identBtn.disabled             = false;
    } else if (!detectedItem && hitCount === 0) {
        statusEl.textContent    = 'Point camera at your item…';
        resultDiv.style.display = 'none';
        if (!identBtn.dataset.confirmed) {
            identBtn.textContent = '🔍 Scan Now';
        }
    }
}

// ─── Main detection loop ──────────────────────────────────────────────────────
async function detectionLoop() {
    if (!document.getElementById('scannerModal')) return;

    if (!isDetecting) {
        const video  = document.getElementById('scannerVideo');
        const canvas = document.getElementById('scannerCanvas');

        if (video && video.videoWidth > 0) {
            isDetecting = true;
            let detectedItem = null;

            // ── Step 1: COCO-SSD (fast, 80 classes) ────────────────────────
            if (cocoModel) {
                try {
                    const cocoPreds = await cocoModel.detect(video);
                    if (canvas) drawBoxes(canvas, video, cocoPreds);

                    const best = cocoPreds
                        .filter(p => p.score > 0.42 && resolveItem(p.class))
                        .sort((a, b) => b.score - a.score)[0];

                    if (best) {
                        detectedItem = resolveItem(best.class);
                        noCocoCount  = 0;
                    } else {
                        noCocoCount++;
                    }
                } catch (_) {}
            }

            // ── Step 2: MobileNet auto-fallback after 2 COCO misses ─────────
            // This catches: shoes, shirts, sweaters, batteries, pens, pencils,
            // cardboard boxes, plastic boxes, house textiles, glass bottles, etc.
            if (!detectedItem && noCocoCount >= 2 && mobileNet) {
                noCocoCount = 0;
                try {
                    const mobilePreds = await mobileNet.classify(video, 10);
                    for (const p of mobilePreds) {
                        const item = resolveItem(p.className);
                        if (item && p.probability > 0.05) {
                            detectedItem = item;
                            break;
                        }
                    }
                } catch (_) {}
            }

            updateUI(detectedItem);
            isDetecting = false;
        }
    }

    if (document.getElementById('scannerModal')) {
        loopTimer = setTimeout(detectionLoop, 700);
    }
}

// ─── Manual "Scan Now" / "Go to item" button ─────────────────────────────────
async function onIdentifyClick() {
    const identBtn = document.getElementById('identifyBtn');

    // Already confirmed by COCO → navigate immediately
    if (identBtn.dataset.confirmed) {
        navigateToItem(identBtn.dataset.confirmed);
        return;
    }

    // No COCO result → force a MobileNet deep scan right now
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

function navigateToItem(name) {
    stopScanner();
    const inp  = document.getElementById('searchInput');
    const form = document.getElementById('searchForm');
    if (inp && form) { inp.value = name; form.dispatchEvent(new Event('submit')); }
}

function stopScanner() {
    if (loopTimer)    { clearTimeout(loopTimer); loopTimer = null; }
    if (activeStream) { activeStream.getTracks().forEach(t => t.stop()); activeStream = null; }
    isDetecting = false; hitCount = 0; lastHitItem = null;
    noCocoCount = 0; canvasW = 0; canvasH = 0;
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

    // 1. Camera
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
        statusEl.textContent = '⚠ Camera access denied — please allow permissions and try again.';
        return;
    }

    // 2. Load AI models (cached after first download)
    if (!modelsLoaded) {
        statusEl.textContent = '⏳ Loading AI models (first time only, ~5 s)…';
        try {
            await ensureModels();
        } catch (_) {
            statusEl.textContent = '⚠ Failed to load AI — check your internet connection.';
            return;
        }
    }

    // 3. Go
    statusEl.textContent = '✅ Point camera at your item.';
    identBtn.disabled    = false;
    hitCount = 0; lastHitItem = null; noCocoCount = 0;
    detectionLoop();
}

document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('scanBtn');
    if (btn) btn.addEventListener('click', startScanner);
});
