/**
 * Data Models for Piria Digital System
 *
 * This file defines the core data models and their relationships
 * for the Piria Digital management system.
 */

// Client represents a business entity that contracts services
export interface Client {
  id: number
  name: string
  company: string
  email?: string
  phone?: string
  instagramLink?: string
  facebookLink?: string
  websiteLink?: string
  canvaLink?: string
  driveLink?: string
  paymentDay: number
  status: "Activo" | "Inactivo"
  comments?: string
  services: ClientService[]
  total: number
  billingCycle?: string
  paymentMethod?: string
  paymentStatus: "Pendiente" | "Emitida" | "Pagada"
  renewalType?: string
  renewalDate?: Date | string
  autoRenewal: boolean
  cuil?: string
  condicionFiscal?: string
  birthDate?: Date | string
  // Projects associated with this client
  projects: Project[]
}

// Project represents a specific engagement or work initiative for a client
export interface Project {
  id: number
  name: string
  clientId: number // Reference to the parent client
  clientName: string // Denormalized for convenience
  service: string
  status: "Completado" | "En curso" | "Esperando aprobación" | "Pausado" | "No iniciado"
  progress: number
  startDate: string
  endDate: string
  lastUpdate: string
  responsible: string
  description: string
  collaborators: ServiceCollaborator[]
  budget: number
  cost: number
  tasks: Task[]
}

// ClientService represents a service contracted by a client
export interface ClientService {
  id: string
  name: string
  collaborators: ServiceCollaborator[]
  startDate?: Date | string
  price: number
  status: "Activo" | "Pausado"
  paymentScheme: "Completo" | "Parcial"
  partialPayments: PartialPayment[]
}

// Task represents a specific work item within a project
export interface Task {
  id: number
  title: string
  projectId: number // Reference to the parent project
  clientId: number // Reference to the ultimate client
  clientName: string // Denormalized for convenience
  projectName: string // Denormalized for convenience
  service: string
  assignee: string
  assigneeInitial: string
  dueDate: string
  status: "Pendiente" | "En Progreso" | "Completada" | "Pausada"
  priority: "Alta" | "Media" | "Baja"
  description: string
  comments: TaskComment[]
  created: string
  lastUpdated: string
}

// Supporting interfaces
export interface ServiceCollaborator {
  id: string
  collaboratorId: string
  collaboratorName: string
  role: string
}

export interface PartialPayment {
  id: string
  percentage: number
  amount: number
  dueDate?: Date | string
  status: "Pendiente" | "Pagado"
  description: string
}

export interface TaskComment {
  author: string
  date: string
  text: string
}

// Add this interface after the TaskComment interface
export interface TaskAssignment {
  taskId: number
  assignerId: string
  assignerName: string
  assigneeId: string
  assigneeName: string
  assigneeInitial: string
  timestamp: string
}
