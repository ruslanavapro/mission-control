import { NextResponse } from "next/server"
import { readAiEmployeesData, writeAiEmployeesData } from "@/lib/ai-employees/store"
import {
  AiEmployeesData,
  AiEmployeesOverview,
  AiEmployeesStatus,
  NextAction,
} from "@/lib/ai-employees/types"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

const statuses: AiEmployeesStatus[] = [
  "planned",
  "building",
  "launched",
  "measuring",
]

function sanitizeString(value: any) {
  if (typeof value === "string") return value.trim()
  return ""
}

function sanitizeList(value: any): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean)
  }
  if (typeof value === "string") {
    return value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean)
  }
  return []
}

function sanitizeOverview(overview: any): AiEmployeesOverview {
  return {
    summary: sanitizeString(overview?.summary),
    problem: sanitizeString(overview?.problem),
    valueProp: sanitizeString(overview?.valueProp),
    primaryAudience: sanitizeString(overview?.primaryAudience),
  }
}

function sanitizeNextActions(value: any): NextAction[] {
  if (!Array.isArray(value)) return []
  return value
    .map((action, index) => ({
      id:
        typeof action?.id === "string" && action.id.trim().length > 0
          ? action.id
          : `action-${index}`,
      text: sanitizeString(action?.text),
      done: Boolean(action?.done),
    }))
    .filter((action) => action.text.length > 0)
}

function sanitizeAiEmployeesData(payload: any): AiEmployeesData {
  const status: AiEmployeesStatus = statuses.includes(payload?.status)
    ? payload.status
    : "planned"
  const now = new Date().toISOString()
  const createdAt =
    typeof payload?.createdAt === "string" && payload.createdAt.trim().length > 0
      ? payload.createdAt
      : now

  return {
    status,
    createdAt,
    updatedAt: now,
    overview: sanitizeOverview(payload?.overview),
    icpSegments: sanitizeList(payload?.icpSegments),
    languages: sanitizeList(payload?.languages),
    domainShortlist: sanitizeList(payload?.domainShortlist),
    siteIA: sanitizeList(payload?.siteIA),
    packagesPricing: sanitizeList(payload?.packagesPricing),
    trafficChannels: sanitizeList(payload?.trafficChannels),
    kpisResults: sanitizeList(payload?.kpisResults),
    backlog: sanitizeList(payload?.backlog),
    nextActions: sanitizeNextActions(payload?.nextActions),
  }
}

export async function GET() {
  try {
    const result = await readAiEmployeesData()
    return NextResponse.json({
      data: result.data,
      dataFile: result.dataFile,
      usedFallback: result.usedFallback,
      warning: result.warning,
    })
  } catch (error) {
    console.error("Error reading AI Employees data:", error)
    return NextResponse.json(
      { error: "Failed to load AI Employees data." },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const payload = body?.data ?? body

    if (!payload || typeof payload !== "object") {
      return NextResponse.json(
        { error: "Expected AI Employees data in request body." },
        { status: 400 }
      )
    }

    const sanitized = sanitizeAiEmployeesData(payload)
    const result = await writeAiEmployeesData(sanitized)

    return NextResponse.json({
      ok: true,
      data: sanitized,
      dataFile: result.dataFile,
      usedFallback: result.usedFallback,
    })
  } catch (error) {
    console.error("Error writing AI Employees data:", error)
    return NextResponse.json(
      { error: "Failed to save AI Employees data." },
      { status: 500 }
    )
  }
}
