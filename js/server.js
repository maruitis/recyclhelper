// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load your secret keys from a hidden .env file
dotenv.config();

const app = express();
app.use(cors()); // Allows your frontend to talk to this server
app.use(express.json());

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

app.post('/api/recycle', async (req, res) => {
    try {
        const { query, detail } = req.body;
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "google/gemini-2.0-flash-001",
                "messages": [{ "role": "user", "content": `Return ONLY a JSON object for recycling ${query} (${detail}). Keys: materials (4 items), lifehacks (string), diy (3 items), stats (water, energy, co2).` }]
            })
        });

        const data = await response.json();
        
        // Log this to your terminal so you can see what the AI actually said!
        console.log("AI Response:", JSON.stringify(data, null, 2));

        if (!data.choices || !data.choices[0]) {
            return res.status(500).json({ error: "AI returned no choices. Check API Key/Credits." });
        }

        res.json(data);
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Secure server running on http://localhost:${PORT}`));


