(function () {
  let registerMode = false;

  function client() {
    return window.supabase;
  }

  function isAuthPage() {
    const path = window.location.pathname || "";
    return path.endsWith("auth.html") || path.endsWith("/auth");
  }

  function isProtectedPage() {
    const path = window.location.pathname || "";
    return path.endsWith("account.html");
  }

  async function getSession() {
    const sbClient = client();
    if (!sbClient?.auth?.getSession) return null;
    const { data, error } = await sbClient.auth.getSession();
    if (error) console.error(error);
    return data?.session || null;
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
      @media (max-width: 768px) {
        .nav-ctrl-group a.auth-person-btn {
          margin-right: 14px;
          width: 20px;
          height: 20px;
          font-size: 11px;
        }
        .nav-ctrl-group.nav-ctrl-fixed {
          top: 10px;
          right: 10px;
        }
        #auth-box {
          margin: 40px 16px 28px;
          padding: 22px 18px;
          max-width: none;
        }
        #auth-box h2 { font-size: 1.35rem; }
        #auth-box input, #auth-box button {
          font-size: 16px;
          min-height: 48px;
        }
        body > h1[style] {
          font-size: 1.5rem !important;
          margin-top: 16px !important;
          padding: 0 12px;
        }
      }
      @media (max-width: 480px) {
        .nav-ctrl-group a.auth-person-btn { margin-right: 10px; }
        #auth-box { margin-top: 32px; padding: 18px 14px; }
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
    const session = await getSession();
    if (session) return session;

    const returnTo = encodeURIComponent(
      window.location.pathname + window.location.search + window.location.hash
    );
    window.location.replace("auth.html?redirect=" + returnTo);
    return null;
  }

  async function getProfile(userId) {
    const { data, error } = await client()
      .from("profiles")
      .select("id, display_name")
      .eq("id", userId)
      .maybeSingle();
    if (error) console.error(error);
    return data;
  }

  async function ensureProfile(userId, displayName) {
    const existing = await getProfile(userId);
    if (existing?.display_name) return existing;

    const { data, error } = await client()
      .from("profiles")
      .insert({ id: userId, display_name: displayName })
      .select("id, display_name")
      .single();

    if (error) {
      console.error(error);
      return null;
    }
    return data;
  }

  function validateDisplayName(name) {
    if (!name || name.length < 2) return "Display name must be at least 2 characters.";
    if (name.length > 24) return "Display name must be 24 characters or less.";
    if (!/^[a-zA-Z0-9_]+$/.test(name)) return "Use letters, numbers, and underscores only.";
    return null;
  }

  function showUsernameSetup(session) {
    const box = document.getElementById("auth-box");
    if (!box) return;
    box.innerHTML =
      `<h2 id="form-title">Choose your name</h2>` +
      `<p style="text-align:center;margin:0 0 14px;font-size:0.9rem;">This is how you appear on Shares</p>` +
      `<input type="text" id="setup-display-name" placeholder="e.g. EcoRecycler42" maxlength="24" autocomplete="username" />` +
      `<button type="button" onclick="saveDisplayName()">Save name</button>` +
      `<p id="message"></p>` +
      `<button type="button" id="btn-register" style="margin-top:8px;background:#d9d9d9;color:#333;" onclick="logout()">Log out</button>`;

    const input = document.getElementById("setup-display-name");
    if (input) {
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") saveDisplayName();
      });
    }
  }

  function showLoggedInOnAuthPage(session, displayName) {
    const box = document.getElementById("auth-box");
    if (!box) return;
    const email = session?.user?.email || "your account";
    const nameLine = displayName
      ? `<p style="text-align:center;margin:0 0 4px;font-weight:700;">@${escapeHtml(displayName)}</p>`
      : "";
    box.innerHTML =
      `<h2 id="form-title">Signed in</h2>` +
      nameLine +
      `<p style="text-align:center;margin:0 0 16px;opacity:0.85;">${escapeHtml(email)}</p>` +
      `<a href="shares.html" style="display:block;text-align:center;margin:0 0 8px;font-weight:700;">Shares</a>` +
      `<a href="account.html" style="display:block;text-align:center;margin:0 0 12px;font-weight:700;">My account</a>` +
      `<button type="button" onclick="redirectAfterLogin()">Back to site</button>` +
      `<button type="button" id="btn-register" style="margin-top:8px;background:#d9d9d9;color:#333;" onclick="logout()">Log out</button>`;
  }

  async function showLoggedInOrSetup(session) {
    const profile = await getProfile(session.user.id);
    if (!profile?.display_name) {
      showUsernameSetup(session);
      return;
    }
    showLoggedInOnAuthPage(session, profile.display_name);
  }

  async function saveDisplayName() {
    const input = document.getElementById("setup-display-name");
    const msg = document.getElementById("message");
    const name = input?.value?.trim();
    const err = validateDisplayName(name);

    if (err) {
      if (msg) msg.textContent = err;
      return;
    }

    const { data: sessionData } = await client().auth.getSession();
    const session = sessionData?.session;
    if (!session) {
      if (msg) msg.textContent = "Please sign in again.";
      return;
    }

    const profile = await ensureProfile(session.user.id, name);
    if (!profile) {
      if (msg) msg.textContent = "That name may be taken. Try another.";
      return;
    }

    showLoggedInOnAuthPage(session, profile.display_name);
  }

  window.redirectAfterLogin = redirectAfterLogin;

  function setAuthFormMode(register) {
    registerMode = register;
    const title = document.getElementById("form-title");
    const btnLogin = document.getElementById("btn-login");
    const btnRegister = document.getElementById("btn-register");
    const toggle = document.getElementById("toggle-link");

    const nameEl = document.getElementById("display-name");

    if (title) title.textContent = register ? "Create account" : "Login";
    if (btnLogin) btnLogin.style.display = register ? "none" : "block";
    if (btnRegister) btnRegister.style.display = register ? "block" : "none";
    if (nameEl) nameEl.style.display = register ? "block" : "none";
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
      await showLoggedInOrSetup(data.session);
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
    const displayName = document.getElementById("display-name")?.value?.trim();
    const msg = document.getElementById("message");

    if (!email || !password) {
      if (msg) msg.textContent = "Enter email and password.";
      return;
    }
    const nameErr = validateDisplayName(displayName);
    if (nameErr) {
      if (msg) msg.textContent = nameErr;
      return;
    }
    if (password.length < 6) {
      if (msg) msg.textContent = "Password must be at least 6 characters.";
      return;
    }

    const { data, error } = await client().auth.signUp({ email, password });

    if (error) {
      if (msg) msg.textContent = "Error: " + error.message;
      return;
    }

    if (data?.session && data?.user) {
      const profile = await ensureProfile(data.user.id, displayName);
      if (!profile) {
        if (msg) msg.textContent = "Account created but name failed — pick a name after login.";
      } else {
        redirectAfterLogin();
        return;
      }
    } else {
      localStorage.setItem("pending_display_name", displayName);
      if (msg) {
        msg.textContent =
          "Account created! Check your inbox to confirm — then log in.";
      }
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

    const { data, error } = await client().auth.signInWithPassword({ email, password });

    if (error) {
      if (msg) msg.textContent = "Error: " + error.message;
      return;
    }

    const session = data?.session;
    if (!session) return;

    const pending = localStorage.getItem("pending_display_name");
    if (pending) {
      await ensureProfile(session.user.id, pending);
      localStorage.removeItem("pending_display_name");
    }

    const profile = await getProfile(session.user.id);
    if (!profile?.display_name && isAuthPage()) {
      showUsernameSetup(session);
      return;
    }

    redirectAfterLogin();
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
  window.saveDisplayName = saveDisplayName;
  window.injectAuthPersonBtn = injectPersonButton;
  window.getAuthSession = getSession;

  function notifyAuthChange(session) {
    window.dispatchEvent(
      new CustomEvent("authStateChanged", { detail: { session: session || null } })
    );
  }

  function ensureViewport() {
    const meta = document.querySelector('meta[name="viewport"]');
    if (meta && !meta.content.includes("viewport-fit")) {
      meta.content = "width=device-width, initial-scale=1.0, viewport-fit=cover";
    }
  }

  async function boot() {
    ensureViewport();
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

    schedulePersonButton();

    if (isProtectedPage()) {
      const session = await requireAuth();
      if (!session) return;
    }

    const sbClient = client();
    if (sbClient?.auth?.onAuthStateChange) {
      sbClient.auth.onAuthStateChange((event, newSession) => {
        notifyAuthChange(newSession);
        if ((event === "SIGNED_OUT" || !newSession) && isProtectedPage()) {
          const returnTo = encodeURIComponent(
            window.location.pathname + window.location.search + window.location.hash
          );
          window.location.replace("auth.html?redirect=" + returnTo);
        }
      });
    }

    notifyAuthChange(await getSession());
  }

  boot();
})();
