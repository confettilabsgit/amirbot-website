// Vercel Serverless Function for Chat API
const https = require('https');

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Send message to Telegram
function sendToTelegram(text, sessionId) {
    const data = JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: `🌐 Website Visitor:\n\n${text}\n\n---\nSession: ${sessionId}`,
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

module.exports = async (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }
        
        // Check if env vars are set
        if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
            console.error('Missing environment variables:', {
                hasToken: !!TELEGRAM_BOT_TOKEN,
                hasChatId: !!TELEGRAM_CHAT_ID
            });
            return res.status(500).json({ 
                error: 'Server configuration error',
                response: "Thanks for your message! The bot is being configured. Check back soon! 🤖"
            });
        }
        
        // Generate session ID
        const sessionId = Date.now().toString();
        
        // Forward to Telegram
        await sendToTelegram(message, sessionId);
        
        return res.status(200).json({ 
            response: "Thanks for your message! Amir will get back to you shortly. 📱",
            sessionId: sessionId
        });
        
    } catch (error) {
        console.error('Chat API error:', error);
        return res.status(500).json({ 
            error: error.message,
            response: "Sorry, something went wrong. Please try again! 🤖"
        });
    }
};
