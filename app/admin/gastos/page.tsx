"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
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
import { useEffect } from "react"
import { supabase } from "@/lib/supabase"
// Mock data for expenses
const EXPENSES = [
  {
    id: 1,
    description: "Alquiler de oficina",
    category: "Servicios",
    amount: 80000,
    date: "2023-04-01",
    responsible: "María González",
  },
  {
    id: 2,
    description: "Pago a diseñador freelance",
    category: "Sueldos",
    amount: 45000,
    date: "2023-04-09",
    responsible: "Juan Pérez",
  },
  {
    id: 3,
    description: "Suscripción Adobe Creative Cloud",
    category: "Software",
    amount: 15000,
    date: "2023-04-14",
    responsible: "-",
  },
  {
    id: 4,
    description: "Impuestos municipales",
    category: "Impuestos",
    amount: 35000,
    date: "2023-04-15",
    responsible: "Laura Martínez",
  },
  {
    id: 5,
    description: "Materiales de oficina",
    category: "Otros",
    amount: 5000,
    date: "2023-04-05",
    responsible: "Carlos Rodríguez",
  },
]

// Categories
const CATEGORIES = ["Todas", "Servicios", "Sueldos", "Software", "Impuestos", "Otros"]

// Periods
const PERIODS = ["Este mes", "Mes anterior", "Últimos 3 meses", "Este año", "Personalizado"]

// Staff
const STAFF = [
  { id: 1, name: "María González" },
  { id: 2, name: "Juan Pérez" },
  { id: 3, name: "Laura Martínez" },
  { id: 4, name: "Carlos Rodríguez" },
  { id: 5, name: "Ana Silva" },
]

