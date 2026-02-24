
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

// Mock window/document
global.document = {
    body: {
        classList: { add: () => { }, remove: () => { } }
    }
};

// Mock fetch
global.fetch = async (url, options) => {
    if (url.includes('/api/menu') && options && options.method === 'DELETE') {
        console.log(`Mock Fetch: DELETE ${url}`);
        return { ok: true, json: async () => ({ success: true }) };
    }
    // Default mock for syncMenu
    if (url.includes('/api/menu')) {
        return {
            ok: true,
            json: async () => [
                { itemId: 1, name: "Item 1", price: 100, itemType: "Hotel" },
                { itemId: 2, name: "Item 2", price: 200, itemType: "Hotel" }
            ]
        };
    }
    return { ok: false };
};

async function testDelete() {
    console.log("Starting Delete Item Test...");

    const store = new Store();
    await store.init();

    // Initial State
    console.log("Initial Menu Size:", store.getState().menuItems.length);
    if (store.getState().menuItems.length !== 2) {
        console.error("FAILED: Initial menu load failed");
        process.exit(1);
    }

    // Delete Item ID 1
    await store.deleteMenuItem(1);

    // Check State
    const items = store.getState().menuItems;
    console.log("After Delete - Menu Size:", items.length);

    if (items.length !== 1) {
        console.error("FAILED: Item not removed from state");
        process.exit(1);
    }

    if (items.find(i => i.id === 1)) {
        console.error("FAILED: Wrong item removed");
        process.exit(1);
    }

    console.log("SUCCESS: Delete logic verified.");
}

testDelete();
