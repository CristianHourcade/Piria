"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

export default function CalendarioPage() {
  const [view, setView] = useState("month")
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [selectedFilters, setSelectedFilters] = useState({
    project: "",
    task: "",
  })

  // Then, add a new state for the add task dialog
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [newTask, setNewTask] = useState({
    title: "",
    project: "",
    task: "",
    date: new Date().toISOString().split("T")[0],
    type: "task",
    description: "",
  })

  // Add a new state for the selected event and detail dialog
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  // Add a new state for editing events
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingEvent, setEditingEvent] = useState({
    id: 0,
    title: "",
    project: "",
    task: "",
    date: new Date().toISOString().split("T")[0],
    type: "task",
    description: "",
  })

  // Mock data for calendar events
  const events = [
    {
      id: 1,
      title: "Entrega de diseño",
      project: "Rediseño Web Corporativa",
      task: "Diseño UI",
      date: new Date(currentYear, currentMonth, 5),
      type: "deadline",
    },
    {
      id: 2,
      title: "Reunión de seguimiento",
      project: "Campaña Redes Sociales",
      task: "Revisión de avances",
      date: new Date(currentYear, currentMonth, 8),
      type: "meeting",
    },
    {
      id: 3,
      title: "Publicación en redes",
      project: "Gestión de Redes Sociales",
      task: "Programación de publicaciones",
      date: new Date(currentYear, currentMonth, 12),
      type: "task",
    },
    {
      id: 4,
      title: "Análisis SEO",
      project: "Optimización SEO",
      task: "Auditoría inicial",
      date: new Date(currentYear, currentMonth, 15),
      type: "task",
    },
    {
      id: 5,
      title: "Sesión de fotos",
      project: "Sesión Fotográfica Productos",
      task: "Fotografía de productos",
      date: new Date(currentYear, currentMonth, 18),
      type: "task",
    },
    {
      id: 6,
      title: "Entrega final",
      project: "Rediseño Web Corporativa",
      task: "Revisión y ajustes",
      date: new Date(currentYear, currentMonth, 22),
      type: "deadline",
    },
    {
      id: 7,
      title: "Revisión de campaña",
      project: "Campaña Redes Sociales",
      task: "Análisis de resultados",
      date: new Date(currentYear, currentMonth, 25),
      type: "meeting",
    },
  ]

  // Get unique projects and tasks
  const projects = Array.from(new Set(events.map((event) => event.project)))
  const tasks = Array.from(new Set(events.map((event) => event.task)))

  // Filter events
  const filteredEvents = events.filter(
    (event) =>
      (selectedFilters.project === "" || event.project === selectedFilters.project) &&
      (selectedFilters.task === "" || event.task === selectedFilters.task),
  )

  // Get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  // Get first day of month
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  // Generate calendar days
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth)
    const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth)
    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }

    return days
  }

  // Get events for a specific day
  const getEventsForDay = (day: number) => {
    return filteredEvents.filter(
      (event) =>
        event.date.getDate() === day &&
        event.date.getMonth() === currentMonth &&
        event.date.getFullYear() === currentYear,
    )
  }

  // Handle month navigation
  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  // Implement the handleTodayClick function
  const handleTodayClick = () => {
    const today = new Date()
    setCurrentMonth(today.getMonth())
    setCurrentYear(today.getFullYear())

    // If we're in week or day view, we might want to set the current day as well
    // For now, this will at least navigate to the current month/year
  }

  // Get month name
  const getMonthName = (month: number) => {
    const monthNames = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ]
    return monthNames[month]
  }

  // Get event type color
  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "deadline":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800"
      case "meeting":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
      case "task":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
    }
  }

  // Add a function to handle adding a new task
  const handleAddTask = () => {
    // In a real app, this would save to a database
    const newEvent = {
      id: events.length + 1,
      title: newTask.title,
      project: newTask.project,
      task: newTask.task,
      date: new Date(newTask.date),
      type: newTask.type,
    }

    // For now, we'll just log it
    console.log("New task:", newEvent)

    // Reset form and close dialog
    setNewTask({
      title: "",
      project: "",
      task: "",
      date: new Date().toISOString().split("T")[0],
      type: "task",
      description: "",
    })
    setIsAddTaskOpen(false)
  }

  // Add a function to handle clicking on an event
  const handleEventClick = (event: any) => {
    setSelectedEvent(event)
    setIsDetailOpen(true)
  }

  // Add a function to handle editing an event
  const handleEditEvent = () => {
    if (selectedEvent) {
      setEditingEvent({
        id: selectedEvent.id,
        title: selectedEvent.title,
        project: selectedEvent.project,
        task: selectedEvent.task,
        date: new Date(selectedEvent.date).toISOString().split("T")[0],
        type: selectedEvent.type,
        description: selectedEvent.description || "",
      })
      setIsEditMode(true)
      setIsDetailOpen(false)
    }
  }

  // Add a function to save the edited event
  const handleSaveEdit = () => {
    // In a real app, this would update the database
    const updatedEvents = events.map((event) =>
      event.id === editingEvent.id
        ? {
            ...event,
            title: editingEvent.title,
            project: editingEvent.project,
            task: editingEvent.task,
            date: new Date(editingEvent.date),
            type: editingEvent.type,
            description: editingEvent.description,
          }
        : event,
    )

    // For now, we'll just log it
    console.log("Updated event:", editingEvent)
    console.log("Updated events:", updatedEvents)

    // Reset form and close dialog
    setIsEditMode(false)
    setEditingEvent({
      id: 0,
      title: "",
      project: "",
      task: "",
      date: new Date().toISOString().split("T")[0],
      type: "task",
      description: "",
    })

    // Show a success message
    alert("Evento actualizado correctamente")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-secondary dark:text-gray-200">Calendario</h1>
        <p className="text-muted-foreground">Visualiza y organiza tus tareas y eventos</p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col gap-4 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-xl font-semibold text-secondary dark:text-gray-200">
                {getMonthName(currentMonth)} {currentYear}
              </h2>
              <Button variant="outline" size="icon" onClick={handleNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="border rounded-md p-1 flex items-center gap-1 w-full sm:w-auto">
            <Button
              variant={view === "month" ? "default" : "ghost"}
              size="sm"
              onClick={() => setView("month")}
              className="rounded-sm"
            >
              Mes
            </Button>
            <Button
              variant={view === "week" ? "default" : "ghost"}
              size="sm"
              onClick={() => setView("week")}
              className="rounded-sm"
            >
              Semana
            </Button>
            <Button
              variant={view === "day" ? "default" : "ghost"}
              size="sm"
              onClick={() => setView("day")}
              className="rounded-sm"
            >
              Día
            </Button>
            <Button variant="ghost" size="sm" className="rounded-sm" onClick={handleTodayClick}>
              Hoy
            </Button>
            <div className="h-5 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>
            <Button variant="ghost" size="sm" className="rounded-sm flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-refresh-cw"
              >
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                <path d="M21 3v5h-5"></path>
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                <path d="M3 21v-5h5"></path>
              </svg>
              Sincronizar
            </Button>
            <div className="flex-1"></div>
            <Button className="rounded-sm ml-auto" size="sm" onClick={() => setIsAddTaskOpen(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Agregar Tarea
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
          <Select
            value={selectedFilters.project}
            onValueChange={(value) => setSelectedFilters({ ...selectedFilters, project: value })}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Proyecto" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los proyectos</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project} value={project}>
                  {project}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedFilters.task}
            onValueChange={(value) => setSelectedFilters({ ...selectedFilters, task: value })}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Tarea" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las tareas</SelectItem>
              {tasks.map((task) => (
                <SelectItem key={task} value={task}>
                  {task}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={view} onValueChange={setView} className="w-full">
        {/* TabsList removed, using custom buttons above instead */}

        <TabsContent value="month" className="mt-0">
          <Card className="border-primary/20 dark:border-gray-700">
            <CardContent className="p-4">
              <div className="grid grid-cols-7 gap-1">
                {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
                  <div key={day} className="text-center font-medium py-2 text-secondary dark:text-gray-300">
                    {day}
                  </div>
                ))}

                {generateCalendarDays().map((day, index) => {
                  const dayEvents = day ? getEventsForDay(day) : []

                  return (
                    <div
                      key={index}
                      className={`min-h-[120px] p-1 border ${day ? "bg-white dark:bg-[#0F2A41]" : "bg-gray-50 dark:bg-[#0A1F30]"} rounded-md dark:border-gray-700`}
                    >
                      {day && (
                        <>
                          <div className="text-right p-1">
                            <span
                              className={`text-sm ${new Date().getDate() === day && new Date().getMonth() === currentMonth && new Date().getFullYear() === currentYear ? "bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center ml-auto" : ""}`}
                            >
                              {day}
                            </span>
                          </div>
                          <div className="space-y-1 mt-1">
                            {dayEvents.slice(0, 3).map((event) => (
                              <div
                                key={event.id}
                                className={`text-xs p-1 rounded border ${getEventTypeColor(event.type)} truncate cursor-pointer hover:opacity-80`}
                                title={`${event.title} - ${event.project} (${event.task})`}
                                onClick={() => handleEventClick(event)}
                              >
                                {event.title}
                              </div>
                            ))}
                            {dayEvents.length > 3 && (
                              <div className="text-xs text-center text-muted-foreground">
                                +{dayEvents.length - 3} más
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="week" className="mt-0">
          <Card className="border-primary/20 dark:border-gray-700">
            <CardContent className="p-4">
              <div className="flex flex-col h-96">
                <div className="grid grid-cols-8 border-b">
                  <div className="p-2 border-r"></div>
                  {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day, index) => {
                    // Calculate the date for each day of the current week
                    const currentDate = new Date(currentYear, currentMonth, new Date().getDate())
                    const firstDayOfWeek = new Date(currentDate)
                    const dayOfWeek = currentDate.getDay()
                    firstDayOfWeek.setDate(currentDate.getDate() - dayOfWeek)

                    const date = new Date(firstDayOfWeek)
                    date.setDate(firstDayOfWeek.getDate() + index)

                    const isToday = date.toDateString() === new Date().toDateString()

                    return (
                      <div key={day} className={`p-2 text-center font-medium ${isToday ? "bg-primary/10" : ""}`}>
                        <div>{day}</div>
                        <div
                          className={`text-sm rounded-full w-6 h-6 flex items-center justify-center mx-auto ${isToday ? "bg-primary text-white" : ""}`}
                        >
                          {date.getDate()}
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="flex-1 overflow-y-auto">
                  <div className="grid grid-cols-8 h-full">
                    <div className="border-r">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="h-16 border-b p-1 text-xs text-right pr-2">
                          {i + 8}:00
                        </div>
                      ))}
                    </div>

                    {Array.from({ length: 7 }).map((_, dayIndex) => (
                      <div key={dayIndex} className="relative">
                        {Array.from({ length: 12 }).map((_, hourIndex) => (
                          <div key={hourIndex} className="h-16 border-b border-r p-1">
                            {/* Here we would render events for this day and hour */}
                            {filteredEvents
                              .filter((event) => {
                                const eventDate = new Date(event.date)
                                const currentDate = new Date(currentYear, currentMonth, new Date().getDate())
                                const firstDayOfWeek = new Date(currentDate)
                                const dayOfWeek = currentDate.getDay()
                                firstDayOfWeek.setDate(currentDate.getDate() - dayOfWeek)

                                const date = new Date(firstDayOfWeek)
                                date.setDate(firstDayOfWeek.getDate() + dayIndex)

                                return (
                                  eventDate.getDate() === date.getDate() &&
                                  eventDate.getMonth() === date.getMonth() &&
                                  eventDate.getFullYear() === date.getFullYear() &&
                                  eventDate.getHours() === hourIndex + 8
                                )
                              })
                              .map((event) => (
                                <div
                                  key={event.id}
                                  className={`text-xs p-1 rounded border ${getEventTypeColor(event.type)} truncate cursor-pointer hover:opacity-80`}
                                  title={`${event.title} - ${event.project} (${event.task})`}
                                  onClick={() => handleEventClick(event)}
                                >
                                  {event.title}
                                </div>
                              ))}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="day" className="mt-0">
          <Card className="border-primary/20 dark:border-gray-700">
            <CardContent className="p-4">
              <div className="flex flex-col h-96">
                <div className="text-center p-4 font-medium">
                  {new Date(currentYear, currentMonth, new Date().getDate()).toLocaleDateString("es-ES", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>

                <div className="flex-1 overflow-y-auto">
                  <div className="grid grid-cols-1 h-full">
                    {Array.from({ length: 14 }).map((_, i) => {
                      const hour = i + 7 // Start from 7 AM
                      const hourEvents = filteredEvents.filter((event) => {
                        const eventDate = new Date(event.date)
                        const today = new Date()
                        return (
                          eventDate.getDate() === today.getDate() &&
                          eventDate.getMonth() === today.getMonth() &&
                          eventDate.getFullYear() === today.getFullYear() &&
                          eventDate.getHours() === hour
                        )
                      })

                      return (
                        <div key={i} className="min-h-16 border-b p-2 flex">
                          <div className="w-16 text-right pr-4 font-medium text-sm">{hour}:00</div>
                          <div className="flex-1">
                            {hourEvents.map((event) => (
                              <div
                                key={event.id}
                                className={`mb-1 p-2 rounded border ${getEventTypeColor(event.type)} cursor-pointer hover:opacity-80`}
                                onClick={() => handleEventClick(event)}
                              >
                                <div className="font-medium">{event.title}</div>
                                <div className="text-xs">
                                  Proyecto: {event.project} | Tarea: {event.task}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Agregar Nueva Tarea</DialogTitle>
            <DialogDescription>Complete los detalles de la tarea para agregarla al calendario.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Fecha</Label>
                <Input
                  id="date"
                  type="date"
                  value={newTask.date}
                  onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="project">Proyecto</Label>
                <Select value={newTask.project} onValueChange={(value) => setNewTask({ ...newTask, project: value })}>
                  <SelectTrigger id="project">
                    <SelectValue placeholder="Seleccionar proyecto" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project} value={project}>
                        {project}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="task">Tarea</Label>
                <Select value={newTask.task} onValueChange={(value) => setNewTask({ ...newTask, task: value })}>
                  <SelectTrigger id="task">
                    <SelectValue placeholder="Seleccionar tarea" />
                  </SelectTrigger>
                  <SelectContent>
                    {tasks.map((task) => (
                      <SelectItem key={task} value={task}>
                        {task}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select value={newTask.type} onValueChange={(value) => setNewTask({ ...newTask, type: value })}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="task">Tarea</SelectItem>
                  <SelectItem value="meeting">Reunión</SelectItem>
                  <SelectItem value="deadline">Fecha límite</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsAddTaskOpen(false)}>
              Cancelar
            </Button>
            <Button type="button" onClick={handleAddTask}>
              Agregar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[500px]">
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span
                    className={`inline-block w-3 h-3 rounded-full ${
                      selectedEvent.type === "deadline"
                        ? "bg-red-500"
                        : selectedEvent.type === "meeting"
                          ? "bg-blue-500"
                          : "bg-green-500"
                    }`}
                  ></span>
                  {selectedEvent.title}
                </DialogTitle>
                <DialogDescription>
                  {new Date(selectedEvent.date).toLocaleDateString("es-ES", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Proyecto</h4>
                    <p className="text-sm">{selectedEvent.project}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Tarea</h4>
                    <p className="text-sm">{selectedEvent.task}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Tipo</h4>
                  <p className="text-sm capitalize">
                    {selectedEvent.type === "deadline"
                      ? "Fecha límite"
                      : selectedEvent.type === "meeting"
                        ? "Reunión"
                        : "Tarea"}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Descripción</h4>
                  <p className="text-sm">{selectedEvent.description || "No hay descripción disponible."}</p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
                  Cerrar
                </Button>
                <Button onClick={handleEditEvent}>Editar</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={isEditMode} onOpenChange={setIsEditMode}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Evento</DialogTitle>
            <DialogDescription>Modifique los detalles del evento.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Título</Label>
                <Input
                  id="edit-title"
                  value={editingEvent.title}
                  onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-date">Fecha</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={editingEvent.date}
                  onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-project">Proyecto</Label>
                <Select
                  value={editingEvent.project}
                  onValueChange={(value) => setEditingEvent({ ...editingEvent, project: value })}
                >
                  <SelectTrigger id="edit-project">
                    <SelectValue placeholder="Seleccionar proyecto" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project} value={project}>
                        {project}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-task">Tarea</Label>
                <Select
                  value={editingEvent.task}
                  onValueChange={(value) => setEditingEvent({ ...editingEvent, task: value })}
                >
                  <SelectTrigger id="edit-task">
                    <SelectValue placeholder="Seleccionar tarea" />
                  </SelectTrigger>
                  <SelectContent>
                    {tasks.map((task) => (
                      <SelectItem key={task} value={task}>
                        {task}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-type">Tipo</Label>
              <Select
                value={editingEvent.type}
                onValueChange={(value) => setEditingEvent({ ...editingEvent, type: value })}
              >
                <SelectTrigger id="edit-type">
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="task">Tarea</SelectItem>
                  <SelectItem value="meeting">Reunión</SelectItem>
                  <SelectItem value="deadline">Fecha límite</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Descripción</Label>
              <Textarea
                id="edit-description"
                value={editingEvent.description}
                onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsEditMode(false)}>
              Cancelar
            </Button>
            <Button type="button" onClick={handleSaveEdit}>
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
