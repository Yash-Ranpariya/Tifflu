/**
 * Cart Page
 */
export const renderCart = () => {
    const cart = window.app.store.getState().cart;

    // Calculate Total
    const total = cart.reduce((sum, item) => sum + item.price, 0);

    const removeItem = (id) => {
        window.app.store.removeFromCart(id);
        // Re-render handled by router -> hash reload or manual Dom update. 
        // For simplicity, we just reload hash
        window.location.reload();
        // Better: store subscription handles re-render of this component if we made it reactive, 
        // but currently specific page re-renders aren't automatic in our simple router.
        // We can just call renderCart() and replace content? No, router handles it.
    };

    // Hack: Attach remove function globally or handle via store
    window.removeCartItem = (id) => {
        window.app.store.removeFromCart(id);
        // Force re-render of cart page
        const container = document.getElementById('main-content');
        container.innerHTML = renderCart(); // This works if synchronous, but renderCart is sync now.
        // Re-attach listeners? No listeners here really except onclick.
    };

    if (cart.length === 0) {
        return `
            <div class="container section-padding text-center" style="min-height: 60vh; display: flex; flex-direction: column; justify-content: center;">
                <i class="ri-shopping-cart-line" style="font-size: 5rem; color: #ddd; margin-bottom: 1rem;"></i>
                <h2>Your Cart is Empty</h2>
                <p style="color: #666; margin-bottom: 2rem;">Looks like you haven't added anything yet.</p>
                <div>
                    <a href="#/menu" class="btn btn-primary">Browse Menu</a>
                </div>
            </div>
        `;
    }

    return `
        <section class="section-padding">
            <div class="container">
                <h1>Your Cart</h1>
                <div class="grid-3" style="grid-template-columns: 2fr 1fr; gap: 2rem;">
                    
                    <!-- Items -->
                    <div class="cart-items">
                        ${cart.map(item => `
                            <div class="card" style="display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem; padding: 1rem;">
                                <img src="${item.image}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;">
                                <div style="flex: 1;">
                                    <h4 style="margin: 0;">${item.name}</h4>
                                    <p style="color: #666; font-size: 0.9rem;">${item.category} • ${item.isVeg ? 'Veg' : 'Non-Veg'}</p>
                                    <div style="font-weight: 600; color: var(--primary);">₹${item.price}</div>
                                </div>
                                <button class="btn-icon" onclick="removeCartItem(${item.id})" style="color: var(--error); background: #FFF0F0;">
                                    <i class="ri-delete-bin-line"></i>
                                </button>
                            </div>
                        `).join('')}
                    </div>

                    <!-- Summary -->
                    <div class="card" style="height: fit-content; position: sticky; top: 100px;">
                        <h3 style="margin-bottom: 1.5rem;">Order Summary</h3>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 1rem;">
                            <span style="color: #666;">Subtotal</span>
                            <span>₹${total}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 1rem;">
                            <span style="color: #666;">Delivery Fee</span>
                            <span>₹20</span>
                        </div>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 1rem 0;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 2rem; font-size: 1.2rem; font-weight: 700;">
                            <span>Total</span>
                            <span class="text-primary">₹${total + 20}</span>
                        </div>
                        
                        <button class="btn btn-primary" style="width: 100%;" onclick="window.location.hash='#/payment'">
                            Proceed to Checkout
                        </button>
                    </div>

                </div>
            </div>
        </section>
    `;
};
