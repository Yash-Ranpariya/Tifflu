
import Store from './js/store.js';

// Mock localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => { store[key] = value.toString(); },
        removeItem: (key) => { delete store[key]; },
        clear: () => { store = {}; }
    };
})();

global.localStorage = localStorageMock;

// Mock window/document for Store init (theme logic)
global.document = {
    body: {
        classList: {
            add: () => { },
            remove: () => { }
        }
    }
};

// Mock fetch for syncMenu
global.fetch = async (url) => {
    if (url.includes('/api/menu')) {
        return {
            ok: true,
            json: async () => [
                {
                    itemId: 1,
                    name: "Test Item",
                    price: 100,
                    description: "Test Desc",
                    imageUrl: "test.png",
                    itemType: "Hotel",
                    isVeg: true,
                    isChefSpecial: false
                }
            ]
        };
    }
    return { ok: false };
};

async function testCart() {
    console.log("Starting Cart Test...");

    const store = new Store();
    await store.init();

    console.log("Initial Cart Size:", store.getState().cart.length);

    // 1. Add Item
    const itemToAdd = {
        id: 1,
        name: "Test Item",
        price: 100,
        qty: 1
    };

    store.addToCart(itemToAdd);
    console.log("After Add - Cart Size:", store.getState().cart.length);

    if (store.getState().cart.length !== 1) {
        console.error("FAILED: Item not added");
        process.exit(1);
    }

    // 2. Remove Item
    store.removeFromCart(1);
    console.log("After Remove - Cart Size:", store.getState().cart.length);

    if (store.getState().cart.length !== 0) {
        console.error("FAILED: Item not removed");
        process.exit(1);
    }

    console.log("SUCCESS: Cart logic verified.");
}

testCart();
