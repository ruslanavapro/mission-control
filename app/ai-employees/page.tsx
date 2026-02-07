"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Plus, RefreshCw, Trash2 } from "lucide-react"
import type {
  AiEmployeesData,
  AiEmployeesStatus,
  NextAction,
} from "@/lib/ai-employees/types"

const statusOptions: { value: AiEmployeesStatus; label: string }[] = [
  { value: "planned", label: "Planned" },
  { value: "building", label: "Building" },
  { value: "launched", label: "Launched" },
  { value: "measuring", label: "Measuring" },
]

type FormState = {
  status: AiEmployeesStatus
  createdAt: string
  updatedAt: string
  overviewSummary: string
  overviewProblem: string
  overviewValueProp: string
  overviewPrimaryAudience: string
  icpSegments: string
  languages: string
  domainShortlist: string
  siteIA: string
  packagesPricing: string
  trafficChannels: string
  kpisResults: string
  backlog: string
  nextActions: NextAction[]
}

const emptyForm: FormState = {
  status: "planned",
  createdAt: "",
  updatedAt: "",
  overviewSummary: "",
  overviewProblem: "",
  overviewValueProp: "",
  overviewPrimaryAudience: "",
  icpSegments: "",
  languages: "",
  domainShortlist: "",
  siteIA: "",
  packagesPricing: "",
  trafficChannels: "",
  kpisResults: "",
  backlog: "",
  nextActions: [],
}

const listToText = (list: string[] | undefined) =>
  list && list.length > 0 ? list.join("\n") : ""

const textToList = (value: string) =>
  value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean)

const formatTimestamp = (value: string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "—"
  return date.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  })
}

const dataToForm = (data: AiEmployeesData): FormState => ({
  status: data.status,
  createdAt: data.createdAt ?? "",
  updatedAt: data.updatedAt ?? "",
  overviewSummary: data.overview?.summary ?? "",
  overviewProblem: data.overview?.problem ?? "",
  overviewValueProp: data.overview?.valueProp ?? "",
  overviewPrimaryAudience: data.overview?.primaryAudience ?? "",
  icpSegments: listToText(data.icpSegments),
  languages: listToText(data.languages),
  domainShortlist: listToText(data.domainShortlist),
  siteIA: listToText(data.siteIA),
  packagesPricing: listToText(data.packagesPricing),
  trafficChannels: listToText(data.trafficChannels),
  kpisResults: listToText(data.kpisResults),
  backlog: listToText(data.backlog),
  nextActions: data.nextActions ?? [],
})

const formToPayload = (form: FormState): AiEmployeesData => {
  const now = new Date().toISOString()
  return {
    status: form.status,
    createdAt: form.createdAt || now,
    updatedAt: now,
    overview: {
      summary: form.overviewSummary.trim(),
      problem: form.overviewProblem.trim(),
      valueProp: form.overviewValueProp.trim(),
      primaryAudience: form.overviewPrimaryAudience.trim(),
    },
    icpSegments: textToList(form.icpSegments),
    languages: textToList(form.languages),
    domainShortlist: textToList(form.domainShortlist),
    siteIA: textToList(form.siteIA),
    packagesPricing: textToList(form.packagesPricing),
    trafficChannels: textToList(form.trafficChannels),
    kpisResults: textToList(form.kpisResults),
    backlog: textToList(form.backlog),
    nextActions: form.nextActions.filter((action) => action.text.trim().length > 0),
  }
}

