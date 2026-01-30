'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target } from "lucide-react"

const goals = [
  { name: "💰 Заработок", weight: 20, color: "hsl(142, 71%, 45%)", description: "Profit & opportunities" },
  { name: "📋 Организация", weight: 16, color: "hsl(217, 91%, 60%)", description: "Systems & control" },
  { name: "🚀 Развитие", weight: 16, color: "hsl(271, 91%, 65%)", description: "Learning & growth" },
  { name: "🔍 Новые ниши", weight: 16, color: "hsl(48, 96%, 53%)", description: "Market research" },
  { name: "📈 Инвестирование", weight: 16, color: "hsl(25, 95%, 53%)", description: "3-5% monthly" },
  { name: "👨‍👩‍👧‍👦 Семья", weight: 16, color: "hsl(340, 82%, 52%)", description: "Comfort & joy" },
]

export function GoalsTracker() {
  const totalWeight = goals.reduce((sum, goal) => sum + goal.weight, 0)
  let cumulativePercentage = 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          Goals Distribution
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Pie Chart */}
        <div className="flex justify-center mb-6">
          <div className="relative w-48 h-48">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              {goals.map((goal, index) => {
                const percentage = goal.weight / totalWeight
                const startAngle = cumulativePercentage * 360
                const angle = percentage * 360
                cumulativePercentage += percentage

                // Calculate path for pie slice
                const radius = 45
                const cx = 50
                const cy = 50
                
                const startAngleRad = (startAngle - 90) * (Math.PI / 180)
                const endAngleRad = (startAngle + angle - 90) * (Math.PI / 180)
                
                const x1 = cx + radius * Math.cos(startAngleRad)
                const y1 = cy + radius * Math.sin(startAngleRad)
                const x2 = cx + radius * Math.cos(endAngleRad)
                const y2 = cy + radius * Math.sin(endAngleRad)
                
                const largeArc = angle > 180 ? 1 : 0

                return (
                  <g key={index}>
                    <path
                      d={`M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`}
                      fill={goal.color}
                      className="hover:opacity-80 transition-opacity cursor-pointer"
                      opacity="0.9"
                    />
                  </g>
                )
              })}
              
              {/* Center circle */}
              <circle cx="50" cy="50" r="20" fill="hsl(var(--background))" />
              <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" className="fill-foreground text-xs font-semibold">
                100%
              </text>
            </svg>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-2">
          {goals.map((goal, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-sm flex-shrink-0" 
                  style={{ backgroundColor: goal.color }}
                />
                <div>
                  <div className="font-medium">{goal.name}</div>
                  <div className="text-xs text-muted-foreground">{goal.description}</div>
                </div>
              </div>
              <div className="font-semibold">{goal.weight}%</div>
            </div>
          ))}
        </div>
        
        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            <strong>Balanced approach:</strong> All goals matter, #1 slightly more important (20% vs 16%).
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Focus: Build infrastructure, find opportunities, make plans. Quality > quick wins.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
