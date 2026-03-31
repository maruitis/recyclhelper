const searchBar = document.querySelector('.search-input'); // Match your HTML class
const searchBtn = document.querySelector('.search-btn');

searchBtn.addEventListener('click', () => {
    const query = searchBar.value.trim();
    if (query) {
        // Save the search for the next page
        localStorage.setItem('currentUserSearch', query);
        window.location.href = 'item.html';
    }
});
