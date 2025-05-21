import { supabase } from "@/lib/supabase"
import type { Task, TaskComment } from "@/models/data-models"
import type { TimeEntry } from "@/models/time-tracking"

// Fetch all tasks
export async function fetchTasks(): Promise<Task[]> {
  try {
    const { data, error } = await supabase
      .from("tasks")
      .select(`
        *,
        projects(id, name, client_id, service),
        clients(id, name),
        users(id, name, initials),
        task_comments(*)
      `)
      .order("due_date")

    if (error) {
      console.error("Error fetching tasks:", error)
      throw error
    }

    // Fetch time entries for each task
    const taskIds = data.map((task) => task.id)
    const { data: timeEntries, error: timeError } = await supabase
      .from("time_entries")
      .select("*")
      .in("task_id", taskIds)

    if (timeError) {
      console.error("Error fetching time entries:", timeError)
    }

    // Group time entries by task ID
    const timeEntriesByTask = (timeEntries || []).reduce(
      (acc, entry) => {
        if (!acc[entry.task_id]) {
          acc[entry.task_id] = []
        }
        acc[entry.task_id].push(entry)
        return acc
      },
      {} as Record<number, any[]>,
    )

    // Transform the data to match our Task model
    return data.map((task) => ({
      id: task.id,
      title: task.title,
      projectId: task.project_id,
      clientId: task.client_id,
      clientName: task.clients?.name || task.projects?.clients?.name || "Unknown Client",
      projectName: task.projects?.name || "No Project",
      service: task.service || task.projects?.service || "",
      assignee: task.users?.name || "",
      assigneeInitial: task.users?.initials || "",
      dueDate: task.due_date,
      status: task.status as "Pendiente" | "En Progreso" | "Completada" | "Pausada",
      priority: task.priority as "Alta" | "Media" | "Baja",
      description: task.description || "",
      comments: (task.task_comments || []).map((comment) => ({
        author: comment.author_name,
        date: comment.created_at,
        text: comment.text,
      })),
      created: task.created_at,
      lastUpdated: task.updated_at,
      timeEntries: (timeEntriesByTask[task.id] || []).map((entry) => ({
        id: entry.id,
        taskId: entry.task_id,
        startTime: entry.start_time,
        endTime: entry.end_time,
        duration: entry.duration,
        notes: entry.notes || "",
      })),
      manuallyPrioritized: task.manually_prioritized || false,
    }))
  } catch (error) {
    console.error("Error in fetchTasks:", error)
    return []
  }
}

// Fetch tasks for a specific user
export async function fetchTasksForUser(userId: number): Promise<Task[]> {
  try {
    const { data, error } = await supabase
      .from("tasks")
      .select(`
        *,
        projects(id, name, client_id, service),
        clients(id, name),
        users(id, name, initials),
        task_comments(*)
      `)
      .eq("assignee_id", userId)
      .order("due_date")

    if (error) {
      console.error(`Error fetching tasks for user ${userId}:`, error)
      throw error
    }

    // Fetch time entries for each task
    const taskIds = data.map((task) => task.id)
    const { data: timeEntries, error: timeError } = await supabase
      .from("time_entries")
      .select("*")
      .in("task_id", taskIds)

    if (timeError) {
      console.error("Error fetching time entries:", timeError)
    }

    // Group time entries by task ID
    const timeEntriesByTask = (timeEntries || []).reduce(
      (acc, entry) => {
        if (!acc[entry.task_id]) {
          acc[entry.task_id] = []
        }
        acc[entry.task_id].push(entry)
        return acc
      },
      {} as Record<number, any[]>,
    )

    // Transform the data to match our Task model
    return data.map((task) => ({
      id: task.id,
      title: task.title,
      projectId: task.project_id,
      clientId: task.client_id,
      clientName: task.clients?.name || task.projects?.clients?.name || "Unknown Client",
      projectName: task.projects?.name || "No Project",
      service: task.service || task.projects?.service || "",
      assignee: task.users?.name || "",
      assigneeInitial: task.users?.initials || "",
      dueDate: task.due_date,
      status: task.status as "Pendiente" | "En Progreso" | "Completada" | "Pausada",
      priority: task.priority as "Alta" | "Media" | "Baja",
      description: task.description || "",
      comments: (task.task_comments || []).map((comment) => ({
        author: comment.author_name,
        date: comment.created_at,
        text: comment.text,
      })),
      created: task.created_at,
      lastUpdated: task.updated_at,
      timeEntries: (timeEntriesByTask[task.id] || []).map((entry) => ({
        id: entry.id,
        taskId: entry.task_id,
        startTime: entry.start_time,
        endTime: entry.end_time,
        duration: entry.duration,
        notes: entry.notes || "",
      })),
      manuallyPrioritized: task.manually_prioritized || false,
    }))
  } catch (error) {
    console.error(`Error in fetchTasksForUser for user ${userId}:`, error)
    return []
  }
}

