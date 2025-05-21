"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  ExternalLink,
  Info,
  Calendar,
  Phone,
  Mail,
  User,
  FileText,
  Globe,
  MessageCircle,
  Instagram,
  Facebook,
  Folder,
  Palette,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for clients with expanded information
const CLIENTS = [
  {
    id: 1,
    name: "Juan Pérez",
    company: "Empresa A",
    contact: "juan@empresa.com",
    phone: "+54 11 1234-5678",
    services: ["Community Manager", "Meta Ads"],
    startDate: "2023-01-15",
    responsible: "Ana García",
    links: [
      { name: "WhatsApp", url: "https://wa.me/5491112345678", icon: "MessageCircle" },
      { name: "Instagram", url: "https://instagram.com/empresaa", icon: "Instagram" },
      { name: "Facebook", url: "https://facebook.com/empresaa", icon: "Facebook" },
      { name: "Sitio Web", url: "https://empresaa.com", icon: "Globe" },
      { name: "Drive - Contenidos", url: "https://drive.google.com/abc", icon: "Folder" },
      { name: "Canva - Diseños", url: "https://canva.com/abc", icon: "Palette" },
    ],
    status: "Activo",
    notes: "Cliente requiere publicaciones semanales en Instagram y Facebook. Prefiere comunicación por WhatsApp.",
    serviceDetails: [
      {
        name: "Community Manager",
        description: "Gestión de redes sociales Instagram y Facebook",
        frequency: "Publicaciones 3 veces por semana",
        deliverables: "Informe mensual de métricas",
      },
      {
        name: "Meta Ads",
        description: "Campañas publicitarias en Facebook e Instagram",
        frequency: "Campañas mensuales",
        deliverables: "Informe de resultados por campaña",
      },
    ],
    contacts: [
      { name: "Juan Pérez", role: "Director", email: "juan@empresa.com", phone: "+54 11 1234-5678" },
      { name: "María López", role: "Marketing", email: "maria@empresa.com", phone: "+54 11 8765-4321" },
    ],
    documents: [
      { name: "Brief inicial", url: "https://drive.google.com/brief", icon: "FileText" },
      { name: "Guía de marca", url: "https://drive.google.com/brand", icon: "FileText" },
    ],
  },
  {
    id: 2,
    name: "María González",
    company: "Empresa B",
    contact: "maria@startup.com",
    phone: "+54 11 8765-4321",
    services: ["Desarrollo Web"],
    startDate: "2023-02-10",
    responsible: "Carlos Rodríguez",
    links: [
      { name: "WhatsApp", url: "https://wa.me/5491187654321", icon: "MessageCircle" },
      { name: "Instagram", url: "https://instagram.com/empresab", icon: "Instagram" },
      { name: "Facebook", url: "https://facebook.com/empresab", icon: "Facebook" },
      { name: "Sitio Web", url: "https://empresab.com", icon: "Globe" },
      { name: "Drive - Documentación", url: "https://drive.google.com/xyz", icon: "Folder" },
      { name: "Figma - Diseños", url: "https://figma.com/xyz", icon: "Palette" },
      { name: "GitHub - Repositorio", url: "https://github.com/xyz", icon: "FileText" },
    ],
    status: "Activo",
    notes:
      "Proyecto de desarrollo web con WordPress. Cliente requiere actualizaciones semanales de avance. Sitio multilingüe.",
    serviceDetails: [
      {
        name: "Desarrollo Web",
        description: "Sitio web corporativo con WordPress",
        frequency: "Proyecto único con mantenimiento mensual",
        deliverables: "Sitio web, manual de usuario, capacitación",
      },
    ],
    contacts: [
      { name: "María González", role: "CEO", email: "maria@startup.com", phone: "+54 11 8765-4321" },
      { name: "Pedro Sánchez", role: "CTO", email: "pedro@startup.com", phone: "+54 11 2345-6789" },
    ],
    documents: [
      { name: "Requerimientos", url: "https://drive.google.com/requirements", icon: "FileText" },
      { name: "Wireframes", url: "https://drive.google.com/wireframes", icon: "FileText" },
    ],
  },
  {
    id: 3,
    name: "Carlos Rodríguez",
    company: "Empresa C",
    contact: "roberto@consultora.com",
    phone: "+54 11 5555-5555",
    services: ["Creación de Contenidos", "Google Ads", "Diseño Gráfico"],
    startDate: "2023-03-05",
    responsible: "Laura Martínez",
    links: [
      { name: "WhatsApp", url: "https://wa.me/5491155555555", icon: "MessageCircle" },
      { name: "Instagram", url: "https://instagram.com/empresac", icon: "Instagram" },
      { name: "Facebook", url: "https://facebook.com/empresac", icon: "Facebook" },
      { name: "Sitio Web", url: "https://empresac.com", icon: "Globe" },
      { name: "Drive - Contenidos", url: "https://drive.google.com/123", icon: "Folder" },
      { name: "Google Ads - Cuenta", url: "https://ads.google.com/123", icon: "FileText" },
      { name: "Canva - Diseños", url: "https://canva.com/123", icon: "Palette" },
    ],
    status: "Inactivo",
    notes: "Cliente pausó servicios temporalmente por reestructuración interna. Retomar contacto en Q3.",
    serviceDetails: [
      {
        name: "Creación de Contenidos",
        description: "Artículos para blog y newsletter",
        frequency: "4 artículos mensuales",
        deliverables: "Artículos en formato Word y HTML",
      },
      {
        name: "Google Ads",
        description: "Campañas de búsqueda y display",
        frequency: "Gestión continua",
        deliverables: "Informe quincenal de performance",
      },
      {
        name: "Diseño Gráfico",
        description: "Piezas para redes sociales y web",
        frequency: "8 piezas mensuales",
        deliverables: "Archivos en formato JPG, PNG y PSD",
      },
    ],
    contacts: [
      { name: "Carlos Rodríguez", role: "Director", email: "roberto@consultora.com", phone: "+54 11 5555-5555" },
      { name: "Ana Gómez", role: "Coordinadora", email: "ana@consultora.com", phone: "+54 11 4444-4444" },
    ],
    documents: [
      { name: "Estrategia de contenidos", url: "https://drive.google.com/strategy", icon: "FileText" },
      { name: "Plan de medios", url: "https://drive.google.com/media-plan", icon: "FileText" },
    ],
  },
]

