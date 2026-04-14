// ─── scanner.js ──────────────────────────────────────────────────────────────
//  Flow: Open → Scan (AI or Barcode) → Confirm item → Pick category
// ─────────────────────────────────────────────────────────────────────────────

/* ════════════════ COCO-SSD → item key ════════════════ */
const COCO_MAP = {
    'bottle':       'plastic bottle',
    'wine glass':   'glass bottle',
    'cup':          'glass bottle',
    'vase':         'glass jar',
    'book':         'book',
    'laptop':       'laptop',
    'tv':           'laptop',
    'keyboard':     'laptop',
    'mouse':        'laptop',
    'cell phone':   'mobile phone',
    'remote':       'laptop',
    'chair':        'wooden furniture',
    'couch':        'wooden furniture',
    'dining table': 'wooden furniture',
    'bench':        'wooden furniture',
    'tie':          'shirts',
    'handbag':      'house textile',
    'umbrella':     'house textile',
    'suitcase':     'house textile',
    'backpack':     'house textile',
    'scissors':     'pens',
    'sports ball':  'plastic bottle',
    'frisbee':      'plastic bottle',
};

/* ════════════════ MobileNet → item key ════════════════ */
const MOBILENET_MAP = [
    { keys: ['water bottle','pop bottle','pill bottle','plastic bottle','canteen','jug'],          item: 'plastic bottle'   },
    { keys: ['wine bottle','beer bottle','whiskey jug','wine glass','beer glass','goblet'],         item: 'glass bottle'     },
    { keys: ['book jacket','book','library','comic book','binder','bookshelf'],                     item: 'book'             },
    { keys: ['running shoe','sandal','boot','loafer','sneaker','moccasin','shoe','slipper'],        item: 'shoes'            },
    { keys: ['jersey','t-shirt','tee shirt','polo shirt','suit','shirt','blouse','tank top'],       item: 'shirts'           },
    { keys: ['sweatshirt','cardigan','pullover','wool','sweater','jumper','knitwear'],              item: 'sweater'          },
    { keys: ['laptop','notebook computer','desktop computer','monitor','computer tablet'],           item: 'laptop'           },
    { keys: ['electric battery','voltaic battery','battery'],                                       item: 'batteries'        },
    { keys: ['ballpoint','ballpen','biro','fountain pen','marker','felt pen'],                      item: 'pens'             },
    { keys: ['pencil box','pencil case','pencil','crayon'],                                         item: 'pencils'          },
    { keys: ['carton','cardboard','crate','packing box','corrugated'],                              item: 'cardboard box'    },
    { keys: ['plastic bag','polybag','shopping bag','tub','bucket','plastic container'],            item: 'plastic box'      },
    { keys: ['desk','stool','chair','cabinet','wardrobe','chest of drawers','coffee table'],        item: 'wooden furniture' },
    { keys: ['bath towel','beach towel','curtain','blanket','quilt','pillow','dishcloth'],          item: 'house textile'    },
    { keys: ['newspaper','envelope','paper bag'],                                                   item: 'paper'            },
];

