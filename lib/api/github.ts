// GitHub API client
const GITHUB_API_BASE = 'https://api.github.com'
const GITHUB_USERNAME = 'ruslanavapro'
const GITHUB_TOKEN = process.env.GITHUB_TOKEN

export interface GithubRepo {
  id: number
  name: string
  full_name: string
  description: string
  html_url: string
  updated_at: string
  stargazers_count: number
  open_issues_count: number
}

export interface GithubCommit {
  sha: string
  commit: {
    message: string
    author: {
      name: string
      date: string
    }
  }
}

export async function getGithubRepos(): Promise<GithubRepo[]> {
  try {
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
    }
    
    if (GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`
    }
    
    const response = await fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=20`, {
      headers,
      next: { revalidate: 300 }, // Cache for 5 minutes
      signal: AbortSignal.timeout(10000)
    })
    
    if (!response.ok) {
      console.warn(`GitHub API returned ${response.status}: ${response.statusText}`)
      return []
    }
    
    return await response.json()
  } catch (error) {
    if (error instanceof Error) {
      console.warn('GitHub API unavailable:', error.message)
    }
    return []
  }
}

export async function getRepoCommits(repo: string, limit: number = 10): Promise<GithubCommit[]> {
  try {
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
    }
    
    if (GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`
    }
    
    const response = await fetch(`${GITHUB_API_BASE}/repos/${GITHUB_USERNAME}/${repo}/commits?per_page=${limit}`, {
      headers,
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(5000)
    })
    
    if (!response.ok) {
      return []
    }
    
    return await response.json()
  } catch (error) {
    console.warn('Error fetching commits:', error)
    return []
  }
}
