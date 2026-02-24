const http = require('http');

const payload = JSON.stringify({
    phone: "9999999999",
    password: "password123",
    name: "Test User",
    role: "Customer"
});

const options = {
    hostname: 'localhost',
    port: 9090,
    path: '/api/auth/register',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': payload.length
    }
};

console.log('Testing Register API...');

const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log(`Status Code: ${res.statusCode}`);
        console.log(`Response Body: ${data}`);
    });
});

req.on('error', (error) => {
    console.error('Network Error:', error);
});

req.write(payload);
req.end();
