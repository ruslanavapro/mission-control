// Google Calendar API client
import { google } from 'googleapis'

const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || 'primary'
const CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')

export interface CalendarEvent {
  id: string
  summary: string
  description?: string
  start: string
  end: string
  location?: string
  htmlLink: string
}

function getCalendarClient() {
  if (!CLIENT_EMAIL || !PRIVATE_KEY) {
    console.warn('Google Calendar credentials not configured')
    return null
  }

  const auth = new google.auth.JWT({
    email: CLIENT_EMAIL,
    key: PRIVATE_KEY,
    scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
  })

  return google.calendar({ version: 'v3', auth })
}

export async function getUpcomingEvents(maxResults: number = 10): Promise<CalendarEvent[]> {
  try {
    const calendar = getCalendarClient()
    if (!calendar) {
      return []
    }

    const now = new Date()
    const twoWeeksLater = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000)

    const response = await calendar.events.list({
      calendarId: CALENDAR_ID,
      timeMin: now.toISOString(),
      timeMax: twoWeeksLater.toISOString(),
      maxResults,
      singleEvents: true,
      orderBy: 'startTime',
    })

    const events = response.data.items || []

    return events.map(event => ({
      id: event.id || '',
      summary: event.summary || 'Untitled Event',
      description: event.description ?? undefined,
      start: event.start?.dateTime || event.start?.date || '',
      end: event.end?.dateTime || event.end?.date || '',
      location: event.location ?? undefined,
      htmlLink: event.htmlLink || '',
    }))
  } catch (error) {
    console.warn('Error fetching calendar events:', error)
    return []
  }
}

export async function getTodayEvents(): Promise<CalendarEvent[]> {
  try {
    const calendar = getCalendarClient()
    if (!calendar) {
      return []
    }

    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000)

    const response = await calendar.events.list({
      calendarId: CALENDAR_ID,
      timeMin: todayStart.toISOString(),
      timeMax: todayEnd.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    })

    const events = response.data.items || []

    return events.map(event => ({
      id: event.id || '',
      summary: event.summary || 'Untitled Event',
      description: event.description ?? undefined,
      start: event.start?.dateTime || event.start?.date || '',
      end: event.end?.dateTime || event.end?.date || '',
      location: event.location ?? undefined,
      htmlLink: event.htmlLink || '',
    }))
  } catch (error) {
    console.warn('Error fetching today events:', error)
    return []
  }
}
