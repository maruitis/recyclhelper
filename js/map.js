let mapInstance = null;

// ── Venue type display config ────────────────────────────────────────────────
const VENUE_TYPES = {
    recycling:    { label: 'Recycling Point',         color: '#4caf82', icon: '♻'  },
    charity:      { label: 'Charity / Donation',      color: '#7b1fa2', icon: '🏪' },
    shelter:      { label: 'Shelter / Donation',      color: '#ab47bc', icon: '🏠' },
    secondhand:   { label: 'Buys Your Items',         color: '#f57c00', icon: '💰' },
    pawnshop:     { label: 'Pawnshop',                color: '#e65100', icon: '🏦' },
    repair:       { label: 'Repair / Buy-back',       color: '#0288d1', icon: '🔧' },
    hazardous:    { label: 'Hazardous Waste Centre',  color: '#c62828', icon: '⚠'  },
    library:      { label: 'Library / Paper Drop',    color: '#388e3c', icon: '📚' },
    bottle_return:{ label: 'Bottle Return',           color: '#00838f', icon: '🍾' },
};

// ── Map item name → query group ──────────────────────────────────────────────
const ITEM_GROUP_MAP = {
    'plastic bottle':  'plastic',
    'plastic box':     'plastic',
    'glass bottle':    'glass',
    'glass jar':       'glass',
    'tin can':         'metal',
    'book':            'paper',
    'newspaper':       'paper',
    'paper':           'paper',
    'cardboard box':   'paper',
    'sweater':         'textile_clothes',
    'jeans':           'textile_clothes',
    'shirts':          'textile_clothes',
    'shoes':           'textile_shoes',
    'house textile':   'textile_home',
    'wooden furniture':'furniture',
    'laptop':          'electronics',
    'mobile phone':    'electronics',
    'batteries':       'batteries',
    'light bulb':      'hazardous',
    'pens':            'plastic',
    'pencils':         'paper',
};

