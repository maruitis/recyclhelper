// ─── scanner.js ──────────────────────────────────────────────────────────────
//  Flow: Open → Scan (AI or Barcode) → Confirm item → Pick 3 categories
// ─────────────────────────────────────────────────────────────────────────────

/* ════════════════════════════════════════════════════════════════
   COCO-SSD LABEL MAP
   Maps every COCO-SSD class → rich search text used by getTopCategories.
   null = skip this detection (living things / infrastructure).
════════════════════════════════════════════════════════════════ */
const COCO_MAP = {
    'bottle':        'plastic bottle drink water bottle beverage',
    'wine glass':    'glass wine bottle glass drink',
    'cup':           'cup mug glass jar ceramic',
    'vase':          'glass jar vase ceramic glass',
    'book':          'book novel textbook paperback literature',
    'laptop':        'laptop computer notebook electronic device',
    'tv':            'laptop monitor television screen electronic display',
    'keyboard':      'laptop keyboard computer electronic',
    'mouse':         'laptop mouse computer electronic',
    'cell phone':    'mobile phone smartphone cellular android iphone',
    'remote':        'batteries remote control electronic',
    'chair':         'wooden furniture chair wood',
    'couch':         'wooden furniture sofa couch upholstery',
    'dining table':  'wooden furniture table dining wood',
    'bench':         'wooden furniture bench wood',
    'tie':           'shirt clothing textile fabric',
    'handbag':       'house textile bag leather handbag fabric accessory',
    'umbrella':      'plastic house textile umbrella fabric',
    'suitcase':      'house textile suitcase plastic box luggage bag',
    'backpack':      'house textile backpack bag fabric',
    'scissors':      'pens scissors metal stationery tool',
    'sports ball':   'plastic ball rubber plastic',
    'frisbee':       'plastic frisbee disc plastic',
    'skateboard':    'wooden furniture wood plastic board',
    'surfboard':     'wooden furniture wood plastic board',
    'tennis racket': 'wooden furniture wood racket sport',
    'baseball bat':  'wooden furniture wood bat sport',
    'baseball glove':'house textile leather glove fabric',
    'kite':          'paper fabric house textile',
    'pizza':         'cardboard box pizza packaging food',
    'sandwich':      'cardboard box paper packaging food',
    'hot dog':       'cardboard box paper packaging food',
    'cake':          'cardboard box plastic box packaging',
    'donut':         'cardboard box paper packaging',
    'potted plant':  'plastic box glass jar pot ceramic',
    'clock':         'batteries electronic clock',
    'toothbrush':    'plastic box plastic toothbrush',
    'hair drier':    'laptop electronic appliance hair dryer',
    'microwave':     'laptop electronic appliance microwave kitchen',
    'refrigerator':  'laptop electronic appliance fridge kitchen',
    'oven':          'laptop electronic appliance kitchen',
    'toaster':       'laptop electronic appliance kitchen toaster',
    // Skip living things & infrastructure
    'person': null, 'bicycle': null, 'car': null, 'motorcycle': null,
    'airplane': null, 'bus': null, 'train': null, 'truck': null,
    'boat': null, 'traffic light': null, 'fire hydrant': null,
    'stop sign': null, 'parking meter': null, 'bird': null,
    'cat': null, 'dog': null, 'horse': null, 'sheep': null,
    'cow': null, 'elephant': null, 'bear': null, 'zebra': null,
    'giraffe': null, 'apple': null, 'banana': null, 'orange': null,
    'broccoli': null, 'carrot': null,
};

