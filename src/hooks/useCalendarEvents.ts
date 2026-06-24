import { useQuery } from '@tanstack/react-query'
import { fetchCalendarEvents } from '../lib/googleCalendar'
import { POLL_INTERVAL_MS, isConfigured } from '../lib/config'

/** Loads events and re-polls automatically every 60 minutes. */
export function useCalendarEvents() {
  return useQuery({
    queryKey: ['calendar-events'],
    queryFn: fetchCalendarEvents,
    enabled: isConfigured,
    refetchInterval: POLL_INTERVAL_MS,
    refetchIntervalInBackground: true,
  })
}
