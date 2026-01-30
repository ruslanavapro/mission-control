# Quick Start Guide

## 🚀 Get Started in 30 Seconds

```bash
# 1. Navigate to project
cd repos/mission-control

# 2. Install dependencies (if not done already)
npm install

# 3. Set up environment
cp .env.local.example .env.local
# Edit .env.local if needed

# 4. Run dev server
npm run dev
```

Open **http://localhost:3000** → Dashboard ready! 🎉

---

## 📦 What You'll See

### Dashboard Home
- **Active Projects** - Your current work with progress bars
- **Goals Tracker** - 6 life goals visualization (20%/16%/16%/16%/16%/16%)
- **Recent Conversations** - Last chats from Clawdbot sessions
- **Quick Stats** - Active/Pending/Done project counts

### Click on any project → Full project page with:
- Kanban board (TODO → In Progress → Done)
- Metrics (progress %, tasks, docs)
- GitHub link (if available)
- Last activity timestamp

---

## 🔧 Configuration

### Environment Variables

Edit `.env.local`:

```env
# Clawdbot API (local gateway)
CLAWDBOT_API_URL=http://localhost:18800

# AvaBase (hosted on Railway)
AVABASE_API_URL=https://ava-2-brain-production.up.railway.app

# GitHub token (optional, for higher rate limits)
# GITHUB_TOKEN=your_token_here
```

**Note:** Dashboard works even if APIs are unavailable (graceful degradation).

---

## 🎯 Key Features

✅ **Real-time project tracking** - GitHub integration  
✅ **Goals visualization** - Balanced priority system  
✅ **Conversation history** - Clawdbot sessions  
✅ **Dark mode** - Enabled by default  
✅ **Responsive** - Works on desktop/tablet/mobile  
✅ **Fast** - Next.js 16 with Turbopack  

---

## 🛠️ Development

### Available Scripts

```bash
# Start dev server (with Turbopack)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

### Project Structure

```
mission-control/
├── app/              # Pages and API routes
├── components/       # React components
├── lib/              # API clients and utilities
└── public/           # Static assets
```

---

## 🐛 Troubleshooting

### Port 3000 already in use?
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill

# Or use different port
PORT=3001 npm run dev
```

### APIs not working?
- Check `.env.local` is configured
- Verify Clawdbot gateway is running (`clawdbot gateway status`)
- Dashboard will show empty data if APIs unavailable (by design)

### Dependencies issues?
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Next Steps

1. **Customize projects** - Edit `app/api/projects/route.ts` to add your projects
2. **Add tasks** - Click project → add tasks to Kanban board
3. **Configure goals** - Edit `components/GoalsTracker/GoalsTracker.tsx`
4. **Connect calendar** - Phase 3: Google Calendar integration coming soon

---

## 🔗 Links

- **Dashboard:** http://localhost:3000
- **Project Detail Example:** http://localhost:3000/projects/mission-control
- **API Routes:**
  - http://localhost:3000/api/projects
  - http://localhost:3000/api/conversations

---

**Built with ❤️ by Ava** 🗝️

Need help? Ask in chat!
