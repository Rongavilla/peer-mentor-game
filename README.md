# 🎮 CodeQuest Academy - Peer Mentor Game

A **gamified peer-to-peer IT mentorship platform** with AI-powered skill matching, real-time multiplayer functionality, and interactive learning rewards!

## 🌟 Project Vision

Transform IT mentorship into an engaging RPG-style experience where:
- **Mentors & Mentees** connect through AI-powered matching
- **Learning becomes gameplay** with quests, XP, and skill trees
- **Progress is rewarded** with badges, levels, and achievements
- **Community thrives** through leaderboards and collaborative challenges
- **Real-time multiplayer** allows players to learn together
- **AI mentorship** provides instant guidance and feedback

---

## 🏗️ Tech Stack

### Frontend (Game Interface)
- **Framework**: Next.js 14 + TypeScript
- **Game Engine**: Phaser.js 3.60
- **Styling**: Tailwind CSS
- **State Management**: React Hooks + Context API
- **Real-time Communication**: Socket.IO Client

### Backend
- **WebSocket Server**: Socket.IO
- **AI Integration**: OpenAI GPT-3.5
- **API Routes**: Next.js API Routes
- **Real-time**: Socket.IO Server

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- OpenAI API Key (optional, for AI features)

### Installation

```bash
# Clone the repository
git clone https://github.com/Rongavilla/peer-mentor-game.git
cd peer-mentor-game

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

Edit `.env.local` with your configuration:

```bash
# OpenAI Configuration (optional - AI features work without it, but with limited responses)
OPENAI_API_KEY=your_openai_api_key_here

# WebSocket Server Configuration
WEBSOCKET_PORT=3001
NEXT_PUBLIC_WEBSOCKET_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Room Settings
MAX_PLAYERS_PER_ROOM=10
```

### Running the Application

#### Development Mode

**Option 1: Run both servers together (Recommended)**
```bash
npm run dev:all
```

**Option 2: Run servers separately**
```bash
# Terminal 1 - Next.js frontend
npm run dev

# Terminal 2 - WebSocket game server
npm run dev:server
```

Open [http://localhost:3000](http://localhost:3000) to see the game!

#### Production Mode

```bash
# Build the application
npm run build
npm run build:server

