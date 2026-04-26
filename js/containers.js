// ════════════════════════════════════════════════════════════
//  CONTAINERS PAGE  ·  js/containers.js
//
//  HOW IT WORKS:
//  1. CONTAINERS_DB holds curated data for 12 countries.
//     Each country has exactly 4 containers with:
//       • color  → maps to images/[color]container.png
//       • name / subtitle
//       • whatToThrow / doNotThrow arrays
//       • funFacts array (4 facts)
//
//  2. The user picks a country from the <select> dropdown.
//     renderCountry() builds the left column (4 clickable cards)
//     and an empty right-side info panel.
//
//  3. When a container card is clicked:
//       a) The container image plays a CSS shake animation.
//       b) After the shake (550 ms), the right panel fills with
//          that container's info (fade-in animation).
//       c) The clicked card stays highlighted (.active) so the
//          user always knows which one they're reading about.
//
//  4. The right panel is position:sticky so it never scrolls
//     away while the user looks at the left column.
// ════════════════════════════════════════════════════════════

const CONTAINERS_DB = {

  // ── Latvia ──────────────────────────────────────────────────
  latvia: {
    name: "Latvia",
    containers: [
      {
        color: "blue",
        name: "Blue Container",
        subtitle: "Paper & Cardboard",
        whatToThrow: ["Newspapers","Magazines","Cardboard boxes","Office paper","Paper bags","Books (soft cover)","Cardboard packaging"],
        doNotThrow: ["Wet or dirty paper","Waxed cardboard","Tissues","Lined paper cups","Carbon paper"],
        funFacts: [
          "Latvia recycles over 70 % of its paper waste annually.",
          "One tonne of recycled paper saves 17 trees from being cut down.",
          "Recycling paper uses 40 % less energy than making new paper from scratch.",
          "Latvia's paper recycling rate is among the highest in the European Union."
        ]
      },
      {
        color: "yellow",
        name: "Yellow Container",
        subtitle: "Plastic & Metal",
        whatToThrow: ["Plastic bottles","Plastic packaging","Tin cans","Aluminium cans","Metal lids","Plastic bags","Foam packaging"],
        doNotThrow: ["Dirty containers","Motor-oil bottles","PVC materials","Solid Styrofoam","Hazardous material containers"],
        funFacts: [
          "Recycling one aluminium can saves enough energy to run a TV for 3 hours.",
          "Latvia has one of Europe's most efficient deposit-return bottle systems.",
          "Plastic bottles can be recycled into clothing fibres and furniture.",
          "Latvia's yellow-container system was standardised across the country in 2014."
        ]
      },
      {
        color: "green",
        name: "Green Container",
        subtitle: "Glass",
        whatToThrow: ["Glass bottles","Glass jars","Glass containers","Broken glass (wrapped safely)"],
        doNotThrow: ["Ceramic dishes","Mirrors","Light bulbs","Crystal glass","Heat-resistant glass (Pyrex)"],
        funFacts: [
          "Glass can be recycled endlessly without losing quality or purity.",
          "Latvia recycles over 80 % of its glass packaging each year.",
          "Recycled glass melts at lower temperatures, cutting energy use significantly.",
          "One recycled glass bottle saves enough energy to power a computer for 25 minutes."
        ]
      },
      {
        color: "orange",
        name: "Orange Container",
        subtitle: "Organic Waste",
        whatToThrow: ["Food scraps","Fruit & vegetable peels","Coffee grounds","Tea bags","Bread","Egg shells"],
        doNotThrow: ["Meat & fish","Dairy products","Cooking oil","Cooked meals","Diseased plants"],
        funFacts: [
          "Organic waste makes up about 40 % of household garbage in Latvia.",
          "Composted organic waste becomes nutrient-rich soil for agriculture.",
          "Latvia has been expanding its bio-waste collection network since 2020.",
          "1 kg of composted food waste can fertilise 1 m² of garden."
        ]
      }
    ]
  },

  // ── Germany ─────────────────────────────────────────────────
  germany: {
    name: "Germany",
    containers: [
      {
        color: "yellow",
        name: "Yellow Bin (Gelbe Tonne)",
        subtitle: "Plastic, Metal & Packaging",
        whatToThrow: ["Plastic packaging","Tin cans","Aluminium foil","Tetra Pak cartons","Metal bottle caps","Plastic bags","Styrofoam packaging"],
        doNotThrow: ["Glass","Paper","Organic waste","Electronics","Hazardous materials","Clothing"],
        funFacts: [
          "Germany's Grüner Punkt (Green Dot) system is one of the world's most successful recycling schemes.",
          "Germany recycles about 67 % of all packaging waste.",
          "The Gelbe Tonne was introduced in 1991 as part of the Packaging Ordinance.",
          "Germans produce an average of 220 kg of packaging waste per person every year."
        ]
      },
      {
        color: "blue",
        name: "Blue Bin (Altpapier)",
        subtitle: "Paper & Cardboard",
        whatToThrow: ["Newspapers","Magazines","Cardboard","Office paper","Paper packaging","Catalogues","Books"],
        doNotThrow: ["Wet paper","Tissues","Dirty cardboard","Carbon-copy paper","Thermal-paper receipts"],
        funFacts: [
          "Germany recycles over 85 % of its paper and cardboard.",
          "The blue paper bin was standardised across Germany in the 1990s.",
          "Recycled paper saves 70 % of the energy needed to make virgin paper.",
          "Germany is one of the world's largest paper exporters."
        ]
      },
      {
        color: "brown",
        name: "Brown Bin (Biotonne)",
        subtitle: "Organic & Food Waste",
        whatToThrow: ["Fruit & vegetable scraps","Coffee grounds","Tea bags","Grass clippings","Garden waste","Egg shells","Bread"],
        doNotThrow: ["Meat","Fish","Dairy","Cooked food","Cooking oil","Cat litter","Nappies"],
        funFacts: [
          "Germany collects about 4.7 million tonnes of bio-waste annually.",
          "Bio-waste is turned into compost or biogas at over 900 German facilities.",
          "The Biotonne became mandatory in all German municipalities in 2015.",
          "One tonne of composted bio-waste generates enough biogas to heat a home for 2 weeks."
        ]
      },
      {
        color: "black",
        name: "Black Bin (Restmüll)",
        subtitle: "Residual Waste",
        whatToThrow: ["Non-recyclable plastics","Dirty packaging","Hygiene products","Nappies","Dust-bag contents","Broken ceramics"],
        doNotThrow: ["Recyclable paper","Packaging","Glass","Electronics","Hazardous waste","Organic waste"],
        funFacts: [
          "Germany aims to reduce residual waste to near-zero by 2040.",
          "Residual waste in Germany is often converted to energy via incineration.",
          "The average German household generates about 150 kg of residual waste per year.",
          "Germany has cut its residual waste by 40 % since 1990 — a remarkable achievement."
        ]
      }
    ]
  },

  // ── United Kingdom ──────────────────────────────────────────
  uk: {
    name: "United Kingdom",
    containers: [
      {
        color: "blue",
        name: "Blue Bin",
        subtitle: "Mixed Recycling",
        whatToThrow: ["Paper","Cardboard","Plastic bottles","Glass bottles & jars","Tins & cans","Foil"],
        doNotThrow: ["Food waste","Garden waste","Nappies","Electrical items","Clothes","Black bags of rubbish"],
        funFacts: [
          "The UK recycles about 44 % of household waste.",
          "The blue bin system varies between different councils — always check locally.",
          "Recycling rates in Scotland and Wales are consistently higher than England.",
          "The UK exported 3 million tonnes of recyclable material in 2022."
        ]
      },
      {
        color: "green",
        name: "Green Bin",
        subtitle: "Garden & Food Waste",
        whatToThrow: ["Grass cuttings","Leaves","Plant clippings","Twigs and branches","Food scraps","Fruit & vegetables"],
        doNotThrow: ["General household waste","Plastics","Glass","Cooked food","Meat or fish","Soil or stones"],
        funFacts: [
          "Garden waste makes up about 20 % of all UK household waste.",
          "UK councils process over 5 million tonnes of garden waste yearly.",
          "Composted garden waste is sold to farms and nurseries across Britain.",
          "Some UK councils charge separately for green-bin collection."
        ]
      },
      {
        color: "black",
        name: "Black Bin",
        subtitle: "General Household Waste",
        whatToThrow: ["Non-recyclable materials","Food-contaminated packaging","Nappies","Sanitary products","Broken ceramics"],
        doNotThrow: ["Recyclables","Garden waste","Batteries","Electronics","Medicines","Building materials"],
        funFacts: [
          "Black bin waste in the UK is mostly sent to landfill or energy-from-waste plants.",
          "The UK government aims to hit a 65 % recycling rate by 2035.",
          "Some councils have reduced black-bin collections to incentivise recycling.",
          "Black-bin contents generate methane in landfills — a potent greenhouse gas."
        ]
      },
      {
        color: "brown",
        name: "Brown Bin",
        subtitle: "Food Waste",
        whatToThrow: ["All food scraps","Cooked & raw meat","Fish & bones","Dairy products","Bread","Tea bags","Coffee grounds"],
        doNotThrow: ["Liquids","Packaging","Cooking oil (large amounts)","Non-food items"],
        funFacts: [
          "The UK wastes 9.5 million tonnes of food annually.",
          "Separate food-waste collection launched nationally across England in 2025.",
          "Food waste collected in brown bins is processed into biogas.",
          "Diverting food from landfill significantly reduces methane emissions."
        ]
      }
    ]
  },

  // ── USA ─────────────────────────────────────────────────────
  usa: {
    name: "United States",
    containers: [
      {
        color: "blue",
        name: "Blue Bin",
        subtitle: "Single-Stream Recycling",
        whatToThrow: ["Paper & cardboard","Plastic bottles (#1 & #2)","Glass bottles & jars","Metal cans","Aluminium foil"],
        doNotThrow: ["Plastic bags","Styrofoam","Dirty containers","Electronics","Hazardous materials","Medical waste"],
        funFacts: [
          "The US recycles only about 32 % of its waste — well below the global average.",
          "Single-stream recycling was introduced in the US in the 1990s.",
          "America generates more trash per capita than any other country on Earth.",
          "The US recycling industry employs over 500,000 people nationwide."
        ]
      },
      {
        color: "green",
        name: "Green Bin",
        subtitle: "Yard & Compost Waste",
        whatToThrow: ["Leaves","Grass clippings","Branches (under 4 in)","Garden trimmings","Food scraps (where accepted)","Plant material"],
        doNotThrow: ["Rocks","Soil","Pet waste","Treated wood","Large branches","Non-organic materials"],
        funFacts: [
          "Yard waste makes up about 12 % of solid waste in the US.",
          "The US composted 25 million tonnes of food and yard waste in 2018.",
          "Compost programmes exist at over 4,700 US facilities.",
          "California has one of the most advanced composting programmes in the country."
        ]
      },
      {
        color: "black",
        name: "Black Bin",
        subtitle: "General Trash",
        whatToThrow: ["Non-recyclable waste","Food-soiled packaging","Nappies","Broken glass (bagged)","Dust & sweepings"],
        doNotThrow: ["Batteries","Electronics","Hazardous waste","Recyclables","Motor oil","Paint"],
        funFacts: [
          "Americans throw away about 4.9 pounds (2.2 kg) of trash per person per day.",
          "The US has over 2,000 active landfills.",
          "Black-bin waste is increasingly being converted to energy in the US.",
          "Landfills are the third-largest source of methane emissions in the US."
        ]
      },
      {
        color: "red",
        name: "Red Bin",
        subtitle: "Hazardous Household Waste",
        whatToThrow: ["Batteries","Used motor oil","Paint","Pesticides","Cleaning chemicals","Fluorescent bulbs"],
        doNotThrow: ["Regular recyclables","Food waste","General trash","Electronics (use e-waste bins)","Medical sharps"],
        funFacts: [
          "The US generates 1.6 million tonnes of hazardous household waste per year.",
          "Improper disposal of hazardous waste costs the US $1.7 billion in clean-up annually.",
          "Many states hold Household Hazardous Waste (HHW) collection events.",
          "Motor oil recycled in the US could power 1 million cars for an entire year."
        ]
      }
    ]
  },

  // ── France ──────────────────────────────────────────────────
  france: {
    name: "France",
    containers: [
      {
        color: "yellow",
        name: "Yellow Bin (Bac Jaune)",
        subtitle: "Plastic, Metal & Cardboard",
        whatToThrow: ["Plastic bottles","Metal cans","Cardboard boxes","Paper packaging","Tetra Pak cartons","Aluminium cans"],
        doNotThrow: ["Glass","Organic waste","Dirty packaging","Solid Styrofoam","PVC","Black plastic"],
        funFacts: [
          "France expanded the yellow bin to accept ALL types of plastic in 2022.",
          "The French recycle about 26 kg of plastic packaging per person per year.",
          "France's recycling rate is around 41 % — lower than some EU neighbours.",
          "The Bac Jaune system was first introduced across France in 1992."
        ]
      },
      {
        color: "green",
        name: "Green Bin (Bac Vert)",
        subtitle: "Glass",
        whatToThrow: ["Glass bottles","Glass jars","Glass containers","Glass flasks"],
        doNotThrow: ["Ceramics","Crystal","Light bulbs","Mirrors","Window glass","Pyrex dishes"],
        funFacts: [
          "France recycles about 78 % of its glass packaging.",
          "France has over 300,000 glass drop-off points nationwide.",
          "Recycled glass saves 25 % of the energy needed for virgin glass production.",
          "The French glass recycling industry employs over 15,000 people."
        ]
      },
      {
        color: "brown",
        name: "Brown Bin (Bac Marron)",
        subtitle: "Bio-waste",
        whatToThrow: ["Food scraps","Fruit & vegetable peels","Coffee grounds","Egg shells","Garden waste","Grass clippings"],
        doNotThrow: ["Meat (varies by region)","Cooking oil","Plastic bags","Non-organic waste"],
        funFacts: [
          "France made separate bio-waste collection mandatory in January 2024.",
          "Bio-waste represents 30 % of French household trash.",
          "France aims to become a zero-waste country by 2035.",
          "Composted French bio-waste enriches over 200,000 hectares of farmland annually."
        ]
      },
      {
        color: "black",
        name: "Black Bin (Ordures Ménagères)",
        subtitle: "Residual Waste",
        whatToThrow: ["Non-recyclable packaging","Sanitary products","Pet-waste bags","Broken items","Food-contaminated packaging"],
        doNotThrow: ["Glass","Cardboard","Recyclable plastics","Batteries","Medications","Electronics"],
        funFacts: [
          "France aims to reduce residual waste by 50 % by 2030.",
          "Household residual waste in France has decreased 15 % since 2010.",
          "French residual waste is increasingly turned into energy via incineration.",
          "France operates over 125 waste-to-energy incineration plants."
        ]
      }
    ]
  },

  // ── Sweden ──────────────────────────────────────────────────
  sweden: {
    name: "Sweden",
    containers: [
      {
        color: "green",
        name: "Green Bin",
        subtitle: "Food Waste",
        whatToThrow: ["Fruit & vegetables","Bread","Meat & fish","Dairy","Coffee grounds","Tea bags","Egg shells"],
        doNotThrow: ["Packaging","Non-food items","Liquids","Large bones","Shells"],
        funFacts: [
          "Sweden converts 99 % of food waste into biogas or compost.",
          "Stockholm runs its entire bus fleet on biogas produced from food waste.",
          "Sweden recycles or recovers over 99 % of all household waste.",
          "Food-waste biogas powers over 50,000 Swedish cars every day."
        ]
      },
      {
        color: "blue",
        name: "Blue Bin",
        subtitle: "Paper & Newspapers",
        whatToThrow: ["Newspapers","Magazines","Office paper","Paper bags","Envelopes"],
        doNotThrow: ["Cardboard boxes","Plastic-coated paper","Wet paper","Paper cups"],
        funFacts: [
          "Sweden recycles 90 % of its newspaper and magazine waste.",
          "Swedish households sort waste into up to 8 different categories.",
          "Sweden exports its recycled paper to neighbouring countries.",
          "Sweden's paper-recycling system dates all the way back to the 1970s."
        ]
      },
      {
        color: "yellow",
        name: "Yellow Bin",
        subtitle: "Plastic Packaging",
        whatToThrow: ["Plastic bottles","Plastic packaging","Plastic bags","Styrofoam","Plastic pots & containers"],
        doNotThrow: ["Metal","Glass","Organic waste","Electronics","Textiles"],
        funFacts: [
          "Sweden introduced plastic-packaging recycling targets back in 1994.",
          "Sweden's deposit system returns 87 % of PET bottles.",
          "Swedes sort waste into up to 10 different categories in some municipalities.",
          "Sweden's recycling infrastructure is considered a global model."
        ]
      },
      {
        color: "red",
        name: "Red Bin",
        subtitle: "Metal Packaging",
        whatToThrow: ["Tin cans","Aluminium cans","Metal lids","Aluminium foil","Empty aerosols"],
        doNotThrow: ["Full aerosols","Batteries","Electronics","Unwrapped sharp metal objects"],
        funFacts: [
          "Sweden recycles over 90 % of its metal packaging.",
          "Aluminium recycling uses only 5 % of the energy of primary production.",
          "Sweden's metal-recycling industry employs thousands of workers.",
          "Recycled metal can last indefinitely without losing quality."
        ]
      }
    ]
  },

  // ── Netherlands ─────────────────────────────────────────────
  netherlands: {
    name: "Netherlands",
    containers: [
      {
        color: "blue",
        name: "Blue Bin (Papier)",
        subtitle: "Paper & Cardboard",
        whatToThrow: ["Newspapers","Magazines","Cardboard","Paper bags","Books","Envelopes"],
        doNotThrow: ["Plastic-coated paper","Wet paper","Tissues","Carbon paper"],
        funFacts: [
          "The Netherlands recycles over 85 % of paper and cardboard.",
          "Dutch households have access to paper recycling almost everywhere.",
          "The Netherlands is consistently one of Europe's top recycling nations.",
          "Paper recycling reduces CO₂ emissions by 1.5 million tonnes a year in the Netherlands."
        ]
      },
      {
        color: "green",
        name: "Green Bin (GFT)",
        subtitle: "Organic Waste",
        whatToThrow: ["Vegetable & fruit scraps","Garden trimmings","Coffee grounds","Grass","Leaves","Bread"],
        doNotThrow: ["Meat","Dairy","Cooked food","Cat litter","Nappies","Ash"],
        funFacts: [
          "The Netherlands composts over 30 % of all municipal waste.",
          "GFT stands for Groente (vegetables), Fruit, and Tuinafval (garden waste).",
          "Dutch GFT compost is used to enrich agricultural land across the country.",
          "The Netherlands has reduced organic landfill waste by 95 % since 1990."
        ]
      },
      {
        color: "yellow",
        name: "Yellow Bin (PMD)",
        subtitle: "Plastic, Metal & Drink Cartons",
        whatToThrow: ["Plastic packaging","Metal cans","Drink cartons","Aluminium foil","Plastic bottles"],
        doNotThrow: ["Glass","Paper","Organic waste","Non-packaging plastics","Electronics"],
        funFacts: [
          "The Netherlands achieved 90 % PMD recycling rates in major cities.",
          "Dutch PMD recycling generates millions in raw-material revenue annually.",
          "The Netherlands has one of Europe's highest overall recycling rates at 55 %.",
          "PMD collection was standardised nationwide in 2016."
        ]
      },
      {
        color: "black",
        name: "Gray Bin (Restafval)",
        subtitle: "Residual Waste",
        whatToThrow: ["Non-recyclable waste","Dirty packaging","Hygiene products","Mixed-material items"],
        doNotThrow: ["Paper","Organic waste","PMD","Glass","Hazardous materials","Electronics"],
        funFacts: [
          "The Netherlands aims to halve residual waste output by 2025.",
          "Dutch cities charge less for smaller residual bins to encourage recycling.",
          "Amsterdam has an ambitious plan to become fully circular by 2050.",
          "Netherlands residual waste is converted to energy in waste-to-energy plants."
        ]
      }
    ]
  },

  // ── Japan ───────────────────────────────────────────────────
  japan: {
    name: "Japan",
    containers: [
      {
        color: "blue",
        name: "Blue Bag (Shigen Gomi)",
        subtitle: "Recyclable Resources",
        whatToThrow: ["Aluminium & steel cans","Glass bottles","PET bottles","Newspapers","Magazines","Cardboard"],
        doNotThrow: ["Food-contaminated items","Mixed materials","Non-recyclable plastics","Styrofoam"],
        funFacts: [
          "Japan recycles 84 % of its PET plastic bottles — the highest rate in the world.",
          "Japan separates waste into up to 45 different categories in some cities.",
          "Kamikatsu village in Japan has achieved near-zero waste status.",
          "Japanese citizens wash and flatten all containers before placing them in recycling."
        ]
      },
      {
        color: "green",
        name: "Green Bag (Moeru Gomi)",
        subtitle: "Burnable Waste",
        whatToThrow: ["Food scraps","Paper","Rubber","Leather","Non-recyclable plastics","Small wooden items"],
        doNotThrow: ["Recyclables","Metals","Glass","Batteries","Large items","Electronic devices"],
        funFacts: [
          "Japan incinerates about 70 % of its waste, reducing volume by up to 97 %.",
          "Japanese waste-to-energy plants generate electricity for millions of households.",
          "Japan has some of the cleanest incineration facilities in the world.",
          "Incineration ash in Japan is used in road construction and land reclamation."
        ]
      },
      {
        color: "yellow",
        name: "Yellow Bag (Moenai Gomi)",
        subtitle: "Non-Burnable Waste",
        whatToThrow: ["Glass items","Ceramics","Small metal items","Cookware","Umbrellas","Bulky plastics"],
        doNotThrow: ["Recyclable glass/metal","Burnable items","Hazardous waste","Large furniture","Electronics"],
        funFacts: [
          "Japan's waste-sorting system is widely considered the world's most complex.",
          "Non-burnable waste collection happens only a few times per month in Japan.",
          "Japan's waste-management culture is taught in schools from an early age.",
          "Placing waste in the wrong bag can result in it being returned with an explanatory note."
        ]
      },
      {
        color: "red",
        name: "Red / Special Bag",
        subtitle: "Hazardous & Small Electronics",
        whatToThrow: ["Batteries","Fluorescent bulbs","Small electronics","Empty spray cans","Dry-cell batteries"],
        doNotThrow: ["Regular trash","Recyclables","Food waste","Large appliances (use designated collection)"],
        funFacts: [
          "Japan's Home Appliance Recycling Law (2013) covers TVs, fridges, ACs, and washing machines.",
          "Battery recycling rate in Japan exceeds 90 %.",
          "Fluorescent-lamp recycling in Japan significantly reduces mercury pollution.",
          "Japan strictly controls the disposal of small home appliances to recover rare metals."
        ]
      }
    ]
  },

  // ── Australia ───────────────────────────────────────────────
  australia: {
    name: "Australia",
    containers: [
      {
        color: "yellow",
        name: "Yellow Bin",
        subtitle: "Mixed Recycling",
        whatToThrow: ["Plastic bottles (#1, #2, #5)","Paper & cardboard","Glass bottles & jars","Tin cans","Aluminium cans"],
        doNotThrow: ["Plastic bags","Styrofoam","Food waste","Clothing","Electronics","Hazardous materials"],
        funFacts: [
          "Australia recycles about 37 % of all waste generated.",
          "The yellow lid bin was standardised nationally across Australia in 2019.",
          "Australia exports significant quantities of recyclable materials to Asia.",
          "The National Waste Policy targets 80 % average resource recovery by 2030."
        ]
      },
      {
        color: "green",
        name: "Green Bin",
        subtitle: "Garden & Organic Waste",
        whatToThrow: ["Grass clippings","Leaves","Garden prunings","Small branches","Food scraps (where accepted)","Weeds"],
        doNotThrow: ["Plastic bags","Soil","Rocks","Animal waste","Treated timber","General household waste"],
        funFacts: [
          "Garden organics make up 40 % of Australian household waste.",
          "Australia composted 3.4 million tonnes of organics in 2020.",
          "Some states offer free compost to residents made from green-bin processing.",
          "Australia's organic waste emits 17 million tonnes of CO₂-equivalent from landfill."
        ]
      },
      {
        color: "red",
        name: "Red Bin",
        subtitle: "General Waste",
        whatToThrow: ["Non-recyclable waste","Food scraps","Nappies","Hygiene products","Contaminated packaging"],
        doNotThrow: ["Recyclables","Garden waste","Batteries","Chemicals","Electronics","Medical waste"],
        funFacts: [
          "Australians generate over 2 tonnes of waste per person each year.",
          "Australia's National Food Waste Strategy aims to halve food waste by 2030.",
          "Red-bin waste in Australia mostly goes to landfill.",
          "Some councils capture landfill gas from red-bin waste to generate electricity."
        ]
      },
      {
        color: "blue",
        name: "Blue / Purple Bin",
        subtitle: "Glass Only (select councils)",
        whatToThrow: ["Glass bottles","Glass jars","Glass beverage containers"],
        doNotThrow: ["Broken glass (bag separately)","Ceramics","Crystal","Light bulbs","Window glass","Mirrors"],
        funFacts: [
          "Separate glass bins were introduced to improve recycled-glass quality.",
          "Mixed recycling bins often contaminate glass with paper dust and labels.",
          "Recycled glass reduces landfill use and conserves raw silica sand.",
          "Australian glass recycling avoids 1.4 million tonnes of CO₂ annually."
        ]
      }
    ]
  },

  // ── Canada ──────────────────────────────────────────────────
  canada: {
    name: "Canada",
    containers: [
      {
        color: "blue",
        name: "Blue Box / Bin",
        subtitle: "Mixed Recycling",
        whatToThrow: ["Paper & cardboard","Plastic bottles (#1, #2, #5)","Glass bottles & jars","Metal cans","Aluminium foil"],
        doNotThrow: ["Plastic bags","Styrofoam","Electronics","Hazardous materials","Food waste","Clothing"],
        funFacts: [
          "Canada's Blue Box programme started in Kitchener, Ontario, in 1981.",
          "The Blue Box is one of the world's very first curbside recycling programmes.",
          "Canada recycles about 28 % of its overall waste.",
          "Extended Producer Responsibility laws are expanding Blue Box coverage nationally."
        ]
      },
      {
        color: "green",
        name: "Green Bin",
        subtitle: "Organic Waste",
        whatToThrow: ["Food scraps","Meat & fish","Dairy","Bread","Coffee grounds","Paper towels"],
        doNotThrow: ["Non-compostable plastic bags","Packaging","Non-organic materials","Large bones"],
        funFacts: [
          "Canada diverts about 1.5 million tonnes of organics from landfill every year.",
          "Toronto's Green Bin programme alone diverts over 125,000 tonnes of food waste yearly.",
          "Green-bin compost enriches over 100,000 acres of Ontario farmland.",
          "Food waste represents 40 % of all waste sent to Canadian landfills."
        ]
      },
      {
        color: "black",
        name: "Black / Gray Bin",
        subtitle: "Garbage",
        whatToThrow: ["Non-recyclable waste","Non-compostable food packaging","Nappies","Tissues","Pet waste"],
        doNotThrow: ["Recyclables","Organic waste","Hazardous materials","Electronics","Batteries"],
        funFacts: [
          "Canada generates 720 kg of waste per person per year — among the highest globally.",
          "Some Canadian provinces are targeting a 90 % diversion rate by 2030.",
          "Black-bin contents are increasingly being converted to energy in Canada.",
          "Canadian landfills capture methane for electricity generation in several cities."
        ]
      },
      {
        color: "yellow",
        name: "Yellow Bin",
        subtitle: "Packaging & Paper (select regions)",
        whatToThrow: ["Cardboard packaging","Plastic packaging","Metal packaging","Paper bags"],
        doNotThrow: ["Glass (separate stream in many areas)","Food waste","Electronics","Textiles"],
        funFacts: [
          "Canada is transitioning to standardised waste sorting across all provinces.",
          "Provincial differences create confusion — bin colours vary by municipality.",
          "Canada's packaging-waste legislation is being harmonised to simplify sorting.",
          "Waste diversion rates vary from 20 % to 60 % across Canadian provinces."
        ]
      }
    ]
  },

  // ── Spain ───────────────────────────────────────────────────
  spain: {
    name: "Spain",
    containers: [
      {
        color: "yellow",
        name: "Yellow Container (Amarillo)",
        subtitle: "Plastic, Metal & Brick Packaging",
        whatToThrow: ["Plastic bottles","Plastic bags","Tin cans","Aluminium cans","Tetra Pak cartons","Metal lids"],
        doNotThrow: ["Glass","Paper","Organic waste","Electronics","Clothing","Non-packaging plastics"],
        funFacts: [
          "Spain collected 1.6 million tonnes of packaging waste in 2022.",
          "Spain's Ecoembes organisation manages the yellow and blue bin systems nationwide.",
          "The yellow container was introduced across Spain in 1997.",
          "Spain currently recycles about 55 % of its packaging waste."
        ]
      },
      {
        color: "blue",
        name: "Blue Container (Azul)",
        subtitle: "Paper & Cardboard",
        whatToThrow: ["Newspapers","Magazines","Cardboard","Paper bags","Books","Office paper"],
        doNotThrow: ["Wet paper","Tissues","Waxed cardboard","Plastic-coated paper"],
        funFacts: [
          "Spain recycles over 85 % of paper and cardboard.",
          "Aspapel, the Spanish paper association, oversees the paper recycling system.",
          "Spain is consistently among Europe's top paper recyclers.",
          "Each tonne of recycled paper saves 4,100 kWh of energy."
        ]
      },
      {
        color: "green",
        name: "Green Container (Verde)",
        subtitle: "Glass",
        whatToThrow: ["Glass bottles","Glass jars","Glass containers"],
        doNotThrow: ["Ceramics","Crystal","Light bulbs","Mirrors","Window glass","Pyrex dishes"],
        funFacts: [
          "Spain recycled 75 % of glass packaging in 2022.",
          "Ecovidrio manages glass recycling across all of Spain.",
          "Spain has over 100,000 glass collection igloos across the country.",
          "Each recycled glass bottle avoids 300 g of CO₂ emissions."
        ]
      },
      {
        color: "brown",
        name: "Brown Container (Marrón)",
        subtitle: "Organic & Food Waste",
        whatToThrow: ["Food scraps","Vegetable & fruit peels","Coffee grounds","Garden waste","Bread"],
        doNotThrow: ["Packaging","Non-organic waste","Large volumes of cooking oil","Non-food items"],
        funFacts: [
          "Spain made separate organic waste collection mandatory in January 2023.",
          "Organic waste represents 40 % of Spanish household garbage.",
          "Spanish bio-waste is composted and used to improve agricultural soil.",
          "Spain aims to recycle 60 % of municipal waste by 2030."
        ]
      }
    ]
  },

  // ── Poland ──────────────────────────────────────────────────
  poland: {
    name: "Poland",
    containers: [
      {
        color: "yellow",
        name: "Yellow Container",
        subtitle: "Plastic & Metal",
        whatToThrow: ["Plastic bottles","Plastic packaging","Tin cans","Aluminium cans","Foil packaging"],
        doNotThrow: ["Glass","Paper","Organic waste","Electronics","Hazardous waste"],
        funFacts: [
          "Poland introduced mandatory 5-stream recycling in 2020.",
          "Poland's recycling rate jumped from 25 % to 34 % after new regulations.",
          "Poland generates about 380 kg of waste per person annually.",
          "The yellow container was standardised nationwide in Poland in 2017."
        ]
      },
      {
        color: "blue",
        name: "Blue Container",
        subtitle: "Paper",
        whatToThrow: ["Newspapers","Magazines","Cardboard","Paper bags","Cartons"],
        doNotThrow: ["Wet paper","Tissues","Dirty cardboard","Wallpaper"],
        funFacts: [
          "Poland recycles about 80 % of its paper waste.",
          "Poland's paper industry uses recycled fibre for over half its production.",
          "Warsaw has one of Poland's most advanced paper-sorting systems.",
          "Recycled paper helps Poland significantly reduce deforestation."
        ]
      },
      {
        color: "green",
        name: "Green Container",
        subtitle: "Glass",
        whatToThrow: ["Glass bottles","Glass jars","Glass containers of all colours"],
        doNotThrow: ["Ceramic tiles","Light bulbs","Mirrors","Crystal glassware","Window glass"],
        funFacts: [
          "Poland recycles about 72 % of glass packaging.",
          "Poland has deposit systems for certain returnable glass bottles.",
          "Kraków leads Poland in glass-recycling rates.",
          "Recycled glass in Poland is used for new packaging and fiberglass insulation."
        ]
      },
      {
        color: "brown",
        name: "Brown Container",
        subtitle: "Bio-waste",
        whatToThrow: ["Food scraps","Vegetable & fruit peels","Coffee grounds","Grass","Leaves","Garden waste"],
        doNotThrow: ["Meat (some areas)","Dairy","Cooked food","Non-organic waste"],
        funFacts: [
          "Bio-waste collection is relatively new in Poland, expanded significantly after 2020.",
          "Poland aims to compost 65 % of bio-waste by 2025.",
          "Polish compost is used to improve the quality of agricultural soil.",
          "Organic waste in landfills generates methane — a problem Poland is actively reducing."
        ]
      }
    ]
  }
};

