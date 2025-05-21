import { supabase } from "@/lib/supabase"
import type { Client } from "@/models/data-models"

// Fetch all clients
export async function fetchClients(): Promise<Client[]> {
  try {
    const { data, error } = await supabase
      .from("clients")
      .select(`
        *,
        client_services(
          *,
          service_collaborators(
            *,
            users(id, name)
          ),
          partial_payments(*)
        ),
        projects(id, name)
      `)
      .order("name")

    if (error) {
      console.error("Error fetching clients:", error)
      throw error
    }

    // Transform the data to match our Client model
    return data.map((client) => ({
      id: client.id,
      name: client.name,
      company: client.company,
      email: client.email || "",
      phone: client.phone || "",
      instagramLink: client.instagram_link || "",
      facebookLink: client.facebook_link || "",
      websiteLink: client.website_link || "",
      canvaLink: client.canva_link || "",
      driveLink: client.drive_link || "",
      paymentDay: client.payment_day,
      status: client.status as "Activo" | "Inactivo",
      comments: client.comments || "",
      services: (client.client_services || []).map((service) => ({
        id: service.id.toString(),
        name: service.service_name,
        collaborators: (service.service_collaborators || []).map((collab) => ({
          id: collab.id.toString(),
          collaboratorId: collab.user_id.toString(),
          collaboratorName: collab.users?.name || "Unknown",
          role: collab.role,
        })),
        startDate: service.start_date,
        price: service.price,
        status: service.status as "Activo" | "Pausado",
        paymentScheme: service.payment_scheme as "Completo" | "Parcial",
        partialPayments: (service.partial_payments || []).map((payment) => ({
          id: payment.id.toString(),
          percentage: payment.percentage,
          amount: payment.amount,
          dueDate: payment.due_date,
          status: payment.status as "Pendiente" | "Pagado",
          description: payment.description,
        })),
      })),
      total: client.total,
      billingCycle: client.billing_cycle || "",
      paymentMethod: client.payment_method || "",
      paymentStatus: client.payment_status as "Pendiente" | "Emitida" | "Pagada",
      renewalType: client.renewal_type || "",
      renewalDate: client.renewal_date,
      autoRenewal: client.auto_renewal,
      cuil: client.cuil || "",
      condicionFiscal: client.condicion_fiscal || "",
      birthDate: client.birth_date,
      projects: (client.projects || []).map((project) => ({
        id: project.id,
        name: project.name,
        clientId: client.id,
        clientName: client.name,
        service: "", // Will be populated in project service
        status: "No iniciado", // Will be populated in project service
        progress: 0, // Will be populated in project service
        startDate: "", // Will be populated in project service
        endDate: "", // Will be populated in project service
        lastUpdate: "", // Will be populated in project service
        responsible: "", // Will be populated in project service
        description: "", // Will be populated in project service
        collaborators: [], // Will be populated in project service
        budget: 0, // Will be populated in project service
        cost: 0, // Will be populated in project service
        tasks: [], // Will be populated in project service
      })),
    }))
  } catch (error) {
    console.error("Error in fetchClients:", error)
    return []
  }
}

