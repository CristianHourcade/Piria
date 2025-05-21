export interface Lead {
    id: number
    name: string
    company?: string
    email: string
    phone?: string
    interest?: string
    stage: string
    nextAction?: string // o Date, depende de cómo lo quieras formatear
    notes?: string
    createdAt: string
    updatedAt: string
}