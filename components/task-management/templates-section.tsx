"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, MoveUp, MoveDown, Info } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2 } from "lucide-react"
import { TemplateForm } from "./template-form"
import { TaskForm } from "./task-form"
import { SERVICES, ROLES, RECENT_ASSIGNMENTS } from "@/data/task-management-data"

interface TemplatesSectionProps {
  templates: any[]
  setTemplates: (templates: any[]) => void
  showAlertMessage: (message: string, type: "success" | "error") => void
}

export function TemplatesSection({ templates, setTemplates, showAlertMessage }: TemplatesSectionProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<any>(null)
  const [isAddTemplateOpen, setIsAddTemplateOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<any>(null)
  const [templateToDelete, setTemplateToDelete] = useState<number | null>(null)
  const [activePlantillasTab, setActivePlantillasTab] = useState("plantillas")

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

  return (
    <>
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">Estandariza procesos y asignación de tareas</p>
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

      <Tabs value={activePlantillasTab} onValueChange={setActivePlantillasTab}>
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
                  {RECENT_ASSIGNMENTS.map((assignment) => (
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

      {/* Modals for editing tasks */}
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

      {/* Modals for editing templates */}
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
    </>
  )
}
