"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle2, Clock, AlertCircle, PauseCircle, PlayCircle, List, Grid, ChevronRight, Eye } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useTerminology } from "@/context/terminology-context"

// Mock data for demonstration
const PROJECTS = [
  {
    id: 1,
    client: "Empresa ABC",
    service: "Diseño Web",
    status: "En curso",
    progress: 65,
    lastUpdate: "2023-04-05",
    comments: "Avanzando según lo planeado",
    description: "Rediseño completo del sitio web corporativo con enfoque en UX/UI moderno.",
    nextStep: "Esperando aprobación",
    isAssigned: true,
    tasks: [
      { id: 101, name: "Wireframes", status: "Completado", date: "2023-03-20" },
      { id: 102, name: "Diseño de UI", status: "Completado", date: "2023-03-28" },
      { id: 103, name: "Desarrollo Frontend", status: "En curso", date: "2023-04-05" },
      { id: 104, name: "Integración Backend", status: "No iniciado", date: "2023-04-15" },
    ],
  },
  {
    id: 2,
    client: "Startup XYZ",
    service: "Marketing Digital",
    status: "Esperando aprobación",
    progress: 90,
    lastUpdate: "2023-04-03",
    comments: "Esperando feedback del cliente",
    description: "Campaña de marketing digital para lanzamiento de nuevo producto.",
    nextStep: "Completado",
    isAssigned: true,
    tasks: [
      { id: 201, name: "Estrategia de contenido", status: "Completado", date: "2023-03-15" },
      { id: 202, name: "Diseño de creatividades", status: "Completado", date: "2023-03-25" },
      { id: 203, name: "Configuración de campañas", status: "Completado", date: "2023-04-01" },
      { id: 204, name: "Reporte final", status: "Esperando aprobación", date: "2023-04-03" },
    ],
  },
  {
    id: 3,
    client: "Consultora 123",
    service: "Redes Sociales",
    status: "No iniciado",
    progress: 0,
    lastUpdate: "2023-04-01",
    comments: "Pendiente de inicio",
    description: "Gestión mensual de redes sociales incluyendo creación de contenido y análisis.",
    nextStep: "En curso",
    isAssigned: false,
    tasks: [
      { id: 301, name: "Planificación de contenido", status: "No iniciado", date: "2023-04-10" },
      { id: 302, name: "Diseño de posts", status: "No iniciado", date: "2023-04-15" },
      { id: 303, name: "Programación", status: "No iniciado", date: "2023-04-20" },
      { id: 304, name: "Análisis de resultados", status: "No iniciado", date: "2023-04-30" },
    ],
  },
  {
    id: 4,
    client: "Tienda Online",
    service: "SEO",
    status: "Pausado",
    progress: 45,
    lastUpdate: "2023-03-28",
    comments: "Cliente solicitó pausa temporal",
    description: "Optimización SEO para mejorar posicionamiento en buscadores.",
    nextStep: "En curso",
    isAssigned: true,
    tasks: [
      { id: 401, name: "Auditoría inicial", status: "Completado", date: "2023-03-10" },
      { id: 402, name: "Optimización on-page", status: "En curso", date: "2023-03-20" },
      { id: 403, name: "Estrategia de contenidos", status: "Pausado", date: "2023-03-28" },
      { id: 404, name: "Construcción de enlaces", status: "No iniciado", date: "2023-04-15" },
    ],
  },
  {
    id: 5,
    client: "Restaurante Gourmet",
    service: "Fotografía",
    status: "Completado",
    progress: 100,
    lastUpdate: "2023-03-25",
    comments: "Entregado y aprobado",
    description: "Sesión fotográfica de productos y ambiente para nuevo menú y redes sociales.",
    nextStep: null,
    isAssigned: true,
    tasks: [
      { id: 501, name: "Planificación de sesión", status: "Completado", date: "2023-03-05" },
      { id: 502, name: "Sesión fotográfica", status: "Completado", date: "2023-03-15" },
      { id: 503, name: "Edición de fotos", status: "Completado", date: "2023-03-20" },
      { id: 504, name: "Entrega final", status: "Completado", date: "2023-03-25" },
    ],
  },
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Completado":
      return <CheckCircle2 className="h-5 w-5 text-green-500" />
    case "En curso":
      return <PlayCircle className="h-5 w-5 text-blue-500" />
    case "Esperando aprobación":
      return <Clock className="h-5 w-5 text-yellow-500" />
    case "Pausado":
      return <PauseCircle className="h-5 w-5 text-gray-500" />
    case "No iniciado":
      return <AlertCircle className="h-5 w-5 text-red-500" />
    default:
      return null
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Completado":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    case "En curso":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
    case "Esperando aprobación":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    case "Pausado":
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    case "No iniciado":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
  }
}