/* ════════════════════════════════════════════════════════════════
   CATEGORY KEYWORD SCORING
   Every category lists ALL words/phrases that indicate an item
   belongs there — including ImageNet class names (underscored form
   cleaned to spaces), brand names, materials, product types.
   Longer multi-word phrases score higher (more specific).
════════════════════════════════════════════════════════════════ */
const CATEGORY_KEYWORDS = {

    'plastic bottle': [
        'plastic bottle','pet bottle','water bottle','pop bottle','soda bottle','cola bottle',
        'juice bottle','smoothie bottle','sports drink bottle','energy drink bottle',
        'squash bottle','milk bottle','cordial bottle','sauce bottle','ketchup bottle',
        'mustard bottle','salad dressing bottle','mouthwash bottle','shampoo bottle',
        'conditioner bottle','body wash bottle','hand soap bottle','shower gel bottle',
        'cleaning product bottle','detergent bottle','bleach bottle','fabric softener bottle',
        'plastic jug','plastic canteen','plastic pitcher','plastic carafe',
        'coca cola','coca-cola','pepsi','sprite','fanta','lucozade','ribena','innocent',
        'evian','volvic','highland spring','buxton water','voss water',
        'plastic','pet plastic','hdpe bottle','ldpe bottle','polypropylene bottle',
        'bottle','water','soda','cola','juice','smoothie','squash','energy drink',
        'fizzy','sparkling water','mineral water','pop','soft drink','cordial','beverage',
    ],

    'glass bottle': [
        'glass bottle','wine bottle','beer bottle','spirits bottle','whiskey bottle',
        'whisky bottle','vodka bottle','rum bottle','gin bottle','champagne bottle',
        'prosecco bottle','cider bottle','ale bottle','lager bottle','stout bottle',
        'mead bottle','olive oil bottle','vinegar bottle','balsamic vinegar bottle',
        'hot sauce bottle','soy sauce bottle','worcestershire sauce','glass carafe',
        'glass decanter','glass jug','perfume bottle','cologne bottle',
        'heineken','corona','budweiser','guinness','jack daniels','smirnoff','absolut',
        'wine','beer','spirits','whiskey','whisky','vodka','rum','gin','champagne',
        'prosecco','cider','ale','lager','stout','mead','sake','liquor','alcohol','brew',
        'glass wine','glass beer','wine glass','beer glass',
    ],

    'glass jar': [
        'glass jar','mason jar','jam jar','honey jar','pickle jar','preserve jar',
        'pasta sauce jar','coffee jar','nut butter jar','condiment jar','baby food jar',
        'salsa jar','relish jar','tahini jar','miso jar','face cream jar','cosmetic jar',
        'cream jar','glass pot','kilner jar','glass canister','glass tub','storage jar',
        'jam','honey','pickle','preserve','marmalade','peanut butter','nutella','compote',
        'chutney','pasta sauce','instant coffee','ground coffee','baby food','salsa',
        'relish','tahini','miso','hummus',
        // Ceramics map here (closest available category for ceramic items)
        'ceramic','ceramics','porcelain','china','pottery','stoneware','earthenware',
        'terracotta','ceramic mug','coffee mug','tea cup','teapot','ceramic pot',
        'ceramic bowl','ceramic plate','ceramic dish','ceramic vase',
        'mug','cup','bowl','plate','dish','vessel','pot','crock','urn','jug','stein',
        'crystal','crystal glass','crystal vase','cut glass','glassware',
        'beer mug','cocktail glass','goblet','glass pitcher',
    ],

    'tin can': [
        'tin can','aluminium can','aluminum can','steel can','food tin','soup can',
        'baked beans can','sardine can','tuna can','paint tin','paint can',
        'metal can','beverage can','soda can','beer can','energy drink can',
        'canned food','canned goods','aerosol can','spray can','spray paint can',
        'deodorant spray','hairspray can','shaving cream can','whipped cream can',
        'dog food can','cat food can','pet food tin','fruit can','vegetable can',
        'metal container','metal tin','biscuit tin','cookie tin','sweet tin',
        'tobacco tin','mint tin','tea tin','coffee tin',
        'tin','aluminium','aluminum','steel','metal',
        // Precious / other metals (closest category for metal recycling)
        'silver','gold','copper','brass','bronze','chrome','zinc','pewter','iron',
        'stainless steel','cast iron','galvanised',
        'can opener','paint bucket',
    ],

    'book': [
        'book','novel','textbook','paperback','hardcover','hardback','magazine',
        'comic','comic book','graphic novel','guide','manual','biography',
        'encyclopedia','journal','publication','diary','notebook','fiction','non-fiction',
        'children book','recipe book','cookbook','travel guide','atlas','dictionary',
        'thesaurus','anthology','pamphlet','self-help book','romance novel',
        'thriller','mystery novel','science fiction','fantasy book','poetry book',
        'history book','art book','photo book','picture book','board book',
        'reference book','coffee table book','library book','second hand book',
        'book jacket','comic book','menu','binder','library','bookshelf','book store',
    ],

    'newspaper': [
        'newspaper','tabloid','broadsheet','daily paper','newsprint','gazette',
        'herald','times','guardian','daily mail','the sun','mirror newspaper',
        'news','press','chronicle','tribune','reporter','daily paper','weekly paper',
        'sunday paper','local paper','freesheet','metro paper','city am',
    ],

    'paper': [
        'paper','tissue','napkin','kitchen roll','toilet paper','toilet roll',
        'notepad','envelope','stationery','document','receipt','paper bag',
        'flyer','leaflet','brochure','poster','greeting card','christmas card',
        'wrapping paper','kraft paper','a4 paper','printer paper','copy paper',
        'writing paper','letter','memo','sticky note','post-it note',
        'paper cup','coffee cup paper','paper plate','disposable cup paper',
        'paper straw','wax paper','baking paper','parchment paper',
        'cardboard sleeve','coffee sleeve','paper packaging',
        'envelope','paper towel','toilet tissue','tissue paper',
    ],

    'laptop': [
        'laptop','laptop computer','notebook computer','desktop computer',
        'personal computer','pc','mac','macbook','chromebook','gaming laptop',
        'ultrabook','all in one computer','tablet computer','ipad','surface tablet',
        'monitor','display screen','external monitor',
        'keyboard','computer keyboard','wireless keyboard',
        'computer mouse','trackpad','touchpad','webcam',
        'headphones','earphones','earbuds','airpods','wireless earbuds',
        'speaker','bluetooth speaker','computer speaker',
        'printer','inkjet printer','laser printer',
        'hard drive','external hard drive','ssd drive','usb drive',
        'flash drive','usb stick','memory card','sd card',
        'router','modem','network switch',
        'charger','laptop charger','power adapter','power supply','power brick',
        'gaming console','playstation','xbox','nintendo switch','wii','game boy',
        'game controller','gamepad','joystick',
        'camera','digital camera','dslr','mirrorless camera','action camera','gopro',
        'video camera','camcorder','projector','smart tv','television set',
        'set top box','streaming device','chromecast','fire stick','apple tv',
        // Kitchen & small appliances go here (no appliance category exists)
        'electric kettle','hair dryer','hair straightener','curling iron',
        'electric shaver','electric toothbrush','clothes iron','steam iron',
        'vacuum cleaner','cordless vacuum','robot vacuum','dyson',
        'fan heater','air purifier','dehumidifier','air conditioner',
        'kitchen appliance','appliance','electronic','electrical device',
        'blender','food processor','stand mixer','microwave oven',
        'toaster','kettle','coffee maker','espresso machine',
        'laptop computer','notebook computer','desktop computer','monitor',
        'keyboard','hard disk','space bar','trackball',
    ],

    'mobile phone': [
        'mobile phone','smartphone','cell phone','cellular telephone','cellular phone',
        'handset','iphone','android phone','samsung phone','samsung galaxy',
        'google pixel','huawei phone','xiaomi','nokia phone','motorola phone',
        'oneplus phone','oppo phone','vivo','realme','phone case','sim card',
        'phone','mobile','cellular','flip phone','feature phone','prepay phone',
        'cell phone','cellular telephone','mobile phone',
    ],

    'light bulb': [
        'light bulb','led bulb','cfl bulb','fluorescent bulb','incandescent bulb',
        'halogen bulb','smart bulb','energy saving bulb','compact fluorescent lamp',
        'tube light','fluorescent tube','spotlight','downlight','recessed light',
        'bulb','lamp','led lamp','cfl lamp','fluorescent','incandescent','halogen',
        'torch','flashlight','lantern','desk lamp','table lamp','floor lamp',
        'wall lamp','reading lamp','bedside lamp','anglepoise lamp',
        'led strip light','fairy lights','christmas lights','string lights',
        'spotlight lamp','track lighting','pendant light','chandelier bulb',
    ],

    'batteries': [
        'battery','batteries','alkaline battery','rechargeable battery','lithium battery',
        'lithium ion battery','nickel metal hydride','nimh battery',
        'aa battery','aaa battery','9v battery','d battery','c battery',
        'button cell','coin cell battery','watch battery','hearing aid battery',
        'car battery','laptop battery','phone battery','camera battery',
        'remote control battery','clock battery','toy battery',
        'power bank','portable charger','battery pack',
        'duracell','energizer','varta','panasonic battery','gp batteries',
        'remote control','tv remote','game remote','wireless mouse battery',
        'voltaic pile','electric battery','battery charger',
    ],

    'shirts': [
        'shirt','t-shirt','tee shirt','tee','blouse','polo shirt','polo',
        'jersey top','vest top','tank top','tank','sleeveless top','camisole',
        'button-up shirt','button-down shirt','dress shirt','work shirt',
        'casual shirt','flannel shirt','hawaiian shirt','linen shirt',
        'oxford shirt','chambray shirt','plaid shirt','checked shirt',
        'graphic tee','band tee','crop top','bodysuit','tube top',
        'blazer','suit jacket','sports jacket','waistcoat','gilet',
        'lab coat','military uniform','school uniform shirt',
        'clothing','apparel','garment','wear','fashion','clothes',
        'jersey','tshirt','tee shirt','polo shirt','sweatshirt',
    ],

    'jeans': [
        'jeans','denim jeans','denim','skinny jeans','slim jeans','slim fit jeans',
        'wide leg jeans','bootcut jeans','straight jeans','straight leg jeans',
        'relaxed fit jeans','flared jeans','mom jeans','boyfriend jeans','jeggings',
        'dungarees','overalls bib','denim jacket','jean jacket','denim shorts',
        'levis','wrangler','lee jeans','diesel jeans','true religion jeans',
        'g-star jeans','nudie jeans','pepe jeans',
        'blue jeans','black jeans','white jeans','ripped jeans','distressed jeans',
        'acid wash jeans','raw denim',
    ],

    'sweater': [
        'sweater','jumper','pullover','cardigan','knitwear','knit sweater',
        'sweatshirt','hoodie','hooded sweatshirt','zip hoodie','half zip sweater',
        'fleece jacket','fleece top','polar fleece','micro fleece',
        'wool sweater','chunky knit','cable knit','fine knit','rib knit',
        'turtleneck','polo neck','crew neck sweater','crewneck','v-neck sweater',
        'cashmere sweater','merino sweater','lambswool sweater','mohair sweater',
        'anorak','track top','puffer jacket','quilted jacket','gilet jacket',
        'wool','cashmere','merino wool','lambswool','mohair','angora','fleece',
        'cardigan','jersey sweater','sweatshirt',
    ],

    'shoes': [
        'shoes','shoe','boot','boots','ankle boot','knee boot','thigh boot',
        'sneaker','sneakers','trainer','trainers','athletic shoe','running shoe',
        'sandal','sandals','flip flop','flip flops','thong sandal',
        'slipper','slippers','house shoe','mule shoe',
        'high heel','heels','stiletto heel','wedge shoe','platform shoe','court shoe',
        'loafer','oxford shoe','brogue','derby shoe','monk strap','penny loafer',
        'moccasin','espadrille','slip on shoe','boat shoe','driving shoe',
        'football boot','cleat shoe','cycling shoe','hiking boot','walking boot',
        'work boot','steel toe boot','wellington boot','welly','rain boot',
        'dance shoe','ballet flat','mary jane shoe',
        'nike','adidas','puma','reebok','converse','vans shoe','new balance shoe',
        'asics shoe','saucony','brooks running shoe','hoka','on running',
        'ugg boot','timberland boot','dr martens','birkenstock','crocs shoe',
        'footwear','sole shoe','heel shoe','shoelace',
        'running shoe','loafer','sandal','moccasin','clog shoe','cowboy boot','ski boot',
    ],

    'house textile': [
        'towel','bath towel','hand towel','face towel','beach towel','guest towel',
        'bath mat','shower mat','bath robe','dressing gown','bathrobe',
        'bedding','duvet','duvet cover','quilt','comforter','bed sheet',
        'fitted sheet','flat sheet','pillowcase','pillow case','pillow',
        'cushion','cushion cover','scatter cushion','throw pillow',
        'bedspread','throw blanket','blanket','electric blanket','wool blanket','fleece blanket',
        'mattress cover','mattress protector','mattress topper',
        'curtain','curtains','drape','roman blind','roller blind','venetian blind',
        'tablecloth','table cloth','place mat','placemat','cloth napkin',
        'dishcloth','tea towel','oven glove','pot holder','oven mitt',
        'rug','mat','doormat','bath rug','area rug','carpet runner',
        'scarf','muffler','neck warmer','neckerchief','shawl',
        'hat','beanie','beret','woolly hat','cap','baseball cap','sun hat',
        'glove','mittens','winter gloves','leather gloves',
        'handkerchief','pocket square',
        'handbag','tote bag','shoulder bag','crossbody bag','clutch bag','evening bag',
        'shopping tote','canvas bag','reusable bag','fabric bag',
        'linen','silk','cotton fabric','polyester','nylon fabric','synthetic',
        'bath towel','shower curtain','window shade','quilt','pillow','sleeping bag',
    ],

    'plastic box': [
        'plastic container','plastic box','plastic tub','storage container','storage box',
        'plastic bin','laundry basket','washing basket','plastic crate',
        'food container','food tub','lunch box','lunchbox','bento box','snack box',
        'tupperware','click lock container','food storage box',
        'yoghurt pot','yogurt pot','yoghurt container','yogurt container',
        'margarine tub','butter tub','ice cream tub','ice cream container',
        'cream cheese tub','hummus pot','dip pot',
        'plastic tray','meat tray','produce tray','deli container',
        'takeaway container','plastic takeaway box','styrofoam box','polystyrene box',
        'bubble wrap','plastic wrap','cling film','cling wrap','food wrap',
        'sandwich bag','ziplock bag','ziplock','resealable bag','freezer bag',
        'plastic bag','carrier bag','plastic shopping bag',
        'bucket','plastic bucket','watering can','plant pot','flower pot','garden pot',
        'plastic toy','lego brick','action figure','plastic figurine','toy box',
        'foam','polystyrene foam','expanded polystyrene','styrofoam',
        'rubber item','rubber','acrylic','perspex','plexiglass','vinyl','pvc item',
        'plastic bag','bucket','barrel plastic','tub plastic','mailbox plastic',
    ],

    'cardboard box': [
        'cardboard box','cardboard','carton','corrugated box','corrugated cardboard',
        'kraft box','kraft paper','shipping box','delivery box','parcel box',
        'moving box','packing box','cardboard storage box',
        'cereal box','cornflake box','breakfast cereal box','muesli box',
        'tea box','coffee box','cake box','bakery box','shoe box cardboard',
        'medicine box','pill box cardboard','packaging box','product box','retail box',
        'pizza box','takeaway box cardboard','food delivery box',
        'cardboard tube','toilet roll tube','kitchen roll tube','paper towel tube',
        'wrapping paper tube','poster tube','cardboard cylinder',
        'egg box','egg carton','egg container cardboard',
        'amazon box','delivery parcel','postage box','cardboard parcel',
        'carton','packing crate','cardboard crate','wooden crate cardboard',
    ],

    'wooden furniture': [
        'wooden furniture','wood furniture','furniture','wooden item',
        'chair','dining chair','office chair','armchair','rocking chair',
        'folding chair','camping chair','garden chair','deck chair',
        'table','dining table','coffee table','side table','end table',
        'console table','desk','office desk','writing desk','study desk',
        'shelf','shelving unit','bookcase','bookshelf','book shelf','floating shelf',
        'wardrobe','armoire','closet','clothes rail','wardrobe unit',
        'cabinet','filing cabinet','storage cabinet','display cabinet','medicine cabinet',
        'dresser','chest of drawers','drawer unit','tallboy','chiffonier',
        'sideboard','credenza','media unit','tv stand','entertainment center',
        'sofa','couch','loveseat','sofa bed','futon',
        'stool','bar stool','step stool','footstool','ottoman','pouffe',
        'bench','garden bench','window seat','storage bench',
        'bed frame','bed','headboard','bunk bed','loft bed',
        'nightstand','bedside table','bedside cabinet',
        'picture frame','mirror frame','wall shelf','coat rack','hat stand',
        'wooden','wood','timber','plywood','mdf board','chipboard','particle board',
        'hardwood','softwood','oak','pine','mahogany','walnut wood','birch wood',
        'bamboo','teak','maple wood','cherry wood','beech wood','ash wood',
        'rocking chair','folding chair','studio couch','chair','desk',
        'dining table','coffee table','bookcase','wardrobe','chest of drawers',
        'filing cabinet','entertainment center',
    ],

    'pens': [
        'pen','pens','marker pen','markers','highlighter pen','highlighters',
        'ballpoint pen','ballpoint','rollerball pen','rollerball','gel pen','gel ink pen',
        'felt tip pen','felt-tip','fibre tip','fiber tip pen',
        'biro','fountain pen','ink pen','dip pen','quill pen',
        'sharpie marker','whiteboard marker','dry erase marker','permanent marker',
        'overhead projector pen','calligraphy pen','brush pen','sign pen',
        'correction pen','white-out pen','tipp-ex pen',
        'stationery','writing pen','drawing pen','art supplies pen',
        'office supplies pen','desk pen','pen holder','pen set',
        'ballpoint','quill','fountain pen','rubber eraser',
    ],

    'pencils': [
        'pencil','pencils','graphite pencil','drawing pencil','sketching pencil',
        'coloured pencil','colored pencil','colour pencil','color pencil',
        'watercolour pencil','watercolor pencil',
        'mechanical pencil','propelling pencil','clutch pencil','twist pencil',
        'lead pencil','carpenter pencil','grease pencil','chinagraph pencil',
        'crayon','wax crayon','oil pastel crayon','pastel stick','charcoal pencil',
        'charcoal stick','conte crayon','compressed charcoal','drawing charcoal',
        'pencil box','pencil case','pencil tin','pencil set',
        'art pencil','sketching','illustration pencil','doodle pencil',
        'pencil box','pencil case','crayon set',
    ],
};

