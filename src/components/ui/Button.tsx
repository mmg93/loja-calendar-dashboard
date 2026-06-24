import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

type Variant = 'brass' | 'onNavy' | 'outline' | 'ghost'
type Size = 'sm' | 'md'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

const variants: Record<Variant, string> = {
  brass:
    'bg-brass text-navy-950 hover:bg-brass-300 shadow-sm focus-visible:ring-offset-paper',
  onNavy:
    'border border-white/15 bg-white/[0.06] text-paper hover:bg-white/[0.12] focus-visible:ring-offset-navy-900',
  outline:
    'border border-hairline bg-paper-card text-ink-soft hover:text-ink hover:border-brass/60 focus-visible:ring-offset-paper',
  ghost: 'text-ink-soft hover:text-ink hover:bg-ink/5 focus-visible:ring-offset-paper',
}

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3 text-[13px]',
  md: 'h-10 px-4 text-sm',
}

export function Button({
  variant = 'outline',
  size = 'md',
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md font-medium tracking-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-55',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  )
}
