import type { Project } from "@/models/data-models"

// List of services available
export const SERVICES = [
  "Community Manager",
  "Meta Ads",
  "Google Ads",
  "Desarrollo Web",
  "Diseño Gráfico",
  "Creación de Contenido",
  "Email Marketing",
  "SEO",
  "SEM",
  "Consultoría",
  "Fotografía",
]

// List of collaborators
export const COLLABORATORS = [
  { id: "1", name: "Ana García" },
  { id: "2", name: "Carlos Rodríguez" },
  { id: "3", name: "Laura Martínez" },
  { id: "4", name: "Diego Sánchez" },
  { id: "5", name: "Sofía Ramírez" },
]

// List of roles by service
export const SERVICE_ROLES = {
  "Community Manager": [
    "Community Manager",
    "Asistente",
    "Diseñador",
    "Redactor",
    "Estratega",
    "Social Media",
    "Paid Media",
    "Consultor",
  ],
  "Meta Ads": [
    "Especialista Ads",
    "Analista",
    "Diseñador",
    "CM",
    "Paid Media",
    "Social Media",
    "Desarrollador",
    "Consultor",
  ],
  "Google Ads": ["Especialista Ads", "Analista", "Diseñador", "Paid Media", "Desarrollador", "Consultor"],
  "Desarrollo Web": ["Desarrollador", "Desarrollador Principal", "Diseñador UI/UX", "QA", "Consultor"],
  "Diseño Gráfico": ["Diseñador Gráfico", "Director de Arte", "Consultor"],
  "Creación de Contenido": [
    "Redactor",
    "Editor",
    "Corrector",
    "CM",
    "Social Media",
    "Estratega de Contenido",
    "Consultor",
  ],
  "Email Marketing": ["Especialista Email", "Diseñador", "Redactor", "Desarrollador", "Consultor"],
  SEO: ["Especialista SEO", "Analista", "Redactor", "Desarrollador", "Consultor"],
  SEM: ["Especialista SEM", "Analista", "Paid Media", "Consultor"],
  Consultoría: ["Consultor", "Analista", "Estratega"],
  Fotografía: ["Fotógrafo", "Editor", "Director de Arte"],
}

