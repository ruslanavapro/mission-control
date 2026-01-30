# Mission Control Dashboard

**Personal command center for all projects, goals, and conversations.**

A modern, fully-featured dashboard built with Next.js 16, integrating with Clawdbot, AvaBase, and GitHub to provide a unified view of your work.

## 🚀 Features

### ✅ Implemented (Phase 1-2)

- **Dashboard Home** - Overview with active projects, goals, and recent conversations
- **Project Cards** - Visual cards showing status, progress, tasks, and documents
- **Project Detail View** - Full project page with Kanban board for tasks
- **Goals Tracker** - Visual representation of 6 life goals with balanced priorities
- **Conversation Feed** - Recent conversations from Clawdbot sessions
- **Dark Mode** - Beautiful dark theme enabled by default
- **Responsive Design** - Works on desktop, tablet, and mobile

### 🔗 Integrations

- **Clawdbot Sessions API** - Fetch conversation history and summaries
- **AvaBase API** - Search documents and knowledge base
- **GitHub API** - Pull repository data, commits, and issues

### 🎨 Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Components:** shadcn/ui (Zinc theme)
- **Icons:** lucide-react
- **State:** React hooks (useEffect, useState)

## 📦 Installation

```bash
# Install dependencies
cd repos/mission-control
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your API URLs

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## 🏗️ Project Structure

```
mission-control/
├── app/
│   ├── page.tsx              # Dashboard home
│   ├── layout.tsx            # Root layout (dark mode)
│   ├── projects/[id]/        # Project detail pages
│   └── api/
│       ├── projects/         # Projects API route
│       └── conversations/    # Conversations API route
├── components/
│   ├── Dashboard/
│   ├── ProjectCard/          # Project card component
│   ├── GoalsTracker/         # Goals visualization
│   ├── ConversationFeed/     # Recent conversations
│   └── ui/                   # shadcn/ui components
├── lib/
│   └── api/
│       ├── clawdbot.ts       # Clawdbot API client
│       ├── avabase.ts        # AvaBase API client
│       └── github.ts         # GitHub API client
└── .env.local                # Environment variables
```

## 🔧 Configuration

### Environment Variables

Create `.env.local` with:

```env
# Clawdbot API
CLAWDBOT_API_URL=http://localhost:18800

# AvaBase API
AVABASE_API_URL=https://ava-2-brain-production.up.railway.app

# GitHub (optional, for higher rate limits)
# GITHUB_TOKEN=your_token_here
```

## 📊 API Routes

### GET `/api/projects`
Returns all projects with data from GitHub and AvaBase.

### GET `/api/conversations`
Returns recent conversations from Clawdbot sessions.

## 🎯 Roadmap

### Phase 3: Enhanced Features (Next)
- [ ] Real-time updates (WebSocket)
- [ ] Task management (CRUD operations)
- [ ] Drag & drop Kanban board
- [ ] Google Calendar integration
- [ ] Advanced search & filters

### Phase 4: AI & Automation
- [ ] AI-assisted task creation (from voice notes)
- [ ] Automatic conversation categorization
- [ ] Smart suggestions ("You haven't worked on X in 5 days")
- [ ] Productivity analytics & heatmaps

### Phase 5: Collaboration
- [ ] Shared dashboards (for Albina, team members)
- [ ] Real-time collaboration
- [ ] Notifications & alerts (Telegram integration)
- [ ] Export reports (PDF, weekly/monthly summaries)

## 🤝 Contributing

This is a personal project for Ruslan's workflow. Improvements and suggestions welcome!

## 📝 License

Private project - not for public distribution.

---

**Built with ❤️ by Ava** 🗝️
