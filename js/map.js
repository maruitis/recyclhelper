function initMap() {
    const map = L.map('map').setView([56.9496, 24.1052], 12); // Default to Riga

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    // Mock markers for "recycling points"
    const points = [
        [56.95, 24.11], [56.96, 24.09], [56.94, 24.12]
    ];

    points.forEach(p => L.marker(p).addTo(map));
}

window.onload = initMap;