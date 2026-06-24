/**
 * Runtime configuration, read from public Vite env vars.
 *
 * Every VITE_* value is embedded into the built JavaScript and is therefore
 * PUBLIC. Treat VITE_GOOGLE_API_KEY as public and restrict it in the Google
 * Cloud Console (HTTP referrers + Calendar API only). Never put OAuth client
 * secrets, refresh tokens or service-account JSON here.
 */
export const config = {
  apiKey: (import.meta.env.VITE_GOOGLE_API_KEY ?? '').trim(),
  calendarId: (import.meta.env.VITE_GOOGLE_CALENDAR_ID ?? '').trim(),
  timeZone: (import.meta.env.VITE_GOOGLE_TIMEZONE || 'America/Sao_Paulo').trim(),
  lodgeName: (import.meta.env.VITE_LODGE_NAME || 'Loja Maçônica').trim(),
} as const

/** True only when the calendar can actually be queried. */
export const isConfigured = Boolean(config.apiKey && config.calendarId)

/** Event window: 30 days before today until 180 days after today. */
export const PAST_WINDOW_DAYS = 30
export const FUTURE_WINDOW_DAYS = 180

/** Automatic polling interval: 60 minutes = 60 * 60 * 1000 ms. */
export const POLL_INTERVAL_MS = 60 * 60 * 1000
