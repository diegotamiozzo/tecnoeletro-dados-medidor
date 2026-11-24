import InputError from '@/components/input-error'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import AppLayout from '@/layouts/app-layout'
import { type BreadcrumbItem } from '@/types'
import { Head, Link, useForm, usePage } from '@inertiajs/react'
import {
    AlertTriangle,
    CheckCircle2,
    CircleDashed,
    Eye,
    EyeOff,
    LayoutDashboard,
    Pencil,
    Plus,
    Trash2,
    UserCheck,
    UserX,
    Zap,
    ZapOff,
} from 'lucide-react'
import { FormEvent, useState } from 'react'

interface DeviceOwner {
    name: string
    email: string
}

interface AdminDevice {
    id: number
    mac_address: string
    pin: string
    name: string
    is_active: boolean
    is_generate: boolean
    created_at: string
    owner: DeviceOwner | null
}

interface Props {
    devices: AdminDevice[]
}

interface FlashProps {
    success?: string
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin' },
    { title: 'Equipamentos', href: '/admin/devices' },
]

export default function AdminDevices({ devices }: Props) {
    const { props } = usePage<{ flash: FlashProps }>()
    const flash = props.flash ?? {}

    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [editingDevice, setEditingDevice] = useState<AdminDevice | null>(null)
    const [deletingDevice, setDeletingDevice] = useState<AdminDevice | null>(null)
    const [showPin, setShowPin] = useState<Record<number, boolean>>({})
    const [showCreatePin, setShowCreatePin] = useState(false)
    const [showEditPin, setShowEditPin] = useState(false)

    const createForm = useForm({
        mac_address: '',
        pin: '',
        name: 'Medidor 01',
        is_generate: true,
    })

    const editForm = useForm({
        name: '',
        pin: '',
        is_active: true,
        is_generate: true,
    })

    const deleteForm = useForm({})

    const submitCreate = (e: FormEvent) => {
        e.preventDefault()
        createForm.post('/admin/devices', {
            onSuccess: () => {
                setIsCreateOpen(false)
                createForm.reset()
            },
        })
    }

    const openEdit = (device: AdminDevice) => {
        setEditingDevice(device)
        setShowEditPin(false)
        editForm.setData({
            name: device.name,
            pin: device.pin,
            is_active: device.is_active,
            is_generate: device.is_generate,
        })
    }

    const submitEdit = (e: FormEvent) => {
        e.preventDefault()
        if (!editingDevice) return
        editForm.put(`/admin/devices/${editingDevice.id}`, {
            onSuccess: () => setEditingDevice(null),
        })
    }

    const confirmDelete = () => {
        if (!deletingDevice) return
        deleteForm.delete(`/admin/devices/${deletingDevice.id}`, {
            onSuccess: () => setDeletingDevice(null),
        })
    }

    const togglePinVisibility = (id: number) => {
        setShowPin((prev) => ({ ...prev, [id]: !prev[id] }))
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin · Equipamentos" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 lg:p-8">
                {/* Flash Success Alert */}
                {flash.success && (
                    <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-950/30 dark:text-green-400">
                        <CheckCircle2 className="size-4 shrink-0" />
                        {flash.success}
                    </div>
                )}

                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-semibold">Equipamentos</h1>
                        <p className="text-sm text-muted-foreground">
                            {devices.length}{' '}
                            {devices.length === 1
                                ? 'dispositivo cadastrado'
                                : 'dispositivos cadastrados'}
                        </p>
                    </div>

                    <Button
                        onClick={() => {
                            createForm.reset()
                            setIsCreateOpen(true)
                        }}
                        className="w-full sm:w-auto"
                    >
                        <Plus className="size-4 mr-1" />
                        Novo Equipamento
                    </Button>
                </div>

                {/* ── MOBILE (CARDS) ── */}
                <div className="grid gap-4 md:hidden">
                    {devices.length === 0 ? (
                        <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
                            Nenhum equipamento cadastrado.
                        </div>
                    ) : (
                        devices.map((device) => (
                            <div
                                key={device.id}
                                className="rounded-xl border bg-card p-4 shadow-sm space-y-4"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <h3 className="font-bold leading-none">{device.name}</h3>
                                        <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                                            {device.mac_address}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <Badge
                                            className={
                                                device.is_active
                                                    ? 'bg-green-600 hover:bg-green-600 text-white'
                                                    : 'bg-secondary text-secondary-foreground'
                                            }
                                        >
                                            {device.is_active ? 'Ativo' : 'Inativo'}
                                        </Badge>
                                        <Badge
                                            className={
                                                device.is_generate
                                                    ? 'bg-green-600 hover:bg-green-600 text-white'
                                                    : 'bg-secondary text-secondary-foreground'
                                            }
                                        >
                                            {device.is_generate ? 'Própria' : 'Nenhuma'}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-[10px] font-bold uppercase text-muted-foreground block">
                                            PIN
                                        </span>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="font-mono">
                                                {showPin[device.id] ? device.pin : '••••••'}
                                            </span>
                                            <button
                                                onClick={() => togglePinVisibility(device.id)}
                                                className="text-muted-foreground cursor-pointer"
                                            >
                                                {showPin[device.id] ? (
                                                    <EyeOff className="size-3" />
                                                ) : (
                                                    <Eye className="size-3" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold uppercase text-muted-foreground block">
                                            Dono
                                        </span>
                                        <p className="truncate mt-1">
                                            {device.owner?.name || '—'}
                                        </p>
                                    </div>
                                </div>

                                {/* Botões mobile */}
                                <div className="flex gap-2 pt-2 border-t">
                                    <Link
                                        href={`/devices/${device.id}/dashboard`}
                                        className="flex-1"
                                    >
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full gap-1.5 text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950/30"
                                        >
                                            <LayoutDashboard className="size-3" />
                                            Dashboard
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1"
                                        onClick={() => openEdit(device)}
                                    >
                                        <Pencil className="size-3 mr-2" /> Editar
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1 text-red-500 hover:text-red-600"
                                        onClick={() => setDeletingDevice(device)}
                                    >
                                        <Trash2 className="size-3 mr-2" /> Excluir
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* ── DESKTOP (TABELA) ── */}
                <div className="hidden md:block overflow-hidden rounded-xl border bg-card">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/40 border-b">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium">Equipamento</th>
                                <th className="px-4 py-3 text-left font-medium">MAC</th>
                                <th className="px-4 py-3 text-left font-medium">PIN</th>
                                <th className="px-4 py-3 text-left font-medium">Proprietário</th>
                                <th className="px-4 py-3 text-left font-medium">Geração</th>
                                <th className="px-4 py-3 text-left font-medium">Status</th>
                                <th className="px-4 py-3 text-right font-medium">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {devices.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-4 py-12 text-center text-muted-foreground italic"
                                    >
                                        Nenhum equipamento cadastrado.
                                    </td>
                                </tr>
                            ) : (
                                devices.map((device) => (
                                    <tr
                                        key={device.id}
                                        className="hover:bg-muted/30 transition-colors"
                                    >
                                        <td className="px-4 py-3 font-medium">{device.name}</td>
                                        <td className="px-4 py-3 font-mono text-xs tracking-widest text-muted-foreground">
                                            {device.mac_address}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-xs">
                                                    {showPin[device.id]
                                                        ? device.pin
                                                        : '••••••'}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        togglePinVisibility(device.id)
                                                    }
                                                    className="text-muted-foreground hover:text-foreground cursor-pointer"
                                                >
                                                    {showPin[device.id] ? (
                                                        <EyeOff className="size-4" />
                                                    ) : (
                                                        <Eye className="size-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            {device.owner ? (
                                                <div className="flex items-center gap-2">
                                                    <UserCheck className="size-4 text-green-500 shrink-0" />
                                                    <div className="max-w-[150px]">
                                                        <p className="font-medium truncate leading-tight">
                                                            {device.owner.name}
                                                        </p>
                                                        <p className="text-[10px] text-muted-foreground truncate">
                                                            {device.owner.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-muted-foreground/60">
                                                    <UserX className="size-4 shrink-0" />
                                                    <span className="text-xs italic">
                                                        Sem proprietário
                                                    </span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            {device.is_generate ? (
                                                <Badge className="bg-green-600 hover:bg-green-600 text-white gap-1">
                                                    <Zap className="size-3" /> Própria
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary" className="gap-1">
                                                    <ZapOff className="size-3" /> Nenhuma
                                                </Badge>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            {device.is_active ? (
                                                <Badge className="bg-green-600 hover:bg-green-600 text-white gap-1">
                                                    <CheckCircle2 className="size-3" /> Ativo
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary" className="gap-1">
                                                    <CircleDashed className="size-3" /> Inativo
                                                </Badge>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end items-center gap-1">
                                                <Link href={`/devices/${device.id}/dashboard`}>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        title="Ver Dashboard"
                                                        className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                                                    >
                                                        <LayoutDashboard className="size-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => openEdit(device)}
                                                >
                                                    <Pencil className="size-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => setDeletingDevice(device)}
                                                >
                                                    <Trash2 className="size-4 text-red-500" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Modal: Criar */}
                <Dialog
                    open={isCreateOpen}
                    onOpenChange={(v) => !v && setIsCreateOpen(false)}
                >
                    <DialogContent className="w-[95vw] max-w-md rounded-xl">
                        <DialogHeader>
                            <DialogTitle>Novo Equipamento</DialogTitle>
                            <DialogDescription>
                                Cadastre um novo dispositivo medidor no sistema.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={submitCreate} className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="create-mac">MAC Address</Label>
                                <Input
                                    id="create-mac"
                                    maxLength={12}
                                    value={createForm.data.mac_address}
                                    onChange={(e) =>
                                        createForm.setData(
                                            'mac_address',
                                            e.target.value
                                                .replace(/[^A-Fa-f0-9]/g, '')
                                                .toUpperCase()
                                                .slice(0, 12),
                                        )
                                    }
                                    placeholder="Ex: D4AD20BD9C0F"
                                    className="font-mono tracking-widest"
                                />
                                <InputError message={createForm.errors.mac_address} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="create-pin">PIN de Segurança</Label>
                                <div className="relative">
                                    <Input
                                        id="create-pin"
                                        type={showCreatePin ? 'text' : 'password'}
                                        inputMode="numeric"
                                        maxLength={6}
                                        value={createForm.data.pin}
                                        onChange={(e) =>
                                            createForm.setData(
                                                'pin',
                                                e.target.value
                                                    .replace(/[^0-9]/g, '')
                                                    .slice(0, 6),
                                            )
                                        }
                                        placeholder="6 dígitos"
                                        className="pr-9 font-mono tracking-widest"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCreatePin(!showCreatePin)}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer"
                                    >
                                        {showCreatePin ? (
                                            <EyeOff className="size-4" />
                                        ) : (
                                            <Eye className="size-4" />
                                        )}
                                    </button>
                                </div>
                                <InputError message={createForm.errors.pin} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="create-name">Nome Exibição</Label>
                                <Input
                                    id="create-name"
                                    value={createForm.data.name}
                                    onChange={(e) =>
                                        createForm.setData('name', e.target.value)
                                    }
                                />
                                <InputError message={createForm.errors.name} />
                            </div>

                            <div className="flex items-center justify-between rounded-lg border p-4 bg-muted/20">
                                <div className="space-y-0.5">
                                    <span className="text-sm font-medium">Geração Própria</span>
                                    <p className="text-xs text-muted-foreground">
                                        {createForm.data.is_generate
                                            ? 'Equipamento possui painéis/geração'
                                            : 'Apenas consumo da rede'}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() =>
                                        createForm.setData(
                                            'is_generate',
                                            !createForm.data.is_generate,
                                        )
                                    }
                                    className={`relative inline-flex cursor-pointer h-6 w-11 items-center rounded-full transition-colors ${createForm.data.is_generate ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${createForm.data.is_generate ? 'translate-x-6' : 'translate-x-1'}`}
                                    />
                                </button>
                            </div>

                            <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsCreateOpen(false)}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={
                                        createForm.processing ||
                                        createForm.data.mac_address.length !== 12 ||
                                        createForm.data.pin.length !== 6
                                    }
                                >
                                    {createForm.processing ? (
                                        <Spinner className="size-4" />
                                    ) : (
                                        'Cadastrar'
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Modal: Editar */}
                <Dialog
                    open={!!editingDevice}
                    onOpenChange={(v) => !v && setEditingDevice(null)}
                >
                    <DialogContent className="w-[95vw] max-w-md rounded-xl">
                        <DialogHeader>
                            <DialogTitle>Editar Equipamento</DialogTitle>
                            <DialogDescription className="font-mono text-xs opacity-70">
                                MAC: {editingDevice?.mac_address}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={submitEdit} className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Nome</Label>
                                <Input
                                    value={editForm.data.name}
                                    onChange={(e) =>
                                        editForm.setData('name', e.target.value)
                                    }
                                />
                                <InputError message={editForm.errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label>PIN</Label>
                                <div className="relative">
                                    <Input
                                        type={showEditPin ? 'text' : 'password'}
                                        inputMode="numeric"
                                        maxLength={6}
                                        value={editForm.data.pin}
                                        onChange={(e) =>
                                            editForm.setData(
                                                'pin',
                                                e.target.value
                                                    .replace(/[^0-9]/g, '')
                                                    .slice(0, 6),
                                            )
                                        }
                                        className="pr-9 font-mono tracking-widest"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowEditPin(!showEditPin)}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer"
                                    >
                                        {showEditPin ? (
                                            <EyeOff className="size-4" />
                                        ) : (
                                            <Eye className="size-4" />
                                        )}
                                    </button>
                                </div>
                                <InputError message={editForm.errors.pin} />
                            </div>

                            <div className="flex items-center justify-between rounded-lg border p-4 bg-muted/20">
                                <div className="space-y-0.5">
                                    <span className="text-sm font-medium">Geração Própria</span>
                                    <p className="text-xs text-muted-foreground">
                                        Define se o medidor contabiliza geração
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() =>
                                        editForm.setData(
                                            'is_generate',
                                            !editForm.data.is_generate,
                                        )
                                    }
                                    className={`relative inline-flex cursor-pointer h-6 w-11 items-center rounded-full transition-colors ${editForm.data.is_generate ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${editForm.data.is_generate ? 'translate-x-6' : 'translate-x-1'}`}
                                    />
                                </button>
                            </div>

                            <div className="flex items-center justify-between rounded-lg border p-4 bg-muted/20">
                                <div className="space-y-0.5">
                                    <span className="text-sm font-medium">
                                        Status do Equipamento
                                    </span>
                                    <p className="text-xs text-muted-foreground">
                                        Ative ou desative o acesso
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() =>
                                        editForm.setData(
                                            'is_active',
                                            !editForm.data.is_active,
                                        )
                                    }
                                    className={`relative inline-flex cursor-pointer h-6 w-11 items-center rounded-full transition-colors ${editForm.data.is_active ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${editForm.data.is_active ? 'translate-x-6' : 'translate-x-1'}`}
                                    />
                                </button>
                            </div>

                            <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setEditingDevice(null)}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={
                                        editForm.processing ||
                                        editForm.data.pin.length !== 6
                                    }
                                >
                                    {editForm.processing ? (
                                        <Spinner className="size-4" />
                                    ) : (
                                        'Salvar'
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Modal: Excluir */}
                <Dialog
                    open={!!deletingDevice}
                    onOpenChange={(v) => !v && setDeletingDevice(null)}
                >
                    <DialogContent className="w-[95vw] max-w-sm rounded-xl">
                        <div className="flex flex-col items-center gap-4 text-center py-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/40 text-red-600">
                                <AlertTriangle className="size-6" />
                            </div>
                            <div>
                                <DialogTitle className="text-lg">
                                    Excluir equipamento?
                                </DialogTitle>
                                <DialogDescription className="mt-2">
                                    <strong>{deletingDevice?.name}</strong> será removido
                                    permanentemente. Esta ação não pode ser desfeita.
                                </DialogDescription>
                            </div>
                        </div>
                        <DialogFooter className="flex-col sm:flex-row gap-2">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => setDeletingDevice(null)}
                            >
                                Voltar
                            </Button>
                            <Button
                                variant="destructive"
                                className="flex-1"
                                onClick={confirmDelete}
                                disabled={deleteForm.processing}
                            >
                                {deleteForm.processing ? (
                                    <Spinner className="size-4" />
                                ) : (
                                    'Confirmar Exclusão'
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    )
}
