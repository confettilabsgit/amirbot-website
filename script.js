const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');

// API endpoints
const API_ENDPOINT = '/api/chat';
const REPLY_ENDPOINT = '/api/get-reply';

// Store session ID and tracking
let currentSessionId = null;
let pollingInterval = null;
let lastReceivedMessageId = 0;

// Add message to chat
function addMessage(text, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = isUser ? '👤' : '🤖';
    
    const content = document.createElement('div');
    content.className = 'message-content';
    
    const text_p = document.createElement('p');
    text_p.textContent = text;
    content.appendChild(text_p);
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Show typing indicator
function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message';
    typingDiv.id = 'typing-indicator';
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = '🤖';
    
    const content = document.createElement('div');
    content.className = 'message-content';
    
    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.innerHTML = '<span></span><span></span><span></span>';
    
    content.appendChild(indicator);
    typingDiv.appendChild(avatar);
    typingDiv.appendChild(content);
    
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Remove typing indicator
function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
        indicator.remove();
    }
}

// Poll for replies from Amir
async function checkForReply() {
    if (!currentSessionId) return;
    
    try {
        const response = await fetch(`${REPLY_ENDPOINT}?sessionId=${currentSessionId}&lastMsgId=${lastReceivedMessageId}`);
        const data = await response.json();
        
        if (data.hasReply) {
            // Remove any existing typing indicator
            removeTypingIndicator();
            
            // Show Amir's reply
            addMessage(data.reply);
            
            // Track this message so we don't show it again
            if (data.messageId) {
                lastReceivedMessageId = data.messageId;
            }
            
            // Keep polling for additional replies (don't stop)
            // Now supports multi-turn conversations!
        }
    } catch (error) {
        console.error('Error checking for reply:', error);
    }
}

// Start polling for replies
function startPolling() {
    // Stop any existing polling
    if (pollingInterval) {
        clearInterval(pollingInterval);
    }
    
    // Poll every 3 seconds
    pollingInterval = setInterval(checkForReply, 3000);
    
    // Also check immediately
    checkForReply();
}

// Send message
async function sendMessage() {
    const message = messageInput.value.trim();
    if (!message) return;
    
    // Add user message
    addMessage(message, true);
    messageInput.value = '';
    
    // Show typing
    showTypingIndicator();
    
    try {
        // Send to backend
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        });
        
        const data = await response.json();
        
        // Store session ID
        currentSessionId = data.sessionId;
        
        // Remove typing and show initial response
        removeTypingIndicator();
        addMessage(data.response || 'Message sent! Waiting for Amir to reply...');
        
        // Start polling for Amir's actual reply
        startPolling();
        
    } catch (error) {
        removeTypingIndicator();
        addMessage('Oops! Something went wrong. Please try again.');
        console.error('Error:', error);
    }
}

// Event listeners
sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Focus input on load
messageInput.focus();

// Clean up polling when page is closed
window.addEventListener('beforeunload', () => {
    if (pollingInterval) {
        clearInterval(pollingInterval);
    }
});
