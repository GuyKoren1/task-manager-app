@echo off
REM Task Manager - One Command Startup Script (Windows)

echo ╔════════════════════════════════════════╗
echo ║     Task Manager - Starting All...    ║
echo ╚════════════════════════════════════════╝
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: Node.js is not installed
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check MongoDB
echo [1/5] Checking MongoDB...
tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I /N "mongod.exe">NUL
if "%ERRORLEVEL%"=="1" (
    echo Warning: MongoDB may not be running
    echo Please start MongoDB manually
    echo.
)

REM Backend dependencies
echo [2/5] Checking backend dependencies...
cd server
if not exist "node_modules\" (
    echo Installing backend dependencies...
    call npm install
)

if not exist ".env" (
    echo Creating default .env file...
    (
        echo PORT=5000
        echo MONGODB_URI=mongodb://localhost:27017/task_manager_db
        echo NODE_ENV=development
        echo CORS_ORIGIN=http://localhost:5173
    ) > .env
)

REM Start backend
echo [3/5] Starting backend server...
start "Task Manager Backend" cmd /k "npm run dev"
timeout /t 3 /nobreak >nul

REM Frontend dependencies
echo [4/5] Checking frontend dependencies...
cd ..\client
if not exist "node_modules\" (
    echo Installing frontend dependencies...
    call npm install
)

if not exist ".env" (
    echo Creating default .env file...
    echo VITE_API_URL=http://localhost:5000/api > .env
)

REM Start frontend
echo [5/5] Starting frontend server...
start "Task Manager Frontend" cmd /k "npm run dev"
timeout /t 5 /nobreak >nul

echo.
echo ╔════════════════════════════════════════╗
echo ║     All Services Started! 🚀          ║
echo ╚════════════════════════════════════════╝
echo.
echo Frontend:  http://localhost:5173
echo Backend:   http://localhost:5000/api
echo.
echo Opening browser...
timeout /t 2 /nobreak >nul
start http://localhost:5173

echo.
echo Application is running!
echo Close the terminal windows to stop the servers.
echo.
pause
