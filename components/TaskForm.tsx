// components/TaskForm.tsx
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Label } from '@radix-ui/react-label';

interface TaskFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (taskData: any) => void;
    taskToEdit?: any;
    collaborators: { id: number; name: string }[];
    clients: { id: number; name: string }[];
    projects: any  // 👈 nuevo
    taskToEdit?: any // 👈 nuevo

}

const SERVICES = [
    "Diseño Gráfico",
    "Diseño Web",
    "Desarrollo Web",
    "Redes Sociales",
    "SEO",
    "Google Ads",
    "Email Marketing",
    "Analítica",
    "Fotografía",
    "Creación de Contenido",
];

const PRIORITIES = ["Alta", "Media", "Baja"];
const STATUSES = ["Pendiente", "En Progreso", "Completada", "Pausada"];

const TaskForm: React.FC<TaskFormProps> = ({ isOpen, onClose, onSubmit, taskToEdit, collaborators, clients, projects }) => {
    const [title, setTitle] = useState(taskToEdit?.title || "");
    const [description, setDescription] = useState(taskToEdit?.description || "");
    const [clientId, setClientId] = useState(taskToEdit?.clientId || "");
    const [assigneeId, setAssigneeId] = useState(taskToEdit?.assigneeId || "");
    const [service, setService] = useState(taskToEdit?.service || "");
    const [priority, setPriority] = useState(taskToEdit?.priority || "");
    const [status, setStatus] = useState(taskToEdit?.status || "");
    const [dueDate, setDueDate] = useState<Date | undefined>(taskToEdit?.dueDate ? new Date(taskToEdit.dueDate) : undefined);
    const [projectId, setProjectId] = useState<number | null>(null);
    useEffect(() => {
        if (taskToEdit) {
            setTitle(taskToEdit.title || "")
            setDescription(taskToEdit.description || "")
            setClientId(taskToEdit.client_id || "")
            setAssigneeId(taskToEdit.assignee || "")
            setService(taskToEdit.service || "")
            setPriority(taskToEdit.priority || "")
            setStatus(taskToEdit.status || "Pendiente")
            setDueDate(new Date(taskToEdit.dueDate))
            setProjectId(taskToEdit.project_id || null)
        } else {
            // limpiar formulario si es creación
            setTitle("")
            setDescription("")
            setClientId("")
            setAssigneeId("")
            setService("")
            setPriority("")
            setStatus("Pendiente")
            setDueDate(new Date())
            setProjectId(null)
        }
    }, [taskToEdit])

    const handleSubmit = () => {
        const taskData = {
            title,
            description,
            assignee: assigneeId,
            priority,
            status: STATUSES[0],
            due_date: dueDate,
            project_id: projectId,
        };
        if (taskToEdit) {
            onSubmit({ id: taskToEdit.id, ...taskData }) // 👈 incluye id si es edición
        } else {
            onSubmit(taskData)
        }
        onClose();
    };
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{taskToEdit ? "Editar Tarea" : "Nueva Tarea"}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Input
                        placeholder="Título"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <Textarea
                        placeholder="Descripción"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <Select value={assigneeId} onValueChange={setAssigneeId}>
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccionar Colaborador" />
                        </SelectTrigger>
                        <SelectContent>
                            {collaborators.map((collaborator) => (
                                <SelectItem key={collaborator.id} value={collaborator.id.toString()}>
                                    {collaborator.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={priority} onValueChange={setPriority}>
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccionar Prioridad" />
                        </SelectTrigger>
                        <SelectContent>
                            {PRIORITIES.map((prio) => (
                                <SelectItem key={prio} value={prio}>
                                    {prio}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={STATUSES[0]} disabled onValueChange={setStatus}>
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccionar Estado" />
                        </SelectTrigger>
                        <SelectContent>
                            {STATUSES.map((stat) => (
                                <SelectItem key={stat} value={stat}>
                                    {stat}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <div className="space-y-2">
                        <label htmlFor="dueDate" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Fecha Límite
                        </label>
                        <Input
                            id="dueDate"
                            name="dueDate"
                            type="date"
                            value={
                                dueDate instanceof Date && !isNaN(dueDate.getTime())
                                    ? dueDate.toISOString().split("T")[0]
                                    : ""
                            }
                            onChange={(e) => {
                                const date = new Date(e.target.value)
                                if (!isNaN(date.getTime())) {
                                    setDueDate(date)
                                }
                            }}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="project">Proyecto</Label>
                        <Select value={projectId?.toString() || ""} onValueChange={(value) => setProjectId(parseInt(value))}>
                            <SelectTrigger id="project">
                                <SelectValue placeholder="Selecciona un proyecto" />
                            </SelectTrigger>
                            <SelectContent>
                                {projects.map((project) => (
                                    <SelectItem key={project.id} value={project.id.toString()}>
                                        {project.client} - {project.service}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit}>
                        {taskToEdit ? "Actualizar" : "Crear"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default TaskForm;
