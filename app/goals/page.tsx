"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Plus,
  Map as MapIcon,
  ListTree,
  Pencil,
  Trash2,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { GoalHorizon, GoalNode } from "@/lib/goals/types"

const categoryOptions = [
  { value: "personal", label: "Personal" },
  { value: "work", label: "Work" },
] as const

const horizonOptions: { value: GoalHorizon; label: string }[] = [
  { value: "now", label: "Now" },
  { value: "2w", label: "2 Weeks" },
  { value: "6m", label: "6 Months" },
  { value: "1y", label: "1 Year" },
  { value: "long", label: "Long Term" },
]

const horizonLabel = new Map(horizonOptions.map((option) => [option.value, option.label]))

const categoryLabel = new Map(
  categoryOptions.map((option) => [option.value, option.label])
)

const clampProgress = (value: number) =>
  Math.max(0, Math.min(100, Math.round(value)))

const generateId = () =>
  `goal-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`

function buildChildrenMap(goals: GoalNode[]) {
  const goalMap = new Map(goals.map((goal) => [goal.id, goal]))
  const childrenMap = new Map<string, GoalNode[]>()
  const orderIndex = new Map(goals.map((goal, index) => [goal.id, index]))

  goals.forEach((goal) => {
    if (goal.parentId && goalMap.has(goal.parentId)) {
      const bucket = childrenMap.get(goal.parentId) ?? []
      bucket.push(goal)
      childrenMap.set(goal.parentId, bucket)
    }
  })

  childrenMap.forEach((children) => {
    children.sort((a, b) => (orderIndex.get(a.id) ?? 0) - (orderIndex.get(b.id) ?? 0))
  })

  const roots = goals
    .filter((goal) => !goal.parentId || !goalMap.has(goal.parentId))
    .sort((a, b) => (orderIndex.get(a.id) ?? 0) - (orderIndex.get(b.id) ?? 0))

  return { goalMap, childrenMap, roots, orderIndex }
}

function computeProgressById(
  goals: GoalNode[],
  childrenMap: Map<string, GoalNode[]>
) {
  const goalMap = new Map(goals.map((goal) => [goal.id, goal]))
  const cache = new Map<string, number>()

  const compute = (goalId: string, stack: Set<string>): number => {
    if (cache.has(goalId)) {
      return cache.get(goalId) as number
    }

    const goal = goalMap.get(goalId)
    if (!goal) {
      return 0
    }

    if (stack.has(goalId)) {
      return clampProgress(goal.progress)
    }

    stack.add(goalId)
    const children = childrenMap.get(goalId) ?? []
    let value = 0

    if (children.length === 0) {
      value = clampProgress(goal.progress)
    } else if (goal.progressOverride !== null && goal.progressOverride !== undefined) {
      value = clampProgress(goal.progressOverride)
    } else {
      const childValues = children.map((child) => compute(child.id, stack))
      value =
        childValues.reduce((sum, childValue) => sum + childValue, 0) /
        childValues.length
    }

    cache.set(goalId, value)
    stack.delete(goalId)
    return value
  }

  goals.forEach((goal) => {
    compute(goal.id, new Set())
  })

  return cache
}

function collectDescendants(
  goalId: string,
  childrenMap: Map<string, GoalNode[]>,
  set = new Set<string>()
) {
  const children = childrenMap.get(goalId) ?? []
  children.forEach((child) => {
    if (!set.has(child.id)) {
      set.add(child.id)
      collectDescendants(child.id, childrenMap, set)
    }
  })
  return set
}

