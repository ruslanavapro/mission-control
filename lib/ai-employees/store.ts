import fs from "fs/promises"
import { constants as fsConstants } from "fs"
import path from "path"
import { AiEmployeesData } from "./types"

const preferredDataFile = "/Users/claw/clawd/shared/projects/ai-employees.json"
const fallbackDataFile = path.join(process.cwd(), "data", "ai-employees.json")

const now = new Date().toISOString()

const defaultData: AiEmployeesData = {
  status: "planned",
  createdAt: now,
  updatedAt: now,
  overview: {
    summary: "Validate AI Employees landing page and offer positioning.",
    problem: "Teams need reliable AI support without hiring overhead.",
    valueProp: "Always-on AI employees trained for repeatable workflows.",
    primaryAudience: "Ops leaders and founders at 20-500 employee companies.",
  },
  icpSegments: [
    "Operations leaders at SaaS companies (20-500 employees)",
    "Founder-led agencies needing scalable delivery",
    "Customer support teams with repetitive workflows",
  ],
  languages: ["English", "Spanish", "French"],
  domainShortlist: [
    "aiemployees.com",
    "hireaiemployees.com",
    "ai-staffing.com",
  ],
  siteIA: [
    "Hero",
    "Problem",
    "How it works",
    "Use cases",
    "Pricing",
    "FAQ",
    "CTA",
  ],
  packagesPricing: [
    "Starter: 1 AI employee - $499/mo",
    "Growth: 3 AI employees - $1,199/mo",
    "Scale: Custom workflows + SLA",
  ],
  trafficChannels: [
    "LinkedIn outbound",
    "Founder newsletter",
    "SEO: AI employee workflows",
    "Partner referrals",
  ],
  kpisResults: [
    "Landing conversion rate >= 3%",
    "50 qualified waitlist signups",
    "CPL under $40",
    "10 demo requests",
  ],
  backlog: [
    "Draft landing copy options",
    "Collect 3 customer quotes",
    "Finalize pricing anchors",
    "Launch first outbound sequence",
  ],
  nextActions: [
    { id: "action-1", text: "Review landing headline variants", done: false },
    { id: "action-2", text: "Confirm domain shortlist", done: false },
    { id: "action-3", text: "Set up conversion tracking", done: false },
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

export async function readAiEmployeesData(): Promise<{
  data: AiEmployeesData
  dataFile: string
  usedFallback: boolean
  warning?: string
}> {
  const { dataFile, usedFallback } = await resolveWritablePath()
  const raw = await fs.readFile(dataFile, "utf-8")

  try {
    const parsed = JSON.parse(raw) as AiEmployeesData
    if (!parsed || typeof parsed !== "object" || !parsed.overview) {
      return {
        data: defaultData,
        dataFile,
        usedFallback,
        warning: "AI Employees data file was missing required fields. Defaults loaded.",
      }
    }

    return { data: parsed, dataFile, usedFallback }
  } catch (error) {
    return {
      data: defaultData,
      dataFile,
      usedFallback,
      warning: "AI Employees data file contained invalid JSON. Defaults loaded.",
    }
  }
}

export async function writeAiEmployeesData(data: AiEmployeesData) {
  const { dataFile, usedFallback } = await resolveWritablePath()
  await fs.writeFile(dataFile, JSON.stringify(data, null, 2), "utf-8")
  return { dataFile, usedFallback }
}