// ════════════════════════════════════════════════════════════
//  DOM helpers
// ════════════════════════════════════════════════════════════

// Safely escape text for innerHTML
function esc(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Build a list of tag pills
function renderTags(arr, isNo) {
  return arr.map(t => `<span class="info-tag${isNo ? " no" : ""}">${esc(t)}</span>`).join("");
}

// Build the full info panel HTML for one container
function buildInfoHTML(c) {
  return `
    <div class="info-panel-header">
      <img class="info-panel-thumb" src="images/${c.color}container.png" alt="${esc(c.name)}">
      <div class="info-panel-titles">
        <p class="info-panel-name">${esc(c.name)}</p>
        <p class="info-panel-subtitle">${esc(c.subtitle)}</p>
      </div>
    </div>

    <div class="info-section">
      <div class="info-section-title">♻️ What goes in</div>
      <div class="info-items-grid">${renderTags(c.whatToThrow, false)}</div>
    </div>

    <div class="info-section">
      <div class="info-section-title">🚫 What does NOT go in</div>
      <div class="info-items-grid">${renderTags(c.doNotThrow, true)}</div>
    </div>

    <div class="info-section">
      <div class="info-section-title">💡 Fun facts</div>
      <ul class="fun-facts-list">
        ${c.funFacts.map(f => `<li>${esc(f)}</li>`).join("")}
      </ul>
    </div>
  `;
}

// ════════════════════════════════════════════════════════════
//  Render the two-column layout for a chosen country
// ════════════════════════════════════════════════════════════

let activeIdx = null;           // which card is currently selected
let currentCountryKey = null;   // key of the selected country
let seenContainers = new Set(); // tracks which containers have been clicked

function renderCountry(key) {
  currentCountryKey = key;
  seenContainers = new Set();
  const country = CONTAINERS_DB[key];
  const main = document.getElementById("containersMain");

  // Build left-column cards HTML
  const cardsHTML = country.containers.map((c, i) => `
    <div class="container-card" data-idx="${i}" tabindex="0" role="button"
         aria-label="${esc(c.name)} — click for info">
      <div class="container-img-wrap">
        <img class="container-img"
             src="images/${c.color}container.png"
             alt="${esc(c.name)}"
             draggable="false">
      </div>
      <div class="container-card-label">
        <div class="container-card-name">${esc(c.name)}</div>
        <div class="container-card-sub">${esc(c.subtitle)}</div>
      </div>
    </div>
  `).join("");

  // Right panel is hidden until the first card is clicked — no empty state needed

  main.innerHTML = `
    <div class="containers-layout">
      <div class="containers-left" id="containersLeft">${cardsHTML}</div>
      <div class="containers-right" id="containersRight" style="display:none">
        <div class="container-info-panel" id="infoPanel"></div>
      </div>
    </div>
  `;

  activeIdx = null;
  attachCardListeners(country);
}

// ════════════════════════════════════════════════════════════
//  Click / keyboard interaction on container cards
// ════════════════════════════════════════════════════════════

function attachCardListeners(country) {
  const cards = document.querySelectorAll(".container-card");

  cards.forEach(card => {
    // Mouse click
    card.addEventListener("click", () => selectCard(card, country));

    // Keyboard: Enter or Space
    card.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        selectCard(card, country);
      }
    });
  });
}

