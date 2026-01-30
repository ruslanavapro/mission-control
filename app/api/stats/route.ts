import { NextResponse } from 'next/server'
import { getClawdbotSessions } from '@/lib/api/clawdbot'
import { getGithubRepos } from '@/lib/api/github'

export async function GET() {
  try {
    const [sessions, repos] = await Promise.all([
      getClawdbotSessions(100),
      getGithubRepos()
    ])

    // Calculate stats
    const totalProjects = repos.length
    const activeRepos = repos.filter(r => {
      const daysAgo = (Date.now() - new Date(r.updated_at).getTime()) / (1000 * 60 * 60 * 24)
      return daysAgo < 30 // Active if updated in last 30 days
    }).length

    const totalConversations = sessions.length
    const totalTokens = sessions.reduce((sum, s) => sum + (s.totalTokens || 0), 0)

    // Activity this week
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000)
    const thisWeekSessions = sessions.filter(s => s.updatedAt > oneWeekAgo).length
    const thisWeekRepos = repos.filter(r => new Date(r.updated_at).getTime() > oneWeekAgo).length

    const stats = {
      projects: {
        total: totalProjects,
        active: activeRepos,
        updated_this_week: thisWeekRepos
      },
      conversations: {
        total: totalConversations,
        this_week: thisWeekSessions,
        total_tokens: totalTokens
      },
      activity: {
        sessions_per_day: (thisWeekSessions / 7).toFixed(1),
        commits_this_week: thisWeekRepos, // Approximation
      }
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
