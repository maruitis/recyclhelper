const itemDatabase = {

    /* ── PLASTIC BOTTLE ─────────────────────────────────────────────── */
    "plastic bottle": {
        detail: "Is the cap still on?",
        prepTips: {
            "With cap":     ["Remove cap before recycling", "Caps often go in separate bin", "Twist off to save time at depot"],
            "No cap":       ["Cap-free is ideal for recycling", "Rinse inside with water", "Ready to crush & go"],
            "Has label":    ["Peel paper labels if possible", "Labels can jam machinery", "Plastic labels are usually OK"],
            "No label":     ["Label-free is perfect condition", "Just rinse the bottle clean", "Straight in the recycling bin"],
            "Crushed":      ["Crushed bottles save bin space", "Makes transport more efficient", "Keep cap OFF when crushing"],
            "Intact shape": ["Try to crush flat to save space", "Easier for collection trucks", "Doesn't need to be perfect"]
        },
        group: "plastic",
        image: "images/plasticbottle.png",
        savings: { water: 5, co2: 0.1, energy: 0.5 },
        map: "plastic recycling",
        diys: [
            { name: "Self-Watering Planter", needs: "Bottle, cotton string, soil, small stones, scissors",
              steps: ["Cut bottle in half.", "Poke hole in cap & thread cotton string.", "Add stones then soil to top half.", "Place upside-down in water-filled base.", "Cotton wicks water up to roots."] },
            { name: "Hanging Bird Feeder", needs: "Bottle, 2 wooden spoons, twine, craft knife, birdseed",
              steps: ["Pierce two pairs of holes opposite each other.", "Push spoons through as perches.", "Cut small seed holes above each spoon.", "Fill with birdseed & seal top.", "Tie twine around neck and hang."] },
            { name: "Desk Pencil Cup", needs: "Bottle, scissors, sandpaper, washi tape or paint",
              steps: ["Cut bottom 10cm off bottle.", "Sand cut edge smooth.", "Wash and dry thoroughly.", "Decorate with washi tape or paint.", "Fill with pens and place on desk."] }
        ]
    },

    /* ── GLASS BOTTLE ───────────────────────────────────────────────── */
    "glass bottle": {
        detail: "Is it non-tempered glass?",
        prepTips: {
            "Standard glass": ["Standard glass is fully recyclable", "Most bottles are standard glass", "Goes in the glass/bottle bank"],
            "Tempered glass": ["Tempered glass cannot be recycled", "Has a different melting point", "Consider repurposing instead"],
            "Clean":          ["Rinsed bottles are ideal", "Prevents contamination of other glass", "No need to dry it after rinsing"],
            "Has residue":    ["Please rinse before recycling", "Food residue contaminates loads", "Quick rinse is all it needs"],
            "Has lid":        ["Remove metal or plastic lid", "Lid goes in a separate bin", "Some facilities accept lids on"],
            "No lid":         ["Lid-free is fine for recycling", "Just ensure bottle is clean", "Ready for the bottle bank"]
        },
        group: "glass",
        savings: { water: 2, co2: 0.3, energy: 1.2 },
        image: "images/glassbottle.png",
        map: "glass recycling",
        diys: [
            { name: "Dish Soap Dispenser", needs: "Clean glass bottle, pump or pour spout, labels",
              steps: ["Wash and dry bottle completely.", "Soak off any existing labels.", "Fill bottle with your preferred liquid soap.", "Insert pump or pour spout into the neck.", "Place by the sink as a stylish dispenser."] },
            { name: "Table Centerpiece", needs: "Bottle, white or chalk paint, twine, dried flowers",
              steps: ["Clean and dry the bottle thoroughly.", "Apply 2 coats of white or chalk paint.", "Wrap natural twine around the neck and knot.", "Let paint dry completely before handling.", "Insert a dried flower or sprig and group 3 together."] },
            { name: "Glass Lamp", needs: "Clean bottle, battery-powered LED fairy lights",
              steps: ["Wash the inside of the bottle well.", "Dry completely — moisture affects the lights.", "Feed LED fairy lights slowly inside the bottle.", "Tuck the battery pack behind the bottle.", "Switch on for warm ambient lighting."] }
        ]
    },

    /* ── GLASS JAR ──────────────────────────────────────────────────── */
    "glass jar": {
        detail: "Does the lid still seal properly?",
        prepTips: {
            "Sealed lid":     ["Remove lid before recycling glass", "Metal lids go to metal recycling", "Plastic lids go to plastic stream"],
            "No lid":         ["Lid-free jar is fine for recycling", "Just rinse it out thoroughly", "Drop in the bottle bank"],
            "Food residue":   ["Rinse with warm water before recycling", "Soaking overnight removes stubborn residue", "A clean jar is a perfect recyclable"],
            "Clean":          ["Clean jars are ideal for recycling", "Also perfect for reuse at home", "Ready for the glass bank straight away"],
            "Coloured glass": ["Coloured glass is fully recyclable", "Sort by colour if your bank has sections", "Green, brown, and clear are the main types"],
            "Clear glass":    ["Clear glass is most valuable to recyclers", "High demand for food-grade clear glass", "Keep separate from coloured if possible"]
        },
        group: "glass",
        savings: { water: 1.5, co2: 0.25, energy: 1.0 },
        image: "images/glassbottle.png",
        map: "glass recycling",
        diys: [
            { name: "Herb Kitchen Garden", needs: "Glass jars, potting soil, herb seeds, gravel, twine",
              steps: ["Add a layer of gravel to the base for drainage.", "Fill jar three-quarters full with potting soil.", "Press seeds into the soil and cover lightly.", "Place on a sunny windowsill and water sparingly.", "Label each jar with a piece of twine and card."] },
            { name: "Candle Holder", needs: "Glass jar, tea light or pillar candle, decorative sand or stones",
              steps: ["Pour a layer of decorative sand or pebbles into the jar.", "Place a tea light or short candle on top of the sand.", "Optionally tie twine or ribbon around the outside.", "Arrange several jars in a group for a centrepiece effect.", "Never leave lit candles unattended."] },
            { name: "Fermentation Jar", needs: "Glass jar with lid, vegetables, salt, water, weight",
              steps: ["Sterilise the jar by filling with boiling water for 5 minutes.", "Slice vegetables thinly and pack tightly into the jar.", "Dissolve salt in cold water (2% solution) and pour over.", "Place a small weight on top to keep vegetables submerged.", "Seal loosely and leave at room temperature for 3–7 days."] }
        ]
    },

    /* ── TIN CAN ────────────────────────────────────────────────────── */
    "tin can": {
        detail: "Is it a food or paint tin?",
        prepTips: {
            "Food tin":      ["Rinse thoroughly and it's ready to recycle", "Label can stay on — recycling removes it", "Goes straight in the metal recycling bin"],
            "Paint tin":     ["Paint tins need to be empty and dry", "Leave lid off so the paint dries fully", "Dried paint tins go to metal recycling"],
            "Lid attached":  ["Remove the lid if possible for safety", "Sharp edges can injure sorters", "Place lid inside the can before recycling"],
            "Lid removed":   ["Keep the lid inside the can", "Prevents it getting lost in sorting", "Ready to drop in the metal bin"],
            "Crushed":       ["Crushed cans save space in bins", "Still perfectly recyclable when flat", "Great habit to get into"],
            "Intact":        ["Give it a quick crush if you can", "Saves space in your recycling bin", "Not essential — intact is fine too"]
        },
        group: "metal",
        savings: { water: 0, co2: 0.6, energy: 3.5 },
        image: "images/tincan.png",
        map: "metal recycling",
        diys: [
            { name: "Desk Organiser Set", needs: "3–5 tin cans, spray paint, sandpaper, strong glue, ruler",
              steps: ["Remove all labels and rinse cans thoroughly.", "Sand the outside of each can lightly for paint adhesion.", "Apply 2 coats of spray paint in coordinating colours.", "Arrange cans in a row and glue firmly together.", "Fill with pens, scissors, rulers, and small supplies."] },
            { name: "Candle Lantern", needs: "Tin can, nail, hammer, tea light, water, marker pen",
              steps: ["Fill the can with water and freeze solid overnight.", "Draw a pattern of dots on the outside with a marker.", "Place on a folded towel and hammer nail through each dot.", "Let the ice melt and dry the can completely.", "Insert a tea light and hang or place on a surface."] },
            { name: "Garden Herb Pot", needs: "Tin can, drill or nail, potting soil, herb seeds or plant",
              steps: ["Use a nail and hammer to punch several drainage holes in the base.", "Sand any sharp edges on the rim for safety.", "Spray paint the outside and let dry fully.", "Fill with potting compost, leaving 2cm from the top.", "Plant herbs and water gently — place on a sunny windowsill."] }
        ]
    },

    /* ── BOOK ───────────────────────────────────────────────────────── */
    "book": {
        detail: "Is it a hardcover book?",
        prepTips: {
            "Hardcover":      ["Remove hardcover before paper recycling", "Covers often have different materials", "Cardboard cover can go separately"],
            "Paperback":      ["Paperbacks recycle easily whole", "Goes directly in paper bin", "No need to remove cover"],
            "Good condition": ["Donate before recycling — someone needs it", "Libraries and schools love donations", "Charity shops accept good books"],
            "Damaged":        ["Damaged books go to paper recycling", "Remove any metal bookmarks first", "Tear in half if very thick"],
            "Yellowed pages": ["Yellowed paper is still recyclable", "It's just aged cellulose", "Goes in standard paper bin"],
            "White pages":    ["White pages are premium recyclable", "High value material for paper mills", "Clean paper = better quality fibre"]
        },
        group: "paper",
        savings: { water: 10, co2: 0.5, energy: 2 },
        image: "images/book.png",
        map: "library donation",
        diys: [
            { name: "Hidden Safe", needs: "Old hardcover book, PVA glue, craft knife, ruler",
              steps: ["Mix PVA glue with a little water and brush onto all page edges.", "Leave to dry fully so the pages bond together.", "Open to page 10 and draw your rectangle with a ruler.", "Carefully cut through pages with a craft knife layer by layer.", "Let dry fully — the glued edges hold the shape."] },
            { name: "Book Planter", needs: "Thick hardcover book, plastic sheet, small succulent, potting soil",
              steps: ["Cut a rectangular hole through the center pages.", "Line the hole with a plastic sheet.", "Seal plastic edges with hot glue to protect the pages.", "Add a thin layer of well-draining potting soil.", "Plant a small succulent and press soil gently firm."] },
            { name: "Floating Shelf", needs: "Large hardcover book, 2 L-brackets, screws, wall anchors",
              steps: ["Mark and screw L-brackets into the wall firmly.", "Slide the open book over both brackets.", "Adjust position so the spine faces outward.", "Glue the back cover to the brackets.", "Add a screw through the cover for extra security."] }
        ]
    },

    /* ── NEWSPAPER ──────────────────────────────────────────────────── */
    "newspaper": {
        detail: "Is it dry and uncontaminated?",
        prepTips: {
            "Dry":          ["Dry newspaper recycles perfectly", "Bundle and tie for easier collection", "High fibre value for paper mills"],
            "Wet":          ["Dry it out before recycling if possible", "Wet newsprint clumps and jams machines", "Spread flat to dry in the sun"],
            "Inked":        ["Ink is removed in the de-inking process", "No action needed from you", "Standard paper recycling handles it"],
            "Old":          ["Any age of newspaper is recyclable", "The older the paper, the more it's needed", "No expiry on recyclability"],
            "Bundled":      ["Bundled newspapers are perfect for collection", "Tie with string or place in a paper bag", "Makes sorting much easier"],
            "Loose sheets": ["Loosely place in your paper recycling bin", "Keep dry on collection day", "No need to bundle small amounts"]
        },
        group: "paper",
        savings: { water: 1, co2: 0.04, energy: 0.15 },
        image: "images/newspaper.png",
        map: "paper recycling bin",
        diys: [
            { name: "Papier-Mâché Bowl", needs: "Newspaper strips, PVA glue, water, bowl mold, paint",
              steps: ["Tear newspaper into strips about 3cm wide.", "Mix PVA glue 1:1 with water in a bowl.", "Cover a bowl mold with cling film to prevent sticking.", "Apply 5–6 alternating layers of strips, each dipped in glue.", "Let dry for 24 hours, then paint and seal."] },
            { name: "Fire Starters", needs: "Newspaper, old wax candle stubs, muffin tin, string",
              steps: ["Cut newspaper into small squares and scrunch loosely.", "Place a piece of string in each muffin tin section.", "Pack scrunched newspaper around the string.", "Melt old candle wax and pour over each section.", "Leave to set fully, then pop out and store in a dry box."] },
            { name: "Gift Wrapping", needs: "Newspaper, twine, dried flower, scissors",
              steps: ["Choose a page with an interesting graphic or headline.", "Wrap your gift tightly, folding corners neatly.", "Tie with natural twine or a rubber band.", "Tuck a small dried flower under the twine.", "Write a message on the paper with a marker."] }
        ]
    },

    /* ── PAPER ──────────────────────────────────────────────────────── */
    "paper": {
        detail: "Is it glossy or matte?",
        prepTips: {
            "Glossy":    ["Glossy paper is harder to recycle", "Check if your facility accepts it", "Magazines and catalogs are glossy"],
            "Matte":     ["Matte paper recycles very easily", "Goes straight in the paper bin", "Great quality recyclable"],
            "Has ink":   ["Ink is removed during de-inking process", "No need to remove ink yourself", "Standard recycling handles it"],
            "Blank":     ["Blank paper is premium recyclable", "Reuse as scrap paper first", "Very easy for mills to process"],
            "Wet":       ["Dry before recycling if possible", "Wet paper clumps and jams machines", "Spread out to dry first"],
            "Dry":       ["Dry paper is ideal for recycling", "Goes straight in the paper bin", "Keep covered until collection day"]
        },
        group: "paper",
        savings: { water: 1, co2: 0.05, energy: 0.2 },
        image: "images/paper.png",
        map: "paper recycling bin",
        diys: [
            { name: "Seed Paper", needs: "Paper scraps, blender, water, wildflower seeds, towel, mesh screen",
              steps: ["Tear paper into small pieces and soak in water overnight.", "Blend soaked paper into a smooth pulp.", "Stir in a generous pinch of wildflower seeds.", "Pour pulp onto a mesh screen and press flat.", "Leave to dry fully for 2 days before planting."] },
            { name: "Gift Bows", needs: "Magazine pages or coloured paper, tape, scissors",
              steps: ["Cut paper into strips of varying lengths.", "Loop each strip into a figure-of-eight shape.", "Pinch the center and secure with a small piece of tape.", "Stack loops in a circle from largest to smallest.", "Secure the center with tape and press onto a gift box."] },
            { name: "Paper Beads", needs: "Patterned paper, glue stick, toothpick, clear nail varnish",
              steps: ["Cut paper into long thin triangles.", "Start rolling the wide end tightly around a toothpick.", "Apply a tiny amount of glue as you roll toward the tip.", "Slide off the toothpick carefully once fully rolled.", "Coat with clear varnish and let dry completely before stringing."] }
        ]
    },

    /* ── SWEATER ────────────────────────────────────────────────────── */
    "sweater": {
        detail: "Is it 100% wool?",
        prepTips: {
            "Natural fibre":    ["Natural fibres compost or recycle well", "Wool and cotton are most valuable", "Separate from synthetic items"],
            "Synthetic blend":  ["Synthetics still go to textile recycling", "Cannot be composted", "Most textile banks accept blends"],
            "Has damage":       ["Still recyclable even if damaged", "Holes don't matter for fibre recycling", "Too damaged to donate — recycle it"],
            "Good condition":   ["Donate instead of recycling if possible", "Charity shops welcome wearable jumpers", "Helps someone stay warm"],
            "Machine washable": ["Wash before donating or recycling", "Clean items are always preferred", "Remove pins and decorations first"],
            "Hand wash only":   ["Still can be donated or recycled", "Tell donation centre about care label", "Handle gently when cleaning"]
        },
        group: "textile",
        savings: { water: 2000, co2: 15, energy: 40 },
        image: "images/sweater.png",
        map: "textile recycling",
        diys: [
            { name: "Cozy Cushion", needs: "Sweater, cushion insert, needle, thread, scissors",
              steps: ["Cut a square from the body section of the sweater.", "Turn the fabric inside out and pin the edges.", "Sew three sides shut with a tight stitch.", "Insert a cushion pad through the open side.", "Sew the final side closed and turn right-side out."] },
            { name: "Mittens", needs: "Sweater, tailor's chalk, needle, thread, scissors",
              steps: ["Lay your hand flat on the sweater fabric and trace around it.", "Draw the outline 2cm wider than your hand all around.", "Cut out two matching pieces per hand.", "Pin pieces together and sew around the edge.", "Turn inside out for a neat finish and try on."] },
            { name: "Wine Bag", needs: "Sweater sleeve, ribbon or twine, scissors, needle, thread",
              steps: ["Cut one sleeve off the sweater cleanly at the shoulder seam.", "Turn inside out and sew the cut end tightly shut.", "Turn right-side out and insert a wine bottle to check the fit.", "Tie a ribbon or length of twine decoratively at the top.", "Add a gift tag through the bow for a personal touch."] }
        ]
    },

    /* ── JEANS ──────────────────────────────────────────────────────── */
    "jeans": {
        detail: "Are they still wearable?",
        prepTips: {
            "Wearable":       ["Donate to charity shops or clothes swaps", "Good denim lasts for many more years", "Check denim-specific donation drives"],
            "Too worn":       ["Worn denim still has high recycling value", "Gets shredded into insulation padding", "Many brands have denim take-back schemes"],
            "Metal zip/studs": ["Remove metal buttons and zips if possible", "Metal hardware goes to metal recycling", "Denim without metal is easier to process"],
            "No metal":       ["Clean denim without hardware recycles perfectly", "Great raw material for textile recyclers", "Ready for the textile bank"],
            "Faded":          ["Faded jeans are still recyclable", "Not suitable for donation if very faded", "Textile fibre recycler is best bet"],
            "Good colour":    ["Donate bright-coloured jeans first", "Someone will definitely want them", "Second-hand denim is very popular"]
        },
        group: "textile",
        savings: { water: 7000, co2: 20, energy: 50 },
        image: "images/jeans.png",
        map: "clothing donation",
        diys: [
            { name: "Denim Tote Bag", needs: "Old jeans, scissors, needle, strong thread, ruler",
              steps: ["Cut the legs off the jeans at the crotch seam.", "Turn inside out and sew the waist opening shut tightly.", "Cut two long strips from the leg fabric for handles.", "Fold each strip in half lengthways and sew along the edge.", "Attach handles securely inside the waistband with reinforced stitching."] },
            { name: "Denim Pot Plant Cover", needs: "Jeans leg, scissors, needle, thread, plant pot",
              steps: ["Cut one leg to the correct height to cover your plant pot.", "Sew the cut edge under with a simple hem.", "Place the pot inside the denim sleeve.", "Fold the top edge down neatly to reveal the plant.", "Add a bow of twine around the outside for decoration."] },
            { name: "Patched Notebook Cover", needs: "Denim scraps, old notebook, PVA glue, scissors, ruler",
              steps: ["Cut denim to exactly the size of your notebook opened flat.", "Apply PVA glue evenly to the outside of the notebook cover.", "Press denim firmly onto the cover and smooth out all bubbles.", "Fold excess denim over the inside edges and glue down.", "Leave to dry under a heavy book for several hours."] }
        ]
    },

    /* ── BATTERIES ──────────────────────────────────────────────────── */
    "batteries": {
        detail: "Is it a rechargeable type?",
        prepTips: {
            "Rechargeable":  ["Rechargeable batteries need specialist recycling", "Never put in regular trash", "Electronics shops often have drop boxes"],
            "Single-use":    ["Single-use still need proper disposal", "Many supermarkets have battery banks", "Never mix with regular recycling"],
            "Corroded":      ["Wear gloves — leaking batteries are hazardous", "Tape both terminals with electrical tape", "Take to hazardous waste facility"],
            "Clean":         ["Store in cool dry place until disposal", "Tape terminals before storing to prevent shorting", "Keep away from metal objects"],
            "Discharged":    ["Discharged batteries are safer to transport", "Still need proper battery disposal", "Tape ends as a safety precaution"],
            "Has charge":    ["Tape BOTH terminals with electrical tape", "Prevents short circuit during transport", "Never store loose with metal items"]
        },
        group: "special",
        savings: { water: 0, co2: 2, energy: 5 },
        image: "images/batteries.png",
        map: "battery drop-off",
        diys: [
            { name: "Emergency Light", needs: "AA or 9V battery, small LED bulb, electrical tape, small tin",
              steps: ["Check the battery still has a reasonable charge.", "Touch the two LED legs to the positive and negative terminals.", "Hold in place and wrap firmly with electrical tape.", "Store the finished light in a small tin or bag.", "Keep in a drawer ready for power cuts."] },
            { name: "Magnetic Stirrer", needs: "Small DC fan, battery, small magnet, tape, stir bar or paperclip",
              steps: ["Tape a small magnet firmly to one fan blade.", "Connect the fan's wire leads to the battery terminals.", "Place a glass of liquid on top of the running fan.", "Drop a magnetic stir bar or bent paperclip into the glass.", "Watch the magnet below spin the bar inside the liquid."] },
            { name: "Battery Organizer", needs: "Cardboard, scissors, tape, marker pen",
              steps: ["Cut strips of cardboard to match the height of each battery type.", "Fold and tape into snug slots sized for AA, AAA, and 9V.", "Label each section clearly with a marker pen.", "Add a separate 'used' section to track depleted batteries.", "Keep in a cool, dry drawer or shelf."] }
        ]
    },

    /* ── LAPTOP ─────────────────────────────────────────────────────── */
    "laptop": {
        detail: "Does the screen still work?",
        prepTips: {
            "Screen works":   ["Working laptop — consider donating first", "Refurbishment centres accept working units", "Charities give them to schools"],
            "Broken screen":  ["E-waste facility is the right place", "Components are still very valuable", "Never put electronics in regular trash"],
            "Data wiped":     ["Good — privacy protected before recycling", "Now safe to donate or drop off", "Include charger if donating"],
            "Data on device": ["WIPE data before recycling — important!", "Use factory reset or secure erase tool", "Protect your personal information"],
            "Good battery":   ["Remove battery for separate recycling", "Li-ion batteries need special handling", "Tape battery terminals before disposal"],
            "Dead battery":   ["Remove and recycle battery separately", "Tape terminals before transport", "Dedicated battery recycling required"]
        },
        group: "electronics",
        savings: { water: 500, co2: 150, energy: 300 },
        image: "images/laptop.png",
        map: "e-waste recycling",
        diys: [
            { name: "Digital Photo Frame", needs: "Laptop LCD screen, controller board, wooden or picture frame",
              steps: ["Carefully remove the LCD panel from the laptop chassis.", "Order a matching controller board online using the screen model number.", "Connect the controller board to the screen and test the display.", "Mount the screen inside a wooden or repurposed picture frame.", "Load a photo slideshow and hang on the wall."] },
            { name: "External Hard Drive", needs: "Laptop hard drive (HDD or SSD), compatible USB enclosure",
              steps: ["Power down and open the laptop back panel carefully.", "Locate and unscrew the hard drive from its bay.", "Identify whether it is HDD or SSD and buy the matching enclosure.", "Slide the drive into the enclosure and secure the connector.", "Plug into a new computer via USB to access old files."] },
            { name: "Smart Mirror", needs: "Laptop screen, two-way mirror, wooden frame, Raspberry Pi or laptop board",
              steps: ["Strip the laptop down to just the screen and its board.", "Position the screen behind a matching two-way mirror panel.", "Install MagicMirror² software on the board.", "Build a simple wooden frame around the mirror and screen.", "Mount on a wall and configure widgets like weather, time, and calendar."] }
        ]
    },

    /* ── MOBILE PHONE ───────────────────────────────────────────────── */
    "mobile phone": {
        detail: "Does it still power on?",
        prepTips: {
            "Powers on":      ["Working phone — sell, donate, or trade in first", "Many charities refurbish phones for the elderly", "Network shops run free trade-in programmes"],
            "Dead phone":     ["E-waste facility accepts non-working phones", "Still contains valuable rare metals inside", "Never put in the regular bin"],
            "Data on device": ["Factory reset BEFORE recycling — critical!", "Back up photos and contacts first", "Check 'Erase all data' in settings"],
            "Data wiped":     ["Device is safe to hand over", "Include the charger if possible", "SIM card — keep it or destroy it"],
            "With case":      ["Remove case — cases go to plastic recycling", "Case and phone are different materials", "Recycle each stream separately"],
            "No case":        ["Ready for e-waste drop-off", "Pack in a small bag to protect screen", "Keep the charger together with the phone"]
        },
        group: "electronics",
        savings: { water: 200, co2: 60, energy: 100 },
        image: "images/mobilephone.png",
        map: "e-waste recycling",
        diys: [
            { name: "Dedicated Music Player", needs: "Old phone, charging cable, Bluetooth speaker",
              steps: ["Perform a factory reset to free up all storage.", "Set up only a music streaming app or offline music.", "Set screen timeout to 30 seconds to save battery.", "Connect permanently to a Bluetooth speaker in one room.", "Charge at night — now a dedicated music device."] },
            { name: "Security Camera", needs: "Old phone, phone mount or stand, Wi-Fi, Alfred app",
              steps: ["Install the Alfred Home Security Camera app on the old phone.", "Place the old phone facing the area you want to monitor.", "Mount on a windowsill or shelf using a small stand.", "Log into Alfred on your main phone to view the live feed.", "Connect to a charger — the camera phone runs continuously."] },
            { name: "Smart Bedside Clock", needs: "Old phone, charging stand, clock app",
              steps: ["Download a nightstand clock app with a dimming feature.", "Set the screen to stay on permanently in settings.", "Place the phone in a charging stand beside your bed.", "Enable 'Do Not Disturb' hours to silence notifications.", "Enjoy a smart clock with alarms, weather, and no extra cost."] }
        ]
    },

    /* ── LIGHT BULB ─────────────────────────────────────────────────── */
    "light bulb": {
        detail: "Is it LED, CFL, or incandescent?",
        prepTips: {
            "LED bulb":          ["LED bulbs contain electronics — specialist recycling", "Many DIY stores have LED take-back points", "Never put in regular glass recycling"],
            "CFL bulb":          ["CFL contains mercury — hazardous waste!", "Take to a designated hazardous waste site", "Never break — seal in a bag if cracked"],
            "Incandescent":      ["Old-style bulbs go in general waste — not glass bin", "The glass is too thin and mixed for standard recycling", "Wrap in paper to prevent injury"],
            "Broken":            ["Seal broken bulb in a sealed bag immediately", "CFL? Follow mercury spill protocol — ventilate the room", "Take sealed bag to hazardous waste point"],
            "Working":           ["If LED/CFL still works — keep using it!", "Good bulbs last years — don't dispose early", "Or donate to a neighbour or community space"],
            "Packaging intact":  ["Packaging tells you the bulb type and disposal method", "Keep info for correct disposal stream", "Most packaging shows the recycling symbol if applicable"]
        },
        group: "special",
        savings: { water: 0, co2: 0.5, energy: 2 },
        image: "images/lightbulb.png",
        map: "hazardous waste facility",
        diys: [
            { name: "Terrarium Globe", needs: "Large clear incandescent bulb (intact), soil, moss, tiny pebbles, tweezers",
              steps: ["Carefully remove the metal base using pliers.", "Extract the inner glass components using tweezers.", "Rinse the hollow glass globe and let dry completely.", "Add a thin layer of pebbles, then compost, then moss.", "Hang with fishing wire or set on a custom wire stand."] },
            { name: "Mini Oil Lamp", needs: "Large clear bulb, lamp oil, cotton wick, wire, pliers",
              steps: ["Remove the base and inner workings carefully with pliers.", "Thread a cotton wick through a small piece of wire coiled to fit the neck.", "Fill the bulb halfway with lamp oil.", "Set the wick so it sits just above the oil surface.", "Keep well away from anything flammable when lit."] },
            { name: "Hanging Bud Vase", needs: "Clear bulb, copper wire, small flowers, water",
              steps: ["Remove the base and inner components with pliers.", "Rinse the bulb interior several times with clean water.", "Wrap copper wire tightly around the neck to create a hanging loop.", "Fill one-quarter with water using a small funnel or syringe.", "Insert a single flower stem and hang by a window."] }
        ]
    },

    /* ── SHIRTS ─────────────────────────────────────────────────────── */
    "shirts": {
        detail: "Is it 100% cotton?",
        prepTips: {
            "Pure cotton":     ["Cotton textiles have very high recycling value", "Can also be composted in garden", "High demand from textile recyclers"],
            "Synthetic blend": ["Still recyclable at textile facilities", "Cannot be composted", "Look for textile drop-off points nearby"],
            "Wearable":        ["Please donate before recycling", "Someone else will use it", "Charity shops and clothes banks"],
            "Too worn":        ["Textile recycling is perfect for this", "Gets shredded into new padding fibre", "Much better than going to landfill"],
            "Has stains":      ["Small stains are OK for recycling", "Not suitable for donation with stains", "Textile recyclers accept stained items"],
            "Clean":           ["Clean items can be donated or recycled", "Wash before donating — appreciated", "Clean shirts = higher quality fibre"]
        },
        group: "textile",
        savings: { water: 2500, co2: 5, energy: 15 },
        image: "images/shirt.png",
        map: "clothing donation",
        diys: [
            { name: "Produce Bag", needs: "T-shirt, scissors — no sewing needed",
              steps: ["Lay the shirt flat and cut off both sleeves and the neckline.", "Turn inside out and sew the bottom hem shut tightly.", "Cut vertical slits along the body section for a mesh effect.", "Stretch each slit gently to open the mesh wider.", "Turn right-side out and use for fruit, vegetables, or bread."] },
            { name: "Dog Rope Toy", needs: "Old shirt, scissors",
              steps: ["Cut the shirt into 9 long equal strips across the body.", "Gather all strips and tie a firm knot at one end.", "Divide into 3 groups of 3 and braid tightly to the end.", "Tie another firm knot to secure the braid.", "Let your dog play — supervise the first few uses."] },
            { name: "Hair Scrunchies", needs: "Shirt fabric, thin elastic, needle, thread, scissors",
              steps: ["Cut a strip of fabric approximately 50cm long and 8cm wide.", "Fold lengthways with right sides together and sew into a tube.", "Turn the tube right-side out using a safety pin.", "Thread a 20cm length of elastic through the tube.", "Overlap and sew the elastic ends, then sew the fabric ends together."] }
        ]
    },

    /* ── PLASTIC BOX ────────────────────────────────────────────────── */
    "plastic box": {
        detail: "Is it labeled 'BPA free'?",
        prepTips: {
            "BPA free":         ["BPA-free plastics are safer to recycle", "Usually PP (code 05) or HDPE (code 02)", "Check local recycling guidelines"],
            "May have BPA":     ["Some facilities won't accept BPA plastic", "Check with your local recycling centre", "Consider repurposing rather than recycling"],
            "Has symbol":       ["The number in the triangle tells you the type", "Match symbol number to local guidelines", "Makes sorting and processing much easier"],
            "No symbol":        ["Harder to sort without the symbol", "Contact your local recycling centre", "May still be accepted — check first"],
            "Clean":            ["Clean containers are ideal", "Ready to go in the recycling bin", "No further preparation needed"],
            "Has food residue": ["Rinse all food residue before recycling", "Dirty containers contaminate whole loads", "Quick rinse is all it takes"]
        },
        group: "plastic",
        savings: { water: 3, co2: 0.2, energy: 0.8 },
        image: "images/plasticbox.png",
        map: "plastic recycling",
        diys: [
            { name: "First Aid Kit", needs: "Clean plastic box with lid, red marker or sticker, basic first aid supplies",
              steps: ["Wash and dry the box thoroughly inside and out.", "Draw or stick a clear red cross symbol on the lid.", "Fill with plasters, bandages, antiseptic wipes, and pain relief.", "Add a handwritten contents list inside the lid.", "Store in your car, bag, or kitchen drawer."] },
            { name: "Drawer Dividers", needs: "Several plastic boxes of varying sizes, scissors, tape",
              steps: ["Measure the internal height of your drawer.", "Trim boxes down to fit neatly without the lid.", "Arrange the trimmed boxes side by side inside the drawer.", "Tape boxes together so they don't shift when opened.", "Sort stationery, tools, or cosmetics into each section."] },
            { name: "Cable Tidy", needs: "Plastic box with lid, craft knife, labels, power strip",
              steps: ["Cut a neat hole in one side of the box for cable entry.", "Cut a smaller hole on the opposite side for plugs to exit.", "Place your power strip inside the box.", "Thread all device cables through the entry hole.", "Snap the lid on and label each visible cable."] }
        ]
    },

    /* ── CARDBOARD BOX ──────────────────────────────────────────────── */
    "cardboard box": {
        detail: "Is it corrugated (thick)?",
        prepTips: {
            "Corrugated":      ["Corrugated cardboard is highly recyclable", "Flatten first then put in bin", "High demand from paper mills"],
            "Single layer":    ["Single-layer card also recycles well", "Cereal boxes, shoeboxes — all accepted", "Remove any plastic liners first"],
            "Water damaged":   ["Wet cardboard is harder to recycle", "Try to dry it out if possible", "If mushy, it may go to composting"],
            "Dry":             ["Dry cardboard is perfect for recycling", "Ready to flatten and bin immediately", "Keep dry on collection day"],
            "Flattened":       ["Great — flat boxes save huge space", "Makes collection more efficient", "Stack with other flat cardboard"],
            "Still assembled": ["Please flatten before putting in bin", "Saves enormous amounts of space", "Fold flat along the crease lines"]
        },
        group: "paper",
        savings: { water: 2, co2: 0.1, energy: 0.4 },
        image: "images/crdboardbox.png",
        map: "cardboard collection",
        diys: [
            { name: "Cat Scratcher", needs: "Corrugated cardboard box, non-toxic craft glue, scissors",
              steps: ["Break down the box and cut it into strips about 4cm wide.", "Roll the first strip as tightly as possible.", "Apply glue to the next strip and wrap it around the first.", "Continue gluing and wrapping until you reach the desired width.", "Place on the floor and let your cat discover it naturally."] },
            { name: "Laptop Stand", needs: "Thick double-walled cardboard, craft knife, ruler",
              steps: ["Cut two large identical right-angled triangle shapes for the sides.", "Cut a flat rectangular crossbar to connect them at the top.", "Cut matching slots halfway into each triangle and the crossbar.", "Slot the pieces firmly together — no glue needed.", "Adjust the angle by cutting the slot position higher or lower."] },
            { name: "Storage Bins", needs: "Cardboard box, fabric scraps, PVA glue, scissors",
              steps: ["Cut the top flaps off the box to create an open bin.", "Apply PVA glue to the outside and smooth fabric over it.", "Fold fabric neatly over the top edge and glue inside.", "Glue a clean fabric piece to the inside base.", "Press flat and leave to dry for several hours."] }
        ]
    },

    /* ── PENS ───────────────────────────────────────────────────────── */
    "pens": {
        detail: "Is the barrel metal or plastic?",
        prepTips: {
            "Metal barrel":   ["Metal pens have more recyclable value", "Separate metal from plastic parts", "Metal body goes to metal recycling"],
            "Plastic barrel": ["Plastic pen barrels can be recycled", "Some brands have take-back programs", "TerraCycle collects old pens"],
            "Ink empty":      ["Empty pens are ready to recycle", "No contamination from leftover ink", "Disassemble and sort materials"],
            "Has ink":        ["Use up remaining ink first", "Or find a pen take-back program", "Don't pour ink down the drain"],
            "Refillable":     ["Best environmental choice — keep it!", "Just buy replacement cartridges", "Much less waste over time"],
            "Disposable":     ["Consider switching to refillable pens", "TerraCycle has free pen drop-off programs", "Some brands accept returns by post"]
        },
        group: "plastic",
        savings: { water: 0.1, co2: 0.02, energy: 0.1 },
        image: "images/pen.png",
        map: "stationery recycling",
        diys: [
            { name: "Cable Springs", needs: "Spring from inside a ballpoint pen",
              steps: ["Disassemble the pen and remove the internal spring.", "Stretch the spring slightly so the coils are a little looser.", "Twist the spring onto the end of a charging cable at the connector.", "Slide it right up to where the cable meets the plug head.", "The spring supports the cable and prevents bending and fraying."] },
            { name: "Garden Sprinkler", needs: "Several hollow pen barrels, garden hose, waterproof sealant",
              steps: ["Use a skewer or nail to poke holes along the garden hose.", "Insert a hollow pen barrel into each hole at different angles.", "Seal around each barrel with waterproof outdoor sealant.", "Allow the sealant to cure fully for at least 24 hours.", "Connect the hose to a tap and turn on for a custom spray pattern."] },
            { name: "Plant Support Stakes", needs: "Pen barrels, strong tape, soft plant ties",
              steps: ["Remove ink cartridge and end caps from each pen.", "Tape two or three barrels side by side for extra height and strength.", "Push the taped bundle firmly into the potting soil.", "Tie the plant stem loosely to the stake with a soft fabric tie.", "Adjust the tie upward as the plant grows taller."] }
        ]
    },

    /* ── PENCILS ────────────────────────────────────────────────────── */
    "pencils": {
        detail: "Is it a graphite pencil?",
        prepTips: {
            "Graphite":        ["Graphite pencils can be composted", "The wood barrel decomposes naturally", "Tiny graphite tip is harmless in soil"],
            "Coloured pencil": ["Coloured pencils contain wax and pigment", "Best composted or disposed normally", "Not standard recycling stream"],
            "Has eraser":      ["Remove metal ferrule and eraser if possible", "Metal band can go to metal recycling", "Eraser itself is usually not recyclable"],
            "No eraser":       ["Straight to composting or wood recycling", "Pure wood item — very easy to handle", "Can also be used as plant marker"],
            "Full length":     ["Donate to schools or art clubs", "Kids and artists always need pencils", "Still has years of useful life left"],
            "Short stub":      ["Too short to use — time to compost it", "Break in half to speed up composting", "Or bundle stubs for art mosaic projects"]
        },
        group: "wood",
        savings: { water: 0.1, co2: 0.01, energy: 0.05 },
        image: "images/pencil.png",
        map: "compost heap",
        diys: [
            { name: "Garden Markers", needs: "Used pencil, white paint or paint pen, outdoor varnish",
              steps: ["Paint one flat side of the pencil with white paint and let dry.", "Write the plant name clearly using a paint pen or thin brush.", "Apply two coats of outdoor varnish over the label side.", "Allow to cure for 24 hours before placing outside.", "Push the sharpened end into the soil beside each plant."] },
            { name: "Pencil Disk Jewelry", needs: "Coloured pencils, small hand saw, hand drill, fine sandpaper, cord",
              steps: ["Hold the pencil firmly and saw into neat thin disks.", "Sand both faces of each disk smooth with fine sandpaper.", "Drill a small hole through the center of each disk carefully.", "Thread disks onto a thin cord or elastic in a pattern you like.", "Tie off securely and trim excess cord."] },
            { name: "Keyboard & Screen Cleaner", needs: "Pencil with eraser end still intact",
              steps: ["Use the clean eraser end directly on individual dirty keyboard keys.", "Apply light circular pressure to lift grime and sticky residue.", "Blow away the loosened debris with short sharp puffs of air.", "Wipe the eraser head on a clean cloth between keys.", "Repeat weekly to keep your keyboard looking newer for longer."] }
        ]
    },

    /* ── SHOES ──────────────────────────────────────────────────────── */
    "shoes": {
        detail: "Are the soles made of rubber?",
        prepTips: {
            "Rubber soles":    ["Rubber soles are recyclable material", "Gets turned into playground surfaces", "Separate upper from sole if possible"],
            "Synthetic soles": ["Synthetic soles go to textile recycling", "Nike Grind accepts many shoe types", "Cannot go in standard bins"],
            "Wearable":        ["Donate — don't recycle wearable shoes", "Shoe banks and charity shops take them", "They'll last many more years"],
            "Worn out":        ["Worn shoes can still be recycled for fibre", "Soles become playground/road material", "Upper fabric becomes new padding"],
            "Full pair":       ["Keep pairs together when donating", "Much more useful to the next person", "Tie laces together to keep them paired"],
            "Single shoe":     ["Single shoes won't be donated", "Best to recycle the materials separately", "Rubber sole, fabric upper, metal eyelets"]
        },
        group: "textile",
        savings: { water: 100, co2: 8, energy: 20 },
        image: "images/shoes.png",
        map: "shoe donation",
        diys: [
            { name: "Fence or Wall Planter", needs: "Old boot or shoe, potting soil, small flowering plant, nail or screw",
              steps: ["Use a skewer or drill to poke several drainage holes through the sole.", "Fill the shoe loosely with well-draining potting soil.", "Plant a small flower, herb, or trailing succulent into the soil.", "Knock a nail through the heel area into your fence or wall.", "Water regularly and enjoy the quirky garden feature."] },
            { name: "Weighted Door Stop", needs: "Heavy shoe or boot, sand or small pebbles, strong glue",
              steps: ["Pack the shoe tightly with dry sand or small smooth pebbles.", "Seal the opening firmly with strong adhesive or hand-stitching.", "Allow to cure or dry completely overnight.", "Place behind a door that needs holding open.", "Decorate with paint or laces if you want a fun finish."] },
            { name: "Hallway Key Holder", needs: "Sneaker or colourful shoe, wall hook, screws and wall anchor",
              steps: ["Clean the shoe inside and out thoroughly.", "Choose a prominent spot in your hallway at a comfortable height.", "Screw a sturdy wall hook into the wall with a proper anchor.", "Hang the shoe by the heel loop or laces over the hook.", "Drop keys, small cards, or change into the toe of the shoe."] }
        ]
    },

    /* ── WOODEN FURNITURE ───────────────────────────────────────────── */
    "wooden furniture": {
        detail: "Is it solid wood (not MDF)?",
        prepTips: {
            "Solid wood":         ["Solid wood is highly recyclable material", "Can be chipped into mulch or biomass", "Great for donation or repurposing too"],
            "MDF or chipboard":   ["MDF contains glue and formaldehyde", "Many facilities won't accept MDF", "Check with your local authority first"],
            "Treated or painted": ["Painted wood can still be recycled", "Remove all hardware first (screws, hinges)", "Some paint types may restrict chipping use"],
            "Untreated":          ["Untreated wood is the best for recycling", "Can also be composted if small pieces", "High-value material for wood chippers"],
            "Sturdy":             ["Donate sturdy furniture before recycling", "Facebook Marketplace and charity shops", "Someone will gladly take it for free"],
            "Broken":             ["Break down into manageable pieces", "Remove all metal hardware first", "Smaller pieces are easier to chip or compost"]
        },
        group: "wood",
        savings: { water: 0, co2: 20, energy: 50 },
        image: "images/woodenstool.png",
        map: "furniture donation",
        diys: [
            { name: "Wall Shelf from Drawer", needs: "Old drawer, sandpaper, paint, wall screws and anchors",
              steps: ["Remove the drawer handle and fill holes with wood filler.", "Sand all surfaces smooth and apply 2 coats of paint.", "Turn the drawer so the base faces outward like a shadow box.", "Screw through the base directly into wall anchors.", "Style with small plants, photos, or decorative objects inside."] },
            { name: "Coat Rack from Chair Back", needs: "Chair back section, saw, sandpaper, metal hooks, paint, wall fixings",
              steps: ["Saw the decorative back section cleanly off the chair at the seat joint.", "Sand all cut edges smooth and paint or stain to your preference.", "Mark evenly spaced positions and screw metal hooks along the piece.", "Hold up to the wall, mark anchor positions, and drill pilot holes.", "Fix securely to the wall with appropriate anchors and screws."] },
            { name: "Garden Bench from Table", needs: "Old wooden table, saw, outdoor paint or wood stain, wall brackets",
              steps: ["Measure and mark the table top into two equal long halves.", "Saw carefully along the line and sand all cut edges smooth.", "Attach each half to the wall at seat height using strong brackets.", "Reinforce the outer legs with additional angled brackets if needed.", "Apply two coats of outdoor wood stain or paint to protect from weather."] }
        ]
    },

    /* ── HOUSE TEXTILE ──────────────────────────────────────────────── */
    "house textile": {
        detail: "Is it a towel or curtain?",
        prepTips: {
            "Towel or curtain": ["Towels and curtains can be donated", "Animal shelters love old towels", "Curtains repurpose well into fabric"],
            "Other textile":    ["Most household textiles can be recycled", "Check for textile drop-off points", "Avoid mixing with regular recycling"],
            "Usable":           ["Animal shelters love old towels and fabric", "Check if charity accepts home textiles", "Great for donation even if old-looking"],
            "Too worn":         ["Worn textiles still have fibre value", "Gets shredded into insulation padding", "Much better than sending to landfill"],
            "Natural fibre":    ["Natural fibre composts well in garden", "Also accepted at textile recyclers", "Highest value for recycling process"],
            "Synthetic":        ["Synthetic textiles go to fibre recycling", "Cannot be composted", "Look for textile collection bags at shops"]
        },
        group: "textile",
        savings: { water: 1500, co2: 12, energy: 30 },
        image: "images/textile.png",
        map: "textile recycling",
        diys: [
            { name: "Reusable Cleaning Rags", needs: "Old towel or textile, scissors, pinking shears optional",
              steps: ["Wash the fabric on the hottest appropriate cycle to sanitise.", "Cut into even squares roughly 25cm × 25cm in size.", "Trim all edges with pinking shears to prevent fraying without sewing.", "Stack in a neat basket or box beside the kitchen sink.", "Wash with laundry after use and reuse indefinitely."] },
            { name: "Sturdy Tote Bag", needs: "Curtain or thick textile, needle, strong thread, scissors",
              steps: ["Cut two equal rectangles of fabric for front and back panels.", "Cut two long strips for the handles.", "Pin front and back right-sides together and sew side and bottom seams.", "Fold each handle strip lengthways twice and sew along the edge.", "Attach handles securely with reinforced stitching at the top opening."] },
            { name: "Door Draft Stopper", needs: "Textile, rice or dried lentils, needle, thread",
              steps: ["Cut a rectangle of fabric twice the door width and about 15cm wide.", "Fold in half lengthways and sew along the long edge into a tube.", "Sew one end shut and fill firmly with rice or lentils.", "Leave a small gap and add a handful of dried lavender if you like.", "Sew the final end tightly closed."] }
        ]
    }

};

