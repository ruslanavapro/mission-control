'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { ArrowLeft, RefreshCw, Save } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'

type AiEmployeesApiResponse = {
  data: unknown
  dataFile: string
  usedFallback?: boolean
  readOnly?: boolean
  warning?: string
}

export default function AiEmployeesPage() {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const [dataFile, setDataFile] = useState<string>('')
  const [warning, setWarning] = useState<string>('')
  const [readOnly, setReadOnly] = useState(false)
  const [lastLoadedAt, setLastLoadedAt] = useState<string>('')

  const [jsonText, setJsonText] = useState('')
  const [baselineJsonText, setBaselineJsonText] = useState('')

  const dirty = useMemo(() => jsonText !== baselineJsonText, [jsonText, baselineJsonText])

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/ai-employees', {
        method: 'GET',
        cache: 'no-store',
      })

      const payload = (await res.json()) as AiEmployeesApiResponse

      setDataFile(payload.dataFile || '')
      setWarning(payload.warning || '')
      setReadOnly(Boolean(payload.readOnly))

      const pretty = JSON.stringify(payload.data ?? {}, null, 2)
      setJsonText(pretty)
      setBaselineJsonText(pretty)
      setLastLoadedAt(new Date().toISOString())

      if (!res.ok) {
        toast.error('Failed to load AI Employees data')
      }
    } catch (e) {
      console.error(e)
      toast.error('Failed to load AI Employees data')
      setWarning(String(e))
    } finally {
      setLoading(false)
    }
  }

  const save = async () => {
    let parsed: unknown
    try {
      parsed = JSON.parse(jsonText)
    } catch (e) {
      toast.error('JSON is invalid — fix it before saving')
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/ai-employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: parsed }),
      })

      const payload = (await res.json()) as AiEmployeesApiResponse

      setDataFile(payload.dataFile || '')
      setWarning(payload.warning || '')
      setReadOnly(Boolean(payload.readOnly))

      if (!res.ok) {
        toast.error('Save failed')
        return
      }

      const pretty = JSON.stringify(payload.data ?? parsed ?? {}, null, 2)
      setJsonText(pretty)
      setBaselineJsonText(pretty)
      toast.success('Saved')
    } catch (e) {
      console.error(e)
      toast.error('Save failed')
      setWarning(String(e))
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">AI Employees (SSOT Editor)</h1>
            <div className="w-32" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-4xl space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle>Data Source</CardTitle>
                <CardDescription>
                  Edits are saved to the shared SSOT JSON file via <code>/api/ai-employees</code>.
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={load} disabled={loading || saving}>
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button onClick={save} disabled={readOnly || saving || loading || !dirty}>
                  <Save className={`w-4 h-4 mr-2 ${saving ? 'animate-pulse' : ''}`} />
                  {readOnly ? 'Read-only' : saving ? 'Saving…' : dirty ? 'Save' : 'Saved'}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm">
              <span className="text-muted-foreground">File:</span>{' '}
              <code className="text-xs break-all">{dataFile || '—'}</code>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Last loaded:</span>{' '}
              <code className="text-xs">{lastLoadedAt ? new Date(lastLoadedAt).toLocaleString() : '—'}</code>
            </div>
            {readOnly ? (
              <div className="rounded-md border border-blue-500/30 bg-blue-500/10 p-3 text-sm">
                <div className="font-medium mb-1">Read-only mode</div>
                <div className="text-xs text-muted-foreground">
                  Saving is disabled in this environment. To enable edits on Vercel, back this endpoint with a KV/DB.
                </div>
              </div>
            ) : null}
            {warning ? (
              <div className="rounded-md border border-yellow-500/30 bg-yellow-500/10 p-3 text-sm">
                <div className="font-medium mb-1">Warning</div>
                <pre className="whitespace-pre-wrap text-xs">{warning}</pre>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>JSON</CardTitle>
            <CardDescription>
              Edit the JSON directly. Make sure it stays valid JSON before saving.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              className="font-mono text-xs min-h-[520px]"
              spellCheck={false}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
