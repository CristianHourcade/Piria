import { CheckCircle2, Clock, AlertCircle, PauseCircle, PlayCircle } from "lucide-react"

// Get status color and icon
export const getStatusInfo = (status: string) => {
  switch (status) {
    case "Completado":
      return {
        color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
        icon: <CheckCircle2 className="h-4 w-4 mr-1" />,
      }
    case "En curso":
      return {
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
        icon: <PlayCircle className="h-4 w-4 mr-1" />,
      }
    case "Esperando aprobación":
      return {
        color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
        icon: <Clock className="h-4 w-4 mr-1" />,
      }
    case "Pausado":
      return {
        color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
        icon: <PauseCircle className="h-4 w-4 mr-1" />,
      }
    case "No iniciado":
      return {
        color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
        icon: <AlertCircle className="h-4 w-4 mr-1" />,
      }
    default:
      return {
        color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
        icon: null,
      }
  }
}
