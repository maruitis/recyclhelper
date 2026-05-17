let mapInstance = null;

// ── Default map shown behind the blur overlay ────────────────────────────────
function initDefaultMap() {
    const mapDiv = document.getElementById('map');
    if (!mapDiv || mapInstance) return;
    mapInstance = L.map('map', { zoomControl: false, attributionControl: false })
        .setView([56.9460, 24.1059], 13);   // Riga centre
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
    }).addTo(mapInstance);
}

// ── Reveal map (slide overlay down) ─────────────────────────────────────────
function revealMap() {
    const overlay = document.getElementById('mapOverlay');
    if (overlay) overlay.classList.add('revealed');
    setTimeout(() => { if (mapInstance) mapInstance.invalidateSize(); }, 580);
}

// ── Haversine straight-line distance (km) ───────────────────────────────────
function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ── Format metres nicely ─────────────────────────────────────────────────────
function fmtDist(metres) {
    if (metres < 1000) return `${Math.round(metres)} m`;
    return `${(metres / 1000).toFixed(1)} km`;
}

// ── Format opening hours ─────────────────────────────────────────────────────
function fmtHours(raw) {
    if (!raw) return null;
    // Common shorthand expansions
    return raw
        .replace(/Mo/g, 'Mon').replace(/Tu/g, 'Tue').replace(/We/g, 'Wed')
        .replace(/Th/g, 'Thu').replace(/Fr/g, 'Fri').replace(/Sa/g, 'Sat')
        .replace(/Su/g, 'Sun').replace(/PH/g, 'Public holidays')
        .replace(/off/g, 'closed');
}

// ── Build popup HTML ─────────────────────────────────────────────────────────
function buildPopup(index, name, walkDist, tags) {
    const accepts = Object.keys(tags || {})
        .filter(k => k.startsWith('recycling:') && tags[k] === 'yes')
        .map(k => k.replace('recycling:', '').replace(/_/g, ' '))
        .join(', ');

    const hours = fmtHours(tags?.opening_hours);
    const phone = tags?.phone || tags?.['contact:phone'];
    const website = tags?.website || tags?.['contact:website'];
    const addr = [tags?.['addr:street'], tags?.['addr:housenumber']]
        .filter(Boolean).join(' ');
    const operator = tags?.operator;

    let html = `<b style="font-size:13px">${index}. ${name}</b>`;

    if (addr) html += `<br><span style="color:#555">📍 ${addr}</span>`;
    if (operator) html += `<br><span style="color:#555">🏢 ${operator}</span>`;

    html += `<br><span style="color:#2a7a2a;font-weight:600">🚶 ${fmtDist(walkDist)} walking</span>`;

    if (hours) {
        html += `<br><span style="color:#7a5a00">🕐 ${hours}</span>`;
    } else {
        html += `<br><span style="color:#aaa;font-size:11px">Hours: not listed in OSM</span>`;
    }

    if (accepts) html += `<br><small style="color:#444">♻ Accepts: ${accepts}</small>`;
    if (phone)   html += `<br><small>📞 ${phone}</small>`;
    if (website) html += `<br><small>🌐 <a href="${website}" target="_blank" rel="noopener">website</a></small>`;

    return html;
}

