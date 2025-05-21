"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, AlertTriangle, Timer, PlayCircle, CheckCircle, Eye, GripVertical } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { calculatePriorityScore } from "@/utils/task-prioritization"
import { formatDuration, calculateTotalDuration } from "@/models/time-tracking"
import { Draggable } from "react-beautiful-dnd"
import { getStatusInfo, isTaskOverdue } from "@/utils/task-view-utils"

interface TaskCardViewProps {
  tasks: any[]
  manualPrioritizationEnabled: boolean
  onViewDetails: (task: any) => void
  onStartTask: (id: number) => void
  onCompleteTask: (id: number) => void
  onPauseTask: (id: number) => void
}

export function TaskCardView({
  tasks,
  manualPrioritizationEnabled,
  onViewDetails,
  onStartTask,
  onCompleteTask,
  onPauseTask,
}: TaskCardViewProps) {
  if (tasks.length === 0) {
    return (
      <div className="col-span-full text-center py-8 text-muted-foreground bg-card rounded-lg border">
        No hay tareas que coincidan con el filtro seleccionado
      </div>
    )
  }

  return (
    <>
      {tasks.map((task, index) => {
        const { color, icon } = getStatusInfo(task.status)
        const isOverdue = isTaskOverdue(task.dueDate)
        const priorityScore = calculatePriorityScore(task.priority, task.dueDate)
        const totalTime = calculateTotalDuration(task.timeEntries)

        return (
          <Draggable
            key={task.id.toString()}
            draggableId={task.id.toString()}
            index={index}
            isDragDisabled={!manualPrioritizationEnabled}
          >
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                className={`${snapshot.isDragging ? "opacity-70" : ""}`}
              >
                <Card
                  className={`overflow-hidden ${task.manuallyPrioritized ? "border-2 border-blue-500 dark:border-blue-400" : ""}`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        {manualPrioritizationEnabled && (
                          <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing">
                            <GripVertical className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                        <CardTitle className="text-lg">{task.title}</CardTitle>
                      </div>
                      <Badge className={color}>
                        <span className="flex items-center">
                          {icon}
                          <span>{task.status}</span>
                        </span>
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">{task.service}</div>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <div>
                          <div className="text-sm font-medium">Cliente</div>
                          <div className="text-sm">{task.client}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium">Prioridad</div>
                          <Badge className={priorityScore.color}>{priorityScore.label}</Badge>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">Asignado a</div>
                        <div className="flex items-center gap-2 text-sm">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                              {task.assigneeInitial || "?"}
                            </AvatarFallback>
                          </Avatar>
                          <span>{task.assignee || "Sin asignar"}</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">Fecha Límite</div>
                        <div className={`flex items-center text-sm ${isOverdue ? "text-red-600" : ""}`}>
                          <Calendar className="mr-2 h-4 w-4" />
                          <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                          {isOverdue && <AlertTriangle className="ml-2 h-4 w-4 text-red-600" />}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">Tiempo registrado</div>
                        <div className="flex items-center text-sm">
                          <Timer className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span className="font-mono">{formatDuration(totalTime)}</span>
                        </div>
                      </div>
                      <div className="text-sm line-clamp-2">{task.description}</div>
                      <div className="flex justify-between pt-2">
                        <Button variant="outline" size="sm" onClick={() => onViewDetails(task)}>
                          <Eye className="h-4 w-4 mr-1" />
                          Ver Detalles
                        </Button>

                        {task.status === "Pendiente" && (
                          <Button variant="default" size="sm" onClick={() => onStartTask(task.id)}>
                            <PlayCircle className="h-4 w-4 mr-1" />
                            Iniciar
                          </Button>
                        )}

                        {task.status === "En Progreso" && (
                          <Button variant="default" size="sm" onClick={() => onCompleteTask(task.id)}>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Completar
                          </Button>
                        )}

                        {task.status === "Pausada" && (
                          <Button variant="default" size="sm" onClick={() => onStartTask(task.id)}>
                            <PlayCircle className="h-4 w-4 mr-1" />
                            Reanudar
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </Draggable>
        )
      })}
    </>
  )
}
