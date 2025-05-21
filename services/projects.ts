import { supabase } from "@/lib/supabase";
import type { Project } from "@/types/project";

// Obtener todos los proyectos
export async function fetchProjects(): Promise<Project[]> {
    const { data, error } = await supabase
        .from("project")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching projects:", error);
        return [];
    }

    return (data as any[]).map((data) => ({
        ...data,
        startDate: data.start_date,
        endDate: data.end_date,
        lastUpdate: data.last_update,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
    }));
}

// Crear nuevo proyecto
export async function createProject(project: Omit<Project, "id" | "created_at" | "updated_at">): Promise<Project | null> {
    const { data, error } = await supabase
        .from("project")
        .insert([project])
        .select()
        .single();

    if (error) {
        console.error("Error creating project:", error);
        return null;
    }

    return data as Project;
}

// Actualizar proyecto existente
export async function updateProject(id: number, updates: Partial<Omit<Project, "id" | "created_at" | "updated_at">>): Promise<Project | null> {
    const { data, error } = await supabase
        .from("project")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error("Error updating project:", error);
        return null;
    }

    return data as Project;
}

// Eliminar un proyecto
export async function deleteProject(id: number): Promise<boolean> {
    const { error } = await supabase
        .from("project")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Error deleting project:", error);
        return false;
    }

    return true;
}
