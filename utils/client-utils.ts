import type { Client, ClientService } from "@/types/client-types"

// Función para calcular el total basado en los servicios activos
export const calculateTotal = (services: ClientService[]) => {
  return services
    .filter((service) => service.status === "Activo")
    .reduce((sum, service) => sum + (service.price || 0), 0)
}

// Dummy functions for task and project generation
export const generateTasksForClient = (client: Client) => {
  // Replace this with your actual task generation logic
  return []
}

export const generateProjectsForClient = (client: Client) => {
  // Replace this with your actual project generation logic
  return []
}
