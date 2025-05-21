import { supabase } from "@/lib/supabase"
import type { Project, ServiceCollaborator } from "@/models/data-models"

// Fetch all projects
export async function fetchProjects(): Promise<Project[]> {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select(`
        *,
        clients(id, name),
        project_collaborators(
          id,
          user_id,
          role,
          users(id, name)
        ),
        tasks(id, title)
      `)
      .order("name")

    if (error) {
      console.error("Error fetching projects:", error)
      throw error
    }

    // Transform the data to match our Project model
    return data.map((project) => ({
      id: project.id,
      name: project.name,
      clientId: project.client_id,
      clientName: project.clients?.name || "Unknown Client",
      service: project.service,
      status: project.status as "Completado" | "En curso" | "Esperando aprobación" | "Pausado" | "No iniciado",
      progress: project.progress,
      startDate: project.start_date,
      endDate: project.end_date,
      lastUpdate: project.last_update,
      responsible: project.responsible,
      description: project.description,
      collaborators: (project.project_collaborators || []).map((collab) => ({
        id: collab.id.toString(),
        collaboratorId: collab.user_id.toString(),
        collaboratorName: collab.users?.name || "Unknown",
        role: collab.role,
      })),
      budget: project.budget,
      cost: project.cost,
      tasks: (project.tasks || []).map((task) => ({
        id: task.id,
        title: task.title,
        projectId: project.id,
        clientId: project.client_id,
        clientName: project.clients?.name || "Unknown Client",
        projectName: project.name,
        service: project.service,
        assignee: "", // Will be populated in task service
        assigneeInitial: "", // Will be populated in task service
        dueDate: "", // Will be populated in task service
        status: "Pendiente", // Will be populated in task service
        priority: "Media", // Will be populated in task service
        description: "", // Will be populated in task service
        comments: [], // Will be populated in task service
        created: "", // Will be populated in task service
        lastUpdated: "", // Will be populated in task service
      })),
    }))
  } catch (error) {
    console.error("Error in fetchProjects:", error)
    return []
  }
}

// Fetch a single project by ID
export async function fetchProjectById(id: number): Promise<Project | null> {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select(`
        *,
        clients(id, name),
        project_collaborators(
          id,
          user_id,
          role,
          users(id, name)
        ),
        tasks(*)
      `)
      .eq("id", id)
      .single()

    if (error) {
      console.error(`Error fetching project with ID ${id}:`, error)
      return null
    }

    // Transform the data to match our Project model
    return {
      id: data.id,
      name: data.name,
      clientId: data.client_id,
      clientName: data.clients?.name || "Unknown Client",
      service: data.service,
      status: data.status as "Completado" | "En curso" | "Esperando aprobación" | "Pausado" | "No iniciado",
      progress: data.progress,
      startDate: data.start_date,
      endDate: data.end_date,
      lastUpdate: data.last_update,
      responsible: data.responsible,
      description: data.description,
      collaborators: (data.project_collaborators || []).map((collab) => ({
        id: collab.id.toString(),
        collaboratorId: collab.user_id.toString(),
        collaboratorName: collab.users?.name || "Unknown",
        role: collab.role,
      })),
      budget: data.budget,
      cost: data.cost,
      tasks: (data.tasks || []).map((task) => ({
        id: task.id,
        title: task.title,
        projectId: data.id,
        clientId: data.client_id,
        clientName: data.clients?.name || "Unknown Client",
        projectName: data.name,
        service: data.service,
        assignee: task.assignee || "",
        assigneeInitial: task.assignee_initial || "",
        dueDate: task.due_date,
        status: task.status as "Pendiente" | "En Progreso" | "Completada" | "Pausada",
        priority: task.priority as "Alta" | "Media" | "Baja",
        description: task.description || "",
        comments: [], // Will be populated separately if needed
        created: task.created_at,
        lastUpdated: task.updated_at,
      })),
    }
  } catch (error) {
    console.error(`Error in fetchProjectById for ID ${id}:`, error)
    return null
  }
}

