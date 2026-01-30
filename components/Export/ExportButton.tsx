'use client'

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { generateWeeklyReport, type WeeklyReport } from "@/lib/export/pdf"
import { useState } from "react"

interface ExportButtonProps {
  projects: any[]
}

export function ExportButton({ projects }: ExportButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleExport = async () => {
    setLoading(true)
    
    try {
      // Get all tasks
      const tasksResponse = await fetch('/api/tasks')
      const tasksData = await tasksResponse.json()
      const allTasks = tasksData.tasks || []
      
      // Calculate stats
      const activeProjects = projects.filter(p => p.status === 'active').length
      const completedTasks = allTasks.filter((t: any) => t.status === 'done').length
      
      // Get date range (last 7 days)
      const now = new Date()
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      const dateRange = `${weekAgo.toLocaleDateString()} - ${now.toLocaleDateString()}`
      
      const reportData: WeeklyReport = {
        projects: projects.map(p => ({
          name: p.name,
          status: p.status,
          progress: p.progress,
          tasksCompleted: p.tasksCompleted,
          tasksTotal: p.tasksTotal,
          lastActivity: p.lastActivity,
        })),
        totalProjects: projects.length,
        activeProjects,
        completedTasks,
        totalTasks: allTasks.length,
        dateRange,
      }
      
      generateWeeklyReport(reportData)
    } catch (error) {
      console.error('Failed to generate report:', error)
      alert('Failed to generate report. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleExport}
      disabled={loading}
    >
      <Download className="w-4 h-4 mr-2" />
      {loading ? 'Generating...' : 'Export Report'}
    </Button>
  )
}
