/* ── EcoBot — Eco Q&A chatbot (no AI, keyword-matched) ────────────────────── */

const ECOBOT_QA = [
    /* ── General ── */
    { tags:['what','recycling','is'], q:'What is recycling?', a:'Recycling turns used materials into new products instead of throwing them away — saving resources, energy, and reducing landfill waste.' },
    { tags:['why','important','matter'], q:'Why is recycling important?', a:'It reduces waste, saves natural resources and energy, cuts pollution, and helps fight climate change. Every item counts!' },
    { tags:['what','materials','recycle','usually'], q:'What materials can usually be recycled?', a:'Paper, cardboard, glass bottles and jars, metal cans, and plastics #1 (PET) and #2 (HDPE) are the most widely accepted.' },
    { tags:['what','happens','recycled','materials'], q:'What happens to recycled materials?', a:'They are collected, sorted by type, cleaned, shredded or melted, then turned into raw material pellets used to make new products.' },
    { tags:['does','recycling','help','planet'], q:'Does recycling really help the planet?', a:'Absolutely. It reduces CO₂ emissions, cuts mining demand, shrinks landfills, and protects wildlife habitats.' },
    { tags:['what','landfill'], q:'What is a landfill?', a:'A landfill is a site where rubbish is buried. Landfills produce methane gas — a powerful greenhouse gas — and can leak chemicals into soil and water.' },
    { tags:['climate','change','recycling'], q:'Can recycling reduce climate change?', a:'Yes. Manufacturing from recycled material emits far less CO₂ than from raw materials. Recycling aluminium saves 95% of the energy needed to make it new.' },
    { tags:['rules','change','city'], q:'Why do recycling rules change by city?', a:'Every municipality has different sorting equipment and processing facilities, so what one city accepts another may not.' },
    { tags:['contamination','what'], q:'What is contamination in recycling?', a:'Contamination happens when non-recyclable items end up in recycling bins. It can ruin entire batches — a single greasy pizza box can contaminate a whole load of paper.' },
    { tags:['clean','why','before','recycling'], q:'Why should items be clean before recycling?', a:'Food residue and liquids damage the recycling process and can ruin other materials. A quick rinse is usually enough.' },
    { tags:['wet','cardboard'], q:'Can wet cardboard be recycled?', a:'Usually no. Wet cardboard fibres weaken and clump together, making them useless for paper mills. Always keep cardboard dry before recycling.' },
    { tags:['bottle','caps','on','off'], q:'Should bottle caps stay on bottles?', a:'In most modern systems, yes — keep caps on. Caps that fall off become too small for sorting machines. Check your local rules though.' },
    { tags:['broken','glass'], q:'Can broken glass be recycled?', a:'Many programmes do not accept it because sharp shards injure workers and jam machinery. Wrap broken glass safely before bin disposal.' },
    { tags:['recycling','symbol','mean'], q:'What do recycling symbols mean?', a:'The Mobius loop (three arrows) shows an item is recyclable. Numbers inside triangles (1–7) identify plastic resin types to help sorting.' },
    { tags:['single','stream'], q:'What is single-stream recycling?', a:'All recyclables go into one bin together. Machines at the sorting facility then separate them automatically.' },
    { tags:['zero','waste'], q:'What is zero waste?', a:'Zero waste is a lifestyle goal: refuse what you don\'t need, reduce what you use, reuse everything possible, and only recycle as a last resort.' },
    { tags:['upcycling'], q:'What is upcycling?', a:'Upcycling means turning old items into something of higher value — like making a tote bag from old jeans or a planter from a tin can.' },
    { tags:['downcycling'], q:'What is downcycling?', a:'Downcycling converts materials into lower-quality products. For example, recycled paper eventually becomes tissue paper as fibres shorten with each cycle.' },
    { tags:['composting','what','is'], q:'What is composting?', a:'Composting breaks down food and garden waste into rich, dark soil called humus. It\'s nature\'s own recycling system and reduces landfill methane.' },
    { tags:['plastic','bags','problem'], q:'Why are plastic bags a problem?', a:'They jam recycling conveyor belts and sorting machines. They also break into microplastics in nature. Use reusable bags instead.' },
    { tags:['energy','save','recycling'], q:'How does recycling save energy?', a:'Making new aluminium from recycled cans uses 95% less energy. Recycled steel saves 60%, paper 40%, and glass 30% compared to virgin production.' },
    { tags:['aluminium','aluminum','saves','most','energy'], q:'Which material saves the most energy when recycled?', a:'Aluminium by a huge margin — recycling it uses 95% less energy than smelting new aluminium from bauxite ore.' },
    { tags:['circular','economy'], q:'What is a circular economy?', a:'A circular economy keeps materials in use as long as possible — products are designed to be repaired, reused, and recycled instead of being thrown away.' },

    /* ── Plastic ── */
    { tags:['all','plastics','recycled'], q:'Can all plastics be recycled?', a:'No. Plastics #1 (PET) and #2 (HDPE) are widely recyclable. #3 PVC, #6 polystyrene, and #7 mixed plastics are rarely accepted at kerbside.' },
    { tags:['plastic','numbers','mean'], q:'What do plastic numbers mean?', a:'Numbers 1–7 in a triangle identify the resin type. #1 PET = water bottles. #2 HDPE = milk jugs. #5 PP = yoghurt pots. #6 PS = foam cups.' },
    { tags:['plastic','bottle','recycle'], q:'Can plastic bottles be recycled?', a:'Yes! PET (#1) bottles are among the most recycled materials globally. Rinse them, crush to save space, and remove caps only if your local scheme requires it.' },
    { tags:['yogurt','cup'], q:'Can yogurt cups be recycled?', a:'Often yes — yogurt pots are usually PP (#5). Check your local guidelines. Always rinse them first.' },
    { tags:['bubble','wrap'], q:'Can bubble wrap be recycled?', a:'Not in kerbside bins. Take it to plastic film collection points — often found at supermarkets alongside carrier bag recycling.' },
    { tags:['straws'], q:'Can straws be recycled?', a:'Most straws are too small and light for sorting machinery. Switch to paper, bamboo, or reusable metal straws instead.' },
    { tags:['shampoo','bottle'], q:'Can shampoo bottles be recycled?', a:'Yes — most are HDPE (#2). Rinse out the last drops (a bit of warm water helps), and drop in your recycling bin.' },
    { tags:['black','plastic'], q:'Why is black plastic difficult to recycle?', a:'Optical sorting machines use infrared light to identify plastics, but black carbon pigment absorbs that light, making black plastic invisible to the sensors.' },
    { tags:['chip','crisp','bag'], q:'Can crisp or chip bags be recycled?', a:'Usually no. They are multi-layer laminates of plastic and foil which cannot be separated. Some brands run specialist take-back programmes.' },
    { tags:['coffee','pod'], q:'Can coffee pods be recycled?', a:'Some brands (like Nespresso) have free postal return schemes. Otherwise most pods are landfill. Look for compostable pod alternatives.' },
    { tags:['microplastic'], q:'What are microplastics?', a:'Tiny plastic particles under 5mm that result from plastic breaking down outdoors. They contaminate oceans, food, and even drinking water. Reducing plastic use is key.' },
    { tags:['plastic','bags','recycle','where'], q:'Where can I recycle plastic bags?', a:'At supermarket or retail collection points — look for a carrier bag / plastic film bin near the entrance. Not in your kerbside recycling bin.' },
    { tags:['biodegradable','plastic'], q:'What is biodegradable plastic?', a:'Plastic engineered to break down under specific conditions (heat, moisture, microbes). Importantly, it does NOT break down in regular landfills or oceans at any useful speed.' },
    { tags:['bioplastic'], q:'What is bioplastic?', a:'Plastic made partly from plant-based materials like corn starch. It\'s not always compostable or recyclable — check the label carefully.' },

    /* ── Paper & Cardboard ── */
    { tags:['paper','recycle','how','many','times'], q:'Can paper be recycled? How many times?', a:'Yes! Paper fibres shorten with each recycling cycle. Most paper can be recycled 5–7 times before the fibres become too short and go to composting or energy recovery.' },
    { tags:['flatten','cardboard'], q:'Should cardboard be flattened before recycling?', a:'Yes — always flatten boxes. It saves huge amounts of space in collection vehicles and at sorting facilities, making the whole system more efficient.' },
    { tags:['pizza','box'], q:'Can pizza boxes be recycled?', a:'The top of the lid (usually clean) can go in paper recycling. The greasy base cannot — grease damages paper fibres and contaminates other paper. Tear them apart!' },
    { tags:['receipt','thermal'], q:'Can receipts be recycled?', a:'Most shop receipts are thermal paper coated with BPA — a chemical that contaminates paper recycling. Put them in general waste.' },
    { tags:['shredded','paper'], q:'Can shredded paper be recycled?', a:'Sometimes — the tiny pieces fall through sorting screens. Put shredded paper in a sealed paper bag or check if your local scheme accepts it.' },
    { tags:['tissues','paper','towels'], q:'Can tissues or paper towels be recycled?', a:'No. They\'ve already been recycled to their shortest fibres and are often contaminated with bacteria. Compost them if you can.' },
    { tags:['book','recycle'], q:'Can books be recycled?', a:'Paperbacks go straight in paper recycling. For hardbacks, remove the cover (it has mixed materials) and recycle the pages separately. Or donate first!' },
    { tags:['wrapping','paper'], q:'Can wrapping paper be recycled?', a:'Plain paper — yes. Foil, glitter, or laminated wrapping paper — no, it can\'t be processed. Do the scrunch test: if it stays scrunched, it\'s recyclable.' },
    { tags:['greasy','paper'], q:'Why can\'t greasy paper be recycled?', a:'Oil coats paper fibres and prevents them bonding during the re-pulping process, creating weak spots and ruining the whole paper batch.' },
    { tags:['egg','carton'], q:'Can egg cartons be recycled?', a:'Paper/cardboard egg cartons — yes! Styrofoam cartons — usually not kerbside. Cardboard cartons are also perfect for seedling starters before composting.' },

    /* ── Glass ── */
    { tags:['glass','recycled','endlessly'], q:'Can glass be recycled endlessly?', a:'Yes! Unlike paper, glass can be recycled indefinitely without losing quality. It\'s one of the most sustainable materials to recycle.' },
    { tags:['glass','bottles','jars'], q:'Can glass bottles and jars be recycled?', a:'Yes — rinse them out and they\'re ready. Labels can usually stay on as the furnace burns them off during processing.' },
    { tags:['mirrors','recycle'], q:'Can mirrors be recycled?', a:'No. Mirror glass has a metallic coating that contaminates the glass recycling stream. Donate or dispose with general waste.' },
    { tags:['drinking','glasses','recycle'], q:'Can drinking glasses be recycled?', a:'Usually not in standard glass bins. They have a different chemical composition (borosilicate or tempered) which doesn\'t melt at the same temperature as bottles.' },
    { tags:['ceramic','recycle'], q:'Can ceramic items be recycled?', a:'No — ceramics are fired at extremely high temperatures and don\'t melt with glass recycling. Even tiny pieces can contaminate a whole batch.' },
    { tags:['broken','glass','dangerous'], q:'Why is broken glass dangerous in recycling?', a:'Sharp shards can seriously injure sorting plant workers and damage machinery. If your programme accepts broken glass, bag it first and label it.' },
    { tags:['cullet'], q:'What is cullet?', a:'Cullet is crushed recycled glass. It\'s the raw material fed into glass furnaces to make new bottles, jars, insulation, and even road surfaces.' },
    { tags:['pyrex'], q:'Can Pyrex be recycled?', a:'No. Pyrex is borosilicate glass with a much higher melting point than bottle glass. Even a small amount in the recycling stream weakens new glass products.' },
    { tags:['new','products','glass'], q:'What new products come from recycled glass?', a:'New bottles and jars, fibreglass insulation, decorative tiles, countertops, road aggregate, and sandblasting grit.' },

    /* ── Metal ── */
    { tags:['aluminium','aluminum','cans'], q:'Can aluminium cans be recycled?', a:'Yes — and it\'s one of the most valuable things you can recycle. A recycled can is back on the shelf in as little as 60 days.' },
    { tags:['steel','cans'], q:'Can steel cans be recycled?', a:'Yes. Steel is the most recycled material on Earth. Use a magnet to identify steel — it\'ll stick. Rinse and recycle.' },
    { tags:['foil','recycle'], q:'Can aluminium foil be recycled?', a:'Yes, if it\'s clean. Scrunch several pieces together into a ball to stop small pieces falling through sorting screens.' },
    { tags:['aerosol','cans'], q:'Can aerosol cans be recycled?', a:'Yes — but only when completely empty. Never pierce or crush aerosols. Leave the cap off so collectors can verify it\'s empty.' },
    { tags:['scrap','metal','pots','pans'], q:'Can pots and pans be recycled?', a:'Not in kerbside bins, but scrap metal recycling facilities accept them. Some councils also have scrap metal collection points.' },
    { tags:['copper','valuable','metal'], q:'What metals are most valuable for recycling?', a:'Copper and aluminium are the most valuable. Copper wiring from electronics and plumbing is highly sought after by scrap dealers.' },
    { tags:['paint','cans'], q:'Can paint cans be recycled?', a:'Only completely dry/empty metal paint cans. Leave the lid off to show they\'re empty. Wet paint must go to a hazardous waste facility.' },
    { tags:['aluminium','why','important'], q:'Why is aluminium recycling important?', a:'Making new aluminium from ore requires enormous energy — recycling uses 95% less. The aluminium in a can could be recycled endlessly for centuries.' },
    { tags:['what','happens','recycled','metal'], q:'What happens to recycled metal?', a:'It\'s sorted by type, shredded, melted in furnaces, purified, and cast into ingots or coils — ready to be rolled into new cans, car parts, or building materials.' },

    /* ── Electronics & Batteries ── */
    { tags:['e-waste','what','is'], q:'What is e-waste?', a:'E-waste is discarded electronics — phones, laptops, TVs, cables, batteries. It\'s the fastest growing waste stream globally and contains both toxic and extremely valuable materials.' },
    { tags:['why','electronics','recycle'], q:'Why should electronics be recycled?', a:'They contain hazardous materials (lead, mercury, cadmium) that poison soil and water, but also precious metals (gold, silver, copper, rare earths) worth recovering.' },
    { tags:['phones','recycle'], q:'Can phones be recycled?', a:'Yes — and they should be. A smartphone contains over 60 elements. Always wipe your data first. Many phone shops offer free take-back.' },
    { tags:['laptops','recycle'], q:'Can laptops be recycled?', a:'Yes. Remove personal data first (factory reset or secure wipe). Manufacturer take-back programmes or e-waste centres accept them.' },
    { tags:['batteries','recycle'], q:'Can batteries be recycled?', a:'Yes — and they must never go in general waste. They can explode in compactor trucks and start fires. Most supermarkets have free battery collection boxes.' },
    { tags:['batteries','dangerous','trash','fire'], q:'Why are batteries dangerous in the bin?', a:'Lithium batteries can short-circuit and start fires in rubbish trucks — a major cause of vehicle fires. Always recycle batteries separately.' },
    { tags:['data','erase','before','recycling'], q:'Should data be erased before recycling devices?', a:'Absolutely. Factory reset your phone, use secure erase on your laptop, and physically destroy hard drives if they contained sensitive data.' },
    { tags:['valuable','materials','electronics'], q:'What valuable materials are in electronics?', a:'Gold (in circuit board contacts), silver (solder), copper (wiring), palladium, and rare earth elements like neodymium. One tonne of phones contains more gold than a tonne of gold ore.' },
    { tags:['where','recycle','electronics'], q:'Where can I recycle electronics?', a:'At e-waste collection centres, large retailer take-back programmes (many are legally required to accept old electronics), charity shops (working items), or council hazardous waste days.' },
    { tags:['fluorescent','bulbs','recycle'], q:'Can fluorescent bulbs be recycled?', a:'Yes — and they must be. They contain mercury. Never put them in general waste. DIY stores and household waste sites have specialist collection points.' },
    { tags:['solar','panels','recycle'], q:'Can solar panels be recycled?', a:'Yes, through specialist facilities. Around 95% of the glass and metals can be recovered. The EU now mandates solar panel recycling under WEEE regulations.' },
    { tags:['cds','dvds','recycle'], q:'Can old CDs and DVDs be recycled?', a:'Not kerbside. Specialist programmes like TerraCycle accept them. The polycarbonate plastic and aluminium layer are both recoverable.' },
    { tags:['rechargeable','batteries'], q:'Can rechargeable batteries be recycled?', a:'Yes. Lithium, nickel-metal hydride, and nickel-cadmium batteries all have dedicated recycling streams. Never bin them — fire risk is very real.' },

    /* ── At Home ── */
    { tags:['start','recycling','home'], q:'How do I start recycling at home?', a:'Set up clearly labelled bins for paper, plastic/metal, glass, and general waste. Put them where you naturally produce waste — kitchen, office, bathroom.' },
    { tags:['apartments','recycle'], q:'Can I recycle from an apartment?', a:'Yes. Most apartment buildings have communal recycling bins or nearby drop-off points. Contact your building manager or local council if you\'re unsure what\'s available.' },
    { tags:['children','kids','teach','recycle'], q:'How can I teach children about recycling?', a:'Make it a game — sort waste together, create art from recyclables, grow plants in recycled containers. Kids who learn young become lifelong recyclers.' },
    { tags:['reduce','household','waste'], q:'How can I reduce household waste?', a:'Buy only what you need, choose products with minimal packaging, use reusable bags and bottles, compost food scraps, and repair items before replacing them.' },
    { tags:['clothes','textile','recycle'], q:'Can old clothes be recycled?', a:'Yes! Clothing banks, charity shops, and textile recycling bins accept all clothes — even worn or torn ones get shredded into insulation and industrial rags.' },
    { tags:['shoes','recycle'], q:'Can shoes be recycled?', a:'Yes. Nike, Adidas, and many charities accept old shoes. Worn-out soles become rubber crumb for playgrounds and sports surfaces.' },
    { tags:['furniture','recycle'], q:'Can furniture be recycled?', a:'Solid wood, metal frames, and springs can all be recycled. Many councils offer bulky item collection. Charity shops and Facebook Marketplace are great first options.' },
    { tags:['cooking','oil','recycle'], q:'Can cooking oil be recycled?', a:'Yes — into biodiesel. Many councils have oil collection points or you can use specialist cooking oil recycling services. Never pour it down the drain.' },
    { tags:['cosmetics','packaging'], q:'Can cosmetics packaging be recycled?', a:'Some can — clean glass perfume bottles, metal lids, HDPE plastic. Brands like L\'Oréal and MAC have in-store take-back schemes for hard-to-recycle packaging.' },

    /* ── Environmental ── */
    { tags:['recycling','reduce','pollution'], q:'How does recycling reduce pollution?', a:'It replaces virgin material extraction — which involves mining, logging, and industrial processing — with less energy-intensive recycling, cutting air and water pollution dramatically.' },
    { tags:['recycling','save','trees'], q:'Does recycling save trees?', a:'Yes. Recycling one tonne of paper saves approximately 17 trees, 26,000 litres of water, and 4,000 kWh of electricity.' },
    { tags:['recycling','save','water'], q:'Does recycling save water?', a:'Yes. Making paper from recycled pulp uses up to 50% less water. Recycling aluminium saves 97% of the water needed to mine and process new aluminium.' },
    { tags:['ocean','plastic'], q:'Can recycling reduce ocean plastic?', a:'Directly and indirectly. Recycling reduces plastic entering the waste stream. But proper waste management infrastructure — especially in coastal regions — is the key lever.' },
    { tags:['how','long','plastic','nature'], q:'How long does plastic last in nature?', a:'Most plastics take 400–1,000 years to break down. They don\'t fully disappear — they fragment into microplastics that persist for millennia.' },
    { tags:['greenhouse','gases'], q:'What are greenhouse gases?', a:'Gases like CO₂, methane, and nitrous oxide that trap heat in the atmosphere and drive climate change. Landfills are a major source of methane — a gas 80x more potent than CO₂ over 20 years.' },
    { tags:['landfills','harmful'], q:'Why are landfills harmful?', a:'They generate methane, leak toxic leachate into groundwater, take up huge land areas, and represent wasted material value. Modern landfill design minimises but cannot eliminate these harms.' },
    { tags:['fast','fashion','waste'], q:'How does fast fashion affect waste?', a:'The fashion industry produces 92 million tonnes of textile waste yearly. Fast fashion items are often worn only 7 times before disposal. Buying less and donating more is key.' },

    /* ── Symbols & Labels ── */
    { tags:['mobius','loop','symbol'], q:'What does the Möbius loop symbol mean?', a:'Three chasing arrows forming a triangle means the item is recyclable. A percentage inside means it contains that much recycled content.' },
    { tags:['compostable','mean'], q:'What does "compostable" mean?', a:'The item will break down into natural matter under specific composting conditions — usually industrial composting facilities that reach high temperatures. Home compostable means it works in your garden bin too.' },
    { tags:['pet','plastic'], q:'What does PET mean?', a:'Polyethylene Terephthalate — plastic #1. Used for clear water bottles, fizzy drink bottles, and food trays. Highly recyclable and in demand.' },
    { tags:['hdpe','plastic'], q:'What does HDPE mean?', a:'High-Density Polyethylene — plastic #2. Used for milk jugs, shampoo bottles, and detergent containers. One of the most commonly recycled plastics.' },
    { tags:['pvc','plastic'], q:'What does PVC mean?', a:'Polyvinyl Chloride — plastic #3. Used in pipes, window frames, and some packaging. Difficult to recycle and releases toxic chlorine compounds if incinerated.' },
    { tags:['number','7','plastic'], q:'Why are some plastics marked #7?', a:'#7 is the "other" category — a catch-all for mixed or uncommon plastics like polycarbonate, bioplastics, and acrylic. Most facilities cannot process these.' },

    /* ── Myths ── */
    { tags:['recycling','pointless','myth'], q:'Is recycling pointless?', a:'Absolutely not. Despite its imperfections, recycling prevents millions of tonnes of waste from landfill annually and saves enormous amounts of energy and raw materials.' },
    { tags:['all','recycling','landfill','myth'], q:'Does all recycling go to landfill?', a:'No — this is a myth. Contamination causes some loads to be rejected, but the vast majority of correctly sorted recycling is genuinely recycled. Sort it right and it will be.' },
    { tags:['one','person','make','difference'], q:'Can one person make a difference?', a:'Yes. If everyone thought "it\'s just me", nothing would change. Mass behaviour is the sum of individual choices. Your habits also influence people around you.' },
    { tags:['recycled','products','lower','quality'], q:'Are recycled products lower quality?', a:'Not always. Recycled aluminium, glass, and steel are identical in quality to virgin material. Some recycled paper is slightly weaker, but grades improve constantly.' },
    { tags:['recycling','enough','save'], q:'Is recycling alone enough to save the planet?', a:'No. Recycling is the last resort in the waste hierarchy. Reducing consumption and reusing products first are far more powerful. Think: Refuse → Reduce → Reuse → Recycle.' },

    /* ── World ── */
    { tags:['countries','recycle','most'], q:'Which countries recycle the most?', a:'Germany leads with ~67% municipal waste recycled, followed by South Korea, Wales, Austria, and Switzerland. They combine strong legislation, good infrastructure, and public education.' },
    { tags:['deposit','return','recycling'], q:'What is deposit return recycling?', a:'You pay a small deposit when buying a drink bottle or can, which you get back when you return the empty container. Return rates in deposit countries often exceed 90%.' },
    { tags:['waste','export'], q:'What is waste export?', a:'Sending rubbish or recyclables to another country for processing. Many countries shipped plastics to Asia for years. China\'s 2018 "National Sword" policy ended most of this, forcing better local solutions.' },

    /* ── Fun Facts ── */
    { tags:['how','many','times','aluminium'], q:'How many times can aluminium be recycled?', a:'Endlessly — without any loss of quality. The same atoms of aluminium in your drink can today could be in an aircraft wing in 60 days.' },
    { tags:['how','quickly','can','recycled','aluminium'], q:'How quickly can a recycled can return to shelves?', a:'As little as 60 days from kerbside bin to back on a supermarket shelf — one of the fastest recycling loops in existence.' },
    { tags:['weird','weirdest','recycle'], q:'What is the weirdest thing people recycle?', a:'Chewing gum (into rubber products), cigarette butts (into industrial plastic), human hair (into oil spill cleanup mats), and old crayons (melted into new ones).' },
    { tags:['what','products','recycled','plastic'], q:'What products are made from recycled plastic?', a:'Fleece clothing, park benches, playground equipment, carrier bags, new bottles, insulation, roofing felt, and carpets.' },
    { tags:['what','products','recycled','paper'], q:'What products are made from recycled paper?', a:'Newspapers, tissue paper, egg cartons, cardboard packaging, insulation, and even new printer paper.' },
    { tags:['what','products','recycled','glass'], q:'What products are made from recycled glass?', a:'New bottles and jars, fibreglass insulation, decorative tiles, glass wool, and road surfacing aggregate.' },
    { tags:['biggest','challenge','recycling'], q:'What is the biggest recycling challenge?', a:'Contamination and multi-material plastic packaging. Products combining different plastics, foil, and paper are nearly impossible to separate and recycle economically.' },
    { tags:['hardest','material','recycle'], q:'What is the hardest material to recycle?', a:'Multi-layer flexible plastics — crisp bags, squeeze pouches, coffee sachets. They blend different polymers and laminates that cannot be separated with current technology.' },
    { tags:['easiest','material','recycle'], q:'What is the easiest material to recycle?', a:'Aluminium and glass — both can be recycled endlessly at high efficiency. Aluminium especially, since it melts easily and loses no quality through the process.' },
    { tags:['simple','habit','most','matters'], q:'What simple recycling habit matters most?', a:'Sorting correctly. Putting the right things in the right bin is the single biggest thing you can do. Contamination is the main reason good recyclables end up in landfill.' },
    { tags:['best','way','reduce','waste'], q:'What is the best way to reduce waste?', a:'Follow the waste hierarchy: Refuse unnecessary items first, then Reduce what you use, Reuse everything you can, Repair before replacing, and only then Recycle.' },

    /* ── Composting ── */
    { tags:['what','foods','compost'], q:'What foods can be composted?', a:'Fruit and vegetable scraps, coffee grounds and filters, tea bags (paper ones), eggshells, bread, and cooked plain rice. Avoid meat, fish, and dairy in home composting.' },
    { tags:['meat','compost'], q:'Can meat be composted?', a:'Not in home composting — it attracts pests and creates odours. Industrial/hot composting facilities can process it safely.' },
    { tags:['leaves','grass','compost'], q:'Can leaves and grass be composted?', a:'Yes — they\'re excellent "brown" and "green" compost materials. Mix roughly equal parts dry (brown) and wet (green) material for a healthy compost heap.' },
    { tags:['how','long','composting','takes'], q:'How long does composting take?', a:'Home cold composting: 3–12 months. Hot composting (turned regularly): 4–8 weeks. Vermicomposting (worms): 2–3 months.' },
    { tags:['compost','smell'], q:'Why does compost smell bad?', a:'Too much wet/green material without enough dry/brown creates anaerobic conditions. Add shredded cardboard or dry leaves and turn the heap to add oxygen.' },
    { tags:['compost','replace','fertilizer'], q:'Can compost replace fertilizer?', a:'Yes — finished compost is rich in nitrogen, phosphorus, and potassium. It improves soil structure, water retention, and feeds soil microorganisms that plants need.' },
    { tags:['coffee','grounds','plants'], q:'Can coffee grounds help plants?', a:'Yes! Coffee grounds add nitrogen, improve drainage, and attract earthworms. Sprinkle them around acid-loving plants like roses, blueberries, and azaleas.' },
    { tags:['eggshells','compost'], q:'Can eggshells be composted?', a:'Yes — eggshells add calcium to compost and soil. Crush them first to speed up breakdown. They also deter slugs when scattered around plants.' },

    /* ── Tires, Oil, Special ── */
    { tags:['tyres','tires','recycle'], q:'Can tyres be recycled?', a:'Yes. Shredded tyres become rubber crumb for playground surfaces, athletics tracks, and road asphalt. Whole tyres can be engineered into flood barriers and retaining walls.' },
    { tags:['engine','motor','oil','recycle'], q:'Can engine oil be recycled?', a:'Yes — used motor oil is re-refined into lubricant or used as fuel oil. Never pour it down drains. Many garages and recycling centres accept it.' },
    { tags:['batteries','explode','fire'], q:'Can batteries explode in recycling bins?', a:'Yes — lithium batteries are the main cause of fires in waste management vehicles and sorting facilities. Always remove batteries and recycle them separately.' },
    { tags:['tires','what','used','for'], q:'What are recycled tyres used for?', a:'Playground surfaces, running tracks, artificial grass infill, road asphalt (rubberised asphalt lasts longer), carpet underlay, and noise-reducing barriers.' },
    { tags:['frying','oil','fuel'], q:'Can frying oil become fuel?', a:'Yes! Used cooking oil is processed into biodiesel — a renewable fuel used in buses, lorries, and boats. Many councils collect it for this purpose.' },
    { tags:['vape','recycle'], q:'Can vape devices be recycled?', a:'Yes — they contain batteries and electronic components. Many local authorities now have dedicated vape collection points. Don\'t bin them — they\'re a fire hazard.' },

    /* ── Wishcycling & Habits ── */
    { tags:['wishcycling','what','is'], q:'What is wishcycling?', a:'Wishcycling is tossing something in the recycling bin and hoping it\'s recyclable. It feels responsible but actually contaminates loads and costs facilities money. When in doubt, find out — or leave it out.' },
    { tags:['greenwashing','what'], q:'What is greenwashing?', a:'When a company markets its products as eco-friendly without meaningful environmental action behind the claim. Look for third-party certifications, not just marketing language.' },
    { tags:['waste','hierarchy','what'], q:'What is the waste hierarchy?', a:'A priority order for handling waste: Refuse → Reduce → Reuse → Repair → Recycle → Recover → Dispose. Recycling sits near the bottom — reducing what you buy in the first place matters more.' },
    { tags:['extended','producer','responsibility'], q:'What is extended producer responsibility?', a:'EPR laws make manufacturers responsible for the end-of-life disposal of their products. This pushes companies to design packaging that\'s easier to recycle or reuse.' },
    { tags:['deposit','scheme','how'], q:'How do deposit return schemes work?', a:'You pay a small deposit (e.g. 20–30 cents) at purchase. When you return the empty bottle or can to a machine or shop, you get the deposit back. Return rates often exceed 90%.' },
    { tags:['plastic','free','switch'], q:'How can I reduce plastic in my daily life?', a:'Use a reusable water bottle and coffee cup, switch to bar soap and shampoo bars, carry a tote bag, choose products with cardboard or glass packaging, and buy in bulk.' },

    /* ── More Plastic ── */
    { tags:['polystyrene','styrofoam','recycle'], q:'Can polystyrene (Styrofoam) be recycled?', a:'Rarely kerbside. Polystyrene is 98% air but hard to process. Some specialist drop-off points compact it. Reducing its use is the better option — choose cardboard or moulded pulp packaging.' },
    { tags:['cling','film','wrap','recycle'], q:'Can cling film be recycled?', a:'Not in standard kerbside bins. Some supermarkets accept it at plastic film collection points alongside carrier bags. Switching to beeswax wraps or reusable silicone lids avoids the problem altogether.' },
    { tags:['plastic','cutlery','recycle'], q:'Can plastic cutlery be recycled?', a:'Almost never — it\'s too small and light for sorting machines and usually made from mixed plastic types. Switch to metal, bamboo, or compostable cutlery when eating on the go.' },
    { tags:['toothpaste','tube','recycle'], q:'Can toothpaste tubes be recycled?', a:'Standard toothpaste tubes are made from mixed plastic and aluminium — very hard to recycle. Colgate has a TerraCycle programme, or switch to toothpaste tablets in paper packaging.' },
    { tags:['medicine','bottle','recycle'], q:'Can plastic medicine bottles be recycled?', a:'Many are HDPE (#2) and technically recyclable, but some councils want them in general waste to avoid contamination. Never flush old medicines — return them to a pharmacy for safe disposal.' },
    { tags:['plastic','toys','recycle'], q:'Can plastic toys be recycled?', a:'Most plastic toys can\'t go in kerbside bins — they\'re mixed plastics with metal parts. Donate working ones to charity. For broken toys, TerraCycle runs a toy recycling programme.' },
    { tags:['nappies','diapers','recycle'], q:'Can nappies (diapers) be recycled?', a:'Specialist programmes exist — companies like Nappy Loop (UK) and Knowaste process used nappies into plastic pellets and materials. Not kerbside, but worth seeking out.' },

    /* ── More Paper ── */
    { tags:['newspaper','recycle'], q:'Can newspaper be recycled?', a:'Yes — newspaper is one of the most recycled paper products. It\'s turned into more newsprint, cardboard, and tissue paper. Just keep it dry and flat.' },
    { tags:['sticky','notes','recycle'], q:'Can sticky notes be recycled?', a:'Yes, the paper itself is recyclable. The small amount of adhesive doesn\'t significantly affect processing. Put them in with regular paper recycling.' },
    { tags:['paper','cups','recycle'], q:'Can paper cups be recycled?', a:'Most paper cups have a thin plastic or wax lining that makes them hard to recycle in standard mills. Some specialist collection points process them. Use a reusable cup whenever possible.' },
    { tags:['envelopes','recycle'], q:'Can envelopes be recycled?', a:'Yes — paper envelopes go in paper recycling. Bubble-lined envelopes (padded mailers) are mixed materials and usually can\'t be recycled kerbside; tear off and separate the paper from the bubble wrap.' },
    { tags:['wax','paper','recycle'], q:'Can wax paper be recycled?', a:'No. The wax coating cannot be removed during the re-pulping process and contaminates other paper. Compost it if it\'s unbleached, or put it in general waste.' },

    /* ── More Glass ── */
    { tags:['window','glass','recycle'], q:'Can window glass be recycled?', a:'Not in bottle banks. Window glass has a different chemical composition and melting point that contaminates glass bottle recycling. Take it to a household waste site — some have specialist glass skips.' },
    { tags:['light','bulbs','recycle'], q:'Can light bulbs be recycled?', a:'LED and CFL bulbs should go to e-waste or hazardous waste collection — CFLs contain mercury. Incandescent bulbs go in general waste. Never put any bulb in glass bottle banks.' },

    /* ── More Metal ── */
    { tags:['bottle','cap','lid','metal'], q:'Can metal bottle caps and lids be recycled?', a:'Yes — steel and aluminium lids are recyclable. But loose small caps fall through sorting screens. Collect them inside a larger steel can, crimp the top shut, then recycle the whole thing.' },
    { tags:['wire','hanger','recycle'], q:'Can wire hangers be recycled?', a:'Not in kerbside bins — they tangle in sorting machinery. Dry cleaners often take them back. Otherwise, a scrap metal dealer will accept them.' },
    { tags:['tin','can','recycle'], q:'Can tin cans be recycled?', a:'Yes — "tin" cans are actually steel with a thin tin coating, making them fully recyclable. Use a magnet to confirm (steel sticks, aluminium doesn\'t). Rinse before recycling.' },
    { tags:['ink','cartridge','recycle'], q:'Can printer ink cartridges be recycled?', a:'Yes. Most major office supply stores (Staples, Office Depot) and manufacturers like HP and Canon have free take-back or mail-back programmes. Never bin them — the ink is hazardous.' },

    /* ── More Electronics ── */
    { tags:['printer','recycle'], q:'Can printers be recycled?', a:'Yes — as e-waste. Many manufacturers offer take-back. Office supply retailers often collect old printers. Remove and separately recycle ink cartridges first.' },
    { tags:['cables','wires','recycle'], q:'Can cables and wires be recycled?', a:'Yes. Cables contain valuable copper and should go to e-waste collection points, not general bins. Tangled cables can jam sorting equipment if placed loose in recycling.' },
    { tags:['television','tv','recycle'], q:'Can TVs be recycled?', a:'Yes — flat screens and old CRT TVs must go to e-waste centres. CRTs contain lead and must never go in general waste. Retailers selling TVs are often legally required to take old ones back.' },

    /* ── More At Home ── */
    { tags:['mattress','recycle'], q:'Can mattresses be recycled?', a:'Yes — specialist mattress recycling facilities dismantle them into foam, steel springs, and fabric fibres, all separately processed. Many councils offer bulky item collection for this.' },
    { tags:['medicines','drugs','dispose'], q:'How should medicines be disposed of?', a:'Return unused or expired medicines to a pharmacy. Never flush them — pharmaceuticals contaminate water supplies and are extremely hard to filter out. Never bin controlled substances.' },
    { tags:['carpet','recycle'], q:'Can carpets be recycled?', a:'Some can. Nylon and polypropylene carpets have specialist recycling routes. Many councils accept carpets at household waste sites. Some retailers take old carpets when fitting new ones.' },
    { tags:['appliances','broken','recycle'], q:'Can broken appliances be recycled?', a:'Yes. Large and small appliances (fridges, microwaves, kettles) are WEEE waste. Retailers must take them back when selling a new equivalent. Household waste sites also have WEEE skips.' },

    /* ── More Composting ── */
    { tags:['paper','napkins','compost'], q:'Can paper napkins be composted?', a:'Yes — unbleached paper napkins and kitchen paper are ideal compost material. Avoid heavily bleached or printed ones. They\'re a great "brown" carbon addition to balance food scraps.' },
    { tags:['pet','waste','compost'], q:'Can pet waste be composted?', a:'Cat and dog waste shouldn\'t go in home compost — it can contain harmful pathogens. Specialist pet waste composters and bokashi systems can handle it safely.' },
    { tags:['wood','ash','compost'], q:'Can wood ash be composted?', a:'Yes — in small amounts. Wood ash is alkaline and adds potassium and calcium. Don\'t add coal ash (toxic heavy metals) and don\'t overdo it — too much raises soil pH above plant tolerance.' },
    { tags:['vermicomposting','worm','farm'], q:'What is vermicomposting?', a:'Composting with worms (usually red wigglers). A worm bin processes food scraps into rich worm castings — one of the most nutrient-dense natural fertilisers. Works well in flats with no garden.' },

    /* ── More Fun Facts ── */
    { tags:['waste','person','day','average'], q:'How much waste does an average person produce per day?', a:'People in high-income countries generate roughly 1–2 kg of waste per person per day. The US average is about 2 kg; European averages are 1–1.5 kg. Global waste is expected to double by 2050.' },
    { tags:['bottles','thrown','away','daily'], q:'How many plastic bottles are thrown away every day?', a:'Around 1 million plastic bottles are purchased every minute globally — that\'s about 480 billion per year. Only about 30% are collected for recycling worldwide.' },
    { tags:['recycling','creates','jobs'], q:'Does recycling create jobs?', a:'Yes — significantly. The recycling industry creates 10–20× more jobs per tonne of material than landfill or incineration. It supports collection, sorting, processing, manufacturing, and logistics sectors.' },
    { tags:['oldest','material','recycled'], q:'What is the oldest recycled material in history?', a:'Bronze-age civilisations recycled metal weapons and tools — melting them down to make new ones. Glass recycling dates to ancient Rome. Humans have always reused valuable materials.' },
];

