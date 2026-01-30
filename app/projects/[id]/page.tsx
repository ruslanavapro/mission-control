'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Github, FileText, CheckCircle2, Circle, Clock } from "lucide-react"
import Link from "next/link"
import { Project } from "@/components/ProjectCard/ProjectCard"

const statusConfig = {
  active: { label: "Active", color: "bg-green-500" },
  pending: { label: "Pending", color: "bg-yellow-500" },
  blocked: { label: "Blocked", color: "bg-red-500" },
  done: { label: "Done", color: "bg-blue-500" },
}

interface Task {
  id: string
  title: string
  status: 'todo' | 'inprogress' | 'done'
  createdAt: string
}

export default function ProjectPage() {
  const params = useParams()
  const [project, setProject] = useState<Project | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch project data
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        const found = data.projects?.find((p: Project) => p.id === params.id)
        setProject(found || null)
        
        // Mock tasks for now
        if (found) {
          const mockTasks: Task[] = [
            { id: '1', title: 'Set up project structure', status: 'done', createdAt: '2026-01-28' },
            { id: '2', title: 'Implement core features', status: 'inprogress', createdAt: '2026-01-29' },
            { id: '3', title: 'Add tests', status: 'todo', createdAt: '2026-01-30' },
            { id: '4', title: 'Deploy to production', status: 'todo', createdAt: '2026-01-30' },
          ]
          setTasks(mockTasks)
        }
        
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load project:', err)
        setLoading(false)
      })
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-8">
          <p className="text-muted-foreground">Loading project...</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-8">
          <p className="text-muted-foreground">Project not found</p>
          <Link href="/">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const status = statusConfig[project.status]
  const todoTasks = tasks.filter(t => t.status === 'todo')
  const inprogressTasks = tasks.filter(t => t.status === 'inprogress')
  const doneTasks = tasks.filter(t => t.status === 'done')

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-6 py-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      {/* Project Details */}
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">{project.name}</h1>
              <p className="text-lg text-muted-foreground">{project.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${status.color}`} />
              <Badge variant="outline" className="text-base">{status.label}</Badge>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold">{project.progress}%</div>
                <p className="text-sm text-muted-foreground">Progress</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold">{project.tasksCompleted}/{project.tasksTotal}</div>
                <p className="text-sm text-muted-foreground">Tasks</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold">{project.documentsCount}</div>
                <p className="text-sm text-muted-foreground">Documents</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm font-medium">{project.lastActivity}</div>
                <p className="text-sm text-muted-foreground">Last Activity</p>
              </CardContent>
            </Card>
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-medium mb-2">Overall Progress</h3>
            <Progress value={project.progress} className="h-3" />
          </div>

          {project.githubUrl && (
            <div className="mb-8">
              <Button asChild>
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4 mr-2" />
                  View on GitHub
                </a>
              </Button>
            </div>
          )}
        </div>

        {/* Tasks Kanban */}
        <div className="grid grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Circle className="w-4 h-4 text-gray-500" />
                To Do ({todoTasks.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {todoTasks.map(task => (
                <div key={task.id} className="p-3 rounded-lg border bg-card hover:bg-accent cursor-pointer">
                  <p className="text-sm font-medium">{task.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{task.createdAt}</p>
                </div>
              ))}
              {todoTasks.length === 0 && (
                <p className="text-sm text-muted-foreground">No tasks</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-yellow-500" />
                In Progress ({inprogressTasks.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {inprogressTasks.map(task => (
                <div key={task.id} className="p-3 rounded-lg border bg-card hover:bg-accent cursor-pointer border-yellow-500/50">
                  <p className="text-sm font-medium">{task.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{task.createdAt}</p>
                </div>
              ))}
              {inprogressTasks.length === 0 && (
                <p className="text-sm text-muted-foreground">No tasks</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                Done ({doneTasks.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {doneTasks.map(task => (
                <div key={task.id} className="p-3 rounded-lg border bg-card hover:bg-accent cursor-pointer border-green-500/50 opacity-75">
                  <p className="text-sm font-medium line-through">{task.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{task.createdAt}</p>
                </div>
              ))}
              {doneTasks.length === 0 && (
                <p className="text-sm text-muted-foreground">No tasks</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Documents Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Documents & Research</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-muted-foreground">
                <FileText className="w-5 h-5" />
                <p>AvaBase integration coming soon - will show {project.documentsCount} related documents</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
