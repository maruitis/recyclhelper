function sanitizeIlikeQuery(raw) {
  return raw.trim().replace(/[%_\\]/g, "");
}

async function searchItem() {
  const inputEl = document.getElementById("searchInput");
  const resultsEl = document.getElementById("searchResults");
  if (!inputEl || !resultsEl) return;

  if (!window.supabase || typeof window.supabase.from !== "function") {
    resultsEl.hidden = false;
    resultsEl.innerHTML =
      '<p class="search-results-msg search-results-error">Database client failed to load. Use a local web server (not file://), check the Supabase script in the network tab, and open the console for errors.</p>';
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
  const { data, error } = await window.supabase
    .from("items")
    .select("*")
    .ilike("name", pattern);

  if (error) {
    resultsEl.innerHTML = `<p class="search-results-msg search-results-error">Could not search. Check your connection and Supabase table <code>items</code> (column <code>name</code>).</p>`;
    console.error(error);
    return;
  }

  if (!data || data.length === 0) {
    resultsEl.innerHTML =
      '<p class="search-results-msg">No items found. Try “plastic bottle”, “glass bottle”, etc.</p>';
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

function initSearchEnter() {
  const inputEl = document.getElementById("searchInput");
  if (!inputEl) return;
  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      searchItem();
    }
  });
}

function initFromQuery() {
  const inputEl = document.getElementById("searchInput");
  const params = new URLSearchParams(window.location.search);
  const q = params.get("q");
  if (inputEl && q) {
    inputEl.value = q;
    searchItem();
  }
}

function initHomeSearch() {
  initSearchEnter();
  initFromQuery();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initHomeSearch);
} else {
  initHomeSearch();
}
async function searchItem() {
  const query = document.getElementById('searchInput').value.trim();
  const resultsDiv = document.getElementById('searchResults');

  if (!query) {
    resultsDiv.innerHTML = "Please enter something to search.";
    resultsDiv.hidden = false;
    return;
  }

  try {
    // пример для тестовой таблицы "todos"
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .ilike('task', `%${query}%`);  // ilike — поиск без учёта регистра

    if (error) {
      resultsDiv.innerHTML = "Error fetching data: " + error.message;
    } else if (data.length === 0) {
      resultsDiv.innerHTML = "No results found.";
    } else {
      // выводим результаты
      resultsDiv.innerHTML = data.map(item => `<div>${item.task}</div>`).join('');
    }

    resultsDiv.hidden = false;
  } catch (e) {
    resultsDiv.innerHTML = "Something went wrong: " + e.message;
    resultsDiv.hidden = false;
  }
}