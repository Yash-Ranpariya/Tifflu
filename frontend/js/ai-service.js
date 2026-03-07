export class AIService {
    constructor() {
        this.apiKey = localStorage.getItem('gemini_api_key') || '';
    }

    setApiKey(key) {
        this.apiKey = key;
        localStorage.setItem('gemini_api_key', key);
    }

    hasApiKey() {
        return !!this.apiKey && this.apiKey.trim().length > 0;
    }

    async getAIResponse(prompt) {
        if (!this.hasApiKey()) {
            return "API Key not found. Please set your Gemini API key.";
        }

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                return `Error: ${errorData.error?.message || response.statusText}`;
            }

            const data = await response.json();
            return data.candidates[0].content.parts[0].text;
        } catch (e) {
            return `Error connecting to AI: ${e.message}`;
        }
    }

    async suggestFoodByMood(mood, menuItems) {
        if (!this.hasApiKey()) {
            throw new Error("No API Key");
        }

        const prompt = `You are TiFFLu AI Food Recommender. The user is feeling: "${mood}". 
Based on this mood, select the best 1 to 3 menu items from the following json list.
Respond ONLY with a JSON array of the chosen item IDs (numbers/strings). 
Example response: [1, 5] or ["itm-1"]. Do not include any other text or markdown tags like \`\`\`json.
Menu Items Available (id, name, description):
${JSON.stringify(menuItems.map(i => ({ id: i.id, name: i.name, desc: i.description })))}`;

        try {
            const text = await this.getAIResponse(prompt);
            console.log("Raw AI Response for Mood:", text);

            // Clean up the text if Gemini returns markdown tags anyway
            const cleanText = text.replace(/```json/gi, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(cleanText);

            if (Array.isArray(parsed)) {
                return parsed;
            }
            return [];
        } catch (e) {
            console.error("AI parsing error", e);
            throw e;
        }
    }
}

export const aiService = new AIService();