function selectCard(card, country) {
  const idx = parseInt(card.dataset.idx, 10);

  // Update active highlight on cards
  document.querySelectorAll(".container-card").forEach(c => c.classList.remove("active"));
  card.classList.add("active");

  // Shake the image
  const img = card.querySelector(".container-img");
  img.classList.remove("shaking");           // reset in case still running
  // Force reflow so the animation restarts
  void img.offsetWidth;
  img.classList.add("shaking");

  // Remove shake class after animation ends
  img.addEventListener("animationend", () => img.classList.remove("shaking"), { once: true });

  // After a short delay (matches shake duration), show the info
  setTimeout(() => {
    const panel = document.getElementById("infoPanel");
    const right = document.getElementById("containersRight");
    if (!panel || !right) return;

    // Reveal the right column if this is the first click
    right.style.display = "";

    panel.innerHTML = buildInfoHTML(country.containers[idx]);

    // Trigger fade-in
    panel.classList.remove("panel-fade-in");
    void panel.offsetWidth;
    panel.classList.add("panel-fade-in");

    activeIdx = idx;

    // Reveal quiz button once all 4 images have been clicked at least once
    seenContainers.add(idx);
    if (seenContainers.size >= 4 && !document.getElementById("quizBtnWrap")) {
      showQuizButton();
    }
  }, 300); // start filling at ~halfway through shake
}

