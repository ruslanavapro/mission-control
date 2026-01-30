'use client'

import { ProjectCard, Project } from "@/components/ProjectCard/ProjectCard"
import { ConversationFeed } from "@/components/ConversationFeed/ConversationFeed"
import { GoalsTracker } from "@/components/GoalsTracker/GoalsTracker"
import { Card } from "@/components/ui/card"
import { useEffect, useState } from "react"

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        setProjects(data.projects || [])
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load projects:', err)
        setLoading(false)
      })
  }, [])

  const activeProjects = projects.filter(p => p.status === 'active')
  const otherProjects = projects.filter(p => p.status !== 'active')

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Mission Control</h1>
              <p className="text-muted-foreground mt-1">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="flex gap-6 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {loading ? '...' : activeProjects.length}
                </div>
                <div className="text-muted-foreground">Active</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {loading ? '...' : projects.filter(p => p.status === 'pending').length}
                </div>
                <div className="text-muted-foreground">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {loading ? '...' : projects.filter(p => p.status === 'done').length}
                </div>
                <div className="text-muted-foreground">Done</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <div className="container mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading projects...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {activeProjects.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">Active Projects</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeProjects.map(project => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                  </div>
                </div>
              )}

              {otherProjects.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">Other Projects</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {otherProjects.map(project => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                  </div>
                </div>
              )}

              {projects.length === 0 && (
                <div className="text-center py-12 border rounded-lg">
                  <p className="text-muted-foreground">No projects found</p>
                </div>
              )}
            </div>

            {/* Right sidebar */}
            <div className="space-y-6">
              <GoalsTracker />
              <ConversationFeed />
              
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Upcoming Deadlines</h3>
                <p className="text-sm text-muted-foreground">
                  Google Calendar integration coming soon...
                </p>
              </Card>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
