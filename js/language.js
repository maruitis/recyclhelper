(function () {
    // ─── Translation dictionary ───────────────────────────────────────────────
    // Keys = exact English text as it appears in the DOM.
    const T = {
        en: {}, // English is source — no replacement needed

        lv: {
            // Nav
            "Home": "Sākums", "About us": "Par mums",
            "Our mission": "Mūsu misija", "Donate": "Ziedot",
            // Common
            "EVERY RECYCLED ITEM MAKES A DIFFERENCE! ACT NOW!": "KATRS PĀRSTRĀDĀTS PRIEKŠMETS IR SVARĪGS! RĪKOJIES TAGAD!",
            // index.html
            "RECYCLEHELPER.COM": "RECYCLEHELPER.COM",
            "LEARN ABOUT THE RIGHT TRASH": "PAREIZĀ ATKRITUMU ŠĶIROŠANA",
            "LEARN ABOUT THE ITEMS TO RECYCLE": "PRIEKŠMETI PĀRSTRĀDEI",
            "LEARN ABOUT THE BENEFITS": "PĀRSTRĀDES IEGUVUMI",
            "📷 Scan Item": "📷 Skenēt",
            // item.html
            "POSSIBLE MATERIALS": "IESPĒJAMIE MATERIĀLI",
            "♻ Recycling Lifehacks": "♻ Pārstrādes padomi",
            "Calculate Recycling Impact ➜": "Aprēķināt ietekmi ➜",
            "📷 Scan": "📷 Skenēt",
            // recycle.html
            "Lifehacks and Homemade Ideas": "Padomi un idejas",
            "Efficiency Calculator": "Efektivitātes kalkulators",
            "Amount of Items:": "Priekšmetu skaits:",
            "Saved Water": "Ietaupītais ūdens",
            "Saved Energy": "Ietaupītā enerģija",
            "Saved CO2": "Samazināts CO₂",
            "Find the closest deposit points": "Tuvākie savākšanas punkti",
            "Find Points": "Atrast",
            "RECYCLEHELPER": "RECYCLEHELPER",
            // content pages
            "Learn about containers": "Par atkritumu konteineriem",
            "Learn about benefits": "Par pārstrādes ieguvumiem",
            "Learn about itmes": "Par pārstrādājamiem priekšmetiem",
            // placeholders
            "Search (e.g. plastic bottle, book etc.)": "Meklēt (piem. pudele, grāmata...)",
            "Search another item...": "Meklēt citu priekšmetu...",
            "Enter your address...": "Ievadiet savu adresi...",
            // theme keys
            "theme_go_dark": "Tumšais režīms", "theme_go_light": "Gaišais režīms",
        },
    };

    // ─── State ─────────────────────────────────────────────────────────────────
    let currentLang = "en";
    try { currentLang = localStorage.getItem("site_lang") || "en"; } catch (_) {}
    if (!["en","lv"].includes(currentLang)) currentLang = "en";

    // ─── Public API ────────────────────────────────────────────────────────────
    window.translateKey = (key) => T[currentLang]?.[key] ?? T.en[key] ?? key;
    window.setSiteLang  = setLang;
    window.getSiteLang  = () => currentLang;

    // ─── Apply translations ────────────────────────────────────────────────────
    function applyTranslations() {
        const map = currentLang === "en" ? null : (T[currentLang] || {});

        // 1. Text nodes
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
            acceptNode(node) {
                const p = node.parentElement;
                if (!p) return NodeFilter.FILTER_REJECT;
                const tag = p.tagName.toUpperCase();
                if (["SCRIPT","STYLE","NOSCRIPT"].includes(tag)) return NodeFilter.FILTER_REJECT;
                if (p.closest("#scannerModal"))  return NodeFilter.FILTER_REJECT;
                if (p.closest(".lang-selector")) return NodeFilter.FILTER_REJECT;
                return NodeFilter.FILTER_ACCEPT;
            }
        });
        let node;
        while ((node = walker.nextNode())) {
            const trimmed = node.textContent.trim();
            if (!trimmed) continue;
            // Save original text the first time we see this node
            if (!node._origText) node._origText = trimmed;
            // Restore to English original first, then translate
            const src = node._origText;
            node.textContent = node.textContent.replace(trimmed, map ? (map[src] || src) : src);
        }

        // 2. Placeholders
        document.querySelectorAll("input[placeholder],textarea[placeholder]").forEach(el => {
            if (!el._origPlaceholder) el._origPlaceholder = el.getAttribute("placeholder");
            const src = el._origPlaceholder;
            el.setAttribute("placeholder", map ? (map[src] || src) : src);
        });

        // 3. Scan button (outside scanner modal, dynamic text)
        const scanBtn = document.getElementById("scanBtn");
        if (scanBtn) {
            if (!scanBtn._origText) scanBtn._origText = scanBtn.textContent.trim();
            const src = scanBtn._origText;
            scanBtn.textContent = map ? (map[src] || src) : src;
        }
    }

    // ─── Inject language selector into <nav> ──────────────────────────────────
    function injectSelector() {
        const nav = document.querySelector("nav");
        if (!nav || nav.querySelector(".lang-selector")) return;
        const wrap = document.createElement("div");
        wrap.className = "lang-selector";
        [["EN","en"],["LV","lv"]].forEach(([label, lang]) => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "lang-btn";
            btn.dataset.lang = lang;
            btn.textContent = label;
            btn.addEventListener("click", () => setLang(lang));
            wrap.appendChild(btn);
        });
        nav.appendChild(wrap);
    }

    function setLang(lang) {
        currentLang = lang;
        try { localStorage.setItem("site_lang", lang); } catch (_) {}
        applyTranslations();
        document.documentElement.lang = lang;
        updateButtons();
        document.dispatchEvent(new CustomEvent("sitLangChanged", { detail: { lang } }));
    }

    function updateButtons() {
        document.querySelectorAll(".lang-btn").forEach(btn => {
            btn.classList.toggle("lang-active", btn.dataset.lang === currentLang);
        });
    }

    function init() {
        injectSelector();
        applyTranslations();
        updateButtons();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