// Mock data for projects
export const PROJECTS: Project[] = [
  {
    id: 1,
    name: "Rediseño Web Corporativa",
    client: "Empresa ABC",
    service: "Desarrollo Web",
    status: "En curso",
    progress: 65,
    startDate: "2023-03-15",
    endDate: "2023-05-15",
    lastUpdate: "2023-04-05",
    responsible: "Ana García",
    description: "Rediseño completo del sitio web corporativo con enfoque en UX/UI y optimización móvil.",
    collaborators: [
      { id: "sc1", collaboratorId: "1", collaboratorName: "Ana García", role: "Desarrollador Principal" },
      { id: "sc2", collaboratorId: "2", collaboratorName: "Carlos Rodríguez", role: "Diseñador UI/UX" },
    ],
    budget: 150000,
    cost: 90000,
  },
  {
    id: 2,
    name: "Campaña Redes Sociales",
    client: "Startup XYZ",
    service: "Community Manager",
    status: "Esperando aprobación",
    progress: 90,
    startDate: "2023-03-01",
    endDate: "2023-04-30",
    lastUpdate: "2023-04-03",
    responsible: "Carlos Rodríguez",
    description: "Campaña de marketing en Instagram, Facebook y LinkedIn para lanzamiento de producto.",
    collaborators: [
      { id: "sc3", collaboratorId: "2", collaboratorName: "Carlos Rodríguez", role: "Community Manager" },
      { id: "sc4", collaboratorId: "5", collaboratorName: "Sofía Ramírez", role: "Diseñador Gráfico" },
    ],
    budget: 80000,
    cost: 50000,
  },
  {
    id: 3,
    name: "Gestión de Redes Sociales",
    client: "Consultora 123",
    service: "Community Manager",
    status: "No iniciado",
    progress: 0,
    startDate: "2023-05-01",
    endDate: "2023-07-31",
    lastUpdate: "2023-04-01",
    responsible: "Laura Martínez",
    description: "Gestión mensual de contenido para redes sociales con enfoque en engagement y crecimiento.",
    collaborators: [
      { id: "sc5", collaboratorId: "2", collaboratorName: "Carlos Rodríguez", role: "Community Manager" },
    ],
    budget: 60000,
    cost: 0,
  },
  {
    id: 4,
    name: "Optimización SEO",
    client: "Tienda Online",
    service: "SEO",
    status: "Pausado",
    progress: 45,
    startDate: "2023-02-15",
    endDate: "2023-05-15",
    lastUpdate: "2023-03-28",
    responsible: "Diego Sánchez",
    description: "Optimización de posicionamiento en buscadores y mejora de estructura web para SEO.",
    collaborators: [{ id: "sc6", collaboratorId: "4", collaboratorName: "Diego Sánchez", role: "Especialista SEO" }],
    budget: 70000,
    cost: 35000,
  },
  {
    id: 5,
    name: "Sesión Fotográfica Productos",
    client: "Restaurante Gourmet",
    service: "Fotografía",
    status: "Completado",
    progress: 100,
    startDate: "2023-03-10",
    endDate: "2023-03-25",
    lastUpdate: "2023-03-25",
    responsible: "Sofía Ramírez",
    description: "Sesión fotográfica profesional de platos y ambiente del restaurante para web y redes.",
    collaborators: [{ id: "sc7", collaboratorId: "5", collaboratorName: "Sofía Ramírez", role: "Fotógrafo" }],
    budget: 40000,
    cost: 25000,
  },
  {
    id: 6,
    name: "Email Marketing Mensual",
    client: "Empresa ABC",
    service: "Email Marketing",
    status: "En curso",
    progress: 30,
    startDate: "2023-04-01",
    endDate: "2023-04-30",
    lastUpdate: "2023-04-06",
    responsible: "Ana García",
    description: "Diseño y envío de newsletters mensuales con seguimiento de métricas y optimización.",
    collaborators: [
      { id: "sc8", collaboratorId: "1", collaboratorName: "Ana García", role: "Especialista Email" },
      { id: "sc9", collaboratorId: "5", collaboratorName: "Sofía Ramírez", role: "Diseñador" },
    ],
    budget: 30000,
    cost: 15000,
  },
  {
    id: 7,
    name: "Campaña Google Ads",
    client: "Tienda Online",
    service: "Google Ads",
    status: "En curso",
    progress: 50,
    startDate: "2023-03-20",
    endDate: "2023-05-20",
    lastUpdate: "2023-04-10",
    responsible: "Carlos Rodríguez",
    description: "Campaña de Google Ads para aumentar conversiones en tienda online.",
    collaborators: [
      { id: "sc10", collaboratorId: "2", collaboratorName: "Carlos Rodríguez", role: "Especialista Ads" },
    ],
    budget: 50000,
    cost: 25000,
  },
  {
    id: 8,
    name: "Diseño de Logo",
    client: "Startup XYZ",
    service: "Diseño Gráfico",
    status: "Completado",
    progress: 100,
    startDate: "2023-02-01",
    endDate: "2023-02-15",
    lastUpdate: "2023-02-15",
    responsible: "Sofía Ramírez",
    description: "Diseño de logo y manual de marca para nueva startup.",
    collaborators: [{ id: "sc11", collaboratorId: "5", collaboratorName: "Sofía Ramírez", role: "Diseñador Gráfico" }],
    budget: 25000,
    cost: 15000,
  },
  {
    id: 9,
    name: "Creación de Contenidos Blog",
    client: "Consultora 123",
    service: "Creación de Contenido",
    status: "En curso",
    progress: 70,
    startDate: "2023-03-01",
    endDate: "2023-04-30",
    lastUpdate: "2023-04-12",
    responsible: "Laura Martínez",
    description: "Redacción de artículos SEO para blog corporativo.",
    collaborators: [{ id: "sc12", collaboratorId: "3", collaboratorName: "Laura Martínez", role: "Redactor" }],
    budget: 35000,
    cost: 24000,
  },
  {
    id: 10,
    name: "Desarrollo Tienda Online",
    client: "Empresa ABC",
    service: "Desarrollo Web",
    status: "Esperando aprobación",
    progress: 85,
    startDate: "2023-01-15",
    endDate: "2023-04-15",
    lastUpdate: "2023-04-10",
    responsible: "Ana García",
    description: "Desarrollo de tienda online con WooCommerce y personalización de tema.",
    collaborators: [
      { id: "sc13", collaboratorId: "1", collaboratorName: "Ana García", role: "Desarrollador" },
      { id: "sc14", collaboratorId: "4", collaboratorName: "Diego Sánchez", role: "SEO" },
    ],
    budget: 120000,
    cost: 90000,
  },
  {
    id: 11,
    name: "Campaña Meta Ads",
    client: "Restaurante Gourmet",
    service: "Meta Ads",
    status: "En curso",
    progress: 40,
    startDate: "2023-04-01",
    endDate: "2023-05-31",
    lastUpdate: "2023-04-15",
    responsible: "Carlos Rodríguez",
    description: "Campaña de Facebook e Instagram Ads para promocionar nuevos platos.",
    collaborators: [
      { id: "sc15", collaboratorId: "2", collaboratorName: "Carlos Rodríguez", role: "Especialista Ads" },
    ],
    budget: 45000,
    cost: 18000,
  },
  {
    id: 12,
    name: "Rediseño de Marca",
    client: "Tienda Online",
    service: "Diseño Gráfico",
    status: "Esperando aprobación",
    progress: 95,
    startDate: "2023-03-01",
    endDate: "2023-04-15",
    lastUpdate: "2023-04-12",
    responsible: "Sofía Ramírez",
    description: "Rediseño completo de identidad visual y aplicaciones de marca.",
    collaborators: [{ id: "sc16", collaboratorId: "5", collaboratorName: "Sofía Ramírez", role: "Director de Arte" }],
    budget: 60000,
    cost: 45000,
  },
  {
    id: 13,
    name: "Estrategia de Contenidos",
    client: "Startup XYZ",
    service: "Creación de Contenido",
    status: "Completado",
    progress: 100,
    startDate: "2023-02-15",
    endDate: "2023-03-15",
    lastUpdate: "2023-03-15",
    responsible: "Laura Martínez",
    description: "Desarrollo de estrategia de contenidos para blog y redes sociales.",
    collaborators: [
      { id: "sc17", collaboratorId: "3", collaboratorName: "Laura Martínez", role: "Estratega de Contenido" },
    ],
    budget: 40000,
    cost: 30000,
  },
  {
    id: 14,
    name: "Campaña Meta Ads Promoción",
    client: "Empresa ABC",
    service: "Meta Ads",
    status: "Completado",
    progress: 100,
    startDate: "2023-01-01",
    endDate: "2023-02-28",
    lastUpdate: "2023-02-28",
    responsible: "Carlos Rodríguez",
    description: "Campaña de Facebook e Instagram Ads para promocionar nuevos servicios.",
    collaborators: [
      { id: "sc18", collaboratorId: "2", collaboratorName: "Carlos Rodríguez", role: "Especialista Ads" },
    ],
    budget: 55000,
    cost: 40000,
  },
  {
    id: 15,
    name: "Mantenimiento Web",
    client: "Consultora 123",
    service: "Desarrollo Web",
    status: "En curso",
    progress: 25,
    startDate: "2023-04-01",
    endDate: "2023-06-30",
    lastUpdate: "2023-04-15",
    responsible: "Ana García",
    description: "Mantenimiento mensual del sitio web, actualizaciones y mejoras.",
    collaborators: [{ id: "sc19", collaboratorId: "1", collaboratorName: "Ana García", role: "Desarrollador" }],
    budget: 30000,
    cost: 7500,
  },
]