// Fetch a single client by ID
export async function fetchClientById(id: number): Promise<Client | null> {
  try {
    const { data, error } = await supabase
      .from("clients")
      .select(`
        *,
        client_services(
          *,
          service_collaborators(
            *,
            users(id, name)
          ),
          partial_payments(*)
        ),
        projects(id, name)
      `)
      .eq("id", id)
      .single()

    if (error) {
      console.error(`Error fetching client with ID ${id}:`, error)
      return null
    }

    // Transform the data to match our Client model
    return {
      id: data.id,
      name: data.name,
      company: data.company,
      email: data.email || "",
      phone: data.phone || "",
      instagramLink: data.instagram_link || "",
      facebookLink: data.facebook_link || "",
      websiteLink: data.website_link || "",
      canvaLink: data.canva_link || "",
      driveLink: data.drive_link || "",
      paymentDay: data.payment_day,
      status: data.status as "Activo" | "Inactivo",
      comments: data.comments || "",
      services: (data.client_services || []).map((service) => ({
        id: service.id.toString(),
        name: service.service_name,
        collaborators: (service.service_collaborators || []).map((collab) => ({
          id: collab.id.toString(),
          collaboratorId: collab.user_id.toString(),
          collaboratorName: collab.users?.name || "Unknown",
          role: collab.role,
        })),
        startDate: service.start_date,
        price: service.price,
        status: service.status as "Activo" | "Pausado",
        paymentScheme: service.payment_scheme as "Completo" | "Parcial",
        partialPayments: (service.partial_payments || []).map((payment) => ({
          id: payment.id.toString(),
          percentage: payment.percentage,
          amount: payment.amount,
          dueDate: payment.due_date,
          status: payment.status as "Pendiente" | "Pagado",
          description: payment.description,
        })),
      })),
      total: data.total,
      billingCycle: data.billing_cycle || "",
      paymentMethod: data.payment_method || "",
      paymentStatus: data.payment_status as "Pendiente" | "Emitida" | "Pagada",
      renewalType: data.renewal_type || "",
      renewalDate: data.renewal_date,
      autoRenewal: data.auto_renewal,
      cuil: data.cuil || "",
      condicionFiscal: data.condicion_fiscal || "",
      birthDate: data.birth_date,
      projects: (data.projects || []).map((project) => ({
        id: project.id,
        name: project.name,
        clientId: data.id,
        clientName: data.name,
        service: "", // Will be populated in project service
        status: "No iniciado", // Will be populated in project service
        progress: 0, // Will be populated in project service
        startDate: "", // Will be populated in project service
        endDate: "", // Will be populated in project service
        lastUpdate: "", // Will be populated in project service
        responsible: "", // Will be populated in project service
        description: "", // Will be populated in project service
        collaborators: [], // Will be populated in project service
        budget: 0, // Will be populated in project service
        cost: 0, // Will be populated in project service
        tasks: [], // Will be populated in project service
      })),
    }
  } catch (error) {
    console.error(`Error in fetchClientById for ID ${id}:`, error)
    return null
  }
}

// Create a new client
export async function createClient(client: Omit<Client, "id">): Promise<Client | null> {
  try {
    // First, insert the client
    const { data: clientData, error: clientError } = await supabase
      .from("clients")
      .insert({
        name: client.name,
        company: client.company,
        email: client.email || null,
        phone: client.phone || null,
        instagram_link: client.instagramLink || null,
        facebook_link: client.facebookLink || null,
        website_link: client.websiteLink || null,
        canva_link: client.canvaLink || null,
        drive_link: client.driveLink || null,
        payment_day: client.paymentDay,
        status: client.status,
        comments: client.comments || null,
        total: client.total,
        billing_cycle: client.billingCycle || null,
        payment_method: client.paymentMethod || null,
        payment_status: client.paymentStatus,
        renewal_type: client.renewalType || null,
        renewal_date: client.renewalDate || null,
        auto_renewal: client.autoRenewal,
        cuil: client.cuil || null,
        condicion_fiscal: client.condicionFiscal || null,
        birth_date: client.birthDate || null,
      })
      .select()
      .single()

    if (clientError) {
      console.error("Error creating client:", clientError)
      throw clientError
    }

    // Now, insert the client services
    for (const service of client.services) {
      const { data: serviceData, error: serviceError } = await supabase
        .from("client_services")
        .insert({
          client_id: clientData.id,
          service_name: service.name,
          start_date: service.startDate || null,
          price: service.price,
          status: service.status,
          payment_scheme: service.paymentScheme,
        })
        .select()
        .single()

      if (serviceError) {
        console.error("Error creating client service:", serviceError)
        continue
      }

      // Insert service collaborators
      for (const collaborator of service.collaborators) {
        const { error: collabError } = await supabase.from("service_collaborators").insert({
          service_id: serviceData.id,
          user_id: Number.parseInt(collaborator.collaboratorId),
          role: collaborator.role,
        })

        if (collabError) {
          console.error("Error creating service collaborator:", collabError)
        }
      }

      // Insert partial payments if any
      if (service.paymentScheme === "Parcial" && service.partialPayments.length > 0) {
        for (const payment of service.partialPayments) {
          const { error: paymentError } = await supabase.from("partial_payments").insert({
            service_id: serviceData.id,
            percentage: payment.percentage,
            amount: payment.amount,
            due_date: payment.dueDate || null,
            status: payment.status,
            description: payment.description,
          })

          if (paymentError) {
            console.error("Error creating partial payment:", paymentError)
          }
        }
      }
    }

    // Return the newly created client
    return await fetchClientById(clientData.id)
  } catch (error) {
    console.error("Error in createClient:", error)
    return null
  }
}

