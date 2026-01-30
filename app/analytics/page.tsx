'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, TrendingUp, Calendar, Clock, Target } from "lucide-react"
import Link from "next/link"
import { ActivityHeatmap } from "@/components/Analytics/ActivityHeatmap"
import { useEffect, useState } from "react"

export default function AnalyticsPage() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedTasks: 0,
    totalTasks: 0,
    avgTasksPerDay: 0,
    mostProductiveDay: 'Monday',
  })

  useEffect(() => {
    // Fetch stats
    Promise.all([
      fetch('/api/projects').then(r => r.json()),
      fetch('/api/tasks').then(r => r.json()),
    ]).then(([projects, tasks]) => {
      const totalProjects = projects.projects?.length || 0
      const activeProjects = projects.projects?.filter((p: any) => p.status === 'active').length || 0
      const allTasks = tasks.tasks || []
      const completedTasks = allTasks.filter((t: any) => t.status === 'done').length
      
      setStats({
        totalProjects,
        activeProjects,
        completedTasks,
        totalTasks: allTasks.length,
        avgTasksPerDay: (completedTasks / 7).toFixed(1) as any,
        mostProductiveDay: 'Monday', // TODO: Calculate from real data
      })
    })
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Analytics & Insights</h1>
            </div>
            <div className="w-32" /> {/* Spacer */}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Projects</CardTitle>
              <Target className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeProjects}/{stats.totalProjects}</div>
              <p className="text-xs text-muted-foreground">Active projects</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedTasks}/{stats.totalTasks}</div>
              <p className="text-xs text-muted-foreground">Total tasks</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avg Tasks/Day</CardTitle>
              <Clock className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgTasksPerDay}</div>
              <p className="text-xs text-muted-foreground">Last 7 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Best Day</CardTitle>
              <Calendar className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.mostProductiveDay}</div>
              <p className="text-xs text-muted-foreground">Most productive</p>
            </CardContent>
          </Card>
        </div>

        {/* Activity Heatmap */}
        <div className="mb-8">
          <ActivityHeatmap />
        </div>

        {/* Additional Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Progress Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Chart showing distribution of project progress percentages
              </p>
              <p className="text-xs text-muted-foreground mt-4">
                Coming soon: Bar chart with progress ranges (0-25%, 26-50%, 51-75%, 76-100%)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Task Completion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Weekly task completion trends
              </p>
              <p className="text-xs text-muted-foreground mt-4">
                Coming soon: Line chart showing tasks completed per week over the last 3 months
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
