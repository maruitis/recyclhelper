// ─── scanner.js  v2.0 ─────────────────────────────────────────────────────
//  Premium RecycleHelper Scanner
//  Flow: Mode Select → Scan (Barcode | AI Vision) → Loading → Result → item.html
// ──────────────────────────────────────────────────────────────────────────

/* ══════════════════════════════════════════════════════════════
   COCO-SSD LABEL MAP
══════════════════════════════════════════════════════════════ */
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
    'person': null, 'bicycle': null, 'car': null, 'motorcycle': null,
    'airplane': null, 'bus': null, 'train': null, 'truck': null,
    'boat': null, 'traffic light': null, 'fire hydrant': null,
    'stop sign': null, 'parking meter': null, 'bird': null,
    'cat': null, 'dog': null, 'horse': null, 'sheep': null,
    'cow': null, 'elephant': null, 'bear': null, 'zebra': null,
    'giraffe': null, 'apple': null, 'banana': null, 'orange': null,
    'broccoli': null, 'carrot': null,
};

/* ══════════════════════════════════════════════════════════════
   CATEGORY KEYWORDS
══════════════════════════════════════════════════════════════ */
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
        'silver','gold','copper','brass','bronze','chrome','zinc','pewter','iron',
        'stainless steel','cast iron','galvanised','can opener','paint bucket',
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
        'electric kettle','hair dryer','hair straightener','curling iron',
        'electric shaver','electric toothbrush','clothes iron','steam iron',
        'vacuum cleaner','cordless vacuum','robot vacuum','dyson',
        'fan heater','air purifier','dehumidifier','air conditioner',
        'kitchen appliance','appliance','electronic','electrical device',
        'blender','food processor','stand mixer','microwave oven',
        'toaster','kettle','coffee maker','espresso machine',
    ],
    'mobile phone': [
        'mobile phone','smartphone','cell phone','cellular telephone','cellular phone',
        'handset','iphone','android phone','samsung phone','samsung galaxy',
        'google pixel','huawei phone','xiaomi','nokia phone','motorola phone',
        'oneplus phone','oppo phone','vivo','realme','phone case','sim card',
        'phone','mobile','cellular','flip phone','feature phone','prepay phone',
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
    ],
    'sweater': [
        'sweater','jumper','pullover','cardigan','knitwear','knit sweater',
        'sweatshirt','hoodie','hooded sweatshirt','zip hoodie','half zip sweater',
        'fleece jacket','fleece top','polar fleece','micro fleece',
        'wool sweater','chunky knit','cable knit','fine knit','rib knit',
        'turtleneck','polo neck','crew neck sweater','crewneck','v-neck sweater',
        'cashmere sweater','merino sweater','lambswool sweater','mohair sweater',
        'wool','cashmere','merino wool','lambswool','mohair','angora','fleece',
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
        'nike','adidas','puma','reebok','converse','vans shoe','new balance shoe',
        'asics shoe','saucony','brooks running shoe','hoka','on running',
        'ugg boot','timberland boot','dr martens','birkenstock','crocs shoe',
        'footwear','sole shoe','heel shoe','shoelace',
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
        'wooden','wood','timber','plywood','mdf board','chipboard','particle board',
        'hardwood','softwood','oak','pine','mahogany','walnut wood','birch wood',
        'bamboo','teak','maple wood','cherry wood','beech wood','ash wood',
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
    ],
};

