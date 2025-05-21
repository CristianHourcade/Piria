import type { Client, Project, Task } from "@/models/data-models"

/**
 * Converts legacy data formats to standardized format
 * This helps handle data that might use inconsistent terminology
 */
export function standardizeClientData(data: any): Client {
  // Handle case where client data might be in a "proyecto" format
  return {
    id: data.id,
    name: data.name || data.clientName || "",
    company: data.company || data.clientCompany || "",
    email: data.email || data.clientEmail || "",
    phone: data.phone || data.clientPhone || "",
    instagramLink: data.instagramLink || "",
    facebookLink: data.facebookLink || "",
    websiteLink: data.websiteLink || "",
    canvaLink: data.canvaLink || "",
    driveLink: data.driveLink || "",
    paymentDay: data.paymentDay || 1,
    status: data.status || "Activo",
    comments: data.comments || "",
    services: data.services || [],
    total: data.total || 0,
    billingCycle: data.billingCycle || "Mensual",
    paymentMethod: data.paymentMethod || "Transferencia",
    paymentStatus: data.paymentStatus || "Pendiente",
    renewalType: data.renewalType || "",
    renewalDate: data.renewalDate || null,
    autoRenewal: data.autoRenewal || false,
    cuil: data.cuil || "",
    condicionFiscal: data.condicionFiscal || "",
    birthDate: data.birthDate || null,
    projects: data.projects || [],
  }
}

/**
 * Converts legacy project data to standardized format
 */
export function standardizeProjectData(data: any): Project {
  return {
    id: data.id,
    name: data.name || data.projectName || "",
    clientId: data.clientId || 0,
    clientName: data.clientName || data.client || "",
    service: data.service || "",
    status: data.status || "No iniciado",
    progress: data.progress || 0,
    startDate: data.startDate || new Date().toISOString().split("T")[0],
    endDate: data.endDate || new Date().toISOString().split("T")[0],
    lastUpdate: data.lastUpdate || new Date().toISOString().split("T")[0],
    responsible: data.responsible || "",
    description: data.description || "",
    collaborators: data.collaborators || [],
    budget: data.budget || 0,
    cost: data.cost || 0,
    tasks: data.tasks || [],
  }
}

/**
 * Converts legacy task data to standardized format
 */
export function standardizeTaskData(data: any): Task {
  return {
    id: data.id,
    title: data.title || "",
    projectId: data.projectId || 0,
    clientId: data.clientId || 0,
    clientName: data.clientName || data.client || "",
    projectName: data.projectName || data.project || "",
    service: data.service || "",
    assignee: data.assignee || "",
    assigneeInitial: data.assigneeInitial || "",
    dueDate: data.dueDate || new Date().toISOString().split("T")[0],
    status: data.status || "Pendiente",
    priority: data.priority || "Media",
    description: data.description || "",
    comments: data.comments || [],
    created: data.created || new Date().toISOString().split("T")[0],
    lastUpdated: data.lastUpdated || new Date().toISOString().split("T")[0],
  }
}
