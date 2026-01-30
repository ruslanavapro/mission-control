import { NextResponse } from 'next/server'
import { getUpcomingEvents } from '@/lib/api/calendar'

export async function GET() {
  try {
    const events = await getUpcomingEvents(15)
    
    return NextResponse.json({ 
      events,
      count: events.length 
    })
  } catch (error) {
    console.error('Error fetching calendar events:', error)
    return NextResponse.json(
      { error: 'Failed to fetch calendar events', events: [] },
      { status: 500 }
    )
  }
}
