'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Folder, MessageSquare, Activity, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"

interface Stats {
  projects: {
    total: number
    active: number
    updated_this_week: number
  }
  conversations: {
    total: number
    this_week: number
    total_tokens: number
  }
  activity: {
    sessions_per_day: string
    commits_this_week: number
  }
}

export function StatsOverview() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
        setStats(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load stats:', err)
        setLoading(false)
      })
  }, [])

  if (loading || !stats) {
    return null
  }

  const statCards = [
    {
      icon: Folder,
      label: "Active Projects",
      value: stats.projects.active,
      subtitle: `${stats.projects.total} total`,
      color: "text-green-500"
    },
    {
      icon: MessageSquare,
      label: "Conversations",
      value: stats.conversations.this_week,
      subtitle: "this week",
      color: "text-blue-500"
    },
    {
      icon: Activity,
      label: "Sessions/Day",
      value: stats.activity.sessions_per_day,
      subtitle: "average",
      color: "text-purple-500"
    },
    {
      icon: TrendingUp,
      label: "Commits",
      value: stats.activity.commits_this_week,
      subtitle: "this week",
      color: "text-orange-500"
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statCards.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-2">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            <div className="text-xs text-muted-foreground">{stat.subtitle}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
