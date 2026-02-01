# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A full-stack task management application with a **hybrid storage system** supporting both local file-based storage and MongoDB cloud storage. Built with React + Vite frontend and Node.js + Express backend.

## Essential Commands

### Starting the Application

```bash
# Start everything (MongoDB check, backend, frontend, browser)
./start.sh           # macOS/Linux
start.bat            # Windows

# Stop all services
./stop.sh            # macOS/Linux
# Or press Ctrl+C in the terminal
```

### Backend Development (server/)

```bash
cd server
npm install          # Install dependencies
npm run dev          # Development mode with auto-reload (node --watch)
npm start            # Production mode
```

### Frontend Development (client/)

```bash
cd client
npm install          # Install dependencies
npm run dev          # Development server with HMR (Vite)
npm run build        # Build for production
npm run preview      # Preview production build
```

### Storage Management

```bash
# Switch between file and MongoDB storage
./switch-storage.sh

# Check current storage mode
grep STORAGE_TYPE server/.env

# View file storage data (when in file mode)
cat server/data/tasks.json
cat server/data/categories.json

# Backup file storage
cp -r server/data server/data_backup_$(date +%Y%m%d)
```

## Architecture

### Hybrid Storage System (Critical)

The app uses a **storage abstraction layer** (`server/src/config/storageFactory.js`) that switches between two storage backends based on `STORAGE_TYPE` environment variable:

1. **File Storage** (`server/src/utils/fileStorage.js`)
   - Local JSON files in `server/data/` directory
   - No database required, works offline
   - Default mode
   - IDs generated with `Date.now().toString(36) + Math.random().toString(36).substr(2)`

2. **MongoDB Storage** (`server/src/utils/mongoStorage.js`)
   - Cloud or local MongoDB database
   - Mongoose models in `server/src/models/`
   - Requires MongoDB connection string

**Key Point**: Controllers (`server/src/controllers/`) use the abstracted `tasksDB` and `categoriesDB` from storageFactory, NOT direct Model imports. This allows seamless switching between storage modes.

### Request Flow

```
Client Request
  ↓
API Service (client/src/services/api.js - axios instance)
  ↓
React Query Hook (client/src/hooks/useTasks.js or useCategories.js)
  ↓
Component (uses query hooks for data fetching)

---

Backend Request
  ↓
Express Route (server/src/routes/)
  ↓
Validator Middleware (server/src/middleware/validator.js - express-validator)
  ↓
Controller (server/src/controllers/)
  ↓
Storage Layer (storageFactory → fileStorage OR mongoStorage)
  ↓
Response (with errorHandler middleware catching errors)
```

### State Management

- **Server State**: TanStack Query (React Query) for all API data
  - Task hooks: `client/src/hooks/useTasks.js`
  - Category hooks: `client/src/hooks/useCategories.js`
  - Automatic caching, refetching, and synchronization
  - 5-minute stale time, no refetch on window focus

- **Local State**: React useState/useEffect in components

### Reminder System

- Cron job runs every 15 minutes (`server/src/utils/reminderScheduler.js`)
- Checks for tasks with `reminderDate` within next 15 minutes
- Marks reminders as sent (`reminderSent: true`)
- Currently logs to console (ready to extend with email/push notifications)
- **Note**: Currently uses Mongoose Model directly - needs update for hybrid storage compatibility

## Configuration Files

### Backend Environment (`server/.env`)

```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# Storage mode: 'file' or 'mongodb'
STORAGE_TYPE=file

# Only needed if STORAGE_TYPE=mongodb
MONGODB_URI=mongodb+srv://...
# OR local: mongodb://localhost:27017/task_manager_db
```

### Frontend Environment (`client/.env`)

```env
VITE_API_URL=http://localhost:5000/api

# For phone/network access (when using MongoDB storage)
# VITE_API_URL=http://<computer-ip>:5000/api
```

### Vite Config (`client/vite.config.js`)

For network access (phone/tablet), add `host: true` to server config:

```js
server: {
  host: true,  // Enable network access
  port: 5173
}
```

## API Conventions

### Task Endpoints