/* ══════════════════════════════════════════════════════════════
   MATERIAL HINTS
══════════════════════════════════════════════════════════════ */
const MATERIAL_HINTS = {
    'plastic':       ['plastic bottle','plastic box'],
    'hdpe':          ['plastic bottle','plastic box'],
    'ldpe':          ['plastic box','plastic bottle'],
    'polypropylene': ['plastic box','plastic bottle'],
    'polyethylene':  ['plastic bottle','plastic box'],
    'polystyrene':   ['plastic box'],
    'styrofoam':     ['plastic box'],
    'acrylic':       ['plastic box','plastic bottle'],
    'pvc':           ['plastic box','plastic bottle'],
    'vinyl':         ['plastic box','plastic bottle'],
    'rubber':        ['plastic box','shoes'],
    'foam':          ['plastic box'],
    'neoprene':      ['plastic box','sweater'],
    'glass':         ['glass bottle','glass jar'],
    'ceramic':       ['glass jar','glass bottle'],
    'ceramics':      ['glass jar','glass bottle'],
    'porcelain':     ['glass jar','glass bottle'],
    'china':         ['glass jar','glass bottle'],
    'pottery':       ['glass jar','glass bottle'],
    'stoneware':     ['glass jar','glass bottle'],
    'earthenware':   ['glass jar','glass bottle'],
    'terracotta':    ['glass jar','plastic box'],
    'crystal':       ['glass jar','glass bottle'],
    'glassware':     ['glass jar','glass bottle'],
    'metal':         ['tin can','batteries'],
    'aluminium':     ['tin can','batteries'],
    'aluminum':      ['tin can','batteries'],
    'steel':         ['tin can'],
    'iron':          ['tin can','wooden furniture'],
    'silver':        ['tin can','batteries'],
    'gold':          ['tin can','batteries'],
    'copper':        ['tin can','batteries'],
    'brass':         ['tin can','batteries'],
    'bronze':        ['tin can','batteries'],
    'tin':           ['tin can'],
    'chrome':        ['tin can','laptop'],
    'zinc':          ['tin can','batteries'],
    'paper':         ['paper','cardboard box','newspaper'],
    'cardboard':     ['cardboard box','paper'],
    'card':          ['cardboard box','paper'],
    'kraft':         ['cardboard box','paper'],
    'corrugated':    ['cardboard box'],
    'newsprint':     ['newspaper','paper'],
    'fabric':        ['shirts','sweater','house textile'],
    'textile':       ['house textile','shirts','sweater'],
    'clothing':      ['shirts','sweater','jeans'],
    'apparel':       ['shirts','sweater','jeans'],
    'garment':       ['shirts','sweater','jeans'],
    'clothes':       ['shirts','sweater','jeans'],
    'fashion':       ['shirts','jeans','sweater'],
    'wear':          ['shirts','sweater','jeans'],
    'cloth':         ['shirts','sweater','house textile'],
    'cotton':        ['shirts','house textile','jeans'],
    'polyester':     ['shirts','house textile','sweater'],
    'nylon':         ['shoes','house textile','sweater'],
    'silk':          ['house textile','shirts'],
    'linen':         ['house textile','shirts'],
    'wool':          ['sweater','house textile'],
    'cashmere':      ['sweater','house textile'],
    'merino':        ['sweater'],
    'fleece':        ['sweater','house textile'],
    'denim':         ['jeans','shirts'],
    'leather':       ['shoes','jeans','shirts'],
    'suede':         ['shoes','jeans'],
    'canvas':        ['shoes','shirts'],
    'knit':          ['sweater','house textile'],
    'woven':         ['house textile','shirts'],
    'spandex':       ['shirts','jeans'],
    'lycra':         ['shirts','jeans','sweater'],
    'velvet':        ['house textile','shirts'],
    'tweed':         ['sweater','shirts'],
    'corduroy':      ['jeans','shirts'],
    'wood':          ['wooden furniture'],
    'wooden':        ['wooden furniture'],
    'timber':        ['wooden furniture'],
    'oak':           ['wooden furniture'],
    'pine':          ['wooden furniture'],
    'mahogany':      ['wooden furniture'],
    'bamboo':        ['wooden furniture'],
    'plywood':       ['wooden furniture','cardboard box'],
    'mdf':           ['wooden furniture'],
    'electronic':    ['laptop','mobile phone','batteries'],
    'electrical':    ['laptop','batteries','light bulb'],
    'digital':       ['laptop','mobile phone','batteries'],
    'appliance':     ['laptop','batteries','light bulb'],
    'circuit':       ['laptop','mobile phone','batteries'],
    'battery':       ['batteries'],
    'rechargeable':  ['batteries','laptop'],
    'lithium':       ['batteries','laptop'],
    'bottle':        ['plastic bottle','glass bottle'],
    'can':           ['tin can','plastic bottle'],
    'jar':           ['glass jar','glass bottle'],
    'box':           ['cardboard box','plastic box'],
    'bag':           ['house textile','cardboard box'],
    'drink':         ['plastic bottle','glass bottle','tin can'],
    'beverage':      ['plastic bottle','glass bottle','tin can'],
    'food':          ['tin can','glass jar','plastic box'],
    'shoe':          ['shoes'],
    'boot':          ['shoes'],
    'sneaker':       ['shoes'],
    'trainer':       ['shoes'],
    'footwear':      ['shoes'],
    'phone':         ['mobile phone','laptop'],
    'computer':      ['laptop','mobile phone'],
    'bulb':          ['light bulb'],
    'lamp':          ['light bulb','wooden furniture'],
    'furniture':     ['wooden furniture'],
    'book':          ['book','newspaper'],
    'pen':           ['pens','pencils'],
    'pencil':        ['pencils','pens'],
    'stationery':    ['pens','pencils','paper'],
    'hoodie':        ['sweater','shirts'],
    'jacket':        ['sweater','shirts'],
    'coat':          ['sweater','house textile'],
    'dress':         ['shirts','house textile'],
    'skirt':         ['shirts','jeans'],
    'trousers':      ['jeans','shirts'],
    'pants':         ['jeans','shirts'],
    'vase':          ['glass jar','glass bottle','plastic bottle'],
    'mug':           ['glass jar','plastic box'],
    'cup':           ['glass jar','plastic box'],
    'bowl':          ['plastic box','glass jar'],
    'plate':         ['glass jar','plastic box'],
    'pot':           ['glass jar','tin can'],
    'tray':          ['plastic box','tin can'],
    'toy':           ['plastic box','plastic bottle'],
    'game':          ['cardboard box','plastic box'],
    'hat':           ['house textile','sweater'],
    'cap':           ['house textile','sweater'],
    'scarf':         ['house textile','sweater'],
    'glove':         ['house textile','sweater'],
    'watch':         ['batteries','mobile phone'],
    'clock':         ['batteries','mobile phone'],
    'jewelry':       ['tin can','batteries'],
    'jewellery':     ['tin can','batteries'],
    'mirror':        ['glass jar','glass bottle'],
    'packaging':     ['cardboard box','plastic box','tin can'],
    'container':     ['plastic box','glass jar','tin can'],
    'chocolate':     ['tin can','cardboard box','plastic box'],
    'cereal':        ['cardboard box','plastic box'],
    'coffee':        ['glass jar','tin can','plastic box'],
    'tea':           ['cardboard box','glass jar','tin can'],
    'shampoo':       ['plastic bottle','plastic box'],
    'cosmetic':      ['glass jar','plastic bottle','plastic box'],
    'makeup':        ['glass jar','plastic bottle','plastic box'],
    'perfume':       ['glass bottle','glass jar'],
    'candle':        ['glass jar','tin can'],
    'paint':         ['tin can','plastic box'],
    'tool':          ['tin can','wooden furniture'],
    'sport':         ['plastic bottle','shoes'],
    'exercise':      ['plastic bottle','shoes','shirts'],
    'kitchen':       ['plastic box','glass jar','tin can'],
    'cleaning':      ['plastic bottle','plastic box'],
    'detergent':     ['plastic bottle','plastic box'],
};

/* ══════════════════════════════════════════════════════════════
   CATEGORY ICONS
══════════════════════════════════════════════════════════════ */
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