// Create a new project
export async function createProject(project: Omit<Project, "id">): Promise<Project | null> {
  try {
    // First, insert the project
    const { data: projectData, error: projectError } = await supabase
      .from("projects")
      .insert({
        name: project.name,
        client_id: project.clientId,
        service: project.service,
        status: project.status,
        progress: project.progress,
        start_date: project.startDate,
        end_date: project.endDate,
        last_update: project.lastUpdate,
        responsible: project.responsible,
        description: project.description,
        budget: project.budget,
        cost: project.cost,
      })
      .select()
      .single()

    if (projectError) {
      console.error("Error creating project:", projectError)
      throw projectError
    }

    // Now, insert the project collaborators
    for (const collaborator of project.collaborators) {
      const { error: collabError } = await supabase.from("project_collaborators").insert({
        project_id: projectData.id,
        user_id: Number.parseInt(collaborator.collaboratorId),
        role: collaborator.role,
      })

      if (collabError) {
        console.error("Error creating project collaborator:", collabError)
      }
    }

    // Return the newly created project
    return await fetchProjectById(projectData.id)
  } catch (error) {
    console.error("Error in createProject:", error)
    return null
  }
}

// Update an existing project
export async function updateProject(project: Project): Promise<Project | null> {
  try {
    // First, update the project
    const { error: projectError } = await supabase
      .from("projects")
      .update({
        name: project.name,
        client_id: project.clientId,
        service: project.service,
        status: project.status,
        progress: project.progress,
        start_date: project.startDate,
        end_date: project.endDate,
        last_update: project.lastUpdate,
        responsible: project.responsible,
        description: project.description,
        budget: project.budget,
        cost: project.cost,
      })
      .eq("id", project.id)

    if (projectError) {
      console.error(`Error updating project with ID ${project.id}:`, projectError)
      throw projectError
    }

    // Update project collaborators
    await updateProjectCollaborators(project.id, project.collaborators)

    // Return the updated project
    return await fetchProjectById(project.id)
  } catch (error) {
    console.error(`Error in updateProject for ID ${project.id}:`, error)
    return null
  }
}

// Helper function to update project collaborators
async function updateProjectCollaborators(projectId: number, collaborators: ServiceCollaborator[]) {
  try {
    // Get existing collaborators
    const { data: existingCollaborators, error: fetchError } = await supabase
      .from("project_collaborators")
      .select("id, user_id")
      .eq("project_id", projectId)

    if (fetchError) {
      console.error(`Error fetching collaborators for project ${projectId}:`, fetchError)
      return
    }

    const existingCollabMap = new Map((existingCollaborators || []).map((c) => [c.user_id.toString(), c.id]))
    const updatedCollabIds = new Set(collaborators.map((c) => c.collaboratorId))

    // Delete collaborators that are no longer present
    for (const [userId, collabId] of existingCollabMap.entries()) {
      if (!updatedCollabIds.has(userId)) {
        const { error: deleteError } = await supabase.from("project_collaborators").delete().eq("id", collabId)
        if (deleteError) {
          console.error(`Error deleting collaborator ${collabId}:`, deleteError)
        }
      }
    }

    // Add new collaborators
    for (const collaborator of collaborators) {
      if (!existingCollabMap.has(collaborator.collaboratorId)) {
        const { error: insertError } = await supabase.from("project_collaborators").insert({
          project_id: projectId,
          user_id: Number.parseInt(collaborator.collaboratorId),
          role: collaborator.role,
        })

        if (insertError) {
          console.error("Error adding new collaborator:", insertError)
        }
      } else {
        // Update existing collaborator role if needed
        const collabId = existingCollabMap.get(collaborator.collaboratorId)
        const { error: updateError } = await supabase
          .from("project_collaborators")
          .update({ role: collaborator.role })
          .eq("id", collabId)

        if (updateError) {
          console.error(`Error updating collaborator ${collabId}:`, updateError)
        }
      }
    }
  } catch (error) {
    console.error(`Error in updateProjectCollaborators for project ${projectId}:`, error)
  }
}

// Delete a project
export async function deleteProject(id: number): Promise<boolean> {
  try {
    const { error } = await supabase.from("projects").delete().eq("id", id)

    if (error) {
      console.error(`Error deleting project with ID ${id}:`, error)
      return false
    }

    return true
  } catch (error) {
    console.error(`Error in deleteProject for ID ${id}:`, error)
    return false
  }
}