/* ════════════════ Category scoring (for ANY text input) ════════════════ */
const CATEGORY_KEYWORDS = {
    'plastic bottle':   ['plastic bottle','pet bottle','water bottle','soda bottle','cola bottle','juice bottle',
                         'squash bottle','energy drink bottle','sports drink','fizzy drink','sparkling water',
                         'mineral water','soft drink','smoothie bottle','milk bottle','plastic jug',
                         'bottle','water','soda','cola','juice','smoothie','beverage','squash','energy drink',
                         'fizzy','sparkling','mineral','pop','soft drink','drink','coca','pepsi','sprite','fanta'],
    'glass bottle':     ['glass bottle','wine bottle','beer bottle','spirits bottle','whiskey bottle',
                         'vodka bottle','rum bottle','gin bottle','champagne bottle','prosecco bottle',
                         'wine','beer','spirits','whiskey','vodka','rum','gin','champagne','prosecco',
                         'cider','ale','lager','stout','mead','sake','liquor','alcohol','brew'],
    'glass jar':        ['glass jar','mason jar','jam jar','honey jar','pickle jar','preserve jar',
                         'pasta sauce jar','coffee jar','nut butter jar','condiment jar','jam','honey',
                         'pickle','preserve','marmalade','peanut butter','nutella','sauce jar','compote',
                         'jar','glass pot','glass container','kilner'],
    'tin can':          ['tin can','aluminium can','aluminum can','steel can','food tin','soup can',
                         'baked beans can','sardine can','tuna can','paint tin','metal can','food can',
                         'beverage can','soda can','beer can','energy can','canned food','canned goods',
                         'tin','aluminium','aluminum','steel can','food tin','baked beans','canned',
                         'soup','sardine','tuna','can','metal container','aerosol','spray can'],
    'book':             ['book','novel','textbook','paperback','hardcover','hardback','magazine','comic',
                         'comic book','guide','manual','biography','encyclopedia','journal','publication',
                         'diary','notebook','fiction','non-fiction','children book','recipe book',
                         'travel guide','atlas','dictionary','thesaurus','anthology'],
    'newspaper':        ['newspaper','tabloid','broadsheet','daily paper','newsprint','gazette','herald',
                         'times','guardian','daily mail','news','press','journal','chronicle','tribune'],
    'paper':            ['paper','tissue','napkin','kitchen roll','toilet paper','notepad','envelope',
                         'stationery','document','receipt','paper bag','flyer','leaflet','brochure',
                         'poster','greeting card','wrapping paper','kraft paper','A4','printer paper'],
    'laptop':           ['laptop','notebook computer','computer','desktop','pc','monitor','keyboard','mouse',
                         'hard drive','headphone','earphone','speaker','charger','cable','console',
                         'camera','printer','scanner','tablet','ipad','macbook','chromebook','gaming pc',
                         'graphics card','cpu','motherboard','router','modem','usb','hub','dock'],
    'mobile phone':     ['mobile phone','smartphone','cell phone','handset','iphone','android','samsung',
                         'google pixel','huawei','xiaomi','nokia','motorola','oneplus','oppo',
                         'phone','mobile','cellular','flip phone','feature phone'],
    'light bulb':       ['light bulb','led bulb','cfl bulb','fluorescent bulb','incandescent bulb',
                         'halogen bulb','smart bulb','energy saving bulb','bulb','lamp','led','cfl',
                         'fluorescent','incandescent','halogen','tube light','spotlight','downlight'],
    'batteries':        ['battery','batteries','alkaline battery','rechargeable battery','lithium battery',
                         'aa battery','aaa battery','9v battery','button cell','coin cell','car battery',
                         'power bank','alkaline','rechargeable','lithium','aa','aaa','9v'],
    'shirts':           ['shirt','t-shirt','tee shirt','blouse','polo shirt','polo','jersey','top','vest',
                         'tank top','sleeveless','button-up','button-down','dress shirt','work shirt',
                         'casual shirt','flannel shirt','hawaiian shirt','linen shirt','clothing','tee',
                         'fashion','wear','apparel','garment'],
    'jeans':            ['jeans','denim','denim jeans','skinny jeans','slim jeans','wide leg jeans',
                         'bootcut jeans','straight jeans','dungarees','jean jacket','denim jacket',
                         'levis','wrangler','bootcut','mom jeans','boyfriend jeans','jeggings'],
    'sweater':          ['sweater','jumper','pullover','cardigan','knitwear','sweatshirt','hoodie',
                         'fleece','wool sweater','knit sweater','chunky knit','turtleneck','crewneck',
                         'zip-up hoodie','track top','wool','cashmere','merino'],
    'shoes':            ['shoe','shoes','boot','boots','sneaker','sneakers','trainer','trainers','sandal',
                         'slipper','slippers','high heel','loafer','oxford','brogue','moccasin',
                         'flip flop','espadrille','wedge','platform shoe','running shoe','footwear',
                         'footware','nike','adidas','puma','reebok','converse','vans'],
    'house textile':    ['towel','bath towel','curtain','bedding','duvet','pillow','pillowcase','blanket',
                         'sheet','bedsheet','linen','rug','quilt','throw','cushion cover','table cloth',
                         'tablecloth','dishcloth','tea towel','bath mat','floor mat','comforter'],
    'plastic box':      ['plastic container','plastic box','plastic tub','plastic bin','food container',
                         'lunch box','lunchbox','tupperware','storage container','food tub','yoghurt pot',
                         'margarine tub','ice cream tub','plastic storage','crate','plastic crate'],
    'cardboard box':    ['cardboard box','cardboard','carton','corrugated box','kraft box','shipping box',
                         'delivery box','parcel box','moving box','cereal box','packaging box','box',
                         'parcel','packing','cardboard tube','toilet roll tube','kitchen roll tube'],
    'wooden furniture': ['wooden furniture','wood furniture','chair','table','dining table','coffee table',
                         'side table','desk','shelf','shelving','wardrobe','cabinet','bookcase','sofa',
                         'couch','dresser','stool','bench','bed frame','headboard','nightstand',
                         'furniture','wooden','wood','timber','plywood','mdf','chipboard'],
    'pens':             ['pen','marker','highlighter','ballpoint pen','rollerball pen','felt tip','gel pen',
                         'biro','fountain pen','ink pen','sharpie','whiteboard marker','permanent marker'],
    'pencils':          ['pencil','graphite pencil','coloured pencil','colored pencil','color pencil',
                         'crayon','charcoal pencil','mechanical pencil','lead pencil','drawing pencil'],
};