# Start the servers
npm run start        # Next.js server
npm run start:server # WebSocket server
```

---

## 🎮 Multiplayer Features

### Room System
- **Create Room**: Start a new game session with custom room name
- **Join Room**: Join existing rooms using room ID
- **Room Management**: Automatic cleanup when all players leave
- **Player Limit**: Configurable max players per room (default: 10)

### Real-time Gameplay
- **Live Player Sync**: See other players moving in real-time
- **Player List**: View all connected players in current room
- **Connection Status**: Visual indicator for server connection
- **Smooth Movement**: Interpolated player positions for smooth gameplay

### AI Mentor Features
- **Real-time Chat**: Ask the AI mentor questions anytime
- **Contextual Responses**: AI provides relevant mentorship advice
- **Shared Learning**: All players in a room can see AI responses
- **Topic Hints**: Get AI-powered hints for learning topics
- **Feedback System**: Receive personalized feedback on answers

---

## 🎯 Game Mechanics

### World Map
- 🏰 **Python Kingdom** - Python mentorship quests
- ☁️ **Cloud Citadel** - AWS, Azure, GCP zones
- 🔐 **Security Dungeon** - Cybersecurity challenges  
- 🤖 **AI Laboratory** - Machine learning missions

### Character Progression
- **Levels & XP** - Gain experience through mentorship sessions
- **Skill Trees** - Unlock new technologies and expertise
- **Quests** - Complete mentorship challenges
- **Inventory** - Collect power-ups and skill scrolls

### Rewards System
- 🏆 Achievements & Badges
- 📊 Global Leaderboards
- 🎁 Exclusive Cosmetic Items
- ⭐ Reputation Points

---

## 📁 Project Structure

```
peer-mentor-game/
├── src/
│   ├── app/              # Next.js app directory
│   │   ├── api/          # API routes
│   │   │   ├── chat/     # AI chat endpoint
│   │   │   └── rooms/    # Room management endpoints
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/       # React components
│   │   ├── AIChat.tsx    # AI chat interface
│   │   ├── GameComponent.tsx  # Phaser game wrapper
│   │   ├── Lobby.tsx     # Room lobby UI
│   │   └── PlayerList.tsx     # Connected players list
│   ├── contexts/         # React contexts
│   │   └── SocketContext.tsx  # Socket.IO context provider
│   ├── game/             # Phaser game
│   │   ├── scenes/       # Game scenes
│   │   │   ├── MenuScene.ts
│   │   │   ├── WorldScene.ts
│   │   │   ├── MultiplayerWorldScene.ts
│   │   │   └── BattleScene.ts
│   │   └── config.ts     # Phaser configuration
│   └── lib/              # Utilities and helpers
├── server/               # Backend server
│   ├── gameServer.ts     # Socket.IO game server
│   └── aiService.ts      # OpenAI integration
├── public/               # Static assets
│   ├── assets/          # Game sprites, sounds, etc.
│   └── images/          # UI images
├── .env.example         # Environment variables template
└── package.json
```

---

## 🔧 API Endpoints

### POST /api/chat
Get AI mentor responses

**Request Body:**
```json
{
  "message": "How do I learn Python?",
  "context": "Room: Learning Python Basics"
}
```

**Response:**
```json
{
  "response": "Great question! Start with Python fundamentals...",
  "timestamp": 1234567890
}
```

### POST /api/rooms
Create a new game room

**Request Body:**
```json
{
  "roomName": "Python Study Group",
  "playerName": "John"
}
```

**Response:**
```json
{
  "roomId": "room-uuid",
  "roomName": "Python Study Group",
  "message": "Room created successfully"
}
```

### GET /api/rooms
Get list of available rooms

**Response:**
```json
{
  "rooms": [
    {
      "id": "room-uuid",
      "name": "Python Study Group",
      "createdAt": 1234567890,
      "createdBy": "John"
    }
  ]
}
```

---

## 🌐 WebSocket Events

### Client → Server

- `create-room`: Create a new game room
- `join-room`: Join an existing room
- `player-move`: Update player position
- `ai-chat`: Send message to AI (broadcasts to room)

### Server → Client

- `room-created`: Room creation confirmation
- `room-joined`: Room join confirmation
- `player-joined`: New player joined the room
- `player-left`: Player left the room
- `player-moved`: Player position update
- `ai-message`: AI chat message broadcast
- `error`: Error message

---

## 🛣️ Roadmap

### Phase 1: Foundation ✅ (Current)
- [x] Project setup with Next.js + Phaser
- [x] Basic game structure
- [x] **Real-time multiplayer with Socket.IO**
- [x] **AI mentor integration with OpenAI**
- [x] **Room/lobby system**
- [x] **Player synchronization**
- [ ] Character creation screen
- [ ] World map navigation

### Phase 2: Core Features
- [ ] User authentication system
- [ ] Profile & skill management
- [ ] AI skill matching algorithm
- [ ] Quest system implementation
- [ ] Persistent player data

### Phase 3: Gamification
- [ ] XP and leveling system
- [ ] Achievement engine
- [ ] Leaderboards
- [ ] Reward marketplace

### Phase 4: Social Features
- [ ] Real-time video sessions
- [ ] Private messaging
- [ ] Community events
- [ ] Tournaments & competitions

---

## 🤝 Contributing

We welcome contributions! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 🐛 Troubleshooting

### WebSocket Connection Issues
- Ensure the WebSocket server is running on port 3001
- Check that `NEXT_PUBLIC_WEBSOCKET_URL` is set correctly
- Verify firewall settings allow connections on port 3001

### AI Features Not Working
- Verify your OpenAI API key is set in `.env.local`
- Check API key has sufficient credits
- AI features will work with limited functionality without a key

### Build Errors
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear Next.js cache: `rm -rf .next`
- Ensure all TypeScript errors are resolved

---

## 📝 License

This project is private and proprietary.

---

## 👥 Team

Created by @Rongavilla with ❤️ and ☕

---

## 🎮 Let's Build the Future of IT Mentorship!

**Happy Coding & Happy Gaming!** 🚀✨