export default function AiEmployeesPage() {
  const [form, setForm] = useState<FormState>(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dataFile, setDataFile] = useState<string | null>(null)
  const [usedFallback, setUsedFallback] = useState(false)
  const [warning, setWarning] = useState<string | null>(null)

  const completedActions = useMemo(
    () => form.nextActions.filter((action) => action.done).length,
    [form.nextActions]
  )

  const progressValue = useMemo(() => {
    if (form.nextActions.length === 0) return 0
    return Math.round((completedActions / form.nextActions.length) * 100)
  }, [completedActions, form.nextActions.length])

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/ai-employees", { cache: "no-store" })
      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload?.error || "Failed to load AI Employees data.")
      }

      setForm(dataToForm(payload.data))
      setDataFile(payload.dataFile ?? null)
      setUsedFallback(Boolean(payload.usedFallback))
      setWarning(payload.warning ?? null)
    } catch (err: any) {
      setError(err?.message ?? "Failed to load AI Employees data.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    try {
      const payload = formToPayload(form)
      const response = await fetch("/api/ai-employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: payload }),
      })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result?.error || "Failed to save AI Employees data.")
      }

      setForm(dataToForm(result.data))
      setDataFile(result.dataFile ?? null)
      setUsedFallback(Boolean(result.usedFallback))
      setWarning(result.warning ?? null)
    } catch (err: any) {
      setError(err?.message ?? "Failed to save AI Employees data.")
    } finally {
      setSaving(false)
    }
  }

  const handleActionUpdate = (id: string, updates: Partial<NextAction>) => {
    setForm((prev) => ({
      ...prev,
      nextActions: prev.nextActions.map((action) =>
        action.id === id ? { ...action, ...updates } : action
      ),
    }))
  }

  const handleActionRemove = (id: string) => {
    setForm((prev) => ({
      ...prev,
      nextActions: prev.nextActions.filter((action) => action.id !== id),
    }))
  }

  const handleActionAdd = () => {
    setForm((prev) => ({
      ...prev,
      nextActions: [
        ...prev.nextActions,
        {
          id: `action-${Date.now()}`,
          text: "",
          done: false,
        },
      ],
    }))
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              AI Employees Dashboard
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Control panel for landing validation and go-to-market planning.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadData}
              disabled={loading}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button size="sm" onClick={handleSave} disabled={saving || loading}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Status</span>
            <Select
              value={form.status}
              onValueChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  status: value as AiEmployeesStatus,
                }))
              }
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Badge variant="outline">
            Created: {formatTimestamp(form.createdAt)}
          </Badge>
          <Badge variant="outline">
            Updated: {formatTimestamp(form.updatedAt)}
          </Badge>
          {usedFallback && (
            <Badge variant="secondary">Using fallback data file</Badge>
          )}
        </div>

        {warning && (
          <div className="text-sm text-amber-600 border border-amber-200 rounded-lg px-3 py-2">
            {warning}
          </div>
        )}

        {error && (
          <div className="text-sm text-red-600 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        {dataFile && (
          <div className="text-xs text-muted-foreground">
            Data file: {dataFile}
          </div>
        )}

        {loading ? (
          <div className="text-sm text-muted-foreground">Loading data...</div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Summary</label>
                  <Textarea
                    value={form.overviewSummary}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        overviewSummary: event.target.value,
                      }))
                    }
                    placeholder="One-paragraph summary of the project"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Problem</label>
                  <Textarea
                    value={form.overviewProblem}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        overviewProblem: event.target.value,
                      }))
                    }
                    placeholder="What pain are we solving?"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Value Proposition</label>
                  <Textarea
                    value={form.overviewValueProp}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        overviewValueProp: event.target.value,
                      }))
                    }
                    placeholder="Why this wins"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Primary Audience</label>
                  <Input
                    value={form.overviewPrimaryAudience}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        overviewPrimaryAudience: event.target.value,
                      }))
                    }
                    placeholder="Who is this for?"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ICP Segments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Textarea
                  value={form.icpSegments}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      icpSegments: event.target.value,
                    }))
                  }
                  placeholder="One segment per line"
                  rows={6}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Languages</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Textarea
                  value={form.languages}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      languages: event.target.value,
                    }))
                  }
                  placeholder="One language per line"
                  rows={6}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Domain Shortlist</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Textarea
                  value={form.domainShortlist}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      domainShortlist: event.target.value,
                    }))
                  }
                  placeholder="One domain per line"
                  rows={6}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Site IA</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Textarea
                  value={form.siteIA}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      siteIA: event.target.value,
                    }))
                  }
                  placeholder="One section per line"
                  rows={6}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Packages / Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Textarea
                  value={form.packagesPricing}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      packagesPricing: event.target.value,
                    }))
                  }
                  placeholder="One package per line"
                  rows={6}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Traffic Channels</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Textarea
                  value={form.trafficChannels}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      trafficChannels: event.target.value,
                    }))
                  }
                  placeholder="One channel per line"
                  rows={6}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>KPIs / Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Textarea
                  value={form.kpisResults}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      kpisResults: event.target.value,
                    }))
                  }
                  placeholder="One KPI per line"
                  rows={6}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Backlog</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Textarea
                  value={form.backlog}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      backlog: event.target.value,
                    }))
                  }
                  placeholder="One item per line"
                  rows={6}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between">
                  <CardTitle>Next Actions</CardTitle>
                  <Button size="sm" variant="outline" onClick={handleActionAdd}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {completedActions}/{form.nextActions.length} complete
                  </span>
                  <span>{progressValue}%</span>
                </div>
                <Progress value={progressValue} className="h-1.5" />
              </CardHeader>
              <CardContent className="space-y-3">
                {form.nextActions.length === 0 ? (
                  <div className="text-sm text-muted-foreground">
                    No next actions yet.
                  </div>
                ) : (
                  form.nextActions.map((action) => (
                    <div key={action.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="h-4 w-4"
                        checked={action.done}
                        onChange={(event) =>
                          handleActionUpdate(action.id, {
                            done: event.target.checked,
                          })
                        }
                      />
                      <Input
                        value={action.text}
                        onChange={(event) =>
                          handleActionUpdate(action.id, {
                            text: event.target.value,
                          })
                        }
                        placeholder="Action detail"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleActionRemove(action.id)}
                        aria-label="Remove action"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  )
}
