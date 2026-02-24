const http = require('http');

const payload = JSON.stringify({
    phone: "9000000001",
    password: "password"
});

const options = {
    hostname: 'localhost',
    port: 9090,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': payload.length
    }
};

console.log('Testing Login API...');

const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log(`Status Code: ${res.statusCode}`);
        try {
            const json = JSON.parse(data);
            console.log('--- ERROR DETAILS ---');
            console.log('Error Message:', json.message);
            console.log('Exception Class:', json.error);
            console.log('--- FULL RESPONSE ---');
            console.log(JSON.stringify(json, null, 2));
        } catch (e) {
            console.log('Raw Response Body:', data);
        }
    });
});

req.on('error', (error) => {
    console.error('Network Error:', error);
});

req.write(payload);
req.end();
