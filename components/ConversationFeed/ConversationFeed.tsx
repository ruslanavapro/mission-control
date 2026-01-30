'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { MessageSquare, Calendar } from "lucide-react"
import { useEffect, useState } from "react"

interface Conversation {
  id: string
  date: string
  topic: string
  summary: string
  decisions: string[]
  relatedProjects: string[]
  importance: 'high' | 'medium' | 'low'
}

const importanceColors = {
  high: 'bg-red-500',
  medium: 'bg-yellow-500',
  low: 'bg-green-500',
}

export function ConversationFeed() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/conversations')
      .then(res => res.json())
      .then(data => {
        setConversations(data.conversations || [])
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load conversations:', err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Recent Conversations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-12" />
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Recent Conversations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {conversations.length === 0 ? (
          <p className="text-sm text-muted-foreground">No conversations yet</p>
        ) : (
          conversations.slice(0, 5).map(conv => (
            <div key={conv.id} className="border-b pb-3 last:border-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h4 className="text-sm font-medium line-clamp-1">{conv.topic}</h4>
                <div className={`w-2 h-2 rounded-full ${importanceColors[conv.importance]} flex-shrink-0 mt-1`} />
              </div>
              <p className="text-xs text-muted-foreground mb-2">{conv.summary}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                {conv.date}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
