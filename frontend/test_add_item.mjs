
// Built-in fetch in Node 20+

async function testAddItem() {
    console.log("Starting Add Item Test...");

    // 0. Login to get valid Vendor ID
    let vendorId = "admin";
    try {
        const loginRes = await fetch('http://localhost:9090/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone: "9000000001", password: "password" }) // Taj Hotel
        });
        const loginData = await loginRes.json();
        if (loginData.success) {
            vendorId = loginData.user.userId;
            console.log("Logged in as Vendor:", vendorId);
        } else {
            console.error("Login failed, using fallback admin (might fail)");
        }
    } catch (e) {
        console.error("Login error:", e);
    }

    // Payload matching store.js exactly
    const payload = {
        vendorId: vendorId,
        categoryId: 1,
        name: "Test Add Item " + Date.now(),
        description: "Test Description",
        price: 150,
        itemType: "Hotel", // Assuming valid type
        isVeg: true,
        // imageUrl: "test.png", // Optional? store.js sends it.
        imageUrl: "assets/debug.png",
        isAvailable: true
        // isChefSpecial is MISSING, as in store.js
    };

    console.log("Sending Payload:", JSON.stringify(payload, null, 2));

    try {
        // 1. Add Item
        const res = await fetch('http://localhost:9090/api/menu', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        console.log("Add Response:", data);

        if (!data.success) {
            console.error("FAILED: Backend returned success=false");
            process.exit(1);
        }

        // 2. Fetch Menu to Verify
        const menuRes = await fetch('http://localhost:9090/api/menu');
        const menuItems = await menuRes.json();

        console.log(`Fetched ${menuItems.length} items`);

        const found = menuItems.find(i => i.name === payload.name);
        if (found) {
            console.log("SUCCESS: Item found in menu!", found);
            // Verify fields
            if (found.isChefSpecial === null || found.isChefSpecial === undefined) {
                console.log("WARNING: isChefSpecial is null/undefined");
            } else {
                console.log("isChefSpecial:", found.isChefSpecial);
            }
        } else {
            console.error("FAILED: Item NOT found in menu after adding.");
            process.exit(1);
        }

    } catch (e) {
        console.error("ERROR:", e);
        process.exit(1);
    }
}

testAddItem();
