const API_KEY = "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";

async function getEcoData() {
    // 1. Get the item the user searched for from LocalStorage
    const searchTerm = localStorage.getItem('userSearch') || "Plastic Bottle";
    document.getElementById('display-item-name').innerText = searchTerm.toUpperCase();

    // 2. The "Mega-Prompt" to force AI to give structured data
    const prompt = `Act as a professional recycling and DIY expert. 
    For the item: "${searchTerm}", return ONLY a JSON object with:
    {
        "fullName": "Proper name of the item",
        "material": "Primary material (e.g. PET, Aluminum, Cardboard)",
        "feel": "Describe how it feels (e.g. Smooth, Cold, Grainy)",
        "water": 45, "energy": 12, "co2": 1.5,
        "advice": "Prep instructions for container vs deposit point",
        "diy": [
            {"name": "Idea 1", "mats": "list materials", "steps": ["step1", "step2", "step3", "step4", "step5"]},
            {"name": "Idea 2", "mats": "list materials", "steps": ["step1", "step2", "step3", "step4", "step5"]},
            {"name": "Idea 3", "mats": "list materials", "steps": ["step1", "step2", "step3", "step4", "step5"]}
        ]
    }`;

    try {
        const response = await fetch("https://openrouter.ai", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "google/gemini-2.0-flash-001", 
                "messages": [{ "role": "user", "content": prompt }]
            })
        });

        const rawData = await response.json();
        const data = JSON.parse(rawData.choices[0].message.content);

        // 3. Inject AI data into the HTML
        document.getElementById('full-name').innerText = data.fullName;
        document.getElementById('material-type').innerText = data.material;
        document.getElementById('item-feel').innerText = data.feel;
        document.getElementById('advice-text').innerText = data.advice;
        
        // Stats
        document.getElementById('water-val').innerText = data.water;
        document.getElementById('energy-val').innerText = data.energy;
        document.getElementById('co2-val').innerText = data.co2;

        // DIY Cards
        const diyContainer = document.getElementById('diy-container');
        diyContainer.innerHTML = data.diy.map(idea => `
            <div class="glass-card diy-card">
                <h4>${idea.name}</h4>
                <p><strong>Tools:</strong> ${idea.mats}</p>
                <ol>
                    ${idea.steps.map(s => `<li>${s}</li>`).join('')}
                </ol>
            </div>
        `).join('');

    } catch (error) {
        console.error("AI Error:", error);
        document.getElementById('advice-text').innerText = "Error loading AI data. Please check API key.";
    }
}

// Run logic when page loads
window.onload = getEcoData;
