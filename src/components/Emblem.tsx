/** Abstract square-and-compasses mark. Inherits color via `currentColor`. */
export function Emblem({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Compasses: hinge at top, legs splaying down */}
      <circle cx="20" cy="8" r="1.7" />
      <path d="M20 9.7 L11 30" />
      <path d="M20 9.7 L29 30" />
      <path d="M9.4 30.2 h3.2" />
      <path d="M27.4 30.2 h3.2" />
      {/* Square: arms opening upward, overlapping the compasses */}
      <path d="M10 19.2 L20 33 L30 19.2" />
    </svg>
  )
}
