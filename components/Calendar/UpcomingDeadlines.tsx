'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar as CalendarIcon, Clock, MapPin, ExternalLink } from "lucide-react"
import { useEffect, useState } from "react"
import { format, formatDistanceToNow, isPast, isToday, isTomorrow } from "date-fns"

interface CalendarEvent {
  id: string
  summary: string
  description?: string
  start: string
  end: string
  location?: string
  htmlLink: string
}

export function UpcomingDeadlines() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/calendar')
      .then(res => res.json())
      .then(data => {
        setEvents(data.events || [])
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load calendar:', err)
        setLoading(false)
      })
  }, [])

  const getEventBadge = (startDate: string) => {
    const date = new Date(startDate)
    
    if (isPast(date)) {
      return <Badge variant="outline" className="text-red-500 border-red-500">Past</Badge>
    }
    if (isToday(date)) {
      return <Badge className="bg-green-500">Today</Badge>
    }
    if (isTomorrow(date)) {
      return <Badge className="bg-blue-500">Tomorrow</Badge>
    }
    
    return <Badge variant="outline">{formatDistanceToNow(date, { addSuffix: true })}</Badge>
  }

  const formatEventTime = (startDate: string) => {
    const date = new Date(startDate)
    
    try {
      return format(date, 'MMM d, h:mm a')
    } catch {
      return format(date, 'MMM d')
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            Upcoming Deadlines
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-10" />
          ))}
        </CardContent>
      </Card>
    )
  }

  if (events.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            Upcoming Deadlines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No upcoming events. Connect Google Calendar to see your schedule.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5" />
          Upcoming Deadlines ({events.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {events.slice(0, 5).map(event => (
          <div key={event.id} className="border-b pb-3 last:border-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h4 className="text-sm font-medium line-clamp-1">{event.summary}</h4>
              {getEventBadge(event.start)}
            </div>
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <Clock className="w-3 h-3" />
              {formatEventTime(event.start)}
            </div>
            
            {event.location && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <MapPin className="w-3 h-3" />
                <span className="line-clamp-1">{event.location}</span>
              </div>
            )}
            
            {event.description && (
              <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                {event.description}
              </p>
            )}
            
            {event.htmlLink && (
              <a 
                href={event.htmlLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
              >
                View in Calendar
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        ))}
        
        {events.length > 5 && (
          <p className="text-xs text-muted-foreground text-center pt-2">
            +{events.length - 5} more events
          </p>
        )}
      </CardContent>
    </Card>
  )
}
