
"use client";

import { useState, useEffect } from "react";
import { fetchEmployees, createEmployee, updateEmployee, deleteEmployee } from "@/services/employees";
import type { Employee } from "@/types/employee";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function PersonalPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<Employee, "id" | "created_at" | "updated_at">>({
    name: "",
    email: "",
    phone: "",
    department: "",
    position: "",
    hire_date: "",
    notes: ""
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchEmployees().then((data) => {
      setEmployees(data);
      setLoading(false);
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    if (editingId !== null) {
      const cleanedData = {
      ...formData,
      hire_date: formData.hire_date || null
    };
    const updated = await updateEmployee(editingId, cleanedData);
      if (updated) {
        setEmployees(employees.map(emp => emp.id === editingId ? updated : emp));
      }
    } else {
      const cleanedData = {
      ...formData,
      hire_date: formData.hire_date || null
    };
    const created = await createEmployee(cleanedData);
      if (created) {
        setEmployees([created, ...employees]);
      }
    }
    resetForm();
  };

  const handleEdit = (employee: Employee) => {
    setFormData({
      name: employee.name,
      email: employee.email,
      phone: employee.phone || "",
      department: employee.department || "",
      position: employee.position || "",
      hire_date: employee.hire_date || "",
      notes: employee.notes || ""
    });
    setEditingId(employee.id);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    const success = await deleteEmployee(id);
    if (success) {
      setEmployees(employees.filter(emp => emp.id !== id));
    }
  };

  const resetForm = () => {
    setIsDialogOpen(false);
    setEditingId(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      department: "",
      position: "",
      hire_date: "",
      notes: ""
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Personal</h1>
        <Button onClick={() => setIsDialogOpen(true)}>Agregar Empleado</Button>
      </div>

      {loading ? (
        <p>Cargando empleados...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Departamento</TableHead>
              <TableHead>Posición</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.department}</TableCell>
                <TableCell>{employee.position}</TableCell>
                <TableCell>
                  <Button onClick={() => handleEdit(employee)}>Editar</Button>
                  <Button onClick={() => handleDelete(employee.id)}>Eliminar</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={isDialogOpen} onOpenChange={resetForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId !== null ? "Editar Empleado" : "Agregar Empleado"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nombre</Label>
              <Input name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div>
              <Label>Teléfono</Label>
              <Input name="phone" value={formData.phone} onChange={handleChange} />
            </div>
            <div>
              <Label>Departamento</Label>
              <Input name="department" value={formData.department} onChange={handleChange} />
            </div>
            <div>
              <Label>Posición</Label>
              <Input name="position" value={formData.position} onChange={handleChange} />
            </div>
            <div>
              <Label>Fecha de Contratación</Label>
              <Input type="date" name="hire_date" value={formData.hire_date} onChange={handleChange} />
            </div>
            <div>
              <Label>Notas</Label>
              <Input name="notes" value={formData.notes} onChange={handleChange} />
            </div>
          </div>
          <DialogFooter className="pt-4">
            <Button onClick={resetForm} variant="outline">Cancelar</Button>
            <Button onClick={handleSubmit}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