/* ════════════════════════════════════════════════════════════════
   MATERIAL / ITEM HINTS
   Words that strongly imply a particular recycling category.
   Used as a scoring boost on top of keyword matching.
   Key = word to look for in the search text.
   Value = ordered array of categories to boost (first = biggest boost).
════════════════════════════════════════════════════════════════ */
const MATERIAL_HINTS = {
    // ── Plastics ─────────────────────────────────────────────
    'plastic':          ['plastic bottle', 'plastic box'],
    'hdpe':             ['plastic bottle', 'plastic box'],
    'ldpe':             ['plastic box', 'plastic bottle'],
    'polypropylene':    ['plastic box', 'plastic bottle'],
    'polyethylene':     ['plastic bottle', 'plastic box'],
    'polystyrene':      ['plastic box'],
    'styrofoam':        ['plastic box'],
    'acrylic':          ['plastic box', 'plastic bottle'],
    'pvc':              ['plastic box', 'plastic bottle'],
    'vinyl':            ['plastic box', 'plastic bottle'],
    'rubber':           ['plastic box', 'shoes'],
    'foam':             ['plastic box'],
    'neoprene':         ['plastic box', 'sweater'],

    // ── Glass & ceramics ─────────────────────────────────────
    'glass':            ['glass bottle', 'glass jar'],
    'ceramic':          ['glass jar', 'glass bottle'],
    'ceramics':         ['glass jar', 'glass bottle'],
    'porcelain':        ['glass jar', 'glass bottle'],
    'china':            ['glass jar', 'glass bottle'],
    'pottery':          ['glass jar', 'glass bottle'],
    'stoneware':        ['glass jar', 'glass bottle'],
    'earthenware':      ['glass jar', 'glass bottle'],
    'terracotta':       ['glass jar', 'plastic box'],
    'crystal':          ['glass jar', 'glass bottle'],
    'glassware':        ['glass jar', 'glass bottle'],

    // ── Metals ───────────────────────────────────────────────
    'metal':            ['tin can', 'batteries'],
    'aluminium':        ['tin can', 'batteries'],
    'aluminum':         ['tin can', 'batteries'],
    'steel':            ['tin can'],
    'iron':             ['tin can', 'wooden furniture'],
    'silver':           ['tin can', 'batteries'],
    'gold':             ['tin can', 'batteries'],
    'copper':           ['tin can', 'batteries'],
    'brass':            ['tin can', 'batteries'],
    'bronze':           ['tin can', 'batteries'],
    'tin':              ['tin can'],
    'chrome':           ['tin can', 'laptop'],
    'zinc':             ['tin can', 'batteries'],

    // ── Paper & card ─────────────────────────────────────────
    'paper':            ['paper', 'cardboard box', 'newspaper'],
    'cardboard':        ['cardboard box', 'paper'],
    'card':             ['cardboard box', 'paper'],
    'kraft':            ['cardboard box', 'paper'],
    'corrugated':       ['cardboard box'],
    'newsprint':        ['newspaper', 'paper'],

    // ── Textiles & fabrics ────────────────────────────────────
    'fabric':           ['shirts', 'sweater', 'house textile'],
    'textile':          ['house textile', 'shirts', 'sweater'],
    'clothing':         ['shirts', 'sweater', 'jeans'],
    'apparel':          ['shirts', 'sweater', 'jeans'],
    'garment':          ['shirts', 'sweater', 'jeans'],
    'clothes':          ['shirts', 'sweater', 'jeans'],
    'fashion':          ['shirts', 'jeans', 'sweater'],
    'wear':             ['shirts', 'sweater', 'jeans'],
    'cloth':            ['shirts', 'sweater', 'house textile'],
    'cotton':           ['shirts', 'house textile', 'jeans'],
    'polyester':        ['shirts', 'house textile', 'sweater'],
    'nylon':            ['shoes', 'house textile', 'sweater'],
    'silk':             ['house textile', 'shirts'],
    'linen':            ['house textile', 'shirts'],
    'wool':             ['sweater', 'house textile'],
    'cashmere':         ['sweater', 'house textile'],
    'merino':           ['sweater'],
    'fleece':           ['sweater', 'house textile'],
    'denim':            ['jeans', 'shirts'],
    'leather':          ['shoes', 'jeans', 'shirts'],
    'suede':            ['shoes', 'jeans'],
    'canvas':           ['shoes', 'shirts'],
    'knit':             ['sweater', 'house textile'],
    'woven':            ['house textile', 'shirts'],
    'spandex':          ['shirts', 'jeans'],
    'lycra':            ['shirts', 'jeans', 'sweater'],
    'velvet':           ['house textile', 'shirts'],
    'tweed':            ['sweater', 'shirts'],
    'corduroy':         ['jeans', 'shirts'],

    // ── Wood ─────────────────────────────────────────────────
    'wood':             ['wooden furniture'],
    'wooden':           ['wooden furniture'],
    'timber':           ['wooden furniture'],
    'oak':              ['wooden furniture'],
    'pine':             ['wooden furniture'],
    'mahogany':         ['wooden furniture'],
    'bamboo':           ['wooden furniture'],
    'plywood':          ['wooden furniture', 'cardboard box'],
    'mdf':              ['wooden furniture'],

    // ── Electronics ──────────────────────────────────────────
    'electronic':       ['laptop', 'mobile phone', 'batteries'],
    'electrical':       ['laptop', 'batteries', 'light bulb'],
    'digital':          ['laptop', 'mobile phone', 'batteries'],
    'appliance':        ['laptop', 'batteries', 'light bulb'],
    'circuit':          ['laptop', 'mobile phone', 'batteries'],
    'battery':          ['batteries'],
    'rechargeable':     ['batteries', 'laptop'],
    'lithium':          ['batteries', 'laptop'],

    // ── Common item types ────────────────────────────────────
    'bottle':           ['plastic bottle', 'glass bottle'],
    'can':              ['tin can', 'plastic bottle'],
    'jar':              ['glass jar', 'glass bottle'],
    'box':              ['cardboard box', 'plastic box'],
    'bag':              ['house textile', 'cardboard box'],
    'drink':            ['plastic bottle', 'glass bottle', 'tin can'],
    'beverage':         ['plastic bottle', 'glass bottle', 'tin can'],
    'food':             ['tin can', 'glass jar', 'plastic box'],
    'shoe':             ['shoes'],
    'boot':             ['shoes'],
    'sneaker':          ['shoes'],
    'trainer':          ['shoes'],
    'footwear':         ['shoes'],
    'phone':            ['mobile phone', 'laptop'],
    'computer':         ['laptop', 'mobile phone'],
    'bulb':             ['light bulb'],
    'lamp':             ['light bulb', 'wooden furniture'],
    'furniture':        ['wooden furniture'],
    'book':             ['book', 'newspaper'],
    'pen':              ['pens', 'pencils'],
    'pencil':           ['pencils', 'pens'],
    'stationery':       ['pens', 'pencils', 'paper'],
    'office':           ['pens', 'pencils', 'paper'],
    'hoodie':           ['sweater', 'shirts'],
    'jacket':           ['sweater', 'shirts'],
    'coat':             ['sweater', 'house textile'],
    'dress':            ['shirts', 'house textile'],
    'skirt':            ['shirts', 'jeans'],
    'trousers':         ['jeans', 'shirts'],
    'pants':            ['jeans', 'shirts'],
    'vase':             ['glass jar', 'glass bottle', 'plastic bottle'],
    'mug':              ['glass jar', 'plastic box'],
    'cup':              ['glass jar', 'plastic box'],
    'bowl':             ['plastic box', 'glass jar'],
    'plate':            ['glass jar', 'plastic box'],
    'pot':              ['glass jar', 'tin can'],
    'tray':             ['plastic box', 'tin can'],
    'toy':              ['plastic box', 'plastic bottle'],
    'game':             ['cardboard box', 'plastic box'],
    'hat':              ['house textile', 'sweater'],
    'cap':              ['house textile', 'sweater'],
    'scarf':            ['house textile', 'sweater'],
    'glove':            ['house textile', 'sweater'],
    'watch':            ['batteries', 'mobile phone'],
    'clock':            ['batteries', 'mobile phone'],
    'jewelry':          ['tin can', 'batteries'],
    'jewellery':        ['tin can', 'batteries'],
    'glasses':          ['mobile phone', 'batteries'],
    'sunglasses':       ['mobile phone', 'batteries'],
    'mirror':           ['glass jar', 'glass bottle'],
    'packaging':        ['cardboard box', 'plastic box', 'tin can'],
    'container':        ['plastic box', 'glass jar', 'tin can'],
    'chocolate':        ['tin can', 'cardboard box', 'plastic box'],
    'cereal':           ['cardboard box', 'plastic box'],
    'coffee':           ['glass jar', 'tin can', 'plastic box'],
    'tea':              ['cardboard box', 'glass jar', 'tin can'],
    'shampoo':          ['plastic bottle', 'plastic box'],
    'cosmetic':         ['glass jar', 'plastic bottle', 'plastic box'],
    'makeup':           ['glass jar', 'plastic bottle', 'plastic box'],
    'perfume':          ['glass bottle', 'glass jar'],
    'candle':           ['glass jar', 'tin can'],
    'paint':            ['tin can', 'plastic box'],
    'tool':             ['tin can', 'wooden furniture'],
    'sport':            ['plastic bottle', 'shoes'],
    'exercise':         ['plastic bottle', 'shoes', 'shirts'],
    'kitchen':          ['plastic box', 'glass jar', 'tin can'],
    'cleaning':         ['plastic bottle', 'plastic box'],
    'detergent':        ['plastic bottle', 'plastic box'],
};

