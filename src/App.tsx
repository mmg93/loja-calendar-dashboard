import { useMemo, useState } from 'react'
import { Header } from './components/Header'
import { SummaryCards } from './components/SummaryCards'
import { AgendaView } from './components/AgendaView'
import { MonthView } from './components/MonthView'
import { ViewToggle, type CalendarView } from './components/ViewToggle'
import { ConfigNotice, EmptyState, ErrorState, LoadingState } from './components/states'
import { useCalendarEvents } from './hooks/useCalendarEvents'
import { isConfigured } from './lib/config'
import {
  eventDayKey,
  formatLastUpdated,
  isPastEvent,
  isTodayEvent,
  weekEndKey,
} from './lib/datetime'

export function App() {
  const [view, setView] = useState<CalendarView>('agenda')
  const query = useCalendarEvents()
  const events = query.data ?? []
  const lastUpdated = query.dataUpdatedAt || null

  const summary = useMemo(() => {
    const all = query.data ?? []
    const upcoming = all.filter((event) => !isPastEvent(event))
    const weekEnd = weekEndKey()
    return {
      todayCount: all.filter(isTodayEvent).length,
      weekCount: upcoming.filter((event) => eventDayKey(event) <= weekEnd).length,
      upcomingCount: upcoming.length,
      nextEvent: upcoming[0] ?? null,
    }
  }, [query.data])

  return (
    <div className="flex min-h-svh flex-col">
      <Header
        lastUpdated={lastUpdated}
        isFetching={query.isFetching}
        onRefresh={() => query.refetch()}
      />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        {!isConfigured ? (
          <ConfigNotice />
        ) : query.isPending ? (
          <LoadingState />
        ) : query.isError ? (
          <ErrorState
            message={
              query.error instanceof Error
                ? query.error.message
                : 'Erro inesperado ao consultar a agenda.'
            }
            onRetry={() => query.refetch()}
          />
        ) : events.length === 0 ? (
          <EmptyState onRefresh={() => query.refetch()} />
        ) : (
          <>
            <SummaryCards
              todayCount={summary.todayCount}
              weekCount={summary.weekCount}
              upcomingCount={summary.upcomingCount}
              nextEvent={summary.nextEvent}
            />

            <div className="mt-7">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="hidden sm:block">
                  <ViewToggle view={view} onChange={setView} />
                </div>
                <span className="text-xs text-ink-faint sm:hidden">
                  {formatLastUpdated(lastUpdated)}
                </span>
              </div>

              {/* Mobile prioritizes the chronological agenda regardless of toggle. */}
              <div className="sm:hidden">
                <AgendaView events={events} />
              </div>
              <div className="hidden sm:block">
                {view === 'agenda' ? (
                  <AgendaView events={events} />
                ) : (
                  <MonthView events={events} />
                )}
              </div>
            </div>
          </>
        )}
      </main>

      <footer className="mx-auto w-full max-w-6xl px-4 pb-10 sm:px-6">
        <div className="border-t border-hairline pt-5 text-center text-xs text-ink-faint">
          Atualização automática a cada 60 minutos · Eventos públicos do Google Agenda
        </div>
      </footer>
    </div>
  )
}
