import { Clock, MapPin } from 'lucide-react'
import type { CalendarEvent } from '../lib/types'
import { heroDateParts } from '../lib/datetime'

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
    <section aria-label="Resumo da agenda">
      <NextSession event={nextEvent} />
      <Ledger
        items={[
          { label: 'Hoje', value: todayCount },
          { label: 'Esta semana', value: weekCount },
          { label: 'Próximos eventos', value: upcomingCount },
        ]}
      />
    </section>
  )
}

function NextSession({ event }: { event: CalendarEvent | null }) {
  if (!event) {
    return (
      <div className="rounded-xl bg-navy-900 px-6 py-10 text-paper">
        <p className="text-[11px] uppercase tracking-[0.26em] text-brass-300">
          Próxima sessão
        </p>
        <p className="mt-3 text-sm text-paper/60">
          Nenhuma sessão convocada para os próximos dias.
        </p>
      </div>
    )
  }

  const d = heroDateParts(event)

  return (
    <div className="overflow-hidden rounded-xl bg-navy-900 text-paper">
      <div className="flex flex-col sm:flex-row">
        {/* Date — the carved-cornerstone moment */}
        <div className="flex flex-col justify-center px-6 pt-6 pb-2 sm:w-60 sm:shrink-0 sm:px-8 sm:py-8">
          <span className="text-[11px] uppercase tracking-[0.26em] text-brass-300">
            {d.label}
          </span>
          <span className="mt-1 font-display text-7xl leading-[0.9] text-paper sm:text-8xl">
            {d.day}
          </span>
          <span className="mt-2 font-display text-lg text-brass-200">
            {d.month} {d.year}
          </span>
          <span className="mt-1 text-[10px] uppercase tracking-[0.22em] text-paper/55">
            {d.annoLucis} A∴L∴
          </span>
        </div>

        {/* Pavement divider — horizontal on mobile, vertical on desktop */}
        <div
          className="pavement-band mx-6 my-2 h-[6px] sm:mx-0 sm:my-0 sm:h-auto sm:w-[6px]"
          aria-hidden="true"
        />

        {/* Session detail */}
        <div className="flex flex-1 flex-col justify-center px-6 pt-2 pb-6 sm:px-8 sm:py-8">
          <span className="text-[11px] uppercase tracking-[0.26em] text-brass-300">
            Próxima sessão
          </span>
          <h2 className="mt-2 font-display text-2xl leading-snug text-paper line-clamp-2 sm:text-3xl">
            {event.title}
          </h2>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-paper/75">
            <span className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4 shrink-0 text-brass-300" />
              {d.time}
            </span>
            {event.location && (
              <span className="inline-flex min-w-0 items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-brass-300" />
                <span className="truncate">{event.location}</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Ledger({ items }: { items: { label: string; value: number }[] }) {
  return (
    <dl className="mt-3 grid grid-cols-3 divide-x divide-hairline overflow-hidden rounded-lg border border-hairline bg-paper-card">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex flex-col items-center gap-0.5 px-2 py-3 text-center sm:flex-row sm:items-baseline sm:gap-2.5 sm:px-5 sm:text-left"
        >
          <dd className="font-display text-2xl leading-none text-ink">{item.value}</dd>
          <dt className="text-[11px] uppercase tracking-[0.12em] text-ink-faint">
            {item.label}
          </dt>
        </div>
      ))}
    </dl>
  )
}
