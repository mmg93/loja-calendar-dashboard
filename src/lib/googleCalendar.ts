import { config, FUTURE_WINDOW_DAYS, PAST_WINDOW_DAYS } from './config'
import type { CalendarEvent } from './types'

interface GoogleDateTime {
  date?: string
  dateTime?: string
  timeZone?: string
}

interface GoogleEvent {
  id: string
  status?: string
  summary?: string
  description?: string
  location?: string
  htmlLink?: string
  start?: GoogleDateTime
  end?: GoogleDateTime
}

interface GoogleEventsResponse {
  items?: GoogleEvent[]
  nextPageToken?: string
  error?: { message?: string; code?: number }
}

const ENDPOINT = 'https://www.googleapis.com/calendar/v3/calendars'

function windowISO(): { timeMin: string; timeMax: string } {
  const now = new Date()
  const min = new Date(now)
  min.setDate(min.getDate() - PAST_WINDOW_DAYS)
  const max = new Date(now)
  max.setDate(max.getDate() + FUTURE_WINDOW_DAYS)
  return { timeMin: min.toISOString(), timeMax: max.toISOString() }
}

/** Strip HTML tags and decode common entities so descriptions render as plain text. */
function cleanText(value: string | undefined): string {
  if (!value) return ''
  return value
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|li)>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function toDate(value: GoogleDateTime, isAllDay: boolean): Date {
  // All-day dates ("YYYY-MM-DD") are anchored to UTC midnight so the calendar
  // day never shifts when displayed. Timed events carry their own offset.
  if (isAllDay && value.date) return new Date(`${value.date}T00:00:00Z`)
  return new Date(value.dateTime as string)
}

function normalize(item: GoogleEvent): CalendarEvent | null {
  if (!item.start || (!item.start.date && !item.start.dateTime)) return null
  const isAllDay = Boolean(item.start.date)
  const start = toDate(item.start, isAllDay)
  const end = toDate(item.end ?? item.start, isAllDay)
  return {
    id: item.id,
    title: cleanText(item.summary) || 'Evento sem título',
    start,
    end,
    location: cleanText(item.location),
    description: cleanText(item.description),
    htmlLink: item.htmlLink ?? '',
    isAllDay,
  }
}

/**
 * Fetch public events directly from the Google Calendar API (no backend).
 * Recurring events are expanded (singleEvents) and ordered by start time.
 * Pagination is followed so large calendars return every event in the window.
 */
export async function fetchCalendarEvents(): Promise<CalendarEvent[]> {
  if (!config.apiKey || !config.calendarId) {
    throw new Error(
      'Configuração ausente. Defina VITE_GOOGLE_API_KEY e VITE_GOOGLE_CALENDAR_ID.',
    )
  }

  const { timeMin, timeMax } = windowISO()
  const url = `${ENDPOINT}/${encodeURIComponent(config.calendarId)}/events`
  const events: CalendarEvent[] = []
  let pageToken: string | undefined

  do {
    const params = new URLSearchParams({
      key: config.apiKey,
      timeMin,
      timeMax,
      singleEvents: 'true',
      orderBy: 'startTime',
      maxResults: '2500',
      timeZone: config.timeZone,
    })
    if (pageToken) params.set('pageToken', pageToken)

    const response = await fetch(`${url}?${params.toString()}`)
    const data: GoogleEventsResponse = await response
      .json()
      .catch(() => ({}) as GoogleEventsResponse)

    if (!response.ok) {
      const message =
        data.error?.message ??
        `Não foi possível consultar a Google Calendar API (HTTP ${response.status}).`
      throw new Error(message)
    }

    for (const item of data.items ?? []) {
      if (item.status === 'cancelled') continue
      const normalized = normalize(item)
      if (normalized) events.push(normalized)
    }

    pageToken = data.nextPageToken
  } while (pageToken)

  events.sort((a, b) => a.start.getTime() - b.start.getTime())
  return events
}
