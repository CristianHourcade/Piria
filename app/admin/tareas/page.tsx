"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  CalendarIcon,
  Clock,
  CheckCircle,
  AlertTriangle,
  Info,
  PlayCircle,
  PauseCircle,
  Eye,
  Filter,
  List,
  Grid,
  Search,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, subDays, startOfMonth, endOfMonth, startOfQuarter, startOfYear } from "date-fns"
import { es } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { fetchTasks, createTask, updateTask, deleteTask } from '@/services/tasks';
import { fetchEmployees } from "@/services/employees"
import { Employee } from "@/types/employee"
import { fetchClients } from "@/services/clients"
import TaskForm from "@/components/TaskForm";


// Lista de servicios para filtrar
const SERVICES = [
  "Diseño Gráfico",
  "Diseño Web",
  "Desarrollo Web",
  "Redes Sociales",
  "SEO",
  "Google Ads",
  "Email Marketing",
  "Analítica",
  "Fotografía",
  "Creación de Contenido",
]

// Obtener color según prioridad
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

// Obtener color e icono según estado
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
        icon: <Info className="h-4 w-4 mr-1" />,
      }
  }
}

export default function AdminTareasPage() {
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);

  const [tasks, setTasks] = useState<any>([])
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const tasks = await fetchTasks();
        setTasks(tasks);
      } catch (error) {
        console.error('Error al cargar tareas:', error);
      }
    };

    loadTasks();
  }, []);
  const [collaborators, setCollaborators] = useState<Employee[]>([]);

  useEffect(() => {
    fetchEmployees().then(setCollaborators);
  }, []);
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [viewMode, setViewMode] = useState<"card" | "list">("list")
  const [activeTab, setActiveTab] = useState("todas")
  const [searchTerm, setSearchTerm] = useState("")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filters, setFilters] = useState({
    collaborator: "",
    client: "",
    service: "",
    priority: "",
    status: "",
  })
  const [clients, setClients] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    fetchClients().then(setClients);
  }, []);
  // Estado para el filtro de fechas
  const [dateFilter, setDateFilter] = useState("month") // Por defecto "Este mes"
  const [startDate, setStartDate] = useState<Date | null>(startOfMonth(new Date()))
  const [endDate, setEndDate] = useState<Date | null>(new Date())
  const [dateRangeText, setDateRangeText] = useState("")
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)

  // Actualizar el texto del rango de fechas cuando cambian las fechas
  useEffect(() => {
    if (startDate && endDate) {
      setDateRangeText(
        `Datos del ${format(startDate, "d 'de' MMMM", { locale: es })} al ${format(endDate, "d 'de' MMMM", {
          locale: es,
        })}`,
      )
    } else {
      setDateRangeText("")
    }
  }, [startDate, endDate])

  // Función para actualizar el rango de fechas según el filtro seleccionado
  const updateDateRange = (filter: string) => {
    const now = new Date()

    switch (filter) {
      case "today":
        setStartDate(new Date(now.getFullYear(), now.getMonth(), now.getDate()))
        setEndDate(now)
        break
      case "yesterday":
        const yesterday = subDays(now, 1)
        setStartDate(yesterday)
        setEndDate(yesterday)
        break
      case "last7days":
        setStartDate(subDays(now, 6))
        setEndDate(now)
        break
      case "last30days":
        setStartDate(subDays(now, 29))
        setEndDate(now)
        break
      case "month":
        setStartDate(startOfMonth(now))
        setEndDate(now)
        break
      case "lastmonth":
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        setStartDate(startOfMonth(lastMonth))
        setEndDate(endOfMonth(lastMonth))
        break
      case "quarter":
        setStartDate(startOfQuarter(now))
        setEndDate(now)
        break
      case "year":
        setStartDate(startOfYear(now))
        setEndDate(now)
        break
      case "custom":
        // No hacemos nada, el usuario seleccionará las fechas manualmente
        setIsDatePickerOpen(true)
        break
      default:
        setStartDate(startOfMonth(now))
        setEndDate(now)
    }
  }

  // Filtrar tareas según filtros activos
  const filteredTasks = tasks.filter((task) => {
    // Filtro por pestaña activa
    if (activeTab === "pendientes" && task.status !== "Pendiente") return false
    if (activeTab === "en-progreso" && task.status !== "En Progreso") return false
    if (activeTab === "completadas" && task.status !== "Completada") return false

    // Filtro por término de búsqueda
    if (
      searchTerm &&
      !task.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !task.client.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !task.assignee.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !task.project.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false
    }

    // Filtros avanzados - corregidos para manejar correctamente los valores vacíos
    if (filters.collaborator && task.assignee !== filters.collaborator) return false
    if (filters.client && task.client !== filters.client) return false
    if (filters.service && task.service !== filters.service) return false
    if (filters.priority && task.priority !== filters.priority) return false
    if (filters.status && task.status !== filters.status) return false

    // Filtrado por fecha
    if (startDate && endDate) {
      const taskDate = new Date(task.dueDate)
      if (taskDate < startDate || taskDate > endDate) {
        return false
      }
    }

    return true
  })

  // Resetear filtros
  const resetFilters = () => {
    setFilters({
      collaborator: "",
      client: "",
      service: "",
      priority: "",
      status: "",
    })
    setDateFilter("month")
    updateDateRange("month")
  }

  // Verificar si una tarea está vencida
  const isTaskOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString()
  }

  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
    }
  };


  const handleUpdateTask = async (id, updatedData) => {
    try {
      const updatedTask = await updateTask(id, updatedData);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === id ? updatedTask : task))
      );
    } catch (error) {
      console.error('Error al actualizar tarea:', error);
    }
  };
  const handleCreateTask = async (taskData) => {
    try {
      const newTask = await createTask(taskData);
      setTasks((prevTasks) => [...prevTasks, newTask]);
    } catch (error) {
      console.error('Error al crear tarea:', error);
    }
  };

  const getClientName = (id: number) => {
    return clients.find(client => client.id === id)?.name || "Desconocido"
  }

  const getCollaboratorName = (id: string | number) => {
    return collaborators.find(col => col.id == id)?.name || "Desconocido"
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-secondary dark:text-gray-200">
            Tareas de Colaboradores
          </h1>
          <p className="text-muted-foreground">Supervisa y gestiona todas las tareas asignadas a tu equipo</p>
        </div>
        <div className="flex space-x-2">
          <div className="bg-background border rounded-md p-1 flex">
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="px-2"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "card" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("card")}
              className="px-2"
            >
              <Grid className="h-4 w-4" />
            </Button>
          </div>
          {/* Selector de período */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Select
                value={dateFilter}
                onValueChange={(value) => {
                  setDateFilter(value)
                  updateDateRange(value)
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Hoy</SelectItem>
                  <SelectItem value="yesterday">Ayer</SelectItem>
                  <SelectItem value="last7days">Últimos 7 días</SelectItem>
                  <SelectItem value="last30days">Últimos 30 días</SelectItem>
                  <SelectItem value="month">Este mes</SelectItem>
                  <SelectItem value="lastmonth">Mes anterior</SelectItem>
                  <SelectItem value="quarter">Este trimestre</SelectItem>
                  <SelectItem value="year">Este año</SelectItem>
                  <SelectItem value="custom">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {dateRangeText && <span className="text-sm text-muted-foreground hidden md:inline">{dateRangeText}</span>}
          </div>
          {/* Botón de filtros avanzados */}
          <Button variant="outline" onClick={() => setIsFilterOpen(true)}>
            <Filter className="h-4 w-4 mr-2" />
            Filtros
            {Object.values(filters).some((filter) => filter !== "") && (
              <Badge className="ml-2 bg-primary text-white">
                {Object.values(filters).filter((f) => f !== "").length}
              </Badge>
            )}
          </Button>
          <Button onClick={() => setIsTaskFormOpen(true)}>
            Agregar Tarea
          </Button>
        </div>
      </div>

      {/* Diálogo para seleccionar fechas personalizadas */}
      <Dialog open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Seleccionar rango de fechas</DialogTitle>
            <DialogDescription>Elige las fechas de inicio y fin para filtrar las tareas</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Fecha de inicio</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal" id="startDate">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP", { locale: es }) : "Seleccionar fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus locale={es} />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Fecha de fin</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal" id="endDate">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP", { locale: es }) : "Seleccionar fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus locale={es} />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDatePickerOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setIsDatePickerOpen(false)}>Aplicar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para filtros avanzados */}
      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Filtros avanzados</DialogTitle>
            <DialogDescription>
              Filtra las tareas por colaborador, cliente, servicio, prioridad o estado.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="collaboratorFilter">
                Colaborador
              </label>
              <Select
                value={filters.collaborator}
                onValueChange={(value) => setFilters({ ...filters, collaborator: value })}
              >
                <SelectTrigger id="collaboratorFilter">
                  <SelectValue placeholder="Todos los colaboradores" />
                </SelectTrigger>
                <SelectContent>
                  {collaborators?.map((collaborator) => (
                    <SelectItem key={collaborator} value={collaborator}>
                      {collaborator}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="clientFilter">
                Cliente
              </label>
              <Select value={filters.client} onValueChange={(value) => setFilters({ ...filters, client: value })}>
                <SelectTrigger id="clientFilter">
                  <SelectValue placeholder="Todos los clientes" />
                </SelectTrigger>
                <SelectContent>
                  {clients?.map((client) => (
                    <SelectItem key={client} value={client}>
                      {client}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="serviceFilter">
                Servicio
              </label>
              <Select value={filters.service} onValueChange={(value) => setFilters({ ...filters, service: value })}>
                <SelectTrigger id="serviceFilter">
                  <SelectValue placeholder="Todos los servicios" />
                </SelectTrigger>
                <SelectContent>
                  {SERVICES.map((service) => (
                    <SelectItem key={service} value={service}>
                      {service}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="priorityFilter">
                Prioridad
              </label>
              <Select value={filters.priority} onValueChange={(value) => setFilters({ ...filters, priority: value })}>
                <SelectTrigger id="priorityFilter">
                  <SelectValue placeholder="Todas las prioridades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Alta">Alta</SelectItem>
                  <SelectItem value="Media">Media</SelectItem>
                  <SelectItem value="Baja">Baja</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="statusFilter">
                Estado
              </label>
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger id="statusFilter">
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pendiente">Pendiente</SelectItem>
                  <SelectItem value="En Progreso">En Progreso</SelectItem>
                  <SelectItem value="Completada">Completada</SelectItem>
                  <SelectItem value="Pausada">Pausada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={resetFilters}>
                Restablecer
              </Button>
              <Button onClick={() => setIsFilterOpen(false)}>Aplicar filtros</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 gap-4">
        <div className="w-full md:w-1/2">
          <div className="bg-muted/30 p-1 rounded-lg flex space-x-1 mb-0">
            <Button
              variant={activeTab === "todas" ? "secondary" : "ghost"}
              className="flex-1 rounded-md text-sm font-normal"
              onClick={() => setActiveTab("todas")}
            >
              Todas ({tasks.length})
            </Button>
            <Button
              variant={activeTab === "pendientes" ? "secondary" : "ghost"}
              className="flex-1 rounded-md text-sm font-normal"
              onClick={() => setActiveTab("pendientes")}
            >
              Pendientes ({tasks.filter((t) => t.status === "Pendiente").length})
            </Button>
            <Button
              variant={activeTab === "en-progreso" ? "secondary" : "ghost"}
              className="flex-1 rounded-md text-sm font-normal"
              onClick={() => setActiveTab("en-progreso")}
            >
              En Progreso ({tasks.filter((t) => t.status === "En Progreso").length})
            </Button>
            <Button
              variant={activeTab === "completadas" ? "secondary" : "ghost"}
              className="flex-1 rounded-md text-sm font-normal"
              onClick={() => setActiveTab("completadas")}
            >
              Completadas ({tasks.filter((t) => t.status === "Completada").length})
            </Button>
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar tareas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      </div>

      <Card className="border-primary/20">
        <CardHeader className="pb-2">
          <div className="flex flex-col space-y-1.5">
            <CardTitle className="text-secondary dark:text-gray-200">Tareas</CardTitle>
            <CardDescription>
              {filteredTasks.length} {filteredTasks.length === 1 ? "tarea" : "tareas"} mostradas de un total de{" "}
              {tasks.length}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {viewMode === "list" ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tarea</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Responsable</TableHead>
                  <TableHead>Fecha Límite</TableHead>
                  <TableHead>Prioridad</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No se encontraron tareas que coincidan con los filtros aplicados
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTasks.map((task) => {
                    const { color, icon } = getStatusInfo(task.status)
                    const isOverdue = isTaskOverdue(task.dueDate)

                    return (
                      <TableRow key={task.id}>
                        <TableCell>
                          <div className="font-medium">{task.title}</div>
                          <div className="text-xs text-muted-foreground">{task.project}</div>
                        </TableCell>
                        <TableCell>{getClientName(task.client_id)}</TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6 text-xs">
                              <AvatarFallback className="bg-primary text-primary-foreground">
                                {getCollaboratorName(task.assignee)?.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span>{getCollaboratorName(task.assignee)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className={`flex items-center ${isOverdue ? "text-red-600" : ""}`}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                            {isOverdue && <AlertTriangle className="ml-2 h-4 w-4 text-red-600" />}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
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
                          <Button variant="outline" size="sm" onClick={() => setSelectedTask(task)}>
                            <Eye className="h-4 w-4 mr-1" />
                            Ver
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {filteredTasks.length === 0 ? (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  No se encontraron tareas que coincidan con los filtros aplicados
                </div>
              ) : (
                filteredTasks.map((task) => {
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
                        <div className="flex justify-between items-center text-sm text-muted-foreground">
                          <div>{task.project}</div>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-4">
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <div>
                              <div className="text-sm font-medium">Cliente</div>
                              <div className="text-sm">{getClientName(task.client_id)}</div>
                            </div>
                            <div>
                              <div className="text-sm font-medium">Prioridad</div>
                              <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                            </div>
                          </div>

                          <div className="flex justify-between">
                            <div>
                              <div className="text-sm font-medium">Responsable</div>
                              <div className="flex items-center gap-2 text-sm">
                                <Avatar className="h-5 w-5 text-xs">
                                  <AvatarFallback className="bg-primary text-primary-foreground">
                                    {getCollaboratorName(task.assignee).charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <span>{getCollaboratorName(task.assignee)}</span>
                              </div>
                            </div>
                            <div>
                              <div className="text-sm font-medium">Fecha Límite</div>
                              <div className={`flex items-center text-sm ${isOverdue ? "text-red-600" : ""}`}>
                                <CalendarIcon className="mr-1 h-4 w-4" />
                                <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                                {isOverdue && <AlertTriangle className="ml-1 h-4 w-4 text-red-600" />}
                              </div>
                            </div>
                          </div>

                          <div className="text-sm line-clamp-2">{task.description}</div>

                          <div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                              onClick={() => setSelectedTask(task)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Ver Detalles
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedTask && (
        <Dialog open={!!selectedTask} onOpenChange={(open) => !open && setSelectedTask(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{selectedTask.title}</DialogTitle>
              <DialogDescription>Detalles de la tarea</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium">Cliente</h4>
                  <p className="text-sm">{selectedTask.client}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Proyecto</h4>
                  <p className="text-sm">{selectedTask.project}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium">Responsable</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Avatar className="h-6 w-6 text-xs">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {selectedTask.assigneeInitial}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{selectedTask.assignee}</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Servicio</h4>
                  <p className="text-sm">{selectedTask.service}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h4 className="text-sm font-medium">Fecha Límite</h4>
                  <div
                    className={`flex items-center text-sm ${isTaskOverdue(selectedTask.dueDate) ? "text-red-600" : ""}`}
                  >
                    <CalendarIcon className="mr-1 h-4 w-4" />
                    <span>{new Date(selectedTask.dueDate).toLocaleDateString()}</span>
                    {isTaskOverdue(selectedTask.dueDate) && <AlertTriangle className="ml-1 h-4 w-4" />}
                  </div>
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

              <div>
                <h4 className="text-sm font-medium">Comentarios</h4>
                {selectedTask.comments?.length === 0 ? (
                  <p className="text-sm text-muted-foreground mt-1">No hay comentarios</p>
                ) : (
                  <div className="space-y-3 mt-2">
                    {selectedTask?.comments?.map((comment: any, index: number) => (
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
              </div>

              <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t">
                <div>Creada: {new Date(selectedTask.created).toLocaleDateString()}</div>
                <div>Última actualización: {new Date(selectedTask.lastUpdated).toLocaleDateString()}</div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
      <TaskForm
        isOpen={isTaskFormOpen}
        onClose={() => setIsTaskFormOpen(false)}
        onSubmit={handleCreateTask}
        collaborators={collaborators}
        clients={clients}
      />
    </div>
  )
}
