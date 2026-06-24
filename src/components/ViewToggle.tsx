import { CalendarDays, List } from 'lucide-react'
import { cn } from '../lib/utils'

export type CalendarView = 'agenda' | 'mes'

interface ViewToggleProps {
  view: CalendarView
  onChange: (view: CalendarView) => void
}

const options: { value: CalendarView; label: string; icon: typeof List }[] = [
  { value: 'agenda', label: 'Agenda', icon: List },
  { value: 'mes', label: 'Mês', icon: CalendarDays },
]

export function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div className="inline-flex rounded-md border border-hairline bg-paper-card p-0.5">
      {options.map(({ value, label, icon: Icon }) => {
        const active = view === value
        return (
          <button
            key={value}
            type="button"
            onClick={() => onChange(value)}
            aria-pressed={active}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-[5px] px-3 py-1.5 text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass',
              active
                ? 'bg-navy-900 text-paper'
                : 'text-ink-soft hover:text-ink',
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        )
      })}
    </div>
  )
}