export default function GastosPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("Este mes")
  const [selectedCategory, setSelectedCategory] = useState("Todas")
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<any>(null)
  const [expenseToDelete, setExpenseToDelete] = useState<number | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [expenses, setExpenses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [accounts, setAccounts] = useState<{ id: string; name: string }[]>([])

  useEffect(() => {
    fetchExpenses()
  }, [])

  const fetchExpenses = async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from("expenses")
      .select("*, accounts(name)") // 👈 también trae nombre de cuenta
      .order("date", { ascending: false })

    if (!error) setExpenses(data)
    fetchAccounts() // 👈 también traemos cuentas

    setIsLoading(false)
  }
  // Filter expenses based on selected category
  const filteredExpenses =
    selectedCategory === "Todas" ? expenses : expenses.filter((expense) => expense.category === selectedCategory)

  // Calculate total expenses
  const totalExpenses = filteredExpenses.reduce((total, expense) => total + expense.amount, 0)

  // Calculate expenses by category for the pie chart
  const expensesByCategory = filteredExpenses.reduce((acc: Record<string, number>, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount
    return acc
  }, {})

  // Calculate percentages for the pie chart
  const categoryPercentages: Record<string, number> = {}
  Object.entries(expensesByCategory).forEach(([category, amount]) => {
    categoryPercentages[category] = Math.round((amount / totalExpenses) * 100)
  })

  const handleAddExpense = async (newExpense: any) => {
    const { error } = await supabase.from("expenses").insert([newExpense])
    if (error) {
      console.error("Error al guardar gasto:", error)
      return
    }

    await fetchExpenses()
    setIsAddExpenseOpen(false)
  }
  const fetchAccounts = async () => {
    const { data, error } = await supabase.from("accounts").select("id, name")
    if (!error && data) setAccounts(data)
  }


  const handleEditExpense = async (updatedExpense: any) => {
    const { error } = await supabase
      .from("expenses")
      .update({
        description: updatedExpense.description,
        category: updatedExpense.category,
        amount: updatedExpense.amount,
        date: updatedExpense.date,
        responsible: updatedExpense.responsible,
        account_id: updatedExpense.account_id,
      })
      .eq("id", updatedExpense.id)

    if (error) {
      console.error("Error al editar gasto:", error)
      return
    }

    await fetchExpenses()
    setEditingExpense(null)
  }


  const handleDeleteExpense = (id: number) => {
    setExpenseToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteExpense = async () => {
    if (!expenseToDelete) return

    const { error } = await supabase
      .from("expenses")
      .delete()
      .eq("id", expenseToDelete)

    if (error) {
      console.error("Error al eliminar gasto:", error)
      return
    }

    await fetchExpenses()
    setExpenseToDelete(null)
    setIsDeleteDialogOpen(false)
  }


  const cancelDeleteExpense = () => {
    setExpenseToDelete(null)
    setIsDeleteDialogOpen(false)
  }

  // Get category color for badges and chart
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Servicios":
        return "bg-emerald-500 text-white"
      case "Sueldos":
        return "bg-slate-900 text-white"
      case "Software":
        return "bg-emerald-300 text-slate-900"
      case "Impuestos":
        return "bg-blue-600 text-white"
      case "Otros":
        return "bg-sky-400 text-slate-900"
      default:
        return "bg-gray-200 text-gray-800"
    }
  }

  // Get category dot color for legend
  const getCategoryDotColor = (category: string) => {
    switch (category) {
      case "Servicios":
        return "bg-emerald-500"
      case "Sueldos":
        return "bg-slate-900"
      case "Software":
        return "bg-emerald-300"
      case "Impuestos":
        return "bg-blue-600"
      case "Otros":
        return "bg-sky-400"
      default:
        return "bg-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Gestión de Gastos</h1>
        <p className="text-muted-foreground">Administra los egresos de la agencia</p>
      </div>

      <div className="flex flex-wrap gap-4 justify-between items-center">
        <div className="flex flex-wrap gap-4">
          <div>
            <Label htmlFor="period" className="mb-1 block">
              Periodo
            </Label>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger id="period" className="w-[150px]">
                <SelectValue placeholder="Seleccionar periodo" />
              </SelectTrigger>
              <SelectContent>
                {PERIODS.map((period) => (
                  <SelectItem key={period} value={period}>
                    {period}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="category" className="mb-1 block">
              Categoría
            </Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger id="category" className="w-[150px]">
                <SelectValue placeholder="Seleccionar categoría" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Datos del 1 de abril al 8 de abril</span>
          <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-500 hover:bg-emerald-600">
                <Plus className="mr-2 h-4 w-4" />
                Agregar Gasto
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <ExpenseForm
                onSubmit={handleAddExpense}
                onCancel={() => setIsAddExpenseOpen(false)}
                categories={CATEGORIES.filter((c) => c !== "Todas")}
                staff={STAFF}
                accounts={accounts} // 👈 asumimos que ya las tenés disponibles
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Categoría</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Monto</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Cuenta</TableHead>

              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Cargando gastos...
                </TableCell>
              </TableRow>
            ) : (
              filteredExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>
                    <Badge className={`${getCategoryColor(expense.category)}`}>{expense.category}</Badge>
                  </TableCell>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell className="font-medium">$ {expense.amount.toLocaleString()},00</TableCell>
                  <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                  <TableCell>{expense.accounts?.name || "-"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => setEditingExpense(expense)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteExpense(expense.id)}
                        className="hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {editingExpense && (
        <Dialog open={!!editingExpense} onOpenChange={(open) => !open && setEditingExpense(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <ExpenseForm
              expense={editingExpense}
              onSubmit={handleEditExpense}
              onCancel={() => setEditingExpense(null)}
              categories={CATEGORIES.filter((c) => c !== "Todas")}
              staff={STAFF}
              accounts={accounts}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Confirmation Dialog for Delete */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente el gasto seleccionado y no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDeleteExpense}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteExpense} className="bg-red-600 hover:bg-red-700 text-white">
              Eliminar Gasto
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

interface ExpenseFormProps {
  expense?: any;
  onSubmit: (expense: any) => void;
  onCancel: () => void;
  categories: string[];
  staff: { id: number; name: string }[];
  accounts: { id: string; name: string }[]; // 👈 nueva prop
}


function ExpenseForm({ expense, accounts, onSubmit, onCancel, categories, staff }: ExpenseFormProps) {
  const [formData, setFormData] = useState({
    id: expense?.id || undefined,
    description: expense?.description || "",
    category: expense?.category || "",
    amount: expense?.amount || "",
    date: expense?.date || new Date().toISOString().split("T")[0],
    responsible: expense?.responsible || "",
    account_id: expense?.account_id || "", // 👈 nuevo
  });


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.account_id) {
      alert("Por favor, seleccioná una cuenta antes de guardar.")
      return
    }

    const { id, ...rest } = formData
    onSubmit({
      ...rest,
      amount: Number(formData.amount),
    })

  }


  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>{expense ? "Editar Gasto" : "Agregar Gasto"}</DialogTitle>
        <DialogDescription>Complete los datos del gasto. Haga clic en guardar cuando termine.</DialogDescription>
      </DialogHeader>
      <div className="space-y-2">
        <Label htmlFor="account_id">Cuenta</Label>
        <Select
          value={formData.account_id}
          onValueChange={(value) => setFormData({ ...formData, account_id: value })}
        >
          <SelectTrigger id="account_id">
            <SelectValue placeholder="Seleccionar cuenta" />
          </SelectTrigger>
          <SelectContent>
            {accounts.map((account) => (
              <SelectItem key={account.id} value={account.id}>
                {account.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="description">Descripción</Label>
          <Input id="description" name="description" value={formData.description} onChange={handleChange} required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Categoría</Label>
            <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Seleccionar categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Monto ($)</Label>
            <Input id="amount" name="amount" type="number" value={formData.amount} onChange={handleChange} required />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">Fecha</Label>
            <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} required />
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600">
          Guardar
        </Button>
      </DialogFooter>
    </form>
  )
}
