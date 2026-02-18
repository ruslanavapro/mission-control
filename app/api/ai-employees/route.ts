import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import { promises as fs } from 'fs'
import crypto from 'crypto'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type AiEmployeesApiResponse = {
  data: unknown
  dataFile: string
  usedFallback?: boolean
  readOnly?: boolean
  warning?: string
}

const DEFAULT_RELATIVE_FILE = path.resolve(
  process.cwd(),
  '../../shared/projects/ai-employees.json'
)
const DEFAULT_ABSOLUTE_FILE = '/Users/claw/clawd/shared/projects/ai-employees.json'

const PUBLIC_READONLY_FILE = path.join(process.cwd(), 'public', 'ai-employees.json')

const IS_VERCEL = Boolean(process.env.VERCEL)

async function fileExists(filePath: string) {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

async function resolveDataFile(): Promise<{
  dataFile: string
  usedFallback?: boolean
  warning?: string
}> {
  const envFile = process.env.AI_EMPLOYEES_DATA_FILE

  if (envFile) {
    return { dataFile: envFile }
  }

  if (await fileExists(DEFAULT_RELATIVE_FILE)) {
    return { dataFile: DEFAULT_RELATIVE_FILE }
  }

  if (await fileExists(DEFAULT_ABSOLUTE_FILE)) {
    return {
      dataFile: DEFAULT_ABSOLUTE_FILE,
      usedFallback: true,
      warning:
        'Using fallback absolute path for ai-employees.json (set AI_EMPLOYEES_DATA_FILE to override).',
    }
  }

  // Default to the relative path even if it doesn't exist yet (will be created on POST)
  return {
    dataFile: DEFAULT_RELATIVE_FILE,
    usedFallback: true,
    warning:
      'ai-employees.json not found. Will use default path (and create on save). Set AI_EMPLOYEES_DATA_FILE to override.',
  }
}

async function readJson(filePath: string): Promise<{ data?: unknown; warning?: string }> {
  try {
    const raw = await fs.readFile(filePath, 'utf8')
    return { data: JSON.parse(raw) }
  } catch (err) {
    return {
      data: {},
      warning: `Failed to read or parse ${filePath}: ${err instanceof Error ? err.message : String(err)}`,
    }
  }
}

async function atomicWriteFile(filePath: string, contents: string) {
  const dir = path.dirname(filePath)
  await fs.mkdir(dir, { recursive: true })

  const tmpFile = path.join(
    dir,
    `.${path.basename(filePath)}.${process.pid}.${crypto.randomBytes(6).toString('hex')}.tmp`
  )

  await fs.writeFile(tmpFile, contents, 'utf8')
  await fs.rename(tmpFile, filePath)
}

function jsonNoStore(payload: AiEmployeesApiResponse, init?: ResponseInit) {
  return NextResponse.json(payload, {
    ...init,
    headers: {
      ...(init?.headers || {}),
      'Cache-Control': 'no-store, max-age=0',
    },
  })
}

export async function GET() {
  if (IS_VERCEL) {
    const dataFile = PUBLIC_READONLY_FILE

    if (!(await fileExists(dataFile))) {
      return jsonNoStore({
        data: {},
        dataFile,
        usedFallback: true,
        readOnly: true,
        warning:
          'Running on Vercel: ai-employees data is read-only and should be provided via public/ai-employees.json. File is missing.',
      })
    }

    const { data, warning: readWarning } = await readJson(dataFile)

    return jsonNoStore({
      data,
      dataFile,
      usedFallback: Boolean(readWarning) || undefined,
      readOnly: true,
      warning: readWarning,
    })
  }

  const { dataFile, usedFallback, warning: resolveWarning } = await resolveDataFile()
  const { data, warning: readWarning } = await readJson(dataFile)

  const warning = [resolveWarning, readWarning].filter(Boolean).join('\n') || undefined

  return jsonNoStore({
    data,
    dataFile,
    usedFallback: usedFallback || Boolean(readWarning) || undefined,
    warning,
  })
}

export async function POST(request: NextRequest) {
  if (IS_VERCEL) {
    return jsonNoStore(
      {
        data: null,
        dataFile: PUBLIC_READONLY_FILE,
        usedFallback: true,
        readOnly: true,
        warning:
          'Running on Vercel: saving AI Employees data is disabled (filesystem is read-only). Use a KV/DB (e.g. Vercel KV/Postgres) and update this endpoint to persist changes.',
      },
      { status: 501 }
    )
  }

  const { dataFile, usedFallback, warning: resolveWarning } = await resolveDataFile()

  let body: { data?: unknown }
  try {
    body = await request.json()
  } catch (error) {
    return jsonNoStore(
      {
        data: null,
        dataFile,
        usedFallback,
        warning: `Invalid JSON body: ${error instanceof Error ? error.message : String(error)}`,
      },
      { status: 400 }
    )
  }

  if (typeof body !== 'object' || body === null || !('data' in body)) {
    return jsonNoStore(
      {
        data: null,
        dataFile,
        usedFallback,
        warning: 'Missing required field: { data }',
      },
      { status: 400 }
    )
  }

  try {
    const json = JSON.stringify(body.data, null, 2) + '\n'
    await atomicWriteFile(dataFile, json)

    const warning = resolveWarning

    return jsonNoStore(
      {
        data: body.data,
        dataFile,
        usedFallback,
        warning,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error writing ai-employees.json:', error)
    return jsonNoStore(
      {
        data: body.data,
        dataFile,
        usedFallback,
        warning: `Failed to write ${dataFile}: ${error instanceof Error ? error.message : String(error)}`,
      },
      { status: 500 }
    )
  }
}