// ── Build item-specific Overpass query ───────────────────────────────────────
function buildItemOverpassQuery(itemName, lat, lon) {
    const group = ITEM_GROUP_MAP[itemName] || 'general';
    const ar = `(around:5000,${lat},${lon})`;

    const CLAUSES = {

        plastic: [
            `node["amenity"="recycling"]["recycling:plastic"="yes"]${ar}`,
            `node["amenity"="recycling"]["recycling:plastic_bottles"="yes"]${ar}`,
            `node["amenity"="recycling"]["recycling:plastic_packaging"="yes"]${ar}`,
            `node["recycling_type"="centre"]${ar}`,
            `node["vending"="bottle_return"]${ar}`,
            `way["amenity"="recycling"]["recycling:plastic"="yes"]${ar}`,
            `way["recycling_type"="centre"]${ar}`,
            `relation["amenity"="recycling"]${ar}`,
        ],

        glass: [
            `node["amenity"="recycling"]["recycling:glass"="yes"]${ar}`,
            `node["amenity"="recycling"]["recycling:glass_bottles"="yes"]${ar}`,
            `node["recycling_type"="centre"]${ar}`,
            `node["vending"="bottle_return"]${ar}`,
            `way["amenity"="recycling"]["recycling:glass"="yes"]${ar}`,
            `way["recycling_type"="centre"]${ar}`,
        ],

        metal: [
            `node["amenity"="recycling"]["recycling:cans"="yes"]${ar}`,
            `node["amenity"="recycling"]["recycling:scrap_metal"="yes"]${ar}`,
            `node["amenity"="recycling"]["recycling:metal"="yes"]${ar}`,
            `node["recycling_type"="centre"]${ar}`,
            `way["amenity"="recycling"]["recycling:metal"="yes"]${ar}`,
            `way["amenity"="recycling"]["recycling:scrap_metal"="yes"]${ar}`,
            `way["recycling_type"="centre"]${ar}`,
        ],

        paper: [
            `node["amenity"="recycling"]["recycling:paper"="yes"]${ar}`,
            `node["amenity"="recycling"]["recycling:cardboard"="yes"]${ar}`,
            `node["amenity"="recycling"]["recycling:books"="yes"]${ar}`,
            `node["amenity"="recycling"]["recycling:magazines"="yes"]${ar}`,
            `node["recycling_type"="centre"]${ar}`,
            `node["amenity"="library"]${ar}`,
            `node["shop"="books"]["second_hand"="yes"]${ar}`,
            `node["shop"="second_hand"]["books"="yes"]${ar}`,
            `node["shop"="charity"]${ar}`,
            `way["amenity"="recycling"]["recycling:paper"="yes"]${ar}`,
            `way["amenity"="recycling"]["recycling:cardboard"="yes"]${ar}`,
            `way["recycling_type"="centre"]${ar}`,
            `way["shop"="charity"]${ar}`,
            `way["amenity"="library"]${ar}`,
        ],

        textile_clothes: [
            `node["amenity"="recycling"]["recycling:clothes"="yes"]${ar}`,
            `node["amenity"="recycling"]["recycling:textiles"="yes"]${ar}`,
            `node["amenity"="recycling"]["recycling:shoes"="yes"]${ar}`,
            `node["recycling_type"="centre"]${ar}`,
            `node["shop"="charity"]${ar}`,
            `node["shop"="clothes"]["second_hand"="yes"]${ar}`,
            `node["shop"="second_hand"]${ar}`,
            `node["shop"="vintage"]${ar}`,
            `node["shop"="consignment"]${ar}`,
            `node["amenity"="animal_shelter"]${ar}`,
            `node["social_facility"="shelter"]${ar}`,
            `node["social_facility"="clothing_bank"]${ar}`,
            `node["amenity"="social_facility"]["social_facility"="shelter"]${ar}`,
            `way["amenity"="recycling"]["recycling:clothes"="yes"]${ar}`,
            `way["amenity"="recycling"]["recycling:textiles"="yes"]${ar}`,
            `way["shop"="charity"]${ar}`,
            `way["shop"="second_hand"]${ar}`,
            `way["recycling_type"="centre"]${ar}`,
        ],

        textile_shoes: [
            `node["amenity"="recycling"]["recycling:shoes"="yes"]${ar}`,
            `node["amenity"="recycling"]["recycling:clothes"="yes"]${ar}`,
            `node["amenity"="recycling"]["recycling:textiles"="yes"]${ar}`,
            `node["recycling_type"="centre"]${ar}`,
            `node["shop"="charity"]${ar}`,
            `node["shop"="shoes"]["second_hand"="yes"]${ar}`,
            `node["shop"="second_hand"]${ar}`,
            `node["social_facility"="shelter"]${ar}`,
            `node["social_facility"="clothing_bank"]${ar}`,
            `way["amenity"="recycling"]["recycling:shoes"="yes"]${ar}`,
            `way["amenity"="recycling"]["recycling:clothes"="yes"]${ar}`,
            `way["shop"="charity"]${ar}`,
            `way["recycling_type"="centre"]${ar}`,
        ],

        textile_home: [
            `node["amenity"="recycling"]["recycling:textiles"="yes"]${ar}`,
            `node["amenity"="recycling"]["recycling:clothes"="yes"]${ar}`,
            `node["recycling_type"="centre"]${ar}`,
            `node["shop"="charity"]${ar}`,
            `node["amenity"="animal_shelter"]${ar}`,
            `node["social_facility"="shelter"]${ar}`,
            `node["social_facility"="clothing_bank"]${ar}`,
            `way["amenity"="recycling"]["recycling:textiles"="yes"]${ar}`,
            `way["amenity"="recycling"]["recycling:clothes"="yes"]${ar}`,
            `way["shop"="charity"]${ar}`,
            `way["recycling_type"="centre"]${ar}`,
        ],

        furniture: [
            `node["amenity"="recycling"]["recycling:furniture"="yes"]${ar}`,
            `node["amenity"="recycling"]["recycling:wood"="yes"]${ar}`,
            `node["recycling_type"="centre"]${ar}`,
            `node["shop"="charity"]${ar}`,
            `node["shop"="furniture"]["second_hand"="yes"]${ar}`,
            `node["shop"="second_hand"]["furniture"="yes"]${ar}`,
            `node["shop"="second_hand"]${ar}`,
            `node["shop"="pawnbroker"]${ar}`,
            `node["shop"="antiques"]${ar}`,
            `way["recycling_type"="centre"]${ar}`,
            `way["shop"="charity"]${ar}`,
            `way["shop"="pawnbroker"]${ar}`,
            `way["shop"="second_hand"]${ar}`,
        ],

        electronics: [
            `node["amenity"="recycling"]["recycling:electronics"="yes"]${ar}`,
            `node["amenity"="recycling"]["recycling:small_appliances"="yes"]${ar}`,
            `node["amenity"="recycling"]["recycling:computers"="yes"]${ar}`,
            `node["amenity"="recycling"]["recycling:electrical_appliances"="yes"]${ar}`,
            `node["recycling_type"="centre"]${ar}`,
            `node["repair"="electronics"]${ar}`,
            `node["craft"="electronics_repair"]${ar}`,
            `node["shop"="electronics"]["repair"="yes"]${ar}`,
            `node["shop"="mobile_phone"]["repair"="yes"]${ar}`,
            `node["shop"="computer_repair"]${ar}`,
            `node["shop"="pawnbroker"]${ar}`,
            `node["shop"="second_hand"]["electronics"="yes"]${ar}`,
            `node["shop"="electronics"]["second_hand"="yes"]${ar}`,
            `node["shop"="charity"]${ar}`,
            `way["amenity"="recycling"]["recycling:electronics"="yes"]${ar}`,
            `way["recycling_type"="centre"]${ar}`,
            `way["shop"="pawnbroker"]${ar}`,
            `way["shop"="electronics"]${ar}`,
        ],

        batteries: [
            `node["amenity"="recycling"]["recycling:batteries"="yes"]${ar}`,
            `node["amenity"="recycling"]["recycling:small_appliances"="yes"]${ar}`,
            `node["recycling_type"="centre"]${ar}`,
            `node["amenity"="waste_disposal"]["waste"="hazardous"]${ar}`,
            `node["amenity"="waste_disposal"]["waste"="batteries"]${ar}`,
            `node["amenity"="waste_disposal"]["recycling:batteries"="yes"]${ar}`,
            `node["hazmat"="yes"]${ar}`,
            `way["amenity"="recycling"]["recycling:batteries"="yes"]${ar}`,
            `way["recycling_type"="centre"]${ar}`,
            `way["amenity"="waste_disposal"]${ar}`,
        ],

        hazardous: [
            `node["amenity"="recycling"]["recycling:light_bulbs"="yes"]${ar}`,
            `node["amenity"="recycling"]["recycling:fluorescent_tubes"="yes"]${ar}`,
            `node["amenity"="recycling"]["recycling:batteries"="yes"]${ar}`,
            `node["amenity"="recycling"]["recycling:electrical_appliances"="yes"]${ar}`,
            `node["recycling_type"="centre"]${ar}`,
            `node["amenity"="waste_disposal"]["waste"="hazardous"]${ar}`,
            `node["amenity"="waste_disposal"]["waste"="electrical"]${ar}`,
            `node["hazmat"="yes"]${ar}`,
            `way["recycling_type"="centre"]${ar}`,
            `way["amenity"="waste_disposal"]${ar}`,
        ],

        general: [
            `node["amenity"="recycling"]${ar}`,
            `node["recycling_type"="centre"]${ar}`,
            `node["amenity"="waste_disposal"]["waste"!="dog_excrement"]${ar}`,
            `way["amenity"="recycling"]${ar}`,
            `way["recycling_type"="centre"]${ar}`,
            `relation["amenity"="recycling"]${ar}`,
        ],
    };

    const clauses = CLAUSES[group] || CLAUSES.general;
    return `[out:json][timeout:30];\n(\n${clauses.map(c => `  ${c};`).join('\n')}\n);\nout center tags;`;
}