// ════════════════════════════════════════════════════════════
//  Country selector wiring
// ════════════════════════════════════════════════════════════

document.addEventListener("DOMContentLoaded", () => {
  const select = document.getElementById("countrySelect");
  const main   = document.getElementById("containersMain");

  // Restore last selection from localStorage
  const saved = localStorage.getItem("containers_country");
  if (saved && CONTAINERS_DB[saved]) {
    select.value = saved;
    renderCountry(saved);
  }

  select.addEventListener("change", () => {
    const key = select.value;
    if (!key) {
      main.innerHTML = `<div class="containers-placeholder">Pick a country above to get started ♻️</div>`;
      localStorage.removeItem("containers_country");
      return;
    }
    localStorage.setItem("containers_country", key);
    renderCountry(key);
  });
});

// ════════════════════════════════════════════════════════════
//  QUIZ ENGINE
//  Appears below the container layout once every image is clicked.
//  7 country-specific questions, a/b/c/d options, score screen.
// ════════════════════════════════════════════════════════════

// ─── Country-specific questions ──────────────────────────────
// Each entry: { q: "question", opts: ["A","B","C","D"], a: correctIndex }

const QUIZ_DB = {
  latvia: [
    { q: "What colour is the container for paper and cardboard in Latvia?", opts: ["Green","Blue","Yellow","Orange"], a: 1 },
    { q: "Which container collects plastic bottles and tin cans in Latvia?", opts: ["Blue","Green","Orange","Yellow"], a: 3 },
    { q: "What percentage of paper waste does Latvia recycle annually?", opts: ["Over 50 %","Over 70 %","Over 90 %","Over 40 %"], a: 1 },
    { q: "Which of these should NOT go in Latvia's green glass container?", opts: ["Glass bottles","Glass jars","Ceramic dishes","Broken glass"], a: 2 },
    { q: "What does Latvia's orange container collect?", opts: ["Plastic waste","Glass","Organic food waste","Paper"], a: 2 },
    { q: "Recycling one aluminium can saves enough energy to run a TV for how long?", opts: ["1 hour","3 hours","5 hours","30 minutes"], a: 1 },
    { q: "How many trees does recycling one tonne of paper save?", opts: ["5 trees","10 trees","17 trees","25 trees"], a: 2 }
  ],
  germany: [
    { q: "What is the German name for the organic waste bin?", opts: ["Restmüll","Altpapier","Biotonne","Gelbe Tonne"], a: 2 },
    { q: "What does the Gelbe Tonne (yellow bin) collect?", opts: ["Paper & cardboard","Glass only","Plastic, metal & packaging","Organic waste"], a: 2 },
    { q: "In what year was the Gelbe Tonne introduced in Germany?", opts: ["1985","1991","1999","2005"], a: 1 },
    { q: "Which bin should newspapers go in, in Germany?", opts: ["Gelbe Tonne","Restmüll","Biotonne","Altpapier"], a: 3 },
    { q: "What percentage of packaging waste does Germany recycle?", opts: ["About 45 %","About 55 %","About 67 %","About 80 %"], a: 2 },
    { q: "Since which year is the Biotonne mandatory in all German municipalities?", opts: ["2010","2012","2015","2018"], a: 2 },
    { q: "Which item should NOT go into Germany's Biotonne?", opts: ["Coffee grounds","Egg shells","Meat","Grass clippings"], a: 2 }
  ],
  uk: [
    { q: "What does the blue bin typically collect in the UK?", opts: ["General household waste","Mixed recycling","Garden waste","Food waste"], a: 1 },
    { q: "What colour bin is used for garden waste in the UK?", opts: ["Black","Blue","Green","Brown"], a: 2 },
    { q: "What percentage of household waste does the UK currently recycle?", opts: ["About 30 %","About 44 %","About 60 %","About 75 %"], a: 1 },
    { q: "What colour bin handles general household waste in the UK?", opts: ["Blue","Green","Brown","Black"], a: 3 },
    { q: "When did separate food waste collection launch nationally in England?", opts: ["2020","2022","2023","2025"], a: 3 },
    { q: "What is the UK government's recycling rate target by 2035?", opts: ["50 %","60 %","65 %","75 %"], a: 2 },
    { q: "How much food does the UK waste annually?", opts: ["2.5 million tonnes","5 million tonnes","9.5 million tonnes","15 million tonnes"], a: 2 }
  ],
  usa: [
    { q: "What recycling system does the USA's blue bin use?", opts: ["Source-separated","Single-stream","Glass-only","Organic-only"], a: 1 },
    { q: "What percentage of its waste does the US recycle?", opts: ["About 20 %","About 32 %","About 50 %","About 65 %"], a: 1 },
    { q: "What colour bin handles yard and compost waste in the US?", opts: ["Blue","Black","Green","Red"], a: 2 },
    { q: "Which type of waste goes in the red bin in the US?", opts: ["Food waste","Paper","Hazardous household waste","Garden waste"], a: 2 },
    { q: "How many pounds of trash does the average American throw away per day?", opts: ["2.1 lbs","3.5 lbs","4.9 lbs","6.2 lbs"], a: 2 },
    { q: "Which of these should NOT go in the US blue recycling bin?", opts: ["Paper","Glass jars","Plastic bags","Metal cans"], a: 2 },
    { q: "How many people does the US recycling industry employ?", opts: ["Over 100,000","Over 250,000","Over 500,000","Over 1 million"], a: 2 }
  ],
  france: [
    { q: "What is the French name for the yellow recycling bin?", opts: ["Bac Vert","Bac Marron","Bac Jaune","Ordures Ménagères"], a: 2 },
    { q: "What colour container collects glass in France?", opts: ["Yellow","Blue","Brown","Green"], a: 3 },
    { q: "In what year did France expand the yellow bin to ALL types of plastic?", opts: ["2018","2020","2022","2024"], a: 2 },
    { q: "When did France make separate bio-waste collection mandatory?", opts: ["January 2020","January 2022","January 2024","January 2026"], a: 2 },
    { q: "What percentage of glass packaging does France recycle?", opts: ["About 55 %","About 65 %","About 78 %","About 90 %"], a: 2 },
    { q: "What does France's black bin (Ordures Ménagères) collect?", opts: ["Glass","Recyclable plastics","Residual waste","Organic waste"], a: 2 },
    { q: "How many glass drop-off points does France have?", opts: ["Over 50,000","Over 100,000","Over 200,000","Over 300,000"], a: 3 }
  ],
  sweden: [
    { q: "What does Sweden's green bin collect?", opts: ["Garden waste","Food waste","Plastic packaging","Glass"], a: 1 },
    { q: "What percentage of food waste does Sweden convert into biogas or compost?", opts: ["75 %","85 %","95 %","99 %"], a: 3 },
    { q: "What runs on biogas from food waste in Stockholm?", opts: ["Trains","The entire bus fleet","Taxis","Trams"], a: 1 },
    { q: "What colour bin collects paper and newspapers in Sweden?", opts: ["Green","Yellow","Blue","Red"], a: 2 },
    { q: "What does Sweden's red bin collect?", opts: ["Hazardous waste","Food waste","Metal packaging","Glass"], a: 2 },
    { q: "What is Sweden's deposit return rate for PET bottles?", opts: ["65 %","75 %","87 %","95 %"], a: 2 },
    { q: "Into how many waste categories do Swedes sort in some municipalities?", opts: ["Up to 3","Up to 5","Up to 8","Up to 10"], a: 3 }
  ],
  netherlands: [
    { q: "What does 'GFT' stand for in the Netherlands?", opts: ["Glass, Foil, Tin","Groente, Fruit, Tuinafval","Groen, Folie, Textiel","Glas, Friet, Tin"], a: 1 },
    { q: "What does the yellow PMD bin collect in the Netherlands?", opts: ["Paper only","Glass only","Plastic, metal & drink cartons","Organic waste"], a: 2 },
    { q: "What percentage of paper and cardboard does the Netherlands recycle?", opts: ["Over 60 %","Over 75 %","Over 85 %","Over 95 %"], a: 2 },
    { q: "In what year was PMD collection standardised nationwide in the Netherlands?", opts: ["2010","2013","2016","2019"], a: 2 },
    { q: "What is the overall recycling rate of the Netherlands?", opts: ["About 35 %","About 45 %","About 55 %","About 65 %"], a: 2 },
    { q: "What colour bin collects organic waste (GFT) in the Netherlands?", opts: ["Yellow","Blue","Green","Brown"], a: 2 },
    { q: "By what year does Amsterdam aim to become fully circular?", opts: ["2030","2040","2050","2060"], a: 2 }
  ],
  japan: [
    { q: "What percentage of PET plastic bottles does Japan recycle — the world's highest?", opts: ["60 %","72 %","84 %","96 %"], a: 2 },
    { q: "What does 'Moeru Gomi' (green bag) collect in Japan?", opts: ["Recyclable resources","Burnable waste","Non-burnable waste","Hazardous waste"], a: 1 },
    { q: "How many different waste categories do some Japanese cities sort into?", opts: ["Up to 10","Up to 20","Up to 30","Up to 45"], a: 3 },
    { q: "What percentage of Japan's waste is incinerated?", opts: ["About 40 %","About 55 %","About 70 %","About 85 %"], a: 2 },
    { q: "Which Japanese village has achieved near-zero waste status?", opts: ["Kyoto village","Kamikatsu","Nara village","Shirakawa"], a: 1 },
    { q: "What is 'Shigen Gomi' (blue bag) in Japan?", opts: ["Burnable waste","Non-burnable waste","Recyclable resources","Hazardous waste"], a: 2 },
    { q: "What happens if you put waste in the wrong bag in Japan?", opts: ["Immediate fine","It is collected anyway","It is returned with an explanatory note","Nothing happens"], a: 2 }
  ],
  australia: [
    { q: "What colour bin handles mixed recycling in Australia?", opts: ["Red","Green","Blue","Yellow"], a: 3 },
    { q: "In what year was the yellow lid bin standardised nationally in Australia?", opts: ["2015","2017","2019","2021"], a: 2 },
    { q: "What percentage of Australian household waste is garden organics?", opts: ["20 %","30 %","40 %","50 %"], a: 2 },
    { q: "What does the red bin collect in Australia?", opts: ["Mixed recycling","Garden waste","General waste","Glass only"], a: 2 },
    { q: "How much waste does Australia generate per person each year?", opts: ["Over 500 kg","Over 1 tonne","Over 2 tonnes","Over 3 tonnes"], a: 2 },
    { q: "Why were separate blue/purple glass bins introduced in some Australian councils?", opts: ["To save money on trucks","To improve recycled glass quality","To match EU standards","To reduce collection frequency"], a: 1 },
    { q: "What is Australia's National Waste Policy resource recovery target by 2030?", opts: ["60 % average","70 % average","80 % average","90 % average"], a: 2 }
  ],
  canada: [
    { q: "Where did Canada's Blue Box programme first start in 1981?", opts: ["Toronto, Ontario","Vancouver, BC","Kitchener, Ontario","Montreal, Quebec"], a: 2 },
    { q: "What does Canada's green bin collect?", opts: ["Glass and plastic","Garden waste only","Organic waste including food scraps","Paper and cardboard"], a: 2 },
    { q: "What percentage of its waste does Canada recycle overall?", opts: ["About 18 %","About 28 %","About 42 %","About 55 %"], a: 1 },
    { q: "How much waste does Canada generate per person per year?", opts: ["320 kg","520 kg","720 kg","920 kg"], a: 2 },
    { q: "What percentage of Canadian landfill waste is food waste?", opts: ["20 %","30 %","40 %","50 %"], a: 2 },
    { q: "How many tonnes does Toronto's Green Bin programme divert yearly?", opts: ["Over 50,000","Over 100,000","Over 125,000","Over 200,000"], a: 2 },
    { q: "Which item should NOT go in Canada's Blue Box?", opts: ["Cardboard","Glass jars","Plastic bags","Metal cans"], a: 2 }
  ],
  spain: [
    { q: "What colour is the container for plastic and metal packaging in Spain?", opts: ["Blue","Green","Yellow","Brown"], a: 2 },
    { q: "What does Spain's blue container (Azul) collect?", opts: ["Glass","Paper & cardboard","Plastic & metal","Organic waste"], a: 1 },
    { q: "Which organisation manages Spain's yellow and blue bin systems?", opts: ["Ecovidrio","Ecoembes","Aspapel","Ecoplastics"], a: 1 },
    { q: "When did Spain make separate organic waste collection mandatory?", opts: ["January 2020","January 2021","January 2022","January 2023"], a: 3 },
    { q: "What percentage of glass packaging did Spain recycle in 2022?", opts: ["About 55 %","About 65 %","About 75 %","About 85 %"], a: 2 },
    { q: "Which organisation manages glass recycling across Spain?", opts: ["Ecoembes","Aspapel","Ecovidrio","Ecoplastics"], a: 2 },
    { q: "How many glass collection igloos does Spain have?", opts: ["Over 20,000","Over 50,000","Over 100,000","Over 200,000"], a: 2 }
  ],
  poland: [
    { q: "When did Poland introduce mandatory 5-stream recycling?", opts: ["2015","2017","2020","2022"], a: 2 },
    { q: "What colour container collects plastic and metal in Poland?", opts: ["Blue","Green","Brown","Yellow"], a: 3 },
    { q: "What does Poland's blue container collect?", opts: ["Organic waste","Paper","Glass","Plastic"], a: 1 },
    { q: "What percentage of glass packaging does Poland recycle?", opts: ["About 52 %","About 62 %","About 72 %","About 82 %"], a: 2 },
    { q: "Which city leads Poland in glass recycling rates?", opts: ["Warsaw","Gdańsk","Kraków","Wrocław"], a: 2 },
    { q: "How much waste does Poland generate per person annually?", opts: ["About 280 kg","About 380 kg","About 480 kg","About 580 kg"], a: 1 },
    { q: "What did Poland's recycling rate jump to after 2020 regulations?", opts: ["From 15 % to 24 %","From 20 % to 30 %","From 25 % to 34 %","From 30 % to 40 %"], a: 2 }
  ]
};