// Fetch a single task by ID
export async function fetchTaskById(id: number): Promise<Task | null> {
  try {
    const { data, error } = await supabase
      .from("tasks")
      .select(`
        *,
        projects(id, name, client_id, service),
        clients(id, name),
        users(id, name, initials),
        task_comments(*)
      `)
      .eq("id", id)
      .single()

    if (error) {
      console.error(`Error fetching task with ID ${id}:`, error)
      return null
    }

    // Fetch time entries for this task
    const { data: timeEntries, error: timeError } = await supabase.from("time_entries").select("*").eq("task_id", id)

    if (timeError) {
      console.error(`Error fetching time entries for task ${id}:`, timeError)
    }

    // Transform the data to match our Task model
    return {
      id: data.id,
      title: data.title,
      projectId: data.project_id,
      clientId: data.client_id,
      clientName: data.clients?.name || data.projects?.clients?.name || "Unknown Client",
      projectName: data.projects?.name || "No Project",
      service: data.service || data.projects?.service || "",
      assignee: data.users?.name || "",
      assigneeInitial: data.users?.initials || "",
      dueDate: data.due_date,
      status: data.status as "Pendiente" | "En Progreso" | "Completada" | "Pausada",
      priority: data.priority as "Alta" | "Media" | "Baja",
      description: data.description || "",
      comments: (data.task_comments || []).map((comment) => ({
        author: comment.author_name,
        date: comment.created_at,
        text: comment.text,
      })),
      created: data.created_at,
      lastUpdated: data.updated_at,
      timeEntries: (timeEntries || []).map((entry) => ({
        id: entry.id,
        taskId: entry.task_id,
        startTime: entry.start_time,
        endTime: entry.end_time,
        duration: entry.duration,
        notes: entry.notes || "",
      })),
      manuallyPrioritized: data.manually_prioritized || false,
    }
  } catch (error) {
    console.error(`Error in fetchTaskById for ID ${id}:`, error)
    return null
  }
}

// Create a new task
export async function createTask(task: Omit<Task, "id" | "created" | "lastUpdated">): Promise<Task | null> {
  try {
    // First, insert the task
    const { data: taskData, error: taskError } = await supabase
      .from("tasks")
      .insert({
        title: task.title,
        project_id: task.projectId || null,
        client_id: task.clientId || null,
        service: task.service || null,
        assignee_id: task.assignee ? await getUserIdByName(task.assignee) : null,
        due_date: task.dueDate,
        status: task.status,
        priority: task.priority,
        description: task.description || null,
        manually_prioritized: task.manuallyPrioritized || false,
      })
      .select()
      .single()

    if (taskError) {
      console.error("Error creating task:", taskError)
      throw taskError
    }

    // Add comments if any
    if (task.comments && task.comments.length > 0) {
      for (const comment of task.comments) {
        const { error: commentError } = await supabase.from("task_comments").insert({
          task_id: taskData.id,
          author_name: comment.author,
          text: comment.text,
        })

        if (commentError) {
          console.error("Error creating task comment:", commentError)
        }
      }
    }

    // Add time entries if any
    if (task.timeEntries && task.timeEntries.length > 0) {
      for (const entry of task.timeEntries) {
        const { error: entryError } = await supabase.from("time_entries").insert({
          task_id: taskData.id,
          start_time: entry.startTime,
          end_time: entry.endTime,
          duration: entry.duration,
          notes: entry.notes || null,
        })

        if (entryError) {
          console.error("Error creating time entry:", entryError)
        }
      }
    }

    // Return the newly created task
    return await fetchTaskById(taskData.id)
  } catch (error) {
    console.error("Error in createTask:", error)
    return null
  }
}