// ── Determine venue type from OSM tags ───────────────────────────────────────
function getVenueType(tags) {
    if (!tags) return 'recycling';
    const s  = tags.shop    || '';
    const a  = tags.amenity || '';
    const sf = tags.social_facility || '';

    if (tags.hazmat === 'yes') return 'hazardous';
    if (a === 'waste_disposal' && (tags.waste === 'hazardous' || tags.waste === 'batteries' || tags.waste === 'electrical')) return 'hazardous';
    if (s === 'pawnbroker') return 'pawnshop';
    if (tags.vending === 'bottle_return') return 'bottle_return';
    if (a === 'library') return 'library';
    if (a === 'animal_shelter') return 'shelter';
    if (sf === 'shelter' || sf === 'clothing_bank') return 'shelter';
    if (tags.repair === 'electronics' || tags.craft === 'electronics_repair' ||
        (s === 'electronics' && tags.repair === 'yes') ||
        s === 'computer_repair' ||
        (s === 'mobile_phone' && tags.repair === 'yes')) return 'repair';
    if (s === 'second_hand' || s === 'vintage' || s === 'consignment' || tags.second_hand === 'yes') return 'secondhand';
    if (s === 'charity') return 'charity';
    if (a === 'waste_disposal') return 'hazardous';
    return 'recycling';
}