const ECOBOT_CATEGORIES = [
    { label: '♻ General',      keywords: ['what','recycling','contamination','landfill','energy','upcycling','circular','wishcycling','greenwashing','hierarchy','deposit','producer'] },
    { label: '🧴 Plastic',      keywords: ['plastic','bioplastic','microplastic','biodegradable','film','bag','bottle','shampoo','crisp','polystyrene','styrofoam','cling','cutlery','toothpaste','medicine','nappies'] },
    { label: '📦 Paper',        keywords: ['paper','cardboard','book','receipt','pizza','shredded','wrapping','greasy','egg','newspaper','sticky','cups','envelopes','wax'] },
    { label: '🫙 Glass',        keywords: ['glass','mirror','ceramic','cullet','pyrex','drinking','window','bulb'] },
    { label: '🥫 Metal',        keywords: ['aluminium','aluminum','steel','aerosol','foil','scrap','copper','paint','pots','bottle','cap','wire','hanger','tin','ink','cartridge'] },
    { label: '💻 Electronics',  keywords: ['e-waste','phone','laptop','batteries','fluorescent','solar','data','erase','cds','vape','printer','cables','television','tv'] },
    { label: '🏡 At Home',      keywords: ['home','apartment','children','clothes','shoes','furniture','oil','cosmetics','mattress','medicines','carpet','appliances'] },
    { label: '🌍 Environment',  keywords: ['pollution','trees','water','ocean','greenhouse','landfill','fashion','climate'] },
    { label: '🌱 Composting',   keywords: ['compost','food','meat','leaves','smell','fertilizer','coffee','eggshells','napkins','pet','ash','vermicomposting','worm'] },
    { label: '💡 Fun Facts',    keywords: ['fun','weird','weirdest','hardest','easiest','habit','times','fastest','waste','person','bottles','jobs','oldest'] },
];

