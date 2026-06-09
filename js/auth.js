(function () {
  let registerMode = false;

  function client() {
    return window.supabase;
  }

  function isAuthPage() {
    const path = window.location.pathname || "";
    return path.endsWith("auth.html") || path.endsWith("/auth");
  }

  function escapeHtml(s) {
    const d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  function injectAuthStyles() {
    if (document.getElementById("auth-nav-styles")) return;
    const style = document.createElement("style");
    style.id = "auth-nav-styles";
    style.textContent = `
      nav { flex-wrap: wrap; }
      .nav-ctrl-group {
        display: flex;
        align-items: center;
        margin-left: auto;
        flex-shrink: 0;
      }
      .nav-ctrl-group.nav-ctrl-fixed {
        position: fixed;
        top: 16px;
        right: 16px;
        z-index: 1000;
        margin-left: 0;
      }
      .nav-ctrl-group .theme-switcher {
        margin-left: 0;
      }
      .nav-ctrl-group a.auth-person-btn {
        margin-right: 28px;
        background: rgba(255, 255, 255, 0.55);
        border-color: rgba(255, 255, 255, 0.65);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
        line-height: 1;
        text-decoration: none;
        padding: 0;
        flex-shrink: 0;
      }
      [data-theme="dark"] .nav-ctrl-group a.auth-person-btn {
        background: rgba(45, 60, 58, 0.9);
        border-color: rgba(160, 220, 200, 0.35);
      }
      #auth-box {
        max-width: 380px;
        margin: 72px auto 40px;
        padding: 28px 26px;
        border-radius: 22px;
        background: rgba(255, 255, 255, 0.55);
        backdrop-filter: blur(12px);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
        font-family: "DM Sans", sans-serif;
      }
      #auth-box h2 {
        margin: 0 0 18px;
        text-align: center;
        font-family: "Gasoek One", sans-serif;
        font-size: 1.6rem;
        color: #0e0973;
      }
      #auth-box input {
        width: 100%;
        box-sizing: border-box;
        margin-bottom: 12px;
        padding: 12px 14px;
        border: none;
        border-radius: 999px;
        font-size: 1rem;
      }
      #auth-box button {
        width: 100%;
        margin-top: 6px;
        padding: 12px 16px;
        border: none;
        border-radius: 999px;
        font-weight: 800;
        cursor: pointer;
        background: linear-gradient(135deg, #89f19e, #8ac4c6);
        color: #1a3d2e;
      }
      #auth-box #btn-register { background: #d9d9d9; color: #333; }
      #auth-box #message { min-height: 1.2em; text-align: center; font-size: 0.9rem; margin: 12px 0 0; }
      #auth-box a { color: #0e0973; font-weight: 700; }
      [data-theme="dark"] #auth-box {
        background: rgba(30, 45, 42, 0.75);
        color: #e8f4ec;
      }
      [data-theme="dark"] #auth-box h2 { color: #b8e6ff; }
      [data-theme="dark"] #auth-box input {
        background: rgba(20, 35, 32, 0.9);
        color: #e8f4ec;
      }
    `;
    document.head.appendChild(style);
  }

  function authPageUrl() {
    const returnTo = encodeURIComponent(
      window.location.pathname + window.location.search + window.location.hash
    );
    return "auth.html?redirect=" + returnTo;
  }

  function injectPersonButton() {
    if (document.getElementById("auth-person-btn")) return;

    const switcher = document.querySelector(".theme-switcher");
    if (!switcher) return;

    const btn = document.createElement("a");
    btn.id = "auth-person-btn";
    btn.className = "auth-person-btn theme-dot";
    btn.href = authPageUrl();
    btn.setAttribute("aria-label", "Account / Login");
    btn.title = "Account / Login";
    btn.textContent = "👤";

    const group = switcher.parentElement;
    if (group && group.classList.contains("nav-ctrl-group")) {
      group.insertBefore(btn, switcher);
      return;
    }

    switcher.insertAdjacentElement("beforebegin", btn);
  }

  function schedulePersonButton() {
    const run = () => injectPersonButton();
    window.addEventListener("themeReady", run);
    window.addEventListener("load", run);
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", run);
    } else {
      run();
    }
  }

  function redirectAfterLogin() {
    const params = new URLSearchParams(window.location.search);
    const target = params.get("redirect");
    if (target) {
      try {
        const decoded = decodeURIComponent(target);
        if (decoded && !decoded.includes("auth.html")) {
          window.location.href = decoded;
          return;
        }
      } catch (e) {
        /* ignore */
      }
    }
    window.location.href = "index.html";
  }

  async function requireAuth() {
    const sbClient = client();
    if (!sbClient || typeof sbClient.auth?.getSession !== "function") {
      console.error("Supabase auth client is not ready.");
      return null;
    }

    const { data, error } = await sbClient.auth.getSession();
    if (error) console.error(error);

    if (!data?.session) {
      const returnTo = encodeURIComponent(
        window.location.pathname + window.location.search + window.location.hash
      );
      window.location.replace("auth.html?redirect=" + returnTo);
      return null;
    }

    return data.session;
  }

  function showLoggedInOnAuthPage(session) {
    const box = document.getElementById("auth-box");
    if (!box) return;
    const email = session?.user?.email || "your account";
    box.innerHTML =
      `<h2 id="form-title">Signed in</h2>` +
      `<p style="text-align:center;margin:0 0 16px;">${escapeHtml(email)}</p>` +
      `<a href="account.html" style="display:block;text-align:center;margin:0 0 12px;font-weight:700;">My account</a>` +
      `<button type="button" onclick="redirectAfterLogin()">Back to site</button>` +
      `<button type="button" id="btn-register" style="margin-top:8px;background:#d9d9d9;color:#333;" onclick="logout()">Log out</button>`;
  }

  window.redirectAfterLogin = redirectAfterLogin;

  function setAuthFormMode(register) {
    registerMode = register;
    const title = document.getElementById("form-title");
    const btnLogin = document.getElementById("btn-login");
    const btnRegister = document.getElementById("btn-register");
    const toggle = document.getElementById("toggle-link");

    if (title) title.textContent = register ? "Create account" : "Login";
    if (btnLogin) btnLogin.style.display = register ? "none" : "block";
    if (btnRegister) btnRegister.style.display = register ? "block" : "none";
    if (toggle) {
      toggle.textContent = register
        ? "Already have an account? Log in"
        : "New here? Create an account";
    }
  }

  async function initAuthPage() {
    injectAuthStyles();
    const sbClient = client();
    if (!sbClient) return;

    const { data } = await sbClient.auth.getSession();
    if (data?.session) {
      showLoggedInOnAuthPage(data.session);
      return;
    }

    setAuthFormMode(false);

    const emailEl = document.getElementById("email");
    const passEl = document.getElementById("password");
    if (emailEl) {
      emailEl.addEventListener("keydown", (e) => {
        if (e.key === "Enter") (registerMode ? register : login)();
      });
    }
    if (passEl) {
      passEl.addEventListener("keydown", (e) => {
        if (e.key === "Enter") (registerMode ? register : login)();
      });
    }
  }

  async function register() {
    const email = document.getElementById("email")?.value?.trim();
    const password = document.getElementById("password")?.value;
    const msg = document.getElementById("message");

    if (!email || !password) {
      if (msg) msg.textContent = "Enter email and password.";
      return;
    }
    if (password.length < 6) {
      if (msg) msg.textContent = "Password must be at least 6 characters.";
      return;
    }

    const { error } = await client().auth.signUp({ email, password });

    if (error) {
      if (msg) msg.textContent = "Error: " + error.message;
    } else if (msg) {
      msg.textContent =
        "Account created! If email confirmation is on, check your inbox — then log in.";
      setAuthFormMode(false);
    }
  }

  async function login() {
    const email = document.getElementById("email")?.value?.trim();
    const password = document.getElementById("password")?.value;
    const msg = document.getElementById("message");

    if (!email || !password) {
      if (msg) msg.textContent = "Enter email and password.";
      return;
    }

    const { error } = await client().auth.signInWithPassword({ email, password });

    if (error) {
      if (msg) msg.textContent = "Error: " + error.message;
    } else {
      redirectAfterLogin();
    }
  }

  async function logout() {
    await client().auth.signOut();
    window.location.href = "auth.html";
  }

  function toggleForm() {
    setAuthFormMode(!registerMode);
    const msg = document.getElementById("message");
    if (msg) msg.textContent = "";
    return false;
  }

  window.register = register;
  window.login = login;
  window.logout = logout;
  window.toggleForm = toggleForm;
  window.injectAuthPersonBtn = injectPersonButton;

  async function boot() {
    injectAuthStyles();

    if (isAuthPage()) {
      schedulePersonButton();
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initAuthPage);
      } else {
        await initAuthPage();
      }
      return;
    }

    const session = await requireAuth();
    if (!session) return;

    schedulePersonButton();

    client().auth.onAuthStateChange((event, newSession) => {
      if (event === "SIGNED_OUT" || !newSession) {
        window.location.replace("auth.html");
      }
    });
  }

  boot();
})();
