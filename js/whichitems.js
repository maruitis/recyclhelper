// ════════════════════════════════════════════════════════════
//  WHICH ITEMS PAGE  ·  js/whichitems.js
// ════════════════════════════════════════════════════════════

const WI_CATEGORIES = [
  {
    id: "plastic", icon: "🧴", title: "Plastic",
    image: "images/plasticbottle.png",
    items: [
      { img: "images/plasticbottle.png", label: "Plastic bottle" },
      { img: "images/plasticbox.png",    label: "Plastic box"    }
    ],
    container: { img: "images/yellowcontainer.png", name: "Yellow Container",
                 desc: "For plastic packaging, bottles, trays, and films." },
    howTo: [
      "Empty and rinse containers — no food residue.",
      "Remove caps and lids (recycle separately or keep on bottle).",
      "Flatten bottles to save space in the bin.",
      "Check the recycling symbol (♳–♷) on the bottom."
    ],
    why: "Recycling one plastic bottle saves enough energy to power a 60 W light bulb for 3 hours. Plastic takes up to 500 years to decompose in a landfill, releasing toxic chemicals into soil and water."
  },
  {
    id: "glass", icon: "🍾", title: "Glass",
    image: "images/glassbottle.png",
    items: [
      { img: "images/glassbottle.png", label: "Glass bottle" },
      { img: "images/glassjar.png",    label: "Glass jar"    }
    ],
    container: { img: "images/greencontainer.png", name: "Green Container",
                 desc: "For glass bottles, jars, and food-grade glassware." },
    howTo: [
      "Rinse the bottle or jar — remove all food residue.",
      "Remove metal lids and caps (put them in the metal bin).",
      "Do NOT include broken glass, mirrors, or ceramics.",
      "Separate by colour if your area requires it (clear / green / brown)."
    ],
    why: "Glass is 100% recyclable and can be recycled endlessly without any loss of quality. Recycling one glass bottle saves enough energy to power a laptop for 25 minutes and reduces CO₂ emissions by 315 g."
  },
  {
    id: "paper", icon: "📰", title: "Paper",
    image: "images/newspaper.png",
    items: [
      { img: "images/paper.png",     label: "Paper sheets" },
      { img: "images/newspaper.png", label: "Newspaper"    }
    ],
    container: { img: "images/bluecontainer.png", name: "Blue Container",
                 desc: "For newspapers, office paper, magazines, and envelopes." },
    howTo: [
      "Keep paper dry — wet or greasy paper cannot be recycled.",
      "Remove staples, plastic windows from envelopes, and tape.",
      "Do NOT include tissues, paper towels, or waxed paper.",
      "Stack or bundle loosely — no need to shred."
    ],
    why: "Recycling 1 tonne of paper saves 17 trees, 26,500 litres of water, and 4,100 kWh of energy. Every tonne of recycled paper also keeps 3 m³ of landfill space free."
  },
  {
    id: "cardboard", icon: "📦", title: "Cardboard & Books",
    image: "images/crdboardbox.png",
    items: [
      { img: "images/crdboardbox.png", label: "Cardboard box" },
      { img: "images/book.png",        label: "Book"          }
    ],
    container: { img: "images/bluecontainer.png", name: "Blue Container",
                 desc: "For cardboard boxes, cartons, and paper-based books." },
    howTo: [
      "Flatten all cardboard boxes to maximise bin space.",
      "Remove any plastic tape, foam padding, or polystyrene inserts.",
      "For books: hardcovers may need the cover removed (glue & board).",
      "Pizza boxes are OK only if the bottom is not soaked in grease."
    ],
    why: "Cardboard is one of the most widely recycled materials — up to 80% of corrugated cardboard is recovered globally. Recycling it cuts the energy needed to produce new cardboard by 75% and drastically reduces deforestation."
  },
  {
    id: "metal", icon: "🥫", title: "Metal & Cans",
    image: "images/tincan.png",
    items: [
      { img: "images/tincan.png", label: "Tin can" }
    ],
    container: { img: "images/orangecontainer.png", name: "Orange Container",
                 desc: "For steel and aluminium cans, foil trays, and tins." },
    howTo: [
      "Rinse cans to remove food — no need to scrub perfectly.",
      "Crush cans to save space (where allowed).",
      "Aluminium foil: scrunch into a ball before placing in the bin.",
      "Do NOT include paint tins, aerosols, or pressurised canisters."
    ],
    why: "Aluminium can be recycled forever. Recycling one aluminium can saves enough energy to run a TV for 3 hours and produces 95% less CO₂ than making new aluminium from raw ore."
  },
  {
    id: "electronics", icon: "💻", title: "Electronics",
    image: "images/laptop.png",
    items: [
      { img: "images/laptop.png",      label: "Laptop"      },
      { img: "images/mobilephone.png", label: "Mobile phone" },
      { img: "images/lightbulb.png",   label: "Light bulb"  }
    ],
    container: { img: "images/redcontainer.png", name: "Red Container / E-Waste",
                 desc: "Take to certified e-waste collection points — never the regular bin." },
    howTo: [
      "Delete personal data and perform a factory reset before dropping off.",
      "Take to a certified e-waste collection point or electronics retailer.",
      "Do NOT place in regular household bins — toxic materials inside.",
      "Keep all components together (charger, cables, accessories)."
    ],
    why: "E-waste is the fastest-growing waste stream globally. A single smartphone contains gold, silver, copper, and rare earth metals. Recycling 1 million phones recovers ~35 kg of gold, 350 kg of silver, and 15,000 kg of copper."
  },
  {
    id: "batteries", icon: "🔋", title: "Batteries",
    image: "images/batteries.png",
    items: [
      { img: "images/batteries.png", label: "Batteries" }
    ],
    container: { img: "images/redcontainer.png", name: "Red Container / Hazardous",
                 desc: "For all battery types — dedicated battery collection boxes." },
    howTo: [
      "Tape the terminals of lithium batteries with clear tape to prevent sparks.",
      "Collect in a small container until you have enough to drop off.",
      "Most supermarkets and electronics stores have free collection boxes.",
      "Never puncture, crush, or throw batteries into fire."
    ],
    why: "Batteries contain lead, mercury, cadmium, and lithium — all harmful to soil and groundwater. Properly recycling batteries recovers valuable materials and prevents toxic leachate from contaminating ecosystems for decades."
  },
  {
    id: "textiles", icon: "👕", title: "Clothing & Textiles",
    image: "images/shirt.png",
    items: [
      { img: "images/shirt.png",   label: "Shirt"   },
      { img: "images/sweater.png", label: "Sweater" },
      { img: "images/jeans.png",   label: "Jeans"   },
      { img: "images/shoes.png",   label: "Shoes"   },
      { img: "images/textile.png", label: "Textile" }
    ],
    container: { img: "images/browncontainer.png", name: "Brown Container / Textile Bank",
                 desc: "Textile donation banks or charity collection points." },
    howTo: [
      "Wash and dry clothes before donating — clean items only.",
      "Wearable clothes → charity shops or clothing banks.",
      "Worn-out items → textile recycling banks (shredded into rags or insulation).",
      "Tie shoes together so they are not separated."
    ],
    why: "The fashion industry is the world's 2nd largest polluter. Recycling 1 kg of cotton saves 10,000 litres of water. Keeping clothes out of landfill reduces methane emissions and prevents synthetic fibres from entering waterways."
  },
  {
    id: "organic", icon: "🍂", title: "Organic & Food Waste",
    image: null,
    emojiItems: [
      { emoji: "🥦", label: "Vegetable scraps" },
      { emoji: "☕", label: "Coffee grounds"   },
      { emoji: "🍌", label: "Fruit peels"      }
    ],
    container: { img: "images/browncontainer.png", name: "Brown Container",
                 desc: "For food scraps, fruit & vegetable peels, and garden waste." },
    howTo: [
      "Use a small kitchen caddy lined with a compostable bag.",
      "Include: fruit & vegetable peelings, tea bags, eggshells, cooked food.",
      "Do NOT include: liquids, oils, packaging, or pet waste.",
      "Empty the caddy regularly to prevent odours and pests."
    ],
    why: "Organic waste in landfills produces methane — a greenhouse gas 25× more potent than CO₂. Composting instead turns waste into nutrient-rich soil improver, reducing the need for chemical fertilisers."
  },
  {
    id: "wood", icon: "🪵", title: "Wood & Furniture",
    image: "images/woodenstool.png",
    items: [
      { img: "images/woodenstool.png", label: "Wooden stool" }
    ],
    container: { img: "images/blackcontainer.png", name: "Black Container / Waste Centre",
                 desc: "Take large wooden items to a local recycling / civic amenity centre." },
    howTo: [
      "Small untreated wood scraps can go to a garden composter.",
      "Large items: take to a civic amenity / waste centre wood skip.",
      "Treated or painted wood must go to specialist collection — not compost.",
      "Good-condition furniture? Donate to charity or a furniture reuse scheme first."
    ],
    why: "Wood makes up a significant portion of bulky waste. Recycled wood is chipped into biomass fuel, animal bedding, or particleboard. This diverts material from landfill and reduces the carbon locked in the wood from being released as methane."
  },
  {
    id: "stationery", icon: "✏️", title: "Stationery",
    image: "images/pen.png",
    items: [
      { img: "images/pen.png",    label: "Pen"    },
      { img: "images/pencil.png", label: "Pencil" }
    ],
    container: { img: "images/bluecontainer.png", name: "Blue Container / Special Scheme",
                 desc: "Wooden pencils → blue bin. Plastic pens → TerraCycle drop-off point." },
    howTo: [
      "Wooden pencils (no metal ferrule): can go in the blue paper/cardboard bin.",
      "Ballpoint & felt-tip pens: collect and drop off at a TerraCycle Writing Instruments scheme.",
      "Refillable pens: buy refill cartridges instead — no recycling needed.",
      "Rubber erasers: currently not recyclable — go in general waste."
    ],
    why: "Billions of pens are thrown away every year worldwide, contributing to plastic pollution. Recycling through dedicated schemes recovers the plastic barrel, metal clip, and ink cartridge separately, keeping all three out of landfill."
  },
  {
    id: "garden", icon: "🌿", title: "Garden Waste",
    image: null,
    emojiItems: [
      { emoji: "🍃", label: "Leaves"          },
      { emoji: "🌱", label: "Plant trimmings" },
      { emoji: "🌾", label: "Grass clippings" }
    ],
    container: { img: "images/greencontainer.png", name: "Green Container / Garden Bin",
                 desc: "For leaves, grass clippings, hedge trimmings, and plant cuttings." },
    howTo: [
      "Place in the green garden waste bin or home compost heap.",
      "Do NOT include soil, stones, treated wood, or plastic pots.",
      "Larger branches: chop into pieces under 30 cm or take to a civic amenity site.",
      "Grass clippings: leave on the lawn as a natural fertiliser (grasscycling)."
    ],
    why: "Garden waste makes up around 20% of household waste. When composted, it becomes a valuable soil conditioner that improves soil structure, retains moisture, and reduces the need for synthetic fertilisers — closing the nutrient loop naturally."
  }
];

