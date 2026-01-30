'use client'

import { memo } from 'react'
import { ProjectCard, Project } from '@/components/ProjectCard/ProjectCard'

export const MemoizedProjectCard = memo(
  ProjectCard,
  (prev, next) => {
    return (
      prev.project.id === next.project.id &&
      prev.project.progress === next.project.progress &&
      prev.project.tasksCompleted === next.project.tasksCompleted &&
      prev.project.lastActivity === next.project.lastActivity
    )
  }
)

MemoizedProjectCard.displayName = 'MemoizedProjectCard'
