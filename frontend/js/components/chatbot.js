/**
 * TiFFLu AI Chatbot Component
 * A smart assistant backed by MULTIPLE internal databases.
 */

import { aiService } from '../ai-service.js';

export class ChatBot {
    constructor() {
        this.isOpen = false;
        this.messages = [
            { text: "Hello! I'm the <b>TiFFLu Mega-Bot</b>. 🤖📚<br>I have access to multiple food databases. Ask me anything!", isBot: true }
        ];

        // --- DATABASE 1: NUTRITION FACTS (Calories/Macros) ---
        this.nutritionDB = {
            'apple': '🍎 <b>Apple (1 medium):</b> 95 Calories | 0g Fat | 25g Carbs | 19g Sugar',
            'banana': '🍌 <b>Banana (1 medium):</b> 105 Calories | 0.4g Fat | 27g Carbs | 1.3g Protein',
            'egg': '🥚 <b>Egg (1 boiled):</b> 78 Calories | 5g Fat | 0.6g Carbs | 6g Protein',
            'chicken breast': '🍗 <b>Chicken Breast (100g):</b> 165 Calories | 3.6g Fat | 0g Carbs | 31g Protein',
            'rice': '🍚 <b>White Rice (1 cup cooked):</b> 205 Calories | 0.4g Fat | 45g Carbs | 4.3g Protein',
            'roti': '🫓 <b>Roti/Chapati (1 medium):</b> 104 Calories | 3g Fat | 17g Carbs | 3g Protein',
            'paneer': '🧀 <b>Paneer (100g):</b> 265 Calories | 20g Fat | 1.2g Carbs | 18g Protein',
            'dal': '🥣 <b>Dal Tadka (1 bowl):</b> 150-180 Calories | 6g Fat | 18g Carbs | 7g Protein',
            'pizza': '🍕 <b>Pizza (1 slice):</b> 285 Calories | 10g Fat | 36g Carbs | 12g Protein',
            'burger': '🍔 <b>Veg Burger:</b> 350-450 Calories | 15g Fat | 50g Carbs | 12g Protein',
            'cola': '🥤 <b>Coca Cola (330ml):</b> 140 Calories | 0g Fat | 39g Sugar | 0g Protein'
        };

        // --- DATABASE 2: CUISINE KNOWLEDGE (Descriptions) ---
        this.cuisineDB = {
            'dosa': '<b>Dosa:</b> South Indian crispy crepe made from fermented rice and lentil batter. Served with chutney and sambar.',
            'idli': '<b>Idli:</b> Steamed rice cakes from South India. Very healthy, low calorie, and fermented for gut health.',
            'biryani': '<b>Biryani:</b> Aromatic rice dish made with spices, saffron, and choice of veg/meat. The king of Indian foods! 👑',
            'pasta': '<b>Pasta:</b> Italian staple. Whole wheat pasta is best for health. White sauce is creamy (fatty), Red sauce is lighter.',
            'sushi': '<b>Sushi:</b> Japanese dish with vinegared rice and seafood. Rich in Omega-3 if made with Salmon.',
            'tacos': '<b>Tacos:</b> Mexican dish. Corn tortillas are gluten-free. Fill with beans and salsa for a healthy version.',
            'pav bhaji': '<b>Pav Bhaji:</b> Mumbai street food. Mashed spicy vegetables served with buttered bread rolls.',
            'chole bhature': '<b>Chole Bhature:</b> North Indian classic. Spicy chickpeas with fried bread. Delicious but heavy!'
        };

        // --- DATABASE 3: MEAL PLANS (Diet Strategies) ---
        this.planDB = {
            'keto': '<b>Keto Diet:</b> High Fat, Low Carb.<br>✅ Eat: Cheese, Butter, Eggs, Meat, Avocado.<br>❌ Avoid: Roti, Rice, Sugar, Fruits.',
            'vegan': '<b>Vegan Diet:</b> No Animal Products.<br>✅ Eat: Dal, Tofu, Soya, Nuts, Fruits, Veggies.<br>❌ Avoid: Milk, Curd, Paneer, Meat, Eggs.',
            'intermittent fasting': '<b>Intermittent Fasting (16:8):</b> Eat only during an 8-hour window (e.g., 12PM to 8PM). Drink water/black coffee in fasting window.',
            'muscle gain': '<b>Bulking Plan:</b><br>1. Surplus Calories (+500)<br>2. High Protein (2g per kg bodyweight)<br>3. Heavy Compound Lifts',
            'weight loss': '<b>Fat Loss Plan:</b><br>1. Deficit Calories (-500)<br>2. High Protein & Fiber<br>3. 10k Steps Daily<br>4. No Sugar'
        };

        // --- DATABASE 4: HEALTH TIPS (General Wellness) ---
        this.tipsDB = [
            "Drink a glass of warm water with lemon 🍋 in the morning to detox.",
            "Eat dinner at least 2 hours before sleeping 😴 for better digestion.",
            "Include colorful vegetables 🥗 in every meal for antioxidants.",
            "Chew your food 32 times 🦷 to help digestion and eating speed.",
            "Replace sugary drinks 🥤 with Green Tea or Buttermilk (Chaas)."
        ];

        // --- DATABASE 5: WEBSITE MAP ---
        this.siteDB = {
            'menu': '#/menu', 'food': '#/menu', 'order': '#/menu',
            'login': '#/login', 'register': '#/register',
            'track': '#/dashboard', 'contact': '#/contact'
        };

        this.init();
    }

