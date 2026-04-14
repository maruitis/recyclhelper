(function () {
    const STORAGE_KEY = "recycle_theme";
    const THEMES = ["light", "sky", "dark"];

    // The circle color that represents each theme
    const DOT_COLORS = {
        light: '#2DD4A3',   // turquoise  — default green theme
        sky:   '#7EC8F0',   // light blue — sky theme
        dark:  '#0d1a2e',   // near-black — dark theme
    };
    const DOT_TITLES = {
        light: 'Default theme',
        sky:   'Sky theme',
        dark:  'Dark theme',
    };

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

        // Highlight the active dot
        document.querySelectorAll(".theme-dot").forEach(btn => {
            btn.classList.toggle("theme-dot-active", btn.dataset.themeSet === t);
        });
    }

    function injectToggle() {
        const nav = document.querySelector("nav");
        if (!nav || nav.querySelector(".theme-switcher")) return;

        const switcher = document.createElement("div");
        switcher.className = "theme-switcher";

        THEMES.forEach(t => {
            const btn = document.createElement("button");
            btn.type              = "button";
            btn.className         = "theme-dot";
            btn.dataset.themeSet  = t;
            btn.title             = DOT_TITLES[t];
            btn.style.background  = DOT_COLORS[t];
            btn.addEventListener("click", () => applyTheme(t));
            switcher.appendChild(btn);
        });

        nav.appendChild(switcher);
    }

    function init() {
        injectToggle();
        applyTheme(getTheme());
        // Allow transitions only after the first paint so the theme is
        // already correct when elements become visible — no flash possible.
        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                document.documentElement.classList.add("theme-ready");
            });
        });
    }

    // Keep public API intact for anything that calls these
    window.getSiteTheme    = getTheme;
    window.setSiteTheme    = applyTheme;
    window.toggleSiteTheme = () => {
        const current = getTheme();
        const next = THEMES[(THEMES.indexOf(current) + 1) % THEMES.length];
        applyTheme(next);
    };

    document.addEventListener("sitLangChanged", () => applyTheme(getTheme()));

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
