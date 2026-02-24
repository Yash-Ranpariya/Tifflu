/**
 * visual-effects.js
 * Handles Parallax Scrolling and Scroll Reveal Animations
 */

// Global state to track observers so we can disconnect them (prevent leaks)
let scrollObserver = null;

export const initGlobalEffects = () => {
    // These only need to be set up once
    setupParallax();
};

export const refreshPageEffects = () => {
    // These need to run every time the DOM changes (route change)
    // Small delay to ensure DOM is fully painted
    setTimeout(() => {
        setupScrollReveal();
        setupMouseParallax();
    }, 100);
};

const setupScrollReveal = () => {
    // Disconnect previous observer if exists
    if (scrollObserver) {
        scrollObserver.disconnect();
    }

    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                scrollObserver.unobserve(entry.target); // Only trigger once
            }
        });
    }, observerOptions);

    // Observe all elements with .reveal-on-scroll
    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach(el => {
        scrollObserver.observe(el);
    });
};

const setupParallax = () => {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        document.querySelectorAll('.parallax').forEach(el => {
            const speed = parseFloat(el.dataset.speed || 0.5);
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
};

// 3D Mouse Parallax for Hero Image
const setupMouseParallax = () => {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;

    // The hero section is re-created on every route change, 
    // so we can blindly add the listener to it without worrying about duplication 
    // because the old element is garbage collected.

    heroSection.addEventListener('mousemove', (e) => {
        const moveX = (e.clientX - window.innerWidth / 2) * 0.05;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.05;

        document.querySelectorAll('.mouse-parallax').forEach(el => {
            const speed = parseFloat(el.dataset.mouseSpeed || 1);
            el.style.transform = `translate(${moveX * speed}px, ${moveY * speed}px)`;
        });
    });
};
