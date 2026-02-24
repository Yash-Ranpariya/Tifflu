const http = require('http');

// Helper to make requests
function request(method, path, body) {
    return new Promise((resolve, reject) => {
        const data = body ? JSON.stringify(body) : '';
        const options = {
            hostname: 'localhost',
            port: 9090,
            path: '/api' + path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        const req = http.request(options, (res) => {
            let responseBody = '';
            res.on('data', chunk => responseBody += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(responseBody);
                    resolve({ status: res.statusCode, data: parsed });
                } catch (e) {
                    resolve({ status: res.statusCode, raw: responseBody });
                }
            });
        });

        req.on('error', reject);
        if (data) req.write(data);
        req.end();
    });
}

const vendors = [
    { name: "Taj Hotel", phone: "9000000001", password: "password", role: "Hotel" },
    { name: "Student Mess", phone: "9000000002", password: "password", role: "Mess" },
    { name: "Grandma Kitchen", phone: "9000000003", password: "password", role: "Homemade" }
];

const menuItems = [
    // --- HOTEL ITEMS ---
    { name: "Paneer Butter Masala", price: 240, itemType: "Hotel", isVeg: true, imageUrl: "assets/paneer_butter_masala.png", isChefSpecial: true },
    { name: "Veg Biryani", price: 200, itemType: "Hotel", isVeg: true, imageUrl: "assets/veg_biryani.png", isChefSpecial: false },
    { name: "Farmhouse Pizza", price: 350, itemType: "Hotel", isVeg: true, imageUrl: "assets/farmhouse_pizza.png", isChefSpecial: false },
    { name: "White Sauce Pasta", price: 280, itemType: "Hotel", isVeg: true, imageUrl: "assets/white_sauce_pasta.png", isChefSpecial: true },
    { name: "Veggie Burger", price: 150, itemType: "Hotel", isVeg: true, imageUrl: "assets/veggie_burger.png", isChefSpecial: false },

    // --- MESS ITEMS ---
    { name: "Standard Veg Thali", price: 120, itemType: "Mess", isVeg: true, imageUrl: "assets/standard_veg_thali.png", isChefSpecial: false },
    { name: "Deluxe Veg Thali", price: 180, itemType: "Mess", isVeg: true, imageUrl: "assets/deluxe_veg_thali.png", isChefSpecial: true },
    { name: "Dal Makhani & Rice", price: 140, itemType: "Mess", isVeg: true, imageUrl: "assets/dal_makhani.png", isChefSpecial: false },
    { name: "Chole Masala Combo", price: 130, itemType: "Mess", isVeg: true, imageUrl: "assets/chole_masala.png", isChefSpecial: false },
    { name: "Puri Bhaji", price: 90, itemType: "Mess", isVeg: true, imageUrl: "assets/puri_bhaji.png", isChefSpecial: false },

    // --- HOMEMADE ITEMS ---
    { name: "Aloo Paratha (2pcs)", price: 80, itemType: "Homemade", isVeg: true, imageUrl: "assets/butter_naan.png", isChefSpecial: true },
    { name: "Curd Rice", price: 90, itemType: "Homemade", isVeg: true, imageUrl: "assets/curd_rice.png", isChefSpecial: false },
    { name: "Paneer Tikka Starter", price: 160, itemType: "Homemade", isVeg: true, imageUrl: "assets/paneer_tikka.png", isChefSpecial: false },
    { name: "Gulab Jamun (2pcs)", price: 50, itemType: "Homemade", isVeg: true, imageUrl: "assets/gulab_jamun.png", isChefSpecial: false },
    { name: "Palak Paneer", price: 170, itemType: "Homemade", isVeg: true, imageUrl: "assets/palak_paneer.png", isChefSpecial: true }
];

async function seed() {
    console.log('🚀 Starting Robust Seeding...');

    // 1. Register Vendors
    const vendorIds = {};

    for (const vendor of vendors) {
        console.log(`Registering vendor: ${vendor.name}...`);

        // Try login first to get ID if already exists
        let res = await request('POST', '/auth/login', { phone: vendor.phone, password: vendor.password });

        if (!res.data.success) {
            // Register
            res = await request('POST', '/auth/register', vendor);
            if (res.data.success) {
                // Login to get ID
                res = await request('POST', '/auth/login', { phone: vendor.phone, password: vendor.password });
            }
        }

        if (res.data.success && res.data.user) {
            vendorIds[vendor.role] = res.data.user.userId;
            console.log(`✅ Vendor ${vendor.role} ID: ${res.data.user.userId}`);
        } else {
            console.error(`❌ Failed to get vendor for ${vendor.role}:`, res.data);
        }
    }

    // 2. Add Menu Items
    let successCount = 0;
    for (const item of menuItems) {
        // Assign correct vendor ID based on item type
        item.vendorId = vendorIds[item.itemType];

        if (!item.vendorId) {
            console.warn(`⚠️ Skipping ${item.name}: No vendor for ${item.itemType}`);
            continue;
        }

        item.description = `Delicious ${item.name} from ${item.itemType}`;
        item.isAvailable = true;

        const res = await request('POST', '/menu', item);
        if (res.data && res.data.success) {
            console.log(`✅ Added: ${item.name}`);
            successCount++;
        } else {
            console.error(`❌ Failed: ${item.name}`, res.data || res.raw);
        }
    }

    console.log(`\n✨ Seeding Complete! Added ${successCount} items.`);
}

seed();