type ViewMode = "card" | "list"
type FilterStatus = "todos" | "pendientes" | "completados"

export default function ColaboradorProyectos() {
  const [viewMode, setViewMode] = useState<ViewMode>("card")
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("todos")
  const [selectedProject, setSelectedProject] = useState<(typeof PROJECTS)[0] | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { projectTerm, projectTermPlural, clientTerm } = useTerminology()

  // Filtrar proyectos según el estado seleccionado
  const filteredProjects = PROJECTS.filter((project) => {
    if (filterStatus === "todos") return true
    if (filterStatus === "completados") return project.status === "Completado"
    if (filterStatus === "pendientes")
      return ["En curso", "Esperando aprobación", "No iniciado", "Pausado"].includes(project.status)
    return true
  })

  const handleViewDetails = (project: (typeof PROJECTS)[0]) => {
    setSelectedProject(project)
    setIsDialogOpen(true)
  }

  const handleAdvanceStatus = () => {
    if (!selectedProject || !selectedProject.nextStep) return

    // In a real application, this would be an API call
    // For now, we'll update the state locally
    const updatedProjects = [...PROJECTS].map((project) => {
      if (project.id === selectedProject.id) {
        return {
          ...project,
          status: selectedProject.nextStep as string,
          progress:
            project.status === "Esperando aprobación"
              ? 100
              : project.status === "No iniciado"
                ? 25
                : project.status === "Pausado"
                  ? project.progress + 10
                  : project.progress + 20,
          lastUpdate: new Date().toISOString().split("T")[0],
          nextStep:
            selectedProject.nextStep === "Completado"
              ? null
              : selectedProject.nextStep === "En curso"
                ? "Esperando aprobación"
                : "Completado",
        }
      }
      return project
    })

    // Update the global projects array
    // This is where the fix is applied - we're updating the PROJECTS array directly
    for (let i = 0; i < PROJECTS.length; i++) {
      if (PROJECTS[i].id === selectedProject.id) {
        PROJECTS[i] = updatedProjects.find((p) => p.id === selectedProject.id)!
        break
      }
    }

    // Update the filtered projects based on the current filter
    const updatedFilteredProjects = PROJECTS.filter((project) => {
      if (filterStatus === "todos") return true
      if (filterStatus === "completados") return project.status === "Completado"
      if (filterStatus === "pendientes")
        return ["En curso", "Esperando aprobación", "No iniciado", "Pausado"].includes(project.status)
      return true
    })

    // Update the selected project with the new data
    const updatedProject = updatedProjects.find((p) => p.id === selectedProject.id)
    if (updatedProject) {
      setSelectedProject(updatedProject)
    }

    // Show a success message
    alert(`Proyecto actualizado a estado: ${selectedProject.nextStep}`)

    // Close the dialog and force a re-render
    setIsDialogOpen(false)

    // Force a re-render by updating the state
    setFilterStatus(filterStatus)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-secondary dark:text-white">Mis {projectTermPlural}</h1>
          <p className="text-muted-foreground">Visualiza y gestiona tus {projectTermPlural.toLowerCase()} asignados</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-md p-1 flex">
            <Button
              variant={viewMode === "card" ? "default" : "ghost"}
              size="sm"
              className="rounded-sm"
              onClick={() => setViewMode("card")}
            >
              <Grid className="h-4 w-4 mr-1" />
              Tarjetas
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              className="rounded-sm"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4 mr-1" />
              Lista
            </Button>
          </div>
        </div>
      </div>

      {/* Filtros de estado */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-1 flex w-full sm:w-auto">
        <Button
          variant={filterStatus === "todos" ? "default" : "ghost"}
          size="sm"
          className="flex-1 sm:flex-none rounded-sm"
          onClick={() => setFilterStatus("todos")}
        >
          Todos
        </Button>
        <Button
          variant={filterStatus === "pendientes" ? "default" : "ghost"}
          size="sm"
          className="flex-1 sm:flex-none rounded-sm"
          onClick={() => setFilterStatus("pendientes")}
        >
          Pendientes
        </Button>
        <Button
          variant={filterStatus === "completados" ? "default" : "ghost"}
          size="sm"
          className="flex-1 sm:flex-none rounded-sm"
          onClick={() => setFilterStatus("completados")}
        >
          Completados
        </Button>
      </div>

      {/* Vista de tarjetas */}
      {viewMode === "card" && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="relative group">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{project.client}</CardTitle>
                    <p className="text-sm text-muted-foreground">{project.service}</p>
                  </div>
                  <Badge className={getStatusColor(project.status)}>
                    <span className="flex items-center">
                      {getStatusIcon(project.status)}
                      <span className="ml-1">{project.status}</span>
                    </span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">Progreso</p>
                    <div className="mt-2 h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${project.progress}%` }}></div>
                    </div>
                    <p className="mt-1 text-xs text-right">{project.progress}%</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium">Comentarios</p>
                    <p className="text-sm text-muted-foreground">{project.comments}</p>
                  </div>

                  <div className="pt-2 text-xs text-muted-foreground border-t dark:border-gray-700">
                    Última actualización: {new Date(project.lastUpdate).toLocaleDateString()}
                  </div>
                </div>

                {/* Botón de ver detalles */}
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleViewDetails(project)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Ver detalles
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Vista de lista */}
      {viewMode === "list" && (
        <div className="rounded-md border dark:border-gray-700">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{clientTerm}</TableHead>
                <TableHead>Servicio</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Progreso</TableHead>
                <TableHead>Última actualización</TableHead>
                <TableHead>Comentarios</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.client}</TableCell>
                  <TableCell>{project.service}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(project.status)}>
                      <span className="flex items-center">
                        {getStatusIcon(project.status)}
                        <span className="ml-1">{project.status}</span>
                      </span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${project.progress}%` }}></div>
                      </div>
                      <span className="text-xs">{project.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(project.lastUpdate).toLocaleDateString()}</TableCell>
                  <TableCell className="max-w-xs truncate">{project.comments}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleViewDetails(project)}>
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">Ver detalles</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {filteredProjects.length === 0 && (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No hay proyectos que coincidan con los filtros seleccionados.</p>
        </div>
      )}

      {/* Diálogo de detalles del proyecto */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedProject && (
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center justify-between">
                <span>
                  {selectedProject.client} - {selectedProject.service}
                </span>
                <Badge className={getStatusColor(selectedProject.status)}>
                  <span className="flex items-center">
                    {getStatusIcon(selectedProject.status)}
                    <span className="ml-1">{selectedProject.status}</span>
                  </span>
                </Badge>
              </DialogTitle>
              <DialogDescription className="text-base mt-2">{selectedProject.description}</DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Progreso */}
              <div>
                <h3 className="text-sm font-medium mb-2">Progreso del proyecto</h3>
                <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${selectedProject.progress}%` }}
                  ></div>
                </div>
                <p className="mt-1 text-xs text-right">{selectedProject.progress}%</p>
              </div>

              {/* Tareas */}
              <div>
                <h3 className="text-sm font-medium mb-2">Tareas</h3>
                <div className="rounded-md border dark:border-gray-700">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tarea</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Fecha</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedProject.tasks.map((task) => (
                        <TableRow key={task.id}>
                          <TableCell>{task.name}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(task.status)}>
                              <span className="flex items-center">
                                {getStatusIcon(task.status)}
                                <span className="ml-1">{task.status}</span>
                              </span>
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(task.date).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Comentarios */}
              <div>
                <h3 className="text-sm font-medium mb-2">Comentarios</h3>
                <p className="text-sm text-muted-foreground">{selectedProject.comments}</p>
              </div>

              {/* Última actualización */}
              <div className="text-xs text-muted-foreground">
                Última actualización: {new Date(selectedProject.lastUpdate).toLocaleDateString()}
              </div>
            </div>

            <DialogFooter className="flex items-center justify-between">
              <div>
                {selectedProject.isAssigned && (
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                  >
                    Asignado a ti
                  </Badge>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cerrar
                </Button>
                {selectedProject.isAssigned && selectedProject.nextStep && (
                  <Button onClick={handleAdvanceStatus} className="gap-1">
                    Avanzar a {selectedProject.nextStep}
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
