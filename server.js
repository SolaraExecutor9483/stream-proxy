const express = require('express');
const http = require('http');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 3000;

// Your insecure HTTP stream URL
const TARGET_STREAM_URL = 'http://cf.futuremyprovt.com:80/play/live.php?mac=00:1B:79:F8:91:52&stream=1992063&extension=ts&play_token=QcJ8LgFNB1';

app.get('/proxy-stream', (req, res) => {
    const client = TARGET_STREAM_URL.startsWith('https') ? https : http;

    client.get(TARGET_STREAM_URL, (proxyRes) => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res);
    }).on('error', (err) => {
        console.error('Proxy error:', err);
        res.status(500).send('Stream proxy failed');
    });
});

app.listen(PORT, () => {
    console.log(`Proxy running on port ${PORT}`);
});
