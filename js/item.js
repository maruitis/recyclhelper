(function () {
  // Перевод
  function tr(key) {
    return typeof window.translateKey === "function" ? window.translateKey(key) : key;
  }
  function trHtml(key, vars) {
    return typeof window.translateKeyHtml === "function" ? window.translateKeyHtml(key, vars) : key;
  }

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

  function matchesMaterial(row) {
    if (row.material_id === undefined || row.material_id === null) return true;
    return Number(row.material_id) === Number(state.selectedMaterialId);
  }

  function pickCalculatorRow(rows) {
    if (!rows || !rows.length) return null;
    if (!state.selectedMaterialId) return null;
    const withMat = rows.filter(matchesMaterial);
    return withMat[0] || null;
  }

  function pickDiyRows(rows) {
    if (!rows || !rows.length) return [];
    if (!state.selectedMaterialId) return [];
    return rows.filter(matchesMaterial).slice(0, 3);
  }

  function parseNumericText(val) {
    if (val === undefined || val === null || val === "") return null;
    const s = String(val).trim().replace(/\s/g, "").replace(",", ".");
    const n = parseFloat(s);
    return Number.isFinite(n) ? n : null;
  }

  function readCalcNumber(row, keys) {
    for (const k of keys) {
      if (row[k] === undefined || row[k] === null || row[k] === "") continue;
      const n = parseNumericText(row[k]);
      if (n !== null) return n;
    }
    return null;
  }

  function formatWater(liters) {
    if (liters == null || Number.isNaN(liters)) return "—";
    const v = liters * state.quantity;
    if (v < 1) return `${Math.round(v * 1000)} ml`;
    return `${v % 1 === 0 ? v : v.toFixed(1)} L`;
  }

  function formatEnergy(kwh) {
    if (kwh == null || Number.isNaN(kwh)) return "—";
    const v = kwh * state.quantity;
    return `${v % 1 === 0 ? v : v.toFixed(1)} kWh`;
  }

  function formatCo2(kg) {
    if (kg == null || Number.isNaN(kg)) return "—";
    const g = kg * 1000 * state.quantity;
    if (g >= 1000) return `${(g / 1000).toFixed(2)} kg`;
    return `${Math.round(g)} g`;
  }

  function updateCalculatorDom() {
    const w = document.getElementById("statWater");
    const e = document.getElementById("statEnergy");
    const c = document.getElementById("statCo2");
    const note = document.getElementById("calculatorFootnote");
    if (!w || !e || !c) return;

    w.textContent = formatWater(state.baseWater);
    e.textContent = formatEnergy(state.baseEnergy);
    c.textContent = formatCo2(state.baseCo2Kg);

    if (note) {
      if (!state.selectedMaterialId) note.textContent = tr("calc_note_select");
      else if (state.baseWater == null && state.baseEnergy == null && state.baseCo2Kg == null)
        note.textContent = tr("calc_note_empty");
      else note.textContent = tr("calc_note_ok");
    }
  }

  function renderLifehacks() {
    const el = document.getElementById("lifehacksText");
    if (!el) return;

    if (state.details.length > 0) {
      if (!state.selectedDetailId) {
        el.innerHTML = trHtml("lifehack_pick_html");
        return;
      }
      const d = state.details.find((x) => Number(detailPk(x)) === Number(state.selectedDetailId));
      const desc = d?.details_description || "";
      const name = d?.details_name || "Details";
      el.innerHTML = desc
        ? `<div class="lifehack-col"><strong>${escapeHtml(name)}</strong><p>${formatDescriptionHtml(desc)}</p></div>`
        : trHtml("lifehack_no_desc_html", { NAME: escapeHtml(name) });
      return;
    }

    if (state.withCap === null) {
      el.innerHTML = trHtml("lifehack_cap_prompt_html");
      return;
    }
    el.innerHTML = state.withCap ? trHtml("lifehack_with_cap_html") : trHtml("lifehack_without_cap_html");
  }

  function formatDescriptionHtml(text) {
    const paras = String(text).split(/\n+/).map((p) => p.trim()).filter(Boolean);
    return paras.map((p) => `<p>${escapeHtml(p)}</p>`).join("");
  }

  function escapeHtml(s) {
    const d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  function stepsFromDiy(row) {
    return ["step1", "step2", "step3", "step4", "step5"]
      .map(k => row[k])
      .filter(t => t && String(t).trim());
  }

  function renderMaterials() {
    const grid = document.getElementById("materialsGrid");
    const section = document.getElementById("materialsSection");
    if (!grid || !section) return;

    grid.innerHTML = "";
    const list = state.materials.slice(0, 4);
    if (!list.length) {
      section.hidden = false;
      grid.innerHTML = `<p class="section-hint">${escapeHtml(tr("materials_empty"))}</p>`;
      return;
    }
    section.hidden = false;

    list.forEach((m, idx) => {
      const id = materialPk(m);
      const card = document.createElement("button");
      card.type = "button";
      card.className = "material-card";
      card.dataset.id = String(id);
      const name = m.material_name || m.name || "Material";
      const code = m.abbreviation || "";
      const uses = m.common_use || "";
      const props = m.feels || "";

      card.innerHTML = `
        <span class="material-code">${escapeHtml(code)}</span>
        <span class="material-name">${escapeHtml(name)}</span>
        ${uses ? `<p class="material-meta"><strong>Uses:</strong> ${escapeHtml(uses)}</p>` : ""}
        ${props ? `<p class="material-meta"><strong>Properties:</strong> ${escapeHtml(props)}</p>` : ""}
      `;

      card.addEventListener("click", () => {
        state.selectedMaterialId = id;
        grid.querySelectorAll(".material-card").forEach(b => b.classList.remove("is-selected"));
        card.classList.add("is-selected");
        refreshDiyAndCalc();
      });

      // Автовыбор первого материала
      if (idx === 0 && !state.selectedMaterialId) {
        state.selectedMaterialId = id;
        card.classList.add("is-selected");
      }

      grid.appendChild(card);
    });
  }

  function renderDiy() {
    const wrap = document.getElementById("diyCards");
    const section = document.getElementById("diySection");
    if (!wrap || !section) return;

    if (!state.selectedMaterialId) {
      section.hidden = true;
      wrap.innerHTML = "";
      return;
    }

    const rows = pickDiyRows(state.diyAll);
    section.hidden = false;
    wrap.innerHTML = "";

    if (!rows.length) {
      wrap.innerHTML = `<p class="section-hint">${escapeHtml(tr("diy_empty"))}</p>`;
      updateCalculatorDom();
      return;
    }

    rows.forEach((row, i) => {
      const card = document.createElement("article");
      card.className = "diy-card glass-panel";
      const title = row.idea_name || `Idea ${i + 1}`;
      const materials = row.materials_list || "";
      const steps = stepsFromDiy(row);
      let stepsHtml = "<ol>";
      steps.forEach(st => stepsHtml += `<li>${escapeHtml(st)}</li>`);
      stepsHtml += "</ol>";

      card.innerHTML = `
        <h3 class="diy-card-title">${escapeHtml(title)}</h3>
        ${materials ? `<p class="diy-materials"><strong>Materials:</strong> ${escapeHtml(materials)}</p>` : ""}
        <div class="diy-steps">${stepsHtml}</div>
      `;
      wrap.appendChild(card);
    });

    updateCalculatorDom();
  }

  function refreshDiyAndCalc() {
    const calcSection = document.getElementById("calculatorSection");
    const row = pickCalculatorRow(state.calcAll);
    if (row && state.selectedMaterialId) {
      state.baseWater = readCalcNumber(row, ["water_saved_liters"]);
      state.baseEnergy = readCalcNumber(row, ["energy_saved_kwh"]);
      state.baseCo2Kg = readCalcNumber(row, ["co2_saved_kg"]);
      if (calcSection) calcSection.hidden = false;
    } else {
      state.baseWater = null;
      state.baseEnergy = null;
      state.baseCo2Kg = null;
      if (calcSection) calcSection.hidden = !state.selectedMaterialId;
    }
    renderDiy();
    updateCalculatorDom();
  }

  function setupVariantUi() {
    const choicesEl = document.getElementById("variantChoices");
    const capFallback = document.getElementById("capFallback");
    const label = document.getElementById("variantLabel");
    if (!choicesEl || !capFallback) return;

    choicesEl.innerHTML = "";
    state.selectedDetailId = null;

    if (state.details.length > 0) {
      capFallback.hidden = true;
      if (label) label.textContent = tr("variant_choose");

      state.details.forEach((d) => {
        const id = detailPk(d);
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "variant-detail-btn";
        btn.textContent = d.details_name || `Option ${id}`;
        btn.addEventListener("click", () => {
          state.selectedDetailId = id;
          choicesEl.querySelectorAll(".variant-detail-btn").forEach(b => b.classList.remove("is-active"));
          btn.classList.add("is-active");
          renderLifehacks();
        });
        choicesEl.appendChild(btn);
      });
    } else {
      capFallback.hidden = false;
      if (label) label.textContent = tr("variant_cap");

      const wireCap = (yes) => {
        state.withCap = yes;
        document.getElementById("capYes")?.classList.toggle("is-active", yes);
        document.getElementById("capNo")?.classList.toggle("is-active", !yes);
        renderLifehacks();
      };
      document.getElementById("capYes")?.addEventListener("click", () => wireCap(true));
      document.getElementById("capNo")?.addEventListener("click", () => wireCap(false));
    }
    renderLifehacks();
  }

  async function load() {
    const params = new URLSearchParams(location.search);
    const idRaw = params.get("id");
    const errEl = document.getElementById("itemLoadError");
    const hero = document.getElementById("itemHero");

    if (!idRaw) {
      if (errEl) { errEl.hidden = false; errEl.textContent = tr("item_err_missing_id"); }
      return;
    }
    if (!window.supabase || typeof window.supabase.from !== "function") {
      if (errEl) { errEl.hidden = false; errEl.textContent = tr("sb_client_missing"); }
      return;
    }

    const id = idRaw;
    state.itemId = id;
    let item = null;
    const { data, error } = await window.supabase.from("items").select("*").eq("items_id", id).limit(1);
    if (data && data[0]) item = data[0];
    if (!item) { if (errEl) { errEl.hidden = false; errEl.textContent = tr("item_err_not_found"); } return; }

    state.itemRow = item;
    const trueId = itemPk(item);
    state.itemId = trueId;

    // Загружаем все таблицы
    const [{ data: detailsRows }, { data: materials }, { data: diy }, { data: calc }] = await Promise.all([
      window.supabase.from("details").select("*").eq("items_id", trueId).order("details_id", { ascending: true }),
      window.supabase.from("materials").select("*").eq("items_id", trueId),
      window.supabase.from("diy").select("*").eq("items_id", trueId),
      window.supabase.from("calculator").select("*").eq("items_id", trueId),
    ]);

    state.details = detailsRows || [];
    state.materials = materials || [];
    state.diyAll = diy || [];
    state.calcAll = calc || [];

    const nameEl = document.getElementById("itemName");
    if (nameEl) nameEl.textContent = item.name || "Item";

    const img = document.getElementById("itemImage");
    const ph = document.getElementById("itemImagePlaceholder");
    const url = item.image_url || item.image || item.photo_url;
    if (img && ph) {
      if (url) { img.src = url; img.alt = item.name || "Item"; img.hidden = false; ph.hidden = true; }
      else { img.hidden = true; ph.hidden = false; }
    }

    const searchInput = document.getElementById("itemSearchInput");
    if (searchInput) searchInput.placeholder = item.name || tr("item_search_placeholder");

    if (hero) hero.hidden = false;

    setupVariantUi();
    renderMaterials();
    refreshDiyAndCalc();

    const calcSection = document.getElementById("calculatorSection");
    if (calcSection) calcSection.hidden = !state.selectedMaterialId;

    document.getElementById("qtyMinus")?.addEventListener("click", () => {
      if (state.quantity > 1) { state.quantity--; document.getElementById("qtyValue").textContent = state.quantity; updateCalculatorDom(); }
    });
    document.getElementById("qtyPlus")?.addEventListener("click", () => {
      if (state.quantity < 999) { state.quantity++; document.getElementById("qtyValue").textContent = state.quantity; updateCalculatorDom(); }
    });
  }

  document.addEventListener("sitLangChanged", () => {
    const label = document.getElementById("variantLabel");
    if (label) label.textContent = state.details.length ? tr("variant_choose") : tr("variant_cap");
    renderLifehacks();
    updateCalculatorDom();
  });

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", load);
  else load();
})();