// ── Get current item from URL or localStorage ────────────────────────────────
function getCurrentItem() {
    try {
        const params = new URLSearchParams(window.location.search);
        return (params.get('item') || localStorage.getItem('currentItem') || '').toLowerCase();
    } catch (_) { return ''; }
}

// ── Default map shown behind the blur overlay ────────────────────────────────
function initDefaultMap() {
    const mapDiv = document.getElementById('map');
    if (!mapDiv || mapInstance) return;
    mapInstance = L.map('map', { zoomControl: false, attributionControl: false })
        .setView([56.9460, 24.1059], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(mapInstance);
}

// ── Reveal map (slide overlay down) ─────────────────────────────────────────
function revealMap() {
    const overlay = document.getElementById('mapOverlay');
    if (overlay) overlay.classList.add('revealed');
    setTimeout(() => { if (mapInstance) mapInstance.invalidateSize(); }, 580);
}

// ── Haversine straight-line distance (km) ────────────────────────────────────
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
    return raw
        .replace(/Mo/g, 'Mon').replace(/Tu/g, 'Tue').replace(/We/g, 'Wed')
        .replace(/Th/g, 'Thu').replace(/Fr/g, 'Fri').replace(/Sa/g, 'Sat')
        .replace(/Su/g, 'Sun').replace(/PH/g, 'Public holidays').replace(/off/g, 'closed');
}

// ── Build popup HTML ─────────────────────────────────────────────────────────
function buildPopup(index, name, walkDist, tags, venueType) {
    const vt = VENUE_TYPES[venueType] || VENUE_TYPES.recycling;

    const accepts = Object.keys(tags || {})
        .filter(k => k.startsWith('recycling:') && tags[k] === 'yes')
        .map(k => k.replace('recycling:', '').replace(/_/g, ' '))
        .join(', ');

    const hours   = fmtHours(tags?.opening_hours);
    const phone   = tags?.phone || tags?.['contact:phone'];
    const website = tags?.website || tags?.['contact:website'];
    const addr    = [tags?.['addr:street'], tags?.['addr:housenumber']].filter(Boolean).join(' ');
    const operator = tags?.operator;

    let html = `<b style="font-size:13px">${index}. ${name}</b>`;
    html += `<br><span style="background:${vt.color};color:#fff;padding:1px 7px;border-radius:8px;font-size:11px">${vt.icon} ${vt.label}</span>`;

    if (addr)     html += `<br><span style="color:#555">📍 ${addr}</span>`;
    if (operator) html += `<br><span style="color:#555">🏢 ${operator}</span>`;

    html += `<br><span style="color:#2a7a2a;font-weight:600">🚶 ${fmtDist(walkDist)} walking</span>`;

    if (hours) html += `<br><span style="color:#7a5a00">🕐 ${hours}</span>`;
    else       html += `<br><span style="color:#aaa;font-size:11px">Hours: not listed</span>`;

    if (accepts) html += `<br><small style="color:#444">♻ Accepts: ${accepts}</small>`;
    if (phone)   html += `<br><small>📞 ${phone}</small>`;
    if (website) html += `<br><small>🌐 <a href="${website}" target="_blank" rel="noopener">website</a></small>`;

    return html;
}

// ── Fetch real walking distances via OSRM ────────────────────────────────────
async function getWalkingDistances(userLat, userLon, points) {
    const coords = [[userLon, userLat], ...points.map(p => [p.lon, p.lat])]
        .map(c => `${c[0]},${c[1]}`).join(';');
    try {
        const url = `https://router.project-osrm.org/table/v1/foot/${coords}?sources=0&annotations=distance`;
        const res  = await fetch(url);
        const data = await res.json();
        if (data.code === 'Ok' && data.distances?.[0]) {
            return data.distances[0].slice(1);
        }
    } catch (_) {}
    return points.map(p => haversine(userLat, userLon, p.lat, p.lon) * 1350);
}


