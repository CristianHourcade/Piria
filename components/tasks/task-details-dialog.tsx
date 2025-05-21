"use client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TimeTracker } from "@/components/time-tracker"
import { TimeEntriesList } from "@/components/time-entries-list"
import { calculateTotalDuration, formatDuration, type TimeEntry } from "@/models/time-tracking"
import { PlayCircle, PauseCircle, CheckCircle } from "lucide-react"
import { getPriorityColor, getStatusInfo } from "@/utils/task-view-utils"

interface TaskDetailsDialogProps {
  selectedTask: any
  onClose: () => void
  onStartTask: (id: number) => void
  onCompleteTask: (id: number) => void
  onPauseTask: (id: number) => void
  onToggleManualPriority: (id: number) => void
  onAssignTask: (id: number, collaboratorName: string) => void
  onAddTimeEntry: (taskId: number, entry: TimeEntry) => void
  onUpdateTimeEntry: (taskId: number, entry: TimeEntry) => void
  collaborators: Array<{ id: number; name: string; initial: string }>
}

export function TaskDetailsDialog({
  selectedTask,
  onClose,
  onStartTask,
  onCompleteTask,
  onPauseTask,
  onToggleManualPriority,
  onAssignTask,
  onAddTimeEntry,
  onUpdateTimeEntry,
  collaborators,
}: TaskDetailsDialogProps) {
  if (!selectedTask) return null

  return (
    <Dialog open={!!selectedTask} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{selectedTask.title}</DialogTitle>
          <DialogDescription>Detalles de la tarea</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Detalles</TabsTrigger>
            <TabsTrigger value="time">Tiempo</TabsTrigger>
            <TabsTrigger value="comments">Comentarios</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium">Cliente</h4>
                <p className="text-sm">{selectedTask.client}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Servicio</h4>
                <p className="text-sm">{selectedTask.service}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <h4 className="text-sm font-medium">Fecha Límite</h4>
                <p className="text-sm">{new Date(selectedTask.dueDate).toLocaleDateString()}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Prioridad</h4>
                <Badge className={getPriorityColor(selectedTask.priority)}>{selectedTask.priority}</Badge>
              </div>
              <div>
                <h4 className="text-sm font-medium">Estado</h4>
                <Badge className={getStatusInfo(selectedTask.status).color}>
                  <span className="flex items-center">
                    {getStatusInfo(selectedTask.status).icon}
                    <span>{selectedTask.status}</span>
                  </span>
                </Badge>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium">Descripción</h4>
              <p className="text-sm mt-1">{selectedTask.description}</p>
            </div>

            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Priorización manual</h4>
              <Switch
                checked={selectedTask.manuallyPrioritized}
                onCheckedChange={() => onToggleManualPriority(selectedTask.id)}
                id="manual-priority-task"
              />
            </div>

            <div>
              <h4 className="text-sm font-medium">Asignar a</h4>
              <div className="mt-2">
                <Select
                  defaultValue={selectedTask.assignee}
                  onValueChange={(value) => onAssignTask(selectedTask.id, value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar colaborador" />
                  </SelectTrigger>
                  <SelectContent>
                    {collaborators.map((collaborator) => (
                      <SelectItem key={collaborator.id} value={collaborator.name}>
                        <div className="flex items-center">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                              {collaborator.initial}
                            </AvatarFallback>
                          </Avatar>
                          {collaborator.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="time" className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Tiempo total registrado</h4>
              <div className="text-lg font-mono">
                {formatDuration(calculateTotalDuration(selectedTask.timeEntries))}
              </div>
            </div>

            <div className="space-y-4">
              <TimeTracker
                taskId={selectedTask.id}
                timeEntries={selectedTask.timeEntries}
                onTimeEntryAdded={(entry) => onAddTimeEntry(selectedTask.id, entry)}
                onTimeEntryUpdated={(entry) => onUpdateTimeEntry(selectedTask.id, entry)}
              />

              <div className="pt-2">
                <h4 className="text-sm font-medium mb-2">Historial de tiempo</h4>
                <TimeEntriesList entries={selectedTask.timeEntries} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="comments" className="space-y-4 pt-4">
            <h4 className="text-sm font-medium">Comentarios</h4>
            {selectedTask.comments.length === 0 ? (
              <p className="text-sm text-muted-foreground mt-1">No hay comentarios</p>
            ) : (
              <div className="space-y-3 mt-2">
                {selectedTask.comments.map((comment: any, index: number) => (
                  <div key={index} className="bg-muted p-3 rounded-md">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{comment.author}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(comment.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm mt-1">{comment.text}</p>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex justify-end space-x-2">
          {selectedTask.status === "Pendiente" && (
            <Button
              onClick={() => {
                onStartTask(selectedTask.id)
                onClose()
              }}
            >
              <PlayCircle className="h-4 w-4 mr-1" />
              Iniciar Tarea
            </Button>
          )}

          {selectedTask.status === "En Progreso" && (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  onPauseTask(selectedTask.id)
                  onClose()
                }}
              >
                <PauseCircle className="h-4 w-4 mr-1" />
                Pausar
              </Button>
              <Button
                onClick={() => {
                  onCompleteTask(selectedTask.id)
                  onClose()
                }}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Completar
              </Button>
            </>
          )}

          {selectedTask.status === "Pausada" && (
            <Button
              onClick={() => {
                onStartTask(selectedTask.id)
                onClose()
              }}
            >
              <PlayCircle className="h-4 w-4 mr-1" />
              Reanudar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