/* ════════════════════════════════════════════════════════════════
   CATEGORY ICONS
════════════════════════════════════════════════════════════════ */
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

/* ════════════════════════════════════════════════════════════════
   GET TOP CATEGORIES
   Scores every category against the search text using keyword
   matching + material hint boosting. Hash-based tie-breaking
   ensures different items always get different results even when
   scores are equal — never stuck returning the same 3 categories.
════════════════════════════════════════════════════════════════ */
function getTopCategories(text, count = 3) {
    const lower = (text || '').toLowerCase().replace(/_/g, ' ').replace(/-/g, ' ');

    // 1. Keyword scoring — longer phrases score higher
    const scores = Object.entries(CATEGORY_KEYWORDS).map(([cat, keys]) => {
        let score = 0;
        for (const k of keys) {
            if (lower.includes(k)) {
                score += k.trim().split(/\s+/).length * 4;
            }
        }
        return { cat, score };
    });

    // 2. Material hint boosting
    for (const [hint, cats] of Object.entries(MATERIAL_HINTS)) {
        if (lower.includes(hint)) {
            cats.forEach((cat, i) => {
                const entry = scores.find(s => s.cat === cat);
                if (entry) entry.score += Math.max(8 - i * 2.5, 1);
            });
        }
    }

    // 3. Deterministic tie-breaking based on text hash
    // Same text → same result; different text → different result
    // This prevents always returning the same 3 when scores are all 0
    const hash = lower.split('').reduce((a, c) => ((a << 5) - a + c.charCodeAt(0)) & 0xfffff, 0);
    scores.forEach((s, i) => {
        // Tiny deterministic noise — won't override real matches
        s.score += ((hash ^ (i * 2654435761 >>> 0)) & 0xffff) / 500000;
    });

    scores.sort((a, b) => b.score - a.score);
    return scores.slice(0, count);
}

