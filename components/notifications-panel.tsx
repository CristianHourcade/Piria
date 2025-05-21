"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Bell, Check, Clock, FileCheck, CreditCard, X, ChevronDown, Gift, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import Link from "next/link"

// Tipos para las notificaciones
type NotificationType = "plazo" | "aprobacion" | "pago" | "tarea" | "cumpleanos" | "asignacion"
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
]

export function NotificationsPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  const [activeTab, setActiveTab] = useState("todas")

  const unreadCount = notifications.filter((n) => !n.read).length

  // Filtrar notificaciones según la pestaña activa
  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "todas") return true
    if (activeTab === "no-leidas") return !notification.read
    if (activeTab === "plazos") return notification.type === "plazo"
    if (activeTab === "aprobaciones") return notification.type === "aprobacion"
    if (activeTab === "cumpleanos") return notification.type === "cumpleanos"
    return true
  })

  // Agrupar notificaciones por tipo
  const plazosEntrega = filteredNotifications.filter((n) => n.type === "plazo")
  const aprobacionesPendientes = filteredNotifications.filter((n) => n.type === "aprobacion")
  const recordatoriosPago = filteredNotifications.filter((n) => n.type === "pago")
  const tareas = filteredNotifications.filter((n) => n.type === "tarea")
  const cumpleanos = filteredNotifications.filter((n) => n.type === "cumpleanos")

  // Marcar todas como leídas
  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  // Marcar una notificación como leída
  const markAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  // Cerrar notificación
  const dismissNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  // Obtener icono según el tipo de notificación
  const getNotificationIcon = (type: NotificationType, status: NotificationStatus) => {
    if (type === "plazo") {
      return <Clock className={cn("h-4 w-4", status === "vencida" ? "text-red-500" : "text-yellow-500")} />
    }
    if (type === "aprobacion") {
      return <FileCheck className="h-4 w-4 text-primary" />
    }
    if (type === "pago") {
      return <CreditCard className="h-4 w-4 text-red-500" />
    }
    if (type === "tarea") {
      if (status === "completada") {
        return <Check className="h-4 w-4 text-green-500" />
      }
      return <Clock className="h-4 w-4 text-blue-500" />
    }
    if (type === "cumpleanos") {
      return <Gift className="h-4 w-4 text-pink-500" /> // Importar Gift de lucide-react
    }
    if (type === "asignacion") {
      return <UserPlus className="h-4 w-4 text-purple-500" />
    }
    return <Bell className="h-4 w-4" />
  }

  // Cerrar el panel al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const panel = document.getElementById("notifications-panel")
      const button = document.getElementById("notifications-button")

      if (
        panel &&
        button &&
        !panel.contains(event.target as Node) &&
        !button.contains(event.target as Node) &&
        isOpen
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="relative">
      {/* Botón de notificaciones */}
      <Button
        id="notifications-button"
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge
            className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white"
            variant="destructive"
          >
            {unreadCount}
          </Badge>
        )}
      </Button>

      {/* Panel de notificaciones */}
      {isOpen && (
        <div
          id="notifications-panel"
          className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50"
        >
          <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="font-medium text-secondary dark:text-gray-200">Notificaciones</h3>
            <Button variant="ghost" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
              Marcar todas como leídas
            </Button>
          </div>

          <Tabs defaultValue="todas" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full border-b border-gray-200 dark:border-gray-700 bg-transparent">
              <TabsTrigger
                value="todas"
                className="flex-1 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
              >
                Todas
              </TabsTrigger>
              <TabsTrigger
                value="no-leidas"
                className="flex-1 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
              >
                No leídas
              </TabsTrigger>
              <TabsTrigger
                value="plazos"
                className="flex-1 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
              >
                Plazos
              </TabsTrigger>
              <TabsTrigger
                value="aprobaciones"
                className="flex-1 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
              >
                Aprobaciones
              </TabsTrigger>
              <TabsTrigger
                value="cumpleanos"
                className="flex-1 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
              >
                Cumpleaños
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="max-h-[400px] overflow-y-auto">
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {/* Plazos de entrega */}
                {plazosEntrega.length > 0 && (
                  <div className="py-2">
                    <div className="px-3 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center justify-between">
                      <span>PLAZOS DE ENTREGA</span>
                      <ChevronDown className="h-3 w-3" />
                    </div>
                    {plazosEntrega.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        icon={getNotificationIcon(notification.type, notification.status)}
                        onMarkAsRead={markAsRead}
                        onDismiss={dismissNotification}
                      />
                    ))}
                  </div>
                )}

                {/* Tareas */}
                {tareas.length > 0 && (
                  <div className="py-2">
                    <div className="px-3 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center justify-between">
                      <span>TAREAS</span>
                      <ChevronDown className="h-3 w-3" />
                    </div>
                    {tareas.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        icon={getNotificationIcon(notification.type, notification.status)}
                        onMarkAsRead={markAsRead}
                        onDismiss={dismissNotification}
                      />
                    ))}
                  </div>
                )}

                {/* Aprobaciones pendientes */}
                {aprobacionesPendientes.length > 0 && (
                  <div className="py-2">
                    <div className="px-3 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center justify-between">
                      <span>APROBACIONES PENDIENTES</span>
                      <ChevronDown className="h-3 w-3" />
                    </div>
                    {aprobacionesPendientes.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        icon={getNotificationIcon(notification.type, notification.status)}
                        onMarkAsRead={markAsRead}
                        onDismiss={dismissNotification}
                      />
                    ))}
                  </div>
                )}

                {/* Recordatorios de pago */}
                {recordatoriosPago.length > 0 && (
                  <div className="py-2">
                    <div className="px-3 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center justify-between">
                      <span>RECORDATORIOS DE PAGO</span>
                      <ChevronDown className="h-3 w-3" />
                    </div>
                    {recordatoriosPago.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        icon={getNotificationIcon(notification.type, notification.status)}
                        onMarkAsRead={markAsRead}
                        onDismiss={dismissNotification}
                      />
                    ))}
                  </div>
                )}

                {/* Cumpleaños */}
                {cumpleanos.length > 0 && (
                  <div className="py-2">
                    <div className="px-3 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center justify-between">
                      <span>CUMPLEAÑOS</span>
                      <ChevronDown className="h-3 w-3" />
                    </div>
                    {cumpleanos.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        icon={getNotificationIcon(notification.type, notification.status)}
                        onMarkAsRead={markAsRead}
                        onDismiss={dismissNotification}
                      />
                    ))}
                  </div>
                )}

                {/* Asignaciones de tareas */}
                {filteredNotifications.filter((n) => n.type === "asignacion").length > 0 && (
                  <div className="py-2">
                    <div className="px-3 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center justify-between">
                      <span>ASIGNACIONES DE TAREAS</span>
                      <ChevronDown className="h-3 w-3" />
                    </div>
                    {filteredNotifications
                      .filter((n) => n.type === "asignacion")
                      .map((notification) => (
                        <NotificationItem
                          key={notification.id}
                          notification={notification}
                          icon={getNotificationIcon(notification.type, notification.status)}
                          onMarkAsRead={markAsRead}
                          onDismiss={dismissNotification}
                        />
                      ))}
                  </div>
                )}

                {/* Si no hay notificaciones */}
                {filteredNotifications.length === 0 && (
                  <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                    <Bell className="mx-auto h-8 w-8 mb-2 opacity-50" />
                    <p>No hay notificaciones</p>
                  </div>
                )}
              </div>

              {filteredNotifications.length > 0 && (
                <div className="p-2 text-center border-t border-gray-200 dark:border-gray-700">
                  <Link href="/colaborador/notificaciones" passHref>
                    <Button variant="link" className="text-primary text-sm" onClick={() => setIsOpen(false)}>
                      Ver todas las notificaciones
                    </Button>
                  </Link>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}

// Componente para cada elemento de notificación
function NotificationItem({
  notification,
  icon,
  onMarkAsRead,
  onDismiss,
}: {
  notification: Notification
  icon: React.ReactNode
  onMarkAsRead: (id: string) => void
  onDismiss: (id: string) => void
}) {
  return (
    <div
      className={cn(
        "px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-start gap-2",
        !notification.read && "bg-primary/5",
      )}
    >
      <div className="mt-0.5">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h4 className="text-sm font-medium text-secondary dark:text-gray-200 truncate">{notification.title}</h4>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 -mr-1 -mt-1 text-gray-400 hover:text-gray-500"
            onClick={() => onDismiss(notification.id)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{notification.description}</p>
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-gray-500 dark:text-gray-500">{notification.client}</span>
          <span className="text-xs text-gray-500 dark:text-gray-500">{notification.date}</span>
        </div>
      </div>
    </div>
  )
}
