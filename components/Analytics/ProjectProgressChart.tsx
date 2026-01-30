'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useEffect, useState } from 'react'

export function ProjectProgressChart() {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(res => {
        const projects = res.projects || []
        
        const ranges = {
          '0-25%': projects.filter((p: any) => p.progress >= 0 && p.progress < 25).length,
          '26-50%': projects.filter((p: any) => p.progress >= 25 && p.progress < 50).length,
          '51-75%': projects.filter((p: any) => p.progress >= 50 && p.progress < 75).length,
          '76-100%': projects.filter((p: any) => p.progress >= 75).length,
        }

        setData([
          { range: '0-25%', count: ranges['0-25%'] },
          { range: '26-50%', count: ranges['26-50%'] },
          { range: '51-75%', count: ranges['51-75%'] },
          { range: '76-100%', count: ranges['76-100%'] },
        ])
      })
      .catch(() => {})
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Progress Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="range" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Bar dataKey="count" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