// ─── Quiz state ───────────────────────────────────────────────
let quizQuestions = [];
let quizIdx      = 0;
let quizScore    = 0;

// ─── Show quiz button below the image grid ────────────────────
function showQuizButton() {
  const left = document.getElementById("containersLeft");
  if (!left) return;
  const wrap = document.createElement("div");
  wrap.id = "quizBtnWrap";
  wrap.className = "quiz-btn-wrap";
  wrap.innerHTML = `<button class="quiz-col-btn" id="startQuizBtn">🧠 Take the Quiz!</button>`;
  left.appendChild(wrap);
  document.getElementById("startQuizBtn").addEventListener("click", startQuiz);
}

// ─── Exit quiz → restore right panel to info view ─────────────
function exitQuiz() {
  const right = document.getElementById("containersRight");
  if (!right) return;
  right.innerHTML = `<div class="container-info-panel panel-fade-in" id="infoPanel"></div>`;
  // Re-show the last viewed container if any
  if (activeIdx !== null) {
    const panel = document.getElementById("infoPanel");
    panel.innerHTML = buildInfoHTML(CONTAINERS_DB[currentCountryKey].containers[activeIdx]);
  }
}

// ─── Start the quiz (replaces only the right info panel) ─────
function startQuiz() {
  quizQuestions = QUIZ_DB[currentCountryKey] || [];
  quizIdx   = 0;
  quizScore = 0;
  const right = document.getElementById("containersRight");
  if (!right) return;
  right.style.display = "";
  right.innerHTML = `<div id="quizSection"></div>`;
  renderQuizQuestion();
}

