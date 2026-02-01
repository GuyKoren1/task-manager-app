# Quick Start Guide

Get your Task Manager application up and running in minutes!

## 🎯 Option 1: One Command Start (Recommended)

The fastest way to get started:

### macOS/Linux:
```bash
./start.sh
```

### Windows:
```bash
start.bat
```

This single command will:
1. Check if MongoDB is running (and start it if possible)
2. Install all dependencies automatically
3. Create .env configuration files
4. Start backend server on port 5000
5. Start frontend server on port 5173
6. Open http://localhost:5173 in your browser

**Press Ctrl+C to stop all services**, or run `./stop.sh` (macOS/Linux)

---

## 🔧 Option 2: Manual Step-by-Step Setup

If you prefer manual control or the script doesn't work:

### Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js v18+ installed (`node --version`)
- ✅ MongoDB installed locally OR MongoDB Atlas account
- ✅ npm or yarn package manager

### Step-by-Step Setup

### 1. Install Backend Dependencies

```bash
cd server
npm install
```

### 2. Configure Backend

Create `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/task_manager_db
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### 3. Start MongoDB

**For Local MongoDB:**
```bash
# macOS (with Homebrew)
brew services start mongodb-community

# Or start manually
mongod
```

**For MongoDB Atlas:**
- Replace `MONGODB_URI` in `.env` with your Atlas connection string

### 4. Start Backend Server

```bash
npm run dev
```

You should see:
```
Server running in development mode on port 5000
MongoDB Connected: localhost
Reminder scheduler initialized (runs every 15 minutes)
```

### 5. Install Frontend Dependencies

Open a new terminal:
```bash
cd client
npm install
```

### 6. Configure Frontend

Create `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 7. Start Frontend Server

```bash
npm run dev
```

You should see:
```
VITE v5.0.8  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### 8. Open the App

Visit `http://localhost:5173` in your browser!

## First Steps in the App

1. **Create a Category** (optional but recommended)
   - Click the "+" button in the sidebar
   - Enter a name and pick a color
   - Click "Create Category"

2. **Create Your First Task**
   - Click "Add Task" button
   - Fill in task title (required)
   - Set priority, due date, and other details
   - Select categories if you created any
   - Click "Create Task"

3. **Explore the Dashboard**
   - Click "Dashboard" in the header
   - View task statistics and upcoming tasks

## Verify Everything Works

### Test the API (Backend)

```bash
# Health check
curl http://localhost:5000/api/health

# Expected response:
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-01-29T..."
}
```

### Test the Frontend

1. Open browser to `http://localhost:5173`
2. You should see the Dashboard with zero tasks
3. Navigate to Tasks page
4. Sidebar should show "All Tasks" and any categories

## Common Issues & Solutions

### Issue: MongoDB Connection Failed

**Solution:**
```bash
# Check if MongoDB is running
mongo --eval "db.version()"

# If not running, start it
brew services start mongodb-community
# OR
mongod
```

### Issue: Port 5000 Already in Use

**Solution:**
Change port in `server/.env`:
```env
PORT=5001
```

### Issue: Port 5173 Already in Use

**Solution:**
Edit `client/vite.config.js`:
```js
server: {
  port: 5174
}
```

### Issue: Frontend Can't Connect to Backend

**Solution:**
1. Ensure backend is running on port 5000
2. Check `client/.env` has correct `VITE_API_URL`
3. Check browser console for CORS errors
4. Verify `CORS_ORIGIN` in `server/.env` matches frontend URL

### Issue: "Cannot find module" errors

**Solution:**
```bash
# Delete node_modules and reinstall
cd server
rm -rf node_modules package-lock.json
npm install

cd ../client
rm -rf node_modules package-lock.json
npm install
```

## Development Tips

### Watch Server Logs

Backend terminal will show:
- API requests (with morgan)
- Database connections
- Reminder processing (every 15 minutes)
- Errors and stack traces

### Hot Reload

Both servers support hot reload:
- **Backend**: Automatic reload on file changes (Node.js --watch)
- **Frontend**: Instant HMR with Vite

### Test the API with Postman

Import these requests:

**Create Category:**
```
POST http://localhost:5000/api/categories
Content-Type: application/json

{
  "name": "Work",
  "color": "#3B82F6",
  "description": "Work tasks"
}
```

**Create Task:**
```
POST http://localhost:5000/api/tasks
Content-Type: application/json

{
  "title": "My First Task",
  "description": "Testing the API",
  "priority": "high",
  "status": "pending"
}
```

## Next Steps

- 📖 Read the full [README.md](./README.md) for detailed documentation
- 🎨 Customize categories with different colors
- 📅 Create tasks with due dates and reminders
- 🔍 Try filtering and searching tasks
- 📊 Check out the Dashboard statistics

## Need Help?

- Check server logs in the backend terminal
- Check browser console in DevTools (F12)
- Verify both .env files are configured correctly
- Ensure MongoDB is running and accessible
- Make sure all dependencies are installed

Happy task managing! 🚀
