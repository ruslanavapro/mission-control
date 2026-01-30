'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Github, FileText, CheckCircle2, Circle, Clock, Trash2 } from "lucide-react"
import Link from "next/link"
import { Project } from "@/components/ProjectCard/ProjectCard"
import { TaskDialog } from "@/components/Tasks/TaskDialog"

const statusConfig = {
  active: { label: "Active", color: "bg-green-500" },
  pending: { label: "Pending", color: "bg-yellow-500" },
  blocked: { label: "Blocked", color: "bg-red-500" },
  done: { label: "Done", color: "bg-blue-500" },
}

interface Task {
  id: string
  projectId: string
  title: string
  description?: string
  status: 'todo' | 'inprogress' | 'done'
  priority?: 'low' | 'medium' | 'high'
  dueDate?: string
  createdAt: string
  updatedAt: string
}

export default function ProjectPage() {
  const params = useParams()
  const [project, setProject] = useState<Project | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  const loadProject = () => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        const found = data.projects?.find((p: Project) => p.id === params.id)
        setProject(found || null)
      })
      .catch(err => console.error('Failed to load project:', err))
  }

  const loadTasks = () => {
    if (!params.id) return
    
    fetch(`/api/tasks?projectId=${params.id}`)
      .then(res => res.json())
      .then(data => {
        setTasks(data.tasks || [])
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load tasks:', err)
        setLoading(false)
      })
  }

  useEffect(() => {
    loadProject()
    loadTasks()
  }, [params.id])

  const handleTaskCreated = () => {
    loadTasks()
    loadProject()
  }

  const handleTaskStatusChange = async (taskId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        loadTasks()
        loadProject()
      }
    } catch (error) {
      console.error('Failed to update task:', error)
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        loadTasks()
        loadProject()
      }
    } catch (error) {
      console.error('Failed to delete task:', error)
    }
  }

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

  const priorityColors = {
    low: 'text-gray-500',
    medium: 'text-yellow-500',
    high: 'text-red-500',
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <TaskDialog projectId={project.id} onTaskCreated={handleTaskCreated} />
          </div>
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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold">{project.progress}%</div>
                <p className="text-sm text-muted-foreground">Progress</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold">{doneTasks.length}/{tasks.length}</div>
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
            <Progress value={(doneTasks.length / Math.max(tasks.length, 1)) * 100} className="h-3" />
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* TODO Column */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Circle className="w-4 h-4 text-gray-500" />
                To Do ({todoTasks.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {todoTasks.map(task => (
                <div 
                  key={task.id} 
                  className="group p-3 rounded-lg border bg-card hover:bg-accent cursor-pointer relative"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium flex-1">{task.title}</p>
                    {task.priority && (
                      <span className={`text-xs ${priorityColors[task.priority]}`}>
                        {task.priority}
                      </span>
                    )}
                  </div>
                  {task.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
                  )}
                  {task.dueDate && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  )}
                  <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="h-6 text-xs"
                      onClick={() => handleTaskStatusChange(task.id, 'inprogress')}
                    >
                      Start
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      className="h-6 text-xs"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
              {todoTasks.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No tasks</p>
              )}
            </CardContent>
          </Card>

          {/* IN PROGRESS Column */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-yellow-500" />
                In Progress ({inprogressTasks.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {inprogressTasks.map(task => (
                <div 
                  key={task.id} 
                  className="group p-3 rounded-lg border bg-card hover:bg-accent cursor-pointer border-yellow-500/50 relative"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium flex-1">{task.title}</p>
                    {task.priority && (
                      <span className={`text-xs ${priorityColors[task.priority]}`}>
                        {task.priority}
                      </span>
                    )}
                  </div>
                  {task.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
                  )}
                  {task.dueDate && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  )}
                  <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="h-6 text-xs"
                      onClick={() => handleTaskStatusChange(task.id, 'done')}
                    >
                      Complete
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      className="h-6 text-xs"
                      onClick={() => handleTaskStatusChange(task.id, 'todo')}
                    >
                      Back
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      className="h-6 text-xs"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
              {inprogressTasks.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No tasks</p>
              )}
            </CardContent>
          </Card>

          {/* DONE Column */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                Done ({doneTasks.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {doneTasks.map(task => (
                <div 
                  key={task.id} 
                  className="group p-3 rounded-lg border bg-card hover:bg-accent cursor-pointer border-green-500/50 opacity-75 relative"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium line-through flex-1">{task.title}</p>
                    {task.priority && (
                      <span className={`text-xs ${priorityColors[task.priority]}`}>
                        {task.priority}
                      </span>
                    )}
                  </div>
                  {task.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2 line-through">{task.description}</p>
                  )}
                  <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      size="sm" 
                      variant="ghost"
                      className="h-6 text-xs"
                      onClick={() => handleTaskStatusChange(task.id, 'todo')}
                    >
                      Reopen
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      className="h-6 text-xs"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
              {doneTasks.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No completed tasks</p>
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