    init() {
        this.injectStyles();
        this.render();
        this.bindEvents();
    }

    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Chat Button */
            .chatbot-trigger {
                position: fixed;
                bottom: 30px;
                right: 30px;
                width: 65px;
                height: 65px;
                background: linear-gradient(135deg, var(--primary, #FF6B35), #FF9F43);
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.8rem;
                cursor: pointer;
                box-shadow: 0 8px 25px rgba(255, 107, 53, 0.4);
                transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                z-index: 9999;
                border: 2px solid white;
            }
            .chatbot-trigger:hover {
                transform: scale(1.1) rotate(10deg);
                box-shadow: 0 12px 30px rgba(255, 107, 53, 0.5);
            }
            .chatbot-trigger i {
                transition: transform 0.3s ease;
            }
            .chatbot-trigger.active i {
                transform: rotate(180deg);
            }

            /* Chat Window */
            .chatbot-window {
                position: fixed;
                bottom: 110px;
                right: 30px;
                width: 380px;
                height: 600px;
                background: white;
                border-radius: 20px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.15);
                display: flex;
                flex-direction: column;
                overflow: hidden;
                z-index: 9999;
                opacity: 0;
                transform: translateY(20px) scale(0.9);
                pointer-events: none;
                transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
                font-family: 'Outfit', sans-serif;
                border: 1px solid rgba(0,0,0,0.05);
            }
            .chatbot-window.open {
                opacity: 1;
                transform: translateY(0) scale(1);
                pointer-events: all;
            }

            /* Header */
            .chatbot-header {
                background: linear-gradient(135deg, var(--primary, #FF6B35), #FF9F43);
                padding: 1.2rem;
                color: white;
                display: flex;
                align-items: center;
                gap: 1rem;
                box-shadow: 0 4px 10px rgba(0,0,0,0.05);
            }
            .chatbot-avatar {
                width: 40px;
                height: 40px;
                background: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--primary, #FF6B35);
                font-size: 1.2rem;
            }
            .chatbot-info h3 { margin: 0; font-size: 1.1rem; font-weight: 600; }
            .chatbot-info p { margin: 0; font-size: 0.8rem; opacity: 0.9; }

            /* Messages Area */
            .chatbot-messages {
                flex: 1;
                padding: 1.5rem;
                overflow-y: auto;
                background-color: #f8f9fa;
                background-image: radial-gradient(#FF6B35 0.5px, transparent 0.5px);
                background-size: 20px 20px;
                background-blend-mode: overlay;
                display: flex;
                flex-direction: column;
                gap: 1rem;
                scroll-behavior: smooth;
            }

            /* Message Bubbles */
            .msg {
                max-width: 85%;
                padding: 1rem;
                font-size: 0.95rem;
                line-height: 1.5;
                position: relative;
                animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                word-wrap: break-word;
            }
            @keyframes popIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }

            .msg.bot {
                align-self: flex-start;
                background: white;
                color: #333;
                border-radius: 12px 12px 12px 0;
                box-shadow: 0 2px 8px rgba(0,0,0,0.05);
                border-left: 4px solid var(--primary, #FF6B35);
            }
            .msg.user {
                align-self: flex-end;
                background: var(--primary, #FF6B35);
                color: white;
                border-radius: 12px 12px 0 12px;
                box-shadow: 0 4px 12px rgba(255, 107, 53, 0.2);
            }

            /* Typing Indicator */
            .typing {
                display: flex;
                gap: 5px;
                padding: 1rem;
                background: white;
                border-radius: 12px;
                width: fit-content;
                align-self: flex-start;
                margin-bottom: 0.5rem;
                box-shadow: 0 2px 5px rgba(0,0,0,0.05);
            }
            .typing span {
                width: 6px;
                height: 6px;
                background: #ccc;
                border-radius: 50%;
                animation: bounce 1.4s infinite ease-in-out;
            }
            .typing span:nth-child(1) { animation-delay: -0.32s; }
            .typing span:nth-child(2) { animation-delay: -0.16s; }
            @keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }

            /* Input Area */
            .chatbot-input {
                padding: 1rem;
                background: white;
                border-top: 1px solid rgba(0,0,0,0.05);
                display: flex;
                gap: 0.8rem;
                align-items: center;
            }
            .chatbot-input input {
                flex: 1;
                border: 2px solid #eee;
                padding: 0.8rem 1rem;
                border-radius: 25px;
                outline: none;
                font-family: inherit;
                transition: border-color 0.3s;
            }
            .chatbot-input input:focus {
                border-color: var(--primary, #FF6B35);
            }
            .chatbot-send {
                width: 45px;
                height: 45px;
                background: var(--primary, #FF6B35);
                color: white;
                border: none;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.2rem;
                transition: transform 0.2s;
            }
            .chatbot-send:hover { transform: scale(1.1); }

             /* Quick Actions */
            .quick-actions {
                display: flex;
                gap: 0.5rem;
                overflow-x: auto;
                padding-bottom: 0.5rem;
                margin-top: 0.5rem;
                width: 100%;
                scrollbar-width: none;
            }
            .quick-actions::-webkit-scrollbar { display: none; }
            
            .quick-btn {
                background: rgba(255, 107, 53, 0.1);
                color: var(--primary, #FF6B35);
                border: 1px solid rgba(255, 107, 53, 0.2);
                padding: 0.5rem 1rem;
                border-radius: 20px;
                font-size: 0.85rem;
                white-space: nowrap;
                cursor: pointer;
                transition: all 0.2s;
                flex-shrink: 0;
            }
            .quick-btn:hover {
                background: var(--primary, #FF6B35);
                color: white;
            }
        `;
        document.head.appendChild(style);
    }

    render() {
        this.trigger = document.createElement('div');
        this.trigger.className = 'chatbot-trigger';
        this.trigger.innerHTML = `<i class="ri-robot-2-line"></i>`;
        document.body.appendChild(this.trigger);

        this.window = document.createElement('div');
        this.window.className = 'chatbot-window';
        this.window.innerHTML = `
            <div class="chatbot-header">
                <div class="chatbot-avatar"><i class="ri-database-2-fill"></i></div>
                <div class="chatbot-info">
                    <h3>Food Mega-Bot</h3>
                    <p>Nutrition • Diet • Health</p>
                </div>
                <button id="close-chat" style="margin-left:auto; background:none; border:none; color:white; font-size:1.5rem; cursor:pointer;">&times;</button>
            </div>
            <div class="chatbot-messages" id="chatbot-msgs"></div>
            <div class="chatbot-input">
                <input type="text" placeholder="Calories in pizza? Keto plan?..." id="chatbot-text">
                <button class="chatbot-send" id="chatbot-send-btn"><i class="ri-send-plane-fill"></i></button>
            </div>
        `;
        document.body.appendChild(this.window);

        this.messagesContainer = document.getElementById('chatbot-msgs');
        this.renderMessages();
    }

    bindEvents() {
        const input = document.getElementById('chatbot-text');
        const sendBtn = document.getElementById('chatbot-send-btn');
        const closeBtn = document.getElementById('close-chat');

        this.trigger.addEventListener('click', () => this.toggle());
        closeBtn.addEventListener('click', () => this.toggle());

        const send = () => {
            const text = input.value.trim();
            if (!text) return;
            this.addMessage(text, false);
            input.value = '';
            this.processResponse(text);
        };

        sendBtn.addEventListener('click', send);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') send();
        });
    }

    toggle() {
        this.isOpen = !this.isOpen;
        this.window.classList.toggle('open', this.isOpen);
        this.trigger.classList.toggle('active', this.isOpen);
        if (this.isOpen) {
            this.trigger.innerHTML = `<i class="ri-close-line"></i>`;
            document.getElementById('chatbot-text').focus();
            this.scrollToBottom();
        } else {
            this.trigger.innerHTML = `<i class="ri-robot-2-line"></i>`;
        }
    }

    addMessage(text, isBot) {
        this.messages.push({ text, isBot });
        this.renderMessageElement(text, isBot);
    }

    renderMessages() {
        this.messagesContainer.innerHTML = '';
        this.messages.forEach(msg => this.renderMessageElement(msg.text, msg.isBot));
        if (this.messages.length <= 1) this.addQuickActions();
    }

    addQuickActions() {
        const existingActions = this.messagesContainer.querySelector('.quick-actions');
        if (existingActions) existingActions.remove();

        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'quick-actions';
        actionsDiv.innerHTML = `
            <button class="quick-btn">Calories in Roti?</button>
            <button class="quick-btn">What is Keto?</button>
            <button class="quick-btn">Give me a Health Tip</button>
            <button class="quick-btn">About Dosa</button>
         `;
        this.messagesContainer.appendChild(actionsDiv);

        actionsDiv.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const text = e.target.textContent;
                this.addMessage(text, false);
                this.processResponse(text);
            });
        });
    }

    renderMessageElement(text, isBot) {
        const div = document.createElement('div');
        div.className = `msg ${isBot ? 'bot' : 'user'}`;
        div.innerHTML = text;
        this.messagesContainer.appendChild(div);
        this.scrollToBottom();
    }

    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    async processResponse(text) {
        // Show Typing
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing';
        typingDiv.innerHTML = `<span></span><span></span><span></span>`;
        this.messagesContainer.appendChild(typingDiv);
        this.scrollToBottom();

        const lower = text.toLowerCase().trim();

        // 1. Save API Key
        if (lower.startsWith('key:')) {
            setTimeout(() => {
                typingDiv.remove();
                aiService.setApiKey(text.substring(4).trim());
                this.addMessage("✅ Gemini API Key saved! Ask me anything about food now! 🍔", true);
            }, 500);
            return;
        }

        // 2. Prompt for API Key if Missing
        if (!aiService.hasApiKey()) {
            setTimeout(() => {
                typingDiv.remove();
                this.addMessage("Hi! I am the TiFFLu AI Chatbot. 🤖<br><br>To chat smartly with me, please provide a <b>Gemini API Key</b> by typing:<br><br><code>key: YOUR_API_KEY</code>", true);
            }, 500);
            return;
        }

        // 3. Web Nav & Hardcoded Intercepts
        for (const [key, link] of Object.entries(this.siteDB)) {
            if (lower.includes(key) && lower.includes('go to')) {
                typingDiv.remove();
                window.setTimeout(() => window.location.hash = link, 1000);
                this.addMessage(`Navigating to <b>${key.toUpperCase()}</b>...`, true);
                return;
            }
        }

        // 4. Send to Gemini
        const systemPrompt = `You are TiFFLu AI, the smart foodie assistant for the TiFFLu food delivery application. Your goal is to talk to the user about food, nutrition, mood and diets. You can also converse in Gujarati, Hindi or English, matching the user's language. If they ask about unrelated stuff, politely redirect them to food. Keep responses very short (max 2-3 sentences max) and you may use basic HTML like <b> for bold, and some fun emojis.
        
        User input: "${text}"`;

        const responseText = await aiService.getAIResponse(systemPrompt);

        typingDiv.remove();
        this.addMessage(responseText, true);
    }
}
