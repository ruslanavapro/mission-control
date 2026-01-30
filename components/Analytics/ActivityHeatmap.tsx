'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity } from "lucide-react"
import { useEffect, useState } from "react"

interface DayActivity {
  date: string
  count: number
}

export function ActivityHeatmap() {
  const [activity, setActivity] = useState<DayActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Generate mock activity data for last 90 days
    const generateActivity = () => {
      const days: DayActivity[] = []
      const now = new Date()
      
      for (let i = 89; i >= 0; i--) {
        const date = new Date(now)
        date.setDate(date.getDate() - i)
        
        // Random activity count (0-10)
        const count = Math.floor(Math.random() * 11)
        
        days.push({
          date: date.toISOString().split('T')[0],
          count
        })
      }
      
      return days
    }
    
    setActivity(generateActivity())
    setLoading(false)
  }, [])

  const getColor = (count: number) => {
    if (count === 0) return 'bg-muted'
    if (count <= 2) return 'bg-green-500/30'
    if (count <= 5) return 'bg-green-500/60'
    if (count <= 8) return 'bg-green-500/80'
    return 'bg-green-500'
  }

  // Group by weeks
  const weeks: DayActivity[][] = []
  for (let i = 0; i < activity.length; i += 7) {
    weeks.push(activity.slice(i, i + 7))
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Activity (Last 90 Days)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {/* Weekday labels */}
          <div className="flex gap-1">
            <div className="w-8" />
            {['Mon', 'Wed', 'Fri'].map((day, i) => (
              <div key={day} className="text-xs text-muted-foreground" style={{ marginLeft: i * 2 * 12 }}>
                {day}
              </div>
            ))}
          </div>
          
          {/* Heatmap grid */}
          <div className="flex gap-1">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((day, dayIndex) => (
                  <div
                    key={day.date}
                    className={`w-3 h-3 rounded-sm ${getColor(day.count)} hover:ring-2 hover:ring-primary/50 cursor-pointer transition-all`}
                    title={`${day.date}: ${day.count} activities`}
                  />
                ))}
              </div>
            ))}
          </div>
          
          {/* Legend */}
          <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-sm bg-muted" />
              <div className="w-3 h-3 rounded-sm bg-green-500/30" />
              <div className="w-3 h-3 rounded-sm bg-green-500/60" />
              <div className="w-3 h-3 rounded-sm bg-green-500/80" />
              <div className="w-3 h-3 rounded-sm bg-green-500" />
            </div>
            <span>More</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