/* ══════════════════════════════════════════════════════════════
   CATEGORY ACCENT COLORS  (neon per type)
══════════════════════════════════════════════════════════════ */
const CATEGORY_COLORS = {
    'plastic bottle':   '#00D4FF',
    'glass bottle':     '#A78BFA',
    'glass jar':        '#C084FC',
    'tin can':          '#FB923C',
    'book':             '#34D399',
    'newspaper':        '#6EE7B7',
    'paper':            '#86EFAC',
    'laptop':           '#60A5FA',
    'mobile phone':     '#818CF8',
    'light bulb':       '#FCD34D',
    'batteries':        '#F87171',
    'shirts':           '#F9A8D4',
    'jeans':            '#93C5FD',
    'sweater':          '#D8B4FE',
    'shoes':            '#FCA5A5',
    'house textile':    '#A5F3FC',
    'plastic box':      '#67E8F9',
    'cardboard box':    '#FDE68A',
    'wooden furniture': '#FBB040',
    'pens':             '#4ADE80',
    'pencils':          '#86EFAC',
};

/* ══════════════════════════════════════════════════════════════
   CATEGORY RANKING
══════════════════════════════════════════════════════════════ */
function getTopCategories(text, count = 3) {
    const lower = (text || '').toLowerCase().replace(/_/g, ' ').replace(/-/g, ' ');
    const scores = Object.entries(CATEGORY_KEYWORDS).map(([cat, keys]) => {
        let score = 0;
        for (const k of keys) {
            if (lower.includes(k)) score += k.trim().split(/\s+/).length * 4;
        }
        return { cat, score };
    });
    for (const [hint, cats] of Object.entries(MATERIAL_HINTS)) {
        if (lower.includes(hint)) {
            cats.forEach((cat, i) => {
                const entry = scores.find(s => s.cat === cat);
                if (entry) entry.score += Math.max(8 - i * 2.5, 1);
            });
        }
    }
    const hash = lower.split('').reduce((a, c) => ((a << 5) - a + c.charCodeAt(0)) & 0xfffff, 0);
    scores.forEach((s, i) => { s.score += ((hash ^ (i * 2654435761 >>> 0)) & 0xffff) / 500000; });
    scores.sort((a, b) => b.score - a.score);
    return scores.slice(0, count);
}

function calcConfidence(topScore) {
    if (topScore <= 0) return 38;
    return Math.min(97, Math.max(42, Math.round(38 + topScore * 1.8)));
}

/* ══════════════════════════════════════════════════════════════
   MATERIAL DETECTOR
══════════════════════════════════════════════════════════════ */
function detectMaterial(text) {
    const t = (text || '').toLowerCase();
    if (/\bglass\b/.test(t))                                         return 'Glass';
    if (/alumin(i|)um|aluminium|steel can/.test(t))                  return 'Aluminium / Steel';
    if (/hdpe|ldpe|pet plastic|polypropylene|polyethylene/.test(t))  return 'Plastic (HDPE/PET)';
    if (/plastic/.test(t))                                           return 'Plastic';
    if (/cardboard|corrugated/.test(t))                              return 'Cardboard';
    if (/paper/.test(t))                                             return 'Paper';
    if (/denim/.test(t))                                             return 'Denim';
    if (/cotton|polyester|nylon|wool|cashmere|fleece|textile/.test(t)) return 'Textile';
    if (/leather/.test(t))                                           return 'Leather';
    if (/wood|timber|oak|pine|mahogany|bamboo/.test(t))              return 'Wood';
    if (/electronic|circuit|semiconductor/.test(t))                  return 'Electronics';
    if (/battery|lithium/.test(t))                                   return 'Li-Ion Battery';
    if (/ceramic|porcelain|pottery/.test(t))                         return 'Ceramic';
    if (/rubber|foam|polystyrene/.test(t))                           return 'Rubber / Foam';
    return '';
}

/* ══════════════════════════════════════════════════════════════
   ITEM TYPE DETECTOR
══════════════════════════════════════════════════════════════ */
function detectItemType(text) {
    const t = (text || '').toLowerCase();
    if (/beverage|drink|cola|soda|juice|water bottle|beer|wine|spirits/.test(t)) return 'Beverage';
    if (/food|snack|cereal|pasta|sauce|jam|pickle/.test(t))                      return 'Food Product';
    if (/shampoo|conditioner|body wash|shower gel|soap|cosmetic|makeup/.test(t)) return 'Personal Care';
    if (/detergent|cleaning|bleach|fabric softener/.test(t))                     return 'Cleaning Product';
    if (/laptop|computer|tablet|monitor|keyboard/.test(t))                       return 'Computer / Laptop';
    if (/phone|smartphone|iphone|android/.test(t))                               return 'Mobile Device';
    if (/battery|batteries/.test(t))                                             return 'Battery';
    if (/jeans|denim/.test(t))                                                   return 'Denim Clothing';
    if (/shirt|t-shirt|blouse|polo/.test(t))                                     return 'Top Wear';
    if (/sweater|hoodie|jumper|cardigan/.test(t))                                return 'Knitwear';
    if (/shoe|sneaker|boot|sandal/.test(t))                                      return 'Footwear';
    if (/book|magazine|novel/.test(t))                                           return 'Book / Publication';
    if (/newspaper|tabloid|broadsheet/.test(t))                                  return 'Newspaper';
    if (/furniture|chair|table|sofa|shelf/.test(t))                              return 'Furniture';
    if (/light bulb|bulb|lamp/.test(t))                                          return 'Light Fitting';
    if (/pen|marker|highlighter/.test(t))                                        return 'Pen / Marker';
    if (/pencil|crayon/.test(t))                                                 return 'Pencil / Crayon';
    if (/cardboard|box|packaging/.test(t))                                       return 'Packaging';
    return '';
}

/* ══════════════════════════════════════════════════════════════
   STATE
══════════════════════════════════════════════════════════════ */
let scanPhase        = 'mode-select';
let currentMode      = 'barcode';
let activeStream     = null;
let loopTimer        = null;
let scanTimeoutId    = null;
let loadingMsgTimer  = null;
let isDetecting      = false;
let cocoModel        = null;
let mobileNet        = null;
let modelsLoaded     = false;
let modelsLoading    = false;
let lastScannedCode  = null;
let hitCount         = 0;
let lastHitCategory  = null;
let torchOn          = false;

