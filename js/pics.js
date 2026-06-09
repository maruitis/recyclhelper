(function () {
  const BUCKET = "recycling-pics";
  let pendingFile = null;
  let session = null;

  function sb() {
    return window.supabase;
  }

  function isIndexPage() {
    const path = window.location.pathname || "";
    return path.endsWith("index.html") || path.endsWith("/") || path === "";
  }

  function injectStyles() {
    if (document.getElementById("pics-styles")) return;
    const style = document.createElement("style");
    style.id = "pics-styles";
    style.textContent = `
      .recycle-pic-add {
        position: fixed;
        bottom: 28px;
        right: 28px;
        z-index: 900;
        width: 56px;
        height: 56px;
        border-radius: 40px;
        border: 1.5px solid rgba(255, 255, 255, 0.55);
        background: rgba(255, 255, 255, 0.35);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        box-shadow: 0 8px 28px rgba(0, 0, 0, 0.18);
        color: #0e0973;
        font-size: 2rem;
        font-weight: 300;
        line-height: 1;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
      }
      .recycle-pic-add:hover {
        transform: scale(1.08);
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.24);
        background: rgba(255, 255, 255, 0.5);
      }
      [data-theme="dark"] .recycle-pic-add {
        background: rgba(30, 45, 42, 0.65);
        border-color: rgba(160, 220, 200, 0.35);
        color: #b8e6ff;
      }
      .recycle-pic-overlay {
        position: fixed;
        inset: 0;
        z-index: 1100;
        background: rgba(0, 0, 0, 0.45);
        backdrop-filter: blur(4px);
        display: none;
        align-items: center;
        justify-content: center;
        padding: 20px;
      }
      .recycle-pic-overlay.open { display: flex; }
      .recycle-pic-modal {
        width: min(420px, 94vw);
        padding: 26px 22px;
        border-radius: 28px;
        background: rgba(255, 255, 255, 0.55);
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        box-shadow: 0 16px 48px rgba(0, 0, 0, 0.2);
        font-family: "DM Sans", sans-serif;
        text-align: center;
      }
      [data-theme="dark"] .recycle-pic-modal {
        background: rgba(30, 45, 42, 0.82);
        color: #e8f4ec;
      }
      .recycle-pic-modal h3 {
        margin: 0 0 6px;
        font-family: "Gasoek One", sans-serif;
        font-size: 1.35rem;
        color: #0e0973;
      }
      [data-theme="dark"] .recycle-pic-modal h3 { color: #b8e6ff; }
      .recycle-pic-modal p {
        margin: 0 0 18px;
        font-size: 0.9rem;
        opacity: 0.85;
      }
      .recycle-pic-actions {
        display: flex;
        gap: 10px;
        justify-content: center;
        flex-wrap: wrap;
      }
      .recycle-pic-actions button {
        border: none;
        border-radius: 999px;
        padding: 11px 18px;
        font-weight: 700;
        cursor: pointer;
        font-family: inherit;
        background: linear-gradient(135deg, #89f19e, #8ac4c6);
        color: #1a3d2e;
      }
      .recycle-pic-actions button.secondary {
        background: rgba(255, 255, 255, 0.7);
        color: #333;
      }
      [data-theme="dark"] .recycle-pic-actions button.secondary {
        background: rgba(20, 35, 32, 0.9);
        color: #e8f4ec;
      }
      .recycle-pic-preview {
        display: none;
        margin: 0 0 14px;
      }
      .recycle-pic-preview.show { display: block; }
      .recycle-pic-preview img {
        width: 100%;
        max-height: 240px;
        object-fit: cover;
        border-radius: 18px;
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
      }
      .recycle-pic-public {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        margin: 12px 0 16px;
        font-size: 0.88rem;
      }
      .recycle-pic-msg {
        min-height: 1.2em;
        font-size: 0.85rem;
        margin-top: 10px;
        color: #0e0973;
      }
      [data-theme="dark"] .recycle-pic-msg { color: #b8e6ff; }
      .recycle-pic-close {
        position: absolute;
        top: 14px;
        right: 18px;
        background: none;
        border: none;
        font-size: 1.4rem;
        cursor: pointer;
        color: inherit;
        opacity: 0.7;
      }
      .recycle-pic-modal-wrap { position: relative; }
      @media (max-width: 768px) {
        .recycle-pic-add {
          bottom: calc(78px + env(safe-area-inset-bottom, 0px));
          right: 14px;
          width: 50px;
          height: 50px;
          border-radius: 36px;
          font-size: 1.7rem;
        }
        .recycle-pic-overlay { padding: 12px; align-items: flex-end; }
        .recycle-pic-modal {
          width: 100%;
          max-width: none;
          padding: 20px 16px 24px;
          border-radius: 22px 22px 18px 18px;
        }
        .recycle-pic-actions { flex-direction: column; }
        .recycle-pic-actions button { width: 100%; }
        .recycle-pic-preview img { max-height: 200px; }
      }
      @media (max-width: 480px) {
        .recycle-pic-add {
          bottom: calc(70px + env(safe-area-inset-bottom, 0px));
          right: 10px;
          width: 46px;
          height: 46px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function setPlusVisible(visible) {
    const btn = document.getElementById("recycle-pic-add");
    if (btn) btn.style.display = visible ? "flex" : "none";
  }

  function injectUI() {
    if (document.getElementById("recycle-pic-add")) return;

    const addBtn = document.createElement("button");
    addBtn.id = "recycle-pic-add";
    addBtn.className = "recycle-pic-add";
    addBtn.type = "button";
    addBtn.setAttribute("aria-label", "Add recycling photo");
    addBtn.title = "Share your recycling moment";
    addBtn.textContent = "+";

    const overlay = document.createElement("div");
    overlay.id = "recycle-pic-overlay";
    overlay.className = "recycle-pic-overlay";
    overlay.innerHTML =
      `<div class="recycle-pic-modal-wrap">` +
      `<button type="button" class="recycle-pic-close" id="recycle-pic-close" aria-label="Close">✕</button>` +
      `<div class="recycle-pic-modal">` +
      `<h3>Recycling photo</h3>` +
      `<p id="recycle-pic-step-text">Take a picture or upload one from your device.</p>` +
      `<div class="recycle-pic-preview" id="recycle-pic-preview"><img id="recycle-pic-preview-img" alt="Preview"></div>` +
      `<label class="recycle-pic-public" id="recycle-pic-public-wrap" style="display:none;">` +
      `<input type="checkbox" id="recycle-pic-public"> Share publicly` +
      `</label>` +
      `<div class="recycle-pic-actions" id="recycle-pic-pick-actions">` +
      `<button type="button" id="recycle-pic-camera">Take photo</button>` +
      `<button type="button" class="secondary" id="recycle-pic-upload">Upload</button>` +
      `</div>` +
      `<div class="recycle-pic-actions" id="recycle-pic-confirm-actions" style="display:none;">` +
      `<button type="button" id="recycle-pic-submit">Upload photo</button>` +
      `<button type="button" class="secondary" id="recycle-pic-retake">Choose another</button>` +
      `</div>` +
      `<p class="recycle-pic-msg" id="recycle-pic-msg"></p>` +
      `</div></div>`;

    const cameraInput = document.createElement("input");
    cameraInput.type = "file";
    cameraInput.accept = "image/*";
    cameraInput.capture = "environment";
    cameraInput.id = "recycle-pic-camera-input";
    cameraInput.hidden = true;

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.id = "recycle-pic-file-input";
    fileInput.hidden = true;

    addBtn.style.display = "none";
    document.body.appendChild(addBtn);
    document.body.appendChild(overlay);
    document.body.appendChild(cameraInput);
    document.body.appendChild(fileInput);

    addBtn.addEventListener("click", openModal);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeModal();
    });
    document.getElementById("recycle-pic-close").addEventListener("click", closeModal);
    document.getElementById("recycle-pic-camera").addEventListener("click", () => cameraInput.click());
    document.getElementById("recycle-pic-upload").addEventListener("click", () => fileInput.click());
    document.getElementById("recycle-pic-retake").addEventListener("click", resetPreview);
    document.getElementById("recycle-pic-submit").addEventListener("click", uploadPhoto);
    cameraInput.addEventListener("change", onFileChosen);
    fileInput.addEventListener("change", onFileChosen);
  }

  function openModal() {
    resetPreview();
    document.getElementById("recycle-pic-overlay").classList.add("open");
  }

  function closeModal() {
    document.getElementById("recycle-pic-overlay").classList.remove("open");
    resetPreview();
  }

  function setMsg(text) {
    const el = document.getElementById("recycle-pic-msg");
    if (el) el.textContent = text || "";
  }

  function resetPreview() {
    pendingFile = null;
    setMsg("");
    document.getElementById("recycle-pic-camera-input").value = "";
    document.getElementById("recycle-pic-file-input").value = "";
    document.getElementById("recycle-pic-preview").classList.remove("show");
    document.getElementById("recycle-pic-public-wrap").style.display = "none";
    document.getElementById("recycle-pic-pick-actions").style.display = "flex";
    document.getElementById("recycle-pic-confirm-actions").style.display = "none";
    document.getElementById("recycle-pic-step-text").textContent =
      "Take a picture or upload one from your device.";
    const pub = document.getElementById("recycle-pic-public");
    if (pub) pub.checked = false;
  }

  function onFileChosen(e) {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) {
      setMsg("Please choose an image file.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setMsg("Image must be under 8 MB.");
      return;
    }

    pendingFile = file;
    const url = URL.createObjectURL(file);
    const img = document.getElementById("recycle-pic-preview-img");
    img.src = url;
    img.onload = () => URL.revokeObjectURL(url);

    document.getElementById("recycle-pic-preview").classList.add("show");
    document.getElementById("recycle-pic-public-wrap").style.display = "flex";
    document.getElementById("recycle-pic-pick-actions").style.display = "none";
    document.getElementById("recycle-pic-confirm-actions").style.display = "flex";
    document.getElementById("recycle-pic-step-text").textContent = "Happy with this shot?";
    setMsg("");
  }

  async function uploadPhoto() {
    if (!pendingFile || !session?.user?.id) {
      setMsg("No image selected.");
      return;
    }

    const submitBtn = document.getElementById("recycle-pic-submit");
    submitBtn.disabled = true;
    setMsg("Uploading…");

    const userId = session.user.id;
    const ext = (pendingFile.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
    const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const isPublic = document.getElementById("recycle-pic-public")?.checked || false;

    const client = sb();
    const { error: storageError } = await client.storage
      .from(BUCKET)
      .upload(path, pendingFile, { contentType: pendingFile.type, upsert: false });

    if (storageError) {
      submitBtn.disabled = false;
      setMsg("Upload failed: " + storageError.message);
      return;
    }

    const { data: urlData } = client.storage.from(BUCKET).getPublicUrl(path);
    const imageUrl = urlData?.publicUrl;

    const { error: dbError } = await client.from("user_pics").insert({
      user_id: userId,
      image_url: imageUrl,
      is_public: isPublic,
    });

    submitBtn.disabled = false;

    if (dbError) {
      setMsg("Saved file but database error: " + dbError.message);
      return;
    }

    setMsg("Photo uploaded! View it in My account.");
    setTimeout(closeModal, 1400);
  }

  async function applySession(nextSession) {
    session = nextSession || null;
    if (!isIndexPage()) return;

    injectStyles();
    injectUI();
    setPlusVisible(!!session);
  }

  async function init() {
    if (!isIndexPage()) return;

    const client = sb();
    if (!client?.auth?.getSession) return;

    const { data } = await client.auth.getSession();
    await applySession(data?.session || null);

    window.addEventListener("authStateChanged", (e) => {
      applySession(e.detail?.session || null);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
