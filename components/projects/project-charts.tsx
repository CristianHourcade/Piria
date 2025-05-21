import type { Project } from "@/models/data-models"

interface ServiceAnalysis {
  service: string
  count: number
}

interface TeamAnalysis {
  responsible: string
  count: number
}

// Component for the status chart of projects
export function StatusChart({ projects }: { projects: Project[] }) {
  const statusCounts = {
    "En curso": projects.filter((project) => project.status === "En curso").length,
    "Esperando aprobación": projects.filter((project) => project.status === "Esperando aprobación").length,
    Completado: projects.filter((project) => project.status === "Completado").length,
    Pausado: projects.filter((project) => project.status === "Pausado").length,
    "No iniciado": projects.filter((project) => project.status === "No iniciado").length,
  }

  const statusColors = {
    "En curso": "bg-blue-500 dark:bg-blue-600",
    "Esperando aprobación": "bg-yellow-500 dark:bg-yellow-600",
    Completado: "bg-green-500 dark:bg-green-600",
    Pausado: "bg-gray-500 dark:bg-gray-600",
    "No iniciado": "bg-red-500 dark:bg-red-600",
  }

  const maxCount = Math.max(...Object.values(statusCounts))

  return (
    <div className="relative h-full w-full">
      {/* Eje Y - Valores */}
      <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-muted-foreground">
        <div>{maxCount}</div>
        <div>{Math.round(maxCount * 0.75)}</div>
        <div>{Math.round(maxCount * 0.5)}</div>
        <div>{Math.round(maxCount * 0.25)}</div>
        <div>0</div>
      </div>

      {/* Contenedor del gráfico */}
      <div className="absolute left-12 right-0 top-0 bottom-0">
        {/* Líneas horizontales de referencia */}
        <div className="absolute left-0 right-0 top-0 h-px bg-gray-200 dark:bg-gray-700"></div>
        <div className="absolute left-0 right-0 top-1/4 h-px bg-gray-200 dark:bg-gray-700"></div>
        <div className="absolute left-0 right-0 top-2/4 h-px bg-gray-200 dark:bg-gray-700"></div>
        <div className="absolute left-0 right-0 top-3/4 h-px bg-gray-200 dark:bg-gray-700"></div>
        <div className="absolute left-0 right-0 bottom-0 h-px bg-gray-200 dark:bg-gray-700"></div>

        {/* Barras del gráfico */}
        <div className="absolute inset-0 flex justify-around items-end pb-6">
          {Object.entries(statusCounts).map(([status, count]) => (
            <div key={status} className="flex flex-col items-center">
              <div
                className={`w-16 ${statusColors[status]}`}
                style={{
                  height: `${(count / maxCount) * 100}%`,
                  minHeight: "4px",
                }}
              ></div>
              <div className="text-xs mt-2 text-center max-w-[80px] truncate" title={status}>
                {status}
              </div>
              <div className="text-xs font-bold">{count}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function ServiceChart({ serviceAnalysis }: { serviceAnalysis: ServiceAnalysis[] }) {
  if (serviceAnalysis.length === 0) {
    return <div className="flex items-center justify-center h-full text-muted-foreground">No hay datos disponibles</div>
  }

  const maxCount = Math.max(...serviceAnalysis.map((item) => item.count))

  return (
    <div className="relative h-full w-full">
      {/* Eje Y - Valores */}
      <div className="absolute left-0 top-0 bottom-0 w-32 flex flex-col justify-between text-xs text-muted-foreground">
        {serviceAnalysis.slice(0, 5).map((item, index) => (
          <div key={index} className="truncate" title={item.service}>
            {item.service}
          </div>
        ))}
      </div>

      {/* Contenedor del gráfico */}
      <div className="absolute left-32 right-0 top-0 bottom-0">
        {/* Líneas verticales de referencia */}
        <div className="absolute top-0 bottom-0 left-0 w-px bg-gray-200 dark:bg-gray-700"></div>
        <div className="absolute top-0 bottom-0 left-1/4 w-px bg-gray-200 dark:bg-gray-700"></div>
        <div className="absolute top-0 bottom-0 left-2/4 w-px bg-gray-200 dark:bg-gray-700"></div>
        <div className="absolute top-0 bottom-0 left-3/4 w-px bg-gray-200 dark:bg-gray-700"></div>
        <div className="absolute top-0 bottom-0 right-0 w-px bg-gray-200 dark:bg-gray-700"></div>

        {/* Barras del gráfico */}
        <div className="absolute inset-0 flex flex-col justify-between">
          {serviceAnalysis.slice(0, 5).map((item, index) => (
            <div key={index} className="flex items-center h-8">
              <div
                className="h-5 bg-primary"
                style={{
                  width: `${(item.count / maxCount) * 100}%`,
                  minWidth: "4px",
                }}
              ></div>
              <span className="ml-2 text-xs font-bold">{item.count}</span>
            </div>
          ))}
        </div>

        {/* Eje X - Valores */}
        <div className="absolute left-0 right-0 bottom-[-24px] flex justify-between text-xs text-muted-foreground">
          <div>0</div>
          <div>{Math.round(maxCount * 0.25)}</div>
          <div>{Math.round(maxCount * 0.5)}</div>
          <div>{Math.round(maxCount * 0.75)}</div>
          <div>{maxCount}</div>
        </div>
      </div>
    </div>
  )
}

export function TeamChart({ teamAnalysis }: { teamAnalysis: TeamAnalysis[] }) {
  if (teamAnalysis.length === 0) {
    return <div className="flex items-center justify-center h-full text-muted-foreground">No hay datos disponibles</div>
  }

  return (
    <div className="relative h-full w-full">
      {/* Eje Y - Valores */}
      <div className="absolute left-0 top-0 bottom-0 w-32 flex flex-col justify-between text-xs text-muted-foreground">
        {teamAnalysis.slice(0, 5).map((item, index) => (
          <div key={index} className="truncate" title={item.responsible}>
            {item.responsible}
          </div>
        ))}
      </div>

      {/* Contenedor del gráfico */}
      <div className="absolute left-32 right-0 top-0 bottom-0">
        {/* Líneas verticales de referencia */}
        <div className="absolute top-0 bottom-0 left-0 w-px bg-gray-200 dark:bg-gray-700"></div>
        <div className="absolute top-0 bottom-0 left-1/4 w-px bg-gray-200 dark:bg-gray-700"></div>
        <div className="absolute top-0 bottom-0 left-2/4 w-px bg-gray-200 dark:bg-gray-700"></div>
        <div className="absolute top-0 bottom-0 left-3/4 w-px bg-gray-200 dark:bg-gray-700"></div>
        <div className="absolute top-0 bottom-0 right-0 w-px bg-gray-200 dark:bg-gray-700"></div>

        {/* Barras del gráfico */}
        <div className="absolute inset-0 flex flex-col justify-between">
          {teamAnalysis.slice(0, 5).map((item, index) => (
            <div key={index} className="flex items-center h-8">
              <div
                className="h-5 bg-primary"
                style={{
                  width: `${(item.count / Math.max(...teamAnalysis.map((i) => i.count))) * 100}%`,
                  minWidth: "4px",
                }}
              ></div>
              <span className="ml-2 text-xs font-bold">{item.count} proyectos</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