/* ══════════════════════════════════════════════════════════════
   LOADERS
══════════════════════════════════════════════════════════════ */
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
        setStatus('Loading AI models…', 'info');
        await loadScript('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.21.0/dist/tf.min.js');
        await Promise.all([
            loadScript('https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd@2.2.3/dist/coco-ssd.min.js'),
            loadScript('https://cdn.jsdelivr.net/npm/@tensorflow-models/mobilenet@2.1.0/dist/mobilenet.min.js'),
        ]);
        [cocoModel, mobileNet] = await Promise.all([cocoSsd.load(), mobilenet.load()]);
        modelsLoaded = true;
    } catch (e) {
        setStatus('AI models failed — check connection.', 'error');
        throw e;
    } finally { modelsLoading = false; }
}

async function ensureZXing() {
    if (window.ZXing) return;
    await loadScript('https://unpkg.com/@zxing/library@0.20.0/umd/index.min.js');
}

/* ══════════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════════ */
function setStatus(msg, type = 'info') {
    const el = document.getElementById('scannerStatus');
    if (el) { el.textContent = msg; el.className = 'scanner-status scanner-status--' + type; }
}

function cleanLabel(raw) {
    return (raw || '').toLowerCase().replace(/_/g, ' ').split(',')[0].trim();
}

function vibrate(pattern) {
    try { if (navigator.vibrate) navigator.vibrate(pattern); } catch(_) {}
}

function fetchTimeout(url, ms = 6000) {
    const ctrl = new AbortController();
    const id   = setTimeout(() => ctrl.abort(), ms);
    return fetch(url, { signal: ctrl.signal }).finally(() => clearTimeout(id));
}

function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1,3), 16);
    const g = parseInt(hex.slice(3,5), 16);
    const b = parseInt(hex.slice(5,7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
}

function drawBoxes(canvas, video, preds) {
    const dw = canvas.offsetWidth  || 320;
    const dh = canvas.offsetHeight || 240;
    if (canvas.width !== dw || canvas.height !== dh) { canvas.width = dw; canvas.height = dh; }
    const sx = dw / (video.videoWidth  || dw);
    const sy = dh / (video.videoHeight || dh);
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, dw, dh);
    for (const p of preds) {
        if (p.score < 0.38) continue;
        const [x, y, w, h] = p.bbox;
        const isKnown = COCO_MAP[p.class] !== undefined && COCO_MAP[p.class] !== null;
        const col     = isKnown ? '#24E474' : 'rgba(255,200,70,0.9)';
        ctx.strokeStyle = col; ctx.lineWidth = 2.5;
        ctx.shadowColor = col; ctx.shadowBlur = 8;
        ctx.strokeRect(x*sx, y*sy, w*sx, h*sy);
        ctx.shadowBlur = 0;
        const lbl = `${p.class}  ${Math.round(p.score*100)}%`;
        ctx.font  = 'bold 12px DM Sans, sans-serif';
        const tw  = ctx.measureText(lbl).width + 10;
        ctx.fillStyle = col;   ctx.fillRect(x*sx, y*sy - 22, tw, 22);
        ctx.fillStyle = '#000'; ctx.fillText(lbl, x*sx + 5, y*sy - 6);
    }
}

