(function () {
    const STORAGE_KEY = "recycle_theme";
    const THEMES = ["light", "dark", "sky"];

    const ICONS  = { light: "🌙", dark: "☀", sky: "🌿" };
    const LABELS = { light: "Switch to dark mode", dark: "Switch to sky mode", sky: "Switch to light mode" };

    function getTheme() {
        try {
            const v = localStorage.getItem(STORAGE_KEY);
            if (THEMES.includes(v)) return v;
        } catch (e) {}
        return "light";
    }

    function applyTheme(theme) {
        const t = THEMES.includes(theme) ? theme : "light";
        document.documentElement.setAttribute("data-theme", t);
        try { localStorage.setItem(STORAGE_KEY, t); } catch (e) {}
        // next theme in cycle
        const next = THEMES[(THEMES.indexOf(t) + 1) % THEMES.length];
        document.querySelectorAll(".theme-toggle").forEach((btn) => {
            btn.textContent = ICONS[t];
            btn.title = LABELS[t];
            btn.dataset.next = next;
        });
    }

    function cycleTheme() {
        const current = getTheme();
        const next = THEMES[(THEMES.indexOf(current) + 1) % THEMES.length];
        applyTheme(next);
    }

    function injectToggle() {
        const nav = document.querySelector("nav");
        if (!nav || nav.querySelector(".theme-toggle")) return;
        const btn = document.createElement("button");
        btn.type      = "button";
        btn.className = "theme-toggle nav-ctrl-btn";
        nav.appendChild(btn);
        btn.addEventListener("click", cycleTheme);
    }

    function init() {
        injectToggle();
        applyTheme(getTheme());
        document.querySelectorAll(".theme-toggle").forEach((btn) => {
            btn.removeEventListener("click", cycleTheme);
            btn.addEventListener("click", cycleTheme);
        });
    }

    window.getSiteTheme    = getTheme;
    window.setSiteTheme    = applyTheme;
    window.toggleSiteTheme = cycleTheme;

    document.addEventListener("sitLangChanged", () => applyTheme(getTheme()));

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
