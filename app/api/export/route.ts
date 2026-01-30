import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const format = searchParams.get('format') || 'json'

  try {
    // Read tasks
    const tasksPath = path.join(process.cwd(), 'data', 'tasks.json')
    let tasks = []
    if (fs.existsSync(tasksPath)) {
      tasks = JSON.parse(fs.readFileSync(tasksPath, 'utf-8'))
    }

    if (format === 'csv') {
      // Convert to CSV
      const headers = ['ID', 'Project ID', 'Title', 'Description', 'Status', 'Priority', 'Due Date', 'Created', 'Updated']
      const rows = tasks.map((task: any) => [
        task.id,
        task.projectId,
        `"${(task.title || '').replace(/"/g, '""')}"`,
        `"${(task.description || '').replace(/"/g, '""')}"`,
        task.status,
        task.priority || '',
        task.dueDate || '',
        task.createdAt,
        task.updatedAt,
      ])

      const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename=tasks-${new Date().toISOString().split('T')[0]}.csv`,
        },
      })
    }

    // JSON format
    return NextResponse.json({
      exportedAt: new Date().toISOString(),
      tasksCount: tasks.length,
      tasks,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Export failed' }, { status: 500 })
  }
}
