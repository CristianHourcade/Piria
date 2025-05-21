import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import { redirect } from "next/navigation"

export async function getSupabaseServer() {
  console.log("🔌 Creating server-side Supabase client")

  const cookieStore = cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: "", ...options })
        },
      },
    },
  )

  console.log("✅ Server-side Supabase client created")
  return supabase
}

export async function getUser() {
  console.log("🔍 Getting user from server-side session")

  const supabase = await getSupabaseServer()

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      console.log("❌ No session found on server")
      return null
    }

    console.log("✅ User found in server session:", session.user.email)
    return session.user
  } catch (error) {
    console.error("❌ Error getting user from server session:", error)
    return null
  }
}

export async function requireUser() {
  console.log("🔒 Requiring authenticated user for server action/route")

  const user = await getUser()

  if (!user) {
    console.log("❌ No authenticated user found, redirecting to login")
    redirect("/login")
  }

  console.log("✅ Authenticated user confirmed for server action/route")
  return user
}

export async function requireAdmin() {
  console.log("🔒 Requiring admin user for server action/route")

  const user = await requireUser()
  
const { data: roleData, error: roleError } = await supabase
  .from("users")
  .select("role")
  .eq("auth_id", user.id)
  .single();
const userRole = roleData?.role || "colaborador"


  console.log("👤 User role for admin check:", userRole)

  if (userRole !== "admin") {
    console.log("🚫 User is not an admin, redirecting")
    redirect("/colaborador/tareas")
  }

  console.log("✅ Admin user confirmed for server action/route")
  return user
}
