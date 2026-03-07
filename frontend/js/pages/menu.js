/**
 * Menu Page
 */
import { renderFoodCard } from '../components/food-card.js';
import { aiService } from '../ai-service.js';

export const renderMenu = () => {
    // Get items from store
    const foodItems = window.app.store.getState().menuItems;

    // Separate Chef's Specials
    const specials = foodItems.filter(i => i.isChefSpecial);

    // Attach filter handler globally
    window.filterMenu = (category) => {
        const container = document.getElementById('menu-grid');
        const btns = document.querySelectorAll('.filter-btn');

        btns.forEach(btn => {
            if (btn.dataset.category === category) {
                btn.classList.add('btn-primary');
                btn.classList.remove('btn-secondary');
            } else {
                btn.classList.remove('btn-primary');
                btn.classList.add('btn-secondary');
            }
        });

        const filtered = category === 'All' ? foodItems : foodItems.filter(i => i.category === category);
        container.innerHTML = filtered.map(item => renderFoodCard(item)).join('');

        // Re-trigger animations for new items
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        container.querySelectorAll('.food-card').forEach(el => {
            el.classList.add('reveal-on-scroll');
            observer.observe(el);
        });
    };

    // Initial Render
    setTimeout(() => {
        // Parse Hash for Category
        const hash = window.location.hash;
        let initialCategory = 'All';

        if (hash.includes('?')) {
            const params = new URLSearchParams(hash.split('?')[1]);
            const cat = params.get('category');
            if (cat) initialCategory = cat;
        }

        window.filterMenu(initialCategory);
        renderSpecials(window.app.store.getState().menuItems);

        // Attach Mood AI Logic
        window.findMoodFood = async () => {
            const input = document.getElementById('mood-input');
            const mood = input.value.trim();
            if (!mood) return;

            const resContainer = document.getElementById('mood-results-container');
            const loadSpan = document.getElementById('mood-loading');
            const grid = document.getElementById('mood-grid');

            resContainer.style.display = 'block';
            loadSpan.style.display = 'inline-block';
            grid.innerHTML = '';

            try {
                const currentMenu = window.app.store.getState().menuItems;
                const matchedIds = await aiService.suggestFoodByMood(mood, currentMenu);

                loadSpan.style.display = 'none';

                if (!matchedIds || matchedIds.length === 0) {
                    grid.innerHTML = '<p style="grid-column: 1/-1;">Could not find a match right now.</p>';
                } else {
                    const matchedItems = currentMenu.filter(item => matchedIds.includes(item.id) || matchedIds.includes(String(item.id)));
                    if (matchedItems.length > 0) {
                        grid.innerHTML = matchedItems.map(item => renderFoodCard(item)).join('');
                    } else {
                        grid.innerHTML = '<p style="grid-column: 1/-1;">Could not find a match right now.</p>';
                    }
                }
            } catch (e) {
                loadSpan.style.display = 'none';
                let errorMsg = e.message.includes("No API Key")
                    ? "Please set your Gemini API key in the Chatbot first!"
                    : `AI Error: ${e.message}`;
                grid.innerHTML = `<p style="color:red; grid-column: 1/-1;">${errorMsg}</p>`;
            }
        };

        // SUBSCRIBE to store updates (fixes race condition)
        window.app.store.subscribe((newState) => {
            const currentHash = window.location.hash;
            let currentCategory = 'All';
            if (currentHash.includes('?')) {
                const params = new URLSearchParams(currentHash.split('?')[1]);
                const cat = params.get('category');
                if (cat) currentCategory = cat;
            }

            // Re-run filter to update grid with new items
            window.filterMenu(currentCategory);
            renderSpecials(newState.menuItems);
        });

    }, 0);

    function renderSpecials(items) {
        const specials = items.filter(i => i.isChefSpecial);
        const specialsContainer = document.getElementById('specials-grid');
        if (specialsContainer && specials.length > 0) {
            specialsContainer.innerHTML = specials.map(item => {
                const cardHtml = renderFoodCard(item);
                return cardHtml.replace('class="food-card', 'class="food-card chefs-special-card');
            }).join('');
            // Logic to show/hide the specials section container if needed could go here
            // But simple innerHTML update is enough for now
        }
    }

    return `
        <section class="section-padding" style="background: var(--background);">
            <div class="container">
                <div class="text-center reveal-on-scroll" style="margin-bottom: 2rem;">
                    <h1>Our Menu</h1>
                    <p style="color: #666;">Fresh, Hygienic, and Delicious</p>
                </div>
                
                <!-- MOOD AI SUGGESTER -->
                <div class="reveal-on-scroll card glass-card" style="margin-bottom: 3rem; text-align: center; max-width: 700px; margin-left: auto; margin-right: auto; border: 2px solid var(--primary); padding: 2rem;">
                    <h3 style="margin-bottom: 1rem;"><i class="ri-magic-line"></i> AI Mood-Based Suggestions</h3>
                    <p style="margin-bottom: 1.5rem; color:#666; font-size:1rem;">Tell us what mood you're in, and our AI will pick the perfect food from the menu for you!</p>
                    <div style="display:flex; gap:0.5rem; justify-content:center; max-width: 500px; margin: 0 auto;">
                        <input type="text" id="mood-input" placeholder="E.g. Feeling sad, need something sweet..." style="flex:1; padding:0.8rem; border-radius:8px; border:1px solid #ddd; outline: none;">
                        <button class="btn btn-primary" onclick="window.findMoodFood()">Suggest Food</button>
                    </div>
                    <div id="mood-results-container" style="margin-top: 2rem; display:none; background: var(--surface); padding: 1rem; border-radius: 12px;">
                        <p id="mood-loading" style="display:none; color: var(--primary); font-weight: 500;"><i class="ri-loader-4-line ri-spin" style="margin-right: 5px;"></i> AI is reading the menu...</p>
                        <div id="mood-grid" class="grid-2" style="text-align: left;"></div>
                    </div>
                </div>

                ${specials.length > 0 ? `
                <!-- Chef's Specials -->
                <div class="reveal-on-scroll" style="margin-bottom: 3rem;">
                    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; justify-content: center;">
                        <i class="ri-medal-fill" style="color: #FFD700; font-size: 2rem;"></i>
                        <h2 style="margin: 0;">Chef's Specials</h2>
                        <i class="ri-medal-fill" style="color: #FFD700; font-size: 2rem;"></i>
                    </div>
                    <div id="specials-grid" class="grid-3">
                        <!-- Specials injected here -->
                    </div>
                </div>
                <hr style="border: 0; border-top: 1px solid rgba(0,0,0,0.1); margin: 3rem 0;">
                <div class="text-center reveal-on-scroll" style="margin-bottom: 2rem;">
                    <h2>Full Menu</h2>
                </div>
                ` : ''}
                
                <div class="reveal-on-scroll" style="display: flex; justify-content: center; gap: 1rem; margin-bottom: 3rem; flex-wrap: wrap;">
                    <button class="btn btn-primary filter-btn" data-category="All" onclick="filterMenu('All')">All</button>
                    <button class="btn btn-secondary filter-btn" data-category="Hotel" onclick="filterMenu('Hotel')">Hotel</button>
                    <button class="btn btn-secondary filter-btn" data-category="Mess" onclick="filterMenu('Mess')">Mess</button>
                    <button class="btn btn-secondary filter-btn" data-category="Homemade" onclick="filterMenu('Homemade')">Homemade</button>
                </div>

                <div id="menu-grid" class="grid-3 reveal-on-scroll">
                    <!-- Items injected here -->
                </div>
            </div>
        </section>
    `;
};