/* ══════════════════════ MATERIAL GROUPS ══════════════════════ */
const materialGroups = {
    "plastic": [
        { name: "Polyethylene",       abbr: "PET",  use: "Beverage containers", feel: "Smooth/Clear"      },
        { name: "High-Density Poly",  abbr: "HDPE", use: "Jug containers",      feel: "Waxy/Opaque"       },
        { name: "Polypropylene",      abbr: "PP",   use: "Caps/Trays",          feel: "Hard/Tough"        },
        { name: "Polystyrene",        abbr: "PS",   use: "Foam/Cutlery",        feel: "Brittle"           }
    ],
    "textile": [
        { name: "Cotton",     abbr: "CO", use: "Shirts",      feel: "Soft"          },
        { name: "Polyester",  abbr: "PL", use: "Sportswear",  feel: "Synthetic"     },
        { name: "Wool",       abbr: "WO", use: "Sweaters",    feel: "Rough/Warm"    },
        { name: "Nylon",      abbr: "PA", use: "Activewear",  feel: "Strong/Smooth" }
    ],
    "paper": [
        { name: "Cellulose",   abbr: "PAP", use: "Writing paper",   feel: "Thin/Fibrous" },
        { name: "Corrugated",  abbr: "RES", use: "Shipping boxes",  feel: "Thick/Ribbed" },
        { name: "Glossy",      abbr: "GLS", use: "Magazines",       feel: "Slick/Shiny"  },
        { name: "Kraft",       abbr: "KFT", use: "Grocery bags",    feel: "Coarse/Brown" }
    ],
    "wood": [
        { name: "Softwood", abbr: "SW", use: "Construction",    feel: "Light/Fragile"  },
        { name: "Hardwood",  abbr: "HW", use: "Furniture",       feel: "Heavy/Dense"    },
        { name: "Plywood",   abbr: "PW", use: "Cabinets",        feel: "Layered"        },
        { name: "Bamboo",    abbr: "BB", use: "Sustainable tools", feel: "Smooth/Strong" }
    ],
    "glass": [
        { name: "Borosilicate", abbr: "BOR", use: "Lab/Kitchen",  feel: "Heat resistant"      },
        { name: "Soda-Lime",    abbr: "SL",  use: "Bottles/Jars", feel: "Fragile/Common"      },
        { name: "Lead Glass",   abbr: "PB",  use: "Crystalware",  feel: "Heavy/Clear"         },
        { name: "Tempered",     abbr: "TG",  use: "Windows",      feel: "Safety-strengthened" }
    ],
    "electronics": [
        { name: "Lithium",  abbr: "Li", use: "Batteries",  feel: "Metallic"         },
        { name: "Silicon",  abbr: "Si", use: "Microchips", feel: "Glassy/Brittle"   },
        { name: "Copper",   abbr: "Cu", use: "Wiring",     feel: "Flexible/Metallic"},
        { name: "Aluminum", abbr: "Al", use: "Casings",    feel: "Cold/Silver"      }
    ],
    "metal": [
        { name: "Steel",     abbr: "ST",  use: "Food tins",    feel: "Hard/Magnetic"  },
        { name: "Aluminium", abbr: "ALU", use: "Drink cans",   feel: "Light/Soft"     },
        { name: "Tin",       abbr: "TIN", use: "Coatings",     feel: "Shiny/Thin"     },
        { name: "Iron",      abbr: "FE",  use: "Construction", feel: "Heavy/Dull"     }
    ],
    "special": [
        { name: "Alkaline", abbr: "Alk", use: "AA Batteries",  feel: "Heavy/Cylindrical" },
        { name: "Zinc",     abbr: "Zn",  use: "Casing",        feel: "Dull metal"        },
        { name: "Nickel",   abbr: "Ni",  use: "Rechargeables", feel: "Shiny"             },
        { name: "Cadmium",  abbr: "Cd",  use: "Industrial",    feel: "Heavy metal"       }
    ]
};