// ── Friendly name from OSM tags ──────────────────────────────────────────────
function nameFromTags(tags) {
    return tags.name
        || tags.operator
        || (tags.recycling_type === 'centre'         ? 'Recycling Centre'   : null)
        || (tags.vending        === 'bottle_return'  ? 'Bottle Return'      : null)
        || (tags.shop           === 'charity'        ? 'Charity Shop'       : null)
        || (tags.shop           === 'pawnbroker'     ? 'Pawnshop'           : null)
        || (tags.shop           === 'second_hand'    ? 'Second-hand Shop'   : null)
        || (tags.shop           === 'vintage'        ? 'Vintage Shop'       : null)
        || (tags.amenity        === 'library'        ? 'Library'            : null)
        || (tags.amenity        === 'animal_shelter' ? 'Animal Shelter'     : null)
        || (tags.social_facility === 'shelter'       ? 'Homeless Shelter'   : null)
        || (tags.social_facility === 'clothing_bank' ? 'Clothing Bank'      : null)
        || (tags.repair         === 'electronics'    ? 'Electronics Repair' : null)
        || (tags.craft          === 'electronics_repair' ? 'Electronics Repair' : null)
        || (tags.amenity        === 'waste_disposal' ? 'Hazardous Waste'    : null)
        || (tags.amenity        === 'recycling'      ? 'Recycling Point'    : null)
        || 'Drop-off Point';
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

        // 2. Build item-aware Overpass query
        const itemName = getCurrentItem();
        const overpassQuery = buildItemOverpassQuery(itemName, userLat, userLon);

        // Update heading
        const heading = document.getElementById('mapHeading');
        if (heading) {
            const display = itemName
                ? `Top 5 places for: ${itemName.charAt(0).toUpperCase() + itemName.slice(1)}`
                : 'Top 5 closest recycling points';
            heading.textContent = display;
        }

        // 3. Query Overpass
        const overpassRes = await fetch('https://overpass-api.de/api/interpreter', {
            method: 'POST',
            body: 'data=' + encodeURIComponent(overpassQuery)
        });
        const overpassData = await overpassRes.json();

        // 4. Normalise elements (ways/relations have a `center` object)
        const elements = (overpassData.elements || []).map(el => {
            if (el.type === 'way' || el.type === 'relation') {
                return { ...el, lat: el.center?.lat, lon: el.center?.lon };
            }
            return el;
        }).filter(el => el.lat != null && el.lon != null);

        // 5. Deduplicate by OSM id
        const seen = new Set();
        const unique = elements.filter(el => {
            const key = `${el.type}-${el.id}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });

        // 6. Sort by straight-line distance, keep top 12 candidates
        const sorted = unique
            .map(el => ({ ...el, _straight: haversine(userLat, userLon, el.lat, el.lon) }))
            .sort((a, b) => a._straight - b._straight)
            .slice(0, 12);

        // 7. Get real walking distances via OSRM
        const walkMetres = await getWalkingDistances(userLat, userLon, sorted);

        // 8. Re-sort by walking distance, keep closest 5
        const nodes = sorted
            .map((n, i) => ({ ...n, walkDist: walkMetres[i] ?? n._straight * 1350 }))
            .sort((a, b) => a.walkDist - b.walkDist)
            .slice(0, 5);

        // 9. Rebuild map
        if (mapInstance) { mapInstance.remove(); mapInstance = null; }
        mapInstance = L.map('map').setView([userLat, userLon], 15);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 19
        }).addTo(mapInstance);

        // User location marker
        const userIcon = L.divIcon({
            html: `<div style="width:14px;height:14px;background:#3a9ec4;border:3px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.35)"></div>`,
            iconSize: [14, 14], iconAnchor: [7, 7], className: ''
        });
        L.marker([userLat, userLon], { icon: userIcon })
            .addTo(mapInstance)
            .bindPopup('<b>📍 Your location</b>')
            .openPopup();

        if (nodes.length === 0) {
            L.popup()
                .setLatLng([userLat, userLon])
                .setContent(`<b>No specific drop-off points found within 5 km.</b><br>Try a different address or check with your local municipality website.`)
                .openOn(mapInstance);
        } else {
            nodes.forEach((n, i) => {
                const tags       = n.tags || {};
                const venueType  = getVenueType(tags);
                const vt         = VENUE_TYPES[venueType] || VENUE_TYPES.recycling;
                const name       = nameFromTags(tags);

                const markerIcon = L.divIcon({
                    html: `<div style="width:30px;height:30px;background:${vt.color};border:3px solid white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 3px 10px rgba(0,0,0,0.25)">${vt.icon}</div>`,
                    iconSize: [30, 30], iconAnchor: [15, 15], className: ''
                });

                L.marker([n.lat, n.lon], { icon: markerIcon })
                    .addTo(mapInstance)
                    .bindPopup(buildPopup(i + 1, name, n.walkDist, tags, venueType), { maxWidth: 290 });
            });

            const allPts = [[userLat, userLon], ...nodes.map(n => [n.lat, n.lon])];
            mapInstance.fitBounds(allPts, { padding: [40, 40] });
        }

        revealMap();

    } catch (err) {
        console.error('Map error:', err);
        alert('Could not load drop-off points. Please check your connection and try again.');
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
