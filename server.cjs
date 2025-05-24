const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const app = express();

app.get('/subtitle', async (req, res) => {
    const subtitleUrl = req.query.url;

    if (!subtitleUrl || !subtitleUrl.endsWith('.vtt')) {
        return res.status(400).send('Invalid subtitle URL');
    }

    try {
        const response = await fetch(subtitleUrl);
        if (!response.ok) {
            return res.status(500).send('Failed to fetch subtitle: ' + response.statusText);
        }

        const vttText = await response.text();

        res.set({
            'Content-Type': 'text/vtt',
            'Access-Control-Allow-Origin': '*',
            'Cross-Origin-Resource-Policy': 'cross-origin',
        });

        res.send(vttText);
    } catch (err) {
        console.error('Proxy error:', err);
        res.status(500).send('Proxy server error: ' + err.message);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Subtitle proxy running on port ${PORT}`);
});
