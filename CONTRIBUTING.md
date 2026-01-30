# Contributing to Mission Control

Thank you for considering contributing to Mission Control! This document provides guidelines and instructions.

## 🚀 Quick Start

1. **Fork the repository**
2. **Clone your fork:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/mission-control.git
   cd mission-control
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Set up environment:**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your API keys
   ```
5. **Run dev server:**
   ```bash
   npm run dev
   ```

---

## 📋 Development Workflow

1. **Create a branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow existing code style
   - Add TypeScript types
   - Keep components small and focused

3. **Test your changes:**
   ```bash
   npm run lint
   npm run build
   ```

4. **Commit:**
   ```bash
   git add .
   git commit -m "feat: Add your feature"
   ```

5. **Push:**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request**

---

## 🎯 Commit Message Convention

We use conventional commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Code style (formatting, etc.)
- `refactor:` Code refactoring
- `perf:` Performance improvements
- `test:` Tests
- `chore:` Build/tooling changes

**Examples:**
```
feat: Add drag and drop to Kanban board
fix: Resolve task deletion bug
docs: Update API documentation
```

---

## 🧩 Project Structure

```
mission-control/
├── app/                  # Next.js App Router
│   ├── api/             # API routes
│   ├── analytics/       # Analytics page
│   ├── settings/        # Settings page
│   └── projects/[id]/   # Dynamic project pages
├── components/          # React components
│   ├── Dashboard/       # Dashboard widgets
│   ├── Tasks/           # Task management
│   ├── Analytics/       # Charts and analytics
│   └── ui/              # shadcn/ui components
├── lib/                 # Utilities and helpers
│   ├── api/             # API clients
│   ├── db/              # Data access
│   └── export/          # Export utilities
├── data/                # File-based storage
└── public/              # Static assets
```

---

## 🎨 Component Guidelines

### File Organization
- One component per file
- Co-locate related files (types, styles, tests)
- Use descriptive filenames

### TypeScript
- Always add types for props
- Use interfaces for component props
- Avoid `any` type

**Example:**
```typescript
interface TaskCardProps {
  task: Task
  onUpdate: (id: string, updates: Partial<Task>) => void
  onDelete: (id: string) => void
}

export function TaskCard({ task, onUpdate, onDelete }: TaskCardProps) {
  // ...
}
```

### React Best Practices
- Use functional components
- Leverage hooks (useState, useEffect, useMemo)
- Memoize expensive computations
- Keep components small (<200 lines)

### Styling
- Use Tailwind CSS classes
- Use shadcn/ui components when possible
- Follow dark mode design
- Keep responsive (mobile-first)

---

## 🧪 Testing

Currently no automated tests. Contributions to add tests are welcome!

**Manual testing checklist:**
- [ ] Test on desktop (Chrome, Firefox, Safari)
- [ ] Test on mobile (iOS Safari, Chrome)
- [ ] Test dark/light mode
- [ ] Test with/without API keys
- [ ] Check error states
- [ ] Verify accessibility (keyboard nav)

---

## 📝 Documentation

When adding features:
1. Update README.md if needed
2. Add API documentation to API.md
3. Update USER_GUIDE.md with user-facing features
4. Add JSDoc comments to complex functions
5. Update CHANGELOG.md

---

## 🐛 Bug Reports

**Before reporting:**
1. Check existing issues
2. Try latest version
3. Clear browser cache

**Include in report:**
- Mission Control version
- Browser and OS
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Console errors (if any)

---

## 💡 Feature Requests

We welcome feature ideas! Please:
1. Check existing issues/discussions
2. Describe use case
3. Explain why it's valuable
4. Suggest implementation (optional)

---

## 🔧 Adding Integrations

To add a new integration:

1. **Create API client** in `lib/api/`
2. **Add API route** in `app/api/`
3. **Update types** (if needed)
4. **Add UI component** in `components/`
5. **Update Settings** page
6. **Document** in API.md and USER_GUIDE.md

**Example:**
```typescript
// lib/api/slack.ts
export async function getSlackMessages() {
  const res = await fetch('https://slack.com/api/conversations.history', {
    headers: { Authorization: `Bearer ${process.env.SLACK_TOKEN}` }
  })
  return res.json()
}

// app/api/slack/route.ts
export async function GET() {
  const messages = await getSlackMessages()
  return NextResponse.json({ messages })
}

// components/Slack/SlackFeed.tsx
export function SlackFeed() {
  // Fetch and display messages
}
```

---

## 🚀 Adding Features

### New Widget
1. Create component in `components/`
2. Add to dashboard sidebar in `app/page.tsx`
3. Document in USER_GUIDE.md

### New Page
1. Create route in `app/`
2. Add navigation link
3. Update sitemap.ts
4. Update mobile nav (if needed)

### New API Endpoint
1. Create route in `app/api/`
2. Document in API.md
3. Add TypeScript types
4. Handle errors gracefully

---

## 📦 Dependencies

### Adding Dependencies
Only add dependencies if:
- Solves a real problem
- Well-maintained (recent updates)
- Reasonable bundle size
- No better alternative exists

**Run:**
```bash
npm install package-name
npm install -D @types/package-name  # if TypeScript types exist
```

### Updating Dependencies
```bash
npm update
npm audit fix
```

---

## 🎨 Design System

Follow existing patterns:
- **Colors:** Zinc palette (dark mode by default)
- **Components:** shadcn/ui
- **Icons:** lucide-react
- **Font:** Inter
- **Spacing:** 4/6/8 unit system

**Status colors:**
- Active: Green (#10b981)
- Pending: Yellow (#eab308)
- Blocked: Red (#ef4444)
- Done: Blue (#3b82f6)

---

## 🔐 Security

- Never commit API keys or secrets
- Use environment variables
- Sanitize user input
- Validate data on server-side
- Report security issues privately

---

## 📄 License

By contributing, you agree that your contributions will be licensed under the project's license.

---

## 🙏 Thank You!

Your contributions make Mission Control better for everyone. We appreciate your time and effort!

**Questions?** Open an issue or discussion.

**Built with ❤️ by Ava** 🗝️
