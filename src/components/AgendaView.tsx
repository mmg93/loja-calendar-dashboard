import { useMemo } from 'react'
import type { CalendarEvent } from '../lib/types'
import {
  dayMarkerParts,
  eventDayKey,
  formatDayHeading,
  isPastEvent,
  isTodayEvent,
  relativeDayLabel,
  todayKey,
} from '../lib/datetime'
import { cn } from '../lib/utils'
import { EventCard } from './EventCard'

interface DayGroup {
  key: string
  events: CalendarEvent[]
}

function groupByDay(events: CalendarEvent[]): DayGroup[] {
  const groups = new Map<string, CalendarEvent[]>()
  for (const event of events) {
    const key = eventDayKey(event)
    const bucket = groups.get(key)
    if (bucket) bucket.push(event)
    else groups.set(key, [event])
  }
  return [...groups.entries()].map(([key, items]) => ({ key, events: items }))
}

export function AgendaView({ events }: { events: CalendarEvent[] }) {
  const { upcomingGroups, pastGroups } = useMemo(() => {
    const upcoming: CalendarEvent[] = []
    const past: CalendarEvent[] = []
    for (const event of events) {
      if (isPastEvent(event)) past.push(event)
      else upcoming.push(event)
    }
    const pastGroups = groupByDay(past).reverse()
    for (const group of pastGroups) group.events.reverse()
    return { upcomingGroups: groupByDay(upcoming), pastGroups }
  }, [events])

  return (
    <div>
      {pastGroups.length > 0 && (
        <details className="mb-6 overflow-hidden rounded-lg border border-hairline bg-paper/50">
          <summary className="flex cursor-pointer select-none items-center justify-between px-4 py-3 text-sm font-medium text-ink-soft marker:content-none hover:text-ink">
            Eventos recentes
            <span className="text-xs text-ink-faint">{pastGroups.length} dia(s)</span>
          </summary>
          <div className="space-y-6 px-4 pb-5">
            {pastGroups.map((group) => (
              <DayRow key={group.key} group={group} muted />
            ))}
          </div>
        </details>
      )}

      {upcomingGroups.length > 0 ? (
        <div className="space-y-7">
          {upcomingGroups.map((group) => (
            <DayRow key={group.key} group={group} />
          ))}
        </div>
      ) : (
        <p className="rounded-lg border border-dashed border-hairline bg-paper-card px-5 py-10 text-center text-sm text-ink-faint">
          Nenhum evento futuro agendado no momento.
        </p>
      )}
    </div>
  )
}

function DayRow({ group, muted = false }: { group: DayGroup; muted?: boolean }) {
  const parts = dayMarkerParts(group.key)
  const isToday = group.key === todayKey()
  const relative = relativeDayLabel(group.key)

  return (
    <div className="flex gap-3 sm:gap-4">
      <div
        className={cn(
          'flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-md border text-center',
          isToday
            ? 'border-brass bg-brass-50 text-navy-900'
            : muted
              ? 'border-hairline/70 bg-paper-card text-ink-faint'
              : 'border-hairline bg-paper-card text-ink',
        )}
      >
        <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-ink-faint">
          {parts.weekday}
        </span>
        <span className="font-display text-2xl leading-none">{parts.day}</span>
        <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-ink-faint">
          {parts.month}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-2 flex flex-wrap items-baseline gap-x-2">
          <h3 className="text-sm font-semibold text-ink">
            {relative ?? formatDayHeading(group.key)}
          </h3>
          {relative && (
            <span className="text-xs text-ink-faint">{formatDayHeading(group.key)}</span>
          )}
        </div>
        <div className="space-y-2.5">
          {group.events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              muted={muted}
              highlight={!muted && isTodayEvent(event)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
