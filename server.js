const express = require('express');
const http = require('http');
const https = require('https');
const url = require('url');

const app = express();
const PORT = process.env.PORT || 3000;

// Replace with your actual .ts stream URL
const TARGET_STREAM_URL = 'http://cf.futuremyprovt.com:80/play/live.php?mac=00:1B:79:F8:91:52&stream=1992063&extension=ts&play_token=QcJ8LgFNB1';

app.get('/proxy-stream', (req, res) => {
    const parsedUrl = url.parse(TARGET_STREAM_URL);
    const client = parsedUrl.protocol === 'https:' ? https : http;

    const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port,
        path: parsedUrl.path,
        headers: {
            'User-Agent': 'VLC/3.0.18 LibVLC/3.0.18',
            'Accept': '*/*'
        }
    };

    client.get(options, (proxyRes) => {
        res.writeHead(proxyRes.statusCode, {
            'Content-Type': 'video/mp2t',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-cache'
        });
        proxyRes.pipe(res);
    }).on('error', (err) => {
        console.error('Proxy error:', err);
        res.status(500).send('Stream proxy failed');
    });
});

app.listen(PORT, () => {
    console.log(`Proxy running on port ${PORT}`);
});
