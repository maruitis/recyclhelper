let mapInstance = null;

// ── Default map shown behind the blur overlay ────────────────────────────────
function initDefaultMap() {
    const mapDiv = document.getElementById('map');
    if (!mapDiv || mapInstance) return;
    mapInstance = L.map('map', { zoomControl: false, attributionControl: false })
        .setView([56.946, 24.106], 12);   // Riga as default view
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
    }).addTo(mapInstance);
}

// ── Reveal map (slide overlay down) ─────────────────────────────────────────
function revealMap() {
    const overlay = document.getElementById('mapOverlay');
    if (overlay) overlay.classList.add('revealed');
    // Let map repaint after the CSS transition finishes
    setTimeout(() => { if (mapInstance) mapInstance.invalidateSize(); }, 580);
}

// ── Main search function ─────────────────────────────────────────────────────
async function findCenters() {
    const addressInput = document.getElementById('addressInput');
    const address = addressInput ? addressInput.value.trim() : '';

    if (!address) {
        if (addressInput) {
            addressInput.style.borderColor = 'rgba(255,80,80,0.8)';
            addressInput.placeholder = 'Please enter your address first';
            setTimeout(() => {
                addressInput.style.borderColor = '';
                addressInput.placeholder = 'Enter your address...';
            }, 2000);
        }
        return;
    }

    const btn = document.querySelector('.map-find-btn');
    if (btn) { btn.textContent = 'Searching…'; btn.disabled = true; }

    try {
        // Geocode address
        const geoRes = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`,
            { headers: { 'Accept-Language': 'en' } }
        );
        const geoData = await geoRes.json();

        if (!geoData.length) {
            alert('Address not found. Please try a more specific address.');
            if (btn) { btn.textContent = 'Find Points'; btn.disabled = false; }
            return;
        }

        const lat = parseFloat(geoData[0].lat);
        const lon = parseFloat(geoData[0].lon);

        // Query nearby recycling points within 5 km
        const overpassQuery = `
          [out:json][timeout:15];
          (
            node["amenity"="recycling"](around:5000,${lat},${lon});
            node["amenity"="waste_disposal"](around:5000,${lat},${lon});
            node["recycling_type"="centre"](around:5000,${lat},${lon});
          );
          out 20;`;

        const overpassRes = await fetch('https://overpass-api.de/api/interpreter', {
            method: 'POST',
            body: 'data=' + encodeURIComponent(overpassQuery)
        });
        const overpassData = await overpassRes.json();

        // Haversine distance helper
        function dist(a, b, c, d) {
            const R = 6371;
            const dLat = (c - a) * Math.PI / 180;
            const dLon = (d - b) * Math.PI / 180;
            const x = Math.sin(dLat / 2) ** 2 +
                Math.cos(a * Math.PI / 180) * Math.cos(c * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
            return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
        }

        const nodes = (overpassData.elements || [])
            .map(n => ({ ...n, distance: dist(lat, lon, n.lat, n.lon) }))
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 5);

        // Rebuild map at the searched location
        const mapDiv = document.getElementById('map');
        if (!mapDiv) return;

        if (mapInstance) { mapInstance.remove(); mapInstance = null; }
        mapInstance = L.map('map').setView([lat, lon], 14);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(mapInstance);

        // User location marker
        const userIcon = L.divIcon({
            html: `<div style="width:14px;height:14px;background:#3a9ec4;border:3px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>`,
            iconSize: [14, 14], iconAnchor: [7, 7], className: ''
        });
        L.marker([lat, lon], { icon: userIcon }).addTo(mapInstance)
            .bindPopup('<b>📍 Your location</b>').openPopup();

        // Recycling point markers
        const recycleIcon = L.divIcon({
            html: `<div style="width:28px;height:28px;background:#4caf82;border:3px solid white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 3px 10px rgba(0,0,0,0.2)">♻</div>`,
            iconSize: [28, 28], iconAnchor: [14, 14], className: ''
        });

        if (nodes.length === 0) {
            L.popup().setLatLng([lat, lon])
                .setContent('<b>No recycling points found nearby.</b><br>Try a wider search or check your local council website.')
                .openOn(mapInstance);
        } else {
            nodes.forEach((n, i) => {
                const name = n.tags?.name || (n.tags?.['recycling:glass'] ? 'Recycling Point' : (n.tags?.amenity || 'Recycling Centre'));
                const types = Object.keys(n.tags || {})
                    .filter(k => k.startsWith('recycling:') && n.tags[k] === 'yes')
                    .map(k => k.replace('recycling:', ''))
                    .join(', ');
                L.marker([n.lat, n.lon], { icon: recycleIcon }).addTo(mapInstance)
                    .bindPopup(`<b>${i + 1}. ${name}</b><br>${(n.distance * 1000).toFixed(0)}m away${types ? '<br><small>Accepts: ' + types + '</small>' : ''}`);
            });
            const allPts = [[lat, lon], ...nodes.map(n => [n.lat, n.lon])];
            mapInstance.fitBounds(allPts, { padding: [30, 30] });
        }

        // Slide overlay off, reveal full map
        revealMap();

    } catch (err) {
        console.error('Map error:', err);
        alert('Could not load recycling points. Please check your connection and try again.');
    } finally {
        if (btn) { btn.textContent = 'Find Points'; btn.disabled = false; }
    }
}

// ── Init on load ─────────────────────────────────────────────────────────────
(function () {
    function boot() {
        initDefaultMap();
        const input = document.getElementById('addressInput');
        if (input) {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') { e.preventDefault(); findCenters(); }
            });
        }
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        setTimeout(boot, 80); // small delay ensures Leaflet tiles are ready
    }
})();
