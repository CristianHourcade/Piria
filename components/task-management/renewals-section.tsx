"use client"

import { useState } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { RefreshCw, Clock, AlertTriangle, CheckCircle2, CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface RenewalsSectionProps {
  clients: any[]
  setClients: (clients: any[]) => void
  renewalHistory: any[]
  showAlertMessage: (message: string, type: "success" | "error") => void
  onRenewAll: () => void
}

export function RenewalsSection({
  clients,
  setClients,
  renewalHistory,
  showAlertMessage,
  onRenewAll,
}: RenewalsSectionProps) {
  const [statusFilter, setStatusFilter] = useState("todos")
  const [renewalDate, setRenewalDate] = useState<Date | undefined>(new Date())
  const [daysBeforeRenewal, setDaysBeforeRenewal] = useState(20)
  const [activeRenovacionesTab, setActiveRenovacionesTab] = useState("proximas")

  const handleRenewTasks = (clientId: number) => {
    const updatedClients = clients.map((client) => {
      if (client.id === clientId) {
        return {
          ...client,
          status: "Completado",
          lastRenewal: new Date().toISOString().split("T")[0],
        }
      }
      return client
    })
    setClients(updatedClients)
    showAlertMessage("Tareas renovadas correctamente", "success")
  }

  const handleToggleAutoRenewal = (clientId: number) => {
    const updatedClients = clients.map((client) => {
      if (client.id === clientId) {
        return {
          ...client,
          autoRenewal: !client.autoRenewal,
        }
      }
      return client
    })
    setClients(updatedClients)
    showAlertMessage(
      `Renovación automática ${
        updatedClients.find((c) => c.id === clientId)?.autoRenewal ? "activada" : "desactivada"
      }`,
      "success",
    )
  }

  const handleChangeDaysBeforeRenewal = (days: number) => {
    setDaysBeforeRenewal(days)
    showAlertMessage(`Configuración actualizada: las tareas se renovarán ${days} días antes del próximo mes`, "success")
  }

  const isRenewalSoon = (nextRenewal: string) => {
    const today = new Date()
    const renewalDate = new Date(nextRenewal)
    const diffTime = renewalDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 7 && diffDays > 0
  }

  const isRenewalOverdue = (nextRenewal: string) => {
    const today = new Date()
    const renewalDate = new Date(nextRenewal)
    return renewalDate < today
  }

  const filteredClients = clients.filter((client) => {
    if (statusFilter === "todos") return true
    if (statusFilter === "pendientes") return client.status === "Pendiente"
    if (statusFilter === "completados") return client.status === "Completado"
    return true
  })

  return (
    <>
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">Gestiona la renovación automática de tareas para clientes</p>
        <Button onClick={onRenewAll}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Renovar Todas
        </Button>
      </div>

      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-secondary dark:text-gray-200">Configuración de Renovación</CardTitle>
          <CardDescription>Ajusta cómo y cuándo se renuevan automáticamente las tareas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="daysBeforeRenewal">Días antes del próximo mes para renovar tareas</Label>
              <Select
                value={daysBeforeRenewal.toString()}
                onValueChange={(value) => handleChangeDaysBeforeRenewal(Number(value))}
              >
                <SelectTrigger id="daysBeforeRenewal">
                  <SelectValue placeholder="Seleccionar días" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 días antes</SelectItem>
                  <SelectItem value="15">15 días antes</SelectItem>
                  <SelectItem value="20">20 días antes</SelectItem>
                  <SelectItem value="25">25 días antes</SelectItem>
                  <SelectItem value="30">30 días antes</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Las tareas se generarán automáticamente {daysBeforeRenewal} días antes del inicio de cada mes para los
                clientes con renovación automática activada.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="renewalDate">Próxima fecha de renovación programada</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="renewalDate"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !renewalDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {renewalDate ? format(renewalDate, "dd/MM/yyyy", { locale: es }) : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent mode="single" selected={renewalDate} onSelect={setRenewalDate} initialFocus />
                </PopoverContent>
              </Popover>
              <p className="text-sm text-muted-foreground">
                Fecha en la que se ejecutará la próxima renovación automática de tareas.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeRenovacionesTab} onValueChange={setActiveRenovacionesTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="proximas">Próximas Renovaciones</TabsTrigger>
          <TabsTrigger value="historial">Historial de Renovaciones</TabsTrigger>
        </TabsList>

        <TabsContent value="proximas" className="space-y-4">
          <div className="flex justify-between items-center">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="pendientes">Pendientes</SelectItem>
                <SelectItem value="completados">Completados</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card className="border-primary/20">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Servicio</TableHead>
                    <TableHead>Colaborador</TableHead>
                    <TableHead>Última Renovación</TableHead>
                    <TableHead>Próxima Renovación</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Auto</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No hay renovaciones que coincidan con el filtro seleccionado
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredClients.map((client) => {
                      const isSoon = isRenewalSoon(client.nextRenewal)
                      const isOverdue = isRenewalOverdue(client.nextRenewal)

                      return (
                        <TableRow
                          key={client.id}
                          className={
                            isOverdue
                              ? "bg-red-50 dark:bg-red-900/10"
                              : isSoon
                                ? "bg-yellow-50 dark:bg-yellow-900/10"
                                : ""
                          }
                        >
                          <TableCell className="font-medium">{client.name}</TableCell>
                          <TableCell>{client.service}</TableCell>
                          <TableCell>{client.collaborator}</TableCell>
                          <TableCell>{new Date(client.lastRenewal).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <span>{new Date(client.nextRenewal).toLocaleDateString()}</span>
                              {isOverdue && <AlertTriangle className="ml-2 h-4 w-4 text-red-500" />}
                              {isSoon && !isOverdue && <Clock className="ml-2 h-4 w-4 text-yellow-500" />}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                client.status === "Completado"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                              }
                            >
                              {client.status === "Completado" ? (
                                <CheckCircle2 className="mr-1 h-4 w-4" />
                              ) : (
                                <Clock className="mr-1 h-4 w-4" />
                              )}
                              {client.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Switch
                              checked={client.autoRenewal}
                              onCheckedChange={() => handleToggleAutoRenewal(client.id)}
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRenewTasks(client.id)}
                              disabled={client.status === "Completado"}
                            >
                              <RefreshCw className="mr-1 h-4 w-4" />
                              Renovar
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historial">
          <Card className="border-primary/20">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Servicio</TableHead>
                    <TableHead>Colaborador</TableHead>
                    <TableHead>Fecha de Renovación</TableHead>
                    <TableHead>Tareas Generadas</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {renewalHistory.map((renewal) => (
                    <TableRow key={renewal.id}>
                      <TableCell className="font-medium">{renewal.client}</TableCell>
                      <TableCell>{renewal.service}</TableCell>
                      <TableCell>{renewal.collaborator}</TableCell>
                      <TableCell>{new Date(renewal.renewalDate).toLocaleDateString()}</TableCell>
                      <TableCell>{renewal.tasksGenerated}</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                          <CheckCircle2 className="mr-1 h-4 w-4" />
                          {renewal.status}
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
    </>
  )
}
