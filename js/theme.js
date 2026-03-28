(function () {
  const STORAGE_KEY = "recycle_theme";

  function getTheme() {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      if (v === "dark" || v === "light") return v;
    } catch (e) {
      /* ignore */
    }
    return "light";
  }

  function applyTheme(theme) {
    const t = theme === "dark" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", t);
    try {
      localStorage.setItem(STORAGE_KEY, t);
    } catch (e) {
      /* ignore */
    }
    const dark = t === "dark";
    document.querySelectorAll(".theme-toggle").forEach((btn) => {
      btn.setAttribute("aria-pressed", dark ? "true" : "false");
      btn.textContent = dark ? "☀" : "🌙";
      const goDark = typeof window.translateKey === "function" ? window.translateKey("theme_go_dark") : "Switch to dark mode";
      const goLight = typeof window.translateKey === "function" ? window.translateKey("theme_go_light") : "Switch to light mode";
      btn.setAttribute("aria-label", dark ? goLight : goDark);
      btn.title = dark ? goLight : goDark;
    });
  }

  function toggleTheme() {
    applyTheme(getTheme() === "dark" ? "light" : "dark");
  }

  function init() {
    applyTheme(getTheme());
    document.querySelectorAll(".theme-toggle").forEach((btn) => {
      btn.addEventListener("click", toggleTheme);
    });
  }

  window.getSiteTheme = getTheme;
  window.setSiteTheme = applyTheme;
  window.toggleSiteTheme = toggleTheme;

  document.addEventListener("sitLangChanged", () => {
    applyTheme(getTheme());
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
