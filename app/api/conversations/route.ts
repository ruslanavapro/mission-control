import { NextResponse } from 'next/server'
import { getClawdbotSessions } from '@/lib/api/clawdbot'

export interface Conversation {
  id: string
  date: string
  topic: string
  summary: string
  decisions: string[]
  relatedProjects: string[]
  importance: 'high' | 'medium' | 'low'
}

function extractTopic(messages: any[]): string {
  // Simple heuristic: use first user message or first 50 chars
  const firstUserMsg = messages.find(m => m.role === 'user')
  if (firstUserMsg) {
    const content = typeof firstUserMsg.content === 'string' 
      ? firstUserMsg.content 
      : JSON.stringify(firstUserMsg.content)
    return content.slice(0, 50).trim() + '...'
  }
  return 'Conversation'
}

function summarizeMessages(messages: any[]): string {
  const count = messages.length
  const userMsgs = messages.filter(m => m.role === 'user').length
  const assistantMsgs = messages.filter(m => m.role === 'assistant').length
  return `${count} messages (${userMsgs} from user, ${assistantMsgs} from assistant)`
}

export async function GET() {
  try {
    const sessions = await getClawdbotSessions(10)
    
    const conversations: Conversation[] = sessions.map(session => {
      const messages = session.messages || []
      const date = new Date(session.updatedAt).toLocaleDateString()
      
      return {
        id: session.sessionId,
        date,
        topic: extractTopic(messages),
        summary: summarizeMessages(messages),
        decisions: [], // TODO: extract from messages
        relatedProjects: [], // TODO: extract from message content
        importance: 'medium' as const,
      }
    })
    
    return NextResponse.json({ conversations })
  } catch (error) {
    console.error('Error fetching conversations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    )
  }
}
