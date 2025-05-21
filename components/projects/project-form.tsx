"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Trash2 } from "lucide-react"
import { useTerminology } from "@/context/terminology-context"
import { Project } from "@/types/project"

interface ProjectFormProps {
  project?: Project
  onSubmit: (project: Project) => void
  onCancel: () => void
  services: string[]
  collaborators: { id: string; name: string }[]
  serviceRoles: Record<string, string[]>
}

export function ProjectForm({ project, onSubmit, onCancel, services, collaborators, serviceRoles }: ProjectFormProps) {
  const { projectTerm } = useTerminology()

  const [formData, setFormData] = useState({
    id: project?.id || 0,
    name: project?.name || "",
    client: project?.client || "",
    service: project?.service || "",
    status: project?.status || "No iniciado",
    progress: project?.progress || 0,
    start_date: project?.start_date || "",
    end_date: project?.end_date || "",
    last_update: project?.last_update || new Date().toISOString().split("T")[0],
    responsible: project?.responsible || "",
    description: project?.description || "",
    collaborators: project?.collaborators || [],
    budget: project?.budget || 0,
    cost: project?.cost || 0,
  })

  const [selectedCollaborator, setSelectedCollaborator] = useState("")
  const [selectedRole, setSelectedRole] = useState("")
  const [availableRoles, setAvailableRoles] = useState<string[]>([])

  // Actualizar roles disponibles cuando se selecciona un servicio
  useEffect(() => {
    if (formData.service) {
      setAvailableRoles(serviceRoles[formData.service] || [])
    } else {
      setAvailableRoles([])
    }
  }, [formData.service, serviceRoles])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleAddCollaborator = () => {
    if (
      !selectedCollaborator ||
      !selectedRole ||
      selectedCollaborator === "no_collaborator" ||
      selectedRole === "no_role"
    )
      return

    const collaborator = collaborators.find((c) => c.id === selectedCollaborator)
    if (!collaborator) return

    const collaboratorId = `collaborator-${Date.now()}`
    const newCollaborator = {
      id: collaboratorId,
      collaboratorId: selectedCollaborator,
      collaboratorName: collaborator.name,
      role: selectedRole,
    }

    setFormData({
      ...formData,
      collaborators: [...formData.collaborators, newCollaborator],
    })

    // Limpiar selección
    setSelectedCollaborator("")
    setSelectedRole("")
  }

  const handleRemoveCollaborator = (id: string) => {
    setFormData({
      ...formData,
      collaborators: formData.collaborators.filter((collaborator) => collaborator.id !== id),
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      progress: Number(formData.progress),
      budget: Number(formData.budget),
      cost: Number(formData.cost),
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle className="text-lg">{project ? `Editar ${projectTerm}` : `Nuevo ${projectTerm}`}</DialogTitle>
        <DialogDescription className="text-sm">
          Complete los datos del {projectTerm.toLowerCase()}. Haga clic en guardar cuando termine.
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-3 py-2">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="name">Nombre del {projectTerm}</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="space-y-1">
            <Label htmlFor="client">Cliente</Label>
            <Input id="client" name="client" value={formData.client} onChange={handleChange} required />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="service">Servicio</Label>
            <Select value={formData.service} onValueChange={(value) => handleSelectChange("service", value)}>
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
          <div className="space-y-1">
            <Label htmlFor="responsible">Responsable</Label>
            <Select value={formData.responsible} onValueChange={(value) => handleSelectChange("responsible", value)}>
              <SelectTrigger id="responsible">
                <SelectValue placeholder="Seleccionar responsable" />
              </SelectTrigger>
              <SelectContent>
                {collaborators.map((person) => (
                  <SelectItem key={person.id} value={person.name}>
                    {person.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <Label htmlFor="start_date">Fecha Inicio</Label>
            <Input
              id="start_date"
              name="start_date"
              type="date"
              value={formData.start_date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="end_date">Fecha Fin</Label>
            <Input id="end_date" name="end_date" type="date" value={formData.endDate} onChange={handleChange} required />
          </div>
          <div className="space-y-1">
            <Label htmlFor="status">Estado</Label>
            <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="No iniciado">No iniciado</SelectItem>
                <SelectItem value="En curso">En curso</SelectItem>
                <SelectItem value="Esperando aprobación">Esperando aprobación</SelectItem>
                <SelectItem value="Pausado">Pausado</SelectItem>
                <SelectItem value="Completado">Completado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="progress">Progreso (%)</Label>
          <Input
            id="progress"
            name="progress"
            type="number"
            min="0"
            max="100"
            value={formData.progress}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="description">Descripción</Label>
          <Textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={3} />
        </div>

        <div className="space-y-2 border-t pt-2">
          <Label>Colaboradores</Label>

          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <Label htmlFor="collaborator">Colaborador</Label>
              <Select value={selectedCollaborator} onValueChange={setSelectedCollaborator}>
                <SelectTrigger id="collaborator">
                  <SelectValue placeholder="Seleccionar colaborador" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no_collaborator">Seleccionar colaborador</SelectItem>
                  {collaborators.map((collaborator) => (
                    <SelectItem key={collaborator.id} value={collaborator.id}>
                      {collaborator.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="role">Rol</Label>
              <Select
                value={selectedRole}
                onValueChange={setSelectedRole}
                disabled={!selectedCollaborator || !formData.service || availableRoles.length === 0}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Seleccionar rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no_role">Seleccionar rol</SelectItem>
                  {availableRoles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                type="button"
                onClick={handleAddCollaborator}
                disabled={!selectedCollaborator || !selectedRole}
                className="w-full"
              >
                Asignar
              </Button>
            </div>
          </div>

          <div className="mt-4">
            {formData.collaborators.length === 0 ? (
              <div className="text-center p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
                <p className="text-muted-foreground">No hay colaboradores asignados</p>
              </div>
            ) : (
              <div className="space-y-2">
                {formData.collaborators.map((collaborator) => (
                  <div
                    key={collaborator.id}
                    className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 p-2 rounded-md"
                  >
                    <div>
                      <span className="font-medium">{collaborator.collaboratorName}</span>
                      <span className="text-sm text-muted-foreground ml-2">({collaborator.role})</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveCollaborator(collaborator.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <DialogFooter className="pt-2">
        <Button type="button" variant="outline" onClick={onCancel} size="sm">
          Cancelar
        </Button>
        <Button type="submit" size="sm">
          Guardar
        </Button>
      </DialogFooter>
    </form>
  )
}