// Update an existing client
export async function updateClient(client: Client): Promise<Client | null> {
  try {
    // First, update the client
    const { error: clientError } = await supabase
      .from("clients")
      .update({
        name: client.name,
        company: client.company,
        email: client.email || null,
        phone: client.phone || null,
        instagram_link: client.instagramLink || null,
        facebook_link: client.facebookLink || null,
        website_link: client.websiteLink || null,
        canva_link: client.canvaLink || null,
        drive_link: client.driveLink || null,
        payment_day: client.paymentDay,
        status: client.status,
        comments: client.comments || null,
        total: client.total,
        billing_cycle: client.billingCycle || null,
        payment_method: client.paymentMethod || null,
        payment_status: client.paymentStatus,
        renewal_type: client.renewalType || null,
        renewal_date: client.renewalDate || null,
        auto_renewal: client.autoRenewal,
        cuil: client.cuil || null,
        condicion_fiscal: client.condicionFiscal || null,
        birth_date: client.birthDate || null,
      })
      .eq("id", client.id)

    if (clientError) {
      console.error(`Error updating client with ID ${client.id}:`, clientError)
      throw clientError
    }

    // Get existing services for this client
    const { data: existingServices, error: servicesError } = await supabase
      .from("client_services")
      .select("id")
      .eq("client_id", client.id)

    if (servicesError) {
      console.error(`Error fetching existing services for client ${client.id}:`, servicesError)
    }

    const existingServiceIds = new Set((existingServices || []).map((s) => Number.parseInt(s.id)))
    const updatedServiceIds = new Set(client.services.map((s) => Number.parseInt(s.id)))

    // Delete services that are no longer present
    for (const existingId of existingServiceIds) {
      if (!updatedServiceIds.has(existingId)) {
        const { error: deleteError } = await supabase.from("client_services").delete().eq("id", existingId)
        if (deleteError) {
          console.error(`Error deleting service ${existingId}:`, deleteError)
        }
      }
    }

    // Update or create services
    for (const service of client.services) {
      if (service.id && existingServiceIds.has(Number.parseInt(service.id))) {
        // Update existing service
        const { error: updateError } = await supabase
          .from("client_services")
          .update({
            service_name: service.name,
            start_date: service.startDate || null,
            price: service.price,
            status: service.status,
            payment_scheme: service.paymentScheme,
          })
          .eq("id", service.id)

        if (updateError) {
          console.error(`Error updating service ${service.id}:`, updateError)
          continue
        }

        // Handle collaborators and payments for this service
        await updateServiceCollaborators(Number.parseInt(service.id), service.collaborators)
        await updatePartialPayments(Number.parseInt(service.id), service.partialPayments)
      } else {
        // Create new service
        const { data: newService, error: createError } = await supabase
          .from("client_services")
          .insert({
            client_id: client.id,
            service_name: service.name,
            start_date: service.startDate || null,
            price: service.price,
            status: service.status,
            payment_scheme: service.paymentScheme,
          })
          .select()
          .single()

        if (createError) {
          console.error("Error creating new service:", createError)
          continue
        }

        // Add collaborators and payments for this new service
        for (const collaborator of service.collaborators) {
          const { error: collabError } = await supabase.from("service_collaborators").insert({
            service_id: newService.id,
            user_id: Number.parseInt(collaborator.collaboratorId),
            role: collaborator.role,
          })

          if (collabError) {
            console.error("Error creating service collaborator:", collabError)
          }
        }

        if (service.paymentScheme === "Parcial" && service.partialPayments.length > 0) {
          for (const payment of service.partialPayments) {
            const { error: paymentError } = await supabase.from("partial_payments").insert({
              service_id: newService.id,
              percentage: payment.percentage,
              amount: payment.amount,
              due_date: payment.dueDate || null,
              status: payment.status,
              description: payment.description,
            })

            if (paymentError) {
              console.error("Error creating partial payment:", paymentError)
            }
          }
        }
      }
    }

    // Return the updated client
    return await fetchClientById(client.id)
  } catch (error) {
    console.error(`Error in updateClient for ID ${client.id}:`, error)
    return null
  }
}