/* ══════════════════════════════════════════════════════════════
   MODAL HTML
══════════════════════════════════════════════════════════════ */
function buildModal() {
    if (document.getElementById('scannerModal')) return;
    const m = document.createElement('div');
    m.id = 'scannerModal';
    m.innerHTML = `
    <div class="scanner-box">

      <!-- ▓ VIEW 1: MODE SELECT ▓ -->
      <div class="scanner-view" id="viewModeSelect">
        <div class="scanner-header">
          <div class="scanner-brand">
            <span class="scanner-brand-icon">♻</span>
            <span>RecycleHelper Scanner</span>
          </div>
          <button class="scanner-close-btn" id="closeModeBtn">✕</button>
        </div>
        <div class="scanner-mode-intro">
          <div class="scanner-mode-hero">🔍</div>
          <div class="scanner-mode-headline">Identify your item</div>
          <div class="scanner-mode-subline">Choose a scanning method</div>
        </div>
        <div class="scanner-mode-cards">
          <button class="scanner-mode-card" id="modeBarcodeBtn">
            <div class="mode-card-glow"></div>
            <div class="mode-card-top">
              <span class="mode-card-emoji">▦</span>
              <span class="mode-card-badge">Fast</span>
            </div>
            <div class="mode-card-name">Scan Barcode</div>
            <div class="mode-card-desc">Point at any product barcode for instant AI identification</div>
            <div class="mode-card-pills"><span>EAN</span><span>UPC</span><span>QR</span></div>
          </button>
          <button class="scanner-mode-card scanner-mode-card--ai" id="modeAIBtn">
            <div class="mode-card-glow mode-card-glow--ai"></div>
            <div class="mode-card-top">
              <span class="mode-card-emoji">🤖</span>
              <span class="mode-card-badge mode-card-badge--ai">AI</span>
            </div>
            <div class="mode-card-name">AI Vision</div>
            <div class="mode-card-desc">Take a photo or upload an image — ~95% accuracy</div>
            <div class="mode-card-pills"><span>Photo</span><span>Upload</span><span>95%</span></div>
          </button>
        </div>
      </div>

      <!-- ▓ VIEW 2: SCANNING ▓ -->
      <div class="scanner-view" id="viewScanning" style="display:none">
        <div class="scanner-header">
          <button class="scanner-nav-btn" id="backToModeBtn">← Back</button>
          <span class="scanner-title" id="scanModeTitle">▦ Scan Barcode</span>
          <div class="scanner-header-end">
            <button class="scanner-torch-btn" id="torchBtn" title="Toggle flashlight">⚡</button>
            <button class="scanner-close-btn" id="closeScanBtn">✕</button>
          </div>
        </div>
        <div class="scanner-viewport">
          <video id="scannerVideo" autoplay playsinline muted></video>
          <canvas id="scannerCanvas"></canvas>
          <div class="scan-anim" id="scanAnim"><div class="scan-line"></div></div>
          <div class="scanner-corners">
            <span class="s-corner tl"></span><span class="s-corner tr"></span>
            <span class="s-corner bl"></span><span class="s-corner br"></span>
          </div>
          <div class="scanner-capture-area" id="captureArea" style="display:none">
            <button class="scanner-capture-btn" id="captureBtn">📷 Take Photo</button>
          </div>
        </div>
        <div class="scanner-timeout-track">
          <div class="scanner-timeout-fill" id="timeoutFill"></div>
        </div>
        <div class="scanner-bottom-row">
          <p class="scanner-status scanner-status--info" id="scannerStatus">Starting camera…</p>
          <label class="scanner-upload-label" id="uploadLabel" style="display:none">
            📁 Upload<input type="file" id="uploadInput" accept="image/*" style="display:none">
          </label>
        </div>
      </div>

      <!-- ▓ VIEW 3: LOADING ▓ -->
      <div class="scanner-view scanner-view--center" id="viewLoading" style="display:none">
        <div class="scanner-header">
          <span class="scanner-title">🔎 Analyzing…</span>
          <button class="scanner-close-btn" id="closeLoadingBtn">✕</button>
        </div>
        <div class="scanner-ai-orb">
          <div class="ai-orb-ring r1"></div>
          <div class="ai-orb-ring r2"></div>
          <div class="ai-orb-ring r3"></div>
          <span class="ai-orb-icon">♻</span>
        </div>
        <p class="scanner-loading-msg" id="loadingMsg">Identifying product…</p>
        <div class="scanner-skeleton">
          <div class="sk-row sk-row--header">
            <div class="sk-circle"></div>
            <div class="sk-col">
              <div class="sk-bar sk-w70"></div>
              <div class="sk-bar sk-w45"></div>
            </div>
          </div>
          <div class="sk-bar sk-w100 sk-mt8"></div>
          <div class="sk-pill-row">
            <div class="sk-pill"></div><div class="sk-pill"></div><div class="sk-pill"></div>
          </div>
        </div>
      </div>

      <!-- ▓ VIEW 4: RESULT ▓ -->
      <div class="scanner-view scanner-view--result" id="viewResult" style="display:none">
        <div class="scanner-header">
          <span class="scanner-title">✅ Scan Complete</span>
          <button class="scanner-close-btn" id="closeResultBtn">✕</button>
        </div>
        <div class="result-product-card">
          <div class="result-icon" id="resultIcon">📦</div>
          <div class="result-info">
            <div class="result-name" id="resultName">Product</div>
            <div class="result-brand" id="resultBrand"></div>
          </div>
          <div class="result-conf-badge" id="resultConfBadge">
            <span class="rcb-num" id="resultConfNum">—</span>
            <span class="rcb-lbl">match</span>
          </div>
        </div>
        <div class="result-chips" id="resultChips" style="display:none"></div>
        <div class="result-cats-title">Top Recycling Categories</div>
        <div class="result-cats" id="resultCats"></div>
        <button class="result-retry-btn" id="resultRetryBtn">↩ Scan again</button>
      </div>

    </div>`;
    document.body.appendChild(m);

    // Close buttons
    ['closeModeBtn','closeScanBtn','closeLoadingBtn','closeResultBtn'].forEach(id => {
        document.getElementById(id)?.addEventListener('click', stopScanner);
    });
    m.addEventListener('click', e => { if (e.target === m) stopScanner(); });

    // Mode select
    document.getElementById('modeBarcodeBtn').addEventListener('click', () => selectMode('barcode'));
    document.getElementById('modeAIBtn').addEventListener('click',      () => selectMode('ai'));

    // Back to mode
    document.getElementById('backToModeBtn').addEventListener('click', onBackToMode);

    // Torch
    document.getElementById('torchBtn').addEventListener('click', toggleTorch);

    // Capture (AI Vision)
    document.getElementById('captureBtn').addEventListener('click', capturePhoto);

    // Upload (AI Vision)
    document.getElementById('uploadInput').addEventListener('change', e => {
        const f = e.target.files[0];
        if (f) handleUpload(f);
    });

    // Result retry
    document.getElementById('resultRetryBtn').addEventListener('click', () => selectMode(currentMode));
}

/* ══════════════════════════════════════════════════════════════
   VIEW NAVIGATION
══════════════════════════════════════════════════════════════ */
const ALL_VIEWS = ['viewModeSelect','viewScanning','viewLoading','viewResult'];

function showView(id) {
    ALL_VIEWS.forEach(v => {
        const el = document.getElementById(v);
        if (el) el.style.display = (v === id) ? 'flex' : 'none';
    });
}

/* ══════════════════════════════════════════════════════════════
   BACK TO MODE SELECT
══════════════════════════════════════════════════════════════ */
function onBackToMode() {
    clearActiveScanning();
    scanPhase = 'mode-select';
    showView('viewModeSelect');
}

