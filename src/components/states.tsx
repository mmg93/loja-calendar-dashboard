import type { ReactNode } from 'react'
import { AlertTriangle, CalendarOff, Landmark, RefreshCw } from 'lucide-react'
import { Button } from './ui/Button'
import { Skeleton } from './ui/Skeleton'

export function LoadingState() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Carregando eventos">
      <div className="grid gap-3 lg:grid-cols-12">
        <Skeleton className="h-40 lg:col-span-5" />
        <div className="grid grid-cols-3 gap-3 lg:col-span-7">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
      </div>
      <div className="space-y-7">
        {[0, 1, 2].map((row) => (
          <div key={row} className="flex gap-3 sm:gap-4">
            <Skeleton className="h-16 w-16 shrink-0" />
            <div className="flex-1 space-y-2.5">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

interface ErrorStateProps {
  message: string
  onRetry: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <Panel
      icon={<AlertTriangle className="h-6 w-6" />}
      title="Não foi possível carregar a agenda"
    >
      <p className="mx-auto max-w-md text-sm text-ink-soft">{message}</p>
      <Button variant="brass" size="sm" onClick={onRetry} className="mt-5">
        <RefreshCw className="h-4 w-4" />
        Tentar novamente
      </Button>
    </Panel>
  )
}

export function EmptyState({ onRefresh }: { onRefresh: () => void }) {
  return (
    <Panel icon={<CalendarOff className="h-6 w-6" />} title="Nenhum evento público">
      <p className="mx-auto max-w-md text-sm text-ink-soft">
        Não há eventos entre 30 dias atrás e o próximo ano. Novos eventos do
        Google Agenda aparecerão aqui automaticamente.
      </p>
      <Button variant="outline" size="sm" onClick={onRefresh} className="mt-5">
        <RefreshCw className="h-4 w-4" />
        Atualizar
      </Button>
    </Panel>
  )
}

export function ConfigNotice() {
  return (
    <Panel icon={<Landmark className="h-6 w-6" />} title="Configuração necessária">
      <p className="mx-auto max-w-md text-sm text-ink-soft">
        Defina as variáveis de ambiente abaixo (em <code className="rounded bg-ink/5 px-1 py-0.5 text-[13px]">.env.local</code> no
        desenvolvimento, ou nas configurações do repositório para o deploy) e recarregue a
        página.
      </p>
      <ul className="mx-auto mt-4 max-w-xs space-y-1.5 text-left text-[13px] text-ink-soft">
        <li className="rounded bg-ink/[0.04] px-3 py-1.5 font-mono">VITE_GOOGLE_API_KEY</li>
        <li className="rounded bg-ink/[0.04] px-3 py-1.5 font-mono">VITE_GOOGLE_CALENDAR_ID</li>
        <li className="rounded bg-ink/[0.04] px-3 py-1.5 font-mono">VITE_GOOGLE_TIMEZONE</li>
      </ul>
      <p className="mt-4 text-xs text-ink-faint">Consulte o README para o passo a passo.</p>
    </Panel>
  )
}

function Panel({
  icon,
  title,
  children,
}: {
  icon: ReactNode
  title: string
  children: ReactNode
}) {
  return (
    <div className="rounded-lg border border-hairline bg-paper-card px-6 py-12 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brass-50 text-brass-700">
        {icon}
      </div>
      <h2 className="font-display text-lg text-ink">{title}</h2>
      <div className="mt-2">{children}</div>
    </div>
  )
}
