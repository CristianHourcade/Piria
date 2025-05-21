import { supabase } from "@/lib/supabase"
import { Lead } from "@/types/lead"

export async function fetchLeads(): Promise<Lead[]> {
    const { data, error } = await supabase
        .from("Lead")
        .select("*")
        .order("createdAt", { ascending: false })

    if (error) {
        console.error("Error fetching leads:", error)
        return []
    }

    return data as Lead[]
}


export async function createLead(lead: Omit<Lead, "id" | "createdAt" | "updatedAt">): Promise<Lead | null> {
    const { data, error } = await supabase
        .from("Lead")
        .insert([lead])
        .select()
        .single()

    if (error) {
        console.error("Error creating lead:", error)
        return null
    }

    return data as Lead
}

export async function updateLead(id: number, lead: Partial<Omit<Lead, "id" | "createdAt" | "updatedAt">>): Promise<Lead | null> {
    const { data, error } = await supabase
        .from("Lead")
        .update(lead)
        .eq("id", id)
        .select()
        .single()

    if (error) {
        console.error("Error updating lead:", error)
        return null
    }

    return data as Lead
}

export async function deleteLead(id: number): Promise<boolean> {
    const { error } = await supabase
        .from("Lead")
        .delete()
        .eq("id", id)

    if (error) {
        console.error("Error deleting lead:", error)
        return false
    }

    return true
}