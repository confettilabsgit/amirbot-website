// api/telegram-webhook.js
// Receives your replies from Telegram and stores them in KVdb

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
                const replyData = {
                    text: messageText,
                    timestamp: Date.now(),
                    messageId: update.message.message_id
                };
                
                // Store in KVdb (free external storage)
                const kvdbUrl = 'https://kvdb.io/9LmYr6YNVSUVgvXMNpP4d5/amirbot_latest_reply';
                
                await fetch(kvdbUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(replyData),
                });
                
                console.log('Stored reply in KVdb:', replyData);
            }
        }
        
        return res.status(200).json({ ok: true });
        
    } catch (error) {
        console.error('Webhook error:', error);
        return res.status(200).json({ ok: true }); // Always return 200 to Telegram
    }
};
