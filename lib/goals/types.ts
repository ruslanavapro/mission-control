export type GoalCategory = "personal" | "work"
export type GoalHorizon = "now" | "2w" | "6m" | "1y" | "long"

export type GoalNode = {
  id: string
  title: string
  category: GoalCategory
  horizon: GoalHorizon
  why: string
  metric: string
  deadline: string
  progress: number
  parentId: string | null
  progressOverride?: number | null
}

export type GoalData = {
  goals: GoalNode[]
}
