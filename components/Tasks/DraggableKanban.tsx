'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Circle, Clock, Trash2 } from "lucide-react"
import { DndContext, closestCenter, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { toast } from 'sonner'

interface Task {
  id: string
  projectId: string
  title: string
  description?: string
  status: 'todo' | 'inprogress' | 'done'
  priority?: 'low' | 'medium' | 'high'
  dueDate?: string
}

interface Props {
  tasks: Task[]
  onTaskStatusChange: (taskId: string, newStatus: string) => Promise<void>
  onTaskDelete: (taskId: string) => Promise<void>
}

function SortableTask({ task, onDelete }: { task: Task; onDelete: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const priorityColors = {
    low: 'text-gray-500',
    medium: 'text-yellow-500',
    high: 'text-red-500',
  }

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      className="group p-3 rounded-lg border bg-card hover:bg-accent cursor-grab active:cursor-grabbing relative"
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
      <Button
        size="sm"
        variant="ghost"
        className="absolute top-1 right-1 h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => {
          e.stopPropagation()
          onDelete()
        }}
      >
        <Trash2 className="w-3 h-3" />
      </Button>
    </div>
  )
}

export function DraggableKanban({ tasks, onTaskStatusChange, onTaskDelete }: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const todoTasks = tasks.filter(t => t.status === 'todo')
  const inprogressTasks = tasks.filter(t => t.status === 'inprogress')
  const doneTasks = tasks.filter(t => t.status === 'done')

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) return

    const taskId = active.id as string
    const newStatus = over.id as string

    if (['todo', 'inprogress', 'done'].includes(newStatus)) {
      try {
        await onTaskStatusChange(taskId, newStatus)
        toast.success('Task moved!')
      } catch (error) {
        toast.error('Failed to move task')
      }
    }
  }

  const handleDelete = async (taskId: string) => {
    if (!confirm('Delete this task?')) return
    try {
      await onTaskDelete(taskId)
      toast.success('Task deleted')
    } catch (error) {
      toast.error('Failed to delete task')
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
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
            <SortableContext id="todo" items={todoTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
              {todoTasks.map(task => (
                <SortableTask key={task.id} task={task} onDelete={() => handleDelete(task.id)} />
              ))}
            </SortableContext>
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
            <SortableContext id="inprogress" items={inprogressTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
              {inprogressTasks.map(task => (
                <SortableTask key={task.id} task={task} onDelete={() => handleDelete(task.id)} />
              ))}
            </SortableContext>
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
            <SortableContext id="done" items={doneTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
              {doneTasks.map(task => (
                <SortableTask key={task.id} task={task} onDelete={() => handleDelete(task.id)} />
              ))}
            </SortableContext>
            {doneTasks.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No tasks</p>
            )}
          </CardContent>
        </Card>
      </div>
    </DndContext>
  )
}
