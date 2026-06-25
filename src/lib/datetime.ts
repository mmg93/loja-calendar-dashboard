import { addDays, endOfWeek, format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { formatInTimeZone } from 'date-fns-tz'
import { config } from './config'
import type { CalendarEvent } from './types'

const TZ = config.timeZone

/** All-day events are stored in UTC; timed events display in the lodge timezone. */
function zoneOf(event: CalendarEvent): string {
  return event.isAllDay ? 'UTC' : TZ
}

/** "YYYY-MM-DD" for an arbitrary date, in the lodge timezone. */
export function tzDayKey(date: Date): string {
  return formatInTimeZone(date, TZ, 'yyyy-MM-dd')
}

export function todayKey(): string {
  return tzDayKey(new Date())
}

/** Calendar day an event belongs to ("YYYY-MM-DD"). */
export function eventDayKey(event: CalendarEvent): string {
  return formatInTimeZone(event.start, zoneOf(event), 'yyyy-MM-dd')
}

/** All-day end is exclusive in the Google API (the day after the last day). */
function allDayEndExclusiveKey(event: CalendarEvent): string {
  return formatInTimeZone(event.end, 'UTC', 'yyyy-MM-dd')
}

export function isPastEvent(event: CalendarEvent): boolean {
  if (event.isAllDay) return allDayEndExclusiveKey(event) <= todayKey()
  return event.end.getTime() < Date.now()
}

export function isTodayEvent(event: CalendarEvent): boolean {
  const today = todayKey()
  if (event.isAllDay) {
    return eventDayKey(event) <= today && today < allDayEndExclusiveKey(event)
  }
  return eventDayKey(event) === today
}

/** Last day (inclusive) of the current week, Sunday-based, as "YYYY-MM-DD". */
export function weekEndKey(): string {
  return format(endOfWeek(parseISO(todayKey()), { weekStartsOn: 0 }), 'yyyy-MM-dd')
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

/** Time range label: "19:00 – 21:00", "19:00" or "Dia inteiro". */
export function formatEventTime(event: CalendarEvent): string {
  if (event.isAllDay) return 'Dia inteiro'
  const start = formatInTimeZone(event.start, TZ, 'HH:mm')
  const sameDay = eventDayKey(event) === formatInTimeZone(event.end, TZ, 'yyyy-MM-dd')
  const end = formatInTimeZone(event.end, TZ, 'HH:mm')
  if (!sameDay || end === start) return start
  return `${start} – ${end}`
}

/** Pieces used to render the "cornerstone" date marker. */
export function dayMarkerParts(dayKey: string) {
  const date = parseISO(dayKey)
  return {
    weekday: capitalize(format(date, 'EEEEEE', { locale: ptBR }).replace('.', '')),
    weekdayLong: capitalize(format(date, 'EEEE', { locale: ptBR })),
    day: format(date, 'dd'),
    month: format(date, 'MMM', { locale: ptBR }).replace('.', '').toUpperCase(),
  }
}

export function relativeDayLabel(dayKey: string): string | null {
  const today = todayKey()
  if (dayKey === today) return 'Hoje'
  if (dayKey === format(addDays(parseISO(today), 1), 'yyyy-MM-dd')) return 'Amanhã'
  return null
}

/** Pieces for the prominent next-session date block (incl. Anno Lucis year). */
export function heroDateParts(event: CalendarEvent) {
  const key = eventDayKey(event)
  const date = parseISO(key)
  const year = Number(format(date, 'yyyy'))
  return {
    label: relativeDayLabel(key) ?? capitalize(format(date, 'EEEE', { locale: ptBR })),
    day: format(date, 'd'),
    month: capitalize(format(date, 'MMMM', { locale: ptBR })),
    year,
    annoLucis: year + 4000,
    time: formatEventTime(event),
  }
}

export function formatLastUpdated(timestamp: number | null): string {
  if (!timestamp) return 'Sincronizando…'
  return `Atualizado às ${formatInTimeZone(new Date(timestamp), TZ, 'HH:mm')}`
}

/** Long, human date for agenda day headers: "Quarta-feira, 25 de junho de 2026". */
export function formatDayHeading(dayKey: string): string {
  return capitalize(format(parseISO(dayKey), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR }))
}