/* ── Fuzzy match: score an entry against a query ───── */
function ecobotScore(entry, words) {
    let score = 0;
    const qLower = entry.q.toLowerCase();
    const aLower = entry.a.toLowerCase();
    words.forEach(w => {
        if (entry.tags.some(t => t.includes(w) || w.includes(t))) score += 3;
        if (qLower.includes(w)) score += 2;
        if (aLower.includes(w)) score += 1;
    });
    return score;
}

function ecobotFind(query) {
    const words = query.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(/\s+/).filter(w => w.length > 2);
    if (!words.length) return [];
    const scored = ECOBOT_QA
        .map(e => ({ entry: e, score: ecobotScore(e, words) }))
        .filter(x => x.score > 0)
        .sort((a, b) => b.score - a.score);
    return scored.slice(0, 5).map(x => x.entry);
}

function ecobotByCategory(keywords) {
    return ECOBOT_QA.filter(e =>
        keywords.some(k => e.tags.some(t => t.includes(k) || k.includes(t)))
    ).slice(0, 6);
}

/* ── DOM helpers ─────────────────────────────────────────────────────────── */
function ecobotAddMsg(text, isBot) {
    const msgs = document.getElementById('ecoBotMessages');
    const div = document.createElement('div');
    div.className = 'ecobot-msg ' + (isBot ? 'ecobot-msg-bot' : 'ecobot-msg-user');
    div.textContent = text;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
}

