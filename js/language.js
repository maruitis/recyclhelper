(function () {
  const STORAGE_KEY = "recyclehelper_lang";

  const STRINGS = {
    en: {
      nav_about: "ABOUT US",
      nav_mission: "OUR MISSION",
      nav_donate: "DONATE",
      search_placeholder: "Search (e.g. plastic bottle, book, etc.)",
      search_btn: "Search",
      scan_btn: "Scan!",
      scan_title: "Camera scan coming soon",
      footer_cta: "EVERY RECYCLED ITEM MAKES A DIFFERENCE. ACT NOW!",
      card_containers: "LEARN ABOUT THE RIGHT TRASH CONTAINER",
      card_items: "LEARN ABOUT <br> THE <br> ITEMS TO RECYCLE",
      card_benefits: "LEARN ABOUT <br> THE BENEFITS",
      item_search_placeholder: "Search another item…",
      item_search_btn: "Search",
      variant_cap: "Does it have a cap?",
      variant_choose: "Choose a variant",
      lifehacks_title: "Lifehacks for recycling",
      materials_title: "Possible materials",
      materials_hint: "Choose up to one type that matches your item (max 4 shown).",
      diy_title: "Lifehacks and homemade ideas",
      calc_title: "Efficiency calculator",
      calc_amount: "Amount",
      calc_water: "Saved water",
      calc_energy: "Saved energy",
      calc_co2: "Saved CO₂",
      map_title: "Find the closest deposit point!",
      map_placeholder: "Connect Mapbox or Google Maps and load pins from Supabase. Your design goes here.",
      map_address_ph: "Your full address:",
      item_err_missing_id: "Missing item id. Go back to home and pick an item from search results.",
      item_err_not_found: "Item not found.",
      item_err_load: "Could not load this item from Supabase.",
      calc_note_select: "Select a material to see savings per recycled item (from your calculator table).",
      calc_note_empty:
        "No calculator row for this item + material. Add a row in table calculator with items_id, material_id, and text fields water_saved_liters, energy_saved_kwh, co2_saved_kg.",
      calc_note_ok: "Values are per item × amount (parsed from your calculator text columns).",
      lifehack_pick: "Pick a variant above — your details row’s description will show here.",
      lifehack_pick_html:
        "<p>Pick a variant above — your <code>details</code> row’s description will show here.</p>",
      lifehack_no_desc_html:
        "<p><strong>%NAME%</strong> — add <code>details_description</code> in Supabase for this row.</p>",
      lifehack_cap_prompt_html:
        "<p>Choose whether your item has a cap, or add rows in the <code>details</code> table for this item.</p>",
      lifehack_with_cap_html:
        '<div class="lifehack-col"><strong>With cap</strong><ol><li>Many cities want caps on so nothing spills in the truck.</li><li>Squash the bottle slightly, then seal — saves space.</li><li>Check your local recycling rules.</li></ol></div>',
      lifehack_without_cap_html:
        '<div class="lifehack-col"><strong>Without cap</strong><ol><li>Some facilities prefer caps off for cleaner sorting.</li><li>Rinse and let dry before binning.</li><li>Confirm with your municipality.</li></ol></div>',
      lifehack_no_desc: "Add details_description in Supabase for this row.",
      lifehack_cap_prompt: "Choose whether your item has a cap, or add rows in the details table for this item.",
      materials_empty: "No materials in Supabase for this item. Add rows in table materials with items_id.",
      diy_empty:
        "No DIY rows for this material. Add up to 3 ideas in diy with matching items_id and material_id.",
      option_fallback: "Option",
      sb_client_missing: "Database client did not load. Serve the site over http(s), not file://, and check the console.",
      theme_go_dark: "Switch to dark mode",
      theme_go_light: "Switch to light mode"
    },
    lv: {
      nav_about: "PAR MUMS",
      nav_mission: "MŪSU MISIJA",
      nav_donate: "ZIEDOT",
      search_placeholder: "Meklēt (piem., plastmasas pudele, grāmata u.c.)",
      search_btn: "Meklēt",
      scan_btn: "Skenēt!",
      scan_title: "Kameras skenēšana drīzumā",
      footer_cta: "KATRA PĀRSTRĀDĀTA LIETA IR SVARĪGA. RĪKOJIES TAGAD!",
      card_containers: "UZZINI PAR PAREIZO ATKRITUMU TVERTNI",
      card_items: "UZZINI PAR <br> LIETĀM, <br> KO PĀRSTRĀDĀT",
      card_benefits: "UZZINI PAR <br> IEGUVUMIEM",
      item_search_placeholder: "Meklēt citu lietu…",
      item_search_btn: "Meklēt",
      variant_cap: "Vai ir vāciņš?",
      variant_choose: "Izvēlies variantu",
      lifehacks_title: "Padomi pārstrādei",
      materials_title: "Iespējamie materiāli",
      materials_hint: "Izvēlies vienu tipu, kas atbilst tavai lietai (līdz 4).",
      diy_title: "Pašdarinātas idejas un lifehaki",
      calc_title: "Efektivitātes kalkulators",
      calc_amount: "Daudzums",
      calc_water: "Ietaupīts ūdens",
      calc_energy: "Ietaupītā enerģija",
      calc_co2: "Ietaupītais CO₂",
      map_title: "Atrodi tuvāko nodošanas punktu!",
      map_placeholder: "Pievieno Mapbox vai Google Maps un ielādē punktus no Supabase.",
      map_address_ph: "Tava pilnā adrese:",
      item_err_missing_id: "Trūkst lietas ID. Atgriezies uz sākumu un izvēlies meklēšanas rezultātā.",
      item_err_not_found: "Lietu nevarēja atrast.",
      item_err_load: "Neizdevās ielādēt lietu no Supabase.",
      calc_note_select: "Izvēlies materiālu, lai redzētu ietaupījumu (no calculator tabulas).",
      calc_note_empty:
        "Nav calculator rindas šai kombinācijai. Pievieno rindu ar items_id, material_id un teksta laukiem water_saved_liters, energy_saved_kwh, co2_saved_kg.",
      calc_note_ok: "Vērtības: vienība × daudzums (no calculator teksta laukiem).",
      lifehack_pick: "Izvēlies variantu augšā — parādīsies details ieraksta apraksts.",
      lifehack_pick_html:
        "<p>Izvēlies variantu augšā — šeit parādīsies <code>details</code> ieraksta apraksts.</p>",
      lifehack_no_desc_html:
        "<p><strong>%NAME%</strong> — pievieno <code>details_description</code> šim ierakstam Supabase.</p>",
      lifehack_cap_prompt_html:
        "<p>Norādi, vai ir vāciņš, vai pievieno <code>details</code> tabulai rindas šai lietai.</p>",
      lifehack_with_cap_html:
        '<div class="lifehack-col"><strong>Ar vāciņu</strong><ol><li>Daudzās pilsētās vāciņu atstāj, lai nekas netecētu.</li><li>Nedaudz saspiest pudele un aizvērt — ietaupa vietu.</li><li>Pārbaudi vietējos pārstrādes noteikumus.</li></ol></div>',
      lifehack_without_cap_html:
        '<div class="lifehack-col"><strong>Bez vāciņa</strong><ol><li>Dažās iekārtās vāciņu noņem labākai šķirošanai.</li><li>Izskalot un žāvēt pirms mesta konteinerā.</li><li>Pārbaudi pašvaldības instrukcijas.</li></ol></div>',
      lifehack_no_desc: "Pievieno details_description šim ierakstam Supabase.",
      lifehack_cap_prompt: "Norādi, vai ir vāciņš, vai pievieno details tabulai rindas šai lietai.",
      materials_empty: "Nav materiālu šai lietai. Pievieno materials ar items_id.",
      diy_empty: "Nav DIY ierakstu šim materiālam. Pievieno līdz 3 idejām diy ar items_id un material_id.",
      option_fallback: "Variants",
      sb_client_missing: "Datubāzes klients neielādējās. Atver vietni caur http(s), nevis file://, un pārbaudi konsoli.",
      theme_go_dark: "Pārslēgt uz tumšo režīmu",
      theme_go_light: "Pārslēgt uz gaišo režīmu"
    }
  };

  function getLang() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "lv" || saved === "en") return saved;
    const html = document.documentElement;
    const def = html.getAttribute("data-default-lang") || "en";
    return def === "lv" ? "lv" : "en";
  }

  function setLang(lang) {
    const next = lang === "lv" ? "lv" : "en";
    localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.lang = next;
    applyTranslations(next);
    window.dispatchEvent(new CustomEvent("sitLangChanged", { detail: { lang: next } }));
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      const is = btn.getAttribute("data-set-lang") === next;
      btn.classList.toggle("is-active", is);
      btn.setAttribute("aria-pressed", is ? "true" : "false");
    });
  }

  function t(lang, key) {
    const pack = STRINGS[lang] || STRINGS.en;
    return (pack[key] !== undefined && pack[key] !== null) ? pack[key] : (STRINGS.en[key] || key);
  }

  function applyTranslations(lang) {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (!key) return;
      el.textContent = t(lang, key);
    });

    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const key = el.getAttribute("data-i18n-html");
      if (!key) return;
      el.innerHTML = t(lang, key);
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (!key || !("placeholder" in el)) return;
      el.placeholder = t(lang, key);
    });

    document.querySelectorAll("[data-i18n-title]").forEach((el) => {
      const key = el.getAttribute("data-i18n-title");
      if (!key) return;
      el.title = t(lang, key);
    });
  }

  function wireLangButtons() {
    document.querySelectorAll("[data-set-lang]").forEach((btn) => {
      btn.addEventListener("click", () => {
        setLang(btn.getAttribute("data-set-lang"));
      });
    });
  }

  function init() {
    const lang = getLang();
    document.documentElement.lang = lang;
    applyTranslations(lang);
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      const is = btn.getAttribute("data-set-lang") === lang;
      btn.classList.toggle("is-active", is);
      btn.setAttribute("aria-pressed", is ? "true" : "false");
    });
    wireLangButtons();
  }

  function translateKey(key) {
    return t(getLang(), key);
  }

  function translateKeyHtml(key, vars) {
    let s = t(getLang(), key);
    if (vars && typeof vars === "object") {
      Object.keys(vars).forEach((k) => {
        s = s.split(`%${k}%`).join(vars[k]);
      });
    }
    return s;
  }

  window.applySiteLanguage = applyTranslations;
  window.getSiteLang = getLang;
  window.setSiteLang = setLang;
  window.translateKey = translateKey;
  window.translateKeyHtml = translateKeyHtml;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();