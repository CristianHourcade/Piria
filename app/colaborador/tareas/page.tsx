"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, List, Grid, ArrowDownUp } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DragDropContext, Droppable } from "react-beautiful-dnd"
import { sortTasksByPriority } from "@/utils/task-prioritization"
import { TaskCardView } from "@/components/tasks/task-card-view"
import { TaskListView } from "@/components/tasks/task-list-view"
import { TaskDetailsDialog } from "@/components/tasks/task-details-dialog"
import { NewTaskDialog } from "@/components/tasks/new-task-dialog"
import type { TimeEntry } from "@/models/time-tracking"
import type { Task } from "@/models/data-models"
import { fetchTasksForUser, createTask, updateTask, addTimeEntry, updateTimeEntry } from "@/services/task-service"
import { fetchUsers } from "@/services/user-service"
import { fetchCurrentUser } from "@/services/user-service"
import { useToast } from "@/hooks/use-toast"

export default function TareasPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [sortedTasks, setSortedTasks] = useState<Task[]>([])
  const [manualOrderIds, setManualOrderIds] = useState<number[]>([])
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [activeFilter, setActiveFilter] = useState("todas")
  const [viewMode, setViewMode] = useState<"card" | "list">("card")
  const [showAddTaskDialog, setShowAddTaskDialog] = useState(false)
  const [newTask, setNewTask] = useState<Omit<Task, "id" | "created" | "lastUpdated" | "comments">>({
    title: "",
    projectId: 0,
    clientId: 0,
    clientName: "",
    projectName: "",
    service: "",
    assignee: "",
    assigneeInitial: "",
    dueDate: new Date().toISOString().split("T")[0],
    status: "Pendiente",
    priority: "Media",
    description: "",
    timeEntries: [] as TimeEntry[],
    manuallyPrioritized: false,
  })
  const [sortMethod, setSortMethod] = useState<"priority" | "deadline" | "manual">("priority")
  const [manualPrioritizationEnabled, setManualPrioritizationEnabled] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [collaborators, setCollaborators] = useState<any[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const { toast } = useToast()

  // Fetch tasks and collaborators on component mount
  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      try {
        // Get current user
        const user = await fetchCurrentUser()
        setCurrentUser(user)

        // Fetch tasks for the current user
        if (user) {
          const userTasks = await fetchTasksForUser(user.id)
          setTasks(userTasks)
        }

        // Fetch all users/collaborators
        const users = await fetchUsers()
        setCollaborators(
          users.map((user) => ({
            id: user.id.toString(),
            name: user.name,
            initial: user.initials,
          })),
        )
      } catch (error) {
        console.error("Error loading data:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar las tareas. Por favor, intenta de nuevo.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [toast])

  // Initialize manual order when tasks change
  useEffect(() => {
    if (manualOrderIds.length === 0 && tasks.length > 0) {
      setManualOrderIds(tasks.map((task) => task.id))
    }
  }, [tasks, manualOrderIds])

  // Apply sorting and filtering whenever tasks or filters change
  useEffect(() => {
    let filtered = tasks.filter((task) => {
      if (activeFilter === "todas") return true
      if (activeFilter === "pendientes") return task.status === "Pendiente"
      if (activeFilter === "en-progreso") return task.status === "En Progreso"
      if (activeFilter === "completadas") return task.status === "Completada"
      return true
    })

    // Apply sorting
    if (sortMethod === "manual" && manualPrioritizationEnabled) {
      // Sort by manual order
      filtered = [...filtered].sort((a, b) => {
        const indexA = manualOrderIds.indexOf(a.id)
        const indexB = manualOrderIds.indexOf(b.id)
        return indexA - indexB
      })
    } else if (sortMethod === "priority") {
      filtered = sortTasksByPriority(filtered)
    } else if (sortMethod === "deadline") {
      filtered = [...filtered].sort((a, b) => {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      })
    }

    setSortedTasks(filtered)
  }, [tasks, activeFilter, sortMethod, manualOrderIds, manualPrioritizationEnabled])

  const handleStartTask = async (id: number) => {
    try {
      const taskToUpdate = tasks.find((task) => task.id === id)
      if (!taskToUpdate) return

      const updatedTask = { ...taskToUpdate, status: "En Progreso" }
      const result = await updateTask(updatedTask)

      if (result) {
        setTasks(tasks.map((task) => (task.id === id ? result : task)))
        toast({
          title: "Tarea iniciada",
          description: "La tarea ha sido iniciada correctamente.",
        })
      }
    } catch (error) {
      console.error("Error starting task:", error)
      toast({
        title: "Error",
        description: "No se pudo iniciar la tarea. Por favor, intenta de nuevo.",
        variant: "destructive",
      })
    }
  }

  const handleCompleteTask = async (id: number) => {
    try {
      const taskToUpdate = tasks.find((task) => task.id === id)
      if (!taskToUpdate) return

      const updatedTask = { ...taskToUpdate, status: "Completada" }
      const result = await updateTask(updatedTask)

      if (result) {
        setTasks(tasks.map((task) => (task.id === id ? result : task)))
        toast({
          title: "Tarea completada",
          description: "La tarea ha sido marcada como completada.",
        })
      }
    } catch (error) {
      console.error("Error completing task:", error)
      toast({
        title: "Error",
        description: "No se pudo completar la tarea. Por favor, intenta de nuevo.",
        variant: "destructive",
      })
    }
  }

  const handlePauseTask = async (id: number) => {
    try {
      const taskToUpdate = tasks.find((task) => task.id === id)
      if (!taskToUpdate) return

      const updatedTask = { ...taskToUpdate, status: "Pausada" }
      const result = await updateTask(updatedTask)

      if (result) {
        setTasks(tasks.map((task) => (task.id === id ? result : task)))
        toast({
          title: "Tarea pausada",
          description: "La tarea ha sido pausada correctamente.",
        })
      }
    } catch (error) {
      console.error("Error pausing task:", error)
      toast({
        title: "Error",
        description: "No se pudo pausar la tarea. Por favor, intenta de nuevo.",
        variant: "destructive",
      })
    }
  }

  const handleAddTask = async () => {
    try {
      const result = await createTask(newTask)

      if (result) {
        setTasks([...tasks, result])
        // Add the new task ID to the manual order
        setManualOrderIds([...manualOrderIds, result.id])
        setShowAddTaskDialog(false)
        setNewTask({
          title: "",
          projectId: 0,
          clientId: 0,
          clientName: "",
          projectName: "",
          service: "",
          assignee: "",
          assigneeInitial: "",
          dueDate: new Date().toISOString().split("T")[0],
          status: "Pendiente",
          priority: "Media",
          description: "",
          timeEntries: [],
          manuallyPrioritized: false,
        })

        toast({
          title: "Tarea creada",
          description: `La tarea "${result.title}" ha sido creada correctamente.`,
        })
      }
    } catch (error) {
      console.error("Error adding task:", error)
      toast({
        title: "Error",
        description: "No se pudo crear la tarea. Por favor, intenta de nuevo.",
        variant: "destructive",
      })
    }
  }

  const handleAssignTask = async (taskId: number, collaboratorName: string) => {
    try {
      const taskToUpdate = tasks.find((task) => task.id === taskId)
      if (!taskToUpdate) return

      const collaborator = collaborators.find((c) => c.name === collaboratorName)
      if (!collaborator) return

      const updatedTask = {
        ...taskToUpdate,
        assignee: collaborator.name,
        assigneeInitial: collaborator.initial,
      }

      const result = await updateTask(updatedTask)

      if (result) {
        setTasks(tasks.map((task) => (task.id === taskId ? result : task)))

        if (selectedTask && selectedTask.id === taskId) {
          setSelectedTask(result)
        }

        toast({
          title: "Tarea asignada",
          description: `La tarea ha sido asignada a ${collaboratorName} correctamente.`,
        })
      }
    } catch (error) {
      console.error("Error assigning task:", error)
      toast({
        title: "Error",
        description: "No se pudo asignar la tarea. Por favor, intenta de nuevo.",
        variant: "destructive",
      })
    }
  }

  const handleSelectCollaborator = (collaboratorName: string) => {
    const collaborator = collaborators.find((c) => c.name === collaboratorName)
    if (!collaborator) return

    setNewTask({
      ...newTask,
      assignee: collaborator.name,
      assigneeInitial: collaborator.initial,
    })
  }

  const handleAddTimeEntry = async (taskId: number, entry: Omit<TimeEntry, "id">) => {
    try {
      const result = await addTimeEntry(taskId, entry)

      if (result) {
        const updatedTasks = tasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                timeEntries: [...task.timeEntries, result],
              }
            : task,
        )

        setTasks(updatedTasks)

        if (selectedTask && selectedTask.id === taskId) {
          setSelectedTask({
            ...selectedTask,
            timeEntries: [...selectedTask.timeEntries, result],
          })
        }

        toast({
          title: "Tiempo registrado",
          description: "El tiempo ha sido registrado correctamente.",
        })
      }
    } catch (error) {
      console.error("Error adding time entry:", error)
      toast({
        title: "Error",
        description: "No se pudo registrar el tiempo. Por favor, intenta de nuevo.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateTimeEntry = async (taskId: number, updatedEntry: TimeEntry) => {
    try {
      const result = await updateTimeEntry(updatedEntry)

      if (result) {
        const updatedTasks = tasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                timeEntries: task.timeEntries.map((entry) => (entry.id === updatedEntry.id ? result : entry)),
              }
            : task,
        )

        setTasks(updatedTasks)

        if (selectedTask && selectedTask.id === taskId) {
          setSelectedTask({
            ...selectedTask,
            timeEntries: selectedTask.timeEntries.map((entry: TimeEntry) =>
              entry.id === updatedEntry.id ? result : entry,
            ),
          })
        }

        toast({
          title: "Tiempo actualizado",
          description: "El registro de tiempo ha sido actualizado correctamente.",
        })
      }
    } catch (error) {
      console.error("Error updating time entry:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el registro de tiempo. Por favor, intenta de nuevo.",
        variant: "destructive",
      })
    }
  }

  const handleToggleManualPriority = async (taskId: number) => {
    try {
      const taskToUpdate = tasks.find((task) => task.id === taskId)
      if (!taskToUpdate) return

      const updatedTask = {
        ...taskToUpdate,
        manuallyPrioritized: !taskToUpdate.manuallyPrioritized,
      }

      const result = await updateTask(updatedTask)

      if (result) {
        setTasks(tasks.map((task) => (task.id === taskId ? result : task)))

        if (selectedTask && selectedTask.id === taskId) {
          setSelectedTask(result)
        }
      }
    } catch (error) {
      console.error("Error toggling manual priority:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar la priorización manual. Por favor, intenta de nuevo.",
        variant: "destructive",
      })
    }
  }

  const handleDragEnd = async (result: any) => {
    // Dropped outside the list
    if (!result.destination) {
      return
    }

    const sourceIndex = result.source.index
    const destinationIndex = result.destination.index

    // If the task was dropped in the same position, do nothing
    if (sourceIndex === destinationIndex) {
      return
    }

    // Get the task IDs in the current order
    const taskIds = sortedTasks.map((task) => task.id)

    // Remove the dragged task ID from the array
    const [removed] = taskIds.splice(sourceIndex, 1)

    // Insert the dragged task ID at the destination index
    taskIds.splice(destinationIndex, 0, removed)

    // Update the manual order
    setManualOrderIds(taskIds)

    // Mark the dragged task as manually prioritized
    const draggedTaskId = sortedTasks[sourceIndex].id
    try {
      const taskToUpdate = tasks.find((task) => task.id === draggedTaskId)
      if (!taskToUpdate) return

      const updatedTask = {
        ...taskToUpdate,
        manuallyPrioritized: true,
      }

      const result = await updateTask(updatedTask)

      if (result) {
        setTasks(tasks.map((task) => (task.id === draggedTaskId ? result : task)))
      }

      // If manual prioritization is not enabled, enable it and switch to manual sort
      if (!manualPrioritizationEnabled) {
        setManualPrioritizationEnabled(true)
        setSortMethod("manual")
      }
    } catch (error) {
      console.error("Error updating task priority:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar la prioridad de la tarea. Por favor, intenta de nuevo.",
        variant: "destructive",
      })
    }
  }

  const resetManualPrioritization = async () => {
    try {
      // Reset all tasks to not manually prioritized
      const updatedTasks = []
      for (const task of tasks) {
        if (task.manuallyPrioritized) {
          const updatedTask = await updateTask({
            ...task,
            manuallyPrioritized: false,
          })
          if (updatedTask) {
            updatedTasks.push(updatedTask)
          }
        } else {
          updatedTasks.push(task)
        }
      }

      setTasks(updatedTasks)

      // Reset manual order to default (by ID)
      setManualOrderIds(tasks.map((task) => task.id).sort((a, b) => a - b))

      // Disable manual prioritization
      setManualPrioritizationEnabled(false)

      // Switch back to priority sorting
      setSortMethod("priority")

      toast({
        title: "Priorización restablecida",
        description: "Se ha restablecido el orden automático de las tareas.",
      })
    } catch (error) {
      console.error("Error resetting manual prioritization:", error)
      toast({
        title: "Error",
        description: "No se pudo restablecer la priorización. Por favor, intenta de nuevo.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Mis Tareas</h1>
        <div className="flex space-x-2">
          <div className="flex items-center space-x-2 mr-2">
            <Switch
              checked={manualPrioritizationEnabled}
              onCheckedChange={setManualPrioritizationEnabled}
              id="manual-priority"
            />
            <Label htmlFor="manual-priority" className="text-sm">
              Priorización manual
            </Label>
            {manualPrioritizationEnabled && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={resetManualPrioritization} className="h-8 px-2">
                      <ArrowDownUp className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Restablecer orden automático</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <Select
            value={sortMethod}
            onValueChange={(value: "priority" | "deadline" | "manual") => setSortMethod(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="priority">Prioridad automática</SelectItem>
              <SelectItem value="deadline">Fecha límite</SelectItem>
              <SelectItem value="manual">Manual</SelectItem>
            </SelectContent>
          </Select>
          <div className="bg-background border rounded-md p-1 flex">
            <Button
              variant={viewMode === "card" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("card")}
              className="px-2"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="px-2"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={() => setShowAddTaskDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Agregar Tarea
          </Button>
        </div>
      </div>

      <div className="bg-muted/30 p-1 rounded-lg flex space-x-1 mb-6 max-w-md">
        <Button
          variant={activeFilter === "todas" ? "secondary" : "ghost"}
          className="flex-1 rounded-md text-sm font-medium"
          onClick={() => setActiveFilter("todas")}
        >
          Todas
        </Button>
        <Button
          variant={activeFilter === "pendientes" ? "secondary" : "ghost"}
          className="flex-1 rounded-md text-sm font-medium"
          onClick={() => setActiveFilter("pendientes")}
        >
          Pendientes
        </Button>
        <Button
          variant={activeFilter === "en-progreso" ? "secondary" : "ghost"}
          className="flex-1 rounded-md text-sm font-medium"
          onClick={() => setActiveFilter("en-progreso")}
        >
          En Progreso
        </Button>
        <Button
          variant={activeFilter === "completadas" ? "secondary" : "ghost"}
          className="flex-1 rounded-md text-sm font-medium"
          onClick={() => setActiveFilter("completadas")}
        >
          Completadas
        </Button>
      </div>

      {manualPrioritizationEnabled && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3 mb-4">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <span className="font-medium">Modo de priorización manual activo.</span> Arrastra y suelta las tareas para
            reordenarlas según tu preferencia. Las tareas reordenadas manualmente se destacarán con un borde especial.
          </p>
        </div>
      )}

      {tasks.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <p className="text-muted-foreground mb-4">No tienes tareas asignadas actualmente.</p>
            <Button onClick={() => setShowAddTaskDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Crear nueva tarea
            </Button>
          </CardContent>
        </Card>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          {viewMode === "list" ? (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Lista de Tareas</CardTitle>
              </CardHeader>
              <CardContent>
                <Droppable droppableId="task-list" isDropDisabled={!manualPrioritizationEnabled}>
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      <TaskListView
                        tasks={sortedTasks}
                        manualPrioritizationEnabled={manualPrioritizationEnabled}
                        onViewDetails={setSelectedTask}
                        onStartTask={handleStartTask}
                        onCompleteTask={handleCompleteTask}
                        onPauseTask={handlePauseTask}
                      />
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </CardContent>
            </Card>
          ) : (
            <Droppable droppableId="task-cards" isDropDisabled={!manualPrioritizationEnabled}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  <TaskCardView
                    tasks={sortedTasks}
                    manualPrioritizationEnabled={manualPrioritizationEnabled}
                    onViewDetails={setSelectedTask}
                    onStartTask={handleStartTask}
                    onCompleteTask={handleCompleteTask}
                    onPauseTask={handlePauseTask}
                  />
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          )}
        </DragDropContext>
      )}

      {/* Task Details Dialog */}
      <TaskDetailsDialog
        selectedTask={selectedTask}
        onClose={() => setSelectedTask(null)}
        onStartTask={handleStartTask}
        onCompleteTask={handleCompleteTask}
        onPauseTask={handlePauseTask}
        onToggleManualPriority={handleToggleManualPriority}
        onAssignTask={handleAssignTask}
        onAddTimeEntry={handleAddTimeEntry}
        onUpdateTimeEntry={handleUpdateTimeEntry}
        collaborators={collaborators}
      />

      {/* New Task Dialog */}
      <NewTaskDialog
        open={showAddTaskDialog}
        onOpenChange={setShowAddTaskDialog}
        onAddTask={handleAddTask}
        newTask={newTask}
        setNewTask={setNewTask}
        onSelectCollaborator={handleSelectCollaborator}
        collaborators={collaborators}
      />
    </div>
  )
}