/* ════════════════ Material hints (for anything not in DB) ════════════════ */
const MATERIAL_HINTS = {
    // Physical materials
    'glass':        ['glass bottle', 'glass jar', 'glass bottle'],
    'plastic':      ['plastic bottle', 'plastic box', 'plastic bottle'],
    'metal':        ['tin can', 'tin can', 'batteries'],
    'aluminium':    ['tin can', 'batteries'],
    'aluminum':     ['tin can', 'batteries'],
    'steel':        ['tin can', 'plastic box'],
    'iron':         ['tin can', 'wooden furniture'],
    'paper':        ['paper', 'cardboard box', 'newspaper'],
    'cardboard':    ['cardboard box', 'paper'],
    'fabric':       ['shirts', 'sweater', 'house textile'],
    'textile':      ['house textile', 'shirts', 'sweater'],
    'cloth':        ['shirts', 'sweater', 'jeans'],
    'clothing':     ['shirts', 'sweater', 'jeans'],
    'apparel':      ['shirts', 'sweater', 'jeans'],
    'leather':      ['shoes', 'jeans', 'shirts'],
    'denim':        ['jeans', 'shirts', 'sweater'],
    'wool':         ['sweater', 'house textile', 'shirts'],
    'wood':         ['wooden furniture'],
    'wooden':       ['wooden furniture'],
    'timber':       ['wooden furniture'],
    // Electronics
    'electronic':   ['laptop', 'mobile phone', 'batteries'],
    'electric':     ['batteries', 'light bulb', 'laptop'],
    'digital':      ['laptop', 'mobile phone', 'batteries'],
    // Common item words
    'bottle':       ['plastic bottle', 'glass bottle'],
    'can':          ['tin can', 'plastic bottle', 'glass bottle'],
    'tin':          ['tin can'],
    'jar':          ['glass jar', 'glass bottle'],
    'box':          ['cardboard box', 'plastic box'],
    'bag':          ['house textile', 'cardboard box'],
    'drink':        ['plastic bottle', 'glass bottle', 'tin can'],
    'beverage':     ['plastic bottle', 'glass bottle', 'tin can'],
    'food':         ['tin can', 'glass jar', 'plastic box'],
    'shoe':         ['shoes'],
    'boot':         ['shoes'],
    'sneaker':      ['shoes'],
    'footwear':     ['shoes'],
    'phone':        ['mobile phone', 'laptop'],
    'bulb':         ['light bulb'],
    'lamp':         ['light bulb', 'wooden furniture'],
    'battery':      ['batteries'],
    'furniture':    ['wooden furniture'],
    'book':         ['book', 'newspaper'],
    'pen':          ['pens', 'pencils'],
    'pencil':       ['pencils', 'pens'],
    'hoodie':       ['sweater', 'shirts', 'jeans'],
    'jacket':       ['sweater', 'shirts', 'jeans'],
    'coat':         ['sweater', 'house textile'],
    'dress':        ['shirts', 'house textile'],
    'skirt':        ['shirts', 'jeans'],
    'trousers':     ['jeans', 'shirts'],
    'pants':        ['jeans', 'shirts'],
    'vase':         ['glass jar', 'glass bottle', 'plastic bottle'],
    'mug':          ['glass jar', 'glass bottle'],
    'cup':          ['glass jar', 'plastic box'],
    'bowl':         ['plastic box', 'glass jar'],
    'plate':        ['glass jar', 'plastic box'],
};

