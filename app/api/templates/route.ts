import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const templatesPath = path.join(process.cwd(), 'data', 'project-templates.json')
    const templates = JSON.parse(fs.readFileSync(templatesPath, 'utf-8'))
    
    return NextResponse.json({ templates })
  } catch (error) {
    return NextResponse.json({ templates: [] })
  }
}
