"use client";

import { useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";



const ACCOUNT_TYPES = ["CBU", "CVU", "Prex", "PayPal", "Otro"];
const STATUSES = ["Activa", "Inactiva"];

export default function CuentasPage() {
    const [accounts, setAccounts] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingAccount, setEditingAccount] = useState(null);

    const handleSubmit = async (accountData) => {
        if (editingAccount) {
            const { error } = await supabase
                .from("accounts")
                .update({
                    name: accountData.name,
                    type: accountData.type,
                    detail: accountData.detail,
                    status: accountData.status,
                })
                .eq("id", accountData.id);

            if (!error) fetchAccounts();
        } else {
            const { error } = await supabase.from("accounts").insert([
                {
                    name: accountData.name,
                    type: accountData.type,
                    detail: accountData.detail,
                    status: accountData.status,
                },
            ]);

            if (!error) fetchAccounts();
        }

        setEditingAccount(null);
        setIsDialogOpen(false);
    };


    const handleDelete = async (id) => {
        const { error } = await supabase.from("accounts").delete().eq("id", id);
        if (!error) fetchAccounts();
    };

    const fetchAccounts = async () => {
        const { data, error } = await supabase.from("accounts").select("*").order("created_at", { ascending: false });
        if (error) {
            console.error("Error al traer cuentas:", error);
        } else {
            setAccounts(data);
        }
    };
    useEffect(() => {
        fetchAccounts();
    }, []);
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Cuentas de Cobro</h1>
                    <p className="text-muted-foreground">Gestioná tus cuentas bancarias o virtuales</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-emerald-500 hover:bg-emerald-600">
                            <Plus className="mr-2 h-4 w-4" />
                            Nueva Cuenta
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                        <CuentaForm
                            account={editingAccount}
                            onSubmit={handleSubmit}
                            onCancel={() => {
                                setEditingAccount(null);
                                setIsDialogOpen(false);
                            }}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Listado de Cuentas</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Detalle</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {accounts.map((account) => (
                                <TableRow key={account.id}>
                                    <TableCell>{account.name}</TableCell>
                                    <TableCell>{account.detail}</TableCell>
                                    <TableCell>{account.status}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end space-x-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    setEditingAccount(account);
                                                    setIsDialogOpen(true);
                                                }}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(account.id)}
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
                </CardContent>
            </Card>
        </div>
    );
}

function CuentaForm({ account, onSubmit, onCancel }) {
    const [formData, setFormData] = useState({
        id: account?.id || 0,
        name: account?.name || "",
        type: account?.type || "",
        detail: account?.detail || "",
        status: account?.status || "Activa",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSelect = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <DialogHeader>
                <DialogTitle>{account ? "Editar Cuenta" : "Agregar Cuenta"}</DialogTitle>
                <DialogDescription>
                    Completá los datos de la cuenta para agregarla o editarla.
                </DialogDescription>
            </DialogHeader>

            <div className="space-y-2">
                <Label htmlFor="name">Nombre de la cuenta</Label>
                <Input name="name" id="name" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="status">Estado</Label>
                    <Select value={formData.status} onValueChange={(value) => handleSelect("status", value)}>
                        <SelectTrigger id="status">
                            <SelectValue placeholder="Seleccionar estado" />
                        </SelectTrigger>
                        <SelectContent>
                            {STATUSES.map((status) => (
                                <SelectItem key={status} value={status}>
                                    {status}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="detail">CBU / CVU / Email / Alias</Label>
                <Input name="detail" id="detail" value={formData.detail} onChange={handleChange} required />
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
    );
}