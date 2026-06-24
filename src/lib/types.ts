/** Normalized event used across the UI. */
export interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  location: string
  description: string
  htmlLink: string
  isAllDay: boolean
}
