// Time tracking model for tasks
export interface TimeEntry {
  id: number
  taskId: number
  startTime: string // ISO string
  endTime?: string // ISO string, undefined if timer is still running
  duration: number // in milliseconds
  notes?: string
}

// Helper functions for time tracking
export function formatDuration(milliseconds: number): string {
  if (milliseconds < 0) milliseconds = 0

  const seconds = Math.floor((milliseconds / 1000) % 60)
  const minutes = Math.floor((milliseconds / (1000 * 60)) % 60)
  const hours = Math.floor(milliseconds / (1000 * 60 * 60))

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
}

export function calculateTotalDuration(entries: TimeEntry[]): number {
  return entries.reduce((total, entry) => {
    return total + entry.duration
  }, 0)
}
