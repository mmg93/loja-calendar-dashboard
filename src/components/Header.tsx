import { RefreshCw } from 'lucide-react'
import { Emblem } from './Emblem'
import { Button } from './ui/Button'
import { formatLastUpdated } from '../lib/datetime'
import { config } from '../lib/config'

interface HeaderProps {
  lastUpdated: number | null
  isFetching: boolean
  onRefresh: () => void
}

export function Header({ lastUpdated, isFetching, onRefresh }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30">
      <div className="bg-navy-900 text-paper">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="text-brass-300">
              <Emblem className="h-9 w-9 sm:h-10 sm:w-10" />
            </span>
            <div className="leading-tight">
              <p className="font-display text-base uppercase tracking-[0.12em] text-paper sm:text-lg">
                {config.lodgeName}
              </p>
              <p className="text-[10px] uppercase tracking-[0.32em] text-brass-300/80 sm:text-[11px]">
                Agenda de eventos
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-paper/55 sm:inline" aria-live="polite">
              {formatLastUpdated(lastUpdated)}
            </span>
            <Button
              variant="onNavy"
              size="sm"
              onClick={onRefresh}
              disabled={isFetching}
              aria-busy={isFetching}
              aria-label="Atualizar eventos"
            >
              <RefreshCw className={isFetching ? 'h-4 w-4 animate-spin' : 'h-4 w-4'} />
              <span className="hidden sm:inline">Atualizar</span>
            </Button>
          </div>
        </div>
      </div>
      <div className="pavement-band h-[7px]" aria-hidden="true" />
    </header>
  )
}
