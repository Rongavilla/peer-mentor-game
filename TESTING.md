# Testing Guide for Multiplayer & AI Features

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
```bash
cp .env.example .env.local
# Edit .env.local and add your OpenAI API key (optional)
```

## Running the Application

### Option 1: Quick Start
```bash
./start.sh
```

### Option 2: Manual Start
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - WebSocket Server
npm run dev:server
```

## Test Scenarios

### 1. Basic Connection Test
- [ ] Open http://localhost:3000
- [ ] Verify "Connected to server" appears (green dot)
- [ ] Check browser console for connection logs

### 2. Room Creation Test
- [ ] Enter your name (e.g., "Player1")
- [ ] Enter room name (e.g., "Test Room")
- [ ] Click "Create & Join Room"
- [ ] Verify you enter the game
- [ ] Check Player List shows your name
- [ ] Check room name appears in Player List

### 3. Multiplayer Test (2 Browsers)
**Browser 1:**
- [ ] Create a room
- [ ] Note the room ID from the URL or Player List
- [ ] Move around using arrow keys

**Browser 2:**
- [ ] Open http://localhost:3000 in a new browser/incognito window
- [ ] Enter your name (e.g., "Player2")
- [ ] Click "Join Room" tab
- [ ] Enter the room ID from Browser 1
- [ ] Click "Join Room"
- [ ] Verify you see Player1 in the game
- [ ] Verify Player List shows both players
- [ ] Move around and verify Player1 sees your movement

**Both Browsers:**
- [ ] Move simultaneously and verify smooth synchronization
- [ ] Check no lag or position jumps
- [ ] Verify player labels are visible

### 4. AI Chat Test
- [ ] Click the "+" button on AI Chat widget to expand
- [ ] Type a message: "What is Python?"
- [ ] Click "Send"
- [ ] Verify AI responds with helpful information
- [ ] Try another question: "How do I learn JavaScript?"
- [ ] Verify response appears

**Without OpenAI API Key:**
- [ ] AI should still respond with default messages
- [ ] Messages should indicate AI is unavailable but still helpful

### 5. Player Disconnect Test
**Browser 1:**
- [ ] Keep the game open

**Browser 2:**
- [ ] Close the browser tab or window
- [ ] Check Browser 1 Player List
- [ ] Verify Player2 is removed from the list
- [ ] Verify no errors in console

### 6. Game Navigation Test
- [ ] Click "Menu" button in the game
- [ ] Verify you return to menu scene
- [ ] Click "Start Game" again
- [ ] Verify you return to multiplayer world
- [ ] Check Player List still shows connected players

### 7. Load Test (Multiple Players)
- [ ] Open 5+ browser tabs
- [ ] Have each join the same room
- [ ] Verify all players appear
- [ ] Move all players simultaneously
- [ ] Check for performance issues

### 8. Edge Cases

**Long Room Names:**
- [ ] Create room with 30+ character name
- [ ] Verify it displays correctly

**Special Characters:**
- [ ] Use name with emojis: "Player🎮"
- [ ] Use room name with special chars: "Test-Room_123"
- [ ] Verify no errors

**Network Issues:**
- [ ] Stop WebSocket server
- [ ] Check connection indicator turns red
- [ ] Restart server
- [ ] Verify reconnection happens

## Expected Behavior

### Connection
- Green dot = Connected
- Red dot = Disconnected
- Auto-reconnect on server restart

### Player Movement
- Smooth, interpolated movement
- No position jumps
- Updates at ~50ms intervals

### AI Chat
- Responses in 1-3 seconds (with API key)
- Instant responses (without API key)
- All players see AI messages

### Room Management
- Max 10 players per room (configurable)
- Rooms auto-delete when empty
- Room IDs are unique

## Performance Benchmarks

### Acceptable Performance:
- Page load: < 3 seconds
- WebSocket connection: < 1 second
- Player movement latency: < 100ms
- AI response time: < 5 seconds

### Resource Usage:
- Browser memory: < 150MB per tab
- CPU usage: < 10% idle, < 30% active
- Network: < 1KB/s per player

## Troubleshooting

### "Cannot connect to server"
- Ensure WebSocket server is running on port 3001
- Check firewall settings
- Verify NEXT_PUBLIC_WEBSOCKET_URL in .env.local

### "Room not found"
- Room may have been deleted (empty for >1 hour)
- Create a new room instead

### AI not responding
- Check OpenAI API key is set correctly
- Verify API key has credits
- Check browser console for errors

### Players not syncing
- Check both browsers are in the same room
- Verify WebSocket connection is active
- Check browser console for errors

## Success Criteria

All tests pass ✓
- [ ] Single player can create room
- [ ] Multiple players can join same room
- [ ] Players see each other in real-time
- [ ] AI chat works for all players
- [ ] No security vulnerabilities
- [ ] No console errors
- [ ] Performance is acceptable
- [ ] Disconnect/reconnect works properly

## Reporting Issues

When reporting issues, include:
1. Browser and version
2. Steps to reproduce
3. Expected vs actual behavior
4. Console errors (if any)
5. Screenshots (if applicable)
