import { getUser } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function Home() {
  // Get the authenticated user
  const user = await getUser()

  // If no user is authenticated, redirect to login
  if (!user) {
    redirect("/login")
  }

  // Redirect based on user role
  const userRole = user.user_metadata?.role || "colaborador"

  if (userRole === "admin") {
    redirect("/admin/dashboard")
  } else {
    redirect("/colaborador/tareas")
  }

  // This will never be rendered
  return null
}
