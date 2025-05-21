import { supabase } from "@/lib/supabase"

// Variable para evitar sincronizaciones simultáneas
let syncInProgress = false
// Caché para evitar consultas repetidas
const roleCache = new Map<string, { role: string; timestamp: number }>()
// Tiempo de expiración de la caché (5 minutos)
const CACHE_EXPIRY = 5 * 60 * 1000

export async function getUserRole(userId: string): Promise<string> {
  try {
    // Verificar si tenemos el rol en caché y no ha expirado
    const cachedData = roleCache.get(userId)
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_EXPIRY) {
      console.log("👤 Rol obtenido de caché:", cachedData.role)
      return cachedData.role
    }
    // Si no está en los metadatos, buscamos en la tabla users
    const { data, error } = await supabase.from("users").select("role").eq("auth_id", userId).single()

    if (error) {
      console.error("❌ Error al obtener rol desde tabla users:", error)
      return "colaborador" // Valor predeterminado
    }

    if (data?.role) {
      console.log("👤 Rol obtenido de tabla users:", data.role)

      // Actualizar caché
      roleCache.set(userId, { role: data.role, timestamp: Date.now() })

      return data.role
    }

    // Si no encontramos el rol en ningún lado, usamos el valor predeterminado
    return "colaborador"
  } catch (error) {
    console.error("❌ Error inesperado al obtener rol:", error)
    return "colaborador" // Valor predeterminado en caso de error
  }
}

// Función para sincronizar el rol entre la tabla users y los metadatos de autenticación
export async function syncUserRole(userId: string): Promise<void> {
  // Evitar sincronizaciones simultáneas
  if (syncInProgress) {
    console.log("🔄 Sincronización ya en progreso, saltando...")
    return
  }

  try {
    syncInProgress = true

    // Obtenemos el rol desde la tabla users
    const { data, error } = await supabase.from("users").select("role").eq("auth_id", userId).single()

    if (error || !data?.role) {
      console.error("❌ Error al obtener rol para sincronización:", error)
      return
    }

    console.log("🔄 Sincronizando rol en metadatos:", data.role)

    // Actualizamos los metadatos de autenticación con el rol de la tabla users
    const { error: updateError } = await supabase.auth.updateUser({
      data: { role: data.role },
    })

    if (updateError) {
      console.error("❌ Error al sincronizar rol en metadatos:", updateError)
      return
    }

    console.log("✅ Rol sincronizado correctamente:", data.role)

    // Actualizar caché
    roleCache.set(userId, { role: data.role, timestamp: Date.now() })
  } catch (error) {
    console.error("❌ Error inesperado al sincronizar rol:", error)
  } finally {
    syncInProgress = false
  }
}
