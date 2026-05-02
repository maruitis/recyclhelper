// ════════════════════════════════════════════════════════════
//  ITEM BIN SELECTOR  ·  js/itembin.js
//
//  Maps each item material-group to the correct recycling bin
//  for 12 countries. Displayed on item.html, to the right of
//  the materials grid.
//
//  HOW IT WORKS:
//  1. ITEM_BIN_DB[country][group] → { color, name, subtitle, note? }
//  2. updateBinForGroup(group) is called by item.js once the
//     item data is loaded.
//  3. The country select restores from localStorage (shared with
//     containers.html via the "containers_country" key).
// ════════════════════════════════════════════════════════════

const ITEM_BIN_DB = {

  latvia: {
    plastic:     { color: "yellow", name: "Yellow Container",           subtitle: "Plastic & Metal" },
    glass:       { color: "green",  name: "Green Container",            subtitle: "Glass" },
    paper:       { color: "blue",   name: "Blue Container",             subtitle: "Paper & Cardboard" },
    metal:       { color: "yellow", name: "Yellow Container",           subtitle: "Plastic & Metal" },
    textile:     { color: null,     name: "Textile Drop-off",           subtitle: "Clothing & Fabrics",           note: "Take to a textile collection point or charity shop." },
    electronics: { color: null,     name: "E-waste Collection",         subtitle: "Electronics",                  note: "Take to a certified e-waste recycling centre." },
    special:     { color: null,     name: "Hazardous Waste Point",      subtitle: "Batteries & Special Items",    note: "Take to a hazardous waste collection point." },
    wood:        { color: null,     name: "Bulky Waste Centre",         subtitle: "Wood & Large Items",           note: "Take to a local recycling or bulky waste centre." }
  },

  germany: {
    plastic:     { color: "yellow", name: "Gelbe Tonne",                subtitle: "Plastic, Metal & Packaging" },
    glass:       { color: "green",  name: "Glascontainer",              subtitle: "Glass Bank",                   note: "Deposit at a public glass bank, sorted by colour." },
    paper:       { color: "blue",   name: "Altpapier Bin",              subtitle: "Paper & Cardboard" },
    metal:       { color: "yellow", name: "Gelbe Tonne",                subtitle: "Plastic, Metal & Packaging" },
    textile:     { color: null,     name: "Kleiderspende Container",    subtitle: "Clothing & Fabrics",           note: "Use a clothing donation (Kleiderspende) container." },
    electronics: { color: null,     name: "Wertstoffhof",               subtitle: "E-waste & Electronics",        note: "Take to your nearest Wertstoffhof (recycling centre)." },
    special:     { color: null,     name: "Schadstoffmobil",            subtitle: "Batteries & Chemicals",        note: "Take to a Schadstoffmobil collection point." },
    wood:        { color: null,     name: "Wertstoffhof",               subtitle: "Wood & Bulky Items",           note: "Take to your local Wertstoffhof." }
  },

  uk: {
    plastic:     { color: "blue",   name: "Blue Bin",                   subtitle: "Mixed Recycling" },
    glass:       { color: "blue",   name: "Blue Bin",                   subtitle: "Mixed Recycling",              note: "Or use a bottle bank at your local supermarket." },
    paper:       { color: "blue",   name: "Blue Bin",                   subtitle: "Mixed Recycling" },
    metal:       { color: "blue",   name: "Blue Bin",                   subtitle: "Mixed Recycling" },
    textile:     { color: null,     name: "Charity / Textile Bank",     subtitle: "Clothing & Fabrics",           note: "Donate to a charity shop or textile drop-off bank." },
    electronics: { color: null,     name: "HWRC Drop-off",              subtitle: "Electronics",                  note: "Take to your local Household Waste Recycling Centre." },
    special:     { color: null,     name: "Battery Drop-off",           subtitle: "Batteries & Hazardous Waste",  note: "Batteries at supermarkets; chemicals to your local HWRC." },
    wood:        { color: "black",  name: "Black Bin / HWRC",           subtitle: "General Waste",                note: "Small wood in general waste; large pieces to the HWRC." }
  },

  usa: {
    plastic:     { color: "blue",   name: "Blue Bin",                   subtitle: "Single-Stream Recycling" },
    glass:       { color: "blue",   name: "Blue Bin",                   subtitle: "Single-Stream Recycling",      note: "Some cities require a separate glass drop-off point." },
    paper:       { color: "blue",   name: "Blue Bin",                   subtitle: "Single-Stream Recycling" },
    metal:       { color: "blue",   name: "Blue Bin",                   subtitle: "Single-Stream Recycling" },
    textile:     { color: null,     name: "Donation / Textile Drop-off",subtitle: "Clothing & Fabrics",           note: "Donate to Goodwill, Salvation Army, or a textile recycler." },
    electronics: { color: "red",    name: "Red Bin / E-waste Event",    subtitle: "Hazardous & Small Electronics", note: "Or take to a certified e-waste collection event." },
    special:     { color: "red",    name: "Red Bin (HHW)",              subtitle: "Hazardous Household Waste",    note: "Batteries, paint & chemicals — take to an HHW event." },
    wood:        { color: "black",  name: "Black Bin / Bulky Pickup",   subtitle: "General Trash",                note: "Small pieces in trash; large wood via bulky-item pickup." }
  },

  france: {
    plastic:     { color: "yellow", name: "Bac Jaune",                  subtitle: "Plastic, Metal & Cardboard" },
    glass:       { color: "green",  name: "Bac Vert",                   subtitle: "Glass" },
    paper:       { color: "yellow", name: "Bac Jaune",                  subtitle: "Plastic, Metal & Cardboard",  note: "Paper packaging goes here; also loose paper in most areas." },
    metal:       { color: "yellow", name: "Bac Jaune",                  subtitle: "Plastic, Metal & Cardboard" },
    textile:     { color: null,     name: "Le Relais / Tri Vestimentaire", subtitle: "Clothing & Fabrics",        note: "Use a Le Relais or Tri Vestimentaire textile container." },
    electronics: { color: null,     name: "Déchèterie",                 subtitle: "E-waste & Electronics",        note: "Take to your nearest déchèterie (recycling centre)." },
    special:     { color: null,     name: "Déchèterie",                 subtitle: "Batteries & Hazardous Waste",  note: "Batteries at supermarkets; chemicals to your déchèterie." },
    wood:        { color: null,     name: "Déchèterie",                 subtitle: "Wood & Bulky Items",           note: "Take large wood items to your local déchèterie." }
  },

  sweden: {
    plastic:     { color: "yellow", name: "Yellow Bin",                 subtitle: "Plastic Packaging" },
    glass:       { color: "green",  name: "Glass Bank",                 subtitle: "Glass Packaging",              note: "Sort by colour at your nearest återvinningsstation." },
    paper:       { color: "blue",   name: "Blue Bin",                   subtitle: "Paper & Newspapers" },
    metal:       { color: "red",    name: "Red Bin",                    subtitle: "Metal Packaging" },
    textile:     { color: null,     name: "Textile Recycling",          subtitle: "Clothing & Fabrics",           note: "Use textile drop-off boxes at recycling stations." },
    electronics: { color: null,     name: "Återvinningsstation",        subtitle: "E-waste & Electronics",        note: "Take to your nearest återvinningsstation." },
    special:     { color: null,     name: "Farligt Avfall",             subtitle: "Batteries & Hazardous Waste",  note: "Take to a Farligt Avfall (dangerous waste) collection point." },
    wood:        { color: null,     name: "ÅVC (Recycling Centre)",     subtitle: "Wood & Bulky Items",           note: "Take to an ÅVC (Återvinningscentral)." }
  },

  netherlands: {
    plastic:     { color: "yellow", name: "PMD Bin",                    subtitle: "Plastic, Metal & Drink Cartons" },
    glass:       { color: "green",  name: "Glasbak",                    subtitle: "Glass Bottles & Jars",         note: "Deposit at a public glasbak, sorted by colour." },
    paper:       { color: "blue",   name: "Papier Bin",                 subtitle: "Paper & Cardboard" },
    metal:       { color: "yellow", name: "PMD Bin",                    subtitle: "Plastic, Metal & Drink Cartons" },
    textile:     { color: null,     name: "Humana / Sympany Box",       subtitle: "Clothing & Fabrics",           note: "Use a Humana or Sympany textile drop-off container." },
    electronics: { color: null,     name: "Milieupark",                 subtitle: "E-waste & Electronics",        note: "Take to your local milieupark (waste centre)." },
    special:     { color: null,     name: "Milieupark / Battery Box",   subtitle: "Batteries & Hazardous Waste",  note: "Take to milieupark or use in-store battery collection boxes." },
    wood:        { color: null,     name: "Milieupark",                 subtitle: "Wood & Bulky Items",           note: "Take to your local milieupark." }
  },

  japan: {
    plastic:     { color: "blue",   name: "Blue Bag (Shigen Gomi)",     subtitle: "Recyclable Resources",         note: "PET bottles only; other plastics go in the yellow bag." },
    glass:       { color: "blue",   name: "Blue Bag (Shigen Gomi)",     subtitle: "Recyclable Resources",         note: "Clean glass bottles — sort by colour if required locally." },
    paper:       { color: "blue",   name: "Blue Bag (Shigen Gomi)",     subtitle: "Recyclable Resources" },
    metal:       { color: "blue",   name: "Blue Bag (Shigen Gomi)",     subtitle: "Recyclable Resources",         note: "Aluminium & steel cans — clean and dry before bagging." },
    textile:     { color: null,     name: "Textile Drop-off",           subtitle: "Clothing & Fabrics",           note: "Clothing banks are common at supermarkets across Japan." },
    electronics: { color: "red",    name: "Red / Special Bag",          subtitle: "Small Electronics",            note: "Or use appliance take-back at electronics retailers." },
    special:     { color: "red",    name: "Red / Special Bag",          subtitle: "Batteries & Hazardous Items",  note: "Batteries returned to supermarkets or electronics stores." },
    wood:        { color: "green",  name: "Green Bag (Moeru Gomi)",     subtitle: "Burnable Waste",               note: "Small wood is burnable; large pieces go via bulky collection." }
  },

  australia: {
    plastic:     { color: "yellow", name: "Yellow Bin",                 subtitle: "Mixed Recycling" },
    glass:       { color: "blue",   name: "Blue / Purple Bin",          subtitle: "Glass Only",                   note: "Or yellow bin — check with your local council." },
    paper:       { color: "yellow", name: "Yellow Bin",                 subtitle: "Mixed Recycling" },
    metal:       { color: "yellow", name: "Yellow Bin",                 subtitle: "Mixed Recycling" },
    textile:     { color: null,     name: "Charity / Drop-off",         subtitle: "Clothing & Fabrics",           note: "Donate via Red Cross, St Vinnies, or textile recycling banks." },
    electronics: { color: null,     name: "E-waste Drop-off",           subtitle: "Electronics",                  note: "Use TechCollect, MobileMuster, or council e-waste events." },
    special:     { color: null,     name: "HHW Drop-off",               subtitle: "Batteries & Chemicals",        note: "Council hazardous household waste drop-off days." },
    wood:        { color: "red",    name: "Red Bin",                    subtitle: "General Waste",                note: "Small pieces in red bin; large wood via council pickup." }
  },

  canada: {
    plastic:     { color: "blue",   name: "Blue Box / Bin",             subtitle: "Mixed Recycling" },
    glass:       { color: "blue",   name: "Blue Box / Bin",             subtitle: "Mixed Recycling",              note: "Some regions require separate glass — check locally." },
    paper:       { color: "blue",   name: "Blue Box / Bin",             subtitle: "Mixed Recycling" },
    metal:       { color: "blue",   name: "Blue Box / Bin",             subtitle: "Mixed Recycling" },
    textile:     { color: null,     name: "Donation / Textile Bank",    subtitle: "Clothing & Fabrics",           note: "Donate to Value Village, Goodwill, or a textile bank." },
    electronics: { color: null,     name: "E-waste Drop-off",           subtitle: "Electronics",                  note: "Use provincial e-waste programmes or retail take-back." },
    special:     { color: null,     name: "HHW Facility",               subtitle: "Batteries & Chemicals",        note: "Take to a municipal hazardous household waste facility." },
    wood:        { color: "black",  name: "Black / Gray Bin",           subtitle: "Garbage",                      note: "Small pieces in garbage; large wood via bulky-item pickup." }
  },

  spain: {
    plastic:     { color: "yellow", name: "Contenedor Amarillo",        subtitle: "Plastic, Metal & Packaging" },
    glass:       { color: "green",  name: "Contenedor Verde",           subtitle: "Glass" },
    paper:       { color: "blue",   name: "Contenedor Azul",            subtitle: "Paper & Cardboard" },
    metal:       { color: "yellow", name: "Contenedor Amarillo",        subtitle: "Plastic, Metal & Packaging" },
    textile:     { color: null,     name: "Contenedor de Ropa",         subtitle: "Clothing & Fabrics",           note: "Use a Roba Amiga or Humana textile drop-off container." },
    electronics: { color: null,     name: "Punto Limpio",               subtitle: "E-waste & Electronics",        note: "Take to a Punto Limpio (clean point) collection centre." },
    special:     { color: null,     name: "Punto Limpio",               subtitle: "Batteries & Hazardous Waste",  note: "Batteries at supermarkets; chemicals to Punto Limpio." },
    wood:        { color: null,     name: "Punto Limpio",               subtitle: "Wood & Bulky Items",           note: "Take large wood items to your local Punto Limpio." }
  },

  poland: {
    plastic:     { color: "yellow", name: "Yellow Container",           subtitle: "Plastic & Metal" },
    glass:       { color: "green",  name: "Green Container",            subtitle: "Glass" },
    paper:       { color: "blue",   name: "Blue Container",             subtitle: "Paper" },
    metal:       { color: "yellow", name: "Yellow Container",           subtitle: "Plastic & Metal" },
    textile:     { color: null,     name: "Textile Drop-off",           subtitle: "Clothing & Fabrics",           note: "Use textile collection containers near recycling stations." },
    electronics: { color: null,     name: "PSZOK",                      subtitle: "E-waste & Electronics",        note: "Take to a PSZOK (selective waste collection point)." },
    special:     { color: null,     name: "PSZOK",                      subtitle: "Batteries & Hazardous Waste",  note: "Batteries at shops; chemicals to your nearest PSZOK." },
    wood:        { color: null,     name: "PSZOK",                      subtitle: "Wood & Bulky Items",           note: "Take to a PSZOK (selective waste collection point)." }
  }

};

