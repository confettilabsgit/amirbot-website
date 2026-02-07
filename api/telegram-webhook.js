// api/telegram-webhook.js
// Receives your replies from Telegram and stores them

// Simple in-memory storage (resets on cold start, but works for MVP)
// For production, use Vercel KV or a database
const replies = new Map();

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const update = req.body;
        
        // Check if this is a message from you (not from the bot)
        if (update.message && update.message.text && !update.message.from.is_bot) {
            const messageText = update.message.text;
            const chatId = update.message.chat.id.toString();
            
            // Check if this is YOUR chat ID
            if (chatId === process.env.TELEGRAM_CHAT_ID) {
                // Extract session ID if the message is a reply
                // Or just store as the latest reply for now
                const replyText = messageText;
                
                // Store the reply with timestamp
                const replyData = {
                    text: replyText,
                    timestamp: Date.now(),
                    messageId: update.message.message_id
                };
                
                // Store as "latest reply" - simple approach
                replies.set('latest', replyData);
                
                console.log('Stored reply:', replyData);
            }
        }
        
        return res.status(200).json({ ok: true });
        
    } catch (error) {
        console.error('Webhook error:', error);
        return res.status(200).json({ ok: true }); // Always return 200 to Telegram
    }
};

// Export the replies map for other functions to access
module.exports.replies = replies;
