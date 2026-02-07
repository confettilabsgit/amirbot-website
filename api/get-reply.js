// api/get-reply.js
// Website polls this to check if you've replied

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
        
        // Fetch from KVdb
        const kvdbUrl = 'https://kvdb.io/9LmYr6YNVSUVgvXMNpP4d5/amirbot_latest_reply';
        
        const response = await fetch(kvdbUrl);
        
        if (!response.ok) {
            return res.status(200).json({ 
                hasReply: false 
            });
        }
        
        const latestReply = await response.json();
        
        if (!latestReply || !latestReply.text) {
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
        
        // Return the reply and delete it from KVdb (so it's only sent once)
        await fetch(kvdbUrl, { method: 'DELETE' });
        
        return res.status(200).json({ 
            hasReply: true,
            reply: latestReply.text,
            timestamp: latestReply.timestamp
        });
        
    } catch (error) {
        console.error('Get reply error:', error);
        return res.status(200).json({ 
            hasReply: false,
            error: 'Internal server error' 
        });
    }
};
