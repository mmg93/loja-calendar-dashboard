import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { Emblem } from './Emblem'
import { Button } from './ui/Button'
import { formatLastUpdated } from '../lib/datetime'

interface HeaderProps {
  lastUpdated: number | null
  isFetching: boolean
  onRefresh: () => void
}

// Place the lodge seal at public/logo-beitel.png. Until then, the square-and-
// compasses mark is shown as a graceful fallback (no broken image).
const LOGO_SRC = `${import.meta.env.BASE_URL}logo-beitel.png`

export function Header({ lastUpdated, isFetching, onRefresh }: HeaderProps) {
  const [logoFailed, setLogoFailed] = useState(false)

  return (
    <header className="sticky top-0 z-30">
      <div className="bg-navy-900 text-paper">
        <div className="mx-auto flex max-w-6xl items-start justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md bg-paper-card ring-1 ring-brass/30 sm:h-[4.5rem] sm:w-[4.5rem]">
              {logoFailed ? (
                <span className="text-brass-600">
                  <Emblem className="h-9 w-9 sm:h-11 sm:w-11" />
                </span>
              ) : (
                <img
                  src={LOGO_SRC}
                  alt="Selo da A∴R∴L∴S∴ Beit-El"
                  className="h-full w-full object-contain p-1"
                  onError={() => setLogoFailed(true)}
                />
              )}
            </div>

            <div className="leading-tight">
              <p className="font-display text-lg uppercase tracking-[0.07em] text-paper sm:text-2xl">
                A∴ R∴ L∴ S∴ Beit-El
              </p>
              <p className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.16em] text-brass-300">
                nº 1788 · R∴ E∴ A∴ A∴
              </p>
              <p className="mt-1 hidden text-xs text-paper/55 sm:block">
                Fundada em 31 de julho de 1970
              </p>
              <p className="hidden text-[11px] text-paper/45 sm:block">
                Jurisdicionada ao Grande Oriente do Brasil de São Paulo · Federada ao
                Grande Oriente do Brasil
              </p>
            </div>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-2">
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
