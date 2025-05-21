// Task view utility functions and constants

// Get priority color
export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "Alta":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
    case "Media":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
    case "Baja":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
  }
}

// Get status color and icon
export const getStatusInfo = (status: string) => {
  const { Clock, CheckCircle, PlayCircle, PauseCircle, Info } = require("lucide-react")

  switch (status) {
    case "Completada":
      return {
        color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
        icon: <CheckCircle className="h-4 w-4 mr-1" />,
      }
    case "En Progreso":
      return {
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
        icon: <PlayCircle className="h-4 w-4 mr-1" />,
      }
    case "Pausada":
      return {
        color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
        icon: <PauseCircle className="h-4 w-4 mr-1" />,
      }
    case "Pendiente":
      return {
        color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
        icon: <Clock className="h-4 w-4 mr-1" />,
      }
    default:
      return {
        color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
        icon: <Info className="h-4 w-4 mr-1" />,
      }
  }
}

// Check if task is overdue
export const isTaskOverdue = (dueDate: string) => {
  return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString()
}

// Mock data for tasks
export const TASKS = [
  {
    id: 1,
    title: "Diseñar banner para redes sociales",
    client: "Empresa ABC",
    service: "Diseño Gráfico",
    dueDate: "2023-04-15",
    status: "Pendiente",
    priority: "Alta",
    description: "Crear banner promocional para Instagram y Facebook según brief adjunto.",
    comments: [],
    assignee: "Ana García",
    assigneeInitial: "A",
    timeEntries: [
      {
        id: 101,
        taskId: 1,
        startTime: "2023-04-10T09:00:00Z",
        endTime: "2023-04-10T10:30:00Z",
        duration: 5400000, // 1.5 hours
        notes: "Investigación de referencias y estilos",
      },
      {
        id: 102,
        taskId: 1,
        startTime: "2023-04-11T14:00:00Z",
        endTime: "2023-04-11T16:00:00Z",
        duration: 7200000, // 2 hours
        notes: "Bocetos iniciales",
      },
    ],
    manuallyPrioritized: false,
  },
  {
    id: 2,
    title: "Actualizar contenido de página web",
    client: "Startup XYZ",
    service: "Diseño Web",
    dueDate: "2023-04-18",
    status: "En Progreso",
    priority: "Media",
    description: 'Actualizar sección "Nosotros" y "Servicios" con nuevo contenido proporcionado por el cliente.',
    comments: [{ author: "Ana García", date: "2023-04-10", text: "Cliente envió nuevas imágenes para incluir" }],
    assignee: "Carlos Rodríguez",
    assigneeInitial: "C",
    timeEntries: [
      {
        id: 201,
        taskId: 2,
        startTime: "2023-04-12T10:00:00Z",
        endTime: "2023-04-12T12:30:00Z",
        duration: 9000000, // 2.5 hours
        notes: "Actualización de textos y estructura",
      },
    ],
    manuallyPrioritized: false,
  },
  {
    id: 3,
    title: "Programar publicaciones en redes",
    client: "Consultora 123",
    service: "Redes Sociales",
    dueDate: "2023-04-12",
    status: "Completada",
    priority: "Baja",
    description: "Programar contenido aprobado para las próximas 2 semanas en Instagram, Facebook y LinkedIn.",
    comments: [
      { author: "Carlos Rodríguez", date: "2023-04-08", text: "Contenido aprobado por el cliente" },
      { author: "Laura Martínez", date: "2023-04-11", text: "Publicaciones programadas correctamente" },
    ],
    assignee: "Laura Martínez",
    assigneeInitial: "L",
    timeEntries: [
      {
        id: 301,
        taskId: 3,
        startTime: "2023-04-09T11:00:00Z",
        endTime: "2023-04-09T13:00:00Z",
        duration: 7200000, // 2 hours
        notes: "Programación de contenido para Instagram",
      },
      {
        id: 302,
        taskId: 3,
        startTime: "2023-04-10T09:30:00Z",
        endTime: "2023-04-10T11:30:00Z",
        duration: 7200000, // 2 hours
        notes: "Programación de contenido para Facebook y LinkedIn",
      },
    ],
    manuallyPrioritized: false,
  },
  {
    id: 4,
    title: "Optimizar SEO on-page",
    client: "Tienda Online",
    service: "SEO",
    dueDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split("T")[0], // Tomorrow
    status: "Pendiente",
    priority: "Alta",
    description: "Optimizar meta tags, headings y contenido de las páginas principales para mejorar posicionamiento.",
    comments: [],
    assignee: "Diego Sánchez",
    assigneeInitial: "D",
    timeEntries: [],
    manuallyPrioritized: false,
  },
  {
    id: 5,
    title: "Sesión de fotos de productos",
    client: "Restaurante Gourmet",
    service: "Fotografía",
    dueDate: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString().split("T")[0], // 3 days from now
    status: "En Progreso",
    priority: "Media",
    description: "Realizar sesión fotográfica de nuevos platos para menú y redes sociales.",
    comments: [{ author: "Sofía Ramírez", date: "2023-04-05", text: "Confirmar fecha y hora con el cliente" }],
    assignee: "Sofía Ramírez",
    assigneeInitial: "S",
    timeEntries: [
      {
        id: 501,
        taskId: 5,
        startTime: "2023-04-13T15:00:00Z",
        endTime: "2023-04-13T17:30:00Z",
        duration: 9000000, // 2.5 hours
        notes: "Preparación de equipos y locación",
      },
    ],
    manuallyPrioritized: false,
  },
]

// Lista de colaboradores disponibles para asignación
export const COLLABORATORS = [
  { id: 1, name: "Ana García", initial: "A" },
  { id: 2, name: "Carlos Rodríguez", initial: "C" },
  { id: 3, name: "Laura Martínez", initial: "L" },
  { id: 4, name: "Diego Sánchez", initial: "D" },
  { id: 5, name: "Sofía Ramírez", initial: "S" },
]
