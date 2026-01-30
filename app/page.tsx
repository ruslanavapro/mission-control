'use client'

import { ProjectCard, Project } from "@/components/ProjectCard/ProjectCard"
import { ConversationFeed } from "@/components/ConversationFeed/ConversationFeed"
import { GoalsTracker } from "@/components/GoalsTracker/GoalsTracker"
import { SearchFilter } from "@/components/Dashboard/SearchFilter"
import { StatsOverview } from "@/components/Dashboard/StatsOverview"
import { TaskSearch } from "@/components/Dashboard/TaskSearch"
import { UpcomingDeadlines } from "@/components/Calendar/UpcomingDeadlines"
import { QuickNotes } from "@/components/QuickNotes/QuickNotes"
import { ExportButton } from "@/components/Export/ExportButton"
import { ThemeToggle } from "@/components/ThemeToggle/ThemeToggle"
import { Button } from "@/components/ui/button"
import { BarChart3, Settings } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useKeyboardShortcuts } from "@/components/KeyboardShortcuts/useKeyboardShortcuts"

export default function Home() {
  useKeyboardShortcuts()
  
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | null>(null)

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

  // Filter projects based on search and status
  const filteredProjects = projects.filter(project => {
    const matchesSearch = searchQuery === '' || 
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === null || project.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const activeProjects = filteredProjects.filter(p => p.status === 'active')
  const otherProjects = filteredProjects.filter(p => p.status !== 'active')

  return (
    <main className="min-h-screen bg-background">
      <AutoRefresh intervalMs={30000} />
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Mission Control</h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex gap-4 sm:gap-6 text-sm">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-green-600">
                    {loading ? '...' : projects.filter(p => p.status === 'active').length}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Active</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-yellow-600">
                    {loading ? '...' : projects.filter(p => p.status === 'pending').length}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Pending</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-blue-600">
                    {loading ? '...' : projects.filter(p => p.status === 'done').length}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Done</div>
                </div>
              </div>
              <div className="flex gap-2">
                <ThemeToggle />
                <ExportButton projects={projects} />
                <Link href="/analytics">
                  <Button variant="outline" size="sm">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Analytics
                  </Button>
                </Link>
                <Link href="/settings">
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading projects...</p>
          </div>
        ) : (
          <>
            {/* Stats Overview */}
            <div className="mb-8">
              <StatsOverview />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Search & Filter */}
                <SearchFilter
                  onSearchChange={setSearchQuery}
                  onFilterChange={setStatusFilter}
                  activeFilter={statusFilter}
                />

                {/* Active Projects */}
                {activeProjects.length > 0 && (
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold mb-4">Active Projects</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {activeProjects.map(project => (
                        <ProjectCard key={project.id} project={project} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Other Projects */}
                {otherProjects.length > 0 && (
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold mb-4">Other Projects</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {otherProjects.map(project => (
                        <ProjectCard key={project.id} project={project} />
                      ))}
                    </div>
                  </div>
                )}

                {/* No Results */}
                {filteredProjects.length === 0 && !loading && (
                  <div className="text-center py-12 border rounded-lg">
                    <p className="text-muted-foreground">
                      {searchQuery || statusFilter 
                        ? 'No projects match your filters'
                        : 'No projects found'}
                    </p>
                  </div>
                )}
              </div>

              {/* Right sidebar */}
              <div className="space-y-6">
                <TaskSearch />
                <GoalsTracker />
                <UpcomingDeadlines />
                <QuickNotes />
                <ConversationFeed />
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
