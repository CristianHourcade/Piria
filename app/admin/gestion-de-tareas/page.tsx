"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TASK_TEMPLATES, CLIENTS_WITH_AUTO_RENEWAL, RENEWAL_HISTORY } from "@/data/task-management-data"
import { TemplatesSection } from "@/components/task-management/templates-section"
import { RenewalsSection } from "@/components/task-management/renewals-section"
import { DeleteTemplateDialog, RenewAllDialog } from "@/components/task-management/dialog-components"
import { useAlertMessage, AlertMessage } from "@/utils/task-management-utils"

export default function GestionDeTareasPage() {
  // Estado para la sección de plantillas
  const [templates, setTemplates] = useState(TASK_TEMPLATES)
  const [templateToDelete, setTemplateToDelete] = useState<number | null>(null)

  // Estado para la sección de renovaciones
  const [clients, setClients] = useState(CLIENTS_WITH_AUTO_RENEWAL)
  const [isRenewAllDialogOpen, setIsRenewAllDialogOpen] = useState(false)

  // Estado compartido
  const [activeMainTab, setActiveMainTab] = useState("plantillas")
  const { showAlert, showAlertMessage } = useAlertMessage()

  // Funciones para la sección de plantillas
  const handleDeleteTemplate = (id: number) => {
    setTemplates(templates.filter((template) => template.id !== id))
    setTemplateToDelete(null)
    showAlertMessage("Plantilla eliminada correctamente", "success")
  }

  // Funciones para la sección de renovaciones
  const handleRenewAllTasks = () => {
    const updatedClients = clients.map((client) => {
      if (client.status === "Pendiente") {
        return {
          ...client,
          status: "Completado",
          lastRenewal: new Date().toISOString().split("T")[0],
        }
      }
      return client
    })
    setClients(updatedClients)
    setIsRenewAllDialogOpen(false)
    showAlertMessage("Todas las tareas pendientes han sido renovadas", "success")
  }

  return (
    <div className="space-y-6">
      <AlertMessage alert={showAlert} />

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-secondary dark:text-gray-200">Gestión de Tareas</h1>
          <p className="text-muted-foreground">Administra plantillas y renovaciones de tareas</p>
        </div>
      </div>

      <Tabs value={activeMainTab} onValueChange={setActiveMainTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="plantillas">Plantillas de Tareas</TabsTrigger>
          <TabsTrigger value="renovaciones">Renovación de Tareas</TabsTrigger>
        </TabsList>

        {/* Sección de Plantillas de Tareas */}
        <TabsContent value="plantillas" className="space-y-6">
          <TemplatesSection templates={templates} setTemplates={setTemplates} showAlertMessage={showAlertMessage} />
        </TabsContent>

        {/* Sección de Renovación de Tareas */}
        <TabsContent value="renovaciones" className="space-y-6">
          <RenewalsSection
            clients={clients}
            setClients={setClients}
            renewalHistory={RENEWAL_HISTORY}
            showAlertMessage={showAlertMessage}
            onRenewAll={() => setIsRenewAllDialogOpen(true)}
          />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <DeleteTemplateDialog
        isOpen={templateToDelete !== null}
        onOpenChange={(open) => !open && setTemplateToDelete(null)}
        onConfirm={() => templateToDelete && handleDeleteTemplate(templateToDelete)}
      />

      <RenewAllDialog
        isOpen={isRenewAllDialogOpen}
        onOpenChange={setIsRenewAllDialogOpen}
        onConfirm={handleRenewAllTasks}
      />
    </div>
  )
}
