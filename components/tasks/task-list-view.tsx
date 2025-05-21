"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, AlertTriangle, Timer, PlayCircle, PauseCircle, CheckCircle, Eye, GripVertical } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { calculatePriorityScore } from "@/utils/task-prioritization"
import { formatDuration, calculateTotalDuration } from "@/models/time-tracking"
import { Draggable } from "react-beautiful-dnd"
import { getStatusInfo, isTaskOverdue } from "@/utils/task-view-utils"

interface TaskListViewProps {
  tasks: any[]
  manualPrioritizationEnabled: boolean
  onViewDetails: (task: any) => void
  onStartTask: (id: number) => void
  onCompleteTask: (id: number) => void
  onPauseTask: (id: number) => void
}

export function TaskListView({
  tasks,
  manualPrioritizationEnabled,
  onViewDetails,
  onStartTask,
  onCompleteTask,
  onPauseTask,
}: TaskListViewProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {manualPrioritizationEnabled && <TableHead style={{ width: "40px" }}></TableHead>}
          <TableHead>Tarea</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead>Fecha Límite</TableHead>
          <TableHead>Asignado a</TableHead>
          <TableHead>Prioridad</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Tiempo</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.length === 0 ? (
          <TableRow>
            <TableCell colSpan={manualPrioritizationEnabled ? 9 : 8} className="text-center py-8 text-muted-foreground">
              No hay tareas que coincidan con el filtro seleccionado
            </TableCell>
          </TableRow>
        ) : (
          tasks.map((task, index) => {
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
                  <TableRow
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={`
                      ${snapshot.isDragging ? "opacity-70" : ""}
                      ${task.manuallyPrioritized ? "border-l-4 border-l-blue-500 dark:border-l-blue-400" : ""}
                    `}
                  >
                    {manualPrioritizationEnabled && (
                      <TableCell className="w-10">
                        <div
                          {...provided.dragHandleProps}
                          className="cursor-grab active:cursor-grabbing flex justify-center"
                        >
                          <GripVertical className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </TableCell>
                    )}
                    <TableCell>
                      <div className="font-medium">{task.title}</div>
                      <div className="text-sm text-muted-foreground">{task.service}</div>
                    </TableCell>
                    <TableCell>{task.client}</TableCell>
                    <TableCell>
                      <div className={`flex items-center ${isOverdue ? "text-red-600" : ""}`}>
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                        {isOverdue && <AlertTriangle className="ml-2 h-4 w-4 text-red-600" />}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                            {task.assigneeInitial || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <span>{task.assignee || "Sin asignar"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={priorityScore.color}>{priorityScore.label}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={color}>
                        <span className="flex items-center">
                          {icon}
                          <span>{task.status}</span>
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Timer className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span className="text-sm font-mono">{formatDuration(totalTime)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => onViewDetails(task)}>
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>

                        {task.status === "Pendiente" && (
                          <Button variant="default" size="sm" onClick={() => onStartTask(task.id)}>
                            <PlayCircle className="h-4 w-4 mr-1" />
                            Iniciar
                          </Button>
                        )}

                        {task.status === "En Progreso" && (
                          <>
                            <Button variant="outline" size="sm" onClick={() => onPauseTask(task.id)}>
                              <PauseCircle className="h-4 w-4 mr-1" />
                              Pausar
                            </Button>
                            <Button variant="default" size="sm" onClick={() => onCompleteTask(task.id)}>
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Completar
                            </Button>
                          </>
                        )}

                        {task.status === "Pausada" && (
                          <Button variant="default" size="sm" onClick={() => onStartTask(task.id)}>
                            <PlayCircle className="h-4 w-4 mr-1" />
                            Reanudar
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </Draggable>
            )
          })
        )}
      </TableBody>
    </Table>
  )
}
