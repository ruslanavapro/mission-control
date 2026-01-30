'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function useKeyboardShortcuts() {
  const router = useRouter()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command/Ctrl + K: Search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        // Focus search input if exists
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement
        if (searchInput) {
          searchInput.focus()
        }
      }

      // Command/Ctrl + H: Home
      if ((e.metaKey || e.ctrlKey) && e.key === 'h') {
        e.preventDefault()
        router.push('/')
      }

      // Command/Ctrl + A: Analytics
      if ((e.metaKey || e.ctrlKey) && e.key === 'a') {
        e.preventDefault()
        router.push('/analytics')
      }

      // Command/Ctrl + N: New task (if on project page)
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault()
        const addTaskButton = document.querySelector('[data-shortcut="new-task"]') as HTMLButtonElement
        if (addTaskButton) {
          addTaskButton.click()
        }
      }

      // Escape: Clear search/close dialogs
      if (e.key === 'Escape') {
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement
        if (searchInput && document.activeElement === searchInput) {
          searchInput.blur()
          searchInput.value = ''
          // Trigger change event
          searchInput.dispatchEvent(new Event('input', { bubbles: true }))
        }
      }

      // ?: Show keyboard shortcuts help
      if (e.key === '?' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        alert(`
Keyboard Shortcuts:

⌘/Ctrl + K    Search projects
⌘/Ctrl + H    Go to Home
⌘/Ctrl + A    Go to Analytics
⌘/Ctrl + N    New task (on project page)
ESC           Clear search / Close

More shortcuts coming soon!
        `)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [router])
}
