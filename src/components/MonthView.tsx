import { useMemo, useState } from 'react'
import {
  addDays,
  addMonths,
  format,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { CalendarEvent } from '../lib/types'
import { eventDayKey, formatDayHeading, isPastEvent, todayKey } from '../lib/datetime'
import { cn } from '../lib/utils'
import { Button } from './ui/Button'
import { EventCard } from './EventCard'

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

export function MonthView({ events }: { events: CalendarEvent[] }) {
  const today = todayKey()
  const [cursor, setCursor] = useState(() => parseISO(today))
  const [selectedKey, setSelectedKey] = useState(today)

  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>()
    for (const event of events) {
      const key = eventDayKey(event)
      const bucket = map.get(key)
      if (bucket) bucket.push(event)
      else map.set(key, [event])
    }
    return map
  }, [events])

  const cells = useMemo(() => {
    const gridStart = startOfWeek(startOfMonth(cursor), { weekStartsOn: 0 })
    return Array.from({ length: 42 }, (_, index) => addDays(gridStart, index))
  }, [cursor])

  const selectedEvents = eventsByDay.get(selectedKey) ?? []
  const rawMonth = format(cursor, "MMMM 'de' yyyy", { locale: ptBR })
  const monthLabel = rawMonth.charAt(0).toUpperCase() + rawMonth.slice(1)

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-display text-xl text-ink sm:text-2xl">{monthLabel}</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="px-2"
            aria-label="Mês anterior"
            onClick={() => setCursor((value) => addMonths(value, -1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setCursor(parseISO(today))
              setSelectedKey(today)
            }}
          >
            Hoje
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="px-2"
            aria-label="Próximo mês"
            onClick={() => setCursor((value) => addMonths(value, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-hairline bg-paper-card">
        <div className="grid grid-cols-7 border-b border-hairline bg-paper/60">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="px-1 py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-ink-faint"
            >
              <span className="sm:hidden">{day.charAt(0)}</span>
              <span className="hidden sm:inline">{day}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {cells.map((date) => {
            const key = format(date, 'yyyy-MM-dd')
            const dayEvents = eventsByDay.get(key) ?? []
            const inMonth = isSameMonth(date, cursor)
            const isToday = key === today
            const isSelected = key === selectedKey

            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedKey(key)}
                aria-pressed={isSelected}
                aria-label={`${format(date, "d 'de' MMMM", { locale: ptBR })}, ${dayEvents.length} evento(s)`}
                className={cn(
                  'min-h-15 border-b border-r border-hairline p-1.5 text-left align-top transition-colors last:border-r-0 focus-visible:relative focus-visible:z-10 sm:min-h-24',
                  inMonth ? 'bg-paper-card' : 'bg-paper/40 text-ink-faint',
                  isSelected ? 'bg-navy-900/[0.04] ring-1 ring-inset ring-navy-900/20' : 'hover:bg-brass-50/60',
                )}
              >
                <span
                  className={cn(
                    'inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium',
                    isToday && 'bg-brass text-navy-950',
                    !isToday && inMonth && 'text-ink',
                    !isToday && !inMonth && 'text-ink-faint',
                  )}
                >
                  {format(date, 'd')}
                </span>

                {dayEvents.length > 0 && (
                  <>
                    <div className="mt-1 flex gap-1 sm:hidden">
                      {dayEvents.slice(0, 3).map((event) => (
                        <span
                          key={event.id}
                          className={cn(
                            'h-1.5 w-1.5 rounded-full',
                            isPastEvent(event) ? 'bg-ink-faint/50' : 'bg-brass',
                          )}
                        />
                      ))}
                    </div>
                    <div className="mt-1 hidden flex-col gap-1 sm:flex">
                      {dayEvents.slice(0, 2).map((event) => (
                        <span
                          key={event.id}
                          className={cn(
                            'truncate rounded px-1 py-0.5 text-[11px] leading-tight',
                            isPastEvent(event)
                              ? 'bg-ink/[0.04] text-ink-faint'
                              : 'bg-brass-50 text-brass-700',
                          )}
                        >
                          {event.title}
                        </span>
                      ))}
                      {dayEvents.length > 2 && (
                        <span className="px-1 text-[11px] text-ink-faint">
                          +{dayEvents.length - 2} mais
                        </span>
                      )}
                    </div>
                  </>
                )}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-5">
        <h3 className="mb-3 text-sm font-semibold text-ink">{formatDayHeading(selectedKey)}</h3>
        {selectedEvents.length > 0 ? (
          <div className="space-y-2.5">
            {selectedEvents.map((event) => (
              <EventCard key={event.id} event={event} muted={isPastEvent(event)} />
            ))}
          </div>
        ) : (
          <p className="rounded-lg border border-dashed border-hairline bg-paper-card px-5 py-8 text-center text-sm text-ink-faint">
            Sem eventos neste dia.
          </p>
        )}
      </div>
    </div>
  )
}
