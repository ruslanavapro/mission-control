// AvaBase API client
const AVABASE_API_BASE = process.env.AVABASE_API_URL || 'https://ava-2-brain-production.up.railway.app'

export interface AvabaseDocument {
  id: string
  title: string
  content: string
  url?: string
  type: string
  createdAt: string
}

export interface AvabaseSearchResult {
  id: string
  title: string
  content: string
  similarity: number
  metadata?: any
}

export async function searchAvabase(query: string, limit: number = 10): Promise<AvabaseSearchResult[]> {
  try {
    const response = await fetch(`${AVABASE_API_BASE}/api/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, limit }),
      cache: 'no-store',
      signal: AbortSignal.timeout(10000) // 10 second timeout for external API
    })
    
    if (!response.ok) {
      console.warn(`AvaBase API returned ${response.status}: ${response.statusText}`)
      return []
    }
    
    const data = await response.json()
    return data.results || []
  } catch (error) {
    if (error instanceof Error) {
      console.warn('AvaBase API unavailable:', error.message)
    }
    return []
  }
}

export async function getDocumentsByProject(projectName: string): Promise<AvabaseDocument[]> {
  try {
    const results = await searchAvabase(projectName, 20)
    return results.map(r => ({
      id: r.id,
      title: r.title,
      content: r.content,
      type: 'document',
      createdAt: new Date().toISOString()
    }))
  } catch (error) {
    console.warn('Error fetching project documents:', error)
    return []
  }
}