// ─── Render one question ──────────────────────────────────────
const LETTERS = ["A", "B", "C", "D"];

function renderQuizQuestion() {
  const q   = quizQuestions[quizIdx];
  const pct = Math.round((quizIdx / quizQuestions.length) * 100);
  const isLast = quizIdx === quizQuestions.length - 1;

  document.getElementById("quizSection").innerHTML = `
    <div class="quiz-section">
      <button class="quiz-back-btn" id="quizBackBtn">← Back to containers</button>
      <div class="quiz-panel panel-fade-in">
        <div class="quiz-progress">
          <span class="quiz-progress-label">Question ${quizIdx + 1} of ${quizQuestions.length}</span>
          <div class="quiz-bar-track"><div class="quiz-bar-fill" style="width:${pct}%"></div></div>
        </div>
        <div class="quiz-question">${esc(q.q)}</div>
        <div class="quiz-options">
          ${q.opts.map((opt, i) => `
            <button class="quiz-opt-btn" data-idx="${i}">
              <span class="quiz-opt-letter">${LETTERS[i]}</span>
              <span>${esc(opt)}</span>
            </button>
          `).join("")}
        </div>
        <button class="quiz-next-btn" id="quizNextBtn">
          ${isLast ? "See results →" : "Next question →"}
        </button>
      </div>
    </div>
  `;
  document.getElementById("quizBackBtn").addEventListener("click", exitQuiz);

  document.querySelectorAll(".quiz-opt-btn").forEach(btn =>
    btn.addEventListener("click", () => handleQuizAnswer(btn))
  );
  document.getElementById("quizNextBtn").addEventListener("click", advanceQuiz);
}

