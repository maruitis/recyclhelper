const itemDatabase = {
    "plastic bottle": {
        detail: "Is the cap still on?",
        group: "plastic",
        savings: { water: 5, co2: 0.1, energy: 0.5 },
        map: "plastic recycling",
       diys: [
    { name: "Self-Watering Planter", needs: "Bottle, string, soil", steps: ["Cut bottle in half.", "Drill hole in cap.", "Thread string through.", "Fill top with soil.", "Place in water base."] },
    { name: "Hanging Bird Feeder", needs: "Bottle, 2 wooden spoons", steps: ["Make holes for spoons.", "Insert spoons as perches.", "Fill with birdseed.", "Tie string to neck.", "Hang on a tree branch."] },
    { name: "Desk Pencil Cup", needs: "Bottle, iron, scissors", steps: ["Cut bottom 10cm off.", "Heat iron to medium.", "Press cut edge to iron.", "Wait for edge to curl.", "Decorate with stickers."] }
]
    },
    "glass bottle": {
        detail: "Is it non-tempered glass?",
        group: "glass",
        savings: { water: 2, co2: 0.3, energy: 1.2 },
        map: "glass recycling",
      diys: [
    { name: "Dish Soap Dispenser", needs: "Bottle, pour spout", steps: ["Clean bottle thoroughly.", "Remove all labels.", "Fill with liquid soap.", "Insert pour spout.", "Place by the sink."] },
    { name: "Table Centerpiece", needs: "Bottle, paint, twine", steps: ["Paint bottle white.", "Wrap twine around neck.", "Let paint dry fully.", "Insert a single flower.", "Group 3 for a set."] },
    { name: "Glass Lamp", needs: "Bottle, fairy lights", steps: ["Wash bottle inside.", "Dry it completely.", "Insert LED string lights.", "Hide wire at the back.", "Turn on for a nightlight."] }
]  
    },
    "book": {
        detail: "Is it a hardcover book?",
        group: "paper",
        savings: { water: 10, co2: 0.5, energy: 2 },
        map: "library donation",
       diys: [
    { name: "Hidden Safe", needs: "Old book, glue, cutter", steps: ["Glue page edges shut.", "Draw rectangle on page 1.", "Cut out center of pages.", "Let dry for 24 hours.", "Hide your valuables."] },
    { name: "Book Planter", needs: "Thick book, plastic, succulent", steps: ["Cut hole in center.", "Line with plastic sheet.", "Add small layer of soil.", "Plant the succulent.", "Keep on a sunny shelf."] },
    { name: "Floating Shelf", needs: "Hardcover, L-brackets", steps: ["Screw bracket to wall.", "Slide book over bracket.", "Glue cover to bracket.", "Secure with a screw.", "Stack small items on top."] }
]
    },
    "paper": {
        detail: "Is it glossy or matte?",
        group: "paper",
        savings: { water: 1, co2: 0.05, energy: 0.2 },
        map: "paper recycling bin",
        diys: [
    { name: "Seed Paper", needs: "Scraps, water, seeds", steps: ["Blend paper into pulp.", "Mix in flower seeds.", "Press flat on a towel.", "Let dry for 2 days.", "Plant it in the ground."] },
    { name: "Gift Bows", needs: "Magazine pages, tape", steps: ["Cut paper into strips.", "Loop strips into '8's.", "Stack loops in a circle.", "Secure center with tape.", "Stick on a gift box."] },
    { name: "Paper Beads", needs: "Paper, glue, toothpick", steps: ["Cut long triangles.", "Roll around toothpick.", "Glue the tip down.", "Apply clear varnish.", "String into a necklace."] }
]
    },
    "sweater": {
        detail: "Is it 100% wool?",
        group: "textile",
        savings: { water: 2000, co2: 15, energy: 40 },
        map: "textile recycling",
       diys: [
    { name: "Cozy Cushion", needs: "Sweater, pillow, thread", steps: ["Cut square from body.", "Turn inside out.", "Sew 3 sides shut.", "Insert pillow insert.", "Sew final side closed."] },
    { name: "Mittens", needs: "Sweater, chalk, needle", steps: ["Place hand on sweater.", "Trace 2cm wider.", "Cut out 2 layers.", "Sew edges together.", "Turn inside out."] },
    { name: "Wine Bag", needs: "Sleeve, ribbon", steps: ["Cut off one sleeve.", "Sew the cut end shut.", "Insert wine bottle.", "Tie ribbon at top.", "Give as a cozy gift."] }
]
    },
    "batteries": {
        detail: "Is it a rechargeable type?",
        group: "special",
        savings: { water: 0, co2: 2, energy: 5 },
        map: "battery drop-off",
        diys: [
    { name: "Emergency Light", needs: "Battery, LED, tape", steps: ["Check battery charge.", "Touch LED to terminals.", "Tape wires securely.", "Keep in a small tin.", "Use during power cuts."] },
    { name: "Magnetic Stirrer", needs: "Fan, battery, magnet", steps: ["Attach magnet to fan.", "Connect fan to battery.", "Place glass on top.", "Drop stir bar in glass.", "Watch it spin contents."] },
    { name: "Battery Organizer", needs: "Cardboard, tape", steps: ["Cut strips of card.", "Fold into small slots.", "Label by battery type.", "Slide batteries in.", "Store in a cool drawer."] }
]
    },
    "laptop": {
        detail: "Does the screen still work?",
        group: "electronics",
        savings: { water: 500, co2: 150, energy: 300 },
        map: "e-waste recycling",
       diys: [
    { name: "Digital Photo Frame", needs: "Screen, wooden frame", steps: ["Remove LCD panel.", "Connect controller board.", "Set up photo loop.", "Mount in wood frame.", "Hang on your wall."] },
    { name: "External Hard Drive", needs: "Old HDD, USB enclosure", steps: ["Remove back cover.", "Unscrew the hard drive.", "Slide into enclosure.", "Plug into new PC.", "Access your old files."] },
    { name: "Smart Mirror", needs: "Monitor, 2-way mirror", steps: ["Strip laptop to screen.", "Place behind mirror.", "Run MagicMirror software.", "Build a frame around it.", "See weather in mirror."] }
]
    },
    "shirts": {
        detail: "Is it 100% cotton?",
        group: "textile",
        savings: { water: 2500, co2: 5, energy: 15 },
        map: "clothing donation",
      diys: [
    { name: "Produce Bag", needs: "T-shirt, scissors", steps: ["Cut off sleeves/neck.", "Turn inside out.", "Sew bottom shut.", "Cut small slits in body.", "Stretch for a mesh bag."] },
    { name: "Dog Rope Toy", needs: "Shirt strips", steps: ["Cut shirt into 9 strips.", "Tie a knot at one end.", "Braid strips together.", "Tie a knot at the end.", "Let your dog play!"] },
    { name: "Hair Scrunchies", needs: "Shirt, elastic, needle", steps: ["Cut fabric strip.", "Sew into a tube.", "Thread elastic through.", "Tie elastic ends.", "Sew fabric ends shut."] }
]  
    },
    "plastic box": {
        detail: "Is it labeled 'BPA free'?",
        group: "plastic",
        savings: { water: 3, co2: 0.2, energy: 0.8 },
        map: "plastic recycling",
       diys: [
    { name: "First Aid Kit", needs: "Box, labels, supplies", steps: ["Clean box thoroughly.", "Apply red cross label.", "Pack with bandages.", "Store in the car.", "Keep in reach of kids."] },
    { name: "Drawer Dividers", needs: "Boxes, tape", steps: ["Measure drawer height.", "Trim boxes to fit.", "Arrange by category.", "Tape boxes together.", "Sort your stationery."] },
    { name: "Cable Tidy", needs: "Box, cutter", steps: ["Cut holes in side.", "Place power strip inside.", "Thread cables through.", "Label each cable.", "Snap lid shut."] }
] 
    },
    "cardboard box": {
        detail: "Is it corrugated (thick)?",
        group: "paper",
        savings: { water: 2, co2: 0.1, energy: 0.4 },
        map: "cardboard collection",
       diys: [
    { name: "Cat Scratcher", needs: "Box strips, glue", steps: ["Cut into 4cm strips.", "Roll strips tightly.", "Glue next strip around.", "Continue until wide.", "Set on floor for cat."] },
    { name: "Laptop Stand", needs: "Cardboard, cutter", steps: ["Cut two triangle sides.", "Cut a flat crossbar.", "Slot pieces together.", "Angled for ergonomics.", "Helps airflow."] },
    { name: "Storage Bins", needs: "Box, fabric, glue", steps: ["Cut top flaps off.", "Glue fabric to outside.", "Fold fabric over edges.", "Glue inside bottom.", "Use for closet storage."] }
]
    },
    "pens": {
        detail: "Is the barrel metal or plastic?",
        group: "plastic",
        savings: { water: 0.1, co2: 0.02, energy: 0.1 },
        map: "stationery recycling",
        diys: [
    { name: "Cable Springs", needs: "Pen spring", steps: ["Remove spring from pen.", "Twist onto cable end.", "Prevents cable fraying.", "Slid to the connector.", "Extend charger life."] },
    { name: "Sprinkler", needs: "Pen tubes, hose", steps: ["Poke holes in hose.", "Insert hollow pen tubes.", "Seal with waterproof glue.", "Turn on the water.", "Custom garden spray."] },
    { name: "Plant Support", needs: "Pen barrels, tape", steps: ["Remove ink/caps.", "Tape barrels together.", "Insert into plant pot.", "Tie stem to the pen.", "Keeps small plants up."] }
]
    },
    "pencils": {
        detail: "Is it a graphite pencil?",
        group: "wood",
        savings: { water: 0.1, co2: 0.01, energy: 0.05 },
        map: "compost heap",
       diys: [
    { name: "Garden Markers", needs: "Pencil, paint", steps: ["Paint flat side white.", "Write plant name.", "Seal with varnish.", "Stick in soil.", "Identify your herbs."] },
    { name: "Pencil Jewelry", needs: "Colored pencils, saw", steps: ["Cut into small disks.", "Drill hole in center.", "Sand edges smooth.", "String onto a cord.", "Wear as a necklace."] },
    { name: "Keyboard Cleaner", needs: "Pencil eraser", steps: ["Use eraser on keys.", "Gently rub off grime.", "Blow away dust.", "Clean the eraser head.", "Repeat weekly."] }
] 
    },
    "shoes": {
        detail: "Are the soles made of rubber?",
        group: "textile",
        savings: { water: 100, co2: 8, energy: 20 },
        map: "shoe donation",
        
    },
    "wooden furniture": {
        detail: "Is it solid wood (not MDF)?",
        group: "wood",
        savings: { water: 0, co2: 20, energy: 50 },
        map: "furniture donation",
        
    },
    "house textile": {
        detail: "Is it a towel or curtain?",
        group: "textile",
        savings: { water: 1500, co2: 12, energy: 30 },
        map: "textile recycling",
       diys: [
    { name: "Cleaning Rags", needs: "Textile, scissors", steps: ["Wash fabric hot.", "Cut into squares.", "Trim with zig-zags.", "Stack in a basket.", "Stop using paper towels."] },
    { name: "Tote Bag", needs: "Textile, thread", steps: ["Fold fabric in half.", "Sew the side seams.", "Attach fabric strips.", "Reinforce handles.", "Use for groceries."] },
    { name: "Draft Stopper", needs: "Textile, sand/rice", steps: ["Sew into long tube.", "Fill with rice/sand.", "Sew the end shut.", "Place at door base.", "Keep the heat in."] }
]
    }
};

