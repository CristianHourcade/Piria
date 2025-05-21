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
import { fetchTasks } from "@/services/tasks"
import { useEffect } from "react"
import { fetchEmployees } from "@/services/employees"
import { Employee } from "@/types/employee"
import { fetchClients } from "@/services/clients"

export default function CalendarioPage() {
  const [view, setView] = useState("month")
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [selectedFilters, setSelectedFilters] = useState({
    client: "",
    service: "",
    responsible: "",
  })
  const [events, setEvents] = useState([])
 
  // New state for the add task dialog
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [newTask, setNewTask] = useState({
    title: "",
    client: "",
    service: "",
    responsible: "",
    date: new Date().toISOString().split("T")[0],
    type: "task",
    description: "",
  })

  // Add a new state for the selected event and detail dialog
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  // Get unique clients, services, and responsibles
  const clients = Array.from(new Set(events.map((event) => event.client)))
  const services = Array.from(new Set(events.map((event) => event.service)))
  const responsibles = Array.from(new Set(events.map((event) => event.responsible)))

  // Filter events
  const filteredEvents = events.filter(
    (event) =>
      (selectedFilters.client === "" || event.client === selectedFilters.client) &&
      (selectedFilters.service === "" || event.service === selectedFilters.service) &&
      (selectedFilters.responsible === "" || event.responsible === selectedFilters.responsible),
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


  useEffect(() => {
   
  }, []);

   useEffect(() => {
    const loadEvents = async () => {
      const tasks = await fetchTasks()
      const personal = await fetchEmployees();
      const clients = await fetchClients();
      const calendarEvents = tasks.map((task) => ({
        id: task.id,
        title: task.title,
        client: clients.find(col => col.id == task.client_id)?.name,
        service: task.name,
        responsible:  personal.find(col => col.id == task.assignee)?.name,
        date: new Date(task.due_date),
        type: "task",
      }))
      setEvents(calendarEvents)
    }

    loadEvents()
  }, [currentMonth, currentYear])
  // const getClientName = (id: number) => {
  //   return clients.find(client => client.id === id)?.name || "Desconocido"
  // }

  const getCollaboratorName = (id: string | number) => {
    return collaborators.find(col => col.id == id)?.name || "Desconocido"
  }

  // Add a function to handle adding a new task
  const handleAddTask = () => {
    // In a real app, this would save to a database
    const newEvent = {
      id: events.length + 1,
      title: newTask.title,
      client: newTask.client,
      service: newTask.service,
      responsible: newTask.responsible,
      date: new Date(newTask.date),
      type: newTask.type,
    }

    // For now, we'll just log it
    console.log("New task:", newEvent)

    // Reset form and close dialog
    setNewTask({
      title: "",
      client: "",
      service: "",
      responsible: "",
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-secondary dark:text-gray-200">Calendario</h1>
        <p className="text-muted-foreground">
          Organiza y anticipa cargas de trabajo. Filtra por colaborador para ver sus tareas específicas.
        </p>
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

          <div className="border rounded-md p-1 flex items-center gap-1  sm:w-auto">
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
            <Button variant="ghost" size="sm" className="rounded-sm">
              Hoy
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
          <Select
            value={selectedFilters.client}
            onValueChange={(value) => setSelectedFilters({ ...selectedFilters, client: value })}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Cliente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los clientes</SelectItem>
              {clients.map((client) => (
                <SelectItem key={client} value={client}>
                  {client}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedFilters.service}
            onValueChange={(value) => setSelectedFilters({ ...selectedFilters, service: value })}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Servicio" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los servicios</SelectItem>
              {services.map((service) => (
                <SelectItem key={service} value={service}>
                  {service}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedFilters.responsible}
            onValueChange={(value) => setSelectedFilters({ ...selectedFilters, responsible: value })}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Colaborador" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los colaboradores</SelectItem>
              {responsibles.map((responsible) => (
                <SelectItem key={responsible} value={responsible}>
                  {responsible}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={view} onValueChange={setView} className="w-full">
        {/* TabsList removed, using custom buttons above instead */}

        <TabsContent value="month" className="mt-0">
          <Card className="border-primary/20">
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
                                title={`${event.title} - ${event.client} (${event.responsible})`}
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
          <Card className="border-primary/20">
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
                                  title={`${event.title} - ${event.client} (${event.responsible})`}
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
          <Card className="border-primary/20">
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
                                  Cliente: {event.client} | Responsable: {event.responsible}
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
                <Label htmlFor="client">Cliente</Label>
                <Select value={newTask.client} onValueChange={(value) => setNewTask({ ...newTask, client: value })}>
                  <SelectTrigger id="client">
                    <SelectValue placeholder="Seleccionar cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client} value={client}>
                        {client}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="service">Servicio</Label>
                <Select value={newTask.service} onValueChange={(value) => setNewTask({ ...newTask, service: value })}>
                  <SelectTrigger id="service">
                    <SelectValue placeholder="Seleccionar servicio" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service} value={service}>
                        {service}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="responsible">Responsable</Label>
                <Select
                  value={newTask.responsible}
                  onValueChange={(value) => setNewTask({ ...newTask, responsible: value })}
                >
                  <SelectTrigger id="responsible">
                    <SelectValue placeholder="Seleccionar responsable" />
                  </SelectTrigger>
                  <SelectContent>
                    {responsibles.map((responsible) => (
                      <SelectItem key={responsible} value={responsible}>
                        {responsible}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                    className={`inline-block w-3 h-3 rounded-full ${selectedEvent.type === "deadline"
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
                    <h4 className="text-sm font-medium mb-1">Cliente</h4>
                    <p className="text-sm">{selectedEvent.client}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Servicio</h4>
                    <p className="text-sm">{selectedEvent.service}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Responsable</h4>
                  <p className="text-sm">{selectedEvent.responsible}</p>
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
                <Button>Editar</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
