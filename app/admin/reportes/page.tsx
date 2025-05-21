"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Download } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Datos de ejemplo para los reportes
const REPORT_DATA = {
  ingresos: {
    total: 450000,
    porMes: [120000, 135000, 150000, 160000, 175000, 190000],
    porServicio: [
      { servicio: "Community Manager", monto: 150000 },
      { servicio: "Meta Ads", monto: 100000 },
      { servicio: "Desarrollo Web", monto: 120000 },
      { servicio: "Diseño Gráfico", monto: 80000 },
    ],
    porMetodoPago: [
      { metodo: "Transferencia", monto: 250000 },
      { metodo: "Efectivo", monto: 50000 },
      { metodo: "Tarjeta", monto: 100000 },
      { metodo: "MercadoPago", monto: 50000 },
    ],
    porCliente: [
      { cliente: "Empresa A", monto: 90000 },
      { cliente: "Empresa B", monto: 75000 },
      { cliente: "Empresa C", monto: 55000 },
      { cliente: "Empresa D", monto: 120000 },
      { cliente: "Empresa E", monto: 110000 },
    ],
    porColaborador: [
      { colaborador: "Juan Pérez", servicios: 8, ingresos: 120000, rendimiento: 95 },
      { colaborador: "María López", servicios: 6, ingresos: 90000, rendimiento: 92 },
      { colaborador: "Carlos Rodríguez", servicios: 5, ingresos: 75000, rendimiento: 88 },
      { colaborador: "Ana Martínez", servicios: 7, ingresos: 105000, rendimiento: 90 },
      { colaborador: "Diego Sánchez", servicios: 4, ingresos: 60000, rendimiento: 85 },
    ],
  },
  gastos: {
    total: 180000,
    porMes: [45000, 50000, 55000, 60000, 65000, 70000],
    porCategoria: [
      { categoria: "Sueldos", monto: 100000 },
      { categoria: "Servicios", monto: 30000 },
      { categoria: "Publicidad", monto: 25000 },
      { categoria: "Otros", monto: 25000 },
    ],
    porMetodoPago: [
      { metodo: "Transferencia", monto: 120000 },
      { metodo: "Efectivo", monto: 30000 },
      { metodo: "Tarjeta", monto: 30000 },
    ],
  },
  balance: {
    total: 270000,
    porMes: [75000, 85000, 95000, 100000, 110000, 120000],
  },
}

