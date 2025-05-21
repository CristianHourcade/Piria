"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "./auth-provider"

export default function AuthCheck({ children }: { children: React.ReactNode }) {
  const { appUser, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    console.log("🔍 AuthCheck running for path:", pathname)
    console.log("👤 User state:", appUser ? "Logged in" : "Not logged in")
    console.log("⏳ Loading state:", isLoading)

    const isAdminRoute = pathname?.startsWith("/admin")
    const isColaboradorRoute = pathname?.startsWith("/colaborador")

    if (isAdminRoute || isColaboradorRoute) {
      console.log("🔒 Protected route detected:", pathname)
    } else {
      console.log("🔓 Public route detected:", pathname)
      setAuthorized(true)
      return
    }

    if (isLoading) {
      console.log("⏳ Still loading auth state, waiting...")
      return
    }

    if (!appUser) {
      console.log("❌ No user found, redirecting to login")
      router.push("/login")
      return
    }

    const userRole = appUser.role || "colaborador"
    console.log("👤 User role (from table):", userRole)

    if (isAdminRoute && userRole !== "admin") {
      console.log("🚫 User does not have admin role, redirecting")
      router.push("/colaborador/tareas")
      return
    }

    if (isColaboradorRoute && userRole !== "colaborador" && userRole !== "admin") {
      console.log("🚫 User does not have required role, redirecting")
      router.push("/login")
      return
    }

    console.log("✅ User authorized for this route")
    setAuthorized(true)
  }, [appUser, isLoading, pathname, router])

  if (!authorized) {
    console.log("⏳ Waiting for authorization check...")
    return null
  }

  console.log("🎉 Rendering protected content")
  return <>{children}</>
}
