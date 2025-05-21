"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, MoveUp, MoveDown, Info, CheckCircle2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Datos de ejemplo para plantillas de tareas
const TASK_TEMPLATES = [
  {
    id: 1,
    service: "Diseño Web",
    autoAssign: true,
    tasks: [
      {
        id: 1,
        name: "Wireframing",
        description: "Crear wireframes de todas las páginas",
        duration: 3,
        role: "Diseñador",
      },
      { id: 2, name: "Diseño UI", description: "Diseñar interfaz de usuario", duration: 5, role: "Diseñador" },
      {
        id: 3,
        name: "Desarrollo Frontend",
        description: "Implementar HTML/CSS/JS",
        duration: 7,
        role: "Desarrollador",
      },
      {
        id: 4,
        name: "Revisión y ajustes",
        description: "Revisar y ajustar según feedback",
        duration: 2,
        role: "Diseñador",
      },
    ],
  },
  {
    id: 2,
    service: "Redes Sociales",
    autoAssign: true,
    tasks: [
      {
        id: 1,
        name: "Planificación de contenido",
        description: "Crear calendario de contenido mensual",
        duration: 2,
        role: "Community Manager",
      },
      {
        id: 2,
        name: "Diseño de piezas",
        description: "Diseñar imágenes para publicaciones",
        duration: 4,
        role: "Diseñador",
      },
      {
        id: 3,
        name: "Programación de publicaciones",
        description: "Programar contenido en plataformas",
        duration: 1,
        role: "Community Manager",
      },
      {
        id: 4,
        name: "Análisis de resultados",
        description: "Analizar métricas y engagement",
        duration: 2,
        role: "Analista",
      },
    ],
  },
  {
    id: 3,
    service: "SEO",
    autoAssign: false,
    tasks: [
      {
        id: 1,
        name: "Auditoría inicial",
        description: "Analizar estado actual del sitio",
        duration: 3,
        role: "Especialista SEO",
      },
      {
        id: 2,
        name: "Investigación de palabras clave",
        description: "Identificar keywords relevantes",
        duration: 2,
        role: "Especialista SEO",
      },
      {
        id: 3,
        name: "Optimización on-page",
        description: "Implementar mejoras en el sitio",
        duration: 5,
        role: "Especialista SEO",
      },
      {
        id: 4,
        name: "Informe de resultados",
        description: "Generar informe de posicionamiento",
        duration: 1,
        role: "Analista",
      },
    ],
  },
]

// Datos de ejemplo para asignaciones recientes
const RECENT_ASSIGNMENTS = [
  {
    id: 1,
    client: "Empresa ABC",
    service: "Diseño Web",
    collaborator: "Ana García",
    date: "2023-04-15",
    tasksGenerated: 4,
  },
  {
    id: 2,
    client: "Startup XYZ",
    service: "Redes Sociales",
    collaborator: "Carlos Rodríguez",
    date: "2023-04-12",
    tasksGenerated: 4,
  },
  {
    id: 3,
    client: "Consultora 123",
    service: "SEO",
    collaborator: "Diego Sánchez",
    date: "2023-04-10",
    tasksGenerated: 4,
  },
]

// Lista de servicios
const SERVICES = [
  "Diseño Web",
  "Redes Sociales",
  "SEO",
  "Marketing Digital",
  "Consultoría",
  "Capacitación",
  "E-commerce",
  "Email Marketing",
  "Fotografía",
  "Diseño Gráfico",
]

// Lista de roles
const ROLES = [
  "Diseñador",
  "Desarrollador",
  "Community Manager",
  "Especialista SEO",
  "Analista",
  "Consultor",
  "Fotógrafo",
  "Copywriter",
  "Project Manager",
]

