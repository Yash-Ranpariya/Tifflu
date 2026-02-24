const http = require('http');

const options = {
    hostname: 'localhost',
    port: 9090,
    path: '/api/auth/ping',
    method: 'GET'
};

console.log('Testing Ping API...');

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

req.end();