// Update an existing task
export async function updateTask(task: Task): Promise<Task | null> {
  try {
    // First, update the task
    const { error: taskError } = await supabase
      .from("tasks")
      .update({
        title: task.title,
        project_id: task.projectId || null,
        client_id: task.clientId || null,
        service: task.service || null,
        assignee_id: task.assignee ? await getUserIdByName(task.assignee) : null,
        due_date: task.dueDate,
        status: task.status,
        priority: task.priority,
        description: task.description || null,
        manually_prioritized: task.manuallyPrioritized || false,
      })
      .eq("id", task.id)

    if (taskError) {
      console.error(`Error updating task with ID ${task.id}:`, taskError)
      throw taskError
    }

    // Return the updated task
    return await fetchTaskById(task.id)
  } catch (error) {
    console.error(`Error in updateTask for ID ${task.id}:`, error)
    return null
  }
}

// Add a comment to a task
export async function addTaskComment(taskId: number, comment: Omit<TaskComment, "id">): Promise<boolean> {
  try {
    const { error } = await supabase.from("task_comments").insert({
      task_id: taskId,
      author_name: comment.author,
      text: comment.text,
    })

    if (error) {
      console.error(`Error adding comment to task ${taskId}:`, error)
      return false
    }

    return true
  } catch (error) {
    console.error(`Error in addTaskComment for task ${taskId}:`, error)
    return false
  }
}

// Add a time entry to a task
export async function addTimeEntry(taskId: number, entry: Omit<TimeEntry, "id">): Promise<TimeEntry | null> {
  try {
    const { data, error } = await supabase
      .from("time_entries")
      .insert({
        task_id: taskId,
        start_time: entry.startTime,
        end_time: entry.endTime,
        duration: entry.duration,
        notes: entry.notes || null,
      })
      .select()
      .single()

    if (error) {
      console.error(`Error adding time entry to task ${taskId}:`, error)
      return null
    }

    return {
      id: data.id,
      taskId: data.task_id,
      startTime: data.start_time,
      endTime: data.end_time,
      duration: data.duration,
      notes: data.notes || "",
    }
  } catch (error) {
    console.error(`Error in addTimeEntry for task ${taskId}:`, error)
    return null
  }
}

// Update a time entry
export async function updateTimeEntry(entry: TimeEntry): Promise<TimeEntry | null> {
  try {
    const { data, error } = await supabase
      .from("time_entries")
      .update({
        start_time: entry.startTime,
        end_time: entry.endTime,
        duration: entry.duration,
        notes: entry.notes || null,
      })
      .eq("id", entry.id)
      .select()
      .single()

    if (error) {
      console.error(`Error updating time entry ${entry.id}:`, error)
      return null
    }

    return {
      id: data.id,
      taskId: data.task_id,
      startTime: data.start_time,
      endTime: data.end_time,
      duration: data.duration,
      notes: data.notes || "",
    }
  } catch (error) {
    console.error(`Error in updateTimeEntry for entry ${entry.id}:`, error)
    return null
  }
}

// Delete a task
export async function deleteTask(id: number): Promise<boolean> {
  try {
    const { error } = await supabase.from("tasks").delete().eq("id", id)

    if (error) {
      console.error(`Error deleting task with ID ${id}:`, error)
      return false
    }

    return true
  } catch (error) {
    console.error(`Error in deleteTask for ID ${id}:`, error)
    return false
  }
}

// Helper function to get user ID by name
async function getUserIdByName(name: string): Promise<number | null> {
  try {
    const { data, error } = await supabase.from("users").select("id").eq("name", name).single()

    if (error) {
      console.error(`Error finding user with name ${name}:`, error)
      return null
    }

    return data.id
  } catch (error) {
    console.error(`Error in getUserIdByName for name ${name}:`, error)
    return null
  }
}
