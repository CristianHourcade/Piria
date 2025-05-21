"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

// Datos de actividad reciente (expandidos para la página completa)
const recentActivity = [
  {
    id: 1,
    type: "client",
    user: "Flor",
    date: "10 de abril, 2023 11:30",
    content: "Cliente Ejemplo: Cliente creado y asignado a Nahue y Carla",
    avatar: "F",
  },
  {
    id: 2,
    type: "service",
    user: "Flor",
    date: "10 de abril, 2023 11:35",
    content: "Community Manager: Servicio asignado a Nahue",
    avatar: "F",
  },
  {
    id: 3,
    type: "task",
    user: "Flor",
    date: "10 de abril, 2023 12:00",
    content: "Redactar copies para posts: Tarea creada y asignada a Nahue",
    avatar: "F",
  },
  {
    id: 4,
    type: "status",
    user: "Nahue",
    date: "11 de abril, 2023 07:15",
    content: "Redactar copies para posts: Estado cambiado a En Proceso",
    avatar: "N",
  },
  {
    id: 5,
    type: "comment",
    user: "Nahue",
    date: "11 de abril, 2023 07:20",
    content: "Redactar copies para posts: Comentario: Necesito más información sobre el tono de voz a utilizar",
    avatar: "N",
  },
  {
    id: 6,
    type: "client",
    user: "Carla",
    date: "12 de abril, 2023 09:45",
    content: "Empresa XYZ: Cliente creado y asignado a Flor",
    avatar: "C",
  },
  {
    id: 7,
    type: "service",
    user: "Carla",
    date: "12 de abril, 2023 10:00",
    content: "Diseño Web: Servicio asignado a Flor y Nahue",
    avatar: "C",
  },
  {
    id: 8,
    type: "task",
    user: "Flor",
    date: "12 de abril, 2023 14:30",
    content: "Crear wireframes: Tarea creada y asignada a Nahue",
    avatar: "F",
  },
  {
    id: 9,
    type: "status",
    user: "Nahue",
    date: "13 de abril, 2023 08:20",
    content: "Crear wireframes: Estado cambiado a Completado",
    avatar: "N",
  },
  {
    id: 10,
    type: "comment",
    user: "Flor",
    date: "13 de abril, 2023 09:15",
    content: "Crear wireframes: Comentario: Excelente trabajo, procedemos con el diseño final",
    avatar: "F",
  },
  {
    id: 11,
    type: "client",
    user: "Nahue",
    date: "14 de abril, 2023 10:30",
    content: "Consultora ABC: Cliente creado y asignado a Carla",
    avatar: "N",
  },
  {
    id: 12,
    type: "service",
    user: "Nahue",
    date: "14 de abril, 2023 10:45",
    content: "SEO: Servicio asignado a Carla",
    avatar: "N",
  },
  {
    id: 13,
    type: "task",
    user: "Carla",
    date: "14 de abril, 2023 13:00",
    content: "Auditoría SEO inicial: Tarea creada y asignada a Carla",
    avatar: "C",
  },
  {
    id: 14,
    type: "status",
    user: "Carla",
    date: "15 de abril, 2023 11:30",
    content: "Auditoría SEO inicial: Estado cambiado a En Proceso",
    avatar: "C",
  },
  {
    id: 15,
    type: "comment",
    user: "Nahue",
    date: "15 de abril, 2023 16:45",
    content: "Auditoría SEO inicial: Comentario: ¿Necesitas ayuda con alguna parte de la auditoría?",
    avatar: "N",
  },
]

export default function ActividadPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterUser, setFilterUser] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [activeTab, setActiveTab] = useState("all")

  // Obtener usuarios únicos para el filtro
  const uniqueUsers = [...new Set(recentActivity.map((activity) => activity.user))]

  // Filtrar actividades según los criterios
  const filteredActivities = recentActivity.filter((activity) => {
    const matchesSearch =
      activity.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.user.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesUser = filterUser === "all" || activity.user === filterUser
    const matchesType = filterType === "all" || activity.type === filterType
    const matchesTab = activeTab === "all" || activity.type === activeTab

    return matchesSearch && matchesUser && matchesType && matchesTab
  })

  // Componente para los elementos de actividad
  function ActivityItem({ activity }) {
    const getActivityIcon = (type) => {
      switch (type) {
        case "client":
          return (
            <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-2 rounded-full" />
          )
        case "service":
          return (
            <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 p-2 rounded-full" />
          )
        case "task":
          return <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-2 rounded-full" />
        case "status":
          return (
            <div className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 p-2 rounded-full" />
          )
        case "comment":
          return (
            <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 p-2 rounded-full" />
          )
        default:
          return <div className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 p-2 rounded-full" />
      }
    }

    return (
      <div className="flex items-start space-x-3 p-4 border-b dark:border-gray-700 last:border-0">
        <Avatar className="h-8 w-8 bg-primary text-white">
          <AvatarFallback>{activity.avatar}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">{activity.user}</p>
            <span className="text-xs text-muted-foreground">{activity.date}</span>
          </div>
          <p className="text-sm text-muted-foreground">{activity.content}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => router.back()} aria-label="Volver">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-secondary dark:text-gray-200">Actividad Reciente</h1>
          <p className="text-muted-foreground">Historial de actividades en el sistema</p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-secondary dark:text-gray-200">Filtros</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Input
                placeholder="Buscar actividad..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Select value={filterUser} onValueChange={setFilterUser}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por usuario" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los usuarios</SelectItem>
                  {uniqueUsers.map((user) => (
                    <SelectItem key={user} value={user}>
                      {user}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  <SelectItem value="client">Clientes</SelectItem>
                  <SelectItem value="service">Servicios</SelectItem>
                  <SelectItem value="task">Tareas</SelectItem>
                  <SelectItem value="status">Estados</SelectItem>
                  <SelectItem value="comment">Comentarios</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-secondary dark:text-gray-200">Actividades</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="px-4 pt-2">
              <TabsList className="grid grid-cols-6 w-full">
                <TabsTrigger value="all">Todas</TabsTrigger>
                <TabsTrigger value="client">Clientes</TabsTrigger>
                <TabsTrigger value="service">Servicios</TabsTrigger>
                <TabsTrigger value="task">Tareas</TabsTrigger>
                <TabsTrigger value="status">Estados</TabsTrigger>
                <TabsTrigger value="comment">Comentarios</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value={activeTab} className="m-0">
              <div className="divide-y dark:divide-gray-700">
                {filteredActivities.length > 0 ? (
                  filteredActivities.map((activity) => <ActivityItem key={activity.id} activity={activity} />)
                ) : (
                  <div className="p-8 text-center text-muted-foreground">
                    No se encontraron actividades con los filtros seleccionados
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