const CATEGORY_ICONS = {
    'plastic bottle':   '🥤',
    'glass bottle':     '🍾',
    'glass jar':        '🫙',
    'tin can':          '🥫',
    'book':             '📚',
    'newspaper':        '📰',
    'paper':            '📄',
    'laptop':           '💻',
    'mobile phone':     '📱',
    'light bulb':       '💡',
    'batteries':        '🔋',
    'shirts':           '👕',
    'jeans':            '👖',
    'sweater':          '🧥',
    'shoes':            '👟',
    'house textile':    '🛏️',
    'plastic box':      '📦',
    'cardboard box':    '🗃️',
    'wooden furniture': '🪑',
    'pens':             '🖊️',
    'pencils':          '✏️',
};

function getTopCategories(text, count = 3) {
    const lower = (text || '').toLowerCase();

    // Base keyword scoring
    const scores = Object.entries(CATEGORY_KEYWORDS).map(([cat, keys]) => {
        let score = 0;
        for (const k of keys) {
            if (lower.includes(k)) {
                // Longer keyword phrases score higher (more specific match)
                score += k.trim().split(/\s+/).length * 3;
            }
        }
        return { cat, score };
    });

    // Boost using material hints — adds relevance for unknown items
    for (const [hint, cats] of Object.entries(MATERIAL_HINTS)) {
        if (lower.includes(hint)) {
            cats.forEach((cat, i) => {
                const entry = scores.find(s => s.cat === cat);
                if (entry) entry.score += Math.max(5 - i * 1.5, 1);
            });
        }
    }

    scores.sort((a, b) => b.score - a.score);
    // Always return exactly `count` unique categories
    return scores.slice(0, count);
}

/* ════════════════ STATE ════════════════ */
let scanPhase     = 'scanning';
let barcodeMode   = true;
let activeStream  = null;
let loopTimer     = null;
let isDetecting   = false;
let cocoModel     = null;
let mobileNet     = null;
let modelsLoaded  = false;
let modelsLoading = false;
let lastScannedCode  = null;
let pendingLabel      = '';
let pendingSearchText = '';
let hitCount     = 0;
let lastHitLabel = null;
let noCocoCount  = 0;

/* ════════════════ LOADERS ════════════════ */
function loadScript(src) {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
        const s = document.createElement('script');
        s.src = src; s.onload = resolve; s.onerror = reject;
        document.head.appendChild(s);
    });
}

async function ensureModels() {
    if (modelsLoaded || modelsLoading) return;
    modelsLoading = true;
    try {
        setStatus('⏳ Loading AI models…', 'info');
        await loadScript('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.21.0/dist/tf.min.js');
        await Promise.all([
            loadScript('https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd@2.2.3/dist/coco-ssd.min.js'),
            loadScript('https://cdn.jsdelivr.net/npm/@tensorflow-models/mobilenet@2.1.0/dist/mobilenet.min.js'),
        ]);
        [cocoModel, mobileNet] = await Promise.all([cocoSsd.load(), mobilenet.load()]);
        modelsLoaded = true;
    } catch (e) {
        setStatus('⚠ AI models failed to load — check your connection.', 'error');
        throw e;
    } finally {
        modelsLoading = false;
    }
}

async function ensureZXing() {
    if (window.ZXing) return;
    await loadScript('https://unpkg.com/@zxing/library@0.20.0/umd/index.min.js');
}

