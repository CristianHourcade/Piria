
"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Client } from "@/types/client-types"
import { SERVICES } from "@/data/client-data"
import { ClientTable } from "@/components/clients/client-table"
import { ClientForm } from "@/components/clients/client-form"
import { ClientDisableDialog, ClientReactivateDialog } from "@/components/clients/client-actions"
import { generateProjectsForClient, generateTasksForClient } from "@/utils/client-utils"
import {
  fetchClients,
  createClient,
  updateClient,
  disableClient,
  reactivateClient,
} from "@/services/clients"

export default function ClientesPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [statusFilter, setStatusFilter] = useState("Todos")
  const [serviceFilter, setServiceFilter] = useState("Todos")
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("Todos")
  const [isAddClientOpen, setIsAddClientOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [clientToDisable, setClientToDisable] = useState<Client | null>(null)
  const [clientToReactivate, setClientToReactivate] = useState<Client | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showInactiveClients, setShowInactiveClients] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const loadClients = async () => {
      try {
        const data = await fetchClients()
        setClients(data)
      } catch (error) {
        toast({
          title: "Error al cargar clientes",
          description: "No se pudieron cargar los clientes.",
          variant: "destructive",
        })
      }
    }
    loadClients()
  }, [])


  const handleAddClient = async (client: Partial<Client>) => {
    setIsLoading(true)
    try {
      const newClient = await createClient(client)
      setClients([...clients, newClient])
      setIsAddClientOpen(false)
      toast({
        title: "Cliente creado",
        description: "El cliente fue creado correctamente.",
      })
    } catch (error: any) {
      toast({
        title: "Error al crear cliente",
        description: error.message || "Ocurrió un error inesperado.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }
  

  const handleEditClient = async (updatedClient: Client) => {
    setIsLoading(true)
    try {
      const clientEdited = await updateClient(updatedClient.id, updatedClient)
      setClients(clients.map((c) => (c.id === clientEdited.id ? clientEdited : c)))
      setEditingClient(null)
      toast({
        title: "Cliente actualizado",
        description: "Los datos se guardaron correctamente.",
      })
    } catch (error: any) {
      toast({
        title: "Error al editar cliente",
        description: error.message || "Ocurrió un error inesperado.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }


  const handleDisableClient = async (client: Client) => {
    setIsLoading(true)
    try {
      await disableClient(client.id)
      setClients(clients.map((c) => (c.id === client.id ? { ...c, status: "Inactivo" } : c)))
      setClientToDisable(null)
    } catch (error) {
      toast({ title: "Error", description: "No se pudo desactivar el cliente", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleReactivateClient = async (client: Client) => {
    setIsLoading(true)
    try {
      await reactivateClient(client.id)
      setClients(clients.map((c) => (c.id === client.id ? { ...c, status: "Activo" } : c)))
      setClientToReactivate(null)
    } catch (error) {
      toast({ title: "Error", description: "No se pudo reactivar el cliente", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const filteredClients = clients.filter((client) => {
    if (!showInactiveClients && client.status === "Inactivo") return false
    const matchesStatus = statusFilter === "Todos" || client.status === statusFilter
    const matchesService = serviceFilter === "Todos" || client.services?.some((s) => s.name === serviceFilter)
    const matchesPaymentStatus = paymentStatusFilter === "Todos" || client.paymentStatus === paymentStatusFilter
    return matchesStatus && matchesService && matchesPaymentStatus
  })

  const activeClients = clients.filter((c) => c.status === "Activo").length
  const inactiveClients = clients.filter((c) => c.status === "Inactivo").length
  const monthlyBilling = clients.reduce((sum, c) => (c.status === "Activo" ? sum + c.total : sum), 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-secondary dark:text-gray-200">
            Gestión de Clientes
          </h1>
          <p className="text-muted-foreground">Administra la información de tus clientes</p>
        </div>
        <Dialog open={isAddClientOpen} onOpenChange={setIsAddClientOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#00D1A1] hover:bg-[#00B38A]">
              <Plus className="mr-2 h-4 w-4" /> Agregar Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <ClientForm onSubmit={handleAddClient} onCancel={() => setIsAddClientOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/3">
          <Label>Estado</Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos</SelectItem>
              <SelectItem value="Activo">Activo</SelectItem>
              <SelectItem value="Inactivo">Inactivo</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full md:w-1/3">
          <Label>Servicio</Label>
          <Select value={serviceFilter} onValueChange={setServiceFilter}>
            <SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos</SelectItem>
              {SERVICES.map((service) => (
                <SelectItem key={service} value={service}>{service}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full md:w-1/3">
          <Label>Estado de Pago</Label>
          <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
            <SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos</SelectItem>
              <SelectItem value="Pendiente">Pendiente</SelectItem>
              <SelectItem value="Emitida">Emitida</SelectItem>
              <SelectItem value="Pagada">Pagada</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardContent className="p-6"><div className="text-2xl font-bold">{activeClients}</div><p className="text-sm text-muted-foreground">Clientes Activos</p></CardContent></Card>
        <Card><CardContent className="p-6"><div className="text-2xl font-bold">{inactiveClients}</div><p className="text-sm text-muted-foreground">Clientes Inactivos</p></CardContent></Card>
        <Card><CardContent className="p-6"><div className="text-2xl font-bold text-[#00D1A1]">$ {monthlyBilling.toLocaleString("es-AR")},00</div><p className="text-sm text-muted-foreground">Facturación Mensual</p></CardContent></Card>
      </div>

      <ClientTable
        clients={filteredClients}
        showInactiveClients={showInactiveClients}
        setShowInactiveClients={setShowInactiveClients}
        onEditClient={setEditingClient}
        onDisableClient={setClientToDisable}
        onReactivateClient={setClientToReactivate}
        clientsWithUpcomingPayment={[]}
        clientsWithDelayedPayment={[]}
      />

      <ClientDisableDialog client={clientToDisable} isLoading={isLoading} onClose={() => setClientToDisable(null)} onConfirm={handleDisableClient} />
      <ClientReactivateDialog client={clientToReactivate} isLoading={isLoading} onClose={() => setClientToReactivate(null)} onConfirm={handleReactivateClient} />

      {editingClient && (
        <Dialog open={!!editingClient} onOpenChange={(open) => !open && setEditingClient(null)}>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <ClientForm client={editingClient} onSubmit={handleEditClient} onCancel={() => setEditingClient(null)} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
