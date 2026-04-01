document.addEventListener('DOMContentLoaded', () => {
    const itemName = localStorage.getItem('currentItem') || "plastic bottle";
    const itemData = itemDatabase[itemName];

    if (!itemData) return;

    // 1. FILL DIY CARDS
    const cards = [
        document.getElementById('diy-0'),
        document.getElementById('diy-1'),
        document.getElementById('diy-2')
    ];

    itemData.diys.forEach((project, index) => {
        if (cards[index]) {
            // Set Title inside card
            cards[index].innerHTML = `<span>${project.name}</span>`;
            
            // Set Click Event to open Modal
            cards[index].onclick = () => {
                showModal(project);
            };
        }
    });

    // 2. CALCULATOR LOGIC
    const qtyInput = document.getElementById('calcQty');
    const updateStats = () => {
        const qty = parseFloat(qtyInput.value) || 0;
        document.getElementById('saveWater').innerText = (qty * itemData.savings.water).toFixed(1);
        document.getElementById('saveEnergy').innerText = (qty * itemData.savings.energy).toFixed(1);
        document.getElementById('saveCO2').innerText = (qty * itemData.savings.co2).toFixed(1);
    };

    qtyInput.addEventListener('input', updateStats);
    updateStats(); // Run once to initialize
});

// MODAL FUNCTIONALITY
function showModal(project) {
    const modal = document.getElementById('diyModal');
    document.getElementById('modalTitle').innerText = project.name;
    document.getElementById('modalNeeds').innerText = project.needs;
    
    const stepsList = document.getElementById('modalSteps');
    stepsList.innerHTML = project.steps.map(s => `<li>${s}</li>`).join('');
    
    modal.style.display = "block";
}

function closeModal() {
    document.getElementById('diyModal').style.display = "none";
}

// Close modal if user clicks outside of the box
window.onclick = function(event) {
    const modal = document.getElementById('diyModal');
    if (event.target == modal) { modal.style.display = "none"; }
}