/* ════════════════ HELPERS ════════════════ */
function setStatus(msg, type = 'info') {
    const el = document.getElementById('scannerStatus');
    if (!el) return;
    el.textContent = msg;
    el.className = 'scanner-status scanner-status--' + type;
}

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
    if (canvas.width !== dw || canvas.height !== dh) {
        canvas.width = dw; canvas.height = dh;
    }
    const sx = dw / (video.videoWidth  || dw);
    const sy = dh / (video.videoHeight || dh);
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, dw, dh);
    for (const p of preds) {
        if (p.score < 0.45) continue;
        const [x, y, w, h] = p.bbox;
        const mapped = resolveItem(p.class);
        const col = mapped ? '#24E474' : 'rgba(255,200,70,0.9)';
        ctx.strokeStyle = col;
        ctx.lineWidth = 2.5;
        ctx.shadowColor = col;
        ctx.shadowBlur = 8;
        ctx.strokeRect(x*sx, y*sy, w*sx, h*sy);
        ctx.shadowBlur = 0;
        const lbl = `${mapped || p.class}  ${Math.round(p.score*100)}%`;
        ctx.font = 'bold 12px DM Sans, sans-serif';
        const tw = ctx.measureText(lbl).width + 10;
        ctx.fillStyle = col;
        ctx.fillRect(x*sx, y*sy - 22, tw, 22);
        ctx.fillStyle = '#000';
        ctx.fillText(lbl, x*sx + 5, y*sy - 6);
    }
}

function fetchTimeout(url, ms = 6000) {
    const ctrl = new AbortController();
    const id = setTimeout(() => ctrl.abort(), ms);
    return fetch(url, { signal: ctrl.signal }).finally(() => clearTimeout(id));
}

/* ════════════════ MODAL ════════════════ */
function buildModal() {
    if (document.getElementById('scannerModal')) return;
    const m = document.createElement('div');
    m.id = 'scannerModal';
    m.innerHTML = `
    <div class="scanner-box">

      <!-- ── VIEW 1: live scan ── -->
      <div class="scanner-view" id="viewScanning">
        <div class="scanner-header">
          <span class="scanner-title">📷 Scan Item</span>
          <button class="scanner-close-btn" id="closeScannerBtn">✕</button>
        </div>

        <div class="scanner-mode-tabs">
          <button class="scanner-tab" id="tabBarcode"
                  onclick="switchScanMode('barcode')">📊 Barcode</button>
          <button class="scanner-tab" id="tabAI"
                  onclick="switchScanMode('ai')">🤖 AI Vision</button>
        </div>

        <div class="scanner-viewport">
          <video id="scannerVideo" autoplay playsinline muted></video>
          <canvas id="scannerCanvas"></canvas>
          <div class="scan-anim"><div class="scan-line"></div></div>
          <div class="scanner-corners">
            <span class="s-corner tl"></span><span class="s-corner tr"></span>
            <span class="s-corner bl"></span><span class="s-corner br"></span>
          </div>
        </div>

        <p class="scanner-status scanner-status--info" id="scannerStatus">Starting camera…</p>
      </div>

      <!-- ── VIEW 2: confirm ── -->
      <div class="scanner-view" id="viewConfirm" style="display:none">
        <div class="scanner-header">
          <span class="scanner-title">✅ Found it!</span>
          <button class="scanner-close-btn" id="closeScannerBtn2">✕</button>
        </div>
        <div class="detected-card">
          <div class="detected-icon" id="detectedIcon">📦</div>
          <div class="detected-name" id="detectedName">Item</div>
          <div class="detected-sub"  id="detectedSub"></div>
        </div>
        <p class="confirm-question">Is this your item?</p>
        <div class="confirm-btns">
          <button class="confirm-yes-btn" id="confirmYesBtn">✅ Yes!</button>
          <button class="confirm-no-btn"  id="confirmNoBtn">🔄 Try again</button>
        </div>
      </div>

      <!-- ── VIEW 3: category pick ── -->
      <div class="scanner-view" id="viewCategory" style="display:none">
        <div class="scanner-header">
          <span class="scanner-title">♻ Recycle as…</span>
          <button class="scanner-close-btn" id="closeScannerBtn3">✕</button>
        </div>
        <p class="category-prompt">Pick the best match:</p>
        <div class="category-choices" id="categoryChoices"></div>
        <button class="scanner-back-btn" id="backToScanBtn">← Scan again</button>
      </div>

    </div>`;
    document.body.appendChild(m);

    // Wire close buttons
    ['closeScannerBtn','closeScannerBtn2','closeScannerBtn3'].forEach(id => {
        document.getElementById(id)?.addEventListener('click', stopScanner);
    });
    // Close on backdrop click
    m.addEventListener('click', e => { if (e.target === m) stopScanner(); });
    // Confirm / back
    document.getElementById('confirmYesBtn').addEventListener('click', onConfirmYes);
    document.getElementById('confirmNoBtn').addEventListener('click',  onBackToScan);
    document.getElementById('backToScanBtn').addEventListener('click', onBackToScan);
}

