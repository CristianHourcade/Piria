import { supabase } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"

// User interface for our application
export interface AppUser {
  id: number
  auth_id: string
  name: string
  email: string
  role: string
  initials: string
  avatar_url?: string
  phone?: string
  position?: string
  preferences?: UserPreferences
  created_at: string
  updated_at: string
}

// User preferences interface
export interface UserPreferences {
  theme?: string
  notifications?: {
    channels?: {
      email?: boolean
      browser?: boolean
      mobile?: boolean
    }
    types?: {
      taskAssigned?: boolean
      taskDeadline?: boolean
      taskUpdated?: boolean
      projectUpdated?: boolean
      clientUpdated?: boolean
      teamMessages?: boolean
      approvalRequests?: boolean
      systemUpdates?: boolean
    }
  }
}

/**
 * Creates or updates a user profile in the database based on auth user data
 * This is called after authentication to ensure the user exists in our users table
 */
export async function syncUserProfile(authUser: User): Promise<AppUser | null> {
  try {
    console.log("🔄 Syncing user profile for:", authUser.email)

    // Check if user already exists in our database
    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("auth_id", authUser.id)
      .single()

    if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116 is "no rows returned" error
      console.error("❌ Error fetching existing user:", fetchError)
      throw fetchError
    }

    // Generate initials from email if no name is available
    const name = authUser.user_metadata?.name || authUser.email?.split("@")[0] || "User"
    const initials = name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)

    // Default role if not specified
    const role = "colaborador"  // El rol se gestiona solo desde la base de datos

    if (existingUser) {
      // Update existing user
      console.log("🔄 Updating existing user profile")
      const { data, error } = await supabase
        .from("users")
        .update({
          name: existingUser.name || name,
          email: authUser.email,
          role: existingUser.role,
          updated_at: new Date().toISOString(),
        })
        .eq("auth_id", authUser.id)
        .select()
        .single()

      if (error) {
        console.error("❌ Error updating user profile:", error)
        throw error
      }

      console.log("✅ User profile updated successfully")
      return data
    } else {
      // Create new user
      console.log("🆕 Creating new user profile")
      const { data, error } = await supabase
        .from("users")
        .insert({
          auth_id: authUser.id,
          name: name,
          email: authUser.email,
          role: 'colaborador',
          initials: initials,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) {
        console.error("❌ Error creating user profile:", error)
        throw error
      }

      console.log("✅ User profile created successfully")

      // Also update auth metadata with role for consistency
      await supabase.auth.updateUser({
        data: { role: role },
      })

      return data
    }
  } catch (error) {
    console.error("❌ Error in syncUserProfile:", error)
    return null
  }
}

// Fetch all users/collaborators
export async function fetchUsers(): Promise<AppUser[]> {
  try {
    const { data, error } = await supabase.from("users").select("*").order("name")

    if (error) {
      console.error("❌ Error fetching users:", error)
      throw error
    }

    return data
  } catch (error) {
    console.error("❌ Error in fetchUsers:", error)
    return []
  }
}

// Fetch a single user by ID
export async function fetchUserById(id: number): Promise<AppUser | null> {
  try {
    const { data, error } = await supabase.from("users").select("*").eq("id", id).single()

    if (error) {
      console.error(`❌ Error fetching user with ID ${id}:`, error)
      return null
    }

    return data
  } catch (error) {
    console.error(`❌ Error in fetchUserById for ID ${id}:`, error)
    return null
  }
}

// Fetch current authenticated user
export async function fetchCurrentUser(): Promise<AppUser | null> {
  try {
    const { data: authData, error: authError } = await supabase.auth.getUser()

    if (authError || !authData.user) {
      console.error("❌ Error fetching authenticated user:", authError)
      return null
    }

    const { data, error } = await supabase.from("users").select("*").eq("auth_id", authData.user.id).single()

    if (error) {
      console.error("❌ Error fetching user profile:", error)

      // If user doesn't exist in our database yet, create it
      if (error.code === "PGRST116") {
        // "no rows returned" error
        return await syncUserProfile(authData.user)
      }

      return null
    }

    return data
  } catch (error) {
    console.error("❌ Error in fetchCurrentUser:", error)
    return null
  }
}

// Update user profile
export async function updateUserProfile(userId: number, profileData: Partial<AppUser>): Promise<AppUser | null> {
  try {
    // Remove fields that shouldn't be updated directly
    const { id, auth_id, created_at, updated_at, ...updateData } = profileData as any

    // Add updated timestamp
    updateData.updated_at = new Date().toISOString()

    const { data, error } = await supabase.from("users").update(updateData).eq("id", userId).select().single()

    if (error) {
      console.error(`❌ Error updating user profile:`, error)
      throw error
    }

    console.log("✅ User profile updated successfully")
    return data
  } catch (error) {
    console.error(`❌ Error in updateUserProfile:`, error)
    return null
  }
}

// Update user preferences
export async function updateUserPreferences(userId: number, preferences: UserPreferences): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("users")
      .update({
        preferences: preferences,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    if (error) {
      console.error(`❌ Error updating user preferences:`, error)
      throw error
    }

    console.log("✅ User preferences updated successfully")
    return true
  } catch (error) {
    console.error(`❌ Error in updateUserPreferences:`, error)
    return false
  }
}

// Delete a user
export async function deleteUser(id: number): Promise<boolean> {
  try {
    // First get the auth_id to delete from auth
    const { data: userData, error: fetchError } = await supabase.from("users").select("auth_id").eq("id", id).single()

    if (fetchError) {
      console.error(`❌ Error fetching user auth_id:`, fetchError)
      throw fetchError
    }

    // Delete from users table
    const { error: deleteError } = await supabase.from("users").delete().eq("id", id)

    if (deleteError) {
      console.error(`❌ Error deleting user with ID ${id}:`, deleteError)
      throw deleteError
    }

    // Note: Deleting from auth requires admin privileges and is typically
    // handled through Supabase dashboard or admin API

    console.log("✅ User deleted successfully")
    return true
  } catch (error) {
    console.error(`❌ Error in deleteUser for ID ${id}:`, error)
    return false
  }
}
