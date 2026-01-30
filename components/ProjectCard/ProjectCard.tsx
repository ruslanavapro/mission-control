import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ExternalLink, Github, FileText } from "lucide-react"
import Link from "next/link"

export interface Project {
  id: string
  name: string
  description: string
  status: "active" | "pending" | "blocked" | "done"
  progress: number
  githubUrl?: string
  documentsCount: number
  tasksCompleted: number
  tasksTotal: number
  lastActivity: string
}

interface ProjectCardProps {
  project: Project
}

const statusConfig = {
  active: { label: "Active", color: "bg-green-500" },
  pending: { label: "Pending", color: "bg-yellow-500" },
  blocked: { label: "Blocked", color: "bg-red-500" },
  done: { label: "Done", color: "bg-blue-500" },
}

export function ProjectCard({ project }: ProjectCardProps) {
  const status = statusConfig[project.status]

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl font-bold">{project.name}</CardTitle>
            <CardDescription className="mt-1">{project.description}</CardDescription>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <div className={`w-2 h-2 rounded-full ${status.color}`} />
            <Badge variant="outline">{status.label}</Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-2" />
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-4 pt-2">
          <div className="text-center">
            <div className="text-2xl font-bold">{project.tasksCompleted}/{project.tasksTotal}</div>
            <div className="text-xs text-muted-foreground">Tasks</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{project.documentsCount}</div>
            <div className="text-xs text-muted-foreground">Docs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {project.githubUrl ? "✓" : "−"}
            </div>
            <div className="text-xs text-muted-foreground">GitHub</div>
          </div>
        </div>

        {/* Last Activity */}
        <div className="text-xs text-muted-foreground pt-2 border-t">
          Last activity: {project.lastActivity}
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1" asChild>
          <Link href={`/projects/${project.id}`}>
            <FileText className="w-4 h-4 mr-2" />
            Details
          </Link>
        </Button>
        {project.githubUrl && (
          <Button variant="outline" size="sm" asChild>
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
              <Github className="w-4 h-4 mr-2" />
              GitHub
            </a>
          </Button>
        )}
        <Button variant="outline" size="sm" asChild>
          <Link href={`/projects/${project.id}`}>
            <ExternalLink className="w-4 h-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
