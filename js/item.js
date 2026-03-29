const supabase = window.supabaseClient;

if (!supabase) {
  console.error("❌ Supabase client not initialized");
}

(async () => {
  const supabase = window.supabaseClient;
  const state = {
    itemId: null,
    itemRow: null,
    details: [],
    materials: [],
    diyAll: [],
    calcAll: [],
    selectedMaterialId: null,
    selectedDetailId: null,
    withCap: null,
    quantity: 1,
    baseWater: null,
    baseEnergy: null,
    baseCo2Kg: null
  };

  function escapeHtml(s) {
    const d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  function parseNumber(val) {
    if (val === null || val === "") return null;
    const n = parseFloat(String(val).replace(",", "."));
    return Number.isFinite(n) ? n : null;
  }

  function formatWater(v) {
    if (v === null) return "—";
    const liters = v * state.quantity;
    return liters < 1 ? `${Math.round(liters * 1000)} ml` : `${liters % 1 === 0 ? liters : liters.toFixed(1)} L`;
  }

  function formatEnergy(v) {
    if (v === null) return "—";
    const val = v * state.quantity;
    return val % 1 === 0 ? `${val} kWh` : `${val.toFixed(1)} kWh`;
  }

  function formatCo2(v) {
    if (v === null) return "—";
    const g = v * 1000 * state.quantity;
    return g >= 1000 ? `${(g / 1000).toFixed(2)} kg` : `${Math.round(g)} g`;
  }

  function updateCalculator() {
    document.getElementById("statWater").textContent = formatWater(state.baseWater);
    document.getElementById("statEnergy").textContent = formatEnergy(state.baseEnergy);
    document.getElementById("statCo2").textContent = formatCo2(state.baseCo2Kg);
    const note = document.getElementById("calculatorFootnote");
    if (note) {
      if (!state.selectedMaterialId) note.textContent = "Select a material to see stats.";
      else if (state.baseWater === null && state.baseEnergy === null && state.baseCo2Kg === null) note.textContent = "No data for this material.";
      else note.textContent = "Data loaded.";
    }
  }

  function pickDiyRows() {
    if (!state.selectedMaterialId) return [];
    return state.diyAll.filter(d => !d.material_id || Number(d.material_id) === Number(state.selectedMaterialId)).slice(0, 3);
  }

  function pickCalculatorRow() {
    if (!state.selectedMaterialId) return null;
    const row = state.calcAll.find(c => !c.material_id || Number(c.material_id) === Number(state.selectedMaterialId));
    return row || null;
  }

  function renderMaterials() {
    const grid = document.getElementById("materialsGrid");
    const section = document.getElementById("materialsSection");
    if (!grid || !section) return;
    grid.innerHTML = "";
    const list = state.materials.slice(0, 4);
    if (!list.length) { section.hidden = false; grid.innerHTML = "<p>No materials found</p>"; return; }
    section.hidden = false;
    list.forEach(m => {
      const id = m.material_id;
      const card = document.createElement("button");
      card.type = "button";
      card.className = "material-card";
      card.dataset.id = id;
      card.innerHTML = `<span>${escapeHtml(m.material_name)}</span>`;
      card.addEventListener("click", () => {
        state.selectedMaterialId = id;
        grid.querySelectorAll(".material-card").forEach(b => b.classList.remove("is-selected"));
        card.classList.add("is-selected");
        refreshDiyCalc();
      });
      grid.appendChild(card);
    });
  }

  function renderDiy() {
    const wrap = document.getElementById("diyCards");
    const section = document.getElementById("diySection");
    if (!wrap || !section) return;
    if (!state.selectedMaterialId) { section.hidden = true; wrap.innerHTML = ""; return; }
    const rows = pickDiyRows();
    section.hidden = false;
    wrap.innerHTML = "";
    if (!rows.length) { wrap.innerHTML = "<p>No DIY ideas</p>"; updateCalculator(); return; }
    rows.forEach(row => {
      const card = document.createElement("article");
      card.className = "diy-card glass-panel";
      const steps = ["step1","step2","step3","step4","step5"].map(k => row[k]).filter(Boolean);
      card.innerHTML = `<h3>${escapeHtml(row.idea_name)}</h3>${steps.length ? `<ol>${steps.map(s => `<li>${escapeHtml(s)}</li>`).join("")}</ol>` : ""}`;
      wrap.appendChild(card);
    });
    updateCalculator();
  }

  function renderLifehacks() {
    const el = document.getElementById("lifehacksText");
    if (!el) return;
    if (!state.details.length) { el.innerHTML = "<p>No lifehacks available</p>"; return; }
    const d = state.details.find(x => Number(x.details_id) === Number(state.selectedDetailId)) || state.details[0];
    state.selectedDetailId = d.details_id;
    el.innerHTML = `<strong>${escapeHtml(d.details_name)}</strong><p>${escapeHtml(d.details_description)}</p>`;
  }

  function renderVariants() {
    const choicesEl = document.getElementById("variantChoices");
    const capFallback = document.getElementById("capFallback");
    if (!choicesEl || !capFallback) return;
    choicesEl.innerHTML = "";
    state.selectedDetailId = null;
    if (state.details.length > 0) {
      capFallback.hidden = true;
      state.details.forEach(d => {
        const btn = document.createElement("button");
        btn.textContent = d.details_name;
        btn.addEventListener("click", () => { state.selectedDetailId = d.details_id; renderLifehacks(); });
        choicesEl.appendChild(btn);
      });
    } else {
      capFallback.hidden = false;
      document.getElementById("capYes")?.addEventListener("click", () => { state.withCap = true; renderLifehacks(); });
      document.getElementById("capNo")?.addEventListener("click", () => { state.withCap = false; renderLifehacks(); });
    }
    renderLifehacks();
  }

  function refreshDiyCalc() {
    const calcRow = pickCalculatorRow();
    if (calcRow) {
      state.baseWater = parseNumber(calcRow.water_saved_liters);
      state.baseEnergy = parseNumber(calcRow.energy_saved_kwh);
      state.baseCo2Kg = parseNumber(calcRow.co2_saved_kg);
    } else { state.baseWater = state.baseEnergy = state.baseCo2Kg = null; }
    renderDiy();
    updateCalculator();
  }

  async function load() {
    const params = new URLSearchParams(location.search);
    const id = Number(params.get("id"));
    if (!id) { document.getElementById("itemLoadError").hidden = false; return; }
    state.itemId = id;

    // items
    let { data: item } = await supabase.from("items").select("*").eq("items_id", id).limit(1);
    item = item?.[0];
    if (!item) { document.getElementById("itemLoadError").hidden = false; return; }
    state.itemRow = item;
    document.getElementById("itemName").textContent = item.name;
    const img = document.getElementById("itemImage");
    const ph = document.getElementById("itemImagePlaceholder");
    if (item.image_url || item.image) { img.src = item.image_url || item.image; img.hidden = false; ph.hidden = true; }

    // details
    const { data: details } = await supabase.from("details").select("*").eq("items_id", id);
    state.details = details || [];

    // materials
    const { data: materials } = await supabase.from("materials").select("*").eq("items_id", id);
    state.materials = materials || [];

    // diy
    const { data: diyAll } = await supabase.from("diy").select("*").eq("items_id", id);
    state.diyAll = diyAll || [];

    // calculator
    const { data: calcAll } = await supabase.from("calculator").select("*").eq("items_id", id);
    state.calcAll = calcAll || [];

    renderMaterials();
    renderVariants();
    refreshDiyCalc();

    // stepper
    document.getElementById("qtyMinus")?.addEventListener("click", () => { if (state.quantity>1){ state.quantity--; document.getElementById("qtyValue").textContent=state.quantity; updateCalculator(); }});
    document.getElementById("qtyPlus")?.addEventListener("click", () => { if (state.quantity<999){ state.quantity++; document.getElementById("qtyValue").textContent=state.quantity; updateCalculator(); }});
  }

  document.addEventListener("DOMContentLoaded", load);
})();