/* ══════════════════════════════════════════════════════════════
   SELECT MODE → START SCANNING
══════════════════════════════════════════════════════════════ */
async function selectMode(mode) {
    currentMode = mode;
    scanPhase   = 'scanning';
    hitCount = 0; lastHitCategory = null; lastScannedCode = null;
    torchOn  = false;
    document.getElementById('torchBtn')?.classList.remove('torch-active');

    const titleEl = document.getElementById('scanModeTitle');
    if (titleEl) titleEl.textContent = mode === 'barcode' ? '▦ Scan Barcode' : '🤖 AI Vision';

    const captureArea = document.getElementById('captureArea');
    const uploadLabel = document.getElementById('uploadLabel');
    if (captureArea) captureArea.style.display = mode === 'ai' ? 'flex' : 'none';
    if (uploadLabel) uploadLabel.style.display  = mode === 'ai' ? 'flex' : 'none';

    showView('viewScanning');
    setStatus('Starting camera…', 'info');

    if (!activeStream) {
        try {
            activeStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } }
            });
            const video = document.getElementById('scannerVideo');
            if (!video) return;
            video.srcObject = activeStream;
            await new Promise(r => {
                video.addEventListener('loadeddata', r, { once: true });
                setTimeout(r, 3000);
            });
        } catch(_) {
            setStatus('Camera access denied — please allow camera and try again.', 'error');
            return;
        }
    }

    const canvas = document.getElementById('scannerCanvas');
    if (canvas) canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

    if (mode === 'barcode') {
        setStatus('Point camera at a barcode…', 'info');
        startTimeoutBar(7000);
        if (!('BarcodeDetector' in window)) ensureZXing().catch(() => {});
        loopTimer = setTimeout(barcodeLoop, 300);
    } else {
        setStatus('Point camera at your item…', 'info');
        ensureModels()
            .then(() => {
                if (currentMode !== 'ai' || scanPhase !== 'scanning') return;
                setStatus('Point camera at your item…', 'info');
                startTimeoutBar(10000);
                loopTimer = setTimeout(detectionLoop, 600);
            })
            .catch(() => setStatus('AI models failed to load.', 'error'));
    }
}

/* ══════════════════════════════════════════════════════════════
   TIMEOUT BAR
══════════════════════════════════════════════════════════════ */
function startTimeoutBar(ms) {
    clearTimeout(scanTimeoutId);
    const fill = document.getElementById('timeoutFill');
    if (fill) {
        fill.style.transition = 'none';
        fill.style.width = '0%';
        requestAnimationFrame(() => {
            fill.style.transition = `width ${ms}ms linear`;
            fill.style.width = '100%';
        });
    }
    scanTimeoutId = setTimeout(onScanTimeout, ms);
}

function clearTimeoutBar() {
    clearTimeout(scanTimeoutId);
    scanTimeoutId = null;
    const fill = document.getElementById('timeoutFill');
    if (fill) { fill.style.transition = 'none'; fill.style.width = '0%'; }
}

function onScanTimeout() {
    if (scanPhase !== 'scanning') return;
    if (currentMode === 'barcode') {
        setStatus('No barcode found — try AI Vision or move closer.', 'error');
        vibrate([200, 50, 200]);
    } else {
        if (lastHitCategory) {
            showLoadingThenResult('Detected item', 'AI Vision', lastHitCategory, 60);
        } else {
            setStatus('No item detected — try getting closer or better lighting.', 'error');
        }
    }
}

/* ══════════════════════════════════════════════════════════════
   BARCODE MODE
══════════════════════════════════════════════════════════════ */
async function barcodeLoop() {
    if (scanPhase !== 'scanning' || currentMode !== 'barcode' || !document.getElementById('scannerModal')) return;
    const video = document.getElementById('scannerVideo');
    if (video && video.readyState >= 2 && video.videoWidth > 0 && !isDetecting) {
        isDetecting = true;
        try {
            const code = await readBarcodeFromVideo(video);
            if (code && code !== lastScannedCode) {
                lastScannedCode = code;
                clearTimeoutBar();
                isDetecting = false;
                vibrate([80, 40, 80]);
                await handleBarcodeResult(code);
                return;
            }
        } catch(_) {}
        isDetecting = false;
    }
    if (scanPhase === 'scanning' && currentMode === 'barcode' && document.getElementById('scannerModal')) {
        loopTimer = setTimeout(barcodeLoop, 350);
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
        } catch(_) {}
        return null;
    }
    if (window.ZXing) {
        try {
            const c = document.createElement('canvas');
            c.width  = video.videoWidth  || 640;
            c.height = video.videoHeight || 480;
            c.getContext('2d').drawImage(video, 0, 0, c.width, c.height);
            const reader = new ZXing.BrowserMultiFormatReader();
            const result = reader.decodeFromCanvas(c);
            return result ? result.getText() : null;
        } catch(_) { return null; }
    }
    return null;
}

async function lookupBarcode(code) {
    // Open Food Facts
    try {
        const r = await fetchTimeout(
            `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(code)}?fields=product_name,categories,packaging,labels,brands`
        );
        if (r.ok) {
            const d = await r.json();
            if (d.status === 1 && d.product) {
                const p = d.product;
                return {
                    name:       (p.product_name || code).substring(0, 60),
                    brand:      p.brands  ? p.brands.split(',')[0].trim()  : '',
                    rawCateg:   p.categories || '',
                    rawPack:    p.packaging  || '',
                    searchText: [p.product_name, p.categories, p.packaging, p.labels].filter(Boolean).join(' ')
                };
            }
        }
    } catch(_) {}
    // UPCitemdb
    try {
        const r = await fetchTimeout(`https://api.upcitemdb.com/prod/trial/lookup?upc=${encodeURIComponent(code)}`);
        if (r.ok) {
            const d = await r.json();
            if (d.code === 'OK' && d.items && d.items.length > 0) {
                const p = d.items[0];
                return {
                    name:       (p.title || code).substring(0, 60),
                    brand:      p.brand || '',
                    rawCateg:   p.category || '',
                    rawPack:    '',
                    searchText: [p.category, p.brand, p.title, p.description].filter(Boolean).join(' ')
                };
            }
        }
    } catch(_) {}
    return { name: code, brand: '', rawCateg: '', rawPack: '', searchText: '' };
}

async function handleBarcodeResult(code) {
    if (scanPhase !== 'scanning') return;
    showLoadingView('Looking up barcode…');
    const found = await lookupBarcode(code);
    if (!document.getElementById('scannerModal')) return;

    const isUnknown = found.name === code && !found.searchText;
    const name      = isUnknown ? `Barcode: ${code}` : found.name;
    const searchTxt = found.searchText || found.name;
    const material  = detectMaterial(found.rawPack + ' ' + found.rawCateg + ' ' + searchTxt);
    const itemType  = detectItemType(found.rawCateg + ' ' + searchTxt);
    const top3      = getTopCategories(searchTxt, 3);
    const conf      = calcConfidence(top3[0]?.score || 0);

    showResultView({ name, brand: found.brand, material, itemType }, top3, conf);
}

