'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Check, X, ExternalLink, RefreshCw } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

interface IntegrationStatus {
  name: string
  key: string
  status: 'connected' | 'disconnected' | 'checking'
  description: string
  url?: string
}

export default function SettingsPage() {
  const [integrations, setIntegrations] = useState<IntegrationStatus[]>([
    { name: 'Clawdbot', key: 'clawdbot', status: 'checking', description: 'AI assistant sessions & conversations' },
    { name: 'AvaBase', key: 'avabase', status: 'checking', description: 'Knowledge base & semantic search' },
    { name: 'GitHub', key: 'github', status: 'checking', description: 'Repositories, commits, and issues' },
    { name: 'Google Calendar', key: 'calendar', status: 'checking', description: 'Events and deadlines' },
  ])
  const [checking, setChecking] = useState(false)

  const checkIntegrations = async () => {
    setChecking(true)
    
    const checks = await Promise.allSettled([
      fetch('/api/conversations', { signal: AbortSignal.timeout(5000) }).then(r => r.ok),
      fetch('/api/projects', { signal: AbortSignal.timeout(5000) }).then(r => r.ok),
      fetch('/api/stats', { signal: AbortSignal.timeout(5000) }).then(r => r.ok),
      fetch('/api/calendar', { signal: AbortSignal.timeout(5000) }).then(r => r.ok),
    ])

    setIntegrations(prev => prev.map((integration, i) => ({
      ...integration,
      status: checks[i].status === 'fulfilled' && (checks[i] as PromiseFulfilledResult<boolean>).value
        ? 'connected'
        : 'disconnected',
    })))

    setChecking(false)
  }

  useEffect(() => {
    checkIntegrations()
  }, [])

  const connectedCount = integrations.filter(i => i.status === 'connected').length

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Settings</h1>
            <div className="w-32" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-3xl">
        {/* Integration Status */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Integrations</CardTitle>
                <CardDescription>
                  {connectedCount}/{integrations.length} connected
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={checkIntegrations}
                disabled={checking}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${checking ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {integrations.map(integration => (
              <div 
                key={integration.key}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${
                    integration.status === 'connected' ? 'bg-green-500' :
                    integration.status === 'checking' ? 'bg-yellow-500 animate-pulse' :
                    'bg-red-500'
                  }`} />
                  <div>
                    <p className="text-sm font-medium">{integration.name}</p>
                    <p className="text-xs text-muted-foreground">{integration.description}</p>
                  </div>
                </div>
                <Badge variant={integration.status === 'connected' ? 'default' : 'secondary'}>
                  {integration.status === 'connected' ? (
                    <><Check className="w-3 h-3 mr-1" /> Connected</>
                  ) : integration.status === 'checking' ? (
                    'Checking...'
                  ) : (
                    <><X className="w-3 h-3 mr-1" /> Not Connected</>
                  )}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* About */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>About Mission Control</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Version</span>
              <span className="text-sm font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Framework</span>
              <span className="text-sm font-medium">Next.js 16</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">UI Library</span>
              <span className="text-sm font-medium">shadcn/ui (Zinc)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Built by</span>
              <span className="text-sm font-medium">Ava 🗝️</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Build Date</span>
              <span className="text-sm font-medium">2026-01-30</span>
            </div>
          </CardContent>
        </Card>

        {/* Keyboard Shortcuts */}
        <Card>
          <CardHeader>
            <CardTitle>Keyboard Shortcuts</CardTitle>
            <CardDescription>Quick actions to navigate faster</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { keys: '⌘/Ctrl + K', desc: 'Command Palette' },
                { keys: '⌘/Ctrl + H', desc: 'Go to Home' },
                { keys: '⌘/Ctrl + A', desc: 'Go to Analytics' },
                { keys: '⌘/Ctrl + N', desc: 'New Task (on project page)' },
                { keys: 'ESC', desc: 'Close / Clear search' },
                { keys: '↑ / ↓', desc: 'Navigate commands' },
                { keys: 'Enter', desc: 'Execute command' },
              ].map(shortcut => (
                <div key={shortcut.keys} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{shortcut.desc}</span>
                  <kbd className="inline-flex h-6 items-center rounded border bg-muted px-2 font-mono text-xs">
                    {shortcut.keys}
                  </kbd>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
