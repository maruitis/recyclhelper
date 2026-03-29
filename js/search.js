async function searchItem() {

  const input = document.getElementById("searchInput");
  const results = document.getElementById("searchResults");

  const query = input.value.trim().toLowerCase();

  results.innerHTML = "";
  results.hidden = true;

  if (!query) return;

  const { data, error } = await supabase
    .from("items")
    .select("items_id,name")
    .ilike("name", `%${query}%`);

  if (error) {

    console.error(error);

    results.innerHTML = "<p>Error loading items</p>";
    results.hidden = false;
    return;
  }

  if (!data || data.length === 0) {

    results.innerHTML = "<p>No results found</p>";
    results.hidden = false;
    return;
  }

  data.forEach(item => {

    const link = document.createElement("a");

    link.href = `item.html?id=${item.items_id}`;

    link.textContent = item.name;

    link.className = "search-result-link";

    results.appendChild(link);

  });

  results.hidden = false;

}



function sanitizeIlikeQuery(raw) {
  return raw.trim().replace(/[%_\\]/g, "");
}

async function searchItem() {
  const inputEl = document.getElementById("searchInput");
  const resultsEl = document.getElementById("searchResults");
  if (!inputEl || !resultsEl) return;

  // Используем клиент, созданный в main.js
  const supabase = window.supabaseClient; 
  
  if (!supabase || typeof supabase.from !== "function") {
    resultsEl.hidden = false;
    resultsEl.innerHTML = '<p class="search-results-msg search-results-error">Ошибка: Клиент Supabase не инициализирован.</p>';
    return;
  }

  const q = sanitizeIlikeQuery(inputEl.value);
  if (!q) {
    resultsEl.hidden = true;
    resultsEl.innerHTML = "";
    return;
  }

  resultsEl.hidden = false;
  resultsEl.innerHTML = '<p class="search-results-msg">Searching…</p>';

  const pattern = `%${q}%`;
  
  // ВАЖНО: Убедись, что в Supabase таблица называется "items", а колонка "name"
  const { data, error } = await supabase
    .from("items")
    .select("*")
    .ilike("name", pattern);

  if (error) {
    resultsEl.innerHTML = `<p class="search-results-msg search-results-error">Ошибка поиска: ${error.message}</p>`;
    console.error(error);
    return;
  }

  if (!data || data.length === 0) {
    resultsEl.innerHTML = '<p class="search-results-msg">No items found. Try “plastic bottle”.</p>';
    return;
  }

  const list = document.createElement("ul");
  list.className = "search-results-list";

  data.forEach((row) => {
    const id = row.items_id ?? row.id;
    const name = row.name ?? "Item";
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = `item.html?id=${encodeURIComponent(id)}`;
    a.textContent = name;
    li.appendChild(a);
    list.appendChild(li);
  });

  resultsEl.innerHTML = "";
  resultsEl.appendChild(list);
}

// Инициализация событий
function initHomeSearch() {
  const inputEl = document.getElementById("searchInput");
  if (!inputEl) return;

  // Поиск по Enter
  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      searchItem();
    }
  });

  // Если в URL есть параметр ?q=...
  const params = new URLSearchParams(window.location.search);
  const q = params.get("q");
  if (q) {
    inputEl.value = q;
    searchItem();
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initHomeSearch);
} else {
  initHomeSearch();
}