export default function ClientesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedClient, setSelectedClient] = useState<any>(null)
  const [selectedTab, setSelectedTab] = useState("info")
  const [currentUser, setCurrentUser] = useState<string>("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    // En un caso real, obtendríamos el usuario actual del contexto de autenticación
    // Aquí simulamos que el usuario actual es "Carlos Rodríguez"
    setCurrentUser("Carlos Rodríguez")
  }, [])

  // Filtrar clientes asignados al colaborador actual y por término de búsqueda
  const filteredClients = CLIENTS.filter(
    (client) =>
      client.responsible === currentUser &&
      (client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.services.some((service) => service.toLowerCase().includes(searchTerm.toLowerCase()))),
  )

  const handleViewClient = (client: any) => {
    setSelectedClient(client)
    setSelectedTab("info")
    setIsDialogOpen(true)
  }

  // Función para obtener el icono correcto según el nombre
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "MessageCircle":
        return <MessageCircle className="h-4 w-4 mr-2 text-muted-foreground" />
      case "Instagram":
        return <Instagram className="h-4 w-4 mr-2 text-muted-foreground" />
      case "Facebook":
        return <Facebook className="h-4 w-4 mr-2 text-muted-foreground" />
      case "Globe":
        return <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
      case "Folder":
        return <Folder className="h-4 w-4 mr-2 text-muted-foreground" />
      case "Palette":
        return <Palette className="h-4 w-4 mr-2 text-muted-foreground" />
      case "FileText":
      default:
        return <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-secondary dark:text-gray-200">Mis Clientes</h1>
        <p className="text-muted-foreground">Visualiza la información de tus clientes asignados</p>
      </div>

      <Card className="border-primary/20 dark:border-gray-700">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-secondary dark:text-gray-200">Clientes</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar clientes..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Servicios</TableHead>
                <TableHead>Inicio</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No se encontraron clientes con los filtros seleccionados
                  </TableCell>
                </TableRow>
              ) : (
                filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{client.name}</div>
                        <div className="text-sm text-muted-foreground">{client.company}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm">{client.contact}</div>
                        <div className="text-sm text-muted-foreground">{client.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {client.services.map((service, index) => (
                          <Badge key={index} variant="outline" className="bg-primary/10 dark:bg-primary/20">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{new Date(client.startDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          client.status === "Activo"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                        }
                      >
                        {client.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => handleViewClient(client)}>
                        <Info className="h-4 w-4 mr-2" />
                        Ver detalles
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          {selectedClient && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedClient.company}</DialogTitle>
                <DialogDescription>Información detallada del cliente</DialogDescription>
              </DialogHeader>

              <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mt-4">
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger value="info">Información</TabsTrigger>
                  <TabsTrigger value="services">Servicios</TabsTrigger>
                  <TabsTrigger value="contacts">Contactos</TabsTrigger>
                  <TabsTrigger value="resources">Recursos</TabsTrigger>
                </TabsList>

                <TabsContent value="info" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium">Cliente</h4>
                      <p className="text-sm">{selectedClient.name}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Empresa</h4>
                      <p className="text-sm">{selectedClient.company}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium">Email</h4>
                      <div className="flex items-center text-sm">
                        <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{selectedClient.contact}</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Teléfono</h4>
                      <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{selectedClient.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium">Fecha de inicio</h4>
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{new Date(selectedClient.startDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Responsable</h4>
                      <div className="flex items-center text-sm">
                        <User className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{selectedClient.responsible}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium">Servicios contratados</h4>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedClient.services.map((service: string, index: number) => (
                        <Badge key={index} variant="outline" className="bg-primary/10 dark:bg-primary/20">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium">Notas</h4>
                    <p className="text-sm mt-1 p-3 bg-muted rounded-md">{selectedClient.notes}</p>
                  </div>
                </TabsContent>

                <TabsContent value="services" className="space-y-4">
                  {selectedClient.serviceDetails.map((service: any, index: number) => (
                    <Card key={index}>
                      <CardHeader className="py-3">
                        <CardTitle className="text-base">{service.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="py-0 space-y-2">
                        <div>
                          <h4 className="text-sm font-medium">Descripción</h4>
                          <p className="text-sm">{service.description}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Frecuencia</h4>
                          <p className="text-sm">{service.frequency}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Entregables</h4>
                          <p className="text-sm">{service.deliverables}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="contacts" className="space-y-4">
                  {selectedClient.contacts.map((contact: any, index: number) => (
                    <Card key={index}>
                      <CardContent className="py-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{contact.name}</h4>
                            <p className="text-sm text-muted-foreground">{contact.role}</p>
                          </div>
                          <div className="space-y-1 text-right">
                            <div className="flex items-center justify-end text-sm">
                              <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{contact.email}</span>
                            </div>
                            <div className="flex items-center justify-end text-sm">
                              <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{contact.phone}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="resources" className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Enlaces</h4>
                    <div className="space-y-2">
                      {selectedClient.links.map((link: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                          <div className="flex items-center">
                            {getIcon(link.icon)}
                            <span className="text-sm">{link.name}</span>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => window.open(link.url, "_blank")}>
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Abrir
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Documentos</h4>
                    <div className="space-y-2">
                      {selectedClient.documents.map((doc: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                          <div className="flex items-center">
                            {getIcon(doc.icon)}
                            <span className="text-sm">{doc.name}</span>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => window.open(doc.url, "_blank")}>
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Abrir
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cerrar
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
