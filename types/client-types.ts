// Tipos para la estructura de datos
export interface ServiceCollaborator {
  id: string
  collaboratorId: string
  collaboratorName: string
  role: string
}

// Interfaz para pagos parciales
export interface PartialPayment {
  id: string
  percentage: number
  amount: number
  dueDate?: Date | string
  status: "Pendiente" | "Pagado"
  description: string
}

// Actualizar la interfaz ClientService para incluir precio, estado y pagos parciales
export interface ClientService {
  id: string
  name: string
  collaborators: ServiceCollaborator[]
  startDate?: Date | string
  price: number // Precio individual del servicio
  status: "Activo" | "Pausado" // Estado individual del servicio
  paymentScheme: "Completo" | "Parcial" // Esquema de pago
  partialPayments: PartialPayment[] // Pagos parciales para este servicio
}

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
  birthDate?: Date | string // Nuevo campo para fecha de nacimiento
  disabledAt?: string
}
