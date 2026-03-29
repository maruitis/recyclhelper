(function () {
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
    baseCo2Kg: null,
  };

  function itemPk(row) {
    return row.items_id ?? row.id;
  }
  function materialPk(row) {
    return row.material_id ?? row.id;
  }
  function detailPk(row) {
    return row.details_id ?? row.id;
  }

  function escapeHtml(s) {
    const d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  /** --------------- ПОМОЩНИКИ ДЛЯ DIY И CALCULATOR ---------------- */
  function matchesMaterial(row) {
    const mid = row.material_id;
    if (mid == null) return true;
    return Number(mid) === Number(state.selectedMaterialId);
  }

  function pickCalculatorRow(rows) {
    if (!rows || !rows.length) return null;
    if (state.selectedMaterialId == null) return null;
    return rows.find(matchesMaterial) || null;
  }

  function pickDiyRows(rows) {
    if (!rows || !rows.length) return [];
    if (state.selectedMaterialId == null) return [];
    return rows.filter(matchesMaterial).slice(0, 3);
  }

  /** --------------- ФОРМАТИРОВАНИЕ CALCULATOR ---------------- */
  function parseNumericText(val) {
    if (val == null || val === "") return null;
    const s = String(val).trim().replace(/\s/g, "").replace(",", ".");
    const n = parseFloat(s);
    return Number.isFinite(n) ? n : null;
  }

  function readCalcNumber(row, keys) {
    for (const k of keys) {
      if (row[k] == null || row[k] === "") continue;
      const n = parseNumericText(row[k]);
      if (n != null) return n;
    }
    return null;
  }

  function formatWater(liters) {
    if (liters == null) return "—";
    const v = liters * state.quantity;
    return v < 1 ? `${Math.round(v * 1000)} ml` : `${v % 1 === 0 ? v : v.toFixed(1)} L`;
  }
  function formatEnergy(kwh) {
    if (kwh == null) return "—";
    const v = kwh * state.quantity;
    return `${v % 1 === 0 ? v : v.toFixed(1)} kWh`;
  }
  function formatCo2(kg) {
    if (kg == null) return "—";
    const g = kg * 1000 * state.quantity;
    return g >= 1000 ? `${(g / 1000).toFixed(2)} kg` : `${Math.round(g)} g`;
  }

  function updateCalculatorDom() {
    const w = document.getElementById("statWater");
    const e = document.getElementById("statEnergy");
    const c = document.getElementById("statCo2");
    if (!w || !e || !c) return;
    w.textContent = formatWater(state.baseWater);
    e.textContent = formatEnergy(state.baseEnergy);
    c.textContent = formatCo2(state.baseCo2Kg);
  }

  /** ------------------ RENDER MATERIALS ------------------ */
  function renderMaterials() {
    const grid = document.getElementById("materialsGrid");
    const section = document.getElementById("materialsSection");
    if (!grid || !section) return;

    grid.innerHTML = "";
    const list = state.materials.slice(0, 4);

    if (!list.length) {
      section.hidden = false;
      grid.innerHTML = `<p class="section-hint">No materials</p>`;
      return;
    }

    section.hidden = false;
    list.forEach((m) => {
      const id = materialPk(m);
      const card = document.createElement("button");
      card.type = "button";
      card.className = "material-card";
      card.dataset.id = String(id);
      const name = m.material_name || m.name || "Material";
      const code = m.abbreviation || "";
      card.innerHTML = `<span class="material-code">${escapeHtml(code)}</span><span class="material-name">${escapeHtml(name)}</span>`;
      card.addEventListener("click", () => {
        state.selectedMaterialId = id;
        grid.querySelectorAll(".material-card").forEach((b) => b.classList.remove("is-selected"));
        card.classList.add("is-selected");
        refreshDiyAndCalc();
      });
      grid.appendChild(card);
    });

    // 🔹 Автовыбор первого материала при загрузке
    if (!state.selectedMaterialId && list.length > 0) {
      state.selectedMaterialId = materialPk(list[0]);
      grid.querySelector(".material-card")?.classList.add("is-selected");
    }
  }

  /** ------------------ RENDER DIY ------------------ */
  function stepsFromDiy(row) {
    const keys = ["step1", "step2", "step3", "step4", "step5"];
    return keys.map((k) => row[k]).filter((t) => t && String(t).trim());
  }

  function renderDiy() {
    const wrap = document.getElementById("diyCards");
    const section = document.getElementById("diySection");
    if (!wrap || !section) return;

    const rows = pickDiyRows(state.diyAll);
    section.hidden = !rows.length;
    wrap.innerHTML = "";

    if (!rows.length) {
      wrap.innerHTML = `<p class="section-hint">No DIY ideas</p>`;
      return;
    }

    rows.forEach((row, i) => {
      const card = document.createElement("article");
      card.className = "diy-card glass-panel";
      const title = row.idea_name || `Idea ${i + 1}`;
      const materials = row.materials_list || "";
      const steps = stepsFromDiy(row);
      let stepsHtml = "<ol>" + steps.map((s) => `<li>${escapeHtml(String(s))}</li>`).join("") + "</ol>";

      card.innerHTML = `
        <h3>${escapeHtml(title)}</h3>
        ${materials ? `<p><strong>Materials:</strong> ${escapeHtml(String(materials))}</p>` : ""}
        ${stepsHtml}
      `;
      wrap.appendChild(card);
    });
  }

  /** ------------------ RENDER CALCULATOR ------------------ */
  function refreshDiyAndCalc() {
    const row = pickCalculatorRow(state.calcAll);
    if (row) {
      state.baseWater = readCalcNumber(row, ["water_saved_liters", "water_liters", "h2o_liters"]);
      state.baseEnergy = readCalcNumber(row, ["energy_saved_kwh", "energy_kwh", "kwh"]);
      let co2kg = readCalcNumber(row, ["co2_saved_kg", "co2_kg"]);
      const co2g = readCalcNumber(row, ["co2_saved_g"]);
      if (co2kg == null && co2g != null) co2kg = co2g / 1000;
      state.baseCo2Kg = co2kg;
    } else {
      state.baseWater = state.baseEnergy = state.baseCo2Kg = null;
    }
    renderDiy();
    updateCalculatorDom();
  }

  /** ------------------ LOAD ITEM ------------------ */
  async function loadItem(searchValue) {
    if (!searchValue || !window.supabase) return;

    const { data: items } = await window.supabase
      .from("items")
      .select("*")
      .ilike("name", `%${searchValue}%`)
      .limit(1);

    if (!items || !items[0]) return;
    const item = items[0];
    state.itemRow = item;
    state.itemId = itemPk(item);

    // 🔹 Загружаем все связанные таблицы
    const [{ data: details }, { data: materials }, { data: diy }, { data: calc }] =
      await Promise.all([
        window.supabase.from("details").select("*").eq("items_id", state.itemId),
        window.supabase.from("materials").select("*").eq("items_id", state.itemId),
        window.supabase.from("diy").select("*").eq("items_id", state.itemId),
        window.supabase.from("calculator").select("*").eq("items_id", state.itemId),
      ]);

    state.details = details || [];
    state.materials = materials || [];
    state.diyAll = diy || [];
    state.calcAll = calc || [];

    // 🔹 Рендерим сразу все секции
    renderMaterials();
    refreshDiyAndCalc();
  }

  /** ------------------ ИНИЦИАЛИЗАЦИЯ ПОИСКА ------------------ */
  function setupSearch() {
    const input = document.getElementById("itemSearchInput");
    if (!input) return;
    input.addEventListener("change", () => loadItem(input.value));
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") loadItem(input.value);
    });

    // 🔹 Автозагрузка по текущему значению (если есть)
    if (input.value) loadItem(input.value);
  }

  /** ------------------ DOM READY ------------------ */
  document.addEventListener("DOMContentLoaded", () => {
    setupSearch();
  });
})();