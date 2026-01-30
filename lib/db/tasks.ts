// In-memory task storage (replace with real DB in production)
// For MVP, using simple file-based storage

import fs from 'fs/promises'
import path from 'path'

export interface Task {
  id: string
  projectId: string
  title: string
  description?: string
  status: 'todo' | 'inprogress' | 'done'
  priority?: 'low' | 'medium' | 'high'
  dueDate?: string
  createdAt: string
  updatedAt: string
}

const TASKS_FILE = path.join(process.cwd(), 'data', 'tasks.json')

async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data')
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

async function readTasks(): Promise<Task[]> {
  try {
    await ensureDataDir()
    const data = await fs.readFile(TASKS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function writeTasks(tasks: Task[]): Promise<void> {
  await ensureDataDir()
  await fs.writeFile(TASKS_FILE, JSON.stringify(tasks, null, 2))
}

export async function getTasks(projectId?: string): Promise<Task[]> {
  const tasks = await readTasks()
  if (projectId) {
    return tasks.filter(t => t.projectId === projectId)
  }
  return tasks
}

export async function getTaskById(id: string): Promise<Task | null> {
  const tasks = await readTasks()
  return tasks.find(t => t.id === id) || null
}

export async function createTask(data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
  const tasks = await readTasks()
  const now = new Date().toISOString()
  
  const task: Task = {
    ...data,
    id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    createdAt: now,
    updatedAt: now,
  }
  
  tasks.push(task)
  await writeTasks(tasks)
  
  return task
}

export async function updateTask(id: string, data: Partial<Omit<Task, 'id' | 'createdAt'>>): Promise<Task | null> {
  const tasks = await readTasks()
  const index = tasks.findIndex(t => t.id === id)
  
  if (index === -1) {
    return null
  }
  
  tasks[index] = {
    ...tasks[index],
    ...data,
    updatedAt: new Date().toISOString(),
  }
  
  await writeTasks(tasks)
  return tasks[index]
}

export async function deleteTask(id: string): Promise<boolean> {
  const tasks = await readTasks()
  const filtered = tasks.filter(t => t.id !== id)
  
  if (filtered.length === tasks.length) {
    return false
  }
  
  await writeTasks(filtered)
  return true
}