// ── Render ────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  const grid  = document.getElementById("wiTileGrid");
  const panel = document.getElementById("wiDetailPanel");

  // Build left-side tiles
  WI_CATEGORIES.forEach(cat => {
    const tile = document.createElement("div");
    tile.className = "wi-tile";
    tile.dataset.id = cat.id;

    if (cat.image) {
      tile.innerHTML = `
        <img src="${cat.image}" alt="${cat.title}" class="wi-tile-img">
        <span class="wi-tile-label">${cat.title}</span>`;
    } else {
      tile.innerHTML = `
        <span class="wi-tile-emoji">${cat.icon}</span>
        <span class="wi-tile-label">${cat.title}</span>`;
    }

    tile.addEventListener("click", () => selectCategory(cat.id));
    grid.appendChild(tile);
  });

  // ── Select a category ─────────────────────────────────────
  function selectCategory(id) {
    document.querySelectorAll(".wi-tile").forEach(t => t.classList.remove("active"));
    const activeTile = document.querySelector(`.wi-tile[data-id="${id}"]`);
    if (activeTile) activeTile.classList.add("active");

    const cat = WI_CATEGORIES.find(c => c.id === id);
    renderDetail(cat);

    // On mobile scroll right panel into view
    if (window.innerWidth < 860) {
      panel.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  // ── Render right-side detail ──────────────────────────────
  function renderDetail(cat) {
    // Items strip
    let itemsHTML = "";
    if (cat.items && cat.items.length) {
      itemsHTML = cat.items.map(item => `
        <div class="wi-item">
          <img src="${item.img}" alt="${item.label}" class="wi-item-img">
          <span class="wi-item-label">${item.label}</span>
        </div>`).join("");
    } else if (cat.emojiItems) {
      itemsHTML = cat.emojiItems.map(ei => `
        <div class="wi-item">
          <span class="wi-item-emoji-lg">${ei.emoji}</span>
          <span class="wi-item-label">${ei.label}</span>
        </div>`).join("");
    }

    const howToHTML = cat.howTo.map(s => `<li>${s}</li>`).join("");

    panel.innerHTML = `
      <div class="wi-detail-card wi-detail-fade">
        <div class="wi-detail-header">
          <span class="wi-detail-icon">${cat.icon}</span>
          <h2 class="wi-detail-title">${cat.title}</h2>
        </div>

        <div class="wi-items-strip">${itemsHTML}</div>

        <hr class="wi-divider">

        <div class="wi-container-row">
          <img src="${cat.container.img}" alt="${cat.container.name}" class="wi-container-img">
          <div class="wi-container-info">
            <span class="wi-container-name">${cat.container.name}</span>
            <span class="wi-container-desc">${cat.container.desc}</span>
          </div>
        </div>

        <hr class="wi-divider">

        <div>
          <p class="wi-section-title">♻️ How to recycle</p>
          <ul class="wi-section-text">${howToHTML}</ul>
        </div>

        <hr class="wi-divider">

        <div>
          <p class="wi-section-title">🌍 Why recycle</p>
          <p class="wi-section-text">${cat.why}</p>
        </div>
      </div>`;
  }

  // Auto-select first on load
  selectCategory(WI_CATEGORIES[0].id);
});
