const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || 'YOUR_CHAT_ID_HERE';

// Store active conversations (website session ID -> telegram message ID)
const conversations = new Map();

// Send message to Telegram
function sendToTelegram(text, sessionId) {
    const data = JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: `🌐 Website Visitor:\n\n${text}\n\n---\nSession: ${sessionId}`,
        reply_markup: {
            inline_keyboard: [[
                { text: '💬 Reply', callback_data: `reply_${sessionId}` }
            ]]
        }
    });

    const options = {
        hostname: 'api.telegram.org',
        path: `/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(body));
                } catch (e) {
                    reject(e);
                }
            });
        });
        req.on('error', reject);
        req.write(data);
        req.end();
    });
}

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
            const { message, sessionId } = JSON.parse(body);
            
            // Generate session ID if not provided
            const session = sessionId || Date.now().toString();
            
            // Forward to Telegram
            await sendToTelegram(message, session);
            
            // Store conversation
            conversations.set(session, { lastMessage: message, timestamp: Date.now() });
            
            res.writeHead(200, { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(JSON.stringify({ 
                response: "Thanks for your message! Amir will get back to you shortly. 📱",
                sessionId: session
            }));
            
        } catch (error) {
            console.error('Chat error:', error);
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

server.listen(PORT, () => {
    console.log(`🤖 AmirBot website running on port ${PORT}`);
    console.log(`Telegram bot token: ${TELEGRAM_BOT_TOKEN ? 'Configured ✓' : 'NOT SET ✗'}`);
    console.log(`Telegram chat ID: ${TELEGRAM_CHAT_ID ? 'Configured ✓' : 'NOT SET ✗'}`);
});
