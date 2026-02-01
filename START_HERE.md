# 🚀 START HERE - Launch Task Manager App

## One Command to Start Everything

Open your terminal in this directory and run:

### macOS/Linux:
```bash
./start.sh
```

### Windows:
```bash
start.bat
```

That's it! ✨

## What Happens Next

The script will automatically:

1. ✅ Check MongoDB and start it if needed
2. ✅ Install dependencies (first run only)
3. ✅ Configure environment variables
4. ✅ Start backend API server
5. ✅ Start frontend React app
6. ✅ Open http://localhost:5173 in your browser

## First Time Setup

### Prerequisites (Install These First):
- **Node.js v18+** → https://nodejs.org/
- **MongoDB** → https://www.mongodb.com/try/download/community
  - Or use MongoDB Atlas (cloud) → https://www.mongodb.com/cloud/atlas

### Verify Installation:
```bash
node --version    # Should show v18 or higher
mongod --version  # Should show MongoDB version
```

## During Development

The terminal will show live logs from both servers.

**To stop all services:**
- Press `Ctrl+C` in the terminal
- Or run `./stop.sh` (macOS/Linux)

## Access Your App

Once started:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api
- **Health Check:** http://localhost:5000/api/health

## Troubleshooting

### MongoDB Not Running?
```bash
# macOS
brew services start mongodb-community

# Or manually
mongod
```

### Ports Already in Use?
```bash
# Stop existing services
./stop.sh

# Or manually kill processes
lsof -ti:5000 | xargs kill -9
lsof -ti:5173 | xargs kill -9
```

### Permission Denied?
```bash
chmod +x start.sh stop.sh
```

## Next Steps

1. Create your first category (click + in sidebar)
2. Add your first task (click "Add Task" button)
3. Explore the dashboard for statistics

## Documentation

- **Full Setup Guide:** [QUICKSTART.md](./QUICKSTART.md)
- **Complete Documentation:** [README.md](./README.md)
- **Project Overview:** [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)

---

**Need Help?** Check the troubleshooting sections in QUICKSTART.md or README.md
