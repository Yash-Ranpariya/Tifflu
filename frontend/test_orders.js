const http = require('http');

const options = {
    hostname: 'localhost',
    port: 9090,
    path: '/api/orders?userId=530fe2e5-be45-9e84a', // Using the ID from previous login test
    method: 'GET',
};

const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log(`Status Code: ${res.statusCode}`);
        try {
            const json = JSON.parse(data);
            console.log('--- RESPONSE DATA ---');
            console.log(JSON.stringify(json, null, 2));
        } catch (e) {
            console.log('Raw Response Body:', data);
        }
    });
});

req.on('error', (error) => {
    console.error('Error:', error);
});

req.end();
