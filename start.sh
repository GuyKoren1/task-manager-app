#!/bin/bash

# Task Manager - One Command Startup Script
# This script starts MongoDB, backend, frontend, and opens the browser

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     Task Manager - Starting All...    ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}Shutting down all services...${NC}"

    # Kill background processes
    if [ ! -z "$BACKEND_PID" ]; then
        echo "Stopping backend server (PID: $BACKEND_PID)"
        kill $BACKEND_PID 2>/dev/null || true
    fi

    if [ ! -z "$FRONTEND_PID" ]; then
        echo "Stopping frontend server (PID: $FRONTEND_PID)"
        kill $FRONTEND_PID 2>/dev/null || true
    fi

    # Kill any remaining node processes on our ports
    lsof -ti:5000 | xargs kill -9 2>/dev/null || true
    lsof -ti:5173 | xargs kill -9 2>/dev/null || true

    echo -e "${GREEN}All services stopped${NC}"
    exit 0
}

# Trap CTRL+C and other termination signals
trap cleanup SIGINT SIGTERM EXIT

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# No MongoDB needed - using file-based storage
echo -e "${GREEN}✓ Using local file-based storage (no database required)${NC}"

# Install backend dependencies if needed
echo -e "${YELLOW}[1/4] Checking backend dependencies...${NC}"
cd server
if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
else
    echo -e "${GREEN}✓ Backend dependencies installed${NC}"
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo -e "${RED}Warning: server/.env file not found${NC}"
    echo "Creating default .env file..."
    cat > .env << EOF
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
EOF
    echo -e "${GREEN}✓ Created server/.env${NC}"
fi

# Start backend server
echo -e "${YELLOW}[2/4] Starting backend server...${NC}"
npm run dev > ../server.log 2>&1 &
BACKEND_PID=$!
echo -e "${GREEN}✓ Backend server started (PID: $BACKEND_PID)${NC}"
echo "   Logs: server.log"

# Wait for backend to be ready
echo "   Waiting for backend to initialize..."
sleep 3

# Check if backend is responding
for i in {1..10}; do
    if curl -s http://localhost:5000/api/health > /dev/null 2>&1; then
        echo -e "${GREEN}   ✓ Backend is ready${NC}"
        break
    fi
    if [ $i -eq 10 ]; then
        echo -e "${RED}   Warning: Backend might not be responding${NC}"
    fi
    sleep 1
done

# Install frontend dependencies if needed
echo -e "${YELLOW}[3/4] Checking frontend dependencies...${NC}"
cd ../client
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
else
    echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo -e "${RED}Warning: client/.env file not found${NC}"
    echo "Creating default .env file..."
    cat > .env << EOF
VITE_API_URL=http://localhost:5000/api
EOF
    echo -e "${GREEN}✓ Created client/.env${NC}"
fi

# Start frontend server
echo -e "${YELLOW}[4/4] Starting frontend server...${NC}"
npm run dev > ../client.log 2>&1 &
FRONTEND_PID=$!
echo -e "${GREEN}✓ Frontend server started (PID: $FRONTEND_PID)${NC}"
echo "   Logs: client.log"

# Wait for frontend to be ready
echo "   Waiting for frontend to initialize..."
sleep 5

# Check if frontend is responding
for i in {1..10}; do
    if curl -s http://localhost:5173 > /dev/null 2>&1; then
        echo -e "${GREEN}   ✓ Frontend is ready${NC}"
        break
    fi
    if [ $i -eq 10 ]; then
        echo -e "${RED}   Warning: Frontend might not be responding${NC}"
    fi
    sleep 1
done

# Open browser
echo ""
echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║     All Services Started! 🚀          ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}Frontend:${NC}  http://localhost:5173"
echo -e "${BLUE}Backend:${NC}   http://localhost:5000/api"
echo ""
echo -e "${YELLOW}Opening browser...${NC}"
sleep 2

# Open browser (works on macOS)
open http://localhost:5173 2>/dev/null || \
    xdg-open http://localhost:5173 2>/dev/null || \
    echo -e "${YELLOW}Please open http://localhost:5173 in your browser${NC}"

echo ""
echo -e "${GREEN}Application is running!${NC}"
echo ""
echo "View logs:"
echo "  Backend:  tail -f server.log"
echo "  Frontend: tail -f client.log"
echo ""
echo -e "${RED}Press Ctrl+C to stop all services${NC}"
echo ""

# Keep script running and show logs
cd ..
echo -e "${BLUE}=== Live Logs (Ctrl+C to stop) ===${NC}"
tail -f server.log -f client.log 2>/dev/null || {
    # If tail fails, just wait
    while true; do
        sleep 1
    done
}
