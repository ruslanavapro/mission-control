// Clawdbot Sessions API client
const CLAWDBOT_API_BASE = process.env.CLAWDBOT_API_URL || 'http://localhost:18800'

export interface ClawdbotSession {
  key: string
  sessionId: string
  kind: string
  model: string
  totalTokens: number
  updatedAt: number
  messages?: Array<{
    role: string
    content: any
    timestamp: number
  }>
}

export async function getClawdbotSessions(limit: number = 20): Promise<ClawdbotSession[]> {
  try {
    // Try sessions list endpoint
    const response = await fetch(`${CLAWDBOT_API_BASE}/api/v1/sessions?limit=${limit}`, {
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store',
      signal: AbortSignal.timeout(5000) // 5 second timeout
    })
    
    if (!response.ok) {
      console.warn(`Clawdbot API returned ${response.status}: ${response.statusText}`)
      return []
    }
    
    const data = await response.json()
    return data.sessions || []
  } catch (error) {
    if (error instanceof Error) {
      console.warn('Clawdbot API unavailable:', error.message)
    }
    return []
  }
}

export async function getSessionHistory(sessionKey: string, limit: number = 10) {
  try {
    const response = await fetch(`${CLAWDBOT_API_BASE}/api/v1/sessions/${encodeURIComponent(sessionKey)}/history?limit=${limit}`, {
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store',
      signal: AbortSignal.timeout(5000)
    })
    
    if (!response.ok) {
      return { messages: [] }
    }
    
    return await response.json()
  } catch (error) {
    console.warn('Error fetching session history:', error)
    return { messages: [] }
  }
}