/* ════════════════════════════════════════════════════════════════
   STATE
════════════════════════════════════════════════════════════════ */
let scanPhase        = 'scanning';
let barcodeMode      = true;
let activeStream     = null;
let loopTimer        = null;
let isDetecting      = false;
let cocoModel        = null;
let mobileNet        = null;
let modelsLoaded     = false;
let modelsLoading    = false;
let lastScannedCode  = null;
let pendingLabel     = '';
let pendingSearchText = '';
let hitCount         = 0;
let lastHitCategory  = null;  // normalized category for stable hit-counting

/* ════════════════════════════════════════════════════════════════
   LOADERS
════════════════════════════════════════════════════════════════ */
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

/* ════════════════════════════════════════════════════════════════
   HELPERS
════════════════════════════════════════════════════════════════ */
function setStatus(msg, type = 'info') {
    const el = document.getElementById('scannerStatus');
    if (!el) return;
    el.textContent = msg;
    el.className = 'scanner-status scanner-status--' + type;
}

// Clean an ImageNet/MobileNet class label for display & scoring:
// "ballpoint_pen, writing implement" → "ballpoint pen"
function cleanLabel(raw) {
    return (raw || '').toLowerCase().replace(/_/g, ' ').split(',')[0].trim();
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
        if (p.score < 0.38) continue;
        const [x, y, w, h] = p.bbox;
        // Green = COCO_MAP has this item (not null), yellow = unknown
        const searchText = COCO_MAP[p.class];
        const isKnown = searchText !== undefined && searchText !== null;
        const col = isKnown ? '#24E474' : 'rgba(255,200,70,0.9)';
        ctx.strokeStyle = col;
        ctx.lineWidth = 2.5;
        ctx.shadowColor = col;
        ctx.shadowBlur = 8;
        ctx.strokeRect(x*sx, y*sy, w*sx, h*sy);
        ctx.shadowBlur = 0;
        const lbl = `${p.class}  ${Math.round(p.score*100)}%`;
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

/* ════════════════════════════════════════════════════════════════
   MODAL HTML
════════════════════════════════════════════════════════════════ */
function buildModal() {
    if (document.getElementById('scannerModal')) return;
    const m = document.createElement('div');
    m.id = 'scannerModal';
    m.innerHTML = `
    <div class="scanner-box">

      <!-- VIEW 1: live scan -->
      <div class="scanner-view" id="viewScanning">
        <div class="scanner-header">
          <span class="scanner-title">📷 Scan Item</span>
          <button class="scanner-close-btn" id="closeScannerBtn">✕</button>
        </div>
        <div class="scanner-mode-tabs">
          <button class="scanner-tab" id="tabBarcode" onclick="switchScanMode('barcode')">📊 Barcode</button>
          <button class="scanner-tab" id="tabAI"      onclick="switchScanMode('ai')">🤖 AI Vision</button>
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

      <!-- VIEW 2: confirm -->
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

      <!-- VIEW 3: category pick -->
      <div class="scanner-view" id="viewCategory" style="display:none">
        <div class="scanner-header">
          <span class="scanner-title">♻ Recycle as…</span>
          <button class="scanner-close-btn" id="closeScannerBtn3">✕</button>
        </div>
        <p class="category-prompt">Pick the best recycling category:</p>
        <div class="category-choices" id="categoryChoices"></div>
        <button class="scanner-back-btn" id="backToScanBtn">← Scan again</button>
      </div>

    </div>`;
    document.body.appendChild(m);

    ['closeScannerBtn','closeScannerBtn2','closeScannerBtn3'].forEach(id => {
        document.getElementById(id)?.addEventListener('click', stopScanner);
    });
    m.addEventListener('click', e => { if (e.target === m) stopScanner(); });
    document.getElementById('confirmYesBtn').addEventListener('click', onConfirmYes);
    document.getElementById('confirmNoBtn').addEventListener('click',  onBackToScan);
    document.getElementById('backToScanBtn').addEventListener('click', onBackToScan);
}

/* ════════════════════════════════════════════════════════════════
   VIEW NAVIGATION
════════════════════════════════════════════════════════════════ */
function showView(id) {
    ['viewScanning','viewConfirm','viewCategory'].forEach(v => {
        const el = document.getElementById(v);
        if (el) el.style.display = (v === id) ? 'flex' : 'none';
    });
}

/* ════════════════════════════════════════════════════════════════
   CONFIRM VIEW
════════════════════════════════════════════════════════════════ */
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
    scanPhase       = 'scanning';
    lastScannedCode = null;
    hitCount        = 0;
    lastHitCategory = null;

    const canvas = document.getElementById('scannerCanvas');
    if (canvas) canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

    setStatus(barcodeMode ? '📊 Point camera at a barcode…' : 'Point camera at your item…', 'info');
    showView('viewScanning');

    if (barcodeMode) loopTimer = setTimeout(barcodeLoop, 300);
    else             loopTimer = setTimeout(detectionLoop, 600);
}

