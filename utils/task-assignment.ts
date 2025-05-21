import type { Task } from "@/models/data-models"

// Function to create a notification for task assignment
export function createTaskAssignmentNotification(task: Task, assignerName: string, assigneeName: string) {
  // For the assignee
  const assigneeNotification = {
    id: `assign-${Date.now()}-${task.id}-to`,
    type: "asignacion" as const,
    title: "Tarea asignada",
    description: `${assignerName} te ha asignado la tarea "${task.title}"`,
    client: task.clientName,
    date: new Date().toLocaleDateString(),
    status: "pendiente" as const,
    read: false,
  }

  // For the assigner (confirmation)
  const assignerNotification = {
    id: `assign-${Date.now()}-${task.id}-from`,
    type: "asignacion" as const,
    title: "Tarea reasignada",
    description: `Has asignado la tarea "${task.title}" a ${assigneeName}`,
    client: task.clientName,
    date: new Date().toLocaleDateString(),
    status: "pendiente" as const,
    read: false,
  }

  return { assigneeNotification, assignerNotification }
}

// Function to assign a task to a collaborator
export function assignTask(
  tasks: Task[],
  taskId: number,
  collaboratorId: string,
  collaboratorName: string,
  collaboratorInitial: string,
): Task[] {
  return tasks.map((task) =>
    task.id === taskId
      ? {
          ...task,
          assignee: collaboratorName,
          assigneeInitial: collaboratorInitial,
          lastUpdated: new Date().toISOString(),
        }
      : task,
  )
}
