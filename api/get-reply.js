// api/get-reply.js
// Website polls this to check if you've replied
// Checks Telegram directly for your recent messages

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Track the last message we processed to avoid duplicates
let lastProcessedMessageId = global.lastProcessedMsgId || 0;

module.exports = async (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const { sessionId, lastCheck } = req.query;
        
        // Get recent messages from Telegram bot chat
        const updatesUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates?offset=-1&limit=10`;
        
        const response = await fetch(updatesUrl);
        
        if (!response.ok) {
            return res.status(200).json({ hasReply: false });
        }
        
        const data = await response.json();
        
        // Look for messages from you (not from bot) sent recently
        if (data.ok && data.result && data.result.length > 0) {
            for (const update of data.result.reverse()) {
                if (update.message && 
                    update.message.text && 
                    !update.message.from.is_bot &&
                    update.message.chat.id.toString() === TELEGRAM_CHAT_ID) {
                    
                    const messageId = update.message.message_id;
                    const messageTime = update.message.date * 1000; // Convert to ms
                    const now = Date.now();
                    
                    // Check if message is recent (within last 2 minutes)
                    // and we haven't sent it before
                    if (now - messageTime < 2 * 60 * 1000 && messageId > lastProcessedMessageId) {
                        lastProcessedMessageId = messageId;
                        global.lastProcessedMsgId = messageId;
                        
                        return res.status(200).json({
                            hasReply: true,
                            reply: update.message.text,
                            timestamp: messageTime
                        });
                    }
                }
            }
        }
        
        return res.status(200).json({ hasReply: false });
        
    } catch (error) {
        console.error('Get reply error:', error);
        return res.status(200).json({ 
            hasReply: false,
            error: error.message 
        });
    }
};
