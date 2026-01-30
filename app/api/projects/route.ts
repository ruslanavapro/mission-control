import { NextResponse } from 'next/server'
import { getGithubRepos, getRepoCommits } from '@/lib/api/github'
import { getDocumentsByProject } from '@/lib/api/avabase'
import { Project } from '@/components/ProjectCard/ProjectCard'

// Map GitHub repos to projects
const projectMapping: Record<string, Partial<Project>> = {
  'avapro-crm': {
    name: 'CRM/ERP',
    description: 'Restaurant management system - reservations, guests, waitlist',
    status: 'active',
  },
  'ava-pkm': {
    name: 'AvaBase',
    description: 'Second brain - PKM system with semantic search',
    status: 'active',
  },
  'mission-control': {
    name: 'Mission Control Dashboard',
    description: 'Personal command center for all projects, goals, and conversations',
    status: 'active',
  },
  'ava-workspace': {
    name: 'Memory Upgrade',
    description: '5-level associative memory system for Ava',
    status: 'done',
  },
}

// Static projects without GitHub
const staticProjects: Partial<Project>[] = [
  {
    id: 'avalon-sushi',
    name: 'Avalon Sushi Delivery',
    description: 'Premium sushi delivery service for Kyiv',
    status: 'pending',
    progress: 20,
    documentsCount: 8,
    tasksCompleted: 2,
    tasksTotal: 12,
    lastActivity: '3 days ago'
  },
]

function calculateProgress(commits: number, issues: number): number {
  // Simple heuristic: more commits = more progress
  // Adjust based on open issues
  const baseProgress = Math.min(commits * 2, 100)
  const issuePenalty = issues * 5
  return Math.max(0, Math.min(100, baseProgress - issuePenalty))
}

export async function GET() {
  try {
    const repos = await getGithubRepos()
    
    const projects: Project[] = await Promise.all(
      repos
        .filter(repo => projectMapping[repo.name])
        .map(async (repo) => {
          const mapping = projectMapping[repo.name]
          const documents = await getDocumentsByProject(mapping.name || repo.name)
          const commits = await getRepoCommits(repo.name, 20)
          
          // Calculate progress based on repo activity
          const progress = calculateProgress(commits.length, repo.open_issues_count)
          
          // Parse last activity (prefer latest commit date)
          const lastUpdate = commits[0]?.commit?.author?.date
            ? new Date(commits[0].commit.author.date)
            : new Date(repo.updated_at)
          const now = new Date()
          const hoursAgo = Math.floor((now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60))
          const lastActivity = hoursAgo < 24
            ? `${hoursAgo} hours ago`
            : `${Math.floor(hoursAgo / 24)} days ago`
          
          return {
            id: repo.name,
            name: mapping.name || repo.name,
            description: mapping.description || repo.description || '',
            status: mapping.status || 'active',
            progress,
            githubUrl: repo.html_url,
            documentsCount: documents.length,
            tasksCompleted: Math.floor(progress / 10), // Estimate
            tasksTotal: Math.floor(progress / 10) + repo.open_issues_count,
            lastActivity,
          } as Project
        })
    )
    
    // Add static projects
    const allProjects = [...projects, ...staticProjects as Project[]]
    
    return NextResponse.json({ projects: allProjects })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}
