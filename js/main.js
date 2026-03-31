// Replace with your actual OpenRouter key
const OPENROUTER_API_KEY = "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";

async function fetchItemData(itemName) {
    // This prompt forces the AI to be your database for "any" item
    const prompt = `Act as a global recycling database. For the item "${itemName}", provide a JSON object with:
    1. "fullName": Scientific/Common name.
    2. "material": The most likely primary material (PET, Paper, Glass, Steel, etc).
    3. "feel": Describe the physical texture.
    4. "savings": { "water": liters saved per kg, "energy": kWh saved per kg, "co2": kg saved per kg }.
    5. "diy": 3 unique ideas each with "name", "materials", and "steps" (exactly 5 steps).
    6. "recyclingAdvice": How to prep it for a deposit point vs container.
    Return ONLY the JSON.`;

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "your-site-url.com", // Optional for OpenRouter rankings
                "X-OpenRouter-Title": "EcoRecycleApp"
            },
            body: JSON.stringify({
                model: "google/gemini-2.0-flash-001", // Fast and great for JSON
                messages: [{ role: "user", content: prompt }],
                response_format: { type: "json_object" } // Ensures clean data
            })
        });

        const result = await response.json();
        // Parse the AI's "brain" into your website
        return JSON.parse(result.choices[0].message.content);
    } catch (error) {
        console.error("AI Error:", error);
        return null;
    }
}
