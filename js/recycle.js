document.addEventListener('DOMContentLoaded', () => {
    // tjanet dannie
    const params = new URLSearchParams(window.location.search);
    const itemName = params.get('item')?.toLowerCase() || localStorage.getItem('currentItem') || "plastic bottle";
    const itemData = itemDatabase[itemName];
    const selectedMatName = localStorage.getItem('selectedMaterial');

    if (!itemData) {
        console.error("Item not found in database");
        return;
    }

    // 2. dlja kartinki
    const mainImg = document.getElementById('itemImage'); 
    if (mainImg && itemData.image) {
        mainImg.src = itemData.image;
        mainImg.alt = itemName;
    }

    // 3. dlja filtertags
    const tagsEl = document.getElementById('filterTags');
    if (tagsEl) {
        // dlja abbreviation
        let material = null;
        if (itemData.group && selectedMatName) {
            material = materialGroups[itemData.group].find(m => m.name === selectedMatName);
        }

        // dlja yes/no otvetiv
        const userChoiceTag = localStorage.getItem('userChoiceTag') || null;

        // dlja tags aray tipo
        const tags = [
            itemName,
            material ? `${material.abbr} — ${material.name}` : null,
            userChoiceTag
        ].filter(Boolean);

        tagsEl.innerHTML = ''; 

        tags.forEach((t, i) => {
            const tag = document.createElement('span');
            tag.className = `filter-tag anim-item d${i+1}`;
            tag.innerHTML = `${t.toUpperCase()} <span class="rm">✕</span>`;
            
            tag.querySelector('.rm').addEventListener('click', () => {
                tag.style.opacity = '0';
                setTimeout(() => tag.remove(), 300);
            });
            
            tagsEl.appendChild(tag);
        });
    }

    // 4. dlja diy kartochek
    const cards = [
        document.getElementById('diy-0'),
        document.getElementById('diy-1'),
        document.getElementById('diy-2')
    ];

    if (itemData.diys) {
        itemData.diys.forEach((project, index) => {
            if (cards[index]) {
                cards[index].innerHTML = `
                    <div class="idea-content">
                        <div class="idea-title">${project.name}</div>
                        <div class="idea-needs">${project.needs}</div>
                        <div class="idea-steps">
                            ${project.steps.map(step => `<div>${step}</div>`).join("")}
                        </div>
                    </div>
                `;
                cards[index].onclick = () => showModal(project);
            }
        });
    }

    // 5. calculjator
    const qtyInput = document.getElementById('calcQty');
    const updateStats = () => {
        if (!qtyInput) return;
        const qty = parseFloat(qtyInput.value) || 0;
        document.getElementById('saveWater').innerText = (qty * itemData.savings.water).toFixed(1);
        document.getElementById('saveEnergy').innerText = (qty * itemData.savings.energy).toFixed(1);
        document.getElementById('saveCO2').innerText = (qty * itemData.savings.co2).toFixed(1);
    };

    if (qtyInput) {
        qtyInput.addEventListener('input', updateStats);
        updateStats(); 
    }
});

// modalnije funkcii
function showModal(project) {
    const modal = document.getElementById('diyModal');
    if (!modal) return;
    document.getElementById('modalTitle').innerText = project.name;
    document.getElementById('modalNeeds').innerText = project.needs;
    const stepsList = document.getElementById('modalSteps');
    stepsList.innerHTML = project.steps.map(s => `<li>${s}</li>`).join('');
    modal.style.display = "block";
}

function closeModal() {
    document.getElementById('diyModal').style.display = "none";
}

window.onclick = function(event) {
    const modal = document.getElementById('diyModal');
    if (event.target === modal) { modal.style.display = "none"; }
    };