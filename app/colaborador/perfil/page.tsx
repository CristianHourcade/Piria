"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mail, Phone, Shield, Bell, Check, AlertCircle, Loader2 } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/components/auth-provider"
import { updateUserPreferences, type UserPreferences } from "@/services/user-service"

export default function PerfilPage() {
  // Auth context
  const { appUser, updateProfile, updatePassword } = useAuth()
  const [isLoading, setIsLoading] = useState(true)

  // Form states
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
  })

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Feedback states
  const [profileFeedback, setProfileFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [passwordFeedback, setPasswordFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [notificationsFeedback, setNotificationsFeedback] = useState<{
    type: "success" | "error"
    message: string
  } | null>(null)

  // Expanded notifications structure
  const [notifications, setNotifications] = useState({
    channels: {
      email: true,
      browser: true,
      mobile: false,
    },
    types: {
      taskAssigned: true,
      taskDeadline: true,
      taskUpdated: true,
      projectUpdated: true,
      clientUpdated: false,
      teamMessages: true,
      approvalRequests: true,
      systemUpdates: false,
    },
  })

  useEffect(() => {
    // Load user data from auth context
    if (appUser) {
      setProfileForm({
        name: appUser.name || "",
        email: appUser.email || "",
        phone: appUser.phone || "",
        position: appUser.position || "",
      })

      // Load saved notifications if they exist
      if (appUser.preferences?.notifications) {
        setNotifications({
          channels: {
            ...notifications.channels,
            ...appUser.preferences.notifications.channels,
          },
          types: {
            ...notifications.types,
            ...appUser.preferences.notifications.types,
          },
        })
      }

      setIsLoading(false)
    }
  }, [appUser])

  // Handle profile form changes
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setProfileForm((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  // Handle password form changes
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setPasswordForm((prev) => ({
      ...prev,
      [id.replace("-", "")]: value,
    }))
  }

  const handleSaveProfile = async () => {
    try {
      setProfileFeedback(null)

      // Validate form
      if (!profileForm.name.trim()) {
        setProfileFeedback({
          type: "error",
          message: "El nombre no puede estar vacío",
        })
        return
      }

      if (!appUser) {
        setProfileFeedback({
          type: "error",
          message: "No se pudo obtener la información del usuario",
        })
        return
      }

      // Update profile in database
      const { error } = await updateProfile({
        name: profileForm.name,
        phone: profileForm.phone,
        position: profileForm.position,
      })

      if (error) {
        console.error("Error updating profile:", error)
        setProfileFeedback({
          type: "error",
          message: "Error al actualizar el perfil",
        })
        return
      }

      // Show success message
      setProfileFeedback({
        type: "success",
        message: "Perfil actualizado correctamente",
      })

      // Clear message after 3 seconds
      setTimeout(() => {
        setProfileFeedback(null)
      }, 3000)
    } catch (error) {
      console.error("Error in handleSaveProfile:", error)
      setProfileFeedback({
        type: "error",
        message: "Error al actualizar el perfil",
      })
    }
  }

  const handleChangePassword = async () => {
    try {
      setPasswordFeedback(null)

      // Validate form
      if (!passwordForm.currentPassword) {
        setPasswordFeedback({
          type: "error",
          message: "Debes ingresar tu contraseña actual",
        })
        return
      }

      if (passwordForm.newPassword.length < 6) {
        setPasswordFeedback({
          type: "error",
          message: "La nueva contraseña debe tener al menos 6 caracteres",
        })
        return
      }

      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        setPasswordFeedback({
          type: "error",
          message: "Las contraseñas no coinciden",
        })
        return
      }

      // Update password
      const { error } = await updatePassword(passwordForm.newPassword)

      if (error) {
        console.error("Error updating password:", error)
        setPasswordFeedback({
          type: "error",
          message: error.message || "Error al actualizar la contraseña",
        })
        return
      }

      // Clear form
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })

      // Show success message
      setPasswordFeedback({
        type: "success",
        message: "Contraseña actualizada correctamente",
      })

      // Clear message after 3 seconds
      setTimeout(() => {
        setPasswordFeedback(null)
      }, 3000)
    } catch (error) {
      console.error("Error in handleChangePassword:", error)
      setPasswordFeedback({
        type: "error",
        message: "Error al actualizar la contraseña",
      })
    }
  }

  const handleToggleNotificationChannel = (type: string, checked: boolean) => {
    setNotifications({
      ...notifications,
      channels: {
        ...notifications.channels,
        [type]: checked,
      },
    })
  }

  const handleToggleNotificationType = (type: string, checked: boolean) => {
    setNotifications({
      ...notifications,
      types: {
        ...notifications.types,
        [type]: checked,
      },
    })
  }

  const handleSaveNotifications = async () => {
    try {
      setNotificationsFeedback(null)

      if (!appUser) {
        setNotificationsFeedback({
          type: "error",
          message: "No se pudo obtener la información del usuario",
        })
        return
      }

      // Create preferences object
      const preferences: UserPreferences = {
        theme: appUser.preferences?.theme || "system",
        notifications: notifications,
      }

      // Save to database
      const success = await updateUserPreferences(appUser.id, preferences)

      if (!success) {
        setNotificationsFeedback({
          type: "error",
          message: "Error al guardar las preferencias de notificaciones",
        })
        return
      }

      // Show success message
      setNotificationsFeedback({
        type: "success",
        message: "Preferencias de notificaciones actualizadas correctamente",
      })

      // Clear message after 3 seconds
      setTimeout(() => {
        setNotificationsFeedback(null)
      }, 3000)
    } catch (error) {
      console.error("Error in handleSaveNotifications:", error)
      setNotificationsFeedback({
        type: "error",
        message: "Error al guardar las preferencias de notificaciones",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    )
  }

  if (!appUser) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <p className="text-muted-foreground">No se pudo cargar la información del usuario</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-secondary dark:text-gray-200">Mi Perfil</h1>
        <p className="text-muted-foreground">Gestiona tu información personal y preferencias</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <Card className="w-full md:w-1/3 border-primary/20 dark:border-gray-700">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src={appUser.avatar_url || "/placeholder.svg"} alt={appUser.name} />
                <AvatarFallback className="text-2xl bg-primary text-white">
                  {appUser.initials || appUser.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h2 className="mt-4 text-xl font-semibold text-secondary dark:text-gray-200">{appUser.name}</h2>
              <p className="text-muted-foreground">{appUser.position || "Sin cargo"}</p>
              <div className="mt-6 w-full space-y-2">
                <div className="flex items-center p-2 rounded-md bg-gray-50 dark:bg-gray-800">
                  <Mail className="h-5 w-5 text-muted-foreground mr-2" />
                  <span className="text-sm">{appUser.email}</span>
                </div>
                <div className="flex items-center p-2 rounded-md bg-gray-50 dark:bg-gray-800">
                  <Phone className="h-5 w-5 text-muted-foreground mr-2" />
                  <span className="text-sm">{appUser.phone || "No especificado"}</span>
                </div>
                <div className="flex items-center p-2 rounded-md bg-gray-50 dark:bg-gray-800">
                  <Shield className="h-5 w-5 text-muted-foreground mr-2" />
                  <span className="text-sm capitalize">{appUser.role}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="w-full md:w-2/3">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="bg-gray-100 dark:bg-gray-800">
              <TabsTrigger value="personal" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                Información Personal
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                Seguridad
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                Notificaciones
              </TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="mt-6">
              <Card className="border-primary/20 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-secondary dark:text-gray-200">Información Personal</CardTitle>
                  <CardDescription>Actualiza tu información personal</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profileFeedback && (
                    <Alert
                      variant={profileFeedback.type === "success" ? "default" : "destructive"}
                      className={
                        profileFeedback.type === "success"
                          ? "bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : ""
                      }
                    >
                      {profileFeedback.type === "success" ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <AlertCircle className="h-4 w-4" />
                      )}
                      <AlertDescription>{profileFeedback.message}</AlertDescription>
                    </Alert>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre Completo</Label>
                      <Input id="name" value={profileForm.name} onChange={handleProfileChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" value={profileForm.email} onChange={handleProfileChange} disabled />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input id="phone" value={profileForm.phone} onChange={handleProfileChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="position">Cargo</Label>
                      <Input id="position" value={profileForm.position} onChange={handleProfileChange} />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={handleSaveProfile}>Guardar Cambios</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="mt-6">
              <Card className="border-primary/20 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-secondary dark:text-gray-200">Seguridad</CardTitle>
                  <CardDescription>Actualiza tu contraseña</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {passwordFeedback && (
                    <Alert
                      variant={passwordFeedback.type === "success" ? "default" : "destructive"}
                      className={
                        passwordFeedback.type === "success"
                          ? "bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : ""
                      }
                    >
                      {passwordFeedback.type === "success" ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <AlertCircle className="h-4 w-4" />
                      )}
                      <AlertDescription>{passwordFeedback.message}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="current-password">Contraseña Actual</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-password">Nueva Contraseña</Label>
                      <Input
                        id="new-password"
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={handleChangePassword}>Cambiar Contraseña</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="mt-6">
              <Card className="border-primary/20 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-secondary dark:text-gray-200">Notificaciones</CardTitle>
                  <CardDescription>Personaliza qué notificaciones quieres recibir y cómo</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {notificationsFeedback && (
                    <Alert
                      variant={notificationsFeedback.type === "success" ? "default" : "destructive"}
                      className={
                        notificationsFeedback.type === "success"
                          ? "bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : ""
                      }
                    >
                      {notificationsFeedback.type === "success" ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <AlertCircle className="h-4 w-4" />
                      )}
                      <AlertDescription>{notificationsFeedback.message}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-secondary dark:text-gray-200">Canales de notificación</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-5 w-5 text-muted-foreground" />
                          <Label htmlFor="email-notifications">Notificaciones por Email</Label>
                        </div>
                        <Switch
                          id="email-notifications"
                          checked={notifications.channels.email}
                          onCheckedChange={(checked) => handleToggleNotificationChannel("email", checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Bell className="h-5 w-5 text-muted-foreground" />
                          <Label htmlFor="browser-notifications">Notificaciones del Navegador</Label>
                        </div>
                        <Switch
                          id="browser-notifications"
                          checked={notifications.channels.browser}
                          onCheckedChange={(checked) => handleToggleNotificationChannel("browser", checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Phone className="h-5 w-5 text-muted-foreground" />
                          <Label htmlFor="mobile-notifications">Notificaciones Móviles</Label>
                        </div>
                        <Switch
                          id="mobile-notifications"
                          checked={notifications.channels.mobile}
                          onCheckedChange={(checked) => handleToggleNotificationChannel("mobile", checked)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-secondary dark:text-gray-200">Tipos de notificaciones</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="task-assigned"
                          checked={notifications.types.taskAssigned}
                          onCheckedChange={(checked) =>
                            handleToggleNotificationType("taskAssigned", checked as boolean)
                          }
                        />
                        <div className="grid gap-1.5">
                          <Label htmlFor="task-assigned" className="text-sm font-medium">
                            Tareas asignadas
                          </Label>
                          <p className="text-xs text-muted-foreground">Cuando se te asigna una nueva tarea</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="task-deadline"
                          checked={notifications.types.taskDeadline}
                          onCheckedChange={(checked) =>
                            handleToggleNotificationType("taskDeadline", checked as boolean)
                          }
                        />
                        <div className="grid gap-1.5">
                          <Label htmlFor="task-deadline" className="text-sm font-medium">
                            Fechas límite
                          </Label>
                          <p className="text-xs text-muted-foreground">Recordatorios de fechas límite próximas</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="task-updated"
                          checked={notifications.types.taskUpdated}
                          onCheckedChange={(checked) => handleToggleNotificationType("taskUpdated", checked as boolean)}
                        />
                        <div className="grid gap-1.5">
                          <Label htmlFor="task-updated" className="text-sm font-medium">
                            Actualizaciones de tareas
                          </Label>
                          <p className="text-xs text-muted-foreground">Cuando se actualiza una tarea asignada</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="project-updated"
                          checked={notifications.types.projectUpdated}
                          onCheckedChange={(checked) =>
                            handleToggleNotificationType("projectUpdated", checked as boolean)
                          }
                        />
                        <div className="grid gap-1.5">
                          <Label htmlFor="project-updated" className="text-sm font-medium">
                            Actualizaciones de proyectos
                          </Label>
                          <p className="text-xs text-muted-foreground">Cambios en proyectos donde participas</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="client-updated"
                          checked={notifications.types.clientUpdated}
                          onCheckedChange={(checked) =>
                            handleToggleNotificationType("clientUpdated", checked as boolean)
                          }
                        />
                        <div className="grid gap-1.5">
                          <Label htmlFor="client-updated" className="text-sm font-medium">
                            Actualizaciones de clientes
                          </Label>
                          <p className="text-xs text-muted-foreground">Cambios en clientes asignados</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="team-messages"
                          checked={notifications.types.teamMessages}
                          onCheckedChange={(checked) =>
                            handleToggleNotificationType("teamMessages", checked as boolean)
                          }
                        />
                        <div className="grid gap-1.5">
                          <Label htmlFor="team-messages" className="text-sm font-medium">
                            Mensajes del equipo
                          </Label>
                          <p className="text-xs text-muted-foreground">Comunicaciones del equipo de trabajo</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="approval-requests"
                          checked={notifications.types.approvalRequests}
                          onCheckedChange={(checked) =>
                            handleToggleNotificationType("approvalRequests", checked as boolean)
                          }
                        />
                        <div className="grid gap-1.5">
                          <Label htmlFor="approval-requests" className="text-sm font-medium">
                            Solicitudes de aprobación
                          </Label>
                          <p className="text-xs text-muted-foreground">Cuando se requiere tu aprobación</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="system-updates"
                          checked={notifications.types.systemUpdates}
                          onCheckedChange={(checked) =>
                            handleToggleNotificationType("systemUpdates", checked as boolean)
                          }
                        />
                        <div className="grid gap-1.5">
                          <Label htmlFor="system-updates" className="text-sm font-medium">
                            Actualizaciones del sistema
                          </Label>
                          <p className="text-xs text-muted-foreground">Novedades y cambios en la plataforma</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleSaveNotifications}>Guardar Preferencias</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
