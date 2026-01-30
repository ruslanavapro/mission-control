'use client'

import { Button } from "@/components/ui/button"
import { CheckCircle2, Trash2, X } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface Props {
  tasks: any[]
  onBulkDelete: (taskIds: string[]) => Promise<void>
  onBulkComplete: (taskIds: string[]) => Promise<void>
  onRefresh: () => void
}

export function BulkActions({ tasks, onBulkDelete, onBulkComplete, onRefresh }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [mode, setMode] = useState(false)

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selected)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelected(newSelected)
  }

  const selectAll = () => {
    setSelected(new Set(tasks.filter(t => t.status !== 'done').map(t => t.id)))
  }

  const clearSelection = () => {
    setSelected(new Set())
    setMode(false)
  }

  const handleBulkComplete = async () => {
    if (selected.size === 0) return
    try {
      await onBulkComplete(Array.from(selected))
      toast.success(`Completed ${selected.size} tasks`)
      clearSelection()
      onRefresh()
    } catch {
      toast.error('Failed to complete tasks')
    }
  }

  const handleBulkDelete = async () => {
    if (selected.size === 0) return
    if (!confirm(`Delete ${selected.size} tasks?`)) return
    try {
      await onBulkDelete(Array.from(selected))
      toast.success(`Deleted ${selected.size} tasks`)
      clearSelection()
      onRefresh()
    } catch {
      toast.error('Failed to delete tasks')
    }
  }

  if (!mode) {
    return (
      <Button variant="outline" size="sm" onClick={() => setMode(true)}>
        Select Multiple
      </Button>
    )
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Button variant="outline" size="sm" onClick={selectAll}>
        Select All
      </Button>
      <Button variant="outline" size="sm" onClick={clearSelection}>
        <X className="w-4 h-4 mr-1" />
        Cancel
      </Button>
      <span className="text-sm text-muted-foreground">
        {selected.size} selected
      </span>
      {selected.size > 0 && (
        <>
          <Button variant="outline" size="sm" onClick={handleBulkComplete}>
            <CheckCircle2 className="w-4 h-4 mr-1" />
            Complete
          </Button>
          <Button variant="outline" size="sm" onClick={handleBulkDelete}>
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </Button>
        </>
      )}
    </div>
  )
}
