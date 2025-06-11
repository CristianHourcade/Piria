
"use client"

import { Client } from "@/types/client-types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pencil, Trash2, RefreshCcw } from "lucide-react"

interface ClientTableProps {
  clients: Client[]
  showInactiveClients: boolean
  setShowInactiveClients: (value: boolean) => void
  onEditClient: (client: Client) => void
  onDisableClient: (client: Client) => void
  onReactivateClient: (client: Client) => void
  clientsWithUpcomingPayment?: Client[]
  clientsWithDelayedPayment?: Client[]
}

export function ClientTable({
  clients,
  showInactiveClients,
  setShowInactiveClients,
  onEditClient,
  onDisableClient,
  onReactivateClient,
}: ClientTableProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Listado de Clientes</h2>
        <Button variant="outline" onClick={() => setShowInactiveClients(!showInactiveClients)}>
          {showInactiveClients ? "Ocultar Inactivos" : "Mostrar Inactivos"}
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Empresa</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell>{client.name}</TableCell>
              <TableCell>{client.company}</TableCell>
              <TableCell>{client.email}</TableCell>
              <TableCell>
                <Badge variant={client.status === "Activo" ? "default" : "destructive"}>
                  {client.status}
                </Badge>
              </TableCell>
              <TableCell className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => onEditClient(client)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                {client.status === "Activo" ? (
                  <Button variant="destructive" size="icon" onClick={() => onDisableClient(client)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button variant="outline" size="icon" onClick={() => onReactivateClient(client)}>
                    <RefreshCcw className="h-4 w-4" />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
