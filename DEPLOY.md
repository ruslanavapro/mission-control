# Deployment Guide

## 🚀 Deploy to Vercel (Recommended)

**One-click deployment:**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ruslanavapro/mission-control)

**Or manually:**

1. **Push to GitHub:**
   ```bash
   cd repos/mission-control
   git remote add origin https://github.com/ruslanavapro/mission-control.git
   git push -u origin main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel auto-detects Next.js settings ✅

3. **Configure Environment Variables:**
   In Vercel dashboard, add:
   ```
   AVABASE_API_URL=https://ava-2-brain-production.up.railway.app
   ```
   
   Optional (for Clawdbot integration):
   ```
   CLAWDBOT_API_URL=your_public_clawdbot_url
   GITHUB_TOKEN=your_github_token
   ```

4. **Deploy!**
   - Click "Deploy"
   - Vercel builds and deploys automatically
   - Your dashboard is live at: `https://mission-control-xxx.vercel.app`

---

## 🏗️ Build for Production

```bash
# Build
npm run build

# Test production build locally
npm start

# Build will be in .next/ folder
```

---

## 🐳 Docker Deployment (Optional)

**Dockerfile:**

```dockerfile
FROM node:20-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

**Build & Run:**

```bash
docker build -t mission-control .
docker run -p 3000:3000 mission-control
```

---

## 🌐 Environment Variables

### Required

- `AVABASE_API_URL` - AvaBase API endpoint (default: Railway production)

### Optional

- `CLAWDBOT_API_URL` - Clawdbot Sessions API endpoint
  - Local: `http://localhost:18800`
  - Tunneled (ngrok/Tailscale): your public URL
  
- `GITHUB_TOKEN` - GitHub Personal Access Token
  - Get at: https://github.com/settings/tokens
  - Increases API rate limit from 60 to 5000 req/hour

---

## 🔐 Security Notes

### API Keys
- Never commit `.env.local` to git (already in `.gitignore`)
- Use Vercel's environment variables for production
- Rotate tokens regularly

### CORS & API Access
- Clawdbot API must be publicly accessible for production deploy
- Consider using Tailscale or ngrok for secure tunneling
- Or deploy Clawdbot to a public endpoint

---

## 📊 Production Checklist

Before deploying to production:

- [ ] Environment variables configured
- [ ] GitHub token added (optional but recommended)
- [ ] Tested build locally (`npm run build && npm start`)
- [ ] Verified API endpoints are accessible
- [ ] Custom domain configured (optional)
- [ ] Analytics added (Vercel Analytics recommended)
- [ ] Error monitoring (Sentry optional)

---

## 🚨 Troubleshooting

### Build fails
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

### API not working in production
- Check environment variables in Vercel dashboard
- Verify API URLs are publicly accessible
- Check Vercel function logs for errors

### Slow performance
- Enable Vercel Edge Functions (automatic)
- Add ISR (Incremental Static Regeneration) for static pages
- Configure CDN caching

---

## 🔄 Continuous Deployment

Vercel automatically deploys on every push to `main`:

```bash
git add .
git commit -m "feat: new feature"
git push origin main
# Vercel deploys automatically ✅
```

**Preview deployments:**
- Every PR gets a unique preview URL
- Test changes before merging

---

## 📈 Monitoring

### Vercel Analytics
Add to `app/layout.tsx`:

```tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### Speed Insights
```bash
npm install @vercel/speed-insights
```

Add to layout:
```tsx
import { SpeedInsights } from '@vercel/speed-insights/next'
```

---

## 🎉 That's it!

Your Mission Control dashboard is now live and auto-deploying on every commit.

**Questions?** Check:
- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- Project README.md

---

🗝️ **Built with ❤️ by Ava**
