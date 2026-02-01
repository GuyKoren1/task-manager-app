#!/bin/bash

# Task Manager Storage Mode Switcher

BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Task Manager - Storage Switcher     ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Check current mode
CURRENT_MODE=$(grep "^STORAGE_TYPE=" server/.env | cut -d'=' -f2)

echo -e "${YELLOW}Current Storage Mode:${NC} ${CURRENT_MODE}"
echo ""
echo "Available modes:"
echo "  1) file     - Local JSON storage (offline, fast, simple)"
echo "  2) mongodb  - Cloud database (access from anywhere)"
echo ""
read -p "Enter new mode (file/mongodb) or 'cancel' to exit: " NEW_MODE

if [ "$NEW_MODE" = "cancel" ]; then
    echo "Cancelled."
    exit 0
fi

if [ "$NEW_MODE" != "file" ] && [ "$NEW_MODE" != "mongodb" ]; then
    echo -e "${YELLOW}Invalid mode. Use 'file' or 'mongodb'${NC}"
    exit 1
fi

if [ "$NEW_MODE" = "$CURRENT_MODE" ]; then
    echo -e "${GREEN}Already using $NEW_MODE storage${NC}"
    exit 0
fi

echo ""
echo -e "${YELLOW}Switching to $NEW_MODE storage...${NC}"

# Update server/.env
sed -i '' "s/^STORAGE_TYPE=.*/STORAGE_TYPE=$NEW_MODE/" server/.env

if [ "$NEW_MODE" = "mongodb" ]; then
    echo ""
    echo -e "${YELLOW}MongoDB mode requires:${NC}"
    echo "  1. MongoDB Atlas connection string in server/.env"
    echo "  2. Uncomment MONGODB_URI line in server/.env"
    echo "  3. Set CORS_ORIGIN=* for phone access"
    echo ""
    echo -e "${YELLOW}For phone access, also:${NC}"
    echo "  1. Update client/.env with your computer's IP"
    echo "  2. Add 'host: true' to client/vite.config.js"
    echo ""
    echo "See STORAGE_GUIDE.md for detailed instructions"
else
    echo ""
    echo -e "${GREEN}File storage mode:${NC}"
    echo "  - Data stored in: server/data/"
    echo "  - Localhost only"
    echo "  - No database required"
fi

echo ""
echo -e "${GREEN}✓ Storage mode updated to: $NEW_MODE${NC}"
echo ""
read -p "Restart servers now? (y/n): " RESTART

if [ "$RESTART" = "y" ]; then
    echo ""
    echo "Restarting servers..."
    ./stop.sh
    sleep 2
    ./start.sh
else
    echo ""
    echo "Please restart manually:"
    echo "  ./stop.sh"
    echo "  ./start.sh"
fi
