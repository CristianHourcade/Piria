"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Play, Pause, Clock, Save } from "lucide-react"
import { type TimeEntry, formatDuration } from "@/models/time-tracking"

interface TimeTrackerProps {
  taskId: number
  timeEntries: TimeEntry[]
  onTimeEntryAdded: (entry: TimeEntry) => void
  onTimeEntryUpdated: (entry: TimeEntry) => void
}

export function TimeTracker({ taskId, timeEntries, onTimeEntryAdded, onTimeEntryUpdated }: TimeTrackerProps) {
  const [isTracking, setIsTracking] = useState(false)
  const [currentEntry, setCurrentEntry] = useState<TimeEntry | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [notes, setNotes] = useState("")
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<Date | null>(null)

  // Check if there's an active entry when component mounts
  useEffect(() => {
    const activeEntry = timeEntries.find((entry) => !entry.endTime)
    if (activeEntry) {
      setIsTracking(true)
      setCurrentEntry(activeEntry)
      startTimeRef.current = new Date(activeEntry.startTime)

      // Calculate elapsed time
      const elapsed = activeEntry.duration + (new Date().getTime() - new Date(activeEntry.startTime).getTime())
      setElapsedTime(elapsed)

      // Start timer
      startTimer()
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [timeEntries])

  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    timerRef.current = setInterval(() => {
      if (startTimeRef.current) {
        const now = new Date()
        const elapsed = now.getTime() - startTimeRef.current.getTime()
        setElapsedTime((prev) => {
          // If we have a current entry with duration, add that as base
          if (currentEntry) {
            return currentEntry.duration + elapsed
          }
          return elapsed
        })
      }
    }, 1000)
  }

  const handleStartTracking = () => {
    const now = new Date()
    startTimeRef.current = now

    const newEntry: TimeEntry = {
      id: Date.now(), // Use timestamp as temporary ID
      taskId,
      startTime: now.toISOString(),
      duration: 0,
    }

    setCurrentEntry(newEntry)
    setIsTracking(true)
    setElapsedTime(0)
    onTimeEntryAdded(newEntry)
    startTimer()
  }

  const handleStopTracking = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    if (currentEntry) {
      const now = new Date()
      const updatedEntry: TimeEntry = {
        ...currentEntry,
        endTime: now.toISOString(),
        duration: elapsedTime,
        notes: notes || undefined,
      }

      onTimeEntryUpdated(updatedEntry)
      setCurrentEntry(null)
      setNotes("")
    }

    setIsTracking(false)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Tiempo registrado</span>
        </div>
        <div className="text-sm font-mono">{formatDuration(elapsedTime)}</div>
      </div>

      <div className="flex items-center space-x-2">
        {isTracking ? (
          <Button variant="outline" size="sm" className="flex-1" onClick={handleStopTracking}>
            <Pause className="h-4 w-4 mr-2" />
            Detener tiempo
          </Button>
        ) : (
          <Button variant="outline" size="sm" className="flex-1" onClick={handleStartTracking}>
            <Play className="h-4 w-4 mr-2" />
            Iniciar tiempo
          </Button>
        )}
      </div>

      {isTracking && (
        <div className="space-y-2">
          <Input
            placeholder="Notas (opcional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="text-sm"
          />
          <Button variant="secondary" size="sm" className="w-full" onClick={handleStopTracking}>
            <Save className="h-4 w-4 mr-2" />
            Guardar entrada
          </Button>
        </div>
      )}
    </div>
  )
}
