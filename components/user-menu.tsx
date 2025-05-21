"use client"
import { useAuth } from "@/components/auth-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, User, Settings } from "lucide-react"
import { useRouter } from "next/navigation"

export function UserMenu() {
  const { user, signOut } = useAuth()
  const router = useRouter()

  if (!user) return null

  // Función para generar iniciales a partir del email
  const getInitials = (email: string) => {
    if (!email) return "U"
    return email.charAt(0).toUpperCase()
  }

  const handleLogout = async () => {
    try {
      await signOut()
      // La redirección la maneja el evento onAuthStateChange
    } catch (error) {
      console.error("Error during logout:", error)
    }
  }

  const goToProfile = () => {
    const role = user.user_metadata?.role === "admin" ? "admin" : "colaborador"
    if (role === "admin") {
      router.push("/admin/configuracion")
    } else {
      router.push("/colaborador/perfil")
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center space-x-2 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <Avatar className="h-8 w-8 cursor-pointer">
            <AvatarImage src={user.user_metadata?.avatar_url || ""} alt={user.email || ""} />
            <AvatarFallback className="bg-primary/10 text-primary">{getInitials(user.email || "")}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden md:inline-block">
            {user.email}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={goToProfile} className="cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          <span>Perfil</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={goToProfile} className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>Configuración</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 dark:text-red-400">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Cerrar sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
