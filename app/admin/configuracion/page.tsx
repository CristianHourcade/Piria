"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { ThemeToggle } from "@/components/theme-toggle"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, Save } from "lucide-react"

export default function ConfiguracionPage() {
  const [activeTab, setActiveTab] = useState("general")
  const [showAlert, setShowAlert] = useState<{ show: boolean; message: string; type: "success" | "error" }>({
    show: false,
    message: "",
    type: "success",
  })
  const [generalSettings, setGeneralSettings] = useState({
    companyName: "Piria Digital",
    email: "contacto@piriadigital.com",
    phone: "+54 11 1234-5678",
    address: "Av. Corrientes 1234, CABA",
    website: "https://piriadigital.com",
    language: "es",
    timezone: "America/Argentina/Buenos_Aires",
  })
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    taskReminders: true,
    clientUpdates: true,
    paymentReminders: true,
    systemUpdates: false,
  })
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: "30",
    passwordExpiration: "90",
    minimumPasswordLength: "8",
  })
  const [integrationSettings, setIntegrationSettings] = useState({
    googleCalendar: false,
    microsoftOutlook: false,
    slack: false,
    trello: false,
    zapier: false,
  })

  const handleGeneralSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setGeneralSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setGeneralSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleNotificationToggle = (setting: string) => {
    setNotificationSettings((prev) => ({ ...prev, [setting]: !prev[setting] }))
  }

  const handleSecuritySettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSecuritySettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleIntegrationToggle = (integration: string) => {
    setIntegrationSettings((prev) => ({ ...prev, [integration]: !prev[integration] }))
  }

  const handleSaveSettings = () => {
    showAlertMessage("Configuración guardada correctamente", "success")
  }

  const showAlertMessage = (message: string, type: "success" | "error") => {
    setShowAlert({
      show: true,
      message,
      type,
    })

    setTimeout(() => {
      setShowAlert({
        show: false,
        message: "",
        type: "success",
      })
    }, 3000)
  }

  return (
    <div className="space-y-6">
      {showAlert.show && (
        <Alert
          className={
            showAlert.type === "success"
              ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900/30"
              : "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-900/30"
          }
        >
          <AlertDescription
            className={
              showAlert.type === "success" ? "text-green-800 dark:text-green-300" : "text-red-800 dark:text-red-300"
            }
          >
            {showAlert.message}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-secondary dark:text-gray-200">Configuración</h1>
          <p className="text-muted-foreground">Personaliza la configuración del sistema</p>
        </div>
        <Button onClick={handleSaveSettings}>
          <Save className="mr-2 h-4 w-4" />
          Guardar Cambios
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">Apariencia</h2>
          <p className="text-sm text-muted-foreground">
            Cambia entre modo claro y oscuro. Esta configuración se aplica a toda la interfaz.
          </p>
        </div>
        <ThemeToggle />
      </div>

      <Separator className="my-6" />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notificaciones">Notificaciones</TabsTrigger>
          <TabsTrigger value="seguridad">Seguridad</TabsTrigger>
          <TabsTrigger value="integraciones">Integraciones</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4 mt-6">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-secondary dark:text-gray-200">Información de la Empresa</CardTitle>
              <CardDescription>Configura la información básica de tu empresa</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Nombre de la Empresa</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    value={generalSettings.companyName}
                    onChange={handleGeneralSettingsChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={generalSettings.email}
                    onChange={handleGeneralSettingsChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input id="phone" name="phone" value={generalSettings.phone} onChange={handleGeneralSettingsChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Sitio Web</Label>
                  <Input
                    id="website"
                    name="website"
                    value={generalSettings.website}
                    onChange={handleGeneralSettingsChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  name="address"
                  value={generalSettings.address}
                  onChange={handleGeneralSettingsChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Idioma</Label>
                  <Select
                    value={generalSettings.language}
                    onValueChange={(value) => handleSelectChange("language", value)}
                  >
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Seleccionar idioma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="en">Inglés</SelectItem>
                      <SelectItem value="pt">Portugués</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Zona Horaria</Label>
                  <Select
                    value={generalSettings.timezone}
                    onValueChange={(value) => handleSelectChange("timezone", value)}
                  >
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Seleccionar zona horaria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Argentina/Buenos_Aires">Argentina (GMT-3)</SelectItem>
                      <SelectItem value="America/Santiago">Chile (GMT-4)</SelectItem>
                      <SelectItem value="America/Bogota">Colombia (GMT-5)</SelectItem>
                      <SelectItem value="America/Mexico_City">México (GMT-6)</SelectItem>
                      <SelectItem value="Europe/Madrid">España (GMT+1)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notificaciones" className="space-y-4 mt-6">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-secondary dark:text-gray-200">Configuración de Notificaciones</CardTitle>
              <CardDescription>Personaliza qué notificaciones quieres recibir</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="emailNotifications">Notificaciones por Email</Label>
                  <p className="text-sm text-muted-foreground">
                    Recibe notificaciones importantes por correo electrónico
                  </p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={() => handleNotificationToggle("emailNotifications")}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="taskReminders">Recordatorios de Tareas</Label>
                  <p className="text-sm text-muted-foreground">
                    Recibe recordatorios sobre tareas pendientes y fechas límite
                  </p>
                </div>
                <Switch
                  id="taskReminders"
                  checked={notificationSettings.taskReminders}
                  onCheckedChange={() => handleNotificationToggle("taskReminders")}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="clientUpdates">Actualizaciones de Clientes</Label>
                  <p className="text-sm text-muted-foreground">
                    Recibe notificaciones cuando hay cambios en la información de clientes
                  </p>
                </div>
                <Switch
                  id="clientUpdates"
                  checked={notificationSettings.clientUpdates}
                  onCheckedChange={() => handleNotificationToggle("clientUpdates")}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="paymentReminders">Recordatorios de Pagos</Label>
                  <p className="text-sm text-muted-foreground">Recibe alertas sobre pagos pendientes y vencimientos</p>
                </div>
                <Switch
                  id="paymentReminders"
                  checked={notificationSettings.paymentReminders}
                  onCheckedChange={() => handleNotificationToggle("paymentReminders")}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="systemUpdates">Actualizaciones del Sistema</Label>
                  <p className="text-sm text-muted-foreground">
                    Recibe notificaciones sobre nuevas funcionalidades y mejoras
                  </p>
                </div>
                <Switch
                  id="systemUpdates"
                  checked={notificationSettings.systemUpdates}
                  onCheckedChange={() => handleNotificationToggle("systemUpdates")}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seguridad" className="space-y-4 mt-6">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-secondary dark:text-gray-200">Configuración de Seguridad</CardTitle>
              <CardDescription>Configura las opciones de seguridad de tu cuenta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="twoFactorAuth">Autenticación de Dos Factores</Label>
                  <p className="text-sm text-muted-foreground">Añade una capa adicional de seguridad a tu cuenta</p>
                </div>
                <Switch
                  id="twoFactorAuth"
                  checked={securitySettings.twoFactorAuth}
                  onCheckedChange={() =>
                    setSecuritySettings((prev) => ({ ...prev, twoFactorAuth: !prev.twoFactorAuth }))
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Tiempo de Sesión (minutos)</Label>
                  <Input
                    id="sessionTimeout"
                    name="sessionTimeout"
                    type="number"
                    value={securitySettings.sessionTimeout}
                    onChange={handleSecuritySettingsChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passwordExpiration">Expiración de Contraseña (días)</Label>
                  <Input
                    id="passwordExpiration"
                    name="passwordExpiration"
                    type="number"
                    value={securitySettings.passwordExpiration}
                    onChange={handleSecuritySettingsChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="minimumPasswordLength">Longitud Mínima de Contraseña</Label>
                <Input
                  id="minimumPasswordLength"
                  name="minimumPasswordLength"
                  type="number"
                  value={securitySettings.minimumPasswordLength}
                  onChange={handleSecuritySettingsChange}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integraciones" className="space-y-4 mt-6">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-secondary dark:text-gray-200">Integraciones</CardTitle>
              <CardDescription>Conecta con otras aplicaciones y servicios</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="googleCalendar">Google Calendar</Label>
                  <p className="text-sm text-muted-foreground">Sincroniza tareas y eventos con Google Calendar</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="googleCalendar"
                    checked={integrationSettings.googleCalendar}
                    onCheckedChange={() => handleIntegrationToggle("googleCalendar")}
                  />
                  {integrationSettings.googleCalendar && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="microsoftOutlook">Microsoft Outlook</Label>
                  <p className="text-sm text-muted-foreground">Sincroniza tareas y eventos con Microsoft Outlook</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="microsoftOutlook"
                    checked={integrationSettings.microsoftOutlook}
                    onCheckedChange={() => handleIntegrationToggle("microsoftOutlook")}
                  />
                  {integrationSettings.microsoftOutlook && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="slack">Slack</Label>
                  <p className="text-sm text-muted-foreground">Recibe notificaciones y actualizaciones en Slack</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="slack"
                    checked={integrationSettings.slack}
                    onCheckedChange={() => handleIntegrationToggle("slack")}
                  />
                  {integrationSettings.slack && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="trello">Trello</Label>
                  <p className="text-sm text-muted-foreground">Sincroniza tareas y proyectos con Trello</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="trello"
                    checked={integrationSettings.trello}
                    onCheckedChange={() => handleIntegrationToggle("trello")}
                  />
                  {integrationSettings.trello && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="zapier">Zapier</Label>
                  <p className="text-sm text-muted-foreground">Conecta con miles de aplicaciones a través de Zapier</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="zapier"
                    checked={integrationSettings.zapier}
                    onCheckedChange={() => handleIntegrationToggle("zapier")}
                  />
                  {integrationSettings.zapier && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
