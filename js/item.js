window.onload = async () => {
    const itemToFind = localStorage.getItem('currentUserSearch');
    if (!itemToFind) return;

    const data = await fetchItemData(itemToFind);
    if (!data) return;

    // 1. Fill Identity & Details
    document.getElementById('item-name').innerText = data.fullName;
    document.getElementById('material-type').innerText = data.material;
    document.getElementById('item-feel').innerText = data.feel;

    // 2. Update Efficiency Calculator
    document.getElementById('water-val').innerText = `${data.savings.water}L`;
    document.getElementById('energy-val').innerText = `${data.savings.energy}kWh`;
    document.getElementById('co2-val').innerText = `${data.savings.co2}kg`;

    // 3. Populate DIY Section
    const diyGrid = document.getElementById('diy-container');
    diyGrid.innerHTML = data.diy.map(idea => `
        <div class="diy-card">
            <h4>${idea.name}</h4>
            <p><strong>Needs:</strong> ${idea.materials}</p>
            <ol>${idea.steps.map(step => `<li>${step}</li>`).join('')}</ol>
        </div>
    `).join('');

    // 4. Recycling Advice
    document.getElementById('advice-box').innerText = data.recyclingAdvice;
};
