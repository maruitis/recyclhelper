document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const itemName = params.get('item')?.toLowerCase();
    const data = itemDatabase[itemName];

    if (!data) return;

    document.getElementById('displayItemName').innerText = itemName.toUpperCase();
    document.getElementById('detailQuestion').innerText = data.detail;

    const grid = document.getElementById('materialGrid');
    const materials = materialGroups[data.group];

    materials.forEach(m => {
        const card = document.createElement('div');
        card.className = 'material-card';
        card.innerHTML = `<h3>${m.name}</h3><small>${m.abbr}</small><p>Use: ${m.use}</p><p>Feel: ${m.feel}</p>`;
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