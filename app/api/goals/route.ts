import { NextResponse } from "next/server"
import { readGoalData, writeGoalData } from "@/lib/goals/store"
import { GoalCategory, GoalHorizon, GoalNode } from "@/lib/goals/types"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

const categories: GoalCategory[] = ["personal", "work"]
const horizons: GoalHorizon[] = ["now", "2w", "6m", "1y", "long"]

function clampProgress(value: number) {
  if (Number.isNaN(value)) return 0
  return Math.max(0, Math.min(100, Math.round(value)))
}

function sanitizeGoal(goal: any, index: number): GoalNode {
  const category: GoalCategory = categories.includes(goal?.category)
    ? goal.category
    : "personal"
  const horizon: GoalHorizon = horizons.includes(goal?.horizon)
    ? goal.horizon
    : "now"
  const progress = clampProgress(Number(goal?.progress ?? 0))
  const progressOverrideRaw = goal?.progressOverride
  const progressOverride =
    progressOverrideRaw === null || progressOverrideRaw === undefined
      ? null
      : clampProgress(Number(progressOverrideRaw))

  return {
    id: String(goal?.id ?? `goal-${index}`),
    title: String(goal?.title ?? "").trim(),
    category,
    horizon,
    why: String(goal?.why ?? ""),
    metric: String(goal?.metric ?? ""),
    deadline: typeof goal?.deadline === "string" ? goal.deadline : "",
    progress,
    parentId:
      typeof goal?.parentId === "string" && goal.parentId.length > 0
        ? goal.parentId
        : null,
    progressOverride,
  }
}

export async function GET() {
  try {
    const result = await readGoalData()
    return NextResponse.json({
      goals: result.data.goals,
      dataFile: result.dataFile,
      usedFallback: result.usedFallback,
      warning: result.warning,
    })
  } catch (error) {
    console.error("Error reading goals:", error)
    return NextResponse.json(
      { error: "Failed to load goals." },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (!body || !Array.isArray(body.goals)) {
      return NextResponse.json(
        { error: "Expected a goals array in request body." },
        { status: 400 }
      )
    }

    const sanitized = body.goals.map(sanitizeGoal)
    const result = await writeGoalData(sanitized)

    return NextResponse.json({
      ok: true,
      goals: sanitized,
      dataFile: result.dataFile,
      usedFallback: result.usedFallback,
    })
  } catch (error) {
    console.error("Error writing goals:", error)
    return NextResponse.json(
      { error: "Failed to save goals." },
      { status: 500 }
    )
  }
}
