const http = require('http');

const item = {
    name: "Debug Paneer",
    description: "Debugging",
    price: 100,
    itemType: "Hotel",
    isVeg: true,
    imageUrl: "assets/debug.png",
    vendorId: "vendor_debug",
    isAvailable: true,
    isChefSpecial: true
};

function postItem(item) {
    const data = JSON.stringify(item);

    const options = {
        hostname: 'localhost',
        port: 9090,
        path: '/api/menu',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    const req = http.request(options, (res) => {
        let responseBody = '';

        res.on('data', (chunk) => {
            responseBody += chunk;
        });

        res.on('end', () => {
            console.log(`Status: ${res.statusCode}`);
            console.log(`Body: ${responseBody}`);
        });
    });

    req.on('error', (error) => {
        console.error('Request Error:', error);
    });

    req.write(data);
    req.end();
}

console.log('Running debug seed...');
postItem(item);
