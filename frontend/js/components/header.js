/**
 * Header Component
 */
export const renderHeader = (targetId) => {
    const header = document.getElementById(targetId);
    if (!header) return;

    // Subscribe to store to update header on state change
    const updateHeader = (state) => {
        const user = state.user;
        const cartCount = state.cart.length;

        header.innerHTML = `
            <div class="container nav-container">
                <a href="#/" class="logo">
                    <i class="ri-restaurant-2-fill"></i> TiFFLu
                </a>

                <nav class="nav-links">
                    <a href="#/" class="nav-link">Home</a>
                    <a href="#/menu" class="nav-link">Menu</a>
                    ${user ? `
                        <a href="#/dashboard" class="nav-link">Dashboard</a>
                        <a href="#/orders" class="nav-link">Orders</a>
                    ` : ''}
                    <a href="#/contact" class="nav-link">Contact</a>
                </nav>

                <div class="nav-actions">
                    <button class="btn-icon" onclick="window.location.hash = '#/cart'">
                        <i class="ri-shopping-cart-2-line"></i>
                        ${cartCount > 0 ? `<span style="position:absolute; top:-5px; right:-5px; background:var(--primary); color:white; font-size:0.7rem; width:18px; height:18px; border-radius:50%; display:flex; align-items:center; justify-content:center;">${cartCount}</span>` : ''}
                    </button>
                    
                    ${user ? `
                        <button class="btn btn-secondary btn-sm" onclick="window.app.store.logout()">
                            <i class="ri-logout-box-r-line"></i> Logout
                        </button>
                    ` : `
                        <button class="btn btn-primary" onclick="window.location.hash = '#/login'">
                            Login
                        </button>
                    `}
                    
                    <button class="btn-icon" onclick="window.app.store.toggleTheme()">
                        <i class="ri-contrast-2-line"></i>
                    </button>
                </div>
            </div>
        `;

        // Add scroll listener for styling
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    };

    // Initial Render
    updateHeader(window.app.store.getState());

    // Subscribe
    window.app.store.subscribe(updateHeader);
};