/* ════════════════════════════════════════════════════════════════
   NAVIGATE
════════════════════════════════════════════════════════════════ */
function navigateToItem(name) {
    stopScanner();
    const inp  = document.getElementById('searchInput');
    const form = document.getElementById('searchForm');
    if (inp && form) { inp.value = name; form.dispatchEvent(new Event('submit')); }
}

/* ════════════════════════════════════════════════════════════════
   MODE SWITCH
════════════════════════════════════════════════════════════════ */
function switchScanMode(mode) {
    const wantBarcode = (mode === 'barcode');
    if (wantBarcode === barcodeMode && scanPhase === 'scanning') return;

    document.getElementById('tabBarcode')?.classList.toggle('scanner-tab-active', wantBarcode);
    document.getElementById('tabAI')?.classList.toggle('scanner-tab-active', !wantBarcode);

    if (loopTimer) { clearTimeout(loopTimer); loopTimer = null; }
    isDetecting = false; hitCount = 0; lastHitCategory = null;
    lastScannedCode = null; scanPhase = 'scanning';

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
                loopTimer = setTimeout(detectionLoop, 600);
            })
            .catch(() => setStatus('⚠ Could not load AI models.', 'error'));
    }
}

/* ════════════════════════════════════════════════════════════════
   BARCODE MODE
════════════════════════════════════════════════════════════════ */
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
                return;
            }
        } catch (_) {}
        isDetecting = false;
    }

    if (barcodeMode && document.getElementById('scannerModal') && scanPhase === 'scanning') {
        loopTimer = setTimeout(barcodeLoop, 400);
    }
}

