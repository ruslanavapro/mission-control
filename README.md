# Mission Control Dashboard

**Personal command center for all projects, goals, and conversations.**

A modern, fully-featured dashboard built with Next.js 16, integrating with Clawdbot, AvaBase, and GitHub to provide a unified view of your work.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ruslanavapro/mission-control)

---

## 🚀 Quick Start

```bash
cd repos/mission-control
npm install
cp .env.local.example .env.local
npm run dev
```

Open **http://localhost:3000** → Dashboard ready! 🎉

See [QUICKSTART.md](QUICKSTART.md) for detailed setup instructions.

### AI Employees SSOT Editor

This repo includes a small internal editor for the **AI Employees** project SSOT JSON.

- Open: **http://localhost:3000/ai-employees**
- API: **GET/POST http://localhost:3000/api/ai-employees**

By default it reads/writes to `../../shared/projects/ai-employees.json` (relative to this repo). You can override the location with:

```bash
AI_EMPLOYEES_DATA_FILE=/absolute/path/to/ai-employees.json npm run dev
```

---

## Goals Dashboard

Run locally:

```bash
npm install
npm run dev
```

Goal data is stored at `/Users/claw/clawd/shared/ava-collaboration/goal-tree/goal-tree.json` when writable. If that path is unavailable at runtime, the app falls back to `data/goal-tree.json`.

---

## AI Employees Dashboard

Dashboard page: `http://localhost:3000/ai-employees`

AI Employees data is stored at `/Users/claw/clawd/shared/projects/ai-employees.json` when writable. If that path is unavailable at runtime, the app falls back to `data/ai-employees.json`.

---

## ✨ Features

### ✅ Currently Implemented

- **📊 Dashboard Home** - Overview with stats, active projects, goals, conversations
- **🔍 Search & Filter** - Find projects by name, description, or status
- **📈 Stats Overview** - Activity metrics (projects, conversations, commits)
- **🎯 Goals Tracker** - Beautiful pie chart visualization of 6 life goals
- **📁 Project Cards** - Visual cards with progress, tasks, docs, GitHub links
- **📋 Project Detail Pages** - Full project view with Kanban boards
- **💬 Conversation Feed** - Recent Clawdbot sessions with summaries
- **🌙 Dark Mode** - Beautiful dark theme (Zinc palette)
- **📱 Responsive** - Works on desktop, tablet, and mobile

### 🔗 Integrations

- **Clawdbot Sessions API** - Conversation history and summaries
- **AvaBase API** - Semantic search across knowledge base
- **GitHub API** - Repository data, commits, and issues

---

## 📊 Screenshots

### Dashboard Home
*(Full dashboard with projects, goals, and stats)*

### Project Detail Page
*(Kanban board with tasks and metrics)*

### Goals Visualization
*(Pie chart showing balanced priorities)*

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Language** | TypeScript 5.7 |
| **Styling** | Tailwind CSS v4 |
| **Components** | shadcn/ui (Zinc theme) |
| **Icons** | lucide-react |
| **State** | React hooks |
| **Deploy** | Vercel (recommended) |

---

## 📦 Installation

### Prerequisites

- Node.js 20+
- npm or yarn
- Git

### Steps

```bash
# Clone repository
git clone https://github.com/ruslanavapro/mission-control.git
cd mission-control

# Install dependencies
npm install

# Set up environment
cp .env.local.example .env.local
# Edit .env.local with your API URLs

# Run development server
npm run dev
```

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)

**One-click:**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ruslanavapro/mission-control)

**Manual:**

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy! ✅

See [DEPLOY.md](DEPLOY.md) for detailed deployment guide.

### Environment Variables

Basic Auth is enforced for all routes. Set `DASH_AUTH_USER` and `DASH_AUTH_PASS` for any non-local access; if either is missing, only `127.0.0.1`/`::1` can access the app.

```env
# Required
AVABASE_API_URL=https://ava-2-brain-production.up.railway.app
DASH_AUTH_USER=your_username
DASH_AUTH_PASS=your_password

# Optional (for full functionality)
CLAWDBOT_API_URL=http://localhost:18800
GITHUB_TOKEN=your_token_here
```

---

## 🏗️ Project Structure