// ════════════════════════════════════════════════════════════
//  RENDER
// ════════════════════════════════════════════════════════════

function renderBinResult(countryKey, group) {
  const result = document.getElementById("binResult");
  if (!result) return;

  if (!countryKey || !ITEM_BIN_DB[countryKey]) {
    result.innerHTML = `<p class="bin-prompt">Select your country above to see which bin to use for this item.</p>`;
    return;
  }

  const entry = ITEM_BIN_DB[countryKey][group];
  if (!entry) {
    result.innerHTML = `<p class="bin-prompt">No bin data available for this item type in your country.</p>`;
    return;
  }

  const imgHTML = entry.color
    ? `<img src="images/${entry.color}container.png" alt="${entry.name}" class="bin-card-img">`
    : `<div class="bin-card-icon">♻️</div>`;

  const noteHTML = entry.note
    ? `<div class="bin-card-note">${entry.note}</div>`
    : "";

  result.innerHTML = `
    <div class="bin-card">
      ${imgHTML}
      <div class="bin-card-name">${entry.name}</div>
      <div class="bin-card-sub">${entry.subtitle}</div>
      ${noteHTML}
    </div>
  `;
}

// ════════════════════════════════════════════════════════════
//  PUBLIC — called by item.js once item group is known
// ════════════════════════════════════════════════════════════

function updateBinForGroup(group) {
  window._currentItemGroup = group;
  const select = document.getElementById("binCountrySelect");
  if (!select) return;
  // Try saved country
  const saved = localStorage.getItem("containers_country");
  if (saved && ITEM_BIN_DB[saved] && !select.value) {
    select.value = saved;
  }
  const key = select.value;
  if (key) renderBinResult(key, group);
}

// ════════════════════════════════════════════════════════════
//  INIT
// ════════════════════════════════════════════════════════════

document.addEventListener("DOMContentLoaded", () => {
  const select = document.getElementById("binCountrySelect");
  if (!select) return;

  // Show initial prompt
  const result = document.getElementById("binResult");
  if (result) {
    result.innerHTML = `<p class="bin-prompt">Select your country above to see which bin to use for this item.</p>`;
  }

  // Restore saved country selection (shared with containers.html)
  const saved = localStorage.getItem("containers_country");
  if (saved && ITEM_BIN_DB[saved]) {
    select.value = saved;
  }

  select.addEventListener("change", () => {
    const key = select.value;
    if (key) localStorage.setItem("containers_country", key);
    const group = window._currentItemGroup || "plastic";
    renderBinResult(key, group);
  });
});
