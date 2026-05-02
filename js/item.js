document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const itemName = params.get('item')?.toLowerCase();
    
    // tjanjet dannie
    const data = itemDatabase[itemName];

    if (!data) {
        console.error("Item not found!");
        return;
    }
    
     const imgElement = document.getElementById('itemPicture'); 
    
    if (imgElement && data.image) {
        imgElement.src = data.image; // dlja kartinok
        imgElement.alt = itemName;
        imgElement.style.display = "block"; 
    }

    document.getElementById('displayItemName').innerText = itemName.toUpperCase();

    // save item
    localStorage.setItem('currentItem', itemName);

    // dlja imeni
    document.getElementById('displayItemName').innerText = itemName.toUpperCase();

    // detali
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
    
    detailsContainer.querySelectorAll('.detail-option-btn').forEach(btn => {
        btn.onclick = () => {
            // odin vibor
            detailsContainer.querySelectorAll('.detail-option-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // dlja glow
            const choice = btn.getAttribute('data-val');
            const yesCol = document.getElementById('yesCol');
            const noCol = document.getElementById('noCol');

            if (choice === 'yes') {
              document.getElementById('yesCol').classList.add('glow-active');
              document.getElementById('noCol').classList.remove('glow-active');
            } else {
              document.getElementById('noCol').classList.add('glow-active');
              document.getElementById('yesCol').classList.remove('glow-active');  
            }

            // sohronjaet dlja filtertags
            const savedTag = (choice === 'yes') ? Object.keys(data.prepTips)[0] : Object.keys(data.prepTips)[1];
            localStorage.setItem('userChoiceTag', savedTag);
            localStorage.setItem('userChoiceBinary', choice); // Saves 'yes' or 'no'

            checkIfReady(); 
        };
    });
}

// soveti
const tipsPanel = document.getElementById('tipsPanel');
if (tipsPanel && data.prepTips) {
    tipsPanel.style.display = 'block';
    
    const keys = Object.keys(data.prepTips);
    const yesTag = keys[0] || "Yes";
    const noTag = keys[1] || "No";

    const yesTips = data.prepTips[yesTag] || [];
    const noTips  = data.prepTips[noTag]  || [];

    tipsPanel.innerHTML = `
        <div class="tips-two-col">
            <div class="tips-col" id="yesCol">
                <div class="col-label yes-label">✓ ${yesTag}</div>
                <ul class="tips-list-ol">
                    ${yesTips.map(tip => `<li>${tip}</li>`).join('')}
                </ul>
            </div>
            <div class="tips-col" id="noCol">
                <div class="col-label no-label">✗ ${noTag}</div>
                <ul class="tips-list-ol">
                    ${noTips.map(tip => `<li>${tip}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;
}
    // materiali
    const grid = document.getElementById('materialGrid');
    const materials = materialGroups[data.group];

    if (grid && materials) {
        grid.innerHTML = "";

materials.forEach(m => {
    const card = document.createElement('div');
    card.className = 'material-card';

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
        // Notify bin selector of this item's material group
        if (typeof updateBinForGroup === 'function') updateBinForGroup(data.group);
    }

    //dlja knopki
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