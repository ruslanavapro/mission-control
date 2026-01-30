'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  Home,
  BarChart3,
  Settings,
  Search,
  FolderKanban,
  Plus,
  Download,
  Keyboard,
  Moon,
  Sun,
} from 'lucide-react'

interface Command {
  id: string
  label: string
  description?: string
  icon: React.ReactNode
  action: () => void
  keywords?: string[]
}

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const commands: Command[] = [
    {
      id: 'home',
      label: 'Go to Dashboard',
      description: 'Main dashboard with all projects',
      icon: <Home className="w-4 h-4" />,
      action: () => router.push('/'),
      keywords: ['home', 'dashboard', 'main'],
    },
    {
      id: 'analytics',
      label: 'Go to Analytics',
      description: 'View analytics and insights',
      icon: <BarChart3 className="w-4 h-4" />,
      action: () => router.push('/analytics'),
      keywords: ['analytics', 'stats', 'metrics', 'insights'],
    },
    {
      id: 'settings',
      label: 'Go to Settings',
      description: 'Configure your dashboard',
      icon: <Settings className="w-4 h-4" />,
      action: () => router.push('/settings'),
      keywords: ['settings', 'config', 'preferences'],
    },
    {
      id: 'new-task',
      label: 'Create New Task',
      description: 'Add a task to a project',
      icon: <Plus className="w-4 h-4" />,
      action: () => {
        const btn = document.querySelector('[data-shortcut="new-task"]') as HTMLButtonElement
        if (btn) btn.click()
        else alert('Navigate to a project first to create tasks')
      },
      keywords: ['new', 'task', 'create', 'add', 'todo'],
    },
    {
      id: 'export',
      label: 'Export Weekly Report',
      description: 'Download PDF report of all projects',
      icon: <Download className="w-4 h-4" />,
      action: () => {
        const btn = document.querySelector('[data-export="weekly"]') as HTMLButtonElement
        if (btn) btn.click()
        else alert('Go to dashboard first to export reports')
      },
      keywords: ['export', 'pdf', 'report', 'download'],
    },
    {
      id: 'shortcuts',
      label: 'Keyboard Shortcuts',
      description: 'View all keyboard shortcuts',
      icon: <Keyboard className="w-4 h-4" />,
      action: () => {
        alert(`
⌨️ Keyboard Shortcuts

⌘/Ctrl + K    Command Palette
⌘/Ctrl + H    Go to Home
⌘/Ctrl + A    Go to Analytics  
⌘/Ctrl + N    New task (on project page)
ESC           Close / Clear search

↑/↓           Navigate commands
Enter         Execute command
        `)
      },
      keywords: ['shortcuts', 'keyboard', 'keys', 'hotkeys'],
    },
  ]

  const filteredCommands = query === ''
    ? commands
    : commands.filter(cmd => {
        const searchStr = `${cmd.label} ${cmd.description || ''} ${(cmd.keywords || []).join(' ')}`.toLowerCase()
        return searchStr.includes(query.toLowerCase())
      })

  const executeCommand = useCallback((cmd: Command) => {
    setOpen(false)
    setQuery('')
    setSelectedIndex(0)
    cmd.action()
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ⌘K to open
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(prev => !prev)
        setQuery('')
        setSelectedIndex(0)
      }

      // ESC to close
      if (e.key === 'Escape' && open) {
        e.preventDefault()
        setOpen(false)
        setQuery('')
        setSelectedIndex(0)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open])

  // Focus input when opened
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
    }
  }, [open])

  // Arrow key navigation
  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filteredCommands[selectedIndex]) {
        executeCommand(filteredCommands[selectedIndex])
      }
    }
  }

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => {
          setOpen(false)
          setQuery('')
        }}
      />

      {/* Palette */}
      <div className="relative w-full max-w-lg bg-background border rounded-xl shadow-2xl overflow-hidden">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b">
          <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Type a command..."
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
          />
          <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            ESC
          </kbd>
        </div>

        {/* Commands list */}
        <div className="max-h-64 overflow-y-auto py-2">
          {filteredCommands.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No commands found
            </p>
          ) : (
            filteredCommands.map((cmd, index) => (
              <button
                key={cmd.id}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-accent transition-colors ${
                  index === selectedIndex ? 'bg-accent' : ''
                }`}
                onClick={() => executeCommand(cmd)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="flex-shrink-0 text-muted-foreground">{cmd.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{cmd.label}</p>
                  {cmd.description && (
                    <p className="text-xs text-muted-foreground truncate">{cmd.description}</p>
                  )}
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t px-4 py-2 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <kbd className="inline-flex h-4 items-center rounded border bg-muted px-1 font-mono text-[10px]">↑↓</kbd>
            Navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="inline-flex h-4 items-center rounded border bg-muted px-1 font-mono text-[10px]">↵</kbd>
            Execute
          </span>
          <span className="flex items-center gap-1">
            <kbd className="inline-flex h-4 items-center rounded border bg-muted px-1 font-mono text-[10px]">ESC</kbd>
            Close
          </span>
        </div>
      </div>
    </div>
  )
}
