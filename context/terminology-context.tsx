"use client"

import { createContext, useContext, type ReactNode } from "react"

// Define the terminology context type
type TerminologyContextType = {
  // Primary terms
  clientTerm: string
  projectTerm: string
  serviceTerm: string
  taskTerm: string

  // Plural forms
  clientTermPlural: string
  projectTermPlural: string
  serviceTermPlural: string
  taskTermPlural: string

  // Relationship descriptions
  clientProjectRelationship: string
  projectTaskRelationship: string
}

// Create the context with default values
const TerminologyContext = createContext<TerminologyContextType>({
  clientTerm: "Cliente",
  projectTerm: "Proyecto",
  serviceTerm: "Servicio",
  taskTerm: "Tarea",

  clientTermPlural: "Clientes",
  projectTermPlural: "Proyectos",
  serviceTermPlural: "Servicios",
  taskTermPlural: "Tareas",

  clientProjectRelationship: "Proyectos del cliente",
  projectTaskRelationship: "Tareas del proyecto",
})

// Provider component
export function TerminologyProvider({ children }: { children: ReactNode }) {
  // These values could be loaded from configuration or user preferences
  const value: TerminologyContextType = {
    clientTerm: "Cliente",
    projectTerm: "Proyecto",
    serviceTerm: "Servicio",
    taskTerm: "Tarea",

    clientTermPlural: "Clientes",
    projectTermPlural: "Proyectos",
    serviceTermPlural: "Servicios",
    taskTermPlural: "Tareas",

    clientProjectRelationship: "Proyectos del cliente",
    projectTaskRelationship: "Tareas del proyecto",
  }

  return <TerminologyContext.Provider value={value}>{children}</TerminologyContext.Provider>
}

// Hook for using the terminology context
export function useTerminology() {
  return useContext(TerminologyContext)
}