- `GET /api/tasks` - List with filters (status, priority, category, search, sortBy, order, page, limit, dueDateFrom, dueDateTo)
- `GET /api/tasks/:id` - Single task
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `PATCH /api/tasks/:id/status` - Update status only
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/stats/overview` - Statistics
- `GET /api/tasks/stats/upcoming` - Upcoming tasks

### Category Endpoints

- `GET /api/categories` - List all
- `GET /api/categories/:id` - Single category
- `POST /api/categories` - Create
- `PUT /api/categories/:id` - Update
- `DELETE /api/categories/:id` - Delete

### Response Format

Success:
```json
{
  "success": true,
  "data": {...},
  "count": 10,    // For list endpoints
  "total": 50,    // For paginated endpoints
  "page": 1,
  "pages": 5
}
```

Error:
```json
{
  "success": false,
  "error": "Error message"
}
```

## Component Structure

- **Common Components** (`client/src/components/common/`): Button, Input, Modal, DatePicker, etc.
- **Layout Components** (`client/src/components/layout/`): Header, MainLayout
- **Feature Components**:
  - `client/src/components/tasks/` - TaskItem, TaskList, TaskFilters
  - `client/src/components/categories/` - CategoryForm
- **Pages**: Dashboard, TasksPage

## Important Implementation Details

### Task Schema Fields

```js
{
  title: String (required),
  description: String,
  status: 'pending' | 'in_progress' | 'completed',
  priority: 'low' | 'medium' | 'high',
  dueDate: Date,
  completedAt: Date,
  reminderDate: Date,
  reminderSent: Boolean,
  categories: [ObjectId/String], // Populated in responses
  tags: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### Category Populating

Controllers manually populate task categories by:
1. Fetching all categories
2. Mapping category IDs from task to full category objects
3. Returning only essential fields (_id, name, color, icon)

This approach works for both storage backends.

### Validation

All request validation uses express-validator in `server/src/middleware/validator.js`:
- `validateTask` - Task creation/updates
- `validateCategory` - Category creation/updates
- Inline route validators for specific endpoints

## Switching Storage Modes

1. Data is **NOT** automatically migrated between modes
2. Each mode maintains independent data storage
3. Use `./switch-storage.sh` for interactive switching
4. Reminder scheduler currently only works with MongoDB (needs refactoring for file storage)
5. Restart required after switching modes

## Development Workflow

1. Make changes to files
2. Backend auto-reloads with `node --watch`
3. Frontend hot-reloads with Vite HMR
4. Check logs in terminal (Morgan for HTTP requests)
5. View logs: `tail server.log` or `tail client.log`

## Testing API Endpoints

```bash
# Health check
curl http://localhost:5000/api/health

# Get all tasks
curl http://localhost:5000/api/tasks

# Create category
curl -X POST http://localhost:5000/api/categories \
  -H "Content-Type: application/json" \
  -d '{"name":"Work","color":"#3B82F6"}'

# Create task
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Task","priority":"high","status":"pending"}'
```

## Technology Stack Notes

- **Backend**: Express, Mongoose (optional), node-cron, helmet, cors, morgan, express-validator
- **Frontend**: React 18, Vite, React Router, TanStack Query, Axios, Tailwind CSS, date-fns, react-datepicker, react-hot-toast, react-icons
- **Database**: MongoDB (optional) or JSON files

## Deployment

This application is deployed and accessible from anywhere:

### Live URLs
- **Frontend**: https://task-manager-app-seven-murex.vercel.app/
- **Backend**: https://task-manager-backend-7lie.onrender.com
- **API Health**: https://task-manager-backend-7lie.onrender.com/api/health

### Deployment Guides
1. See **DEPLOYMENT_GUIDE.md** for detailed step-by-step instructions
2. Use **DEPLOY_CHECKLIST.md** for a quick reference checklist

### Deployment Stack (Free Tier)
- **Database**: MongoDB Atlas (cloud database)
- **Backend**: Render.com (Node.js API server)
- **Frontend**: Vercel (React app hosting)

### Key Deployment Steps
1. Setup MongoDB Atlas network access (allow 0.0.0.0/0)
2. Push code to GitHub
3. Deploy backend to Render with environment variables
4. Update frontend `.env` with backend URL
5. Deploy frontend to Vercel
6. Update backend CORS_ORIGIN with frontend URL

### Environment Variables for Production

**Backend (Render/Railway):**
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
STORAGE_TYPE=mongodb
CORS_ORIGIN=https://your-frontend-url.vercel.app
```

**Frontend (Vercel/Netlify):**
```env
VITE_API_URL=https://your-backend-url.onrender.com/api
```

### Important Notes
- Free tier backend (Render) sleeps after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds
- Use UptimeRobot (free) to ping backend every 14 minutes to keep it awake
- Both Vercel and Render support automatic deployments from GitHub
