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
  const [expenses, setExpenses] = useState(EXPENSES)
  const [selectedPeriod, setSelectedPeriod] = useState("Este mes")
  const [selectedCategory, setSelectedCategory] = useState("Todas")
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<any>(null)
  const [expenseToDelete, setExpenseToDelete] = useState<number | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

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

  const handleAddExpense = (newExpense: any) => {
    setExpenses([...expenses, { ...newExpense, id: expenses.length + 1 }])
    setIsAddExpenseOpen(false)
  }

  const handleEditExpense = (updatedExpense: any) => {
    setExpenses(expenses.map((expense) => (expense.id === updatedExpense.id ? updatedExpense : expense)))
    setEditingExpense(null)
  }

  const handleDeleteExpense = (id: number) => {
    setExpenseToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteExpense = () => {
    if (expenseToDelete) {
      setExpenses(expenses.filter((expense) => expense.id !== expenseToDelete))
      setExpenseToDelete(null)
      setIsDeleteDialogOpen(false)
    }
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
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Resumen de Gastos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative h-60 w-full">
              {/* Pie chart visualization */}
              <div className="flex justify-center">
                <div className="relative w-48 h-48">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    {/* Colored pie segments */}
                    <circle cx="50" cy="50" r="40" fill="white" />

                    {/* Servicios - 44% */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#10b981"
                      strokeWidth="20"
                      strokeDasharray={`${0.44 * 251.2} ${251.2 - 0.44 * 251.2}`}
                      strokeDashoffset="0"
                      transform="rotate(-90 50 50)"
                    />

                    {/* Sueldos - 25% */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#0f172a"
                      strokeWidth="20"
                      strokeDasharray={`${0.25 * 251.2} ${251.2 - 0.25 * 251.2}`}
                      strokeDashoffset={`${-(0.44 * 251.2)}`}
                      transform="rotate(-90 50 50)"
                    />

                    {/* Software - 8% */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#6ee7b7"
                      strokeWidth="20"
                      strokeDasharray={`${0.08 * 251.2} ${251.2 - 0.08 * 251.2}`}
                      strokeDashoffset={`${-((0.44 + 0.25) * 251.2)}`}
                      transform="rotate(-90 50 50)"
                    />

                    {/* Impuestos - 19% */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#2563eb"
                      strokeWidth="20"
                      strokeDasharray={`${0.19 * 251.2} ${251.2 - 0.19 * 251.2}`}
                      strokeDashoffset={`${-((0.44 + 0.25 + 0.08) * 251.2)}`}
                      transform="rotate(-90 50 50)"
                    />

                    {/* Otros - 3% */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#38bdf8"
                      strokeWidth="20"
                      strokeDasharray={`${0.03 * 251.2} ${251.2 - 0.03 * 251.2}`}
                      strokeDashoffset={`${-((0.44 + 0.25 + 0.08 + 0.19) * 251.2)}`}
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                </div>
              </div>

              {/* Legend with percentages */}
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-sm">Servicios: 44%</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-slate-900"></div>
                  <span className="text-sm">Sueldos: 25%</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-emerald-300"></div>
                  <span className="text-sm">Software: 8%</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                  <span className="text-sm">Impuestos: 19%</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-sky-400"></div>
                  <span className="text-sm">Otros: 3%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Desglose por Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(expensesByCategory).map(([category, amount]) => (
                <div key={category} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getCategoryDotColor(category)}`}></div>
                    <span>{category}</span>
                  </div>
                  <span className="font-medium">$ {amount.toLocaleString()},00</span>
                </div>
              ))}
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center font-bold">
                  <span>Total</span>
                  <span>$ {totalExpenses.toLocaleString()},00</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Categoría</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Monto</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Administrador</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredExpenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>
                  <Badge className={`${getCategoryColor(expense.category)}`}>{expense.category}</Badge>
                </TableCell>
                <TableCell>{expense.description}</TableCell>
                <TableCell className="font-medium">$ {expense.amount.toLocaleString()},00</TableCell>
                <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                <TableCell>{expense.responsible}</TableCell>
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
            ))}
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
  expense?: any
  onSubmit: (expense: any) => void
  onCancel: () => void
  categories: string[]
  staff: { id: number; name: string }[]
}

function ExpenseForm({ expense, onSubmit, onCancel, categories, staff }: ExpenseFormProps) {
  const [formData, setFormData] = useState({
    id: expense?.id || 0,
    description: expense?.description || "",
    category: expense?.category || "",
    amount: expense?.amount || "",
    date: expense?.date || new Date().toISOString().split("T")[0],
    responsible: expense?.responsible || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      amount: Number(formData.amount),
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>{expense ? "Editar Gasto" : "Agregar Gasto"}</DialogTitle>
        <DialogDescription>Complete los datos del gasto. Haga clic en guardar cuando termine.</DialogDescription>
      </DialogHeader>

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
          <div className="space-y-2">
            <Label htmlFor="responsible">Administrador</Label>
            <Select value={formData.responsible} onValueChange={(value) => handleSelectChange("responsible", value)}>
              <SelectTrigger id="responsible">
                <SelectValue placeholder="Seleccionar administrador" />
              </SelectTrigger>
              <SelectContent>
                {staff.map((person) => (
                  <SelectItem key={person.id} value={person.name}>
                    {person.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