// Helper function to update service collaborators
async function updateServiceCollaborators(serviceId: number, collaborators: any[]) {
  try {
    // Get existing collaborators
    const { data: existingCollaborators, error: fetchError } = await supabase
      .from("service_collaborators")
      .select("id, user_id")
      .eq("service_id", serviceId)

    if (fetchError) {
      console.error(`Error fetching collaborators for service ${serviceId}:`, fetchError)
      return
    }

    const existingCollabMap = new Map((existingCollaborators || []).map((c) => [c.user_id.toString(), c.id]))
    const updatedCollabIds = new Set(collaborators.map((c) => c.collaboratorId))

    // Delete collaborators that are no longer present
    for (const [userId, collabId] of existingCollabMap.entries()) {
      if (!updatedCollabIds.has(userId)) {
        const { error: deleteError } = await supabase.from("service_collaborators").delete().eq("id", collabId)
        if (deleteError) {
          console.error(`Error deleting collaborator ${collabId}:`, deleteError)
        }
      }
    }

    // Add new collaborators
    for (const collaborator of collaborators) {
      if (!existingCollabMap.has(collaborator.collaboratorId)) {
        const { error: insertError } = await supabase.from("service_collaborators").insert({
          service_id: serviceId,
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
          .from("service_collaborators")
          .update({ role: collaborator.role })
          .eq("id", collabId)

        if (updateError) {
          console.error(`Error updating collaborator ${collabId}:`, updateError)
        }
      }
    }
  } catch (error) {
    console.error(`Error in updateServiceCollaborators for service ${serviceId}:`, error)
  }
}

// Helper function to update partial payments
async function updatePartialPayments(serviceId: number, payments: any[]) {
  try {
    // Get existing payments
    const { data: existingPayments, error: fetchError } = await supabase
      .from("partial_payments")
      .select("id")
      .eq("service_id", serviceId)

    if (fetchError) {
      console.error(`Error fetching payments for service ${serviceId}:`, fetchError)
      return
    }

    const existingPaymentIds = new Set((existingPayments || []).map((p) => p.id.toString()))
    const updatedPaymentIds = new Set(payments.filter((p) => p.id).map((p) => p.id))

    // Delete payments that are no longer present
    for (const existingId of existingPaymentIds) {
      if (!updatedPaymentIds.has(existingId)) {
        const { error: deleteError } = await supabase.from("partial_payments").delete().eq("id", existingId)
        if (deleteError) {
          console.error(`Error deleting payment ${existingId}:`, deleteError)
        }
      }
    }

    // Update or create payments
    for (const payment of payments) {
      if (payment.id && existingPaymentIds.has(payment.id)) {
        // Update existing payment
        const { error: updateError } = await supabase
          .from("partial_payments")
          .update({
            percentage: payment.percentage,
            amount: payment.amount,
            due_date: payment.dueDate || null,
            status: payment.status,
            description: payment.description,
          })
          .eq("id", payment.id)

        if (updateError) {
          console.error(`Error updating payment ${payment.id}:`, updateError)
        }
      } else {
        // Create new payment
        const { error: createError } = await supabase.from("partial_payments").insert({
          service_id: serviceId,
          percentage: payment.percentage,
          amount: payment.amount,
          due_date: payment.dueDate || null,
          status: payment.status,
          description: payment.description,
        })

        if (createError) {
          console.error("Error creating new payment:", createError)
        }
      }
    }
  } catch (error) {
    console.error(`Error in updatePartialPayments for service ${serviceId}:`, error)
  }
}

// Delete a client
export async function deleteClient(id: number): Promise<boolean> {
  try {
    const { error } = await supabase.from("clients").delete().eq("id", id)

    if (error) {
      console.error(`Error deleting client with ID ${id}:`, error)
      return false
    }

    return true
  } catch (error) {
    console.error(`Error in deleteClient for ID ${id}:`, error)
    return false
  }
}
