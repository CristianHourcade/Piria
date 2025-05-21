import { DialogHeader, DialogTitle, DialogDescription, DialogContent } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { getStatusInfo } from "@/utils/project-utils"
import { Project } from "@/types/project"

interface ProjectDetailsProps {
  project: Project
}

export function ProjectDetails({ project }: ProjectDetailsProps) {
  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>{project.name}</DialogTitle>
        <DialogDescription>Detalles del proyecto</DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium">Cliente</h4>
            <p className="text-sm">{project.client}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Servicio</h4>
            <p className="text-sm">{project.service}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <h4 className="text-sm font-medium">Fecha Inicio</h4>
            <p className="text-sm text-muted-foreground">{new Date(project.start_date).toLocaleDateString()} - {new Date(project.end_date).toLocaleDateString()}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Fecha Fin</h4>
            <p className="text-sm text-muted-foreground">{new Date(project.start_date).toLocaleDateString()} - {new Date(project.end_date).toLocaleDateString()}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Estado</h4>
            <Badge className={getStatusInfo(project.status).color}>
              <span className="flex items-center">
                {getStatusInfo(project.status).icon}
                <span>{project.status}</span>
              </span>
            </Badge>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium">Responsable</h4>
          <p className="text-sm">{project.responsible}</p>
        </div>

        <div>
          <h4 className="text-sm font-medium">Descripción</h4>
          <p className="text-sm mt-1">{project.description}</p>
        </div>

        <div>
          <h4 className="text-sm font-medium">Progreso</h4>
          <div className="mt-2 h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: `${project.progress}%` }}></div>
          </div>
          <p className="mt-1 text-xs text-right">{project.progress}%</p>
        </div>

        <div>
          <h4 className="text-sm font-medium">Colaboradores</h4>
          {Array.isArray(project.collaborators) && project.collaborators.length > 0 ? (
            <div className="mt-2 space-y-2">
              {project.collaborators.map((collaborator) => (
                <div
                  key={collaborator.id}
                  className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 p-2 rounded-md"
                >
                  <div>
                    <span className="font-medium">{collaborator.collaboratorName}</span>
                    <span className="text-sm text-muted-foreground ml-2">({collaborator.role})</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground mt-1">No hay colaboradores asignados</p>
          )}
        </div>
      </div>
    </DialogContent>
  )
}