export default function ReportesPage() {
  const [dateRange, setDateRange] = useState({
    from: new Date(2023, 0, 1),
    to: new Date(),
  })
  const [reportType, setReportType] = useState("ingresos")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-secondary dark:text-gray-200">Reportes Financieros</h1>
        <p className="text-muted-foreground">Visualiza y exporta reportes financieros de tu empresa</p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="w-full md:w-auto">
          <div className="text-sm font-medium mb-1">Período de reporte</div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full md:w-[300px] justify-start text-left font-normal",
                  !dateRange && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "dd/MM/yyyy", { locale: es })} -{" "}
                      {format(dateRange.to, "dd/MM/yyyy", { locale: es })}
                    </>
                  ) : (
                    format(dateRange.from, "dd/MM/yyyy", { locale: es })
                  )
                ) : (
                  <span>Seleccionar período</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
                locale={es}
              />
            </PopoverContent>
          </Popover>
        </div>
        <Button variant="outline" className="w-full md:w-auto">
          <Download className="mr-2 h-4 w-4" /> Exportar Reporte
        </Button>
      </div>

      <Tabs defaultValue="ingresos" onValueChange={setReportType}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="ingresos">Ingresos</TabsTrigger>
          <TabsTrigger value="gastos">Gastos</TabsTrigger>
          <TabsTrigger value="balance">Balance</TabsTrigger>
        </TabsList>

        <TabsContent value="ingresos" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$ {REPORT_DATA.ingresos.total.toLocaleString("es-AR")}</div>
                <p className="text-xs text-muted-foreground">+12% respecto al período anterior</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Clientes Activos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">15</div>
                <p className="text-xs text-muted-foreground">+2 nuevos clientes</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Servicios Activos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">28</div>
                <p className="text-xs text-muted-foreground">+3 nuevos servicios</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Ingresos por Servicio</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Servicio</TableHead>
                      <TableHead className="text-right">Monto</TableHead>
                      <TableHead className="text-right">%</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {REPORT_DATA.ingresos.porServicio.map((item) => (
                      <TableRow key={item.servicio}>
                        <TableCell>{item.servicio}</TableCell>
                        <TableCell className="text-right">$ {item.monto.toLocaleString("es-AR")}</TableCell>
                        <TableCell className="text-right">
                          {((item.monto / REPORT_DATA.ingresos.total) * 100).toFixed(1)}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance por Colaborador</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Colaborador</TableHead>
                      <TableHead className="text-center">Servicios</TableHead>
                      <TableHead className="text-right">Ingresos</TableHead>
                      <TableHead className="text-center">Rendimiento</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {REPORT_DATA.ingresos.porColaborador.map((item) => (
                      <TableRow key={item.colaborador}>
                        <TableCell>{item.colaborador}</TableCell>
                        <TableCell className="text-center">{item.servicios}</TableCell>
                        <TableCell className="text-right">$ {item.ingresos.toLocaleString("es-AR")}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center">
                            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mr-2 max-w-24">
                              <div
                                className="bg-green-600 h-2.5 rounded-full"
                                style={{ width: `${item.rendimiento}%` }}
                              ></div>
                            </div>
                            <span>{item.rendimiento}%</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Nueva sección: Ingresos por Método de Pago */}
          <Card>
            <CardHeader>
              <CardTitle>Ingresos por Método de Pago</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Método de Pago</TableHead>
                        <TableHead className="text-right">Monto</TableHead>
                        <TableHead className="text-right">%</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {REPORT_DATA.ingresos.porMetodoPago.map((item) => (
                        <TableRow key={item.metodo}>
                          <TableCell>{item.metodo}</TableCell>
                          <TableCell className="text-right">$ {item.monto.toLocaleString("es-AR")}</TableCell>
                          <TableCell className="text-right">
                            {((item.monto / REPORT_DATA.ingresos.total) * 100).toFixed(1)}%
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex items-center justify-center">
                  <div className="w-full max-w-xs">
                    <PieChart data={REPORT_DATA.ingresos.porMetodoPago} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gastos" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Gastos Totales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$ {REPORT_DATA.gastos.total.toLocaleString("es-AR")}</div>
                <p className="text-xs text-muted-foreground">+8% respecto al período anterior</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Categorías de Gastos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{REPORT_DATA.gastos.porCategoria.length}</div>
                <p className="text-xs text-muted-foreground">Sin cambios</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Gasto Mensual Promedio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  $ {(REPORT_DATA.gastos.total / REPORT_DATA.gastos.porMes.length).toLocaleString("es-AR")}
                </div>
                <p className="text-xs text-muted-foreground">+5% respecto al período anterior</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">% de Ingresos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {((REPORT_DATA.gastos.total / REPORT_DATA.ingresos.total) * 100).toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">-2% respecto al período anterior</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Gastos por Categoría</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Categoría</TableHead>
                      <TableHead className="text-right">Monto</TableHead>
                      <TableHead className="text-right">%</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {REPORT_DATA.gastos.porCategoria.map((item) => (
                      <TableRow key={item.categoria}>
                        <TableCell>{item.categoria}</TableCell>
                        <TableCell className="text-right">$ {item.monto.toLocaleString("es-AR")}</TableCell>
                        <TableCell className="text-right">
                          {((item.monto / REPORT_DATA.gastos.total) * 100).toFixed(1)}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Nueva sección: Gastos por Método de Pago */}
            <Card>
              <CardHeader>
                <CardTitle>Gastos por Método de Pago</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Método de Pago</TableHead>
                          <TableHead className="text-right">Monto</TableHead>
                          <TableHead className="text-right">%</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {REPORT_DATA.gastos.porMetodoPago.map((item) => (
                          <TableRow key={item.metodo}>
                            <TableCell>{item.metodo}</TableCell>
                            <TableCell className="text-right">$ {item.monto.toLocaleString("es-AR")}</TableCell>
                            <TableCell className="text-right">
                              {((item.monto / REPORT_DATA.gastos.total) * 100).toFixed(1)}%
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="w-full max-w-xs">
                      <PieChart data={REPORT_DATA.gastos.porMetodoPago} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="balance" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Balance Total</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$ {REPORT_DATA.balance.total.toLocaleString("es-AR")}</div>
                <p className="text-xs text-muted-foreground">+15% respecto al período anterior</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$ {REPORT_DATA.ingresos.total.toLocaleString("es-AR")}</div>
                <p className="text-xs text-muted-foreground">+12% respecto al período anterior</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Gastos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$ {REPORT_DATA.gastos.total.toLocaleString("es-AR")}</div>
                <p className="text-xs text-muted-foreground">+8% respecto al período anterior</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Margen</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {((REPORT_DATA.balance.total / REPORT_DATA.ingresos.total) * 100).toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">+3% respecto al período anterior</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Resumen de Métodos de Pago</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Método de Pago</TableHead>
                    <TableHead className="text-right">Ingresos</TableHead>
                    <TableHead className="text-right">Gastos</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Combinar datos de ingresos y gastos por método de pago */}
                  {REPORT_DATA.ingresos.porMetodoPago.map((item) => {
                    const gastoMetodo = REPORT_DATA.gastos.porMetodoPago.find((g) => g.metodo === item.metodo) || {
                      monto: 0,
                    }
                    const balance = item.monto - gastoMetodo.monto
                    return (
                      <TableRow key={item.metodo}>
                        <TableCell>{item.metodo}</TableCell>
                        <TableCell className="text-right">$ {item.monto.toLocaleString("es-AR")}</TableCell>
                        <TableCell className="text-right">$ {gastoMetodo.monto.toLocaleString("es-AR")}</TableCell>
                        <TableCell className="text-right">$ {balance.toLocaleString("es-AR")}</TableCell>
                      </TableRow>
                    )
                  })}
                  {/* Agregar métodos que solo están en gastos */}
                  {REPORT_DATA.gastos.porMetodoPago
                    .filter(
                      (gastoMetodo) => !REPORT_DATA.ingresos.porMetodoPago.some((i) => i.metodo === gastoMetodo.metodo),
                    )
                    .map((gastoMetodo) => (
                      <TableRow key={gastoMetodo.metodo}>
                        <TableCell>{gastoMetodo.metodo}</TableCell>
                        <TableCell className="text-right">$ 0</TableCell>
                        <TableCell className="text-right">$ {gastoMetodo.monto.toLocaleString("es-AR")}</TableCell>
                        <TableCell className="text-right">$ {(-gastoMetodo.monto).toLocaleString("es-AR")}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Componente para el gráfico de torta
function PieChart({ data }) {
  // Colores para cada segmento del gráfico
  const colors = ["#00D1A1", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"]

  // Calcular el total
  const total = data.reduce((sum, item) => sum + item.monto, 0)

  // Calcular ángulos para cada segmento
  let startAngle = 0
  const segments = data.map((item, index) => {
    const percentage = item.monto / total
    const angle = percentage * 360
    const segment = {
      color: colors[index % colors.length],
      startAngle,
      endAngle: startAngle + angle,
      percentage,
      label: item.metodo || item.categoria,
      value: item.monto,
    }
    startAngle += angle
    return segment
  })

  return (
    <div className="relative w-full aspect-square">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="50" r="40" fill="transparent" stroke="#e2e8f0" strokeWidth="1" />
        {segments.map((segment, index) => {
          // Convertir ángulos a radianes
          const startRad = (segment.startAngle * Math.PI) / 180
          const endRad = (segment.endAngle * Math.PI) / 180

          // Calcular puntos de inicio y fin del arco
          const x1 = 50 + 40 * Math.cos(startRad)
          const y1 = 50 + 40 * Math.sin(startRad)
          const x2 = 50 + 40 * Math.cos(endRad)
          const y2 = 50 + 40 * Math.sin(endRad)

          // Determinar si el arco es mayor a 180 grados
          const largeArcFlag = segment.endAngle - segment.startAngle > 180 ? 1 : 0

          // Crear el path para el arco
          const path = [`M 50 50`, `L ${x1} ${y1}`, `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`, `Z`].join(" ")

          return <path key={index} d={path} fill={segment.color} />
        })}
      </svg>

      {/* Leyenda */}
      <div className="absolute top-full mt-4 w-full">
        <div className="grid grid-cols-2 gap-2">
          {segments.map((segment, index) => (
            <div key={index} className="flex items-center text-xs">
              <div className="w-3 h-3 mr-1 rounded-sm" style={{ backgroundColor: segment.color }}></div>
              <span className="truncate">{segment.label}</span>
              <span className="ml-1 font-medium">{(segment.percentage * 100).toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
