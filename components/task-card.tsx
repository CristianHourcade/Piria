"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, CheckCircle, AlertTriangle, PlayCircle, PauseCircle, Eye } from "lucide-react"
import type { Task } from "@/models/data-models"

interface TaskCardProps {
  task: Task
  onViewDetails: (task: Task) => void
  onStartTask?: (id: number) => void
  onCompleteTask?: (id: number) => void
  onPauseTask?: (id: number) => void
  showAssignee?: boolean
}

// Get priority color
const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "Alta":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
    case "Media":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
    case "Baja":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
  }
}

// Get status color and icon
const getStatusInfo = (status: string) => {
  switch (status) {
    case "Completada":
      return {
        color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
        icon: <CheckCircle className="h-4 w-4 mr-1" />,
      }
    case "En Progreso":
      return {
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
        icon: <PlayCircle className="h-4 w-4 mr-1" />,
      }
    case "Pausada":
      return {
        color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
        icon: <PauseCircle className="h-4 w-4 mr-1" />,
      }
    case "Pendiente":
      return {
        color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
        icon: <Clock className="h-4 w-4 mr-1" />,
      }
    default:
      return {
        color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
        icon: <Clock className="h-4 w-4 mr-1" />,
      }
  }
}

// Check if task is overdue
const isTaskOverdue = (dueDate: string) => {
  return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString()
}

export function TaskCard({
  task,
  onViewDetails,
  onStartTask,
  onCompleteTask,
  onPauseTask,
  showAssignee = true,
}: TaskCardProps) {
  const { color, icon } = getStatusInfo(task.status)
  const isOverdue = isTaskOverdue(task.dueDate)

  return (
    <Card key={task.id} className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{task.title}</CardTitle>
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
              <div className="text-sm">{task.clientName}</div>
            </div>
            <div>
              <div className="text-sm font-medium">Prioridad</div>
              <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
            </div>
          </div>

          {showAssignee && (
            <div>
              <div className="text-sm font-medium">Asignado a</div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
                  {task.assigneeInitial || "?"}
                </div>
                <span>{task.assignee || "Sin asignar"}</span>
              </div>
            </div>
          )}

          <div>
            <div className="text-sm font-medium">Fecha Límite</div>
            <div className={`flex items-center text-sm ${isOverdue ? "text-red-600" : ""}`}>
              <Calendar className="mr-2 h-4 w-4" />
              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
              {isOverdue && <AlertTriangle className="ml-2 h-4 w-4 text-red-600" />}
            </div>
          </div>

          <div className="text-sm line-clamp-2">{task.description}</div>

          <div className="flex justify-between pt-2">
            <Button variant="outline" size="sm" onClick={() => onViewDetails(task)}>
              <Eye className="h-4 w-4 mr-1" />
              Ver Detalles
            </Button>

            {task.status === "Pendiente" && onStartTask && (
              <Button variant="default" size="sm" onClick={() => onStartTask(task.id)}>
                <PlayCircle className="h-4 w-4 mr-1" />
                Iniciar
              </Button>
            )}

            {task.status === "En Progreso" && onCompleteTask && (
              <Button variant="default" size="sm" onClick={() => onCompleteTask(task.id)}>
                <CheckCircle className="h-4 w-4 mr-1" />
                Completar
              </Button>
            )}

            {task.status === "Pausada" && onStartTask && (
              <Button variant="default" size="sm" onClick={() => onStartTask(task.id)}>
                <PlayCircle className="h-4 w-4 mr-1" />
                Reanudar
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
