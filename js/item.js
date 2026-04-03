document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const itemName = params.get('item')?.toLowerCase();
    
    // 1. Get the data from main.js
    const data = itemDatabase[itemName];

    if (!data) {
        console.error("Item not found!");
        return;
    }
    
     const imgElement = document.getElementById('itemPicture'); 
    
    if (imgElement && data.image) {
        imgElement.src = data.image; // Pulls from main.js (e.g., "images/plasticbottle.png")
        imgElement.alt = itemName;
        imgElement.style.display = "block"; // Ensure it is visible
    }
    // -------------------------

    document.getElementById('displayItemName').innerText = itemName.toUpperCase();


    // 2. Display the Item Name
    document.getElementById('displayItemName').innerText = itemName.toUpperCase();

    // 3. Display the Detail Question (e.g., "Is the cap still on?")
 // Inside your DOMContentLoaded...
const detailsContainer = document.getElementById('detailsSection');
if (detailsContainer && data.detail) {
    detailsContainer.innerHTML = `
        <div class="detail-spec-section">
            <h3>${data.detail}</h3>
            <div class="detail-options">
                <button class="detail-option-btn" data-val="yes">Yes</button>
                <button class="detail-option-btn" data-val="no">No</button>
            </div>
        </div>
    `;
    
    // Add event listeners to the buttons
    detailsContainer.querySelectorAll('.detail-option-btn').forEach(btn => {
        btn.onclick = () => {
            detailsContainer.querySelectorAll('.detail-option-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            checkIfReady(); // Check if material is also selected to show nextBtn
        };
    });
}

    // 4. Generate Materials Grid
    const grid = document.getElementById('materialGrid');
    const materials = materialGroups[data.group];

    if (grid && materials) {
        grid.innerHTML = ""; // Clear existing content
       // Inside your materialGroups.forEach loop in item.js
materials.forEach(m => {
    const card = document.createElement('div');
    card.className = 'material-card';
    
    // We break everything into separate spans/divs with unique classes
    card.innerHTML = `
        <div class="mat-abbr-circle">${m.abbr}</div>
        <div class="mat-name">${m.name}</div>
        <div class="mat-info-row">
            <span class="mat-label">Common use :</span>
            <span class="mat-value">${m.use}</span>
        </div>
        <div class="mat-info-row">
            <span class="mat-label">How it feels:</span>
            <span class="mat-value">${m.feel}</span>
        </div>
    `;
    
    card.onclick = () => {
        document.querySelectorAll('.material-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        localStorage.setItem('selectedMaterial', m.name);
        checkIfReady();
    };
    grid.appendChild(card);
}); 
    }

    // 5. Show button only when selections are made
    function checkIfReady() {
        const materialSelected = document.querySelector('.material-card.active');
        const detailSelected = document.querySelector('.detail-option-btn.active');
        if (materialSelected && detailSelected) {
            document.getElementById('nextBtn').style.display = 'block';
        }
    }

    document.getElementById('nextBtn').onclick = () => {
        localStorage.setItem('currentItem', itemName);
        window.location.href = 'recycle.html';
    };
});