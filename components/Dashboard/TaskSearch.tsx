'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, ExternalLink } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"

interface Task {
  id: string
  projectId: string
  title: string
  description?: string
  status: 'todo' | 'inprogress' | 'done'
  priority?: 'low' | 'medium' | 'high'
}

export function TaskSearch() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [query, setQuery] = useState('')
  const [projects, setProjects] = useState<any[]>([])

  useEffect(() => {
    Promise.all([
      fetch('/api/tasks').then(r => r.json()),
      fetch('/api/projects').then(r => r.json()),
    ]).then(([tasksRes, projectsRes]) => {
      setTasks(tasksRes.tasks || [])
      setProjects(projectsRes.projects || [])
    }).catch(() => {})
  }, [])

  const filtered = query === '' 
    ? [] 
    : tasks.filter(t => 
        t.title.toLowerCase().includes(query.toLowerCase()) ||
        (t.description || '').toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)

  const getProjectName = (projectId: string) => {
    return projects.find(p => p.id === projectId)?.name || 'Unknown'
  }

  const statusColors = {
    todo: 'bg-gray-500',
    inprogress: 'bg-yellow-500',
    done: 'bg-green-500',
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Search className="w-4 h-4" />
          Search Tasks
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Input
          placeholder="Search tasks..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="h-9"
        />
        {query && filtered.length > 0 && (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {filtered.map(task => (
              <Link key={task.id} href={`/projects/${task.projectId}`}>
                <div className="p-2 rounded-lg border hover:bg-accent cursor-pointer">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium flex-1">{task.title}</p>
                    <ExternalLink className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`w-2 h-2 rounded-full ${statusColors[task.status]}`} />
                    <span className="text-xs text-muted-foreground">{getProjectName(task.projectId)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        {query && filtered.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-2">No tasks found</p>
        )}
      </CardContent>
    </Card>
  )
}
