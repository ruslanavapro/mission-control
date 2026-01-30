'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GitCommit } from "lucide-react"
import { useEffect, useState } from "react"

interface Commit {
  sha: string
  message: string
  author: string
  date: string
  url: string
}

export function RecentCommits() {
  const [commits, setCommits] = useState<Commit[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/projects')
      .then(r => r.json())
      .then(data => {
        const projects = data.projects || []
        const allCommits: Commit[] = []
        
        projects.forEach((project: any) => {
          if (project.github?.commits) {
            project.github.commits.slice(0, 2).forEach((commit: any) => {
              allCommits.push({
                sha: commit.sha,
                message: commit.commit.message,
                author: commit.commit.author.name,
                date: commit.commit.author.date,
                url: commit.html_url,
              })
            })
          }
        })

        allCommits.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        setCommits(allCommits.slice(0, 5))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const formatTime = (date: string) => {
    const d = new Date(date)
    const now = new Date()
    const diffHours = Math.floor((now.getTime() - d.getTime()) / 3600000)
    if (diffHours < 24) return `${diffHours}h ago`
    const diffDays = Math.floor(diffHours / 24)
    if (diffDays < 7) return `${diffDays}d ago`
    return d.toLocaleDateString()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <GitCommit className="w-4 h-4" />
          Recent Commits
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : commits.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-2">No commits yet</p>
        ) : (
          commits.map(commit => (
            <a 
              key={commit.sha} 
              href={commit.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block p-2 rounded-lg hover:bg-accent transition-colors"
            >
              <p className="text-sm line-clamp-1">{commit.message}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground">{commit.author}</span>
                <span className="text-xs text-muted-foreground">·</span>
                <span className="text-xs text-muted-foreground">{formatTime(commit.date)}</span>
              </div>
            </a>
          ))
        )}
      </CardContent>
    </Card>
  )
}
