import fs from "fs/promises"
import { constants as fsConstants } from "fs"
import path from "path"
import { GoalData, GoalNode } from "./types"

const preferredDataFile =
  "/Users/claw/clawd/shared/ava-collaboration/goal-tree/goal-tree.json"
const fallbackDataFile = path.join(process.cwd(), "data", "goal-tree.json")

const defaultData: GoalData = {
  goals: [
    {
      id: "goal-root",
      title: "Build a Life I Own",
      category: "personal",
      horizon: "long",
      why: "Sustain freedom, energy, and focus across work and life.",
      metric: "Weekly energy score >= 8/10",
      deadline: "",
      progress: 35,
      parentId: null,
    },
    {
      id: "goal-work-growth",
      title: "Grow Mission Control",
      category: "work",
      horizon: "1y",
      why: "Make the dashboard the default control plane for my projects.",
      metric: "Daily active use, 5+ projects tracked",
      deadline: "",
      progress: 50,
      parentId: "goal-root",
    },
    {
      id: "goal-health",
      title: "Health & Energy",
      category: "personal",
      horizon: "6m",
      why: "High energy unlocks everything else.",
      metric: "5 workouts/week + 7.5h sleep avg",
      deadline: "",
      progress: 40,
      parentId: "goal-root",
    },
    {
      id: "goal-focus",
      title: "Deep Work Rhythm",
      category: "work",
      horizon: "2w",
      why: "Ship core features consistently.",
      metric: "3 deep work blocks/day",
      deadline: "",
      progress: 60,
      parentId: "goal-work-growth",
    },
  ],
}

async function ensureFile(filePath: string) {
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  try {
    await fs.access(filePath, fsConstants.R_OK | fsConstants.W_OK)
    return
  } catch (error: any) {
    if (error?.code !== "ENOENT") {
      throw error
    }
  }

  await fs.writeFile(filePath, JSON.stringify(defaultData, null, 2), "utf-8")
  await fs.access(filePath, fsConstants.R_OK | fsConstants.W_OK)
}

async function resolveWritablePath() {
  try {
    await ensureFile(preferredDataFile)
    return { dataFile: preferredDataFile, usedFallback: false }
  } catch (error) {
    await ensureFile(fallbackDataFile)
    return { dataFile: fallbackDataFile, usedFallback: true }
  }
}

export async function readGoalData(): Promise<{
  data: GoalData
  dataFile: string
  usedFallback: boolean
  warning?: string
}> {
  const { dataFile, usedFallback } = await resolveWritablePath()
  const raw = await fs.readFile(dataFile, "utf-8")

  try {
    const parsed = JSON.parse(raw) as GoalData
    if (!parsed || !Array.isArray(parsed.goals)) {
      return {
        data: defaultData,
        dataFile,
        usedFallback,
        warning: "Goal data file was missing a goals array. Defaults loaded.",
      }
    }

    return { data: parsed, dataFile, usedFallback }
  } catch (error) {
    return {
      data: defaultData,
      dataFile,
      usedFallback,
      warning: "Goal data file contained invalid JSON. Defaults loaded.",
    }
  }
}

export async function writeGoalData(goals: GoalNode[]) {
  const { dataFile, usedFallback } = await resolveWritablePath()
  const payload: GoalData = { goals }
  await fs.writeFile(dataFile, JSON.stringify(payload, null, 2), "utf-8")
  return { dataFile, usedFallback }
}