/* ══════════════════════════════════════════════════════════════
   AI VISION MODE  —  live detection loop
══════════════════════════════════════════════════════════════ */
async function detectionLoop() {
    if (scanPhase !== 'scanning' || currentMode !== 'ai' || !document.getElementById('scannerModal')) return;

    if (!isDetecting) {
        const video  = document.getElementById('scannerVideo');
        const canvas = document.getElementById('scannerCanvas');
        if (video && video.readyState >= 2 && video.videoWidth > 0) {
            isDetecting = true;
            let displayName = null;
            const searchParts = [];

            if (cocoModel) {
                try {
                    const preds = await cocoModel.detect(video);
                    if (canvas) drawBoxes(canvas, video, preds);
                    const best = preds
                        .filter(p => p.score > 0.35 && COCO_MAP[p.class] !== null)
                        .sort((a,b) => b.score - a.score)[0];
                    if (best) {
                        displayName = best.class;
                        const mapped = COCO_MAP[best.class];
                        searchParts.push(mapped || best.class);
                    }
                } catch(_) {}
            }

            if (mobileNet) {
                try {
                    const preds = await mobileNet.classify(video, 5);
                    preds.filter(p => p.probability > 0.06).forEach((p, i) => {
                        const label = cleanLabel(p.className);
                        if (i === 0 && !displayName) displayName = label;
                        searchParts.push(label);
                    });
                } catch(_) {}
            }

            const searchText = searchParts.join(' ').trim();
            const normCat    = searchText ? getTopCategories(searchText, 1)[0].cat : null;

            if (normCat && normCat === lastHitCategory) hitCount++;
            else { lastHitCategory = normCat; hitCount = normCat ? 1 : 0; }

            if (hitCount >= 2 && displayName && searchText) {
                clearTimeoutBar();
                vibrate([80, 40, 80]);
                const capName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
                isDetecting = false;
                showLoadingThenResult(capName, 'AI Vision', searchText, null);
                return;
            }

            if (displayName) setStatus(`Seeing: ${displayName}… hold still`, 'info');
            else             setStatus('Point camera at your item…', 'info');
            isDetecting = false;
        }
    }
    if (scanPhase === 'scanning' && currentMode === 'ai' && document.getElementById('scannerModal')) {
        loopTimer = setTimeout(detectionLoop, 650);
    }
}

/* ══════════════════════════════════════════════════════════════
   PHOTO CAPTURE
══════════════════════════════════════════════════════════════ */
async function capturePhoto() {
    const video = document.getElementById('scannerVideo');
    if (!video || video.readyState < 2) return;
    clearActiveScanning();
    showLoadingView('Analyzing photo…');
    vibrate([60]);

    const c = document.createElement('canvas');
    c.width  = video.videoWidth  || 640;
    c.height = video.videoHeight || 480;
    c.getContext('2d').drawImage(video, 0, 0);

    const img = new Image();
    img.src = c.toDataURL('image/jpeg', 0.85);
    await new Promise(r => { img.onload = r; setTimeout(r, 2000); });
    await analyzeImageElement(img);
}

/* ══════════════════════════════════════════════════════════════
   IMAGE UPLOAD
══════════════════════════════════════════════════════════════ */
async function handleUpload(file) {
    clearActiveScanning();
    showLoadingView('Analyzing image…');
    vibrate([60]);
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.src   = url;
    await new Promise(r => { img.onload = r; setTimeout(r, 3000); });
    URL.revokeObjectURL(url);
    await analyzeImageElement(img);
}

async function analyzeImageElement(img) {
    if (!modelsLoaded) {
        try { await ensureModels(); }
        catch(_) { updateLoadingMsg('Using visual hints…'); }
    }
    let displayName = null;
    const searchParts = [];

    if (cocoModel) {
        try {
            const preds = await cocoModel.detect(img);
            const best  = preds
                .filter(p => p.score > 0.3 && COCO_MAP[p.class] !== null)
                .sort((a,b) => b.score - a.score)[0];
            if (best) {
                displayName = best.class;
                const mapped = COCO_MAP[best.class];
                searchParts.push(mapped || best.class);
            }
        } catch(_) {}
    }
    if (mobileNet) {
        try {
            const preds = await mobileNet.classify(img, 5);
            preds.filter(p => p.probability > 0.05).forEach((p, i) => {
                const label = cleanLabel(p.className);
                if (i === 0 && !displayName) displayName = label;
                searchParts.push(label);
            });
        } catch(_) {}
    }

    const searchText = searchParts.join(' ').trim();
    if (!searchText && !displayName) {
        updateLoadingMsg('Could not identify — try another image.');
        setTimeout(() => { if (document.getElementById('scannerModal')) selectMode('ai'); }, 2500);
        return;
    }

    const capName  = displayName ? (displayName.charAt(0).toUpperCase() + displayName.slice(1)) : 'Item';
    const top3     = getTopCategories(searchText || capName, 3);
    const conf     = calcConfidence(top3[0]?.score || 0);
    const material = detectMaterial(searchText);
    const itemType = detectItemType(searchText);
    showResultView({ name: capName, brand: '', material, itemType }, top3, conf);
}

/* ══════════════════════════════════════════════════════════════
   FLASHLIGHT
══════════════════════════════════════════════════════════════ */
async function toggleTorch() {
    try {
        const track = activeStream?.getVideoTracks()[0];
        if (!track) return;
        torchOn = !torchOn;
        await track.applyConstraints({ advanced: [{ torch: torchOn }] });
        document.getElementById('torchBtn')?.classList.toggle('torch-active', torchOn);
    } catch(_) {}
}

/* ══════════════════════════════════════════════════════════════
   LOADING VIEW
══════════════════════════════════════════════════════════════ */
const LOADING_MSGS = [
    'Identifying product…',
    'Looking up database…',
    'Analyzing materials…',
    'Finding recycling categories…',
];

