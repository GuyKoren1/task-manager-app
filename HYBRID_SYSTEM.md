# 🎯 Hybrid Storage System - Best of Both Worlds!

Your Task Manager now supports **BOTH** storage modes and you can switch between them anytime!

## ✅ What's New

You now have **TWO storage options**:

### 📁 File Storage (Current Mode)
- ✅ Works offline
- ✅ Super fast
- ✅ No database needed
- ✅ Local only
- **Your data:** `server/data/tasks.json` & `categories.json`

### ☁️  MongoDB Storage
- ✅ Access from anywhere
- ✅ Use from your phone
- ✅ Cloud backup
- ✅ Multi-device sync

## 🔄 Easy Switching

### Method 1: Use the Switch Script (Easiest!)

```bash
./switch-storage.sh
```

Follow the prompts to switch modes.

### Method 2: Manual Switch

**To MongoDB (for phone access):**
```bash
# Edit server/.env
STORAGE_TYPE=mongodb
MONGODB_URI=mongodb+srv://Guy_test:...  # (uncomment this line)

# Restart
./stop.sh
./start.sh
```

**Back to File Storage:**
```bash
# Edit server/.env
STORAGE_TYPE=file

# Restart
./stop.sh
./start.sh
```

## 📊 Current Status

Check which mode you're using:

```bash
# View current mode
grep STORAGE_TYPE server/.env

# Or check server logs
tail server.log
# Look for: "Using FILE-BASED storage" or "Using MONGODB storage"
```

## 💡 When to Use Each Mode

### Use **File Storage** When:
- ✅ Working alone on one computer
- ✅ Want fastest performance
- ✅ Don't need internet
- ✅ Prefer simple setup

### Use **MongoDB** When:
- ✅ Need phone access
- ✅ Want multi-device sync
- ✅ Need cloud backup
- ✅ Traveling (access anywhere)

## 🔒 Your Data is Safe!

- **File mode:** Data stored locally in `server/data/`
- **MongoDB mode:** Data stored in MongoDB Atlas cloud
- **Switching modes does NOT delete data**
- Each mode has its own independent data storage

⚠️ **Note:** Data is NOT automatically synced between modes. If you switch modes, you'll need to manually recreate your tasks in the new mode.

## 📝 Quick Reference

| Command | Description |
|---------|-------------|
| `./switch-storage.sh` | Interactive mode switcher |
| `grep STORAGE_TYPE server/.env` | Check current mode |
| `cat server/data/tasks.json` | View file storage data |
| See **STORAGE_GUIDE.md** | Detailed documentation |

## 🚀 Getting Started

**You're currently using FILE storage** (the stable version that's working now!).

When you're ready to try MongoDB for phone access:
1. Run: `./switch-storage.sh`
2. Select: `mongodb`
3. Follow the prompts
4. See STORAGE_GUIDE.md for phone access setup

**Your current working setup is preserved and safe!** ✅

---

**Need detailed instructions?** Check **STORAGE_GUIDE.md**
