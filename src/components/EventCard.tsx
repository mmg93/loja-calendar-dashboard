import { useState } from 'react'
import { ExternalLink, MapPin } from 'lucide-react'
import type { CalendarEvent } from '../lib/types'
import { formatEventTime } from '../lib/datetime'
import { cn } from '../lib/utils'

interface EventCardProps {
  event: CalendarEvent
  muted?: boolean
  highlight?: boolean
}

export function EventCard({ event, muted = false, highlight = false }: EventCardProps) {
  const [expanded, setExpanded] = useState(false)
  const description = event.description
  const isLong = description.length > 140

  return (
    <article
      className={cn(
        'rounded-lg border bg-paper-card p-4 transition-colors',
        muted
          ? 'border-hairline/70 opacity-75'
          : 'border-hairline hover:border-brass/45 hover:shadow-sm',
        highlight && 'border-l-2 border-l-brass',
      )}
    >
      <div className="flex items-baseline justify-between gap-3">
        <span
          className={cn(
            'font-display text-sm tracking-wide tabular-nums',
            muted ? 'text-ink-faint' : 'text-brass-700',
          )}
        >
          {formatEventTime(event)}
        </span>
      </div>

      <h3 className="mt-1 text-[15px] font-semibold leading-snug text-ink wrap-anywhere">
        {event.title}
      </h3>

      {event.location && (
        <p className="mt-1.5 inline-flex items-start gap-1.5 text-[13px] text-ink-soft">
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-faint" />
          <span className="wrap-anywhere">{event.location}</span>
        </p>
      )}

      {description && (
        <p
          className={cn(
            'mt-2 text-[13px] leading-relaxed whitespace-pre-line text-ink-soft wrap-anywhere',
            !expanded && 'line-clamp-2',
          )}
        >
          {description}
        </p>
      )}

      <div className="mt-2.5 flex items-center gap-4">
        {description && isLong && (
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            aria-expanded={expanded}
            className="text-[12px] font-medium text-brass-700 underline-offset-2 hover:underline"
          >
            {expanded ? 'Ver menos' : 'Ver mais'}
          </button>
        )}
        {event.htmlLink && (
          <a
            href={event.htmlLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[12px] font-medium text-ink-faint hover:text-brass-700"
          >
            Ver no Google Agenda
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    </article>
  )
}
