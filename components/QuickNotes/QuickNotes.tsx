'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StickyNote, Plus, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"

interface Note {
  id: string
  text: string
  createdAt: string
  color: string
}

const COLORS = ['bg-yellow-500/10', 'bg-blue-500/10', 'bg-green-500/10', 'bg-pink-500/10', 'bg-purple-500/10']

export function QuickNotes() {
  const [notes, setNotes] = useState<Note[]>([])
  const [newNote, setNewNote] = useState('')
  const [showInput, setShowInput] = useState(false)

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('mission-control-notes')
    if (saved) {
      setNotes(JSON.parse(saved))
    }
  }, [])

  // Save to localStorage
  const saveNotes = (newNotes: Note[]) => {
    setNotes(newNotes)
    localStorage.setItem('mission-control-notes', JSON.stringify(newNotes))
  }

  const addNote = () => {
    if (!newNote.trim()) return

    const note: Note = {
      id: Date.now().toString(),
      text: newNote.trim(),
      createdAt: new Date().toISOString(),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }

    saveNotes([note, ...notes])
    setNewNote('')
    setShowInput(false)
  }

  const deleteNote = (id: string) => {
    saveNotes(notes.filter(n => n.id !== id))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      addNote()
    }
    if (e.key === 'Escape') {
      setShowInput(false)
      setNewNote('')
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <StickyNote className="w-4 h-4" />
            Quick Notes
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowInput(!showInput)}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {showInput && (
          <div className="space-y-2">
            <textarea
              value={newNote}
              onChange={e => setNewNote(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Write a note... (Enter to save, Esc to cancel)"
              className="w-full p-2 text-sm bg-muted rounded-md border-0 resize-none outline-none focus:ring-2 focus:ring-primary/50"
              rows={2}
              autoFocus
            />
            <div className="flex gap-1">
              <Button size="sm" className="h-6 text-xs" onClick={addNote}>Save</Button>
              <Button size="sm" variant="ghost" className="h-6 text-xs" onClick={() => { setShowInput(false); setNewNote('') }}>Cancel</Button>
            </div>
          </div>
        )}

        {notes.length === 0 && !showInput && (
          <p className="text-sm text-muted-foreground text-center py-2">
            No notes yet. Click + to add one.
          </p>
        )}

        {notes.slice(0, 5).map(note => (
          <div 
            key={note.id} 
            className={`group p-2 rounded-md ${note.color} relative`}
          >
            <p className="text-sm pr-6">{note.text}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {new Date(note.createdAt).toLocaleDateString()}
            </p>
            <Button
              size="sm"
              variant="ghost"
              className="absolute top-1 right-1 h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => deleteNote(note.id)}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        ))}

        {notes.length > 5 && (
          <p className="text-xs text-muted-foreground text-center">
            +{notes.length - 5} more notes
          </p>
        )}
      </CardContent>
    </Card>
  )
}