function ecobotShowOptions(entries, question) {
    const cats = document.getElementById('ecoBotCategories');
    cats.innerHTML = '';
    if (!entries.length) {
        ecobotAddMsg('Hmm, I couldn\'t find that one. Try different keywords like "plastic", "battery", or "compost"!', true);
        showCategoryPills();
        return;
    }
    if (question) {
        // direct answer if only one strong match
        if (entries.length === 1) {
            ecobotAddMsg(entries[0].a, true);
            setTimeout(showCategoryPills, 400);
            return;
        }
    }
    entries.forEach(e => {
        const btn = document.createElement('button');
        btn.className = 'ecobot-option';
        btn.textContent = e.q;
        btn.onclick = () => {
            cats.innerHTML = '';
            ecobotAddMsg(e.q, false);
            setTimeout(() => {
                ecobotAddMsg(e.a, true);
                setTimeout(showCategoryPills, 500);
            }, 300);
        };
        cats.appendChild(btn);
    });
}

function showCategoryPills() {
    const cats = document.getElementById('ecoBotCategories');
    cats.innerHTML = '<div class="ecobot-cat-label">Browse a topic:</div>';
    ECOBOT_CATEGORIES.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'ecobot-cat-pill';
        btn.textContent = cat.label;
        btn.onclick = () => {
            cats.innerHTML = '';
            ecobotAddMsg('Showing questions about ' + cat.label, false);
            setTimeout(() => ecobotShowOptions(ecobotByCategory(cat.keywords), false), 200);
        };
        cats.appendChild(btn);
    });
}

/* ── Init ────────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    const trigger  = document.getElementById('ecoBotTrigger');
    const panel    = document.getElementById('ecoBotPanel');
    const closeBtn = document.getElementById('ecoBotClose');
    const input    = document.getElementById('ecoBotInput');
    const sendBtn  = document.getElementById('ecoBotSend');

    if (!trigger || !panel) return;

    trigger.addEventListener('click', () => {
        const open = panel.classList.toggle('ecobot-open');
        panel.setAttribute('aria-hidden', !open);
        if (open) {
            showCategoryPills();
            setTimeout(() => input.focus(), 300);
        }
    });

    closeBtn.addEventListener('click', () => {
        panel.classList.remove('ecobot-open');
        panel.setAttribute('aria-hidden', true);
    });

    function handleSend() {
        const q = input.value.trim();
        if (!q) return;
        input.value = '';
        ecobotAddMsg(q, false);
        document.getElementById('ecoBotCategories').innerHTML = '';
        setTimeout(() => {
            const results = ecobotFind(q);
            ecobotShowOptions(results, true);
        }, 300);
    }

    sendBtn.addEventListener('click', handleSend);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') handleSend(); });
});
