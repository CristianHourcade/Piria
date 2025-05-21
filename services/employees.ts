import { supabase } from "@/lib/supabase";
import type { Employee } from "@/types/employee";

// Obtener todos los empleados
export async function fetchEmployees(): Promise<Employee[]> {
    const { data, error } = await supabase
        .from("employee")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching employees:", error);
        return [];
    }

    return data as Employee[];
}

// Crear un nuevo empleado
export async function createEmployee(employee: Omit<Employee, "id" | "created_at" | "updated_at">): Promise<Employee | null> {
    const { data, error } = await supabase
        .from("employee")
        .insert([employee])
        .select()
        .single();

    if (error) {
        console.error("Error creating employee:", error);
        return null;
    }

    return data as Employee;
}

// Actualizar un empleado existente
export async function updateEmployee(id: number, employee: Partial<Omit<Employee, "id" | "created_at" | "updated_at">>): Promise<Employee | null> {
    const { data, error } = await supabase
        .from("employee")
        .update(employee)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error("Error updating employee:", error);
        return null;
    }

    return data as Employee;
}

// Eliminar un empleado
export async function deleteEmployee(id: number): Promise<boolean> {
    const { error } = await supabase
        .from("employee")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Error deleting employee:", error);
        return false;
    }

    return true;
}