// ── Fetch real walking distances via OSRM ────────────────────────────────────
async function getWalkingDistances(userLat, userLon, points) {
    // Build coordinate string: user first, then each point
    const coords = [[userLon, userLat], ...points.map(p => [p.lon, p.lat])]
        .map(c => `${c[0]},${c[1]}`).join(';');

    try {
        const url = `https://router.project-osrm.org/table/v1/foot/${coords}?sources=0&annotations=distance`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.code === 'Ok' && data.distances && data.distances[0]) {
            // distances[0][0] is user→user = 0, distances[0][1..N] are user→each point
            return data.distances[0].slice(1);
        }
    } catch (_) { /* fall through to haversine fallback */ }

    // Fallback: straight-line × 1.35 walking factor
    return points.map(p => haversine(userLat, userLon, p.lat, p.lon) * 1350);
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
    if (btn) { btn.textContent = '…'; btn.disabled = true; }

    try {
        // 1. Geocode address with Nominatim
        const geoRes = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1&addressdetails=1`,
            { headers: { 'Accept-Language': 'en' } }
        );
        const geoData = await geoRes.json();

        if (!geoData.length) {
            alert('Address not found. Please try a more specific address.');
            return;
        }

        const userLat = parseFloat(geoData[0].lat);
        const userLon = parseFloat(geoData[0].lon);

        // 2. Query Overpass for recycling/deposit nodes AND ways within 5 km
        const overpassQuery = `
[out:json][timeout:25];
(
  node["amenity"="recycling"](around:5000,${userLat},${userLon});
  node["recycling_type"="centre"](around:5000,${userLat},${userLon});
  node["amenity"="waste_disposal"]["waste"!="dog_excrement"](around:5000,${userLat},${userLon});
  node["vending"="bottle_return"](around:5000,${userLat},${userLon});
  way["amenity"="recycling"](around:5000,${userLat},${userLon});
  way["recycling_type"="centre"](around:5000,${userLat},${userLon});
  relation["amenity"="recycling"](around:5000,${userLat},${userLon});
);
out center tags;`;

        const overpassRes = await fetch('https://overpass-api.de/api/interpreter', {
            method: 'POST',
            body: 'data=' + encodeURIComponent(overpassQuery)
        });
        const overpassData = await overpassRes.json();

        // 3. Normalise elements (ways/relations have a `center` object)
        const elements = (overpassData.elements || []).map(el => {
            if (el.type === 'way' || el.type === 'relation') {
                return { ...el, lat: el.center?.lat, lon: el.center?.lon };
            }
            return el;
        }).filter(el => el.lat != null && el.lon != null);

        // 4. Sort by straight-line distance, keep top 8 candidates
        const sorted = elements
            .map(el => ({ ...el, _straight: haversine(userLat, userLon, el.lat, el.lon) }))
            .sort((a, b) => a._straight - b._straight)
            .slice(0, 8);

        // 5. Get real walking distances via OSRM
        const walkMetres = await getWalkingDistances(userLat, userLon, sorted);

        // 6. Re-sort by walking distance, keep closest 5
        const nodes = sorted
            .map((n, i) => ({ ...n, walkDist: walkMetres[i] ?? n._straight * 1350 }))
            .sort((a, b) => a.walkDist - b.walkDist)
            .slice(0, 5);

        // 7. Rebuild map
        if (mapInstance) { mapInstance.remove(); mapInstance = null; }
        mapInstance = L.map('map').setView([userLat, userLon], 15);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 19
        }).addTo(mapInstance);

        // User marker
        const userIcon = L.divIcon({
            html: `<div style="width:14px;height:14px;background:#3a9ec4;border:3px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.35)"></div>`,
            iconSize: [14, 14], iconAnchor: [7, 7], className: ''
        });
        L.marker([userLat, userLon], { icon: userIcon })
            .addTo(mapInstance)
            .bindPopup('<b>📍 Your location</b>')
            .openPopup();

        // Recycling markers
        const recycleIcon = L.divIcon({
            html: `<div style="width:28px;height:28px;background:#4caf82;border:3px solid white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 3px 10px rgba(0,0,0,0.22)">♻</div>`,
            iconSize: [28, 28], iconAnchor: [14, 14], className: ''
        });

        if (nodes.length === 0) {
            L.popup()
                .setLatLng([userLat, userLon])
                .setContent('<b>No recycling points found within 5 km.</b><br>Try a different address or check your local council website.')
                .openOn(mapInstance);
        } else {
            nodes.forEach((n, i) => {
                const tags = n.tags || {};
                const name = tags.name
                    || tags.operator
                    || (tags['recycling_type'] === 'centre' ? 'Recycling Centre' : null)
                    || (tags['vending'] === 'bottle_return' ? 'Bottle Return' : null)
                    || (tags['amenity'] === 'recycling' ? 'Recycling Point' : null)
                    || 'Recycling Point';

                L.marker([n.lat, n.lon], { icon: recycleIcon })
                    .addTo(mapInstance)
                    .bindPopup(buildPopup(i + 1, name, n.walkDist, tags), { maxWidth: 280 });
            });

            const allPts = [[userLat, userLon], ...nodes.map(n => [n.lat, n.lon])];
            mapInstance.fitBounds(allPts, { padding: [40, 40] });
        }

        revealMap();

    } catch (err) {
        console.error('Map error:', err);
        alert('Could not load recycling points. Please check your connection and try again.');
    } finally {
        if (btn) { btn.textContent = '🔍'; btn.disabled = false; }
    }
}

// ── Init on load ─────────────────────────────────────────────────────────────
(function () {
    function boot() {
        initDefaultMap();
        const input = document.getElementById('addressInput');
        if (input) {
            input.addEventListener('keydown', e => {
                if (e.key === 'Enter') { e.preventDefault(); findCenters(); }
            });
        }
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        setTimeout(boot, 80);
    }
})();
