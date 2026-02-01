#!/bin/bash

# Task Manager - Stop All Services Script

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}Stopping Task Manager services...${NC}"
echo ""

# Kill processes on backend port
echo "Stopping backend (port 5000)..."
lsof -ti:5000 | xargs kill -9 2>/dev/null || echo "  No backend process found"

# Kill processes on frontend port
echo "Stopping frontend (port 5173)..."
lsof -ti:5173 | xargs kill -9 2>/dev/null || echo "  No frontend process found"

# Clean up log files
if [ -f "server.log" ]; then
    rm server.log
    echo "  Removed server.log"
fi

if [ -f "client.log" ]; then
    rm client.log
    echo "  Removed client.log"
fi

echo ""
echo -e "${GREEN}All services stopped successfully${NC}"
