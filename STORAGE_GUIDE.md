# Storage Configuration Guide

Your Task Manager app supports **two storage modes**: Local File Storage and MongoDB Cloud Storage.

## 📁 Current Mode: File Storage (Local)

**Benefits:**
- ✅ No database installation required
- ✅ Works completely offline
- ✅ Fast and simple
- ✅ Easy to backup (just copy JSON files)
- ✅ No VPN issues
- ❌ Local only (can't access from other devices)

**Data Location:** `server/data/tasks.json` & `server/data/categories.json`

---

## ☁️  MongoDB Storage (Cloud)

**Benefits:**
- ✅ Access from anywhere
- ✅ Access from multiple devices (phone, tablet, etc.)
- ✅ Cloud backup included
- ✅ Better for large datasets
- ❌ Requires internet connection
- ❌ May have VPN connectivity issues

**Requirements:** MongoDB Atlas account (free) or local MongoDB

---

## 🔄 How to Switch Between Storage Modes

### Switch to MongoDB (Cloud Access)

1. **Edit `server/.env`:**
   ```env
   STORAGE_TYPE=mongodb
   MONGODB_URI=mongodb+srv://Guy_test:12345678Guy@cluster0.z0pptqp.mongodb.net/task_manager_db?retryWrites=true&w=majority
   ```

2. **Update CORS (for phone access):**
   ```env
   CORS_ORIGIN=*
   ```

3. **Edit `client/.env`:**
   ```env
   VITE_API_URL=http://10.242.33.130:5000/api
   ```
   (Use your computer's IP address)

4. **Edit `client/vite.config.js`:**
   ```js
   server: {
     host: true,  // Add this line
     port: 5173,
     // ...
   }
   ```

5. **Disconnect VPN** (if using one)

6. **Restart servers:**
   ```bash
   ./stop.sh
   ./start.sh
   ```

7. **Access from phone:** http://10.242.33.130:5173

---

### Switch Back to File Storage (Local Only)

1. **Edit `server/.env`:**
   ```env
   STORAGE_TYPE=file
   CORS_ORIGIN=http://localhost:5173
   ```

2. **Edit `client/.env`:**
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

3. **Edit `client/vite.config.js`:**
   ```js
   server: {
     port: 5173,
     // Remove 'host: true' line
     // ...
   }
   ```

4. **Restart servers:**
   ```bash
   ./stop.sh
   ./start.sh
   ```

5. **Access:** http://localhost:5173

---

## 📊 Storage Mode Comparison

| Feature | File Storage | MongoDB Storage |
|---------|--------------|-----------------|
| Setup | Zero setup | Requires MongoDB |
| Internet | Not required | Required |
| VPN Issues | None | May have issues |
| Access from Phone | No | Yes |
| Data Backup | Copy JSON files | Automatic (Atlas) |
| Speed | Very fast | Fast |
| Best For | Solo, local use | Multi-device access |

---

## 🔒 Data Migration

### From File Storage to MongoDB

Your data is **not automatically migrated**. To move data:

1. **Export from files:**
   - Copy data from `server/data/tasks.json`
   - Copy data from `server/data/categories.json`

2. **Switch to MongoDB mode**

3. **Import manually:**
   - Recreate categories in the UI
   - Recreate tasks in the UI

   OR use a migration script (advanced)

### From MongoDB to File Storage

Same process - manual recreation or export/import.

---

## 💡 Recommended Setup

### For Solo Use (One Computer):
```env
STORAGE_TYPE=file
```
**Reason:** Simpler, faster, no internet required

### For Multi-Device (Phone + Computer):
```env
STORAGE_TYPE=mongodb
```
**Reason:** Access from anywhere

### Best of Both Worlds:
- Use **file storage** for daily work
- Periodically switch to **MongoDB** for backup
- Or maintain two separate instances

---

## 🆘 Troubleshooting

### MongoDB Connection Issues
1. Disconnect VPN
2. Check MongoDB Atlas IP whitelist (allow 0.0.0.0/0)
3. Verify connection string in `.env`
4. Check internet connection

### File Storage Issues
1. Check `server/data/` directory exists
2. Verify JSON files are valid
3. Check file permissions

### Phone Can't Connect
1. Ensure same WiFi network
2. Verify IP address in `client/.env`
3. Check firewall settings
4. Ensure `STORAGE_TYPE=mongodb` (file storage doesn't work over network)

---

## 📝 Quick Reference Commands

**Check current mode:**
```bash
grep STORAGE_TYPE server/.env
```

**View file storage data:**
```bash
cat server/data/tasks.json
cat server/data/categories.json
```

**Backup file storage:**
```bash
cp -r server/data server/data_backup_$(date +%Y%m%d)
```

**Switch modes:**
```bash
# Edit server/.env, then:
./stop.sh
./start.sh
```

---

## 🎯 Current Configuration

Check your current settings:

**Server:**
- Storage Mode: Check `STORAGE_TYPE` in `server/.env`
- CORS: Check `CORS_ORIGIN` in `server/.env`

**Client:**
- API URL: Check `VITE_API_URL` in `client/.env`
- Network Access: Check `host` in `client/vite.config.js`

---

**Need help? Check the main README.md or QUICKSTART.md**