/* ════════════════ VIEW NAVIGATION ════════════════ */
function showView(id) {
    ['viewScanning','viewConfirm','viewCategory'].forEach(v => {
        const el = document.getElementById(v);
        if (el) el.style.display = (v === id) ? 'flex' : 'none';
    });
}

/* ════════════════ CONFIRM VIEW ════════════════ */
function showConfirmView(label, subLabel, searchText) {
    scanPhase         = 'confirm';
    pendingLabel      = label;
    pendingSearchText = searchText || label;

    if (loopTimer) { clearTimeout(loopTimer); loopTimer = null; }

    const top  = getTopCategories(pendingSearchText, 1)[0];
    const icon = (top && CATEGORY_ICONS[top.cat]) || '📦';

    document.getElementById('detectedIcon').textContent = icon;
    document.getElementById('detectedName').textContent = label;
    document.getElementById('detectedSub').textContent  = subLabel || '';

    showView('viewConfirm');
}

function onConfirmYes() {
    scanPhase = 'categories';
    const tops      = getTopCategories(pendingSearchText, 3);
    const choicesEl = document.getElementById('categoryChoices');
    choicesEl.innerHTML = '';

    tops.forEach(({ cat }) => {
        const btn = document.createElement('button');
        btn.className = 'category-choice-btn';
        btn.innerHTML = `
            <span class="choice-icon">${CATEGORY_ICONS[cat] || '♻️'}</span>
            <span class="choice-name">${cat.charAt(0).toUpperCase() + cat.slice(1)}</span>`;
        btn.addEventListener('click', () => navigateToItem(cat));
        choicesEl.appendChild(btn);
    });

    showView('viewCategory');
}

function onBackToScan() {
    scanPhase        = 'scanning';
    lastScannedCode  = null;
    hitCount         = 0;
    lastHitLabel     = null;
    noCocoCount      = 0;

    const canvas = document.getElementById('scannerCanvas');
    if (canvas) canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

    setStatus(barcodeMode ? '📊 Point camera at a barcode…' : 'Point camera at your item…', 'info');
    showView('viewScanning');

    if (barcodeMode) loopTimer = setTimeout(barcodeLoop, 300);
    else             loopTimer = setTimeout(detectionLoop, 700);
}

/* ════════════════ NAVIGATE ════════════════ */
function navigateToItem(name) {
    stopScanner();
    const inp  = document.getElementById('searchInput');
    const form = document.getElementById('searchForm');
    if (inp && form) { inp.value = name; form.dispatchEvent(new Event('submit')); }
}

/* ════════════════ MODE SWITCH ════════════════ */
function switchScanMode(mode) {
    const wantBarcode = (mode === 'barcode');
    if (wantBarcode === barcodeMode && scanPhase === 'scanning') return;

    document.getElementById('tabBarcode')?.classList.toggle('scanner-tab-active', wantBarcode);
    document.getElementById('tabAI')?.classList.toggle('scanner-tab-active', !wantBarcode);

    if (loopTimer) { clearTimeout(loopTimer); loopTimer = null; }
    isDetecting = false; hitCount = 0; lastHitLabel = null; noCocoCount = 0;
    lastScannedCode = null;
    scanPhase = 'scanning';

    const canvas = document.getElementById('scannerCanvas');
    if (canvas) canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

    showView('viewScanning');

    if (wantBarcode) {
        barcodeMode = true;
        setStatus('📊 Point camera at a barcode…', 'info');
        startBarcodeLoop();
    } else {
        barcodeMode = false;
        ensureModels()
            .then(() => {
                if (barcodeMode) return;
                setStatus('Point camera at your item…', 'info');
                loopTimer = setTimeout(detectionLoop, 700);
            })
            .catch(() => setStatus('⚠ Could not load AI models.', 'error'));
    }
}

