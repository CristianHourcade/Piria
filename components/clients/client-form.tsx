
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { Client } from "@/types/client-types"
import { calculateTotal } from "@/utils/client-utils"

interface ClientFormProps {
  client?: Client
  onSubmit: (client: Partial<Client>) => void
  onCancel: () => void
}

export function ClientForm({ client, onSubmit, onCancel }: ClientFormProps) {
  const [formData, setFormData] = useState<Partial<Client>>({
    ...(client?.id ? { id: client.id } : {}),
    name: client?.name || "",
    company: client?.company || "",
    email: client?.email || "",
    phone: client?.phone || "",
    instagramLink: client?.instagramLink || "",
    facebookLink: client?.facebookLink || "",
    websiteLink: client?.websiteLink || "",
    canvaLink: client?.canvaLink || "",
    driveLink: client?.driveLink || "",
    paymentStatus: client?.paymentStatus || "Pendiente",
    condicionFiscal: client?.condicionFiscal || "",
    cuil: client?.cuil || "",
    billingCycle: client?.billingCycle || "",
    paymentMethod: client?.paymentMethod || "",
    paymentStatus: client?.paymentStatus || "",
    renewalType: client?.renewalType || "",
    comments: client?.comments || "",
    services: client?.services || [],
    total: client?.total || 0,
    status: client?.status || "Activo"
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "paymentDay" ? (value === "" ? null : Number(value)) : value,
    }));
  };


  const handleSubmit = (e: any) => {
    e.preventDefault()
    const total = calculateTotal(formData.services || [])
    onSubmit({ ...formData, total })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-4">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-white">Información del Cliente</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div><Label>Nombre</Label><Input name="name" value={formData.name} onChange={handleChange} /></div>
          <div><Label>Empresa</Label><Input name="company" value={formData.company} onChange={handleChange} /></div>
          <div><Label>Email</Label><Input name="email" value={formData.email} onChange={handleChange} /></div>
          <div><Label>Teléfono</Label><Input name="phone" value={formData.phone} onChange={handleChange} /></div>
          <div><Label>Instagram</Label><Input name="instagramLink" value={formData.instagramLink} onChange={handleChange} /></div>
          <div><Label>Facebook</Label><Input name="facebookLink" value={formData.facebookLink} onChange={handleChange} /></div>
          <div><Label>Sitio Web</Label><Input name="websiteLink" value={formData.websiteLink} onChange={handleChange} /></div>
          <div><Label>Canva</Label><Input name="canvaLink" value={formData.canvaLink} onChange={handleChange} /></div>
          <div><Label>Drive</Label><Input name="driveLink" value={formData.driveLink} onChange={handleChange} /></div>
        </div>
      </div>

      <div className="grid gap-4">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-white">Información de Facturación</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div><Label>Condición Fiscal</Label><Input name="condicionFiscal" value={formData.condicionFiscal} onChange={handleChange} /></div>
          <div><Label>CUIL</Label><Input name="cuil" value={formData.cuil} onChange={handleChange} /></div>
        </div>
      </div>

      <div>
        <Label>Comentarios</Label>
        <Textarea name="comments" value={formData.comments} onChange={handleChange} rows={4} />
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" className="bg-[#00D1A1] hover:bg-[#00B38A]">Guardar Cliente</Button>
      </div>
    </form>
  )
}
