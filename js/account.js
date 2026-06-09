(function () {
  function sb() {
    return window.supabase;
  }

  function escapeHtml(s) {
    const d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  function formatDate(iso) {
    try {
      return new Date(iso).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      return "";
    }
  }

  function injectStyles() {
    if (document.getElementById("account-styles")) return;
    const style = document.createElement("style");
    style.id = "account-styles";
    style.textContent = `
      .account-wrap {
        max-width: 960px;
        margin: 24px auto 48px;
        padding: 0 20px;
        font-family: "DM Sans", sans-serif;
      }
      .account-header {
        text-align: center;
        margin-bottom: 28px;
      }
      .account-header h2 {
        margin: 0 0 6px;
        font-family: "Gasoek One", sans-serif;
        font-size: 1.8rem;
        color: #0e0973;
      }
      [data-theme="dark"] .account-header h2 { color: #b8e6ff; }
      .account-header p {
        margin: 0;
        opacity: 0.85;
        font-size: 0.95rem;
      }
      .account-empty {
        text-align: center;
        padding: 40px 20px;
        border-radius: 24px;
        background: rgba(255, 255, 255, 0.4);
        backdrop-filter: blur(10px);
        color: #0e0973;
      }
      [data-theme="dark"] .account-empty {
        background: rgba(30, 45, 42, 0.65);
        color: #e8f4ec;
      }
      .account-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 18px;
      }
      .account-pic-card {
        border-radius: 20px;
        overflow: hidden;
        background: rgba(255, 255, 255, 0.45);
        backdrop-filter: blur(10px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
      }
      [data-theme="dark"] .account-pic-card {
        background: rgba(30, 45, 42, 0.7);
      }
      .account-pic-card img {
        width: 100%;
        aspect-ratio: 1;
        object-fit: cover;
        display: block;
      }
      .account-pic-meta {
        padding: 10px 12px 12px;
        font-size: 0.8rem;
      }
      .account-pic-date {
        opacity: 0.75;
        margin-bottom: 8px;
      }
      .account-pic-public {
        display: flex;
        align-items: center;
        gap: 6px;
        cursor: pointer;
        font-size: 0.82rem;
      }
      .account-back {
        display: inline-block;
        margin-top: 28px;
        color: #0e0973;
        font-weight: 700;
        text-decoration: none;
      }
      [data-theme="dark"] .account-back { color: #b8e6ff; }
      .account-msg {
        text-align: center;
        min-height: 1.2em;
        margin-bottom: 16px;
        color: #0e0973;
      }
      [data-theme="dark"] .account-msg { color: #b8e6ff; }
      @media (max-width: 768px) {
        .account-wrap {
          margin: 12px auto 36px;
          padding: 0 14px;
        }
        .account-header h2 { font-size: 1.45rem; }
        .account-grid {
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        .account-pic-meta { padding: 8px 10px 10px; font-size: 0.75rem; }
        .account-empty { padding: 28px 16px; font-size: 0.9rem; }
      }
      @media (max-width: 480px) {
        .account-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
        .account-header h2 { font-size: 1.25rem; }
      }
    `;
    document.head.appendChild(style);
  }

  function redirectToAuth() {
    const returnTo = encodeURIComponent(
      window.location.pathname + window.location.search + window.location.hash
    );
    window.location.replace("auth.html?redirect=" + returnTo);
  }

  async function togglePublic(id, checked) {
    const { error } = await sb()
      .from("user_pics")
      .update({ is_public: checked })
      .eq("id", id);

    const msg = document.getElementById("account-msg");
    if (error) {
      if (msg) msg.textContent = "Could not update: " + error.message;
      return;
    }
    if (msg) msg.textContent = checked ? "Photo is now public." : "Photo is now private.";
    setTimeout(() => {
      if (msg) msg.textContent = "";
    }, 2000);
  }

  function renderPics(pics) {
    const grid = document.getElementById("account-grid");
    const empty = document.getElementById("account-empty");
    if (!grid) return;

    if (!pics.length) {
      grid.innerHTML = "";
      if (empty) empty.style.display = "block";
      return;
    }

    if (empty) empty.style.display = "none";
    grid.innerHTML = pics
      .map(
        (pic) =>
          `<article class="account-pic-card" data-id="${escapeHtml(pic.id)}">` +
          `<img src="${escapeHtml(pic.image_url)}" alt="Your recycling photo" loading="lazy">` +
          `<div class="account-pic-meta">` +
          `<div class="account-pic-date">${escapeHtml(formatDate(pic.created_at))}</div>` +
          `<label class="account-pic-public">` +
          `<input type="checkbox" class="account-public-toggle" data-id="${escapeHtml(pic.id)}" ${pic.is_public ? "checked" : ""}> Public` +
          `</label>` +
          `</div></article>`
      )
      .join("");

    grid.querySelectorAll(".account-public-toggle").forEach((input) => {
      input.addEventListener("change", () => togglePublic(input.dataset.id, input.checked));
    });
  }

  async function init() {
    injectStyles();

    const client = sb();
    const { data: sessionData } = await client.auth.getSession();
    const session = sessionData?.session;
    if (!session) {
      redirectToAuth();
      return;
    }

    const emailEl = document.getElementById("account-email");
    if (emailEl) emailEl.textContent = session.user.email || "Your account";

    const { data: pics, error } = await client
      .from("user_pics")
      .select("id, image_url, is_public, created_at")
      .order("created_at", { ascending: false });

    const msg = document.getElementById("account-msg");
    if (error) {
      if (msg) msg.textContent = "Could not load photos: " + error.message;
      return;
    }

    renderPics(pics || []);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
