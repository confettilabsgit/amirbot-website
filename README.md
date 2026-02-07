# AmirBot Website 🤖

A cute, interactive website where people can chat with AmirBot!

## Features

✨ **Animated Robot Character** - A friendly, floating robot with blinking antenna
💬 **Real-time Chat Interface** - Smooth, beautiful chat experience
🎨 **Modern Design** - Gradient backgrounds, smooth animations
📱 **Responsive** - Works on mobile and desktop

## Character Design

**AmirBot** is a cute blue robot with:
- Floating head animation
- Blinking red antenna
- Moving eyes that look around
- Happy smile
- Smooth gradient colors (cyan to blue)

## How to Run

### Quick Start
```bash
cd /root/.openclaw/workspace/amirbot-website
node server.js
```

Then visit: http://localhost:3000

### From Anywhere
```bash
node /root/.openclaw/workspace/amirbot-website/server.js
```

## Files

- `index.html` - Main page structure
- `style.css` - All the styling and animations
- `script.js` - Chat functionality (frontend)
- `server.js` - Simple Node.js server
- `README.md` - This file

## Next Steps

### To Connect to Your Telegram Bot:

1. **Option A: Direct Telegram Integration**
   - Update `server.js` to forward messages to Telegram API
   - Use your bot token: `8158695038:AAHrfQAaT2nW5gJlkQXMr_PcjeFQ29GbFDg`

2. **Option B: OpenClaw Session Integration**
   - Forward messages through OpenClaw sessions
   - Responses come back through the same session

3. **Option C: Webhook Setup**
   - Set up a webhook that Telegram calls
   - Messages go both ways automatically

## Customization

### Change Colors
Edit `style.css`:
- Robot: `.robot-head` gradient
- Buttons: `#sendButton` gradient
- Background: `body` gradient

### Change Character
The robot is pure CSS! Edit the `.robot-head` section to:
- Make it bigger/smaller
- Change expressions
- Add accessories

### Add Features
Ideas:
- Voice input
- File uploads
- Emoji picker
- Theme switcher

## Deployment

### Local Network
Already accessible at: `http://10.0.0.47:3000`

### Public (Need to Set Up):
1. Use nginx reverse proxy
2. Get domain name
3. Set up SSL/HTTPS
4. Configure firewall

## Tech Stack

- Pure HTML/CSS/JS (no frameworks!)
- Node.js backend
- Animated CSS character
- REST API for chat

---

Built with ❤️ using OpenClaw
