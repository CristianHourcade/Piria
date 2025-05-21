import type React from "react"
import Sidebar from "@/components/sidebar"
import { getUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { NotificationsPanel } from "@/components/notifications-panel"
import { DebugSession } from "@/components/debug-session"
import { getUserRole, syncUserRole } from "@/lib/user-role"
import { UserMenu } from "@/components/user-menu"

// Variable para controlar la frecuencia de los logs
const SHOULD_LOG = process.env.NODE_ENV === "development"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Get the authenticated user
  const user = await getUser()

  // Log user data on the server (solo en desarrollo)
  if (SHOULD_LOG) {
    console.log("🔐 [Server] Datos de usuario en Admin Layout:")
    console.log("📧 [Server] Email:", user?.email)
    console.log("🔑 [Server] ID:", user?.id)
    console.log("👤 [Server] Rol en metadatos:", user?.user_metadata?.role || "No definido")
  }

  // If no user is authenticated, redirect to login
  if (!user) {
    console.log("❌ [Server] No hay usuario autenticado, redirigiendo a login")
    redirect("/login")
  }

  // Solo sincronizamos si no hay rol en los metadatos
  if (!user.user_metadata?.role) {
    await syncUserRole(user.id)
  }

  // Obtener el rol del usuario (desde metadatos o tabla users)
  const userRole = await getUserRole(user.id)

  if (SHOULD_LOG) {
    console.log("👤 [Server] Rol efectivo del usuario:", userRole)
  }

  // If the user is not an admin, redirect to colaborador area
  if (userRole !== "admin") {
    console.log("🚫 [Server] Usuario no es admin, redirigiendo a área de colaborador")
    redirect("/colaborador/tareas")
  }

  if (SHOULD_LOG) {
    console.log("✅ [Server] Usuario admin confirmado, mostrando layout de admin")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar role="admin" />
      <div className="lg:pl-64">
        <div className="sticky top-0 z-10 bg-white dark:bg-[#0F2A41] border-b dark:border-gray-700 px-4 py-2 flex justify-between items-center">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 hidden md:block">
            Panel de Administración
          </div>
          <div className="flex items-center space-x-4">
            <NotificationsPanel />
            <UserMenu />
          </div>
        </div>
        <main className="p-4 md:p-8">
          {children}
          <DebugSession />
        </main>
      </div>
    </div>
  )
}
