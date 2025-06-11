"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Edit, Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { fetchClients } from "@/services/clients"
import { fetchEmployees } from "@/services/employees"

// Import components and utilities
import { StatusChart, ServiceChart, TeamChart } from "@/components/projects/project-charts"
import { ProjectForm } from "@/components/projects/project-form"
import { ProjectDetails } from "@/components/projects/project-details"
import { getStatusInfo } from "@/utils/project-utils"
import { PROJECTS, SERVICES, COLLABORATORS, SERVICE_ROLES } from "@/data/project-data"
import { useTerminology } from "@/context/terminology-context"
import { createProject, deleteProject, fetchProjects, updateProject } from "@/services/projects"
import { Project } from "@/types/project"
import { Client } from "@/types/client-types"
import { Employee } from "@/types/employee"

export default function ProyectosPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjects().then((data) => {
      setProjects(data)
      setLoading(false)
    })
  }, [])
  const [clients, setClients] = useState<Client[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  useEffect(() => {
    const loadData = async () => {
      const [projectsData, clientsData, employeesData] = await Promise.all([
        fetchProjects(),
        fetchClients(),
        fetchEmployees()
      ])
      setProjects(projectsData)
      setClients(clientsData)
      setEmployees(employeesData)
      setLoading(false)
    }

    loadData()
  }, [])

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos_estados")
  const [serviceFilter, setServiceFilter] = useState("todos_servicios")
  const [responsibleFilter, setResponsibleFilter] = useState("todos_responsables")

  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [analysisTab, setAnalysisTab] = useState("resumen")
  const [projectToDelete, setProjectToDelete] = useState<number | null>(null)
  const { projectTerm, projectTermPlural, clientTerm } = useTerminology()

  // Get unique responsibles
  const responsibles = Array.from(new Set(projects.map((project) => project.responsible)))

  // Calculate metrics
  const totalProjects = projects.length
  const inProgressProjects = projects.filter((project) => project.status === "En curso").length
  const awaitingApprovalProjects = projects.filter((project) => project.status === "Esperando aprobación").length
  const completedProjects = projects.filter((project) => project.status === "Completado").length
  const pausedProjects = projects.filter((project) => project.status === "Pausado").length
  const notStartedProjects = projects.filter((project) => project.status === "No iniciado").length

  // Service analysis
  const serviceAnalysis = SERVICES.map((service) => {
    const serviceProjects = projects.filter((project) => project.service === service)
    return {
      service,
      count: serviceProjects.length,
    }
  })
    .filter((analysis) => analysis.count > 0)
    .sort((a, b) => b.count - a.count)

  // Team analysis
  const teamAnalysis = responsibles
    .map((responsible) => {
      const responsibleProjects = projects.filter((project) => project.responsible === responsible)
      return {
        responsible,
        count: responsibleProjects.length,
      }
    })
    .sort((a, b) => b.count - a.count)

  // Filter projects
  const filteredProjects = projects.filter(
    (project) =>
      (project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.responsible.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "todos_estados" || statusFilter === "" || project.status === statusFilter) &&
      (serviceFilter === "todos_servicios" || serviceFilter === "" || project.service === serviceFilter) &&
      (responsibleFilter === "todos_responsables" ||
        responsibleFilter === "" ||
        project.responsible === responsibleFilter),
  )

  const handleAddProject = async (newProject: Omit<Project, "id" | "created_at" | "updated_at">) => {
    const created = await createProject(newProject)
    if (created) {
      setProjects([created, ...projects])
      setIsAddProjectOpen(false)
    }
  }

  const handleEditProject = async (updatedProject: Project) => {
    const updated = await updateProject(updatedProject.id, updatedProject)
    if (updated) {
      setProjects(projects.map((p) => (p.id === updated.id ? updated : p)))
      setEditingProject(null)
    }
  }

  const handleDeleteProject = async (id: number) => {
    const ok = await deleteProject(id)
    if (ok) {
      setProjects(projects.filter((p) => p.id !== id))
      setProjectToDelete(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-secondary dark:text-gray-200">
            Gestión de {projectTermPlural}
          </h1>
          <p className="text-muted-foreground">Controla los avances y distribución de trabajo</p>
        </div>
        <Dialog open={isAddProjectOpen} onOpenChange={setIsAddProjectOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo {projectTerm}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <ProjectForm
              onSubmit={handleAddProject}
              onCancel={() => setIsAddProjectOpen(false)}
              services={SERVICES}
              collaborators={employees.map((e) => ({ id: String(e.id), name: e.name }))}
              clients={clients}
              serviceRoles={SERVICE_ROLES}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Proyectos</p>
                <div className="text-2xl font-bold">{totalProjects}</div>
              </div>
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-bold">{totalProjects}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">En Curso</p>
                <div className="text-2xl font-bold">{inProgressProjects}</div>
              </div>
              <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <span className="text-blue-800 dark:text-blue-300 font-bold">{inProgressProjects}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Esperando Aprobación</p>
                <div className="text-2xl font-bold">{awaitingApprovalProjects}</div>
              </div>
              <div className="h-8 w-8 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <span className="text-yellow-800 dark:text-yellow-300 font-bold">{awaitingApprovalProjects}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completados</p>
                <div className="text-2xl font-bold">{completedProjects}</div>
              </div>
              <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <span className="text-green-800 dark:text-green-300 font-bold">{completedProjects}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Otros</p>
                <div className="text-2xl font-bold">{pausedProjects + notStartedProjects}</div>
              </div>
              <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <span className="text-gray-800 dark:text-gray-300 font-bold">
                  {pausedProjects + notStartedProjects}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4">
        <div className="md:col-span-3">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-secondary dark:text-gray-200">Análisis de Proyectos</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={analysisTab} onValueChange={setAnalysisTab}>
                <TabsList className="w-full">
                  <TabsTrigger value="resumen" className="flex-1">
                    Resumen
                  </TabsTrigger>
                  <TabsTrigger value="porServicio" className="flex-1">
                    Por Servicio
                  </TabsTrigger>
                  <TabsTrigger value="rendimientoEquipo" className="flex-1">
                    Rendimiento del Equipo
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="resumen" className="mt-4">
                  <div className="h-[300px] w-full">
                    <StatusChart projects={projects} />
                  </div>
                </TabsContent>

                <TabsContent value="porServicio" className="mt-4">
                  <div className="h-[300px] w-full">
                    <ServiceChart serviceAnalysis={serviceAnalysis} />
                  </div>
                </TabsContent>

                <TabsContent value="rendimientoEquipo" className="mt-4">
                  <div className="h-[300px] w-full">
                    <TeamChart teamAnalysis={teamAnalysis} />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos_estados">Todos los estados</SelectItem>
              <SelectItem value="En curso">En curso</SelectItem>
              <SelectItem value="Esperando aprobación">Esperando aprobación</SelectItem>
              <SelectItem value="Completado">Completado</SelectItem>
              <SelectItem value="Pausado">Pausado</SelectItem>
              <SelectItem value="No iniciado">No iniciado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full md:w-1/4">
          <Select value={serviceFilter} onValueChange={setServiceFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por servicio" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos_servicios">Todos los servicios</SelectItem>
              {SERVICES.map((service) => (
                <SelectItem key={service} value={service}>
                  {service}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full md:w-1/4">
          <Select value={responsibleFilter} onValueChange={setResponsibleFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por responsable" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos_responsables">Todos los responsables</SelectItem>
              {responsibles.length > 0 && (
                responsibles.map((responsible) => {
                  if (responsible) return (<SelectItem key={responsible} value={responsible}>
                    {responsible}
                  </SelectItem>)
                })
              )}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full md:w-1/4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar proyectos..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Projects Table */}
      <Card className="border-primary/20">
        <CardHeader className="pb-2">
          <div className="flex flex-col space-y-1.5">
            <CardTitle className="text-secondary dark:text-gray-200">{projectTermPlural}</CardTitle>
            <CardDescription>
              Mostrando {filteredProjects.length} de {projects.length} proyectos
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{projectTerm}</TableHead>
                <TableHead>{clientTerm}</TableHead>
                <TableHead>Servicio</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Responsable</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No se encontraron proyectos con los filtros seleccionados
                  </TableCell>
                </TableRow>
              ) : (
                filteredProjects.map((project) => {
                  const { color, icon } = getStatusInfo(project.status)

                  return (
                    <TableRow key={project.id}>
                      <TableCell>
                        <div className="font-medium">{project.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(project.startDate).toLocaleDateString()} -{" "}
                          {new Date(project.endDate).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>{project.client}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-primary/10">
                          {project.service} - ${project.price}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={color}>
                          <span className="flex items-center">
                            {icon}
                            <span>{project.status}</span>
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell>{project.responsible}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => setSelectedProject(project)}>
                            Ver
                          </Button>
                          <Button variant="outline" size="icon" onClick={() => setEditingProject(project)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog
                            open={projectToDelete === project.id}
                            onOpenChange={(open) => !open && setProjectToDelete(null)}
                          >
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="icon" onClick={() => setProjectToDelete(project.id)}>
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Eliminar proyecto?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción no se puede deshacer. El proyecto será eliminado permanentemente.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteProject(project.id)}
                                  className="bg-red-500 hover:bg-red-600 text-white"
                                >
                                  Delete Project
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Project Dialog */}
      {editingProject && (
        <Dialog open={!!editingProject} onOpenChange={(open) => !open && setEditingProject(null)}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <ProjectForm
              project={editingProject}
              onSubmit={handleEditProject}
              onCancel={() => setEditingProject(null)}
              services={SERVICES}
              collaborators={employees.map((e) => ({ id: String(e.id), name: e.name }))}
              clients={clients}
              serviceRoles={SERVICE_ROLES}
            />

          </DialogContent>
        </Dialog>
      )}

      {/* View Project Dialog */}
      {selectedProject && (
        <Dialog open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProject(null)}>
          <ProjectDetails project={selectedProject} />
        </Dialog>
      )}
    </div>
  )
}
