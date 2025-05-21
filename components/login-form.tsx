"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/components/auth-provider"
import { sanitizeInput } from "@/lib/security"

export default function LoginForm() {
  const router = useRouter()
  const { signIn, isLoading: authLoading } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (!email || !password) {
      setError("Por favor ingresa tu email y contraseña")
      setIsLoading(false)
      return
    }

    console.log("🔐 Login attempt initiated for email:", email)

    try {
      // Sanitize inputs
      const sanitizedEmail = sanitizeInput(email)
      console.log("📝 Input sanitized, preparing to authenticate with Supabase")

      // Use Supabase Auth for authentication
      console.log("🔄 Calling Supabase authentication...")
      const { data, error: signInError } = await signIn(sanitizedEmail, password)

      if (signInError) {
        console.error("❌ Authentication error:", signInError.message)

        // Provide user-friendly error messages
        if (signInError.message.includes("Invalid login credentials")) {
          setError("Email o contraseña incorrectos")
        } else if (signInError.message.includes("Email not confirmed")) {
          setError("Por favor confirma tu email antes de iniciar sesión")
        } else {
          setError(signInError.message || "Error durante el inicio de sesión")
        }

        setIsLoading(false)
        return
      }

      console.log("✅ Authentication successful!", data)

      // Store remember me preference
      if (rememberMe) {
        localStorage.setItem("piriaRememberMe", "true")
      } else {
        localStorage.removeItem("piriaRememberMe")
      }

      // The redirection is handled in the signIn function in auth-provider.tsx
      // We'll keep the loading state active since we're about to navigate away
    } catch (err) {
      console.error("❌ Unexpected login error:", err)
      setError("Ocurrió un error durante el inicio de sesión")
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <div className="flex justify-end">
        <ThemeToggle />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1"
            disabled={isLoading || authLoading}
          />
        </div>

        <div>
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1"
            disabled={isLoading || authLoading}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember-me"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              disabled={isLoading || authLoading}
            />
            <Label htmlFor="remember-me" className="text-sm">
              Recordar sesión
            </Label>
          </div>

          <button
            type="button"
            onClick={() => router.push("/forgot-password")}
            className="text-sm text-primary hover:underline"
            disabled={isLoading || authLoading}
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>
      </div>

      <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading || authLoading}>
        {isLoading || authLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Iniciando sesión...
          </>
        ) : (
          "Iniciar sesión"
        )}
      </Button>
    </form>
  )
}
