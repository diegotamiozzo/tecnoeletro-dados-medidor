import { Button } from '@/components/ui/button';
import { Device } from '@/types';
import { Link } from '@inertiajs/react';
import { Eye, Info, LayoutDashboard, Settings2, ShieldCheck, Trash2 } from 'lucide-react';

interface DeviceCardProps {
    device: Device;
    onEdit: (device: Device) => void;
    onDelete: (device: Device) => void;
}

export function DeviceCard({ device, onEdit, onDelete }: DeviceCardProps) {
    const isOwner = device.pivot.role === 'owner';

    return (
        <div className="group relative flex flex-col justify-between rounded-xl border border-border p-6 transition-all bg-card hover:border-primary/40 shadow-sm">
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{device.name}</h3>
                        {isOwner ? (
                            <span title="Proprietário" className="text-primary">
                                <ShieldCheck className="size-4" />
                            </span>
                        ) : (
                            <span title="Acesso Convidado" className="text-muted-foreground">
                                <Eye className="size-4" />
                            </span>
                        )}
                    </div>
                    <p className="text-xs font-mono text-muted-foreground">MAC: {device.mac_address}</p>
                    
                    <div className="mt-3 flex items-center gap-1.5 min-h-[20px]">
                        {!isOwner ? (
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Info className="size-3" />
                                <span className="text-[11px] font-medium uppercase tracking-tight">
                                    Somente Visualização
                                </span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-1.5 text-primary/80">
                                <ShieldCheck className="size-3" />
                                <span className="text-[11px] font-medium uppercase tracking-tight">
                                    Administrador
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex gap-1 min-h-[36px]">
                    {isOwner && (
                        <>
                            <Button variant="ghost" size="icon" onClick={() => onEdit(device)}>
                                <Settings2 className="size-4" />
                            </Button>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-destructive hover:text-destructive" 
                                onClick={() => onDelete(device)}
                            >
                                <Trash2 className="size-4" />
                            </Button>
                        </>
                    )}
                </div>
            </div>
            
            <div className="mt-6">
                <Link href={`/devices/${device.id}/dashboard`}>
                    <Button className="w-full" variant="secondary">
                        <LayoutDashboard className="mr-2 size-4" /> Dashboard
                    </Button>
                </Link>
            </div>
        </div>
    );
}