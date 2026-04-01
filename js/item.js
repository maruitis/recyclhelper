document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const itemName = params.get('item')?.toLowerCase();
    const data = itemDatabase[itemName];

    if (!data) return;
const imgElement = document.getElementById('itemPicture');
    if (imgElement && data.image) {
        imgElement.src = data.image;
        imgElement.alt = itemName;
    }
    document.getElementById('displayItemName').innerText = itemName.toUpperCase();
    document.getElementById('detailQuestion').innerText = data.detail;

    const grid = document.getElementById('materialGrid');
    const materials = materialGroups[data.group];

    materials.forEach(m => {
        const card = document.createElement('div');
        card.className = 'material-card';
        card.innerHTML = `<h6>${m.name}</h6><h6>${m.abbr}</h6><h7>Use: ${m.use}</h7><br><h7>Feel: ${m.feel}</h7>`;
        card.onclick = () => {
            localStorage.setItem('selectedMaterial', m.name);
            document.querySelectorAll('.material-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            document.getElementById('nextBtn').style.display = 'block';
        };
        grid.appendChild(card);
    });

    document.getElementById('nextBtn').onclick = () => {
        localStorage.setItem('currentItem', itemName);
        localStorage.setItem('itemDetail', document.getElementById('detailSelect').value);
        window.location.href = 'recycle.html';
    };
});
// Example of how you might render an item
function displayItem(itemName) {
    const item = itemDatabase[itemName];
    
    // Create an image element
    const imgElement = document.createElement("img");
    
    // Set the source to the path you added in the database
    imgElement.src = item.image; 
    imgElement.alt = itemName;
    imgElement.style.width = "200px"; // Optional styling
    
    // Append it to your container
    document.getElementById("display-area").appendChild(imgElement);
}