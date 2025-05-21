"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { DollarSign, CreditCard, ArrowUpRight, CalendarIcon, Gift } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, addYears, isToday, differenceInDays, isBefore } from "date-fns"
import { es } from "date-fns/locale"
import { useRouter } from "next/navigation"

// Agregar datos de ejemplo para colaboradores con fechas de nacimiento
const STAFF = [
  {
    id: 1,
    name: "Ana García",
    position: "Diseñador UX/UI",
    email: "ana.garcia@piriadigital.com",
    birthDate: new Date("1990-04-15"),
  },
  {
    id: 2,
    name: "Carlos Rodríguez",
    position: "Desarrollador Frontend",
    email: "carlos.rodriguez@piriadigital.com",
    birthDate: new Date("1985-05-22"),
  },
  {
    id: 3,
    name: "Laura Martínez",
    position: "Community Manager",
    email: "laura.martinez@piriadigital.com",
    birthDate: new Date("1992-06-10"),
  },
  {
    id: 4,
    name: "Miguel López",
    position: "Diseñador Gráfico",
    email: "miguel.lopez@piriadigital.com",
    birthDate: new Date("1988-04-30"),
  },
]

// Agregar datos de ejemplo para clientes con fechas de nacimiento
const CLIENTS = [
  {
    id: 1,
    name: "Juan Pérez",
    company: "Empresa A",
    birthDate: new Date("1985-04-20"),
  },
  {
    id: 2,
    name: "María González",
    company: "Empresa B",
    birthDate: new Date("1990-05-05"),
  },
  {
    id: 3,
    name: "Roberto Sánchez",
    company: "Empresa C",
    birthDate: new Date("1978-06-15"),
  },
]

// Función para obtener los próximos cumpleaños
const getUpcomingBirthdays = (people, daysAhead = 30) => {
  const today = new Date()
  const currentYear = today.getFullYear()

  return people
    .filter((person) => person.birthDate)
    .map((person) => {
      const birthDate = new Date(person.birthDate)
      // Ajustar al año actual
      let nextBirthday = new Date(birthDate)
      nextBirthday.setFullYear(currentYear)

      // Si el cumpleaños ya pasó este año, ajustar al próximo año
      if (isBefore(nextBirthday, today)) {
        nextBirthday = addYears(nextBirthday, 1)
      }

      const daysUntil = differenceInDays(nextBirthday, today)
      const isBirthdayToday = isToday(nextBirthday)

      return {
        ...person,
        nextBirthday,
        daysUntil,
        isBirthdayToday,
      }
    })
    .filter((person) => person.daysUntil <= daysAhead)
    .sort((a, b) => a.daysUntil - b.daysUntil)
}

