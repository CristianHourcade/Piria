"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Clock, CheckCircle, Info, X, Filter, UserPlus, CreditCard, FileCheck, Gift } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

// Tipos para las notificaciones
type NotificationType =
  | "plazo"
  | "aprobacion"
  | "pago"
  | "tarea"
  | "cumpleanos"
  | "asignacion"
  | "comentario"
  | "sistema"
type NotificationStatus = "pendiente" | "vencida" | "completada" | "iniciada"

interface Notification {
  id: string
  type: NotificationType
  title: string
  description: string
  client: string
  date: string
  status: NotificationStatus
  read: boolean
}

// Datos de ejemplo para las notificaciones
const initialNotifications: Notification[] = [
  {
    id: "1",
    type: "plazo",
    title: "Entrega próxima",
    description: "Informe mensual para Cliente XYZ vence pronto",
    client: "Cliente XYZ",
    date: "5/4/2023",
    status: "pendiente",
    read: false,
  },
  {
    id: "2",
    type: "plazo",
    title: "Tarea vencida",
    description: "Publicación de contenido para Cliente ABC atrasada",
    client: "Cliente ABC",
    date: "4/4/2023",
    status: "vencida",
    read: false,
  },
  {
    id: "3",
    type: "tarea",
    title: "Tarea completada",
    description: "Diseño de banner para Cliente DEF",
    client: "Cliente DEF",
    date: "3/4/2023",
    status: "completada",
    read: true,
  },
  {
    id: "4",
    type: "tarea",
    title: "Tarea iniciada",
    description: "Crear contenido a publicar en Instagram para Cliente MNO",
    client: "Cliente MNO",
    date: "3/4/2023",
    status: "iniciada",
    read: false,
  },
  {
    id: "5",
    type: "aprobacion",
    title: "Aprobación pendiente",
    description: "Diseño de logotipo para Cliente GHI requiere aprobación",
    client: "Cliente GHI",
    date: "3/4/2023",
    status: "pendiente",
    read: false,
  },
  {
    id: "6",
    type: "pago",
    title: "Pago pendiente",
    description: "Cliente JKL tiene un pago vencido de 7 días",
    client: "Cliente JKL",
    date: "2/4/2023",
    status: "vencida",
    read: false,
  },
  {
    id: "7",
    type: "cumpleanos",
    title: "Cumpleaños hoy",
    description: "Juan Pérez cumple años hoy",
    client: "Juan Pérez",
    date: "15/4/2023",
    status: "pendiente",
    read: false,
  },
  {
    id: "8",
    type: "cumpleanos",
    title: "Cumpleaños próximo",
    description: "María González cumple años en 3 días",
    client: "María González",
    date: "22/7/2023",
    status: "pendiente",
    read: false,
  },
  {
    id: "9",
    type: "asignacion",
    title: "Tarea asignada",
    description: "Te han asignado la tarea 'Diseño de banner promocional'",
    client: "Cliente XYZ",
    date: "15/4/2023",
    status: "pendiente",
    read: false,
  },
  {
    id: "10",
    type: "asignacion",
    title: "Tarea reasignada",
    description: "Has asignado la tarea 'Actualizar contenido web' a Laura Martínez",
    client: "Cliente ABC",
    date: "15/4/2023",
    status: "pendiente",
    read: false,
  },
  {
    id: "11",
    type: "comentario",
    title: "Nuevo comentario",
    description: "Carlos ha comentado en la tarea 'Diseño de logo'",
    client: "Cliente PQR",
    date: "14/4/2023",
    status: "pendiente",
    read: false,
  },
  {
    id: "12",
    type: "sistema",
    title: "Actualización del sistema",
    description: "Se ha actualizado el sistema a la versión 2.3.0",
    client: "Sistema",
    date: "13/4/2023",
    status: "completada",
    read: true,
  },
  {
    id: "13",
    type: "plazo",
    title: "Recordatorio de entrega",
    description: "La entrega del proyecto 'Rediseño Web' está programada para mañana",
    client: "Cliente STU",
    date: "12/4/2023",
    status: "pendiente",
    read: false,
  },
  {
    id: "14",
    type: "tarea",
    title: "Tarea pausada",
    description: "La tarea 'Desarrollo de API' ha sido pausada",
    client: "Cliente VWX",
    date: "11/4/2023",
    status: "pendiente",
    read: true,
  },
  {
    id: "15",
    type: "aprobacion",
    title: "Diseño aprobado",
    description: "El cliente ha aprobado el diseño de la página de inicio",
    client: "Cliente YZA",
    date: "10/4/2023",
    status: "completada",
    read: true,
  },
]

