/**
 * Simple State Management (Pub/Sub)
 */
export default class Store {
    constructor() {
        this.state = {
            user: JSON.parse(localStorage.getItem('user')) || null,
            cart: JSON.parse(localStorage.getItem('cart')) || [],
            theme: localStorage.getItem('theme') || 'light',
            menuItems: [], // Start empty, force sync with backend
            myOrders: JSON.parse(localStorage.getItem('myOrders')) || []
        };
        this.subscribers = [];
    }

    async init() {
        // Apply theme on init
        if (this.state.theme === 'dark') {
            document.body.classList.add('dark-mode');
        }
        await this.syncMenu();
    }

    async syncMenu() {
        try {
            const res = await fetch('http://localhost:9090/api/menu');
            if (res.ok) {
                const items = await res.json();
                console.log('Backend Menu Items:', items);

                if (items.length > 0) {
                    // Map backend format to frontend format
                    const mappedItems = items.map(item => ({
                        id: item.itemId, // CRITICAL: Use backend ID
                        name: item.name,
                        price: item.price,
                        description: item.description,
                        image: item.imageUrl,
                        // Defaults for fields backend doesn't have yet
                        rating: 4.5,
                        reviews: 0,
                        category: item.itemType, // Using itemType as category ("Hotel", "Mess", etc.)
                        isVeg: item.isVeg,
                        isChefSpecial: item.isChefSpecial
                    }));

                    // VALIDATE CART: Remove items that don't exist in backend anymore (fixes "Item not found" error)
                    const validIds = new Set(mappedItems.map(i => i.id));
                    const currentCart = this.state.cart;
                    const validCart = currentCart.filter(item => validIds.has(item.id));

                    if (validCart.length !== currentCart.length) {
                        console.log('Purging invalid items from cart:', currentCart.length - validCart.length);
                        this.setState({ menuItems: mappedItems, cart: validCart });
                    } else {
                        this.setState({ menuItems: mappedItems });
                    }

                    // We don't really need to persist menuItems to localStorage if we fetch on load, 
                    // but it helps with offline/perceived perf.
                    localStorage.setItem('menuItems', JSON.stringify(mappedItems));
                } else {
                    // Seed defaults if empty
                    console.log('Menu empty, seeding defaults...');
                    await this.seedDefaults();
                }
            }
        } catch (e) {
            console.warn('Failed to sync menu, checking local storage fallback:', e);
            // Only use local storage if backend fails entirely
            const localItems = JSON.parse(localStorage.getItem('menuItems'));
            if (localItems && localItems.length > 0) {
                this.setState({ menuItems: localItems });
            }
        }
    }

    async seedDefaults() {
        const defaults = [
            { name: "Deluxe Veg Thali", price: 150, description: "Paneer, Dal, Rice, Roti, Sweet", image: "assets/deluxe_veg_thali.png", category: "Hotel", isVeg: true, isChefSpecial: true },
            { name: "Homestyle Dal Chawal", price: 80, description: "Yellow Dal & Rice", image: "assets/dal_makhani.png", category: "Homemade", isVeg: true, isChefSpecial: false },
            { name: "Paneer Tikka Masala", price: 180, description: "Spicy gravy", image: "assets/paneer_tikka.png", category: "Mess", isVeg: true, isChefSpecial: true },
            { name: "Veg Biryani", price: 120, description: "Aromatic rice with veggies", image: "assets/veg_biryani.png", category: "Hotel", isVeg: true, isChefSpecial: false },
            { name: "Aloo Paratha (2pcs)", price: 60, description: "With curd and pickle", image: "assets/butter_naan.png", category: "Homemade", isVeg: true, isChefSpecial: false },
            { name: "Masala Dosa", price: 90, description: "With chutney and sambar", image: "assets/curd_rice.png", category: "Mess", isVeg: true, isChefSpecial: false },
        ];

        for (const item of defaults) {
            await this.addMenuItemToBackend(item);
        }
        // Re-sync after seeding
        await this.syncMenu();
    }

    async addMenuItemToBackend(item) {
        try {
            const payload = {
                vendorId: "admin", // Default vendor
                categoryId: 1,
                name: item.name,
                description: item.description,
                price: item.price,
                itemType: item.category,
                isVeg: item.isVeg,
                imageUrl: item.image,
                isAvailable: true
            };

            await fetch('http://localhost:9090/api/menu', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        } catch (e) {
            console.error('Error adding item:', e);
        }
    }

    getState() {
        return this.state;
    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.notify();
        this.persist();
    }

    persist() {
        if (this.state.user) localStorage.setItem('user', JSON.stringify(this.state.user));
        else localStorage.removeItem('user');

        localStorage.setItem('cart', JSON.stringify(this.state.cart));
        localStorage.setItem('theme', this.state.theme);
        localStorage.setItem('myOrders', JSON.stringify(this.state.myOrders));
        // Don't persist menuItems anymore, use backend
    }

    subscribe(callback) {
        this.subscribers.push(callback);
        // Return unsubscribe function
        return () => {
            this.subscribers = this.subscribers.filter(cb => cb !== callback);
        };
    }

    notify() {
        this.subscribers.forEach(cb => cb(this.state));
    }

    // Actions
    login(user) {
        this.setState({ user });
    }

    logout() {
        this.setState({ user: null });
    }

    addToCart(item) {
        const cart = [...this.state.cart, item];
        this.setState({ cart });
    }

    removeFromCart(itemId) {
        const cart = this.state.cart.filter(item => item.id !== itemId);
        this.setState({ cart });
    }

    addSimulatedOrder(order) {
        const myOrders = [order, ...this.state.myOrders];
        this.setState({ myOrders });
    }

    async addMenuItem(item) {
        // Optimistic update for UI speed
        // BUT we must reload to get the real ID from backend

        await this.addMenuItemToBackend(item);
        // Re-sync to get proper ID from DB
        await this.syncMenu();
    }

    async deleteMenuItem(id) {
        try {
            const res = await fetch(`http://localhost:9090/api/menu/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                // Remove from local state immediately
                const newItems = this.state.menuItems.filter(i => i.id !== id);
                this.setState({ menuItems: newItems });
            } else {
                console.error('Failed to delete item');
                throw new Error('Delete failed');
            }
        } catch (e) {
            console.error('Error deleting item:', e);
            throw e;
        }
    }

    toggleTheme() {
        const newTheme = this.state.theme === 'light' ? 'dark' : 'light';
        this.setState({ theme: newTheme });
        if (newTheme === 'dark') document.body.classList.add('dark-mode');
        else document.body.classList.remove('dark-mode');
    }
}