async function readBarcodeFromVideo(video) {
    if ('BarcodeDetector' in window) {
        try {
            if (!window.__barcodeDetector) {
                window.__barcodeDetector = new BarcodeDetector({
                    formats: ['ean_13','ean_8','upc_a','upc_e','code_128','code_39',
                              'code_93','qr_code','data_matrix','itf']
                });
            }
            const results = await window.__barcodeDetector.detect(video);
            if (results && results.length > 0) return results[0].rawValue;
        } catch (_) {}
        return null;
    }
    if (window.ZXing) {
        try {
            const canvas = document.createElement('canvas');
            canvas.width  = video.videoWidth  || 640;
            canvas.height = video.videoHeight || 480;
            canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
            const reader = new ZXing.BrowserMultiFormatReader();
            const result = reader.decodeFromCanvas(canvas);
            return result ? result.getText() : null;
        } catch (_) { return null; }
    }
    return null;
}

async function lookupBarcode(code) {
    // 1. Open Food Facts — food & drink
    try {
        const r = await fetchTimeout(
            `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(code)}?fields=product_name,categories,packaging,labels`
        );
        if (r.ok) {
            const d = await r.json();
            if (d.status === 1 && d.product) {
                const p = d.product;
                return {
                    name:       p.product_name || code,
                    searchText: [p.product_name, p.categories, p.packaging, p.labels].filter(Boolean).join(' ')
                };
            }
        }
    } catch (_) {}

    // 2. UPCitemdb — electronics, clothing, books, etc.
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
                    searchText: [p.category, p.brand, p.title, p.description].filter(Boolean).join(' ')
                };
            }
        }
    } catch (_) {}

    return { name: code, searchText: '' };
}

