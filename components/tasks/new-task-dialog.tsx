"use client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { UserPlus } from "lucide-react"

interface NewTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddTask: () => void
  newTask: any
  setNewTask: (task: any) => void
  onSelectCollaborator: (name: string) => void
  collaborators: Array<{ id: number; name: string; initial: string }>
}

export function NewTaskDialog({
  open,
  onOpenChange,
  onAddTask,
  newTask,
  setNewTask,
  onSelectCollaborator,
  collaborators,
}: NewTaskDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Agregar Nueva Tarea</DialogTitle>
          <DialogDescription>Complete los detalles para crear una nueva tarea</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              placeholder="Título de la tarea"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="client">Cliente</Label>
              <Input
                id="client"
                value={newTask.client}
                onChange={(e) => setNewTask({ ...newTask, client: e.target.value })}
                placeholder="Nombre del cliente"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="service">Servicio</Label>
              <Input
                id="service"
                value={newTask.service}
                onChange={(e) => setNewTask({ ...newTask, service: e.target.value })}
                placeholder="Tipo de servicio"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="dueDate">Fecha Límite</Label>
              <Input
                id="dueDate"
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="priority">Prioridad</Label>
              <Select value={newTask.priority} onValueChange={(value) => setNewTask({ ...newTask, priority: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar prioridad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Alta">Alta</SelectItem>
                  <SelectItem value="Media">Media</SelectItem>
                  <SelectItem value="Baja">Baja</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="assignee" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Asignar a
            </Label>
            <Select value={newTask.assignee} onValueChange={onSelectCollaborator}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar colaborador" />
              </SelectTrigger>
              <SelectContent>
                {collaborators.map((collaborator) => (
                  <SelectItem key={collaborator.id} value={collaborator.name}>
                    <div className="flex items-center">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {collaborator.initial}
                        </AvatarFallback>
                      </Avatar>
                      {collaborator.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              placeholder="Descripción detallada de la tarea"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={onAddTask} disabled={!newTask.title || !newTask.client || !newTask.dueDate}>
            Agregar Tarea
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
