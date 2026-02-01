# Task Manager Application

A full-stack task management application built with React, Node.js, Express, and MongoDB.

## 🚀 Quick Start - One Command Launch

Start everything (MongoDB, backend, frontend) and open the browser with a single command:

### macOS/Linux:
```bash
./start.sh
```

### Windows:
```bash
start.bat
```

This will automatically:
- ✅ Check and start MongoDB
- ✅ Install dependencies (if needed)
- ✅ Create .env files (if needed)
- ✅ Start backend server (http://localhost:5000)
- ✅ Start frontend server (http://localhost:5173)
- ✅ Open your browser

**To stop all services:**
```bash
# macOS/Linux
./stop.sh

# Or press Ctrl+C in the terminal
```

---

## Features

- **Task Management**: Create, read, update, and delete tasks with rich details
- **Categories**: Organize tasks using color-coded categories
- **Priority Levels**: Mark tasks as low, medium, or high priority
- **Status Tracking**: Track tasks through pending, in progress, and completed states
- **Due Dates & Reminders**: Set due dates and automatic reminders for tasks
- **Advanced Filtering**: Filter by status, priority, category, and search by keywords
- **Sorting**: Sort tasks by date, priority, or title
- **Dashboard**: View statistics and upcoming tasks at a glance
- **Tags**: Add custom tags to tasks for additional organization
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Technology Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **node-cron** - Task scheduler for reminders
- **express-validator** - Request validation
- **helmet** - Security middleware
- **cors** - Cross-origin resource sharing
- **morgan** - HTTP request logger

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **TanStack Query** - Server state management
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework
- **date-fns** - Date utility library
- **react-datepicker** - Date picker component
- **react-hot-toast** - Toast notifications
- **react-icons** - Icon library

## Project Structure

```
task_mange_app/
├── server/                    # Backend
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js    # MongoDB connection
│   │   ├── models/
│   │   │   ├── Task.js        # Task schema
│   │   │   └── Category.js    # Category schema
│   │   ├── controllers/
│   │   │   ├── taskController.js
│   │   │   └── categoryController.js
│   │   ├── routes/
│   │   │   ├── taskRoutes.js
│   │   │   └── categoryRoutes.js
│   │   ├── middleware/
│   │   │   ├── errorHandler.js
│   │   │   └── validator.js
│   │   ├── utils/
│   │   │   └── reminderScheduler.js
│   │   └── app.js
│   ├── .env
│   ├── package.json
│   └── server.js
└── client/                    # Frontend
    ├── src/
    │   ├── components/
    │   │   ├── common/        # Reusable UI components
    │   │   ├── layout/        # Layout components
    │   │   ├── tasks/         # Task-related components
    │   │   └── categories/    # Category components
    │   ├── pages/
    │   │   ├── Dashboard.jsx
    │   │   └── TasksPage.jsx
    │   ├── services/
    │   │   ├── api.js
    │   │   ├── taskService.js
    │   │   └── categoryService.js
    │   ├── hooks/
    │   │   ├── useTasks.js
    │   │   └── useCategories.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── package.json
    └── vite.config.js
```

## Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v6 or higher) - Either installed locally or MongoDB Atlas account

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
Create a `.env` file in the server directory with the following:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/task_manager_db
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

For MongoDB Atlas, use your connection string:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/task_manager_db
```

4. Start the server:
```bash
npm run dev
```

The server will start on `http://localhost:5000`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
Create a `.env` file in the client directory with:
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The client will start on `http://localhost:5173`

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Task Endpoints

#### Get All Tasks
```
GET /tasks
```
Query Parameters:
- `status` - Filter by status (pending, in_progress, completed)
- `priority` - Filter by priority (low, medium, high)
- `category` - Filter by category ID
- `search` - Search in title, description, and tags
- `sortBy` - Sort field (createdAt, dueDate, priority, title)
- `order` - Sort order (asc, desc)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `dueDateFrom` - Filter tasks due after this date
- `dueDateTo` - Filter tasks due before this date

Response:
```json
{
  "success": true,
  "count": 10,
  "total": 50,
  "page": 1,
  "pages": 5,
  "data": [...]
}
```

#### Get Single Task
```
GET /tasks/:id
```

#### Create Task
```
POST /tasks
```
Body:
```json
{
  "title": "Complete project",
  "description": "Finish the task manager app",
  "status": "pending",
  "priority": "high",
  "dueDate": "2026-02-15T10:00:00Z",
  "reminderDate": "2026-02-14T10:00:00Z",
  "categories": ["category_id_1", "category_id_2"],
  "tags": ["urgent", "project"]
}
```

#### Update Task
```
PUT /tasks/:id
```

#### Update Task Status
```
PATCH /tasks/:id/status
```
Body:
```json
{
  "status": "in_progress"
}
```

#### Delete Task
```
DELETE /tasks/:id
```

#### Get Statistics
```
GET /tasks/stats/overview
```

#### Get Upcoming Tasks
```
GET /tasks/stats/upcoming
```

### Category Endpoints

#### Get All Categories
```
GET /categories
```

#### Get Single Category
```
GET /categories/:id
```

#### Create Category
```
POST /categories
```
Body:
```json
{
  "name": "Work",
  "color": "#3B82F6",
  "description": "Work-related tasks"
}
```

#### Update Category
```
PUT /categories/:id
```

#### Delete Category
```
DELETE /categories/:id
```

## Usage Guide

### Creating Your First Task

1. Start both the backend and frontend servers
2. Open `http://localhost:5173` in your browser
3. (Optional) Create categories first by clicking the "+" button in the sidebar
4. Click "Add Task" button
5. Fill in the task details:
   - Title (required)
   - Description
   - Priority level
   - Due date
   - Reminder date (must be before due date)
   - Select categories
   - Add tags
6. Click "Create Task"

### Managing Categories

1. Navigate to the Tasks page
2. In the sidebar, click the "+" button next to "Categories"
3. Enter category name and choose a color
4. Add an optional description
5. Click "Create Category"

### Filtering and Sorting Tasks

1. Use the search bar to find tasks by title, description, or tags
2. Filter by status using the status dropdown
3. Filter by priority using the priority dropdown
4. Sort tasks using the sort dropdown
5. Toggle between ascending and descending order
6. Click "Reset Filters" to clear all filters

### Viewing Dashboard

1. Click "Dashboard" in the header
2. View task statistics by status and priority
3. See upcoming tasks in the next 7 days
4. Click "View All Tasks" to navigate to the tasks page

### Setting Up Reminders

1. When creating or editing a task, set a due date first
2. Set a reminder date (must be before or equal to due date)
3. The reminder scheduler runs every 15 minutes
4. When a reminder is due, it will be logged in the server console
5. In production, this can be configured to send email notifications

## Development

### Running Tests

Backend:
```bash
cd server
npm test
```

Frontend:
```bash
cd client
npm test
```

### Building for Production

Backend:
```bash
cd server
npm start
```

Frontend:
```bash
cd client
npm run build
npm run preview
```

### Environment Variables

#### Backend (.env)
```env
PORT=5000                      # Server port
MONGODB_URI=                   # MongoDB connection string
NODE_ENV=production            # Environment (development/production)
CORS_ORIGIN=                   # Allowed CORS origin
```

#### Frontend (.env)
```env
VITE_API_URL=                  # Backend API URL
```

## Troubleshooting

### MongoDB Connection Issues

1. Ensure MongoDB is running:
```bash
# For local MongoDB
mongod

# Check if MongoDB is running
mongo
```

2. For MongoDB Atlas:
   - Check your connection string
   - Ensure your IP is whitelisted
   - Verify username and password

### Port Already in Use

If ports 5000 or 5173 are in use:

Backend:
```bash
# Change PORT in server/.env
PORT=5001
```

Frontend:
```bash
# Change port in client/vite.config.js
server: { port: 5174 }
```

### CORS Issues

Ensure the `CORS_ORIGIN` in server/.env matches your frontend URL:
```env
CORS_ORIGIN=http://localhost:5173
```

## Deployment

Want to access your Task Manager from anywhere? Deploy it online!

### 🌐 Live Application

This app is deployed and accessible at:
- **Frontend**: https://task-manager-app-seven-murex.vercel.app/
- **Backend API**: https://task-manager-backend-7lie.onrender.com
- **Health Check**: https://task-manager-backend-7lie.onrender.com/api/health

### 📚 Deployment Guides

- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Complete step-by-step guide
- **[DEPLOY_CHECKLIST.md](./DEPLOY_CHECKLIST.md)** - Quick reference checklist

### 🚀 Quick Overview

Deployed for **FREE** using:
- **Backend**: Render.com (free tier)
- **Frontend**: Vercel (free tier)
- **Database**: MongoDB Atlas (already configured)

The guides cover:
1. Setting up MongoDB Atlas for cloud access
2. Deploying backend to Render
3. Deploying frontend to Vercel
4. Configuring environment variables
5. Testing your live app
6. Troubleshooting common issues

Access from any device, anywhere in the world! 📱💻

## Future Enhancements

- User authentication and authorization
- Multi-user support with permissions
- Recurring tasks
- File attachments
- Task comments and activity history
- Email notifications for reminders
- Calendar view
- Drag-and-drop task reordering
- Task templates
- Export tasks (CSV, PDF)
- Mobile app version
- Dark mode
- Collaboration features

## License

MIT

## Contributing

Contributions are welcome. Please open an issue first to discuss proposed changes.

## Support

For issues and questions, please create an issue in the repository.
