# Quick Deployment Checklist

Use this checklist when deploying your Task Manager app online.

## ☁️ Pre-Deployment Setup

- [ ] Create accounts:
  - [ ] [Render.com](https://render.com) (backend)
  - [ ] [Vercel.com](https://vercel.com) (frontend)
  - [ ] [GitHub.com](https://github.com) (code hosting)

- [ ] MongoDB Atlas:
  - [ ] Login to [MongoDB Atlas](https://cloud.mongodb.com)
  - [ ] Network Access → Allow 0.0.0.0/0

- [ ] Git setup:
  ```bash
  git init
  git add .
  git commit -m "Initial commit"
  git remote add origin https://github.com/YOUR_USERNAME/task-manager-app.git
  git push -u origin main
  ```

---

## 🔧 Backend Deployment (Render)

- [ ] Go to [Render Dashboard](https://dashboard.render.com)
- [ ] New + → Web Service
- [ ] Connect GitHub repo
- [ ] Configure:
  - Name: `task-manager-backend`
  - Root Directory: `server`
  - Build Command: `npm install`
  - Start Command: `npm start`
  - Instance Type: **Free**

- [ ] Environment Variables:
  ```
  NODE_ENV = production
  PORT = 5000
  MONGODB_URI = mongodb+srv://Guy_test:12345678Guy@cluster0...
  STORAGE_TYPE = mongodb
  CORS_ORIGIN = *
  ```

- [ ] Click "Create Web Service"
- [ ] Wait 2-5 minutes
- [ ] **Copy backend URL**: `https://task-manager-backend-xxxx.onrender.com`
- [ ] Test: Open `https://your-backend-url/api/health`

---

## 🎨 Frontend Deployment (Vercel)

### Update Environment

- [ ] Edit `client/.env`:
  ```env
  VITE_API_URL=https://task-manager-backend-xxxx.onrender.com/api
  ```

- [ ] Commit and push:
  ```bash
  git add client/.env
  git commit -m "Update API URL for production"
  git push
  ```

### Deploy

**Option A: Vercel CLI**
```bash
npm install -g vercel
cd client
vercel
```

**Option B: Vercel Website**
- [ ] Go to [Vercel Dashboard](https://vercel.com/dashboard)
- [ ] New Project → Import GitHub repo
- [ ] Configure:
  - Framework: Vite
  - Root Directory: `client`
  - Build Command: `npm run build`
  - Output Directory: `dist`

- [ ] Add Environment Variable:
  - Key: `VITE_API_URL`
  - Value: `https://task-manager-backend-xxxx.onrender.com/api`

- [ ] Deploy
- [ ] **Copy frontend URL**: `https://task-manager-app-xxxx.vercel.app`

---

## 🔒 Update CORS

- [ ] Go to Render Dashboard → Your service → Environment
- [ ] Update `CORS_ORIGIN`:
  ```
  https://task-manager-app-xxxx.vercel.app
  ```
- [ ] Save (auto-redeploys)

---

## ✅ Final Testing

- [ ] Open your app: `https://task-manager-app-xxxx.vercel.app`
- [ ] Create a category
- [ ] Create a task
- [ ] Edit task
- [ ] Change status
- [ ] Delete task
- [ ] Test on phone
- [ ] Test on another computer

---

## 📝 Your Live URLs

**Frontend**: https://task-manager-app-seven-murex.vercel.app/

**Backend**: https://task-manager-backend-7lie.onrender.com

**API Health**: https://task-manager-backend-7lie.onrender.com/api/health

---

## 🔄 Future Updates

To deploy changes:

```bash
git add .
git commit -m "Description of changes"
git push
```

Both Vercel and Render will auto-deploy from GitHub! 🎉

---

## ⚠️ Common Issues

### Backend sleeps after 15 minutes (Free tier)
- First request takes 30-60 seconds to wake up
- Use UptimeRobot (free) to keep it alive
- Or upgrade to Render paid plan ($7/month)

### Changes not showing
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Check deployment logs in Vercel/Render

### Can't connect to backend
- Verify CORS_ORIGIN matches frontend URL
- Check Render environment variables
- Test backend health endpoint

---

**See DEPLOYMENT_GUIDE.md for detailed instructions**
