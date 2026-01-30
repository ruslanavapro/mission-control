'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileCode, FileText, Search, Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface Template {
  id: string
  name: string
  description: string
  tasks: any[]
}

interface Props {
  projectId: string
  onTemplateApplied: () => void
}

export function TemplateSelector({ projectId, onTemplateApplied }: Props) {
  const [templates, setTemplates] = useState<Template[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    fetch('/api/templates')
      .then(r => r.json())
      .then(data => setTemplates(data.templates || []))
      .catch(() => {})
  }, [])

  const applyTemplate = async (template: Template) => {
    try {
      const promises = template.tasks.map(task =>
        fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...task, projectId }),
        })
      )

      await Promise.all(promises)
      toast.success(`Applied template: ${template.name}`)
      setOpen(false)
      onTemplateApplied()
    } catch {
      toast.error('Failed to apply template')
    }
  }

  const icons: Record<string, any> = {
    'web-app': FileCode,
    'content-creation': FileText,
    'research': Search,
  }

  if (!open) {
    return (
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Plus className="w-4 h-4 mr-2" />
        Use Template
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <Card className="relative w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Choose a Template</CardTitle>
          <CardDescription>Quick-start your project with predefined tasks</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map(template => {
            const Icon = icons[template.id] || FileCode
            return (
              <Card key={template.id} className="cursor-pointer hover:border-primary transition-colors" onClick={() => applyTemplate(template)}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-primary" />
                    <div>
                      <CardTitle className="text-base">{template.name}</CardTitle>
                      <CardDescription className="text-xs">{template.tasks.length} tasks</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
