// api/get-reply.js
// Website polls this to check if you've replied

// Import the shared replies storage
// Note: In Vercel, each function instance has its own memory
// For production, use proper storage (Vercel KV, Redis, etc.)

// Temporary storage (shared within the same instance)
const replies = global.replyStorage || (global.replyStorage = new Map());

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
        const { sessionId } = req.query;
        
        // Get the latest reply
        const latestReply = replies.get('latest');
        
        if (!latestReply) {
            return res.status(200).json({ 
                hasReply: false 
            });
        }
        
        // Check if this reply is recent (within last 5 minutes)
        const age = Date.now() - latestReply.timestamp;
        const maxAge = 5 * 60 * 1000; // 5 minutes
        
        if (age > maxAge) {
            return res.status(200).json({ 
                hasReply: false 
            });
        }
        
        // Return the reply and clear it (so it's only sent once)
        replies.delete('latest');
        
        return res.status(200).json({ 
            hasReply: true,
            reply: latestReply.text,
            timestamp: latestReply.timestamp
        });
        
    } catch (error) {
        console.error('Get reply error:', error);
        return res.status(500).json({ 
            hasReply: false,
            error: 'Internal server error' 
        });
    }
};
