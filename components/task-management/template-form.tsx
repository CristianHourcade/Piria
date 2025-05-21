"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog"

interface TemplateFormProps {
  template?: any
  onSubmit: (template: any) => void
  onCancel: () => void
  services: string[]
}

export function TemplateForm({ template, onSubmit, onCancel, services }: TemplateFormProps) {
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