// ─── Handle an answer click ───────────────────────────────────
function handleQuizAnswer(chosen) {
  const correct = quizQuestions[quizIdx].a;
  const picked  = parseInt(chosen.dataset.idx, 10);

  document.querySelectorAll(".quiz-opt-btn").forEach(btn => {
    btn.disabled = true;
    const i = parseInt(btn.dataset.idx, 10);
    if (i === correct) btn.classList.add("quiz-correct");
    else if (i === picked) btn.classList.add("quiz-wrong");
  });

  if (picked === correct) quizScore++;
  document.getElementById("quizNextBtn").classList.add("quiz-next-visible");
}

// ─── Move to next question or results ────────────────────────
function advanceQuiz() {
  quizIdx++;
  if (quizIdx < quizQuestions.length) {
    renderQuizQuestion();
  } else {
    renderQuizResults();
  }
}

// ─── Results screen ───────────────────────────────────────────
function renderQuizResults() {
  const total = quizQuestions.length;
  const pct   = Math.round((quizScore / total) * 100);
  const msg   = pct === 100 ? "Perfect score! You're a recycling expert! 🏆"
              : pct >= 70  ? "Great job! You really know your bins! ♻️"
              : pct >= 40  ? "Not bad! Read the info again and try once more. 📚"
              :              "Keep exploring the containers and give it another go! 💪";

  document.getElementById("quizSection").innerHTML = `
    <div class="quiz-section">
      <button class="quiz-back-btn" id="quizBackBtn">← Back to containers</button>
      <div class="quiz-panel panel-fade-in">
        <div class="quiz-results">
          <div class="quiz-score-big">${quizScore}/${total}</div>
          <div class="quiz-score-pct">${pct} % correct</div>
          <div class="quiz-score-msg">${msg}</div>
          <button class="quiz-retry-btn" id="quizRetryBtn">Try Again</button>
        </div>
      </div>
    </div>
  `;
  document.getElementById("quizRetryBtn").addEventListener("click", startQuiz);
  document.getElementById("quizBackBtn").addEventListener("click", exitQuiz);
}
