const http = require('http');

const options = {
    hostname: 'localhost',
    port: 9090,
    path: '/api/menu',
    method: 'GET'
};

const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        if (res.statusCode === 200) {
            try {
                const items = JSON.parse(data);
                console.log(`✅ API returned ${items.length} items.`);
                if (items.length > 0) {
                    console.log('Sample item:', items[0]);
                }
            } catch (e) {
                console.error('❌ Failed to parse JSON:', e);
            }
        } else {
            console.error(`❌ API Error: ${res.statusCode}`);
        }
    });
});

req.on('error', (error) => {
    console.error('❌ Request Failed:', error);
});

req.end();