/* ════════════════ BARCODE MODE ════════════════ */
async function startBarcodeLoop() {
    if (!('BarcodeDetector' in window)) {
        setStatus('⏳ Loading barcode reader…', 'info');
        try { await ensureZXing(); } catch (_) {}
    }
    if (barcodeMode) barcodeLoop();
}

async function barcodeLoop() {
    if (!barcodeMode || !document.getElementById('scannerModal') || scanPhase !== 'scanning') return;

    const video = document.getElementById('scannerVideo');
    if (video && video.readyState >= 2 && video.videoWidth > 0 && !isDetecting) {
        isDetecting = true;
        try {
            const code = await readBarcodeFromVideo(video);
            if (code && code !== lastScannedCode) {
                lastScannedCode = code;
                await handleBarcodeResult(code);
                isDetecting = false;
                return; // stop loop — waiting for user to confirm
            }
        } catch (_) {}
        isDetecting = false;
    }

    if (barcodeMode && document.getElementById('scannerModal') && scanPhase === 'scanning') {
        loopTimer = setTimeout(barcodeLoop, 400);
    }
}

async function readBarcodeFromVideo(video) {
    // ── Native BarcodeDetector (Chrome, Edge, Android) ──────────────────────
    if ('BarcodeDetector' in window) {
        try {
            if (!window.__barcodeDetector) {
                window.__barcodeDetector = new BarcodeDetector({
                    formats: ['ean_13','ean_8','upc_a','upc_e','code_128','code_39','code_93','qr_code','data_matrix','itf']
                });
            }
            const results = await window.__barcodeDetector.detect(video);
            if (results && results.length > 0) return results[0].rawValue;
        } catch (e) { /* not found or API error */ }
        return null;
    }

    // ── ZXing fallback (Firefox, Safari, iOS) ────────────────────────────────
    if (window.ZXing) {
        try {
            const canvas = document.createElement('canvas');
            canvas.width  = video.videoWidth  || 640;
            canvas.height = video.videoHeight || 480;
            canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

            // Try the high-level reader first
            const reader = new ZXing.BrowserMultiFormatReader();
            const result = reader.decodeFromCanvas(canvas);
            return result ? result.getText() : null;
        } catch (_) { return null; }
    }

    return null;
}

async function lookupBarcode(code) {
    // 1. Open Food Facts — best for food & drink
    try {
        const r = await fetchTimeout(
            `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(code)}?fields=product_name,categories,packaging`
        );
        if (r.ok) {
            const d = await r.json();
            if (d.status === 1 && d.product) {
                const p = d.product;
                return {
                    name:       p.product_name || code,
                    searchText: [p.product_name, p.categories, p.packaging].filter(Boolean).join(' ')
                };
            }
        }
    } catch (_) {}

    // 2. UPCitemdb — covers electronics, clothing, books …
    try {
        const r = await fetchTimeout(
            `https://api.upcitemdb.com/prod/trial/lookup?upc=${encodeURIComponent(code)}`
        );
        if (r.ok) {
            const d = await r.json();
            if (d.code === 'OK' && d.items && d.items.length > 0) {
                const p = d.items[0];
                return {
                    name:       p.title || code,
                    searchText: [p.category, p.title, p.description].filter(Boolean).join(' ')
                };
            }
        }
    } catch (_) {}

    // Fallback: just use the raw barcode
    return { name: code, searchText: '' };
}

async function handleBarcodeResult(code) {
    if (scanPhase !== 'scanning') return;
    setStatus(`🔎 Barcode found: ${code} — looking up…`, 'info');

    const found = await lookupBarcode(code);
    if (scanPhase !== 'scanning') return;

    const isUnknown = found.name === code && !found.searchText;
    showConfirmView(
        isUnknown ? `Barcode: ${code}` : found.name,
        isUnknown ? 'Product not found in database' : `Code: ${code}`,
        found.searchText || found.name
    );
}