async function handleBarcodeResult(code) {
    if (scanPhase !== 'scanning') return;
    setStatus(`🔎 Barcode: ${code} — looking up…`, 'info');

    const found = await lookupBarcode(code);
    if (scanPhase !== 'scanning') return;

    const isUnknown = found.name === code && !found.searchText;
    showConfirmView(
        isUnknown ? `Barcode: ${code}` : found.name,
        isUnknown ? 'Unknown product — choose recycling category' : `Barcode: ${code}`,
        found.searchText || found.name
    );
}

/* ════════════════════════════════════════════════════════════════
   AI DETECTION MODE
   Runs COCO-SSD AND MobileNet every frame in parallel.
   — COCO gives good bounding box labels for common objects.
   — MobileNet gives much richer 1000-class ImageNet classification.
   Both results are combined into a single searchText and fed to
   getTopCategories, so even niche items (pens, ceramics, accessories,
   appliances, furniture, stationery…) get correct category suggestions.
   Hit-counting uses the normalized top category so "bottle" and
   "water bottle" count as the same item across frames.
════════════════════════════════════════════════════════════════ */
async function detectionLoop() {
    if (!document.getElementById('scannerModal') || barcodeMode || scanPhase !== 'scanning') return;

    if (!isDetecting) {
        const video  = document.getElementById('scannerVideo');
        const canvas = document.getElementById('scannerCanvas');

        if (video && video.readyState >= 2 && video.videoWidth > 0) {
            isDetecting = true;

            let displayName = null;  // shown to user in status
            let searchParts = [];    // assembled into searchText for scoring

            // ── COCO-SSD ──────────────────────────────────────────────
            if (cocoModel) {
                try {
                    const preds = await cocoModel.detect(video);
                    if (canvas) drawBoxes(canvas, video, preds);

                    const best = preds
                        .filter(p => p.score > 0.35 && COCO_MAP[p.class] !== null)
                        .sort((a, b) => b.score - a.score)[0];

                    if (best) {
                        displayName = best.class;
                        // Use the rich search text from COCO_MAP if available
                        const cocoSearch = COCO_MAP[best.class];
                        if (cocoSearch) searchParts.push(cocoSearch);
                        else searchParts.push(best.class);
                    }
                } catch (_) {}
            }

            // ── MobileNet (1000 ImageNet classes — always run) ─────────
            if (mobileNet) {
                try {
                    const preds = await mobileNet.classify(video, 5);
                    preds.filter(p => p.probability > 0.06).forEach((p, i) => {
                        const label = cleanLabel(p.className);
                        // Use top MobileNet result as display name if COCO found nothing
                        if (i === 0 && !displayName) displayName = label;
                        searchParts.push(label);
                    });
                } catch (_) {}
            }

            const searchText = searchParts.join(' ').trim();

            // Normalize: get the top category this searchText maps to
            // Use it for hit-counting so different raw labels for the same
            // concept (bottle / water bottle / pop bottle) don't reset the count
            const normCat = searchText ? getTopCategories(searchText, 1)[0].cat : null;

            if (normCat && normCat === lastHitCategory) {
                hitCount++;
            } else {
                lastHitCategory = normCat;
                hitCount = normCat ? 1 : 0;
            }

            // 2 consistent frames → show confirm view
            if (hitCount >= 2 && displayName && searchText) {
                const displayCap = displayName.charAt(0).toUpperCase() + displayName.slice(1);
                showConfirmView(
                    displayCap,
                    'Identified by AI vision',
                    searchText
                );
                isDetecting = false;
                return;
            }

            if (displayName) {
                setStatus(`👀 Seeing: ${displayName}… hold still`, 'info');
            } else {
                setStatus('Point camera at your item…', 'info');
            }

            isDetecting = false;
        }
    }

    if (!barcodeMode && document.getElementById('scannerModal') && scanPhase === 'scanning') {
        loopTimer = setTimeout(detectionLoop, 650);
    }
}

/* ════════════════════════════════════════════════════════════════
   STOP / START
════════════════════════════════════════════════════════════════ */
function stopScanner() {
    if (loopTimer) { clearTimeout(loopTimer); loopTimer = null; }
    if (activeStream) { activeStream.getTracks().forEach(t => t.stop()); activeStream = null; }
    delete window.__barcodeDetector;
    isDetecting = false; hitCount = 0; lastHitCategory = null;
    barcodeMode = true; lastScannedCode = null; scanPhase = 'scanning';
    const modal = document.getElementById('scannerModal');
    if (modal) modal.remove();
}

async function startScanner() {
    if (document.getElementById('scannerModal')) return;
    buildModal();

    scanPhase = 'scanning'; barcodeMode = true;
    hitCount = 0; lastHitCategory = null; lastScannedCode = null;

    const video = document.getElementById('scannerVideo');
    setStatus('📷 Starting camera…', 'info');

    document.getElementById('tabBarcode')?.classList.add('scanner-tab-active');
    document.getElementById('tabAI')?.classList.remove('scanner-tab-active');

    try {
        activeStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } }
        });
        video.srcObject = activeStream;
        await new Promise(r => {
            video.addEventListener('loadeddata', r, { once: true });
            setTimeout(r, 3000);
        });
    } catch (_) {
        setStatus('⚠ Camera access denied — allow camera and try again.', 'error');
        return;
    }

    setStatus('📊 Point camera at a barcode…', 'info');
    if (!('BarcodeDetector' in window)) ensureZXing().catch(() => {});
    startBarcodeLoop();
}

/* ════════════════════════════════════════════════════════════════
   WIRE SCAN BUTTON
════════════════════════════════════════════════════════════════ */
(function () {
    function attachBtn() {
        const btn = document.getElementById('scanBtn');
        if (btn) btn.addEventListener('click', startScanner);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', attachBtn);
    else attachBtn();
})();
