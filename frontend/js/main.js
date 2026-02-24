/**
 * main.js
 * Entry point for Single Page Application
 */

console.log('🚀 Main.js loaded');

import Store from './store.js';
import Router from './router.js';
import { initGlobalEffects } from './visual-effects.js';
import './components/toast.js';
import './components/toast.js';
import { ChatBot } from './components/chatbot.js';

// Global error handler for module loading
window.addEventListener('error', (e) => {
    console.error('Global Error:', e.message);
});

// Initialize Global Store
const store = new Store();
store.init();

// Initialize Router (Allocates memory, but doesn't render yet)
const router = new Router();

// Helper to update Cart Badge
const updateCartBadge = (count) => {
    document.querySelectorAll('.nav-actions .btn-icon i.ri-shopping-cart-2-line').forEach(icon => {
        const btn = icon.parentElement;
        let badge = btn.querySelector('.cart-badge');

        if (count > 0) {
            if (!badge) {
                badge = document.createElement('span');
                badge.className = 'cart-badge';
                badge.style.cssText = 'position:absolute; top:-5px; right:-5px; background:var(--primary); color:white; font-size:0.7rem; width:18px; height:18px; border-radius:50%; display:flex; align-items:center; justify-content:center;';
                btn.style.position = 'relative';
                btn.appendChild(badge);
            }
            badge.textContent = count;
            badge.style.display = 'flex';
        } else {
            if (badge) badge.style.display = 'none';
        }
    });
};

// Global App Utilities exposed to Window
window.app = {
    store: store,
    router: router,

    // Theme Toggle
    toggleTheme: () => store.toggleTheme(),

    // Add to Cart Logic
    addToCart: (id, name, price) => {
        try {
            store.addToCart({ id, name, price, quantity: 1 });
            // Visual feedback
            const btn = event?.target?.closest('button') || event?.target;
            if (btn) {
                const icon = btn.querySelector('i');
                const originalContent = btn.innerHTML;

                btn.innerHTML = '<i class="ri-check-line"></i> Added';
                btn.classList.add('btn-success');

                setTimeout(() => {
                    btn.innerHTML = originalContent;
                    btn.classList.remove('btn-success');
                }, 1500);
            }
        } catch (err) {
            console.error('Add to Cart Error:', err);
        }
    },

    // Login Handler
    handleLogin: (e) => {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]').value;
        store.login({ name: "User", email: email });
        window.location.hash = '#/dashboard';
        return false;
    },

    // Filter Menu (Legacy/Global helper)
    filterMenu: (category) => {
        window.location.hash = `#/menu?category=${category}`;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ DOM Content Loaded');

    try {
        // 1. Initialize Router (Handles rendering)
        console.log('Initializing Router...');
        router.init();

        // 2. Initialize Visual Effects
        console.log('Initializing Effects...');
        initGlobalEffects();

        // 3. Initialize Chatbot
        console.log('Initializing Chatbot...');
        new ChatBot();

        // 4. Header Scroll Effect
        const header = document.getElementById('main-header');
        if (header) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) header.classList.add('scrolled');
                else header.classList.remove('scrolled');
            });
        }

        // 6. Scroll Animations (IntersectionObserver)
        const observerOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); // Once revealed, stop observing
                }
            });
        }, observerOptions);

        document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));

        // 5. Subscribe to Store Updates
        store.subscribe((state) => {
            updateCartBadge(state.cart.length);
        });

        // Initial UI Update
        updateCartBadge(store.getState().cart.length);

    } catch (err) {
        console.error('Initialization Error:', err);
        document.body.innerHTML += `<div style="color:red; background:white; padding:20px; border:2px solid red;">App Crash: ${err.message}</div>`;
    }
});
