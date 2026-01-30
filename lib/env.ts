/**
 * Environment variable validation and helpers
 */

export const env = {
  // Required
  avabase: {
    url: process.env.AVABASE_API_URL || '',
  },

  // Optional
  clawdbot: {
    url: process.env.CLAWDBOT_API_URL || 'http://localhost:18800',
  },

  github: {
    token: process.env.GITHUB_TOKEN || '',
  },

  google: {
    clientEmail: process.env.GOOGLE_CLIENT_EMAIL || '',
    privateKey: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n') || '',
    calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
  },

  // Runtime
  isDev: process.env.NODE_ENV === 'development',
  isProd: process.env.NODE_ENV === 'production',
}

export function validateEnv() {
  const warnings: string[] = []

  if (!env.avabase.url) {
    warnings.push('AVABASE_API_URL is not set - AvaBase integration will be disabled')
  }

  if (!env.github.token) {
    warnings.push('GITHUB_TOKEN is not set - GitHub API rate limit will be low (60 req/hour)')
  }

  if (!env.google.clientEmail || !env.google.privateKey) {
    warnings.push('Google Calendar credentials not set - Calendar integration will be disabled')
  }

  if (warnings.length > 0 && env.isDev) {
    console.warn('\n⚠️  Environment Warnings:')
    warnings.forEach(w => console.warn(`   - ${w}`))
    console.warn('')
  }

  return warnings
}

// Run validation on import in dev mode
if (env.isDev) {
  validateEnv()
}
