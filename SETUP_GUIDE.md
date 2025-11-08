# Step-by-Step Setup Guide for Multiplayer Peer Mentor Game

## 📋 Prerequisites Check

Before starting, make sure you have:
- [ ] Node.js version 18 or higher installed
- [ ] npm or yarn installed
- [ ] A code editor (VS Code recommended)
- [ ] Two browser windows/tabs for testing multiplayer

**Check your Node.js version:**
```bash
node --version
# Should show v18.x.x or higher
```

---

## 🚀 Step 1: Clone and Navigate to Project

```bash
# Clone the repository
git clone https://github.com/Rongavilla/peer-mentor-game.git

# Navigate into the project folder
cd peer-mentor-game

# Verify you're in the right directory
pwd
# Should show: .../peer-mentor-game
```

---

## 📦 Step 2: Install Dependencies

```bash
# Install all required packages
npm install

# Wait for installation to complete
# This may take 2-3 minutes
```

**What this does:** Installs socket.io, openai, phaser, react, and other dependencies.

---

## ⚙️ Step 3: Set Up Environment Variables

```bash
# Copy the example environment file
cp .env.example .env.local

# Verify the file was created
ls -la | grep .env
# You should see both .env.example and .env.local
```

**Optional:** Edit `.env.local` to add your OpenAI API key:
```bash
# Open in your editor
nano .env.local
# or
code .env.local
```

**Your `.env.local` should contain:**
```bash
# OpenAI Configuration (optional - app works without it)
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-3.5-turbo

# WebSocket Server Configuration
WEBSOCKET_PORT=3001
NEXT_PUBLIC_WEBSOCKET_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Room Settings
MAX_PLAYERS_PER_ROOM=10
DEFAULT_ROOM_TIMEOUT=3600000
```

**Note:** The app works WITHOUT an OpenAI API key - it will use fallback responses.

---

## 🖥️ Step 4: Start Both Servers

**Option A: Start Both Servers Together (Recommended)**

```bash
# This starts both Next.js and WebSocket server together
npm run dev:all
```

**You should see output like:**
```
[0] > peer-mentor-game@1.0.0 dev
[0] > next dev
[1] > peer-mentor-game@1.0.0 dev:server
[1] > ts-node server/gameServer.ts
[0] ready - started server on 0.0.0.0:3000, url: http://localhost:3000
[1] 🎮 Game server running on port 3001
```