/* ════════════════ AI MODE ════════════════ */
async function detectionLoop() {
    if (!document.getElementById('scannerModal') || barcodeMode || scanPhase !== 'scanning') return;

    if (!isDetecting) {
        const video  = document.getElementById('scannerVideo');
        const canvas = document.getElementById('scannerCanvas');

        if (video && video.readyState >= 2 && video.videoWidth > 0) {
            isDetecting = true;
            let mappedItem = null;
            let rawLabel   = null;

            // COCO-SSD
            if (cocoModel) {
                try {
                    const preds = await cocoModel.detect(video);
                    if (canvas) drawBoxes(canvas, video, preds);
                    const best = preds.filter(p => p.score > 0.42).sort((a, b) => b.score - a.score)[0];
                    if (best) {
                        rawLabel   = best.class;
                        mappedItem = resolveItem(best.class);
                        noCocoCount = 0;
                    } else {
                        noCocoCount++;
                    }
                } catch (_) {}
            }

            // MobileNet fallback
            if (!mappedItem && noCocoCount >= 2 && mobileNet) {
                noCocoCount = 0;
                try {
                    const preds = await mobileNet.classify(video, 10);
                    for (const p of preds) {
                        if (p.probability < 0.05) continue;
                        const item = resolveItem(p.className);
                        if (item) { mappedItem = item; rawLabel = p.className; break; }
                        if (!rawLabel) rawLabel = p.className;
                    }
                } catch (_) {}
            }

            const currentLabel = mappedItem || rawLabel;
            if (currentLabel === lastHitLabel) {
                hitCount++;
            } else {
                lastHitLabel = currentLabel;
                hitCount = currentLabel ? 1 : 0;
            }

            // After 2 consistent frames → show confirm
            if (hitCount >= 2 && currentLabel) {
                const display = (mappedItem || rawLabel);
                const displayCap = display.charAt(0).toUpperCase() + display.slice(1);
                showConfirmView(
                    displayCap,
                    mappedItem ? `Category: ${mappedItem}` : `Detected: ${rawLabel}`,
                    (mappedItem || '') + ' ' + (rawLabel || '')
                );
                isDetecting = false;
                return;
            }

            setStatus(currentLabel ? `👀 Seeing: ${currentLabel}… hold still` : 'Point camera at your item…', 'info');
            isDetecting = false;
        }
    }

    if (!barcodeMode && document.getElementById('scannerModal') && scanPhase === 'scanning') {
        loopTimer = setTimeout(detectionLoop, 700);
    }
}

/* ════════════════ STOP / START ════════════════ */
function stopScanner() {
    if (loopTimer) { clearTimeout(loopTimer); loopTimer = null; }
    if (activeStream) { activeStream.getTracks().forEach(t => t.stop()); activeStream = null; }
    delete window.__barcodeDetector;
    isDetecting = false; hitCount = 0; lastHitLabel = null; noCocoCount = 0;
    barcodeMode = true; lastScannedCode = null; scanPhase = 'scanning';
    const modal = document.getElementById('scannerModal');
    if (modal) modal.remove();
}

async function startScanner() {
    if (document.getElementById('scannerModal')) return;
    buildModal();

    // Reset state
    scanPhase = 'scanning'; barcodeMode = true;
    hitCount = 0; lastHitLabel = null; noCocoCount = 0; lastScannedCode = null;

    const video = document.getElementById('scannerVideo');
    setStatus('📷 Starting camera…', 'info');

    // Mark barcode tab active by default
    document.getElementById('tabBarcode')?.classList.add('scanner-tab-active');
    document.getElementById('tabAI')?.classList.remove('scanner-tab-active');

    // Request camera
    try {
        activeStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } }
        });
        video.srcObject = activeStream;
        await new Promise(r => {
            video.addEventListener('loadeddata', r, { once: true });
            setTimeout(r, 3000); // fallback timeout
        });
    } catch (_) {
        setStatus('⚠ Camera access denied — allow camera and try again.', 'error');
        return;
    }

    setStatus('📊 Point camera at a barcode…', 'info');

    // Preload ZXing silently if BarcodeDetector unavailable
    if (!('BarcodeDetector' in window)) ensureZXing().catch(() => {});

    startBarcodeLoop();
}

/* ════════════════ WIRE BUTTON ════════════════ */
(function () {
    function attachBtn() {
        const btn = document.getElementById('scanBtn');
        if (btn) btn.addEventListener('click', startScanner);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', attachBtn);
    else attachBtn();
})();
