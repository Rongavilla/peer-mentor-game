# Quick Start Guide

## 🚀 Get Started in 3 Minutes

### Step 1: Setup (1 minute)
```bash
# Clone and install
git clone https://github.com/Rongavilla/peer-mentor-game.git
cd peer-mentor-game
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local and add your OpenAI API key (optional)
```

### Step 2: Run (30 seconds)
```bash
# Option A: Quick start (runs both servers)
./start.sh

# Option B: Manual start
npm run dev:all
```

### Step 3: Play (1 minute)
1. Open http://localhost:3000 in your browser
2. Enter your name (e.g., "Player1")
3. Click "Create & Join Room"
4. Start playing!

## 🎮 Testing Multiplayer

### Test with 2 Players
1. **Browser 1**: Create a room as "Player1"
2. **Browser 2**: Open http://localhost:3000 in incognito/new browser
3. **Browser 2**: Join the same room ID
4. Move around and see each other in real-time!

## 🤖 Testing AI Chat
1. Click the "+" button on the AI chat widget
2. Type: "What is Python?"
3. Get instant AI mentor response
4. All players in the room see the AI responses!

## 📋 Requirements
- Node.js 18+
- npm or yarn
- OpenAI API key (optional - works without it, just with limited AI responses)

## ⚙️ Configuration

### Essential Settings (.env.local)
```bash
# Required for AI features (optional - app works without it)
OPENAI_API_KEY=sk-your-key-here

# Server settings (defaults work fine)
WEBSOCKET_PORT=3001
NEXT_PUBLIC_WEBSOCKET_URL=http://localhost:3001
```

### Optional Settings
```bash
# Customize AI model
OPENAI_MODEL=gpt-3.5-turbo  # or gpt-4

# Adjust player limits
MAX_PLAYERS_PER_ROOM=10

# Change room timeout (in milliseconds)
DEFAULT_ROOM_TIMEOUT=3600000  # 1 hour
```

## 🎯 Features at a Glance

### Multiplayer
- ✅ 2-10 players per room
- ✅ Real-time movement sync
- ✅ Player list with names
- ✅ Create/join rooms
- ✅ Auto-cleanup

### AI Mentor
- ✅ Chat with AI anytime
- ✅ Get learning tips
- ✅ Shared AI responses
- ✅ Works offline (limited)

### Game Features
- ✅ RPG-style world map
- ✅ NPC mentors
- ✅ Learning quests
- ✅ Beautiful UI

## 🐛 Troubleshooting

### "Cannot connect to server" or "localhost not working"
```bash
# 1. Ensure .env.local exists with correct settings
cp .env.example .env.local

# 2. Verify both servers are running:
# Terminal 1: Next.js (localhost:3000)
npm run dev

# Terminal 2: WebSocket server (localhost:3001)
npm run dev:server

# OR run both together:
npm run dev:all

# 3. Check if ports are available
# On Mac/Linux:
lsof -i :3000
lsof -i :3001

# On Windows:
netstat -ano | findstr :3000
netstat -ano | findstr :3001

# 4. If ports are in use, kill the processes or change ports in .env.local
```

### "Connection refused" or "ERR_CONNECTION_REFUSED"
```bash
# Make sure the WebSocket server is running BEFORE opening the app
npm run dev:server   # Start this first
npm run dev          # Then start Next.js

# Or use the combined command:
npm run dev:all
```

### "AI not responding"
```bash
# Check your API key in .env.local
# Or use without it - AI will give default responses
```

### Build errors
```bash
# Clear cache and reinstall
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

### Port already in use
```bash
# Change ports in .env.local:
WEBSOCKET_PORT=3002
NEXT_PUBLIC_WEBSOCKET_URL=http://localhost:3002

# Or kill existing processes:
# On Mac/Linux: kill -9 <PID>
# On Windows: taskkill /PID <PID> /F
```

## 📚 Learn More

- **Full Documentation**: See [README.md](README.md)
- **Testing Guide**: See [TESTING.md](TESTING.md)
- **Implementation Details**: See [IMPLEMENTATION.md](IMPLEMENTATION.md)

## 🆘 Need Help?

1. Check [TESTING.md](TESTING.md) for comprehensive testing scenarios
2. Read [README.md](README.md) for detailed documentation
3. Check console for error messages
4. Verify all environment variables are set

## ✨ Next Steps

After getting it running:
1. Try creating multiple rooms
2. Test with friends in different browsers
3. Explore AI chat features
4. Check out the game mechanics
5. Customize settings to your needs

**Enjoy building the future of IT mentorship!** 🎮🚀
