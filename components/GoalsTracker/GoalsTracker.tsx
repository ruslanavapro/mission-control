'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target } from "lucide-react"

const goals = [
  { name: "💰 Заработок", weight: 20, color: "bg-green-500" },
  { name: "📋 Организация", weight: 16, color: "bg-blue-500" },
  { name: "🚀 Развитие", weight: 16, color: "bg-purple-500" },
  { name: "🔍 Новые ниши", weight: 16, color: "bg-yellow-500" },
  { name: "📈 Инвестирование", weight: 16, color: "bg-orange-500" },
  { name: "👨‍👩‍👧‍👦 Семья", weight: 16, color: "bg-pink-500" },
]

export function GoalsTracker() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          Goals
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {goals.map(goal => (
          <div key={goal.name}>
            <div className="flex justify-between text-sm mb-1">
              <span>{goal.name}</span>
              <span className="font-medium">{goal.weight}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className={`h-2 ${goal.color} transition-all`}
                style={{ width: `${goal.weight}%` }}
              />
            </div>
          </div>
        ))}
        
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
