/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Public Google API key, restricted by HTTP referrer + Calendar API only. */
  readonly VITE_GOOGLE_API_KEY?: string
  /** Public Google Calendar ID (e.g. abc123@group.calendar.google.com). */
  readonly VITE_GOOGLE_CALENDAR_ID?: string
  /** IANA timezone used to display event times (e.g. America/Sao_Paulo). */
  readonly VITE_GOOGLE_TIMEZONE?: string
  /** Display name shown in the header. */
  readonly VITE_LODGE_NAME?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
