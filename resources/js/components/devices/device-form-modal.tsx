import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Device } from '@/types';
import { InertiaFormProps } from '@inertiajs/react';
import { FormEvent } from 'react';

interface DeviceFormModalProps {
    open: boolean;
    onClose: () => void;
    editingDevice: Device | null;
    form: InertiaFormProps<{
        mac_address: string;
        pin: string;
        name: string;
        share_emails: string[];
    }>;
    onSubmit: (e: FormEvent) => void;
}

export function DeviceFormModal({
    open,
    onClose,
    editingDevice,
    form,
    onSubmit,
}: DeviceFormModalProps) {
    const { data, setData, processing, errors } = form;

    // Regra de validação para o botão:
    // Se for novo: MAC deve ter 12 e PIN deve ter 6.
    // Se for edição: PIN pode ser vazio (mantém o atual) ou deve ter exatamente 6.
    const isInvalid = editingDevice
        ? (data.pin.length > 0 && data.pin.length !== 6) || data.name.trim() === ''
        : data.mac_address.length !== 12 || data.pin.length !== 6 || data.name.trim() === '';

    return (
        <Dialog open={open} onOpenChange={(v: boolean) => !v && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {editingDevice
                            ? 'Editar Equipamento'
                            : 'Novo Equipamento'}
                    </DialogTitle>

                    <DialogDescription>
                        {editingDevice
                            ? 'Atualize as informações do seu ativo industrial.'
                            : 'Informe o MAC e o PIN para vincular um novo hardware.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-4">
                    {!editingDevice && (
                        <div className="grid gap-2">
                            <Label htmlFor="mac">MAC Address</Label>

                            <Input
                                id="mac"
                                maxLength={12}
                                value={data.mac_address}
                                onChange={(e) =>
                                    setData(
                                        'mac_address',
                                        e.target.value
                                            .replace(/[^A-Fa-f0-9]/g, '')
                                            .toUpperCase()
                                            .slice(0, 12),
                                    )
                                }
                                placeholder="Ex: D4AD20BD9C0F"
                            />

                            <InputError message={errors.mac_address} />
                        </div>
                    )}

                    <div className="grid gap-2">
                        <Label htmlFor="pin">
                            {editingDevice ? 'Alterar PIN (Opcional)' : 'PIN de Segurança'}
                        </Label>

                        <Input
                            id="pin"
                            maxLength={6}
                            inputMode="numeric"
                            value={data.pin}
                            onChange={(e) =>
                                setData(
                                    'pin',
                                    e.target.value
                                        .replace(/[^0-9]/g, '')
                                        .slice(0, 6),
                                )
                            }
                            placeholder={editingDevice ? "Deixe em branco para manter" : "6 dígitos"}
                        />

                        <InputError message={errors.pin} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="name">Nome do Dispositivo</Label>

                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            onFocus={(e) => e.target.select()}
                            autoFocus={!!editingDevice}
                            placeholder="Ex: Medidor 01"
                        />

                        <InputError message={errors.name} />
                    </div>

                    <div className="space-y-3 border-t pt-4">
                        <Label className="text-xs font-bold text-muted-foreground uppercase">
                            Compartilhar Acesso (E-mail)
                        </Label>

                            <div className="space-y-2">
                            {(data.share_emails || []).map((email, idx) => {
                                const err = (errors as any)[`share_emails.${idx}`] ?? (errors as any).share_emails?.[idx];
                                return (
                                    <div key={idx} className="flex items-start gap-2">
                                        <Input
                                            type="email"
                                            value={email}
                                            onChange={(e) => {
                                                const arr = [...(data.share_emails || [])];
                                                arr[idx] = e.target.value;
                                                setData('share_emails', arr);
                                            }}
                                            placeholder={`Convidado ${idx + 1}`}
                                        />

                                        <Button type="button" variant="outline" onClick={() => {
                                            const arr = [...(data.share_emails || [])];
                                            arr.splice(idx, 1);
                                            setData('share_emails', arr);
                                        }}>
                                            Remover
                                        </Button>

                                        {err && <InputError message={err} />}
                                    </div>
                                );
                            })}

                            <Button type="button" onClick={() => setData('share_emails', [...(data.share_emails || []), ''])}>
                                + Adicionar
                            </Button>
                        </div>
                    </div>

                    <DialogFooter className="mt-6 flex justify-between">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                        >
                            Cancelar
                        </Button>

                        <Button
                            type="submit"
                            disabled={processing || isInvalid}
                            className="min-w-[120px]"
                        >
                            {processing ? (
                                <Spinner className="mr-2 size-4" />
                            ) : editingDevice ? (
                                'Salvar'
                            ) : (
                                'Vincular'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}