```
mission-control/
├── app/                      # Next.js app directory
│   ├── page.tsx             # Dashboard home
│   ├── layout.tsx           # Root layout
│   ├── projects/[id]/       # Project detail pages
│   └── api/                 # API routes
│       ├── projects/        # Projects endpoint
│       ├── conversations/   # Conversations endpoint
│       └── stats/           # Stats endpoint
├── components/
│   ├── Dashboard/           # Dashboard components
│   │   ├── SearchFilter.tsx
│   │   └── StatsOverview.tsx
│   ├── ProjectCard/         # Project card
│   ├── GoalsTracker/        # Goals visualization
│   ├── ConversationFeed/    # Recent conversations
│   └── ui/                  # shadcn/ui primitives
├── lib/
│   ├── api/                 # API clients
│   │   ├── clawdbot.ts      # Clawdbot integration
│   │   ├── avabase.ts       # AvaBase integration
│   │   └── github.ts        # GitHub integration
│   └── utils.ts             # Utilities
└── public/                  # Static assets
```

---

## 🎯 Roadmap

### ✅ Phase 1-2 Complete
- [x] Base dashboard structure
- [x] Project cards & detail pages
- [x] Goals tracker with pie chart
- [x] Search & filter functionality
- [x] Stats overview
- [x] API integrations (Clawdbot, AvaBase, GitHub)
- [x] Responsive design
- [x] Dark mode

### 🚧 Phase 3: Enhanced Features (Next)
- [ ] Real-time updates (WebSocket/polling)
- [ ] Task management (CRUD operations)
- [ ] Drag & drop Kanban boards
- [ ] Google Calendar integration
- [ ] Advanced search & filters
- [ ] Export reports (PDF)

### 🤖 Phase 4: AI & Automation
- [ ] AI-assisted task creation (from voice notes)
- [ ] Automatic conversation categorization
- [ ] Smart suggestions ("You haven't worked on X in 5 days")
- [ ] Productivity analytics (heatmaps, time tracking)

### 👥 Phase 5: Collaboration
- [ ] Shared dashboards (for team members)
- [ ] Real-time collaboration
- [ ] Notifications (Telegram integration)
- [ ] Roles & permissions
- [ ] Comments & mentions

---

## 🧩 API Routes

### GET `/api/projects`
Returns all projects with data from GitHub and AvaBase.

**Response:**
```json
{
  "projects": [
    {
      "id": "mission-control",
      "name": "Mission Control Dashboard",
      "description": "Personal command center",
      "status": "active",
      "progress": 75,
      "githubUrl": "https://github.com/...",
      "documentsCount": 12,
      "tasksCompleted": 8,
      "tasksTotal": 10,
      "lastActivity": "2 hours ago"
    }
  ]
}
```

### GET `/api/conversations`
Returns recent conversations from Clawdbot sessions.

### GET `/api/stats`
Returns activity statistics.

---

## 🎨 Design System

### Color Palette

- **Primary:** Zinc (neutral, professional)
- **Status:**
  - Active: Green (#10b981)
  - Pending: Yellow (#eab308)
  - Blocked: Red (#ef4444)
  - Done: Blue (#3b82f6)
- **Goals:** Green, Blue, Purple, Yellow, Orange, Pink

### Typography

- **Font:** Inter (with system fallback)
- **Sizes:** 3xl/2xl/xl/base/sm/xs

---

## 🐛 Troubleshooting

### Port 3000 already in use
```bash
lsof -ti:3000 | xargs kill
# Or use different port
PORT=3001 npm run dev
```

### APIs not responding
- Check `.env.local` is configured correctly
- Verify Clawdbot gateway is running
- Dashboard gracefully degrades if APIs unavailable

### Build errors
```bash
rm -rf .next node_modules
npm install
npm run build
```

---

## 🤝 Contributing

This is a personal project, but improvements and suggestions are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📝 License

Private project - not for public distribution.

---

## 📚 Documentation

- [QUICKSTART.md](QUICKSTART.md) - Get started in 30 seconds
- [DEPLOY.md](DEPLOY.md) - Deployment guide (Vercel, Docker)
- [Architecture](docs/ARCHITECTURE.md) - Technical architecture (TBD)

---

## 🔗 Links

- **Live Demo:** (Deploy to get your own)
- **AvaBase:** https://ava-2-brain-production.up.railway.app
- **GitHub:** https://github.com/ruslanavapro/mission-control

---

## 📊 Stats

- **Files:** 40+
- **Lines of Code:** 9500+
- **Components:** 10+
- **API Routes:** 3
- **Build Time:** ~500ms (Turbopack)
- **Bundle Size:** TBD (optimize in Phase 3)

---

## 🙏 Acknowledgments

Built with:
- [Next.js](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Vercel](https://vercel.com)

---

**Built with ❤️ by Ava** 🗝️

*Last updated: 2026-01-30*
