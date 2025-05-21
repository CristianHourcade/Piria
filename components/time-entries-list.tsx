"use client"

import { type TimeEntry, formatDuration } from "@/models/time-tracking"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Clock, Calendar, FileText } from "lucide-react"

interface TimeEntriesListProps {
  entries: TimeEntry[]
}

export function TimeEntriesList({ entries }: TimeEntriesListProps) {
  if (entries.length === 0) {
    return <div className="text-sm text-muted-foreground py-2">No hay registros de tiempo para esta tarea.</div>
  }

  return (
    <ScrollArea className="h-[200px] pr-4">
      <div className="space-y-3">
        {entries.map((entry) => (
          <div key={entry.id} className="bg-muted/50 p-3 rounded-md">
            <div className="flex justify-between items-start">
              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-1.5 text-muted-foreground" />
                <span className="font-medium">{formatDuration(entry.duration)}</span>
              </div>
              <div className="text-xs text-muted-foreground">{new Date(entry.startTime).toLocaleDateString()}</div>
            </div>

            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <Calendar className="h-3.5 w-3.5 mr-1.5" />
              <span>
                {new Date(entry.startTime).toLocaleTimeString()} -
                {entry.endTime ? new Date(entry.endTime).toLocaleTimeString() : "En progreso"}
              </span>
            </div>

            {entry.notes && (
              <div className="flex items-start mt-2">
                <FileText className="h-3.5 w-3.5 mr-1.5 mt-0.5 text-muted-foreground" />
                <span className="text-xs">{entry.notes}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
