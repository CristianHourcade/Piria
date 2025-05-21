"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { fetchLeads, createLead, updateLead, deleteLead } from "@/services/leads"
import type { Lead } from "@/types/lead"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Edit, Trash2, Calendar, ArrowRight } from "lucide-react"
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

// Mock data for leads
// Services list
const SERVICES = [
  "Diseño Web",
  "SEO",
  "Marketing Digital",
  "Redes Sociales",
  "Consultoría",
  "Capacitación",
  "E-commerce",
  "Email Marketing",
  "Fotografía",
  "Diseño Gráfico",
]

// Stages
const STAGES = ["Contactado", "Reunión agendada", "En propuesta", "Negociación", "Cerrado"]

// Get stage color
const getStageColor = (stage: string) => {
  switch (stage) {
    case "Contactado":
      return "bg-blue-100 text-blue-800"
    case "Reunión agendada":
      return "bg-purple-100 text-purple-800"
    case "En propuesta":
      return "bg-yellow-100 text-yellow-800"
    case "Negociación":
      return "bg-orange-100 text-orange-800"
    case "Cerrado":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function ClientesPotencialesPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLeads().then((data) => {
      setLeads(data)
      setLoading(false)
    })
  }, [])
  const [searchTerm, setSearchTerm] = useState("")
  const [stageFilter, setStageFilter] = useState("")
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false)
  const [editingLead, setEditingLead] = useState<any>(null)

  const filteredLeads = leads.filter(
    (lead) =>
      (lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (stageFilter === "" || lead.stage === stageFilter),
  )

  const handleAddLead = async (newLead: Omit<Lead, "id" | "createdAt" | "updatedAt">) => {
    const created = await createLead(newLead)
    if (created) {
      setLeads([created, ...leads])
      setIsAddLeadOpen(false)
    }
  }

  const handleEditLead = async (updatedLead: Lead) => {
    const updated = await updateLead(updatedLead.id, updatedLead)
    if (updated) {
      setLeads(leads.map((lead) => (lead.id === updated.id ? updated : lead)))
      setEditingLead(null)
    }
  }

  const handleDeleteLead = async (id: number) => {
    const ok = await deleteLead(id)
    if (ok) {
      setLeads(leads.filter((lead) => lead.id !== id))
    }
  }

  const handleConvertToClient = (id: number) => {
    // In a real app, this would navigate to the client form with pre-filled data
    alert(`Lead #${id} será convertido a cliente`)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clientes Potenciales</h1>
          <p className="text-muted-foreground">Gestiona tus leads y conviértelos en clientes</p>
        </div>
        <Dialog open={isAddLeadOpen} onOpenChange={setIsAddLeadOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Agregar Lead
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <LeadForm
              onSubmit={handleAddLead}
              onCancel={() => setIsAddLeadOpen(false)}
              services={SERVICES}
              stages={STAGES}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>Leads</CardTitle>
            <div className="flex space-x-2">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar leads..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={stageFilter} onChange={(e) => setStageFilter(e.target.value)} className="w-48">
                <option value="">Todas las etapas</option>
                {STAGES.map((stage) => (
                  <option key={stage} value={stage}>
                    {stage}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (<p>Cargando leads...</p>) : (<Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contacto</TableHead>
                <TableHead>Interés</TableHead>
                <TableHead>Etapa</TableHead>
                <TableHead>Próxima Acción</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{lead.name}</div>
                      <div className="text-sm text-muted-foreground">{lead.company}</div>
                      <div className="text-xs text-muted-foreground">{lead.email}</div>
                      <div className="text-xs text-muted-foreground">{lead.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{lead.interest}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStageColor(lead.stage)}>{lead.stage}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{new Date(lead.nextAction).toLocaleDateString()}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{lead.notes}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon" onClick={() => setEditingLead(lead)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleDeleteLead(lead.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      {lead.stage === "Cerrado" && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleConvertToClient(lead.id)}
                          className="ml-2"
                        >
                          <ArrowRight className="mr-2 h-4 w-4" />
                          Convertir
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>)}
        </CardContent>
      </Card>

      {editingLead && (
        <Dialog open={!!editingLead} onOpenChange={(open) => !open && setEditingLead(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <LeadForm
              lead={editingLead}
              onSubmit={handleEditLead}
              onCancel={() => setEditingLead(null)}
              services={SERVICES}
              stages={STAGES}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

interface LeadFormProps {
  lead?: any
  onSubmit: (lead: any) => void
  onCancel: () => void
  services: string[]
  stages: string[]
}

function LeadForm({ lead, onSubmit, onCancel, services, stages }: LeadFormProps) {
  const [formData, setFormData] = useState({
    id: lead?.id || 0,
    name: lead?.name || "",
    company: lead?.company || "",
    email: lead?.email || "",
    phone: lead?.phone || "",
    interest: lead?.interest || "",
    stage: lead?.stage || "Contactado",
    nextAction: lead?.nextAction || "",
    notes: lead?.notes || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>{lead ? "Editar Lead" : "Agregar Lead"}</DialogTitle>
        <DialogDescription>
          Complete los datos del cliente potencial. Haga clic en guardar cuando termine.
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Empresa</Label>
            <Input id="company" name="company" value={formData.company} onChange={handleChange} required />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono</Label>
            <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="interest">Servicio de Interés</Label>
            <Select id="interest" name="interest" value={formData.interest} onChange={handleChange} required>
              <option value="">Seleccionar servicio</option>
              {services.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="stage">Etapa</Label>
            <Select id="stage" name="stage" value={formData.stage} onChange={handleChange} required>
              {stages.map((stage) => (
                <option key={stage} value={stage}>
                  {stage}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="nextAction">Próxima Acción</Label>
          <Input
            id="nextAction"
            name="nextAction"
            type="date"
            value={formData.nextAction}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notas</Label>
          <Textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows={3} />
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

// Simple Select component
function Select({
  children,
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { className?: string }) {
  return (
    <select
      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className || ""}`}
      {...props}
    >
      {children}
    </select>
  )
}

// Simple Textarea component
function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { className?: string }) {
  return (
    <textarea
      className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className || ""}`}
      {...props}
    />
  )
}
