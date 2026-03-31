// search.js
document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');

    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = searchInput.value.trim();
            if (query) {
                // Redirects to item.html with the search word attached
                window.location.href = `item.html?query=${encodeURIComponent(query)}`;
            }
        });
    }
});