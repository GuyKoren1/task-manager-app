# Deployment Guide - Make Your Task Manager Online

This guide will help you deploy your Task Manager application online so you can access it from anywhere on any device.

## Overview

We'll deploy:
1. **Database** → MongoDB Atlas (already configured)
2. **Backend** → Render.com (free tier)
3. **Frontend** → Vercel (free tier)

**Total Cost: $0** (using free tiers)

---

## Prerequisites

Before starting, create accounts on:
- [Render.com](https://render.com) - for backend hosting
- [Vercel.com](https://vercel.com) - for frontend hosting
- GitHub account (recommended for automatic deployments)

---

## Step 1: Prepare MongoDB Atlas (Database)

Your app already has MongoDB Atlas configured, but let's verify the setup:

### 1.1 Check Your Connection String

Open `server/.env` and find:
```env
MONGODB_URI=mongodb+srv://Guy_test:12345678Guy@cluster0.z0pptqp.mongodb.net/task_manager_db?retryWrites=true&w=majority
```

### 1.2 Configure Network Access

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Login with your account
3. Click on your cluster → **Network Access** (left sidebar)
4. Click **"Add IP Address"**
5. Select **"Allow Access from Anywhere"** (0.0.0.0/0)
6. Click **"Confirm"**

⚠️ **Important**: This allows connections from any IP. For production apps with sensitive data, you should whitelist specific IPs.

---

## Step 2: Prepare Your Code for Deployment

### 2.1 Create a Git Repository (if not already done)

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit - Task Manager app"
```

### 2.2 Push to GitHub

1. Go to [GitHub](https://github.com) and create a new repository (e.g., "task-manager-app")
2. Don't initialize with README (you already have code)
3. Copy the commands shown and run:

```bash
git remote add origin https://github.com/YOUR_USERNAME/task-manager-app.git
git branch -M main
git push -u origin main
```

### 2.3 Update Backend for Production

Create a new file `server/ecosystem.config.js` (optional, for better process management):

```javascript
module.exports = {
  apps: [{
    name: 'task-manager-api',
    script: './server.js',
    instances: 1,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production'
    }
  }]
};
```

---

## Step 3: Deploy Backend to Render

### 3.1 Create New Web Service

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub account if asked
4. Select your repository (task-manager-app)

### 3.2 Configure the Service

Fill in the following settings:

**Basic Settings:**
- **Name**: `task-manager-backend` (or any name you prefer)
- **Region**: Choose closest to you
- **Branch**: `main`
- **Root Directory**: `server`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**Instance Type:**
- Select **"Free"** (0$ per month)

### 3.3 Add Environment Variables

Scroll down to **"Environment Variables"** and add:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `MONGODB_URI` | `mongodb+srv://Guy_test:12345678Guy@cluster0.z0pptqp.mongodb.net/task_manager_db?retryWrites=true&w=majority` |
| `STORAGE_TYPE` | `mongodb` |
| `CORS_ORIGIN` | `*` (we'll update this later with your frontend URL) |

### 3.4 Deploy

1. Click **"Create Web Service"**
2. Wait 2-5 minutes for deployment
3. Once deployed, you'll get a URL like: `https://task-manager-backend-xxxx.onrender.com`
4. **Copy this URL** - you'll need it for the frontend

### 3.5 Test Your Backend

Open in browser:
```
https://task-manager-backend-xxxx.onrender.com/api/health
```

You should see:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-02-01T..."
}
```

---

## Step 4: Deploy Frontend to Vercel

### 4.1 Update Frontend Environment

Before deploying, we need to update the frontend to use the deployed backend.

Edit `client/.env`:
```env
VITE_API_URL=https://task-manager-backend-xxxx.onrender.com/api
```

Replace `xxxx` with your actual Render URL.

Commit this change:
```bash
git add client/.env
git commit -m "Update API URL for production"
git push
```

### 4.2 Deploy to Vercel

**Option A: Using Vercel CLI (Recommended)**

```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to client folder
cd client

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy: Y
# - Which scope: (select your account)
# - Link to existing project: N
# - What's your project's name: task-manager-app
# - In which directory is your code located: ./
# - Want to modify settings: N
```

**Option B: Using Vercel Website**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 4.3 Add Environment Variables in Vercel

1. In your Vercel project, go to **"Settings"** → **"Environment Variables"**
2. Add:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://task-manager-backend-xxxx.onrender.com/api`
   - **Environment**: All (Production, Preview, Development)
3. Click **"Save"**

### 4.4 Redeploy

1. Go to **"Deployments"** tab
2. Click **"Redeploy"** on the latest deployment
3. Or push a new commit to trigger auto-deployment

### 4.5 Get Your Frontend URL

After deployment, Vercel gives you a URL like:
```
https://task-manager-app-xxxx.vercel.app
```

**Copy this URL** - this is your live app!

---

## Step 5: Update CORS Settings

Now that we have the frontend URL, let's update the backend CORS settings:

1. Go back to **Render Dashboard** → Your backend service
2. Click **"Environment"** (left sidebar)
3. Update `CORS_ORIGIN`:
   - **Old value**: `*`
   - **New value**: `https://task-manager-app-xxxx.vercel.app` (your Vercel URL)
4. Click **"Save Changes"**
5. The service will automatically redeploy

---

## Step 6: Test Your Live App

### 6.1 Open Your App

Visit your Vercel URL:
```
https://task-manager-app-xxxx.vercel.app
```

### 6.2 Test Functionality

1. ✅ Create a category
2. ✅ Create a task
3. ✅ Edit a task
4. ✅ Change task status
5. ✅ Delete a task
6. ✅ Try from your phone
7. ✅ Try from another computer

---

## Step 7: Custom Domain (Optional)

### 7.1 Add Custom Domain to Vercel

If you have a domain (e.g., `mytasks.com`):

1. Go to Vercel project → **"Settings"** → **"Domains"**
2. Add your domain
3. Follow DNS configuration instructions
4. Update `CORS_ORIGIN` in Render with your new domain

---

## Troubleshooting

### Issue: Backend not connecting to MongoDB

**Solution:**
1. Check MongoDB Atlas network access allows 0.0.0.0/0
2. Verify `MONGODB_URI` in Render environment variables
3. Check Render logs for connection errors

### Issue: Frontend can't connect to backend

**Solution:**
1. Verify `VITE_API_URL` in Vercel environment variables
2. Check CORS_ORIGIN in Render matches your Vercel URL
3. Test backend health endpoint directly

### Issue: "Free instance will spin down with inactivity"

**Note:** Render free tier sleeps after 15 minutes of inactivity. First request after sleep takes 30-60 seconds to wake up.

**Solutions:**
- Use a service like [UptimeRobot](https://uptimerobot.com) to ping your backend every 14 minutes (free)
- Upgrade to paid Render plan ($7/month for always-on)

### Issue: Changes not showing after deployment

**Solution:**
1. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
2. Check if new deployment succeeded in Vercel/Render
3. Clear browser cache

---

## Automatic Deployments

Both Vercel and Render support automatic deployments:

### For Frontend (Vercel):
```bash
# Any push to main branch triggers deployment
git add .
git commit -m "Update feature"
git push
```

Vercel automatically builds and deploys in ~2 minutes.

### For Backend (Render):
Same as above - push to GitHub triggers automatic redeploy.

---

## Cost Summary

| Service | Free Tier Limits | Upgrade Cost |
|---------|------------------|--------------|
| MongoDB Atlas | 512MB storage | $0.08/hour (~$57/month) for next tier |
| Render | 750 hours/month, sleeps after 15min idle | $7/month for always-on |
| Vercel | 100GB bandwidth, unlimited sites | $20/month Pro (not needed for personal use) |

**Total for free tier: $0/month** ✅

---

## Production Checklist

Before sharing your app publicly:

- [ ] Change MongoDB password to something more secure
- [ ] Update CORS to specific domain (not `*`)
- [ ] Add rate limiting to backend (prevent abuse)
- [ ] Set up error monitoring (e.g., Sentry)
- [ ] Configure backup strategy for MongoDB
- [ ] Add user authentication (if needed)
- [ ] Set up SSL/HTTPS (Vercel and Render do this automatically)

---

## Your Live URLs

Your deployed application:

- **Frontend**: https://task-manager-app-seven-murex.vercel.app/
- **Backend**: https://task-manager-backend-7lie.onrender.com
- **API Health Check**: https://task-manager-backend-7lie.onrender.com/api/health

Share the frontend URL with anyone! 🎉

---

## Alternative Deployment Options

If you prefer other services:

### Backend Alternatives:
- **Railway** (similar to Render, also has free tier)
- **Fly.io** (free tier available)
- **Heroku** (no longer has free tier)
- **DigitalOcean App Platform** ($5/month)

### Frontend Alternatives:
- **Netlify** (very similar to Vercel, free tier)
- **Cloudflare Pages** (free, unlimited bandwidth)
- **GitHub Pages** (free, but requires static site)

---

## Need Help?

Common commands:

```bash
# View backend logs on Render
# Go to: Dashboard → Your Service → Logs tab

# View Vercel deployment logs
# Go to: Dashboard → Your Project → Deployments → Click deployment

# Redeploy backend manually
# Render Dashboard → Your Service → Manual Deploy → Deploy latest commit

# Redeploy frontend manually
# Vercel Dashboard → Deployments → Click "..." → Redeploy
```

---

**Congratulations! Your Task Manager is now live online! 🚀**

You can now access it from anywhere in the world on any device with internet.
