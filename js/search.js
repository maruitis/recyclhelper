document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('searchForm'); // Matches your HTML ID
    const searchInput = document.getElementById('searchInput'); // Matches your HTML ID

    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = searchInput.value.trim().toLowerCase();
            
            // Check if the item exists in our main.js database
            if (itemDatabase[query]) {
                window.location.href = `item.html?item=${encodeURIComponent(query)}`;
            } else {
                alert("Item not found. Try 'plastic bottle', 'laptop', or 'sweater'.");
            }
        });
    }
});