const materialGroups = {
    "plastic": [
        { name: "Polyethylene", abbr: "PET", use: "Beverage containers", feel: "Smooth/Clear" },
        { name: "High-Density Poly", abbr: "HDPE", use: "Jug containers", feel: "Waxy/Opaque" },
        { name: "Polypropylene", abbr: "PP", use: "Caps/Trays", feel: "Hard/Tough" },
        { name: "Polystyrene", abbr: "PS", use: "Foam/Cutlery", feel: "Brittle" }
    ],
    "textile": [
        { name: "Cotton", abbr: "CO", use: "Shirts", feel: "Soft" },
        { name: "Polyester", abbr: "PL", use: "Sportswear", feel: "Synthetic" },
        { name: "Wool", abbr: "WO", use: "Sweaters", feel: "Rough/Warm" },
        { name: "Nylon", abbr: "PA", use: "Activewear", feel: "Strong/Smooth" }
    ],
    "paper": [
        { name: "Cellulose", abbr: "PAP", use: "Writing paper", feel: "Thin/Fibrous" },
        { name: "Corrugated", abbr: "RES", use: "Shipping boxes", feel: "Thick/Ribbed" },
        { name: "Glossy", abbr: "GLS", use: "Magazines", feel: "Slick/Shiny" },
        { name: "Kraft", abbr: "KFT", use: "Grocery bags", feel: "Coarse/Brown" }
    ],
    "wood": [
        { name: "Softwood", abbr: "SW", use: "Construction", feel: "Light/Fragile" },
        { name: "Hardwood", abbr: "HW", use: "Furniture", feel: "Heavy/Dense" },
        { name: "Plywood", abbr: "PW", use: "Cabinets", feel: "Layered" },
        { name: "Bamboo", abbr: "BB", use: "Sustainable tools", feel: "Smooth/Strong" }
    ],
    "glass": [
        { name: "Borosilicate", abbr: "BOR", use: "Lab/Kitchen", feel: "Heat resistant" },
        { name: "Soda-Lime", abbr: "SL", use: "Bottles/Jars", feel: "Fragile/Common" },
        { name: "Lead Glass", abbr: "PB", use: "Crystalware", feel: "Heavy/Clear" },
        { name: "Tempered", abbr: "TG", use: "Windows", feel: "Safety-strengthened" }
    ],
    "electronics": [
        { name: "Lithium", abbr: "Li", use: "Batteries", feel: "Metallic" },
        { name: "Silicon", abbr: "Si", use: "Microchips", feel: "Glassy/Brittle" },
        { name: "Copper", abbr: "Cu", use: "Wiring", feel: "Flexible/Metallic" },
        { name: "Aluminum", abbr: "Al", use: "Casings", feel: "Cold/Silver" }
    ],
    "special": [
        { name: "Alkaline", abbr: "Alk", use: "AA Batteries", feel: "Heavy/Cylindrical" },
        { name: "Zinc", abbr: "Zn", use: "Casing", feel: "Dull metal" },
        { name: "Nickel", abbr: "Ni", use: "Rechargeables", feel: "Shiny" },
        { name: "Cadmium", abbr: "Cd", use: "Industrial", feel: "Heavy metal" }
    ]
};