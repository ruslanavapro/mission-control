'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useEffect, useState } from 'react'

export function TaskCompletionChart() {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/tasks')
      .then(res => res.json())
      .then(res => {
        const tasks = res.tasks || []
        
        // Group by week
        const weekData: Record<string, number> = {}
        tasks.forEach((task: any) => {
          if (task.status === 'done') {
            const date = new Date(task.updatedAt)
            const weekStart = new Date(date)
            weekStart.setDate(date.getDate() - date.getDay())
            const weekKey = weekStart.toISOString().split('T')[0]
            weekData[weekKey] = (weekData[weekKey] || 0) + 1
          }
        })

        const chartData = Object.entries(weekData)
          .sort(([a], [b]) => a.localeCompare(b))
          .slice(-8)
          .map(([week, count]) => ({
            week: new Date(week).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            tasks: count,
          }))

        setData(chartData)
      })
      .catch(() => {})
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Completion Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="week" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Line 
              type="monotone" 
              dataKey="tasks" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--primary))' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
