const express = require('express');
const cors = require('cors');
const path = require('path');

// Load environment variables from .env (if present)
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static('.'));

// Proxy endpoint that forwards requests to the Google Generative Language API
// The server reads the API key from process.env.GOOGLE_API_KEY and forwards
// the client's request body to the Google endpoint. This keeps the key out
// of client-side code.
app.post('/api/generate', async (req, res) => {
    try {
        const apiKey = process.env.GOOGLE_API_KEY;
        const apiUrl = process.env.GOOGLE_API_URL || 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

        if (!apiKey) {
            return res.status(500).json({ error: 'Server missing GOOGLE_API_KEY in environment' });
        }

        const url = `${apiUrl}?key=${apiKey}`;

        // Forward the request body to Google's API
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();
        return res.status(response.status).json(data);
    } catch (err) {
        console.error('Error proxying to Google API:', err);
        return res.status(500).json({ error: err.message || 'Proxy error' });
    }
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server with error handling (graceful message when port is in use)
const server = app.listen(PORT, () => {
    console.log(`Fashion Analyzer AI is running on http://localhost:${PORT}`);
    console.log('Open your browser and navigate to the URL above');
});

server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
        console.error(`Error: Port ${PORT} is already in use.`);
        console.error('Either stop the process using that port or set a different PORT environment variable.');
        console.error('To find and kill the process (Linux/macOS):');
        console.error('  lsof -i :' + PORT + '    # find the PID\n  kill <PID>');
        process.exit(1);
    } else {
        console.error('Server error:', err);
        process.exit(1);
    }
});