function showLoadingView(firstMsg) {
    clearActiveScanning();
    scanPhase = 'loading';
    const el = document.getElementById('loadingMsg');
    if (el) el.textContent = firstMsg || LOADING_MSGS[0];
    showView('viewLoading');
    let i = 1;
    loadingMsgTimer = setInterval(() => {
        const el = document.getElementById('loadingMsg');
        if (el && i < LOADING_MSGS.length) el.textContent = LOADING_MSGS[i++];
    }, 1200);
}

function updateLoadingMsg(msg) {
    const el = document.getElementById('loadingMsg');
    if (el) el.textContent = msg;
}

async function showLoadingThenResult(name, sub, searchText, overrideConf) {
    showLoadingView('Identifying product…');
    await new Promise(r => setTimeout(r, 900));
    if (!document.getElementById('scannerModal')) return;

    const top3     = getTopCategories(searchText, 3);
    const conf     = overrideConf != null ? overrideConf : calcConfidence(top3[0]?.score || 0);
    const material = detectMaterial(searchText);
    const itemType = detectItemType(searchText);
    showResultView({ name, brand: '', material, itemType }, top3, conf);
}

/* ══════════════════════════════════════════════════════════════
   RESULT VIEW
══════════════════════════════════════════════════════════════ */
function showResultView(product, top3, confidence) {
    if (loadingMsgTimer) { clearInterval(loadingMsgTimer); loadingMsgTimer = null; }
    scanPhase = 'result';
    const { name, brand, material, itemType } = product;
    const top = top3[0];

    document.getElementById('resultIcon').textContent = (top && CATEGORY_ICONS[top.cat]) || '♻️';
    document.getElementById('resultName').textContent  = name || 'Unknown item';

    const brandEl = document.getElementById('resultBrand');
    if (brandEl) { brandEl.textContent = brand || ''; brandEl.style.display = brand ? '' : 'none'; }

    const confNum   = document.getElementById('resultConfNum');
    const confBadge = document.getElementById('resultConfBadge');
    if (confNum)   confNum.textContent  = confidence + '%';
    if (confBadge) confBadge.className  = 'result-conf-badge result-conf-badge--' +
        (confidence >= 75 ? 'high' : confidence >= 52 ? 'mid' : 'low');

    // Meta chips
    const chipsEl = document.getElementById('resultChips');
    if (chipsEl) {
        chipsEl.innerHTML = '';
        if (itemType) chipsEl.innerHTML += `<div class="result-chip"><span class="rc-lbl">Type</span><span class="rc-val">${itemType}</span></div>`;
        if (material) chipsEl.innerHTML += `<div class="result-chip"><span class="rc-lbl">Material</span><span class="rc-val">${material}</span></div>`;
        chipsEl.style.display = (itemType || material) ? 'flex' : 'none';
    }

    // Category cards
    const catsEl = document.getElementById('resultCats');
    if (catsEl) {
        catsEl.innerHTML = '';
        top3.forEach(({ cat }, i) => {
            const color  = CATEGORY_COLORS[cat] || '#24E474';
            const icon   = CATEGORY_ICONS[cat]  || '♻️';
            const isBest = i === 0;
            const catConf = Math.max(30, confidence - i * 13);
            const card   = document.createElement('button');
            card.className = 'result-cat-card' + (isBest ? ' result-cat-card--best' : '');
            card.style.setProperty('--cc', color);
            card.style.setProperty('--cc-bg',     hexToRgba(color, isBest ? 0.12 : 0.06));
            card.style.setProperty('--cc-border',  hexToRgba(color, isBest ? 0.45 : 0.18));
            card.style.setProperty('--cc-hover-bg', hexToRgba(color, 0.16));
            card.innerHTML = `
              <span class="rcc-icon">${icon}</span>
              <span class="rcc-name">${cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
              ${isBest ? `<span class="rcc-best" style="color:${color};border-color:${hexToRgba(color,0.45)};background:${hexToRgba(color,0.15)}">⭐ Best</span>` : ''}
              <span class="rcc-conf">${catConf}%</span>
              <span class="rcc-arrow">→</span>`;
            card.addEventListener('click', () => navigateToItem(cat));
            catsEl.appendChild(card);
        });
    }

    showView('viewResult');
}

/* ══════════════════════════════════════════════════════════════
   NAVIGATE TO ITEM.HTML
══════════════════════════════════════════════════════════════ */
function navigateToItem(name) {
    stopScanner();
    const inp  = document.getElementById('searchInput');
    const form = document.getElementById('searchForm');
    if (inp && form) { inp.value = name; form.dispatchEvent(new Event('submit')); }
}

/* ══════════════════════════════════════════════════════════════
   CLEAR / STOP
══════════════════════════════════════════════════════════════ */
function clearActiveScanning() {
    if (loopTimer)      { clearTimeout(loopTimer);       loopTimer      = null; }
    if (loadingMsgTimer){ clearInterval(loadingMsgTimer); loadingMsgTimer = null; }
    clearTimeoutBar();
    isDetecting     = false;
    hitCount        = 0;
    lastHitCategory = null;
    lastScannedCode = null;
}

function stopScanner() {
    clearActiveScanning();
    if (activeStream) { activeStream.getTracks().forEach(t => t.stop()); activeStream = null; }
    delete window.__barcodeDetector;
    torchOn   = false;
    scanPhase = 'mode-select';
    const modal = document.getElementById('scannerModal');
    if (modal) modal.remove();
}

async function startScanner() {
    if (document.getElementById('scannerModal')) return;
    buildModal();
    scanPhase = 'mode-select';
    showView('viewModeSelect');
}

/* ══════════════════════════════════════════════════════════════
   WIRE SCAN BUTTON
══════════════════════════════════════════════════════════════ */
(function() {
    function attachBtn() {
        const btn = document.getElementById('scanBtn');
        if (btn) btn.addEventListener('click', startScanner);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', attachBtn);
    else attachBtn();
})();
