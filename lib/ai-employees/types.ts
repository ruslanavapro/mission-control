export type AiEmployeesStatus = "planned" | "building" | "launched" | "measuring"

export type AiEmployeesOverview = {
  summary: string
  problem: string
  valueProp: string
  primaryAudience: string
}

export type NextAction = {
  id: string
  text: string
  done: boolean
}

export type AiEmployeesData = {
  status: AiEmployeesStatus
  createdAt: string
  updatedAt: string
  overview: AiEmployeesOverview
  icpSegments: string[]
  languages: string[]
  domainShortlist: string[]
  siteIA: string[]
  packagesPricing: string[]
  trafficChannels: string[]
  kpisResults: string[]
  backlog: string[]
  nextActions: NextAction[]
}