export default function PlantillasTareasPage() {
  const [templates, setTemplates] = useState(TASK_TEMPLATES)
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<any>(null)
  const [isAddTemplateOpen, setIsAddTemplateOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("plantillas")
  const [recentAssignments, setRecentAssignments] = useState(RECENT_ASSIGNMENTS)
  const [showAlert, setShowAlert] = useState<{ show: boolean; message: string; type: "success" | "error" }>({
    show: false,
    message: "",
    type: "success",
  })
  const [templateToDelete, setTemplateToDelete] = useState<number | null>(null)

  const handleAddTemplate = (newTemplate: any) => {
    setTemplates([...templates, { ...newTemplate, id: templates.length + 1, tasks: [] }])
    setIsAddTemplateOpen(false)
    showAlertMessage("Plantilla creada correctamente", "success")
  }

  const handleEditTemplate = (updatedTemplate: any) => {
    const updated = templates.map((template) =>
      template.id === updatedTemplate.id
        ? { ...template, service: updatedTemplate.service, autoAssign: updatedTemplate.autoAssign }
        : template,
    )
    setTemplates(updated)
    setEditingTemplate(null)

    // Update selected template if it was the one edited
    if (selectedTemplate && selectedTemplate.id === updatedTemplate.id) {
      setSelectedTemplate({
        ...selectedTemplate,
        service: updatedTemplate.service,
        autoAssign: updatedTemplate.autoAssign,
      })
    }

    showAlertMessage("Plantilla actualizada correctamente", "success")
  }

  const handleDeleteTemplate = (id: number) => {
    setTemplates(templates.filter((template) => template.id !== id))
    if (selectedTemplate && selectedTemplate.id === id) {
      setSelectedTemplate(null)
    }
    setTemplateToDelete(null)
    showAlertMessage("Plantilla eliminada correctamente", "success")
  }

  const handleAddTask = (newTask: any) => {
    if (selectedTemplate) {
      const updatedTemplates = templates.map((template) => {
        if (template.id === selectedTemplate.id) {
          return {
            ...template,
            tasks: [...template.tasks, { ...newTask, id: template.tasks.length + 1 }],
          }
        }
        return template
      })
      setTemplates(updatedTemplates)
      setIsAddTaskOpen(false)

      // Update selected template
      const updatedTemplate = updatedTemplates.find((t) => t.id === selectedTemplate.id)
      if (updatedTemplate) {
        setSelectedTemplate(updatedTemplate)
      }

      showAlertMessage("Tarea añadida correctamente", "success")
    }
  }

  const handleEditTask = (updatedTask: any) => {
    if (selectedTemplate) {
      const updatedTemplates = templates.map((template) => {
        if (template.id === selectedTemplate.id) {
          return {
            ...template,
            tasks: template.tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
          }
        }
        return template
      })
      setTemplates(updatedTemplates)
      setEditingTask(null)

      // Update selected template
      const updatedTemplate = updatedTemplates.find((t) => t.id === selectedTemplate.id)
      if (updatedTemplate) {
        setSelectedTemplate(updatedTemplate)
      }

      showAlertMessage("Tarea actualizada correctamente", "success")
    }
  }

  const handleDeleteTask = (taskId: number) => {
    if (selectedTemplate) {
      const updatedTemplates = templates.map((template) => {
        if (template.id === selectedTemplate.id) {
          return {
            ...template,
            tasks: template.tasks.filter((task) => task.id !== taskId),
          }
        }
        return template
      })
      setTemplates(updatedTemplates)

      // Update selected template
      const updatedTemplate = updatedTemplates.find((t) => t.id === selectedTemplate.id)
      if (updatedTemplate) {
        setSelectedTemplate(updatedTemplate)
      }

      showAlertMessage("Tarea eliminada correctamente", "success")
    }
  }

  const handleMoveTask = (taskId: number, direction: "up" | "down") => {
    if (selectedTemplate) {
      const templateIndex = templates.findIndex((t) => t.id === selectedTemplate.id)
      const taskIndex = templates[templateIndex].tasks.findIndex((t) => t.id === taskId)

      if (
        (direction === "up" && taskIndex === 0) ||
        (direction === "down" && taskIndex === templates[templateIndex].tasks.length - 1)
      ) {
        return
      }

      const newTasks = [...templates[templateIndex].tasks]
      const swapIndex = direction === "up" ? taskIndex - 1 : taskIndex + 1

      // Swap tasks
      ;[newTasks[taskIndex], newTasks[swapIndex]] = [newTasks[swapIndex], newTasks[taskIndex]]

      const updatedTemplates = [...templates]
      updatedTemplates[templateIndex] = {
        ...updatedTemplates[templateIndex],
        tasks: newTasks,
      }

      setTemplates(updatedTemplates)

      // Update selected template
      setSelectedTemplate(updatedTemplates[templateIndex])
    }
  }

  const handleToggleAutoAssign = (templateId: number) => {
    const updatedTemplates = templates.map((template) => {
      if (template.id === templateId) {
        return {
          ...template,
          autoAssign: !template.autoAssign,
        }
      }
      return template
    })
    setTemplates(updatedTemplates)

    // Update selected template if it was the one toggled
    if (selectedTemplate && selectedTemplate.id === templateId) {
      setSelectedTemplate({
        ...selectedTemplate,
        autoAssign: !selectedTemplate.autoAssign,
      })
    }

    showAlertMessage(
      `Asignación automática ${
        updatedTemplates.find((t) => t.id === templateId)?.autoAssign ? "activada" : "desactivada"
      }`,
      "success",
    )
  }

  const showAlertMessage = (message: string, type: "success" | "error") => {
    setShowAlert({
      show: true,
      message,
      type,
    })

    setTimeout(() => {
      setShowAlert({
        show: false,
        message: "",
        type: "success",
      })
    }, 3000)
  }

  return (
    <div className="space-y-6">
      {showAlert.show && (
        <Alert
          className={
            showAlert.type === "success"
              ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900/30"
              : "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-900/30"
          }
        >
          <AlertDescription
            className={
              showAlert.type === "success" ? "text-green-800 dark:text-green-300" : "text-red-800 dark:text-red-300"
            }
          >
            {showAlert.message}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-secondary dark:text-gray-200">Plantillas de Tareas</h1>
          <p className="text-muted-foreground">Estandariza procesos y asignación de tareas</p>
        </div>
        <Dialog open={isAddTemplateOpen} onOpenChange={setIsAddTemplateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Plantilla
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <TemplateForm
              onSubmit={handleAddTemplate}
              onCancel={() => setIsAddTemplateOpen(false)}
              services={SERVICES}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="plantillas">Plantillas</TabsTrigger>
          <TabsTrigger value="asignaciones">Asignaciones Recientes</TabsTrigger>
        </TabsList>

        <TabsContent value="plantillas" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-1 border-primary/20">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-secondary dark:text-gray-200">Servicios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {templates.map((template) => (
                    <div key={template.id} className="flex items-center justify-between">
                      <Button
                        variant={selectedTemplate?.id === template.id ? "default" : "outline"}
                        className="w-full justify-start"
                        onClick={() => setSelectedTemplate(template)}
                      >
                        <div className="flex items-center">
                          {template.service}
                          {template.autoAssign && (
                            <Badge className="ml-2 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                              Auto
                            </Badge>
                          )}
                        </div>
                        <Badge className="ml-auto">{template.tasks.length}</Badge>
                      </Button>
                      <div className="flex ml-2">
                        <Button variant="ghost" size="icon" onClick={() => setEditingTemplate(template)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setTemplateToDelete(template.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2 border-primary/20">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-secondary dark:text-gray-200">
                    {selectedTemplate ? `Tareas para ${selectedTemplate.service}` : "Seleccione un servicio"}
                  </CardTitle>
                  {selectedTemplate && (
                    <CardDescription className="flex items-center mt-1">
                      <div className="flex items-center mr-4">
                        <Switch
                          checked={selectedTemplate.autoAssign}
                          onCheckedChange={() => handleToggleAutoAssign(selectedTemplate.id)}
                          className="mr-2"
                        />
                        <span>Asignación automática</span>
                      </div>
                      <Info className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        Al activar, las tareas se crearán automáticamente cuando se asigne este servicio a un
                        colaborador
                      </span>
                    </CardDescription>
                  )}
                </div>
                {selectedTemplate && (
                  <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Agregar Tarea
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <TaskForm onSubmit={handleAddTask} onCancel={() => setIsAddTaskOpen(false)} roles={ROLES} />
                    </DialogContent>
                  </Dialog>
                )}
              </CardHeader>
              <CardContent>
                {selectedTemplate ? (
                  selectedTemplate.tasks.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Orden</TableHead>
                          <TableHead>Tarea</TableHead>
                          <TableHead>Duración (días)</TableHead>
                          <TableHead>Rol</TableHead>
                          <TableHead>Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedTemplate.tasks.map((task: any, index: number) => (
                          <TableRow key={task.id}>
                            <TableCell>
                              <div className="flex items-center space-x-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleMoveTask(task.id, "up")}
                                  disabled={index === 0}
                                >
                                  <MoveUp className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleMoveTask(task.id, "down")}
                                  disabled={index === selectedTemplate.tasks.length - 1}
                                >
                                  <MoveDown className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">{task.name}</div>
                                <div className="text-sm text-muted-foreground">{task.description}</div>
                              </div>
                            </TableCell>
                            <TableCell>{task.duration}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-primary/10">
                                {task.role}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button variant="outline" size="icon" onClick={() => setEditingTask(task)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="icon" onClick={() => handleDeleteTask(task.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-40 text-center">
                      <p className="text-muted-foreground mb-4">No hay tareas definidas para este servicio</p>
                      <Button onClick={() => setIsAddTaskOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Agregar Primera Tarea
                      </Button>
                    </div>
                  )
                ) : (
                  <div className="flex items-center justify-center h-40 text-center">
                    <p className="text-muted-foreground">Seleccione un servicio para ver sus tareas</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="asignaciones">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-secondary dark:text-gray-200">Asignaciones Recientes</CardTitle>
              <CardDescription>
                Historial de tareas generadas automáticamente al asignar servicios a colaboradores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Servicio</TableHead>
                    <TableHead>Colaborador</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Tareas Generadas</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentAssignments.map((assignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell>{assignment.client}</TableCell>
                      <TableCell>{assignment.service}</TableCell>
                      <TableCell>{assignment.collaborator}</TableCell>
                      <TableCell>{new Date(assignment.date).toLocaleDateString()}</TableCell>
                      <TableCell>{assignment.tasksGenerated}</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Completado
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {editingTask && (
        <Dialog open={!!editingTask} onOpenChange={(open) => !open && setEditingTask(null)}>
          <DialogContent className="sm:max-w-[500px]">
            <TaskForm
              task={editingTask}
              onSubmit={handleEditTask}
              onCancel={() => setEditingTask(null)}
              roles={ROLES}
            />
          </DialogContent>
        </Dialog>
      )}

      {editingTemplate && (
        <Dialog open={!!editingTemplate} onOpenChange={(open) => !open && setEditingTemplate(null)}>
          <DialogContent className="sm:max-w-[500px]">
            <TemplateForm
              template={editingTemplate}
              onSubmit={handleEditTemplate}
              onCancel={() => setEditingTemplate(null)}
              services={SERVICES}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Template Confirmation Dialog */}
      <AlertDialog open={templateToDelete !== null} onOpenChange={(open) => !open && setTemplateToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro de eliminar esta plantilla?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente la plantilla y todas sus tareas
              asociadas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => templateToDelete && handleDeleteTemplate(templateToDelete)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

interface TemplateFormProps {
  template?: any
  onSubmit: (template: any) => void
  onCancel: () => void
  services: string[]
}

function TemplateForm({ template, onSubmit, onCancel, services }: TemplateFormProps) {
  const [service, setService] = useState(template?.service || "")
  const [autoAssign, setAutoAssign] = useState(template?.autoAssign || false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      id: template?.id || 0,
      service,
      autoAssign,
      tasks: template?.tasks || [],
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>{template ? "Editar Plantilla" : "Nueva Plantilla de Tareas"}</DialogTitle>
        <DialogDescription>
          {template
            ? "Modifique la plantilla de tareas."
            : "Cree una plantilla para un servicio. Luego podrá agregar tareas."}
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="service">Servicio</Label>
          <Select value={service} onValueChange={setService} required>
            <SelectTrigger id="service">
              <SelectValue placeholder="Seleccionar servicio" />
            </SelectTrigger>
            <SelectContent>
              {services.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox id="autoAssign" checked={autoAssign} onCheckedChange={(checked) => setAutoAssign(!!checked)} />
          <div className="grid gap-1.5 leading-none">
            <Label
              htmlFor="autoAssign"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Asignación automática de tareas
            </Label>
            <p className="text-sm text-muted-foreground">
              Al activar, las tareas se crearán automáticamente cuando se asigne este servicio a un colaborador
            </p>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Guardar</Button>
      </DialogFooter>
    </form>
  )
}

interface TaskFormProps {
  task?: any
  onSubmit: (task: any) => void
  onCancel: () => void
  roles: string[]
}

function TaskForm({ task, onSubmit, onCancel, roles }: TaskFormProps) {
  const [formData, setFormData] = useState({
    id: task?.id || 0,
    name: task?.name || "",
    description: task?.description || "",
    duration: task?.duration || 1,
    role: task?.role || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      duration: Number(formData.duration),
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>{task ? "Editar Tarea" : "Agregar Tarea"}</DialogTitle>
        <DialogDescription>Complete los datos de la tarea. Haga clic en guardar cuando termine.</DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre de la Tarea</Label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descripción</Label>
          <Textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={3} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="duration">Duración (días)</Label>
            <Input
              id="duration"
              name="duration"
              type="number"
              min="1"
              value={formData.duration}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Rol Asignado</Label>
            <Select value={formData.role} onValueChange={(value) => handleSelectChange("role", value)}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Seleccionar rol" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Guardar</Button>
      </DialogFooter>
    </form>
  )
}
