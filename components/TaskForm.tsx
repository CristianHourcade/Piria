// components/TaskForm.tsx
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface TaskFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (taskData: any) => void;
    initialData?: any;
    collaborators: { id: number; name: string }[];
    clients: { id: number; name: string }[];
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

const TaskForm: React.FC<TaskFormProps> = ({ isOpen, onClose, onSubmit, initialData, collaborators, clients }) => {
    const [title, setTitle] = useState(initialData?.title || "");
    const [description, setDescription] = useState(initialData?.description || "");
    const [clientId, setClientId] = useState(initialData?.clientId || "");
    const [assigneeId, setAssigneeId] = useState(initialData?.assigneeId || "");
    const [service, setService] = useState(initialData?.service || "");
    const [priority, setPriority] = useState(initialData?.priority || "");
    const [status, setStatus] = useState(initialData?.status || "");
    const [dueDate, setDueDate] = useState<Date | undefined>(initialData?.dueDate ? new Date(initialData.dueDate) : undefined);

    const handleSubmit = () => {
        const taskData = {
            title,
            description,
            client_id: clientId,
            assignee: assigneeId,
            service,
            priority,
            status,
            due_date:dueDate,
        };
        onSubmit(taskData);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{initialData ? "Editar Tarea" : "Nueva Tarea"}</DialogTitle>
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
                    <Select value={clientId} onValueChange={setClientId}>
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccionar Cliente" />
                        </SelectTrigger>
                        <SelectContent>
                            {clients.map((client) => (
                                <SelectItem key={client.id} value={client.id.toString()}>
                                    {client.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
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
                    <Select value={service} onValueChange={setService}>
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccionar Servicio" />
                        </SelectTrigger>
                        <SelectContent>
                            {SERVICES.map((svc) => (
                                <SelectItem key={svc} value={svc}>
                                    {svc}
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
                    <Select value={status} onValueChange={setStatus}>
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
                            value={dueDate ? new Date(dueDate).toISOString().split("T")[0] : ""}
                            onChange={(e) => setDueDate(new Date(e.target.value))}
                            required
                        />
                    </div>

                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit}>
                        {initialData ? "Actualizar" : "Crear"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default TaskForm;
