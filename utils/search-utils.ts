import type { Client, Project, Task } from "@/models/data-models"

/**
 * Unified search function that handles both 'proyecto' and 'cliente' terminology
 * @param searchTerm The term to search for
 * @param items The array of items to search within
 * @param itemType The type of items being searched ('client', 'project', or 'task')
 * @returns Filtered array of items that match the search term
 */
export function unifiedSearch<T extends Client | Project | Task>(
  searchTerm: string,
  items: T[],
  itemType: "client" | "project" | "task",
): T[] {
  if (!searchTerm) return items

  const term = searchTerm.toLowerCase()

  return items.filter((item) => {
    // Common fields to search in all item types
    const nameMatch = "name" in item && item.name.toLowerCase().includes(term)

    // Type-specific fields
    if (itemType === "client") {
      const client = item as unknown as Client
      return (
        nameMatch ||
        client.company.toLowerCase().includes(term) ||
        client.email?.toLowerCase().includes(term) ||
        false ||
        client.services.some((service) => service.name.toLowerCase().includes(term))
      )
    }

    if (itemType === "project") {
      const project = item as unknown as Project
      return (
        nameMatch ||
        project.clientName.toLowerCase().includes(term) ||
        project.service.toLowerCase().includes(term) ||
        project.description.toLowerCase().includes(term) ||
        project.responsible.toLowerCase().includes(term)
      )
    }

    if (itemType === "task") {
      const task = item as unknown as Task
      return (
        nameMatch ||
        task.title.toLowerCase().includes(term) ||
        task.clientName.toLowerCase().includes(term) ||
        task.projectName.toLowerCase().includes(term) ||
        task.service.toLowerCase().includes(term) ||
        task.assignee.toLowerCase().includes(term) ||
        task.description.toLowerCase().includes(term)
      )
    }

    return false
  })
}

/**
 * Unified filter function that handles filtering by various properties
 * @param items The array of items to filter
 * @param filters Object containing filter criteria
 * @param itemType The type of items being filtered
 * @returns Filtered array of items that match all filter criteria
 */
export function unifiedFilter<T extends Client | Project | Task>(
  items: T[],
  filters: Record<string, any>,
  itemType: "client" | "project" | "task",
): T[] {
  return items.filter((item) => {
    // Check each filter criterion
    for (const [key, value] of Object.entries(filters)) {
      // Skip empty filter values
      if (!value) continue

      // Handle special case for status filter that might use different terminology
      if (key === "status") {
        if (itemType === "client" && "status" in item) {
          if (item.status !== value) return false
        } else if (itemType === "project" && "status" in item) {
          if (item.status !== value) return false
        } else if (itemType === "task" && "status" in item) {
          if (item.status !== value) return false
        }
        continue
      }

      // Handle other common filters
      if (key in item && item[key as keyof T] !== value) {
        return false
      }
    }

    return true
  })
}