export default function NotificacionesPage() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  const [activeTab, setActiveTab] = useState("todas")
  const [activeTypeFilter, setActiveTypeFilter] = useState<string | null>(null)

  const unreadCount = notifications.filter((alert) => !alert.read).length

  // Filtrar notificaciones según la pestaña activa y el tipo seleccionado
  const filteredNotifications = notifications.filter((notification) => {
    // Filtro por pestaña
    if (activeTab === "todas") {
      // No filtrar por estado de lectura
    } else if (activeTab === "no-leidas" && notification.read) {
      return false
    } else if (activeTab === "leidas" && !notification.read) {
      return false
    }

    // Filtro por tipo
    if (activeTypeFilter && notification.type !== activeTypeFilter) {
      return false
    }

    return true
  })

  const handleMarkAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
  }

  const handleDeleteNotification = (id: string) => {
    setNotifications(notifications.filter((notification) => notification.id !== id))
  }

  // Obtener icono según el tipo de notificación
  const getNotificationIcon = (type: NotificationType, status: NotificationStatus) => {
    if (type === "plazo") {
      return <Clock className={cn("h-5 w-5", status === "vencida" ? "text-red-500" : "text-yellow-500")} />
    }
    if (type === "aprobacion") {
      return <FileCheck className="h-5 w-5 text-primary" />
    }
    if (type === "pago") {
      return <CreditCard className="h-5 w-5 text-red-500" />
    }
    if (type === "tarea") {
      if (status === "completada") {
        return <CheckCircle className="h-5 w-5 text-green-500" />
      }
      return <Clock className="h-5 w-5 text-blue-500" />
    }
    if (type === "cumpleanos") {
      return <Gift className="h-5 w-5 text-pink-500" />
    }
    if (type === "asignacion") {
      return <UserPlus className="h-5 w-5 text-purple-500" />
    }
    if (type === "comentario") {
      return <Info className="h-5 w-5 text-blue-500" />
    }
    if (type === "sistema") {
      return <Bell className="h-5 w-5 text-gray-500" />
    }
    return <Bell className="h-5 w-5" />
  }

  // Obtener color de prioridad
  const getPriorityColor = (status: NotificationStatus) => {
    switch (status) {
      case "vencida":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      case "pendiente":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
      case "iniciada":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      case "completada":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  // Obtener etiqueta de tipo
  const getTypeLabel = (type: NotificationType) => {
    switch (type) {
      case "plazo":
        return "Plazo"
      case "aprobacion":
        return "Aprobación"
      case "pago":
        return "Pago"
      case "tarea":
        return "Tarea"
      case "cumpleanos":
        return "Cumpleaños"
      case "asignacion":
        return "Asignación"
      case "comentario":
        return "Comentario"
      case "sistema":
        return "Sistema"
      default:
        return "Otro"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-secondary dark:text-gray-200">Notificaciones</h1>
          <p className="text-muted-foreground">Gestiona todas tus notificaciones</p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" onClick={handleMarkAllAsRead}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Marcar todas como leídas
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filtrar por tipo</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setActiveTypeFilter(null)}>Todos los tipos</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTypeFilter("plazo")}>Plazos</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTypeFilter("tarea")}>Tareas</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTypeFilter("aprobacion")}>Aprobaciones</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTypeFilter("pago")}>Pagos</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTypeFilter("cumpleanos")}>Cumpleaños</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTypeFilter("asignacion")}>Asignaciones</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTypeFilter("comentario")}>Comentarios</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTypeFilter("sistema")}>Sistema</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-gray-100 dark:bg-gray-800">
          <TabsTrigger value="todas" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            Todas ({notifications.length})
          </TabsTrigger>
          <TabsTrigger value="no-leidas" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            No leídas ({unreadCount})
          </TabsTrigger>
          <TabsTrigger value="leidas" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            Leídas ({notifications.length - unreadCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <Card className="border-primary/20 dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-secondary dark:text-gray-200 flex justify-between items-center">
                <span>Notificaciones</span>
                {activeTypeFilter && (
                  <Badge variant="outline" className="ml-2">
                    Filtrando por: {getTypeLabel(activeTypeFilter as NotificationType)}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1 -mr-1"
                      onClick={() => setActiveTypeFilter(null)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No hay notificaciones</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredNotifications.map((notification) => {
                    const icon = getNotificationIcon(notification.type, notification.status)
                    const isOverdue = notification.status === "vencida"

                    return (
                      <div
                        key={notification.id}
                        className={`p-4 rounded-lg border ${notification.read ? "bg-gray-50 dark:bg-gray-800/50" : "bg-white dark:bg-gray-800"} dark:border-gray-700 relative ${!notification.read ? "shadow-sm" : ""}`}
                      >
                        <div className="flex items-start">
                          <div className={`p-2 rounded-full ${getPriorityColor(notification.status)} mr-4`}>{icon}</div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium text-secondary dark:text-gray-200">{notification.title}</h3>
                              <div className="flex items-center space-x-2">
                                <Badge className={getPriorityColor(notification.status)}>{notification.status}</Badge>
                                <Badge variant="outline">{getTypeLabel(notification.type)}</Badge>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleDeleteNotification(notification.id)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{notification.description}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-muted-foreground">{notification.client}</span>
                              <span
                                className={`text-xs ${isOverdue ? "text-red-600 dark:text-red-400" : "text-muted-foreground"}`}
                              >
                                {notification.date}
                              </span>
                            </div>
                          </div>
                        </div>
                        {!notification.read && (
                          <div className="mt-3 flex justify-end">
                            <Button variant="outline" size="sm" onClick={() => handleMarkAsRead(notification.id)}>
                              <CheckCircle className="mr-2 h-3 w-3" />
                              Marcar como leída
                            </Button>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
