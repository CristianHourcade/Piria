// Datos de ejemplo para plantillas de tareas
export const TASK_TEMPLATES = [
  {
    id: 1,
    service: "Diseño Web",
    autoAssign: true,
    tasks: [
      {
        id: 1,
        name: "Wireframing",
        description: "Crear wireframes de todas las páginas",
        duration: 3,
        role: "Diseñador",
      },
      { id: 2, name: "Diseño UI", description: "Diseñar interfaz de usuario", duration: 5, role: "Diseñador" },
      {
        id: 3,
        name: "Desarrollo Frontend",
        description: "Implementar HTML/CSS/JS",
        duration: 7,
        role: "Desarrollador",
      },
      {
        id: 4,
        name: "Revisión y ajustes",
        description: "Revisar y ajustar según feedback",
        duration: 2,
        role: "Diseñador",
      },
    ],
  },
  {
    id: 2,
    service: "Redes Sociales",
    autoAssign: true,
    tasks: [
      {
        id: 1,
        name: "Planificación de contenido",
        description: "Crear calendario de contenido mensual",
        duration: 2,
        role: "Community Manager",
      },
      {
        id: 2,
        name: "Diseño de piezas",
        description: "Diseñar imágenes para publicaciones",
        duration: 4,
        role: "Diseñador",
      },
      {
        id: 3,
        name: "Programación de publicaciones",
        description: "Programar contenido en plataformas",
        duration: 1,
        role: "Community Manager",
      },
      {
        id: 4,
        name: "Análisis de resultados",
        description: "Analizar métricas y engagement",
        duration: 2,
        role: "Analista",
      },
    ],
  },
  {
    id: 3,
    service: "SEO",
    autoAssign: false,
    tasks: [
      {
        id: 1,
        name: "Auditoría inicial",
        description: "Analizar estado actual del sitio",
        duration: 3,
        role: "Especialista SEO",
      },
      {
        id: 2,
        name: "Investigación de palabras clave",
        description: "Identificar keywords relevantes",
        duration: 2,
        role: "Especialista SEO",
      },
      {
        id: 3,
        name: "Optimización on-page",
        description: "Implementar mejoras en el sitio",
        duration: 5,
        role: "Especialista SEO",
      },
      {
        id: 4,
        name: "Informe de resultados",
        description: "Generar informe de posicionamiento",
        duration: 1,
        role: "Analista",
      },
    ],
  },
]

// Datos de ejemplo para asignaciones recientes
export const RECENT_ASSIGNMENTS = [
  {
    id: 1,
    client: "Empresa ABC",
    service: "Diseño Web",
    collaborator: "Ana García",
    date: "2023-04-15",
    tasksGenerated: 4,
  },
  {
    id: 2,
    client: "Startup XYZ",
    service: "Redes Sociales",
    collaborator: "Carlos Rodríguez",
    date: "2023-04-12",
    tasksGenerated: 4,
  },
  {
    id: 3,
    client: "Consultora 123",
    service: "SEO",
    collaborator: "Diego Sánchez",
    date: "2023-04-10",
    tasksGenerated: 4,
  },
]

// Datos de ejemplo para clientes con renovación automática
export const CLIENTS_WITH_AUTO_RENEWAL = [
  {
    id: 1,
    name: "Empresa ABC",
    service: "Diseño Web",
    collaborator: "Ana García",
    lastRenewal: "2023-03-15",
    nextRenewal: "2023-04-15",
    status: "Pendiente",
    autoRenewal: true,
  },
  {
    id: 2,
    name: "Startup XYZ",
    service: "Redes Sociales",
    collaborator: "Carlos Rodríguez",
    lastRenewal: "2023-03-01",
    nextRenewal: "2023-04-01",
    status: "Completado",
    autoRenewal: true,
  },
  {
    id: 3,
    name: "Consultora 123",
    service: "SEO",
    collaborator: "Diego Sánchez",
    lastRenewal: "2023-03-10",
    nextRenewal: "2023-04-10",
    status: "Pendiente",
    autoRenewal: true,
  },
  {
    id: 4,
    name: "Tienda Online",
    service: "Marketing Digital",
    collaborator: "Laura Martínez",
    lastRenewal: "2023-03-05",
    nextRenewal: "2023-04-05",
    status: "Pendiente",
    autoRenewal: true,
  },
  {
    id: 5,
    name: "Restaurante Gourmet",
    service: "Fotografía",
    collaborator: "Sofía Ramírez",
    lastRenewal: "2023-03-20",
    nextRenewal: "2023-04-20",
    status: "Pendiente",
    autoRenewal: true,
  },
]

// Datos de ejemplo para historial de renovaciones
export const RENEWAL_HISTORY = [
  {
    id: 1,
    client: "Empresa ABC",
    service: "Diseño Web",
    collaborator: "Ana García",
    renewalDate: "2023-03-15",
    tasksGenerated: 4,
    status: "Completado",
  },
  {
    id: 2,
    client: "Startup XYZ",
    service: "Redes Sociales",
    collaborator: "Carlos Rodríguez",
    renewalDate: "2023-03-01",
    tasksGenerated: 4,
    status: "Completado",
  },
  {
    id: 3,
    client: "Consultora 123",
    service: "SEO",
    collaborator: "Diego Sánchez",
    renewalDate: "2023-03-10",
    tasksGenerated: 4,
    status: "Completado",
  },
  {
    id: 4,
    client: "Tienda Online",
    service: "Marketing Digital",
    collaborator: "Laura Martínez",
    renewalDate: "2023-03-05",
    tasksGenerated: 4,
    status: "Completado",
  },
  {
    id: 5,
    client: "Restaurante Gourmet",
    service: "Fotografía",
    collaborator: "Sofía Ramírez",
    renewalDate: "2023-03-20",
    tasksGenerated: 4,
    status: "Completado",
  },
  {
    id: 6,
    client: "Empresa ABC",
    service: "Diseño Web",
    collaborator: "Ana García",
    renewalDate: "2023-02-15",
    tasksGenerated: 4,
    status: "Completado",
  },
  {
    id: 7,
    client: "Startup XYZ",
    service: "Redes Sociales",
    collaborator: "Carlos Rodríguez",
    renewalDate: "2023-02-01",
    tasksGenerated: 4,
    status: "Completado",
  },
]

// Lista de servicios
export const SERVICES = [
  "Diseño Web",
  "Redes Sociales",
  "SEO",
  "Marketing Digital",
  "Consultoría",
  "Capacitación",
  "E-commerce",
  "Email Marketing",
  "Fotografía",
  "Diseño Gráfico",
]

// Lista de roles
export const ROLES = [
  "Diseñador",
  "Desarrollador",
  "Community Manager",
  "Especialista SEO",
  "Analista",
  "Consultor",
  "Fotógrafo",
  "Copywriter",
  "Project Manager",
]
