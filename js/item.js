// item.js - The UI Controller

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Get the search term from the URL (e.g., ?query=plastic+bottle)
    const params = new URLSearchParams(window.location.search);
    const query = params.get('query');
    const detailSelect = document.getElementById('detailToggle');
    
    if (!query) {
        alert("No item searched!");
        return;
    }

    // Update the search bar on the item page to show what we're looking at
    if(document.getElementById('itemSearchInput')) {
        document.getElementById('itemSearchInput').value = query;
    }

    // Function to fetch and display data
   async function loadData(specificDetail = "standard") {
    try {
        const response = await fetch("http://localhost:3000/api/recycle", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: query, detail: specificDetail })
        });

        const result = await response.json();

        // CHECK: Does choices[0] exist?
        if (result && result.choices && result.choices[0]) {
            const content = result.choices[0].message.content.replace(/```json/g, "").replace(/```/g, "").trim();
            const cleanData = JSON.parse(content);
            renderUI(cleanData);
        } else {
            console.error("Unexpected Data Format:", result);
            document.getElementById('lifehacksContent').innerText = "AI error: " + (result.error || "Unknown error");
        }
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

    // 2. Initial Load
    await loadData();

    // 3. Update when the user changes a detail (e.g., "With cap")
    if (detailSelect) {
        detailSelect.addEventListener('change', (e) => {
            loadData(e.target.value);
        });
    }
});

function renderUI(data) {
    // --- Materials Section ---
    const mContainer = document.getElementById('materialsContainer');
    mContainer.innerHTML = ''; 
    data.materials.forEach(m => {
        mContainer.innerHTML += `
            <div class="material-card">
                <div class="recycle-icon">♻️ ${m.abbr}</div>
                <h4>${m.name}</h4>
                <p><small>Use: ${m.use}</small></p>
                <p><small>Feel: ${m.props}</small></p>
            </div>`;
    });

    // --- Lifehacks Section ---
    document.getElementById('lifehacksContent').innerText = data.lifehacks;

    // --- DIY Section ---
    const diyContainer = document.getElementById('diyContainer');
    diyContainer.innerHTML = '';
    data.diy.forEach(d => {
        diyContainer.innerHTML += `
            <div class="diy-card">
                <h5>${d.title}</h5>
                <p><strong>Needs:</strong> ${d.mats}</p>
                <p>${d.steps}</p>
            </div>`;
    });

    // --- Calculator Section ---
    const qtyInput = document.getElementById('calcQty');
    const updateStats = () => {
        const amt = qtyInput.value || 1;
        document.getElementById('saveWater').innerText = (amt * data.stats.water).toFixed(1);
        document.getElementById('saveEnergy').innerText = (amt * data.stats.energy).toFixed(1);
        document.getElementById('saveCO2').innerText = (amt * data.stats.co2).toFixed(1);
    };

    // Remove old listeners to prevent double-counting
    qtyInput.oninput = updateStats;
    updateStats(); 
}