(function () {
  let session = null;
  let myLikes = new Set();
  let myPins = new Set();
  let commentsByPic = {};

  function sb() {
    return window.supabase;
  }

  function escapeHtml(s) {
    const d = document.createElement("div");
    d.textContent = s == null ? "" : String(s);
    return d.innerHTML;
  }

  function authUrl() {
    const returnTo = encodeURIComponent(
      window.location.pathname + window.location.search
    );
    return "auth.html?redirect=" + returnTo;
  }

  function requireLogin() {
    window.location.href = authUrl();
  }

  function formatDate(iso) {
    try {
      return new Date(iso).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (e) {
      return "";
    }
  }

  function displayName(pic) {
    const name = pic.profiles?.display_name;
    if (name) return name;
    return "Recycler";
  }

  function avatarLetter(name) {
    return (name || "R").charAt(0).toUpperCase();
  }

  async function loadSession() {
    const { data } = await sb().auth.getSession();
    session = data?.session || null;
    return session;
  }

  async function loadMyInteractions(picIds) {
    myLikes = new Set();
    myPins = new Set();
    if (!session || !picIds.length) return;

    const uid = session.user.id;
    const [likesRes, pinsRes] = await Promise.all([
      sb().from("pic_likes").select("pic_id").eq("user_id", uid).in("pic_id", picIds),
      sb().from("pic_pins").select("pic_id").eq("user_id", uid).in("pic_id", picIds),
    ]);

    (likesRes.data || []).forEach((r) => myLikes.add(r.pic_id));
    (pinsRes.data || []).forEach((r) => myPins.add(r.pic_id));
  }

  async function fetchProfileMap(userIds) {
    const map = {};
    if (!userIds.length) return map;

    const { data, error } = await sb()
      .from("profiles")
      .select("id, display_name")
      .in("id", userIds);

    if (error) {
      console.error(error);
      return map;
    }

    (data || []).forEach((p) => {
      map[p.id] = p.display_name;
    });
    return map;
  }

  async function loadComments(picIds, profileMap) {
    commentsByPic = {};
    if (!picIds.length) return;

    const { data, error } = await sb()
      .from("pic_comments")
      .select("id, pic_id, comment_text, created_at, user_id")
      .in("pic_id", picIds)
      .order("created_at", { ascending: true });

    if (error) {
      console.error(error);
      return;
    }

    (data || []).forEach((c) => {
      c.profiles = { display_name: profileMap[c.user_id] || null };
      if (!commentsByPic[c.pic_id]) commentsByPic[c.pic_id] = [];
      commentsByPic[c.pic_id].push(c);
    });
  }

  async function loadLikeCounts(picIds) {
    const counts = {};
    picIds.forEach((id) => {
      counts[id] = 0;
    });
    if (!picIds.length) return counts;

    const { data, error } = await sb()
      .from("pic_likes")
      .select("pic_id")
      .in("pic_id", picIds);

    if (error) {
      console.error(error);
      return counts;
    }

    (data || []).forEach((r) => {
      counts[r.pic_id] = (counts[r.pic_id] || 0) + 1;
    });
    return counts;
  }

  function renderComment(c) {
    const name = c.profiles?.display_name || "User";
    return (
      `<div class="shares-comment">` +
      `<strong>${escapeHtml(name)}</strong>` +
      `<span>${escapeHtml(c.comment_text)}</span>` +
      `</div>`
    );
  }

  function renderCard(pic, likeCounts) {
    const id = pic.id;
    const name = displayName(pic);
    const liked = myLikes.has(id);
    const pinned = myPins.has(id);
    const likeCount = likeCounts[id] || 0;
    const comments = commentsByPic[id] || [];
    const commentsHtml = comments.map(renderComment).join("");

    return (
      `<article class="shares-card" data-pic-id="${escapeHtml(id)}">` +
      `<div class="shares-card-header">` +
      `<div class="shares-avatar" aria-hidden="true">${escapeHtml(avatarLetter(name))}</div>` +
      `<div>` +
      `<div class="shares-username">${escapeHtml(name)}</div>` +
      `<div class="shares-date">${escapeHtml(formatDate(pic.created_at))}</div>` +
      `</div></div>` +
      `<div class="shares-img-wrap">` +
      `<img src="${escapeHtml(pic.image_url)}" alt="Recycling photo by ${escapeHtml(name)}" loading="lazy">` +
      `</div>` +
      `<div class="shares-actions">` +
      `<button type="button" class="shares-action-btn ${liked ? "active-like" : ""}" data-action="like" data-pic="${escapeHtml(id)}" aria-label="Like">` +
      `<span class="shares-action-icon">${liked ? "♥" : "♡"}</span>` +
      `<span class="shares-like-count">${likeCount}</span>` +
      `</button>` +
      `<button type="button" class="shares-action-btn" data-action="comment-toggle" data-pic="${escapeHtml(id)}" aria-label="Comments">` +
      `<span class="shares-action-icon">💬</span>` +
      `<span>${comments.length}</span>` +
      `</button>` +
      `<button type="button" class="shares-action-btn ${pinned ? "active-pin" : ""}" data-action="pin" data-pic="${escapeHtml(id)}" aria-label="Pin">` +
      `<span class="shares-action-icon">${pinned ? "📌" : "🔖"}</span>` +
      `<span>Pin</span>` +
      `</button>` +
      `</div>` +
      `<div class="shares-comments-wrap">` +
      `<div class="shares-comments-list" id="comments-${escapeHtml(id)}">${commentsHtml}</div>` +
      `<form class="shares-comment-form" data-pic="${escapeHtml(id)}">` +
      `<input type="text" class="shares-comment-input" placeholder="Add a comment…" maxlength="300" autocomplete="off">` +
      `<button type="submit" class="shares-comment-send">Post</button>` +
      `</form>` +
      `</div></article>`
    );
  }

  let feedEventsBound = false;

  function bindFeedEvents() {
    const feed = document.getElementById("shares-feed");
    if (!feed || feedEventsBound) return;
    feedEventsBound = true;

    feed.addEventListener("click", async (e) => {
      const btn = e.target.closest("[data-action]");
      if (!btn) return;

      const action = btn.dataset.action;
      const picId = btn.dataset.pic;
      if (!picId) return;

      if (action === "like" || action === "pin") {
        if (!session) {
          requireLogin();
          return;
        }
        if (action === "like") await toggleLike(picId, btn);
        if (action === "pin") await togglePin(picId, btn);
      }

      if (action === "comment-toggle") {
        const list = document.getElementById("comments-" + picId);
        if (list) list.classList.toggle("open");
      }
    });

    feed.addEventListener("submit", async (e) => {
      const form = e.target.closest(".shares-comment-form");
      if (!form) return;
      e.preventDefault();

      if (!session) {
        requireLogin();
        return;
      }

      const picId = form.dataset.pic;
      const input = form.querySelector(".shares-comment-input");
      const text = input?.value?.trim();
      if (!text) return;

      const { data, error } = await sb()
        .from("pic_comments")
        .insert({
          pic_id: picId,
          user_id: session.user.id,
          comment_text: text,
        })
        .select("id, pic_id, comment_text, created_at, user_id")
        .single();

      if (error) {
        alert("Could not post comment: " + error.message);
        return;
      }

      const profile = await getMyProfile();
      if (data) data.profiles = profile;

      if (!commentsByPic[picId]) commentsByPic[picId] = [];
      commentsByPic[picId].push(data || { pic_id: picId, comment_text: text, profiles: profile });

      const list = document.getElementById("comments-" + picId);
      if (list) {
        list.classList.add("open");
        list.insertAdjacentHTML("beforeend", renderComment(data || { comment_text: text, profiles: profile }));
      }

      const toggleBtn = feed.querySelector(`[data-action="comment-toggle"][data-pic="${picId}"] span:last-child`);
      if (toggleBtn) toggleBtn.textContent = String(commentsByPic[picId].length);

      input.value = "";
    });
  }

  async function getMyProfile() {
    if (!session) return null;
    const { data } = await sb()
      .from("profiles")
      .select("display_name")
      .eq("id", session.user.id)
      .maybeSingle();
    return data;
  }

  async function toggleLike(picId, btn) {
    const uid = session.user.id;
    const liked = myLikes.has(picId);

    if (liked) {
      const { error } = await sb()
        .from("pic_likes")
        .delete()
        .eq("pic_id", picId)
        .eq("user_id", uid);
      if (error) return;
      myLikes.delete(picId);
      btn.classList.remove("active-like");
      btn.querySelector(".shares-action-icon").textContent = "♡";
      const countEl = btn.querySelector(".shares-like-count");
      countEl.textContent = String(Math.max(0, parseInt(countEl.textContent, 10) - 1));
    } else {
      const { error } = await sb()
        .from("pic_likes")
        .insert({ pic_id: picId, user_id: uid });
      if (error) {
        alert("Could not like: " + error.message);
        return;
      }
      myLikes.add(picId);
      btn.classList.add("active-like");
      btn.querySelector(".shares-action-icon").textContent = "♥";
      const countEl = btn.querySelector(".shares-like-count");
      countEl.textContent = String(parseInt(countEl.textContent, 10) + 1);
    }
  }

  async function togglePin(picId, btn) {
    const uid = session.user.id;
    const pinned = myPins.has(picId);

    if (pinned) {
      const { error } = await sb()
        .from("pic_pins")
        .delete()
        .eq("pic_id", picId)
        .eq("user_id", uid);
      if (error) return;
      myPins.delete(picId);
      btn.classList.remove("active-pin");
      btn.querySelector(".shares-action-icon").textContent = "🔖";
    } else {
      const { error } = await sb()
        .from("pic_pins")
        .insert({ pic_id: picId, user_id: uid });
      if (error) {
        alert("Could not pin: " + error.message);
        return;
      }
      myPins.add(picId);
      btn.classList.add("active-pin");
      btn.querySelector(".shares-action-icon").textContent = "📌";
    }
  }

  async function loadFeed() {
    const feed = document.getElementById("shares-feed");
    const hint = document.getElementById("shares-login-hint");
    if (!feed) return;

    feed.innerHTML = `<div class="shares-loading">Loading Recyclegram…</div>`;

    await loadSession();

    if (hint) {
      hint.style.display = session ? "none" : "block";
    }

    const { data: pics, error } = await sb()
      .from("user_pics")
      .select("id, image_url, created_at, user_id")
      .eq("is_public", true)
      .order("created_at", { ascending: false });

    if (error) {
      feed.innerHTML =
        `<div class="shares-empty">Could not load feed: ${escapeHtml(error.message)}</div>`;
      return;
    }

    if (!pics?.length) {
      feed.innerHTML =
        `<div class="shares-empty">No public shares yet. Upload a photo on the home page and mark it public!</div>`;
      return;
    }

    const userIds = [...new Set(pics.map((p) => p.user_id))];
    const profileMap = await fetchProfileMap(userIds);
    pics.forEach((p) => {
      p.profiles = { display_name: profileMap[p.user_id] || null };
    });

    const picIds = pics.map((p) => p.id);
    await Promise.all([
      loadMyInteractions(picIds),
      loadComments(picIds, profileMap),
    ]);
    const likeCounts = await loadLikeCounts(picIds);

    feed.innerHTML = pics.map((p) => renderCard(p, likeCounts)).join("");
    bindFeedEvents();
  }

  async function init() {
    await loadFeed();
    window.addEventListener("authStateChanged", () => loadFeed());
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
