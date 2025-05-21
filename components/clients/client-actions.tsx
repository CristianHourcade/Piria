"use client"

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
import type { Client } from "@/types/client-types"

interface ClientDisableDialogProps {
  client: Client | null
  isLoading: boolean
  onClose: () => void
  onConfirm: (client: Client) => void
}

export function ClientDisableDialog({ client, isLoading, onClose, onConfirm }: ClientDisableDialogProps) {
  if (!client) return null

  return (
    <AlertDialog open={!!client} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Desactivar cliente?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción desactivará temporalmente a <strong>{client.name}</strong>. El cliente no aparecerá en las
            listas activas, pero todos sus datos se conservarán para una posible reactivación futura.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onConfirm(client)}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading ? "Procesando..." : "Desactivar cliente"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

interface ClientReactivateDialogProps {
  client: Client | null
  isLoading: boolean
  onClose: () => void
  onConfirm: (client: Client) => void
}

export function ClientReactivateDialog({ client, isLoading, onClose, onConfirm }: ClientReactivateDialogProps) {
  if (!client) return null

  return (
    <AlertDialog open={!!client} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Reactivar cliente?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción reactivará a <strong>{client.name}</strong>. El cliente volverá a aparecer en las listas activas
            y se podrán asignar nuevas tareas y proyectos.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onConfirm(client)}
            disabled={isLoading}
            className="bg-[#00D1A1] hover:bg-[#00B38A]"
          >
            {isLoading ? "Procesando..." : "Reactivar cliente"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