function GoalMapView({
  goals,
  roots,
  childrenMap,
  progressById,
  onEdit,
}: {
  goals: GoalNode[]
  roots: GoalNode[]
  childrenMap: Map<string, GoalNode[]>
  progressById: Map<string, number>
  onEdit: (goal: GoalNode) => void
}) {
  const rootIds = new Set(roots.map((root) => root.id))

  const levels = useMemo(() => {
    const result: GoalNode[][] = []
    const visit = (goal: GoalNode, depth: number) => {
      if (!result[depth]) {
        result[depth] = []
      }
      result[depth].push(goal)
      const children = childrenMap.get(goal.id) ?? []
      children.forEach((child) => visit(child, depth + 1))
    }
    roots.forEach((root) => visit(root, 0))
    return result
  }, [childrenMap, roots])

  const layout = useMemo(() => {
    const width = Math.max(
      900,
      levels.reduce((max, level) => Math.max(max, level.length * 220), 0) + 160
    )
    const height = Math.max(240, levels.length * 170 + 80)
    const positions = new Map<string, { x: number; y: number }>()

    levels.forEach((level, depth) => {
      const count = level.length
      const spacing = width / (count + 1)
      level.forEach((goal, index) => {
        const x = spacing * (index + 1)
        const y = 70 + depth * 160
        positions.set(goal.id, { x, y })
      })
    })

    return { width, height, positions }
  }, [levels])

  const nodeSize = (goalId: string) =>
    rootIds.has(goalId) ? { w: 220, h: 82 } : { w: 180, h: 70 }

  const truncate = (value: string, max = 20) =>
    value.length > max ? `${value.slice(0, max - 1)}…` : value

  return (
    <Card>
      <CardHeader>
        <CardTitle>Goal Map</CardTitle>
      </CardHeader>
      <CardContent>
        {goals.length === 0 ? (
          <div className="text-sm text-muted-foreground">No goals yet.</div>
        ) : (
          <div className="w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${layout.width} ${layout.height}`}
              className="h-auto w-full min-w-[720px]"
            >
              {goals.map((goal) => {
                if (!goal.parentId) return null
                const parentPosition = layout.positions.get(goal.parentId)
                const childPosition = layout.positions.get(goal.id)
                if (!parentPosition || !childPosition) return null

                const parentSize = nodeSize(goal.parentId)
                const childSize = nodeSize(goal.id)

                return (
                  <line
                    key={`${goal.parentId}-${goal.id}`}
                    x1={parentPosition.x}
                    y1={parentPosition.y + parentSize.h / 2}
                    x2={childPosition.x}
                    y2={childPosition.y - childSize.h / 2}
                    stroke="var(--border)"
                    strokeWidth={2}
                  />
                )
              })}

              {goals.map((goal) => {
                const position = layout.positions.get(goal.id)
                if (!position) return null

                const isRoot = rootIds.has(goal.id)
                const size = nodeSize(goal.id)
                const progress = progressById.get(goal.id) ?? 0
                const fill = isRoot ? "var(--primary)" : "var(--card)"
                const stroke = isRoot
                  ? "var(--primary)"
                  : goal.category === "work"
                    ? "var(--chart-3)"
                    : "var(--chart-4)"
                const textColor = isRoot
                  ? "var(--primary-foreground)"
                  : "var(--foreground)"

                return (
                  <g
                    key={goal.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => onEdit(goal)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        onEdit(goal)
                      }
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <rect
                      x={position.x - size.w / 2}
                      y={position.y - size.h / 2}
                      width={size.w}
                      height={size.h}
                      rx={14}
                      fill={fill}
                      stroke={stroke}
                      strokeWidth={isRoot ? 3 : 2}
                    />
                    <text
                      x={position.x}
                      y={position.y - 8}
                      textAnchor="middle"
                      fill={textColor}
                      fontSize={14}
                      fontWeight={600}
                    >
                      {truncate(goal.title, 22)}
                    </text>
                    <text
                      x={position.x}
                      y={position.y + 12}
                      textAnchor="middle"
                      fill={textColor}
                      fontSize={12}
                    >
                      {`${Math.round(progress)}% · ${horizonLabel.get(goal.horizon)}`}
                    </text>
                    {isRoot && (
                      <text
                        x={position.x}
                        y={position.y + 30}
                        textAnchor="middle"
                        fill={textColor}
                        fontSize={10}
                        letterSpacing={1}
                      >
                        ROOT
                      </text>
                    )}
                  </g>
                )
              })}
            </svg>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function GoalTreeView({
  roots,
  childrenMap,
  progressById,
  onAddChild,
  onEdit,
  onDelete,
}: {
  roots: GoalNode[]
  childrenMap: Map<string, GoalNode[]>
  progressById: Map<string, number>
  onAddChild: (parentId: string) => void
  onEdit: (goal: GoalNode) => void
  onDelete: (goal: GoalNode) => void
}) {
  const renderNode = (goal: GoalNode, depth: number) => {
    const children = childrenMap.get(goal.id) ?? []
    const progress = progressById.get(goal.id) ?? 0
    const isRoot = depth === 0
    const isOverridden = goal.progressOverride !== null && goal.progressOverride !== undefined

    return (
      <div key={goal.id} className="space-y-3" style={{ marginLeft: depth * 24 }}>
        <div className="rounded-lg border bg-card p-4 shadow-xs">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-semibold">{goal.title || "Untitled"}</h3>
                {isRoot && <Badge variant="secondary">Root</Badge>}
                <Badge variant="outline">{categoryLabel.get(goal.category)}</Badge>
                <Badge variant="outline">{horizonLabel.get(goal.horizon)}</Badge>
                {isOverridden && <Badge variant="secondary">Override</Badge>}
              </div>
              <div className="text-xs text-muted-foreground">{goal.id}</div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="xs" variant="outline" onClick={() => onAddChild(goal.id)}>
                <Plus className="mr-1 size-3" />
                Child
              </Button>
              <Button size="xs" variant="ghost" onClick={() => onEdit(goal)}>
                <Pencil className="mr-1 size-3" />
                Edit
              </Button>
              <Button
                size="xs"
                variant="ghost"
                className="text-destructive hover:text-destructive"
                onClick={() => onDelete(goal)}
              >
                <Trash2 className="mr-1 size-3" />
                Delete
              </Button>
            </div>
          </div>

          <div className="mt-3 grid gap-2 text-sm text-muted-foreground md:grid-cols-3">
            <div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Why</div>
              <div className="text-sm text-foreground">{goal.why || "—"}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Metric</div>
              <div className="text-sm text-foreground">{goal.metric || "—"}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground">
                Deadline
              </div>
              <div className="text-sm text-foreground">{goal.deadline || "—"}</div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <div className="w-48">
              <Progress value={progress} />
            </div>
            <div className="text-sm font-medium text-foreground">
              {Math.round(progress)}%
            </div>
            {children.length > 0 && (
              <div className="text-xs text-muted-foreground">
                {children.length} child{children.length === 1 ? "" : "ren"}
              </div>
            )}
          </div>
        </div>
        {children.map((child) => renderNode(child, depth + 1))}
      </div>
    )
  }

  if (roots.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-sm text-muted-foreground">
          No goals yet. Add a root goal to get started.
        </CardContent>
      </Card>
    )
  }

  return <div className="space-y-6">{roots.map((goal) => renderNode(goal, 0))}</div>
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<GoalNode[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<"map" | "list">("map")
  const [dataFile, setDataFile] = useState<string | null>(null)
  const [warning, setWarning] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formState, setFormState] = useState<GoalNode | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    setLoading(true)
    fetch("/api/goals", { cache: "no-store" })
      .then((response) => response.json())
      .then((payload) => {
        if (!active) return
        setGoals(payload.goals || [])
        setDataFile(payload.dataFile ?? null)
        setWarning(payload.warning ?? null)
        setError(null)
      })
      .catch((err) => {
        if (!active) return
        setError(err?.message ?? "Failed to load goals.")
      })
      .finally(() => {
        if (active) {
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [])

  const { childrenMap, roots } = useMemo(() => buildChildrenMap(goals), [goals])

  const progressById = useMemo(
    () => computeProgressById(goals, childrenMap),
    [goals, childrenMap]
  )

  const openCreate = (parentId: string | null = null) => {
    const newGoal: GoalNode = {
      id: generateId(),
      title: "",
      category: "personal",
      horizon: "now",
      why: "",
      metric: "",
      deadline: "",
      progress: 0,
      parentId,
      progressOverride: null,
    }
    setFormState(newGoal)
    setEditingId(null)
    setDialogOpen(true)
  }

  const openEdit = (goal: GoalNode) => {
    setFormState({
      ...goal,
      progressOverride:
        goal.progressOverride === undefined ? null : goal.progressOverride,
    })
    setEditingId(goal.id)
    setDialogOpen(true)
  }

  const saveGoals = async (nextGoals: GoalNode[]) => {
    setSaving(true)
    setError(null)
    const previous = goals
    setGoals(nextGoals)

    try {
      const response = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goals: nextGoals }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        throw new Error(payload?.error || "Failed to save goals.")
      }

      const payload = await response.json()
      setDataFile(payload.dataFile ?? null)
      setWarning(null)
    } catch (err: any) {
      setGoals(previous)
      setError(err?.message ?? "Failed to save goals.")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = (goal: GoalNode) => {
    const children = childrenMap.get(goal.id) ?? []
    const message =
      children.length > 0
        ? "Delete this goal? Its children will be reattached to the parent."
        : "Delete this goal?"
    if (!window.confirm(message)) return

    const nextGoals = goals
      .filter((item) => item.id !== goal.id)
      .map((item) => {
        if (item.parentId === goal.id) {
          return { ...item, parentId: goal.parentId }
        }
        return item
      })

    saveGoals(nextGoals)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!formState) return

    const updated: GoalNode = {
      ...formState,
      title: formState.title.trim(),
      progress: clampProgress(formState.progress),
      progressOverride:
        formState.progressOverride === null || formState.progressOverride === undefined
          ? null
          : clampProgress(formState.progressOverride),
    }

    const nextGoals = editingId
      ? goals.map((goal) => (goal.id === editingId ? updated : goal))
      : [...goals, updated]

    saveGoals(nextGoals)
    setDialogOpen(false)
  }

  const formHasChildren = formState
    ? (childrenMap.get(formState.id)?.length ?? 0) > 0
    : false
  const computedProgress = formState
    ? progressById.get(formState.id) ?? formState.progress
    : 0

  const invalidParentIds = useMemo(() => {
    if (!formState) return new Set<string>()
    const descendants = collectDescendants(formState.id, childrenMap)
    return new Set([formState.id, ...descendants])
  }, [formState, childrenMap])

  const parentOptions = goals.filter((goal) => !invalidParentIds.has(goal.id))

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 size-4" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Goals Dashboard</h1>
            </div>
            <div className="w-32" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">
              {dataFile ? `Data file: ${dataFile}` : "Loading data file path..."}
            </div>
            {warning && (
              <div className="text-sm text-amber-600">{warning}</div>
            )}
            {error && <div className="text-sm text-destructive">{error}</div>}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-md border bg-background p-1">
              <Button
                size="sm"
                variant={view === "map" ? "default" : "ghost"}
                onClick={() => setView("map")}
              >
                <MapIcon className="mr-2 size-4" />
                Map
              </Button>
              <Button
                size="sm"
                variant={view === "list" ? "default" : "ghost"}
                onClick={() => setView("list")}
              >
                <ListTree className="mr-2 size-4" />
                List/Tree
              </Button>
            </div>
            <Button onClick={() => openCreate(null)}>
              <Plus className="mr-2 size-4" />
              Add Root Goal
            </Button>
          </div>
        </div>

        {loading ? (
          <Card>
            <CardContent className="py-8 text-sm text-muted-foreground">
              Loading goals...
            </CardContent>
          </Card>
        ) : view === "map" ? (
          <GoalMapView
            goals={goals}
            roots={roots}
            childrenMap={childrenMap}
            progressById={progressById}
            onEdit={openEdit}
          />
        ) : (
          <GoalTreeView
            roots={roots}
            childrenMap={childrenMap}
            progressById={progressById}
            onAddChild={(parentId) => openCreate(parentId)}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Goal" : "Add Goal"}</DialogTitle>
            <DialogDescription>
              {editingId
                ? "Update the goal details and save changes."
                : "Create a new goal and decide where it sits in the tree."}
            </DialogDescription>
          </DialogHeader>
          {formState && (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={formState.title}
                    onChange={(event) =>
                      setFormState({ ...formState, title: event.target.value })
                    }
                    placeholder="Name the goal"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select
                    value={formState.category}
                    onValueChange={(value) =>
                      setFormState({
                        ...formState,
                        category: value as GoalNode["category"],
                      })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Horizon</label>
                  <Select
                    value={formState.horizon}
                    onValueChange={(value) =>
                      setFormState({
                        ...formState,
                        horizon: value as GoalNode["horizon"],
                      })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {horizonOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Deadline</label>
                  <Input
                    type="date"
                    value={formState.deadline}
                    onChange={(event) =>
                      setFormState({ ...formState, deadline: event.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Parent Goal</label>
                  <Select
                    value={formState.parentId ?? "root"}
                    onValueChange={(value) =>
                      setFormState({
                        ...formState,
                        parentId: value === "root" ? null : value,
                      })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="root">No parent (root)</SelectItem>
                      {parentOptions.map((goal) => (
                        <SelectItem key={goal.id} value={goal.id}>
                          {goal.title || goal.id}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Progress</label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={formState.progress}
                    onChange={(event) =>
                      setFormState({
                        ...formState,
                        progress: clampProgress(Number(event.target.value)),
                      })
                    }
                  />
                  <div className="text-xs text-muted-foreground">
                    Used for leaf goals or when manual override is on.
                  </div>
                </div>
              </div>

              {formHasChildren && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Manual Override</label>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        className="h-4 w-4"
                        checked={formState.progressOverride !== null}
                        onChange={(event) =>
                          setFormState({
                            ...formState,
                            progressOverride: event.target.checked
                              ? clampProgress(formState.progress)
                              : null,
                          })
                        }
                      />
                      Enable override
                    </label>
                  </div>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    disabled={formState.progressOverride === null}
                    value={
                      formState.progressOverride === null
                        ? Math.round(computedProgress)
                        : formState.progressOverride
                    }
                    onChange={(event) =>
                      setFormState({
                        ...formState,
                        progressOverride: clampProgress(Number(event.target.value)),
                      })
                    }
                  />
                  <div className="text-xs text-muted-foreground">
                    Current rollup: {Math.round(computedProgress)}%
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Why</label>
                <Textarea
                  value={formState.why}
                  onChange={(event) =>
                    setFormState({ ...formState, why: event.target.value })
                  }
                  placeholder="Why does this goal matter?"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Metric</label>
                <Textarea
                  value={formState.metric}
                  onChange={(event) =>
                    setFormState({ ...formState, metric: event.target.value })
                  }
                  placeholder="How will you measure progress?"
                  rows={2}
                />
              </div>

              <DialogFooter>
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save Goal"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
