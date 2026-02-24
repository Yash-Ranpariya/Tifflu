/**
 * TiFFLu Application Entry Point
 */
import Router from './router.js';
import Store from './store.js';
import { renderHeader } from './components/header.js';
import { renderFooter } from './components/footer.js';
import { ChatBot } from './components/chatbot.js';

class App {
    constructor() {
        this.router = new Router();
        this.store = new Store();
    }

    async init() {
        console.log('Initializing TiFFLu...');

        // Initialize Global State (Check Auth, Load Theme)
        this.store.init();

        // Render Static Layout Elements
        renderHeader('main-header');
        renderFooter('main-footer');

        // Start Router to handle initial URL
        this.router.init();

        // Global Event Listeners
        this.setupGlobalListeners();

        // Splash Screen Logic
        this.handleSplashScreen();

        // Initialize Visual Effects (after a slight delay to ensure DOM is ready)
        setTimeout(() => {
            import('./visual-effects.js').then(module => {
                module.initVisualEffects();
            });
            // Initialize Chatbot
            this.chat = new ChatBot();
        }, 100);
    }

    handleSplashScreen() {
        const splash = document.getElementById('splash-screen');
        const skipBtn = document.getElementById('skip-splash');

        let timeout;

        const closeSplash = () => {
            if (splash) {
                splash.classList.add('hidden');
            }
            document.body.classList.add('loaded');
            clearTimeout(timeout);
        };

        // Skip Button
        if (skipBtn) {
            skipBtn.addEventListener('click', closeSplash);
        }

        // Timer (15 seconds)
        timeout = setTimeout(closeSplash, 15000);
    }

    setupGlobalListeners() {
        // Handle global clicks for things like closing dropdowns
        document.addEventListener('click', (e) => {
            // Logic to close dropdowns if clicking outside
        });
    }
}

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
    window.app.init();
});
