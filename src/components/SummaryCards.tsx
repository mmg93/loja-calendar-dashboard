import type { ReactNode } from 'react'
import { CalendarDays, CalendarRange, Clock, MapPin } from 'lucide-react'
import type { CalendarEvent } from '../lib/types'
import { formatEventWhen } from '../lib/datetime'
import { cn } from '../lib/utils'

interface SummaryCardsProps {
  todayCount: number
  weekCount: number
  upcomingCount: number
  nextEvent: CalendarEvent | null
}

export function SummaryCards({
  todayCount,
  weekCount,
  upcomingCount,
  nextEvent,
}: SummaryCardsProps) {
  return (
    <section className="grid gap-3 lg:grid-cols-12" aria-label="Resumo da agenda">
      <NextSessionCard event={nextEvent} className="lg:col-span-5" />
      <div className="grid grid-cols-3 gap-3 lg:col-span-7">
        <Stat icon={<Clock className="h-4 w-4" />} label="Hoje" value={todayCount} />
        <Stat
          icon={<CalendarRange className="h-4 w-4" />}
          label="Esta semana"
          value={weekCount}
        />
        <Stat
          icon={<CalendarDays className="h-4 w-4" />}
          label="Próximos"
          value={upcomingCount}
        />
      </div>
    </section>
  )
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: number
}) {
  return (
    <div className="flex flex-col justify-between rounded-lg border border-hairline bg-paper-card p-4">
      <span className="text-brass-600">{icon}</span>
      <div className="mt-4">
        <p className="font-display text-3xl leading-none text-ink sm:text-4xl">{value}</p>
        <p className="mt-1.5 text-[11px] uppercase tracking-[0.16em] text-ink-faint">
          {label}
        </p>
      </div>
    </div>
  )
}

function NextSessionCard({
  event,
  className,
}: {
  event: CalendarEvent | null
  className?: string
}) {
  return (
    <div
      className={cn(
        'relative flex flex-col overflow-hidden rounded-lg bg-navy-900 p-5 text-paper',
        className,
      )}
    >
      <p className="text-[11px] uppercase tracking-[0.28em] text-brass-300">
        Próxima sessão
      </p>

      {event ? (
        <div className="mt-3 flex flex-1 flex-col">
          <h2 className="font-display text-xl leading-snug text-paper line-clamp-2">
            {event.title}
          </h2>
          <p className="mt-2 inline-flex items-center gap-2 text-sm text-brass-200">
            <Clock className="h-4 w-4 shrink-0" />
            {formatEventWhen(event)}
          </p>
          {event.location && (
            <p className="mt-1 inline-flex items-start gap-2 text-sm text-paper/65">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              <span className="line-clamp-1">{event.location}</span>
            </p>
          )}
        </div>
      ) : (
        <p className="mt-3 flex-1 text-sm text-paper/60">
          Nenhuma sessão agendada nos próximos dias.
        </p>
      )}

      <div className="pavement-band -mx-5 -mb-5 mt-5 h-1.5" aria-hidden="true" />
    </div>
  )
}
