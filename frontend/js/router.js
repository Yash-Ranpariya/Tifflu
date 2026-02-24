/**
 * Simple Hash Router
 */
import { renderHome } from './pages/home.js';
import { renderLogin } from './pages/login.js';
import { renderDashboard } from './pages/dashboard.js';
import { renderCart } from './pages/cart.js';
import { renderMenu } from './pages/menu.js';
import { renderPayment } from './pages/payment.js';
import { renderContact } from './pages/contact.js';
import { renderSubscription } from './pages/subscription.js';
import { renderManageMenu } from './pages/manage-menu.js';
import { renderRegister } from './pages/register.js';
import { renderOrders } from './pages/orders.js';
import { refreshPageEffects } from './visual-effects.js';

const routes = {
    '/': renderHome,
    '/login': renderLogin,
    '/register': renderRegister,
    '/dashboard': renderDashboard,
    '/orders': renderOrders,
    '/cart': renderCart,
    '/menu': renderMenu,
    '/payment': renderPayment,
    '/contact': renderContact,
    '/subscription': renderSubscription,
    '/manage-menu': renderManageMenu,
    // defaults
    '/404': () => '<h1>404 - Page Not Found</h1>'
};

export default class Router {
    constructor() {
        this.appContainer = document.getElementById('main-content');
        this.routes = routes;
    }

    init() {
        window.addEventListener('hashchange', () => this.handleRoute());
        this.handleRoute(); // Handle initial load
    }

    async handleRoute() {
        const hash = window.location.hash || '#/';
        const path = hash.slice(1).split('?')[0]; // simple path matching

        console.log(`Navigating to: ${path}`);

        let handler = this.routes[path];

        if (!handler) {
            handler = this.routes['/404'];
        }

        // Check if handler is a function (render function)
        if (typeof handler === 'function') {
            // Clear current content
            this.appContainer.innerHTML = '';

            // Check middleware/auth here if needed
            // if (path === '/dashboard' && !window.app.store.state.user) return this.navigateTo('/login');

            // Render new content
            const content = await handler();
            if (typeof content === 'string') {
                this.appContainer.innerHTML = content;
            } else if (content instanceof HTMLElement) {
                this.appContainer.appendChild(content);
            }

            // Scroll to top
            window.scrollTo(0, 0);

            // Re-initialize animations and visual effects for the new content
            refreshPageEffects();
        }
    }

    navigateTo(path) {
        window.location.hash = path;
    }
}
