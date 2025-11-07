#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🎮 Starting CodeQuest Academy - Peer Mentor Game${NC}"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo -e "${RED}⚠️  .env.local not found. Creating from .env.example...${NC}"
    cp .env.example .env.local
    echo -e "${GREEN}✓ Created .env.local - Please configure your OpenAI API key${NC}"
fi

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo -e "${BLUE}📦 Installing dependencies...${NC}"
    npm install
fi

echo -e "${GREEN}✓ Starting both servers...${NC}"
echo -e "${BLUE}  - Next.js frontend: http://localhost:3000${NC}"
echo -e "${BLUE}  - WebSocket server: http://localhost:3001${NC}"
echo ""

npm run dev:all
