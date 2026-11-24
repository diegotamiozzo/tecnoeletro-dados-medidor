import { DeviceCard } from '../components/devices/device-card';
import { DeviceFormModal } from '../components/devices/device-form-modal';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';
import { Device, type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { AlertTriangle, Plus } from 'lucide-react';
import { FormEvent, useState, useEffect } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Meus Equipamentos', href: '/devices' }];

interface Props {
    devices?: Device[];
}

export default function Devices({ devices = [] }: Props) {
    const { flash } = usePage().props as any;
    const appUrl = (usePage().props as any).appUrl as string;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDevice, setEditingDevice] = useState<Device | null>(null);
    const [deviceToDelete, setDeviceToDelete] = useState<Device | null>(null);

    const form = useForm({
        mac_address: '',
        pin: '',
        name: '',
        share_emails: [] as string[],
    });

    // ✅ Monitora mensagens de flash do Laravel (Inertia)
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const hasOwnedDevices = devices.some(d => d.pivot.role === 'owner');
    const hasGuestDevices = devices.some(d => d.pivot.role === 'viewer');

    const openCreateModal = () => {
        setEditingDevice(null);
        form.reset();
        form.clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (device: Device) => {
        setEditingDevice(device);
        form.clearErrors();
        const guests = device.users?.filter(u => u.pivot.role !== 'owner') || [];
        
        form.setData({
            mac_address: device.mac_address,
            pin: '', // ✅ Enviado vazio para não sobrescrever nem falhar validação
            name: device.name,
            share_emails: guests.map(u => u.email),
        });
        setIsModalOpen(true);
    };

    const submitForm = (e: FormEvent) => {
        e.preventDefault();
        
        const options = {
            onSuccess: () => {
                setIsModalOpen(false);
                form.reset();
            },
            onError: () => {
                toast.error('Verifique os dados informados.');
            }
        };

        if (editingDevice) {
            form.put(`${appUrl}/devices/${editingDevice.id}`, options);
        } else {
            form.post(`${appUrl}/devices`, options);
        }
    };

    const confirmDelete = () => {
        if (deviceToDelete) {
            form.delete(`${appUrl}/devices/${deviceToDelete.id}`, {
                onSuccess: () => setDeviceToDelete(null),
                onFinish: () => {
                    setDeviceToDelete(null);
                    form.reset();
                },
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Meus Equipamentos" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold tracking-tight">Ativos Conectados</h2>
                        <p className="text-sm text-muted-foreground">
                            {hasOwnedDevices && hasGuestDevices 
                                ? 'Gerencie seus equipamentos e monitore seus acessos compartilhados.' 
                                : hasOwnedDevices 
                                    ? 'Gerencie seus equipamentos e acessos.' 
                                    : 'Monitore suas aplicações.'}
                        </p>
                    </div>
                    <Button onClick={openCreateModal}>
                        <Plus className="mr-2 size-4" /> Adicionar
                    </Button>
                </div>

                {devices.length === 0 ? (
                    <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center bg-card">
                        <h3 className="mt-4 text-lg font-semibold">Nenhum equipamento</h3>
                        <Button variant="link" onClick={openCreateModal}>Vincular primeiro dispositivo</Button>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {devices.map((device) => (
                            <DeviceCard 
                                key={device.id} 
                                device={device} 
                                onEdit={openEditModal} 
                                onDelete={setDeviceToDelete} 
                            />
                        ))}
                    </div>
                )}

                <DeviceFormModal 
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    editingDevice={editingDevice}
                    form={form}
                    onSubmit={submitForm}
                />

                <Dialog open={!!deviceToDelete} onOpenChange={(open) => !open && setDeviceToDelete(null)}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader className="flex flex-col items-center text-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                                <AlertTriangle className="size-6 text-destructive" />
                            </div>
                            <DialogTitle>Desvincular Equipamento?</DialogTitle>
                            <DialogDescription>
                                Você perderá o acesso ao dispositivo <strong>{deviceToDelete?.name}</strong>. 
                                Esta ação não exclui os dados da placa.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="flex w-full gap-3 sm:justify-center mt-2">
                            <Button variant="outline" className="flex-1" onClick={() => setDeviceToDelete(null)}>
                                Cancelar
                            </Button>
                            <Button variant="destructive" className="flex-1" onClick={confirmDelete} disabled={form.processing}>
                                {form.processing ? <Spinner className="size-4" /> : 'Confirmar'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}