**Option B: Start Servers Separately (If Option A doesn't work)**

Open TWO terminal windows:

**Terminal 1 - WebSocket Server:**
```bash
npm run dev:server
```
Wait for: `🎮 Game server running on port 3001`

**Terminal 2 - Next.js Frontend:**
```bash
npm run dev
```
Wait for: `ready - started server on 0.0.0.0:3000`

---

## 🌐 Step 5: Open the Application

1. Open your browser
2. Navigate to: `http://localhost:3000`
3. You should see the lobby screen with "CodeQuest Academy" title

**If you see a connection error:**
- Make sure BOTH servers are running (check both terminals)
- Look for the green connection indicator dot in the lobby
- Check browser console (F12) for error messages

---

## 🎮 Step 6: Create Your First Room

1. **Enter your name** in the "Your Name" field (e.g., "Player1")
2. **Enter a room name** (e.g., "Test Room")
3. Click **"Create & Join Room"**
4. You should enter the game world

**What you should see:**
- Your player (blue square) in the center
- Your name label above your player
- Player list on the right showing your name
- AI Chat widget at the bottom left
- Three NPC mentors (green squares) on the map

---

## 👥 Step 7: Test Multiplayer (2 Players)

### Browser 1 (You're already here):
1. Look at the Player List on the right
2. Note the room ID (shown in the player list header)

### Browser 2 (Open in incognito or new browser):
1. Open `http://localhost:3000` in incognito mode (Ctrl+Shift+N / Cmd+Shift+N)
2. Enter a different name (e.g., "Player2")
3. Click the **"Join Room"** tab
4. Enter the room ID from Browser 1
5. Click **"Join Room"**

**What should happen:**
- Browser 2 joins the game
- Both browsers show BOTH players
- Move in one browser → see movement in the other
- Both player lists show both players

---

## 🤖 Step 8: Test AI Chat

1. Click the **"+"** button on the AI Chat widget (bottom left)
2. Type a message: "What is Python?"
3. Click **"Send"**
4. Wait 1-3 seconds for AI response

**What should happen:**
- Your message appears in the chat
- AI Mentor responds with helpful information
- ALL players in the room see the AI responses

**Without OpenAI API key:**
- You'll see: "AI Mentor is currently unavailable. Please set up your OpenAI API key."
- This is normal and expected!

---

## 🕹️ Step 9: Test Player Movement

1. Use **Arrow Keys** to move your player around
2. Your player (blue square) should move smoothly
3. Other players should see your movement in real-time
4. Try clicking on the NPC mentors (green squares) to start learning sessions

---

## ✅ Verification Checklist

Make sure everything works:

- [ ] Both servers are running (check terminals)
- [ ] Browser shows lobby at http://localhost:3000
- [ ] Green connection indicator shows "Connected to server"
- [ ] Can create a room successfully
- [ ] Player appears in the game
- [ ] Player list shows your name
- [ ] Can move with arrow keys
- [ ] AI Chat widget appears
- [ ] Can send messages in AI chat
- [ ] Second browser can join the same room
- [ ] Both players see each other
- [ ] Movement syncs between browsers

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot connect to server" (Red dot)

**Solution:**
```bash
# 1. Stop everything (Ctrl+C in all terminals)

# 2. Check if ports are free
lsof -i :3000  # Mac/Linux
lsof -i :3001  # Mac/Linux

# Windows:
netstat -ano | findstr :3000
netstat -ano | findstr :3001

# 3. Kill any processes using these ports

# 4. Restart both servers
npm run dev:all
```

### Issue: "Port 3000 already in use"

**Solution:**
```bash
# Kill the process
lsof -i :3000  # Note the PID
kill -9 <PID>  # Replace <PID> with actual number

# Or change the port in package.json:
"dev": "next dev -p 3002"
```

### Issue: "Module not found" errors

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Issue: Players don't see each other

**Solution:**
1. Verify both players joined the SAME room ID
2. Check both browsers show "Connected" (green dot)
3. Refresh both browsers and rejoin
4. Check browser console (F12) for errors

### Issue: AI not responding

**Solution:**
- This is expected without an OpenAI API key
- To use AI: Add your API key to `.env.local`
- Or just use the fallback responses

---

## 📱 Testing on Different Devices

**On the same network:**
1. Find your local IP address:
   ```bash
   # Mac/Linux
   ifconfig | grep "inet "
   
   # Windows
   ipconfig
   ```

2. Update `.env.local`:
   ```bash
   NEXT_PUBLIC_WEBSOCKET_URL=http://YOUR_IP:3001
   NEXT_PUBLIC_APP_URL=http://YOUR_IP:3000
   ```

3. On other device, navigate to: `http://YOUR_IP:3000`

---

## 🎯 Next Steps

Once everything is working:

1. **Try creating multiple rooms** - Each room is independent
2. **Test with more players** - Up to 10 per room
3. **Explore the game** - Click on NPC mentors
4. **Check the documentation:**
   - `README.md` - Full documentation
   - `TESTING.md` - Comprehensive test scenarios
   - `IMPLEMENTATION.md` - Technical details

---

## 🆘 Still Having Issues?

If you're still stuck:

1. **Check the console logs:**
   - Browser console (F12 → Console tab)
   - Terminal output from both servers

2. **Verify file contents:**
   ```bash
   cat .env.local  # Check environment variables
   ```

3. **Check what's running:**
   ```bash
   ps aux | grep node  # See all Node processes
   ```

4. **Full reset:**
   ```bash
   # Stop all servers
   # Delete everything
   rm -rf node_modules .next
   
   # Reinstall
   npm install
   
   # Restart
   npm run dev:all
   ```

---

## 📞 Getting Help

Include this information when asking for help:

```bash
# System info
node --version
npm --version
cat .env.local

# Error messages from terminals
# Error messages from browser console (F12)
# Screenshots of the issue
```

---

**You're all set! Enjoy building the future of IT mentorship!** 🎮✨
