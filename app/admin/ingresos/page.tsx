"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function IngresosPage() {
    const [incomes, setIncomes] = useState<any[]>([])
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [accounts, setAccounts] = useState<{ id: string; name: string }[]>([])
    const [projects, setProjects] = useState<any>([])
    const [editingIncome, setEditingIncome] = useState<any | null>(null)
    const [incomeToDelete, setIncomeToDelete] = useState<number | null>(null)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    useEffect(() => {
        fetchIncomes()
        fetchAccounts()
        fetchProjects()
    }, [])

    const fetchIncomes = async () => {
        const { data, error } = await supabase
            .from("incomes")
            .select("*, accounts(name), project(client, service)")
            .order("date", { ascending: false })

        if (!error && data) setIncomes(data)
    }

    const fetchAccounts = async () => {
        const { data } = await supabase.from("accounts").select("id, name")
        if (data) setAccounts(data)
    }

    const fetchProjects = async () => {
        const { data } = await supabase.from("project").select("id, client, service")
        if (data) setProjects(data)
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Ingresos</h1>
                    <p className="text-muted-foreground">Visualizá los ingresos de la agencia</p>
                </div>
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-emerald-500 hover:bg-emerald-600">
                            <Plus className="mr-2 h-4 w-4" />
                            Agregar Ingreso
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                        <IncomeForm
                            onSubmit={async (newIncome) => {
                                const { id, ...dataWithoutId } = newIncome
                                const { error } = await supabase.from("incomes").insert([dataWithoutId])
                                if (!error) {
                                    await fetchIncomes()
                                    setIsAddOpen(false)
                                } else {
                                    console.error("Error al guardar ingreso:", error)
                                }
                            }}
                            onCancel={() => setIsAddOpen(false)}
                            accounts={accounts}
                            projects={projects}
                        />

                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Listado de Ingresos</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Descripción</TableHead>
                                <TableHead>Monto</TableHead>
                                <TableHead>Fecha</TableHead>
                                <TableHead>Cuenta</TableHead>
                                <TableHead>Proyecto</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {incomes.map((income) => (
                                <TableRow key={income.id}>
                                    <TableCell>{income.description}</TableCell>
                                    <TableCell>$ {income.amount.toLocaleString()},00</TableCell>
                                    <TableCell>{new Date(income.date).toLocaleDateString()}</TableCell>
                                    <TableCell>{income.accounts?.name || "-"}</TableCell>
                                    <TableCell>{income.project?.client + " | " + income.project?.service || "-"}</TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-300"
                                            onClick={() => {
                                                setIncomeToDelete(income.id)
                                                setIsDeleteDialogOpen(true)
                                            }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7L5 7M10 11v6M14 11v6M5 7l1 12a2 2 0 002 2h8a2 2 0 002-2l1-12" />
                                            </svg>
                                        </Button>

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setEditingIncome(income)}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 11l3.536 3.536M5 19l14-14M5 19h4l-4-4v4z" />
                                            </svg>
                                        </Button>
                                    </TableCell>
                                </TableRow>

                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción eliminará el ingreso y no se puede deshacer.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setIncomeToDelete(null)}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700 text-white"
                            onClick={async () => {
                                if (!incomeToDelete) return
                                const { error } = await supabase.from("incomes").delete().eq("id", incomeToDelete)
                                if (!error) await fetchIncomes()
                                setIncomeToDelete(null)
                                setIsDeleteDialogOpen(false)
                            }}
                        >
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {editingIncome && (
                <Dialog open={!!editingIncome} onOpenChange={(open) => !open && setEditingIncome(null)}>
                    <DialogContent className="sm:max-w-[600px]">
                        <IncomeForm
                            onSubmit={async (updatedIncome) => {
                                const { id, ...rest } = updatedIncome;
                                const { error } = await supabase
                                    .from("incomes")
                                    .update(rest)
                                    .eq("id", id);

                                if (!error) {
                                    await fetchIncomes();
                                    setEditingIncome(null);
                                } else {
                                    console.error("Error al editar ingreso:", error);
                                }
                            }}
                            onCancel={() => setEditingIncome(null)}
                            accounts={accounts}
                            projects={projects}
                            income={editingIncome}
                        />
                    </DialogContent>
                </Dialog>
            )}

        </div>
    )
}
interface IncomeFormProps {
    income?: any;
    onSubmit: (income: any) => void;
    onCancel: () => void;
    accounts: { id: string; name: string }[];
    projects: { id: number; name: string }[];
}

function IncomeForm({ income, onSubmit, onCancel, accounts, projects }: IncomeFormProps) {
    const [formData, setFormData] = useState({
        id: income?.id || undefined,
        description: income?.description || "",
        amount: income?.amount?.toString() || "",
        date: income?.date || new Date().toISOString().split("T")[0],
        account_id: income?.account_id || "",
        project_id: income?.project_id?.toString() || "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.account_id || !formData.project_id) {
            alert("Seleccioná una cuenta y un proyecto.")
            return
        }

        onSubmit({
            ...formData,
            amount: Number(formData.amount),
            project_id: Number(formData.project_id),
        });

    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block mb-1">Descripción</label>
                <Input name="description" value={formData.description} onChange={handleChange} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block mb-1">Monto ($)</label>
                    <Input name="amount" type="number" value={formData.amount} onChange={handleChange} required />
                </div>
                <div>
                    <label className="block mb-1">Fecha</label>
                    <Input name="date" type="date" value={formData.date} onChange={handleChange} required />
                </div>
            </div>


            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block mb-1">Cuenta</label>
                    <Select value={formData.account_id} onValueChange={(v) => setFormData({ ...formData, account_id: v })}>
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccionar cuenta" />
                        </SelectTrigger>
                        <SelectContent>
                            {accounts.map((a) => (
                                <SelectItem key={a.id} value={a.id}>
                                    {a.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <label className="block mb-1">Proyecto</label>
                    <Select
                        value={formData.project_id}
                        onValueChange={(v) => setFormData({ ...formData, project_id: v })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccionar proyecto" />
                        </SelectTrigger>
                        <SelectContent>
                            {projects.map((p) => (
                                <SelectItem key={p.id} value={p.id.toString()}>
                                    {p.client} | {p.service}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancelar
                </Button>
                <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600">
                    Guardar
                </Button>
            </div>
        </form>
    )
}
