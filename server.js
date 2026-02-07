const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// Serve static files
function serveFile(res, filePath, contentType) {
    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(500);
            res.end('Error loading file');
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
}

// Handle chat API
async function handleChatAPI(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    
    req.on('end', async () => {
        try {
            const { message } = JSON.parse(body);
            
            // TODO: Forward to OpenClaw/Telegram bot
            // For now, simple echo response
            const response = {
                response: `Thanks for your message: "${message}". I'm still being connected to my brain! Check back soon. 🤖`
            };
            
            res.writeHead(200, { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(JSON.stringify(response));
            
        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid request' }));
        }
    });
}

// Create server
const server = http.createServer((req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    // Route handling
    if (req.url === '/' || req.url === '/index.html') {
        serveFile(res, path.join(__dirname, 'index.html'), 'text/html');
    } else if (req.url === '/style.css') {
        serveFile(res, path.join(__dirname, 'style.css'), 'text/css');
    } else if (req.url === '/script.js') {
        serveFile(res, path.join(__dirname, 'script.js'), 'application/javascript');
    } else if (req.url === '/api/chat' && req.method === 'POST') {
        handleChatAPI(req, res);
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`🤖 AmirBot website running at:`);
    console.log(`   Local: http://localhost:${PORT}`);
    console.log(`   Network: http://10.0.0.47:${PORT}`);
    console.log(`\nPress Ctrl+C to stop`);
});
