#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🎮 Starting CodeQuest Academy - Peer Mentor Game${NC}"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo -e "${RED}⚠️  .env.local not found. Creating from .env.example...${NC}"
    cp .env.example .env.local
    echo -e "${GREEN}✓ Created .env.local${NC}"
    echo -e "${YELLOW}  Note: OpenAI API key is optional - app works without it${NC}"
    echo ""
fi

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo -e "${BLUE}📦 Installing dependencies...${NC}"
    npm install
    echo ""
fi

echo -e "${GREEN}✓ Starting both servers...${NC}"
echo -e "${BLUE}  - Next.js frontend:  http://localhost:3000${NC}"
echo -e "${BLUE}  - WebSocket server:  http://localhost:3001${NC}"
echo ""
echo -e "${YELLOW}📝 Important:${NC}"
echo -e "${YELLOW}  - Both servers must be running for multiplayer to work${NC}"
echo -e "${YELLOW}  - If you see connection errors, check both servers are running${NC}"
echo -e "${YELLOW}  - Press Ctrl+C to stop both servers${NC}"
echo ""

npm run dev:all
