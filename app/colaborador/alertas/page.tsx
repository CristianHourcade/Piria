"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Calendar, Clock, CheckCircle, AlertTriangle, Info, X } from "lucide-react"

// Mock data for alerts
const ALERTS = [
  {
    id: 1,
    title: "Tarea próxima a vencer",
    description: "Diseño de banner para redes sociales",
    project: "Campaña Redes Sociales",
    dueDate: "2023-04-15",
    priority: "Alta",
    type: "deadline",
    read: false,
  },
  {
    id: 2,
    title: "Reunión programada",
    description: "Reunión de seguimiento con el cliente",
    project: "Rediseño Web Corporativa",
    dueDate: "2023-04-18",
    priority: "Media",
    type: "meeting",
    read: false,
  },
  {
    id: 3,
    title: "Nueva tarea asignada",
    description: "Optimización de meta tags para SEO",
    project: "Optimización SEO",
    dueDate: "2023-04-20",
    priority: "Media",
    type: "task",
    read: false,
  },
  {
    id: 4,
    title: "Comentario en tarea",
    description: "El cliente envió nuevas imágenes para incluir",
    project: "Rediseño Web Corporativa",
    dueDate: null,
    priority: "Baja",
    type: "comment",
    read: true,
  },
  {
    id: 5,
    title: "Tarea vencida",
    description: "Programar publicaciones en redes sociales",
    project: "Gestión de Redes Sociales",
    dueDate: "2023-04-10",
    priority: "Alta",
    type: "overdue",
    read: true,
  },
]

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

// Get alert type info
const getAlertTypeInfo = (type: string) => {
  switch (type) {
    case "deadline":
      return {
        icon: <Clock className="h-5 w-5 text-yellow-500" />,
        color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
      }
    case "meeting":
      return {
        icon: <Calendar className="h-5 w-5 text-blue-500" />,
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      }
    case "task":
      return {
        icon: <Info className="h-5 w-5 text-primary" />,
        color: "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground",
      }
    case "comment":
      return {
        icon: <Info className="h-5 w-5 text-gray-500" />,
        color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
      }
    case "overdue":
      return {
        icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
        color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
      }
    default:
      return {
        icon: <Info className="h-5 w-5 text-gray-500" />,
        color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
      }
  }
}

export default function AlertasPage() {
  const [alerts, setAlerts] = useState(ALERTS)
  const [activeTab, setActiveTab] = useState("all")

  const unreadAlerts = alerts.filter((alert) => !alert.read)
  const readAlerts = alerts.filter((alert) => alert.read)

  const displayedAlerts = activeTab === "all" ? alerts : activeTab === "unread" ? unreadAlerts : readAlerts

  const handleMarkAsRead = (id: number) => {
    setAlerts(alerts.map((alert) => (alert.id === id ? { ...alert, read: true } : alert)))
  }

  const handleMarkAllAsRead = () => {
    setAlerts(alerts.map((alert) => ({ ...alert, read: true })))
  }

  const handleDeleteAlert = (id: number) => {
    setAlerts(alerts.filter((alert) => alert.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-secondary dark:text-gray-200">Alertas</h1>
          <p className="text-muted-foreground">Mantente al día con tus notificaciones</p>
        </div>
        {unreadAlerts.length > 0 && (
          <Button variant="outline" onClick={handleMarkAllAsRead}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Marcar todas como leídas
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-gray-100 dark:bg-gray-800">
          <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            Todas ({alerts.length})
          </TabsTrigger>
          <TabsTrigger value="unread" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            No leídas ({unreadAlerts.length})
          </TabsTrigger>
          <TabsTrigger value="read" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            Leídas ({readAlerts.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <Card className="border-primary/20 dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-secondary dark:text-gray-200">Notificaciones</CardTitle>
            </CardHeader>
            <CardContent>
              {displayedAlerts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No hay notificaciones</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {displayedAlerts.map((alert) => {
                    const { icon, color } = getAlertTypeInfo(alert.type)
                    const isOverdue = alert.type === "overdue"

                    return (
                      <div
                        key={alert.id}
                        className={`p-4 rounded-lg border ${alert.read ? "bg-gray-50 dark:bg-gray-800/50" : "bg-white dark:bg-gray-800"} dark:border-gray-700 relative ${!alert.read ? "shadow-sm" : ""}`}
                      >
                        <div className="flex items-start">
                          <div className={`p-2 rounded-full ${color} mr-4`}>{icon}</div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium text-secondary dark:text-gray-200">{alert.title}</h3>
                              <div className="flex items-center space-x-2">
                                <Badge className={getPriorityColor(alert.priority)}>{alert.priority}</Badge>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleDeleteAlert(alert.id)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-muted-foreground">{alert.project}</span>
                              {alert.dueDate && (
                                <span
                                  className={`text-xs ${isOverdue ? "text-red-600 dark:text-red-400" : "text-muted-foreground"}`}
                                >
                                  {isOverdue ? "Vencido: " : "Fecha: "}
                                  {new Date(alert.dueDate).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        {!alert.read && (
                          <div className="mt-3 flex justify-end">
                            <Button variant="outline" size="sm" onClick={() => handleMarkAsRead(alert.id)}>
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
