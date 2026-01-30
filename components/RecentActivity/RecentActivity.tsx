'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle2, Plus, Edit, GitCommit } from "lucide-react"
import { useEffect, useState } from "react"

interface ActivityItem {
  id: string
  type: 'task_created' | 'task_completed' | 'task_updated' | 'project_update' | 'commit'
  title: string
  project?: string
  timestamp: string
}

const typeIcons = {
  task_created: <Plus className="w-3 h-3 text-blue-500" />,
  task_completed: <CheckCircle2 className="w-3 h-3 text-green-500" />,
  task_updated: <Edit className="w-3 h-3 text-yellow-500" />,
  project_update: <Clock className="w-3 h-3 text-purple-500" />,
  commit: <GitCommit className="w-3 h-3 text-orange-500" />,
}

const typeLabels = {
  task_created: 'Created',
  task_completed: 'Completed',
  task_updated: 'Updated',
  project_update: 'Updated',
  commit: 'Commit',
}

export function RecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([])

  useEffect(() => {
    // Fetch recent tasks and generate activity feed
    fetch('/api/tasks')
      .then(res => res.json())
      .then(data => {
        const tasks = data.tasks || []
        
        // Convert tasks to activities, sorted by most recent
        const taskActivities: ActivityItem[] = tasks
          .sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
          .slice(0, 8)
          .map((task: any) => ({
            id: task.id,
            type: task.status === 'done' ? 'task_completed' :
                  task.createdAt === task.updatedAt ? 'task_created' : 'task_updated',
            title: task.title,
            project: task.projectId,
            timestamp: task.updatedAt,
          }))

        setActivities(taskActivities)
      })
      .catch(() => {})
  }, [])

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Clock className="w-4 h-4" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {activities.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-2">
            No recent activity
          </p>
        ) : (
          activities.map(activity => (
            <div key={activity.id} className="flex items-start gap-3">
              <div className="mt-0.5">{typeIcons[activity.type]}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{activity.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <Badge variant="secondary" className="text-[10px] h-4">
                    {typeLabels[activity.type]}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground">
                    {formatTime(activity.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
