'use client'

import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function CardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-muted animate-pulse" />
          <div className="h-5 bg-muted animate-pulse rounded w-1/2" />
        </div>
        <div className="h-3 bg-muted animate-pulse rounded w-3/4 mt-2" />
      </CardHeader>
      <CardContent>
        <div className="h-2 bg-muted animate-pulse rounded w-full mb-3" />
        <div className="flex gap-4">
          <div className="h-3 bg-muted animate-pulse rounded w-16" />
          <div className="h-3 bg-muted animate-pulse rounded w-16" />
          <div className="h-3 bg-muted animate-pulse rounded w-16" />
        </div>
      </CardContent>
    </Card>
  )
}

export function ProjectGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </div>
  )
}

export function SidebarSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="h-5 bg-muted animate-pulse rounded w-1/3" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-3 bg-muted animate-pulse rounded" />
            <div className="h-3 bg-muted animate-pulse rounded w-3/4" />
            <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <div className="h-5 bg-muted animate-pulse rounded w-1/3" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-3 bg-muted animate-pulse rounded" />
            <div className="h-3 bg-muted animate-pulse rounded w-2/3" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function StatsRowSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map(i => (
        <Card key={i}>
          <CardContent className="pt-6">
            <div className="h-8 bg-muted animate-pulse rounded w-1/2 mb-2" />
            <div className="h-3 bg-muted animate-pulse rounded w-2/3" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
