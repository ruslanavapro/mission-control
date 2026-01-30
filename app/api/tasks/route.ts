import { NextRequest, NextResponse } from 'next/server'
import { getTasks, createTask } from '@/lib/db/tasks'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const projectId = searchParams.get('projectId')
    
    const tasks = await getTasks(projectId || undefined)
    
    return NextResponse.json({ tasks })
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    if (!body.projectId || !body.title) {
      return NextResponse.json(
        { error: 'Missing required fields: projectId, title' },
        { status: 400 }
      )
    }
    
    const task = await createTask({
      projectId: body.projectId,
      title: body.title,
      description: body.description,
      status: body.status || 'todo',
      priority: body.priority,
      dueDate: body.dueDate,
    })
    
    return NextResponse.json({ task }, { status: 201 })
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    )
  }
}