export default function AdminDashboard() {
  const [period, setPeriod] = useState("month")
  const [activeTab, setActiveTab] = useState("bars")
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  })

  const upcomingStaffBirthdays = getUpcomingBirthdays(STAFF)
  const upcomingClientBirthdays = getUpcomingBirthdays(CLIENTS)

  // Datos de ejemplo para el gráfico
  const chartData = {
    months: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
    income: [120000, 135000, 150000, 160000, 175000, 190000],
    expenses: [45000, 50000, 55000, 60000, 65000, 70000],
    balance: [75000, 85000, 95000, 100000, 110000, 120000],
    recurring: [15000, 15000, 15000, 15000, 15000, 15000],
  }

  // Datos de actividad reciente
  const recentActivity = [
    {
      id: 1,
      type: "client",
      user: "Flor",
      date: "10 de abril, 2023 11:30",
      content: "Cliente Ejemplo: Cliente creado y asignado a Nahue y Carla",
      avatar: "F",
    },
    {
      id: 2,
      type: "service",
      user: "Flor",
      date: "10 de abril, 2023 11:35",
      content: "Community Manager: Servicio asignado a Nahue",
      avatar: "F",
    },
    {
      id: 3,
      type: "task",
      user: "Flor",
      date: "10 de abril, 2023 12:00",
      content: "Redactar copies para posts: Tarea creada y asignada a Nahue",
      avatar: "F",
    },
    {
      id: 4,
      type: "status",
      user: "Nahue",
      date: "11 de abril, 2023 07:15",
      content: "Redactar copies para posts: Estado cambiado a En Proceso",
      avatar: "N",
    },
    {
      id: 5,
      type: "comment",
      user: "Nahue",
      date: "11 de abril, 2023 07:20",
      content: "Redactar copies para posts: Comentario: Necesito más información sobre el tono de voz a utilizar",
      avatar: "N",
    },
  ]

  // Datos de métodos de pago
  const paymentMethods = [
    { method: "Transferencia", amount: 250000, percentage: 55.6, trend: "+12%" },
    { method: "Efectivo", amount: 50000, percentage: 11.1, trend: "-5%" },
    { method: "Tarjeta", amount: 100000, percentage: 22.2, trend: "+8%" },
    { method: "MercadoPago", amount: 50000, percentage: 11.1, trend: "+15%" },
  ]

  const router = useRouter()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-secondary dark:text-gray-200">Dashboard</h1>
        <p className="text-muted-foreground">Resumen general de la empresa</p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="w-full md:w-auto">
          <div className="text-sm font-medium mb-1">Período de evaluación</div>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Seleccionar período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Este mes</SelectItem>
              <SelectItem value="quarter">Este trimestre</SelectItem>
              <SelectItem value="year">Este año</SelectItem>
              <SelectItem value="custom">Personalizado</SelectItem>
            </SelectContent>
          </Select>

          {period === "custom" && (
            <div className="mt-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "dd/MM/yyyy", { locale: es })} -{" "}
                          {format(dateRange.to, "dd/MM/yyyy", { locale: es })}
                        </>
                      ) : (
                        format(dateRange.from, "dd/MM/yyyy", { locale: es })
                      )
                    ) : (
                      <span>Seleccionar fechas</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange.from}
                    selected={dateRange}
                    onSelect={(range) => {
                      if (range?.from && range?.to) {
                        setDateRange(range)
                      }
                    }}
                    numberOfMonths={2}
                    locale={es}
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
        <div className="text-sm text-muted-foreground">
          {period === "custom" && dateRange.from && dateRange.to
            ? `Datos del ${format(dateRange.from, "d 'de' MMMM", { locale: es })} al ${format(dateRange.to, "d 'de' MMMM", { locale: es })}`
            : "Datos del 8 de marzo al 7 de abril"}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Ingreso Total"
          value="$120,000"
          subtitle="Ingresos acumulados"
          icon={<DollarSign className="h-4 w-4 text-primary" />}
          color="text-primary"
        />
        <MetricCard
          title="Egreso Total"
          value="$45,000"
          subtitle="Gastos acumulados"
          icon={<CreditCard className="h-4 w-4 text-primary" />}
          color="text-primary"
        />
        <MetricCard
          title="Saldo en Caja"
          value="$75,000"
          subtitle="Balance actual"
          icon={<DollarSign className="h-4 w-4 text-primary" />}
          color="text-primary"
        />
        <MetricCard
          title="Ingreso Mensual Activo"
          value="$15,000"
          subtitle="Ingresos recurrentes"
          icon={<DollarSign className="h-4 w-4 text-primary" />}
          color="text-primary"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card className="border-primary/20 dark:border-gray-700">
            <CardHeader className="pb-2">
              <div className="flex flex-col space-y-1.5">
                <CardTitle className="text-secondary dark:text-gray-200">Resumen Financiero</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Visualización de ingresos, egresos, caja y mensualidad activa
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="bg-gray-100 dark:bg-gray-800 w-auto inline-flex">
                    <TabsTrigger value="bars" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                      Gráfico de Barras
                    </TabsTrigger>
                    <TabsTrigger value="pie" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                      Gráfico de Torta
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="h-[350px] w-full">
                {activeTab === "bars" ? (
                  <BarChart data={chartData} />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">Gráfico de torta (visualización no disponible)</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-6 gap-2 mt-4">
                {chartData.months.map((month) => (
                  <div key={month} className="text-center text-sm font-medium">
                    {month}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="border-primary/20 dark:border-gray-700 h-full">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-secondary dark:text-gray-200">Actividad Reciente</CardTitle>
              <Button variant="link" size="sm" className="text-primary" onClick={() => router.push("/admin/actividad")}>
                Ver todas
              </Button>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all">
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger value="all" className="text-xs">
                    Todas
                  </TabsTrigger>
                  <TabsTrigger value="clients" className="text-xs">
                    Clientes
                  </TabsTrigger>
                  <TabsTrigger value="tasks" className="text-xs">
                    Tareas
                  </TabsTrigger>
                  <TabsTrigger value="comments" className="text-xs">
                    Comentarios
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="m-0">
                  <div className="space-y-4 max-h-[280px] overflow-y-auto pr-2">
                    {recentActivity.map((activity) => (
                      <ActivityItem key={activity.id} activity={activity} />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="clients" className="m-0">
                  <div className="space-y-4 max-h-[280px] overflow-y-auto pr-2">
                    {recentActivity
                      .filter((activity) => activity.type === "client")
                      .map((activity) => (
                        <ActivityItem key={activity.id} activity={activity} />
                      ))}
                  </div>
                </TabsContent>

                <TabsContent value="tasks" className="m-0">
                  <div className="space-y-4 max-h-[280px] overflow-y-auto pr-2">
                    {recentActivity
                      .filter((activity) => activity.type === "task" || activity.type === "status")
                      .map((activity) => (
                        <ActivityItem key={activity.id} activity={activity} />
                      ))}
                  </div>
                </TabsContent>

                <TabsContent value="comments" className="m-0">
                  <div className="space-y-4 max-h-[280px] overflow-y-auto pr-2">
                    {recentActivity
                      .filter((activity) => activity.type === "comment")
                      .map((activity) => (
                        <ActivityItem key={activity.id} activity={activity} />
                      ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Nueva sección: Resumen por Método de Pago */}
      <Card className="border-primary/20 dark:border-gray-700">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-secondary dark:text-gray-200">Resumen por Método de Pago</CardTitle>
            <Button variant="link" size="sm" className="text-primary" onClick={() => router.push("/admin/reportes")}>
              Ver reporte completo
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">Distribución de ingresos por método de pago</p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            {paymentMethods.map((method) => (
              <Card key={method.method} className="bg-gray-50 dark:bg-gray-800 border-0">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium">{method.method}</div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs",
                        method.trend.startsWith("+")
                          ? "bg-green-50 text-green-600 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                          : "bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
                      )}
                    >
                      {method.trend} <ArrowUpRight className="h-3 w-3 ml-1" />
                    </Badge>
                  </div>
                  <div className="text-xl font-bold">$ {method.amount.toLocaleString("es-AR")}</div>
                  <div className="text-sm text-muted-foreground">{method.percentage}% del total</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 mt-6">
        {/* Cumpleaños de Colaboradores */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Próximos Cumpleaños - Colaboradores</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingStaffBirthdays.length > 0 ? (
              <div className="space-y-4">
                {upcomingStaffBirthdays.map((staff) => (
                  <div key={staff.id} className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${staff.isBirthdayToday ? "bg-pink-100" : "bg-gray-100"}`}>
                      <Gift className={`h-5 w-5 ${staff.isBirthdayToday ? "text-pink-500" : "text-gray-500"}`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{staff.name}</p>
                      <p className="text-sm text-muted-foreground">{staff.position}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${staff.isBirthdayToday ? "text-pink-500" : ""}`}>
                        {staff.isBirthdayToday ? "Hoy" : `En ${staff.daysUntil} días`}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(staff.nextBirthday, "d 'de' MMMM", { locale: es })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">No hay cumpleaños próximos</p>
            )}
          </CardContent>
        </Card>

        {/* Cumpleaños de Clientes */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Próximos Cumpleaños - Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingClientBirthdays.length > 0 ? (
              <div className="space-y-4">
                {upcomingClientBirthdays.map((client) => (
                  <div key={client.id} className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${client.isBirthdayToday ? "bg-pink-100" : "bg-gray-100"}`}>
                      <Gift className={`h-5 w-5 ${client.isBirthdayToday ? "text-pink-500" : "text-gray-500"}`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{client.name}</p>
                      <p className="text-sm text-muted-foreground">{client.company}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${client.isBirthdayToday ? "text-pink-500" : ""}`}>
                        {client.isBirthdayToday ? "Hoy" : `En ${client.daysUntil} días`}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(client.nextBirthday, "d 'de' MMMM", { locale: es })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">No hay cumpleaños próximos</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Componente para las tarjetas de métricas
function MetricCard({ title, value, subtitle, icon, color }) {
  return (
    <Card className="border-primary/20 dark:border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </CardContent>
    </Card>
  )
}

// Componente para los elementos de actividad
function ActivityItem({ activity }) {
  const getActivityIcon = (type) => {
    switch (type) {
      case "client":
        return <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-2 rounded-full" />
      case "service":
        return (
          <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 p-2 rounded-full" />
        )
      case "task":
        return <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-2 rounded-full" />
      case "status":
        return (
          <div className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 p-2 rounded-full" />
        )
      case "comment":
        return (
          <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 p-2 rounded-full" />
        )
      default:
        return <div className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 p-2 rounded-full" />
    }
  }

  return (
    <div className="flex items-start space-x-3">
      <Avatar className="h-8 w-8 bg-primary text-white">
        <AvatarFallback>{activity.avatar}</AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">{activity.user}</p>
          <span className="text-xs text-muted-foreground">{activity.date}</span>
        </div>
        <p className="text-sm text-muted-foreground">{activity.content}</p>
      </div>
    </div>
  )
}

// Componente para el gráfico de barras
function BarChart({ data }) {
  const maxValue = Math.max(...data.income) * 1.1 // 10% más alto que el valor máximo

  return (
    <div className="relative h-full w-full">
      {/* Eje Y - Valores */}
      <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-muted-foreground">
        <div>$200,000</div>
        <div>$150,000</div>
        <div>$100,000</div>
        <div>$50,000</div>
        <div>$0</div>
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
        <div className="absolute inset-0 flex justify-between items-end">
          {data.months.map((month, index) => (
            <div key={month} className="flex-1 flex justify-center items-end space-x-1">
              {/* Barra de ingresos */}
              <div
                className="w-4 bg-primary"
                style={{
                  height: `${(data.income[index] / maxValue) * 100}%`,
                }}
              ></div>

              {/* Barra de gastos */}
              <div
                className="w-4 bg-gray-700 dark:bg-gray-500"
                style={{
                  height: `${(data.expenses[index] / maxValue) * 100}%`,
                }}
              ></div>

              {/* Barra de balance */}
              <div
                className="w-4 bg-primary/40"
                style={{
                  height: `${(data.balance[index] / maxValue) * 100}%`,
                }}
              ></div>

              {/* Barra de ingresos recurrentes */}
              <div
                className="w-4 bg-blue-300 dark:bg-blue-700"
                style={{
                  height: `${(data.recurring[index] / maxValue) * 100}%`,
                }}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
