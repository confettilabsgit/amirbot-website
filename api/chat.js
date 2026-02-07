// Vercel Serverless Function for Chat API
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

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
            return res.status(400).json({ 
                error: 'Message is required',
                response: "Please enter a message! 💬"
            });
        }
        
        // Check if env vars are set
        if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
            console.error('Missing environment variables:', {
                hasToken: !!TELEGRAM_BOT_TOKEN,
                hasChatId: !!TELEGRAM_CHAT_ID
            });
            return res.status(500).json({ 
                response: "Bot is being configured. Check back soon! 🤖"
            });
        }
        
        // Generate session ID (shorter format)
        const sessionId = Date.now().toString().slice(-6);
        
        // Forward to Telegram with prominent session ID
        let telegramSuccess = false;
        let telegramError = null;
        try {
            // Enhanced message with clear session identifier
            const enhancedMessage = `🆔 SESSION: #${sessionId}\n━━━━━━━━━━━━━━━━\n${message}\n━━━━━━━━━━━━━━━━\n💬 Reply to this person by typing your message.\nInclude #${sessionId} to reply to this specific visitor.`;
            
            await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHAT_ID,
                    text: enhancedMessage,
                }),
            });
            
            console.log(`Message sent to Telegram. Session: ${sessionId}`);
            telegramSuccess = true;
        } catch (error) {
            console.error('Telegram send error:', error);
            telegramError = error.message;
        }
        
        return res.status(200).json({ 
            response: "Thanks for your message! Amir will get back to you shortly. 📱",
            sessionId: sessionId,
            debug: {
                telegramSuccess,
                telegramError,
                hasToken: !!TELEGRAM_BOT_TOKEN,
                hasChatId: !!TELEGRAM_CHAT_ID
            }
        });
        
    } catch (error) {
        console.error('Chat API error:', error);
        return res.status(200).json({ 
            response: "Message received! There was a small hiccup but we got it. 🤖"
        });
    }
};
