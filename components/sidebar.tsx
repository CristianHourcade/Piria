"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  UserPlus,
  UserCog,
  FolderKanban,
  Calendar,
  DollarSign,
  ClipboardList,
  Settings,
  LogOut,
  BarChart2,
  User,
  Menu,
  X,
  Bell,
  CheckSquare,
  Mail,
  Accessibility,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/components/auth-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Sidebar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { appUser, signOut } = useAuth()

  const role = appUser?.role || "colaborador"

  const handleLogout = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error("Error during logout:", error)
    }
  }

  const getInitials = (name?: string) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const adminLinks = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Clientes", href: "/admin/clientes", icon: Users },
    { name: "Clientes Potenciales", href: "/admin/clientes-potenciales", icon: UserPlus },
    { name: "Personal", href: "/admin/personal", icon: UserCog },
    { name: "Proyectos", href: "/admin/proyectos", icon: FolderKanban },
    { name: "Tareas", href: "/admin/tareas", icon: CheckSquare },
    { name: "Calendario", href: "/admin/calendario", icon: Calendar },
    { name: "Gastos", href: "/admin/gastos", icon: DollarSign },
    { name: "Cuentas", href: "/admin/cuentas", icon: Accessibility },
    { name: "Ingresos", href: "/admin/ingresos", icon: Accessibility },
  ]

  const colaboradorLinks = [
    { name: "Proyectos", href: "/colaborador/proyectos", icon: FolderKanban },
    { name: "Tareas", href: "/colaborador/tareas", icon: ClipboardList },
    { name: "Calendario", href: "/colaborador/calendario", icon: Calendar },
    { name: "Alertas", href: "/colaborador/alertas", icon: Bell },
    { name: "Clientes", href: "/colaborador/clientes", icon: Users },
    { name: "Mi Perfil", href: "/colaborador/perfil", icon: User },
  ]

  const links = role === "admin" ? adminLinks : colaboradorLinks

  return (
    <>
      {/* Botón de menú móvil */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button variant="outline" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-[#0F2A41] shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center">
              <Image src="/logo.png" alt="Piria Digital Logo" width={32} height={32} className="mr-2" />
              <span className="text-secondary dark:text-white font-semibold">Piria Digital</span>
            </div>
            <ThemeToggle />
          </div>

          {appUser && (
            <div className="p-4 border-b dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10 bg-primary/10">
                  <AvatarImage src={appUser.avatar_url || ""} alt={appUser.name || ""} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {getInitials(appUser.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {appUser.name || "Usuario"}
                  </span>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <Mail className="mr-1 h-3 w-3" />
                    <span className="truncate max-w-[160px]" title={appUser.email || ""}>
                      {appUser.email}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
            {links.map((link) => {
              const isActive = pathname === link.href
              const Icon = link.icon

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center px-4 py-2.5 text-sm rounded-md transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary font-medium"
                      : "text-secondary dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#0A1F30] hover:text-primary dark:hover:text-primary",
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {link.name}
                </Link>
              )
            })}
          </nav>

          <div className="p-4 border-t dark:border-gray-700">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center border-secondary text-secondary dark:border-gray-600 dark:text-white hover:bg-secondary hover:text-white dark:hover:bg-gray-700"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar sesión
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
