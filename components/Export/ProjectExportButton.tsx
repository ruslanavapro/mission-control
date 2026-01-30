'use client'

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { generateProjectReport } from "@/lib/export/pdf"
import { useState } from "react"

interface ProjectExportButtonProps {
  project: any
  tasks: any[]
}

export function ProjectExportButton({ project, tasks }: ProjectExportButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleExport = () => {
    setLoading(true)
    
    try {
      generateProjectReport(project, tasks)
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
      {loading ? 'Generating...' : 'Export PDF'}
    </Button>
  )
}
