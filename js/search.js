// searc.js
const searchInput = document.getElementById('main-search-input');
const searchBtn = document.getElementById('search-btn');

function performSearch() {
    const query = searchInput.value.trim();

    if (query !== "") {
        // 1. Save the item name so item.html can read it
        localStorage.setItem('userSearch', query);
        
        // 2. Redirect the user to the results page
        window.location.href = 'item.html';
    } else {
        alert("Please type an item name first!");
    }
}

// Trigger search on button click
searchBtn.addEventListener('click', performSearch);

// Trigger search when user presses "Enter" key
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        performSearch();
    }
});

