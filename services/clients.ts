
import { supabase } from "@/lib/supabase"
import type { Client } from "@/types/client-types"

export async function fetchClients(): Promise<Client[]> {
    const { data, error } = await supabase.from("clients").select("*")
    if (error) throw new Error(error.message)
    return data
}

export async function createClient(client: Partial<Client>): Promise<Client> {
    const insertData = {
        ...client,
        renewalDate: client.renewalDate ? new Date(client.renewalDate).toISOString() : null,
        birthDate: client.birthDate ? new Date(client.birthDate).toISOString() : null,
        services: client.services || [],
    }

    const { data, error } = await supabase
        .from("clients")
        .insert([insertData])
        .select()
        .single()

    if (error) throw new Error(error.message)
    return data
}

export async function updateClient(id: number, client: Partial<Client>): Promise<Client> {
    const updateData = {
        ...client,
        renewalDate: client.renewalDate ? new Date(client.renewalDate).toISOString() : null,
        birthDate: client.birthDate ? new Date(client.birthDate).toISOString() : null,
    }

    const { data, error } = await supabase
        .from("clients")
        .update(updateData)
        .eq("id", id)
        .select()
        .single()

    if (error) throw new Error(error.message)
    return data
}

export async function disableClient(id: number): Promise<void> {
    const { error } = await supabase
        .from("clients")
        .update({ status: "Inactivo", disabledAt: new Date().toISOString() })
        .eq("id", id)

    if (error) throw new Error(error.message)
}

export async function reactivateClient(id: number): Promise<void> {
    const { error } = await supabase
        .from("clients")
        .update({ status: "Activo", disabledAt: null })
        .eq("id", id)

    if (error) throw new Error(error.message)
}
