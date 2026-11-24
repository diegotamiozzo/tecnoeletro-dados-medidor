import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Download, RefreshCw, Search } from 'lucide-react';
import { type FormEvent, useCallback } from 'react';

type Props = {
    startDate: string;
    endDate: string;
    processing: boolean;
    onStartDateChange: (value: string) => void;
    onEndDateChange: (value: string) => void;
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
    onApplyPreset: (start: string, end: string) => void;
    onRefresh: () => void;
    onExportCsv: () => void;
};

type Preset = {
    label: string;
    start: string;
    end: string;
};

function buildPresets(): Preset[] {
    const today = new Date();
    // NÃO usar toISOString(): ele converte para UTC e pode "voltar um dia" no fuso local.
    const fmt = (d: Date) => {
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    const sub = (days: number) => {
        const d = new Date(today);
        d.setDate(d.getDate() - days);
        return d;
    };

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    return [
        { label: 'Hoje',       start: fmt(today),        end: fmt(today)    },
        { label: '7 dias',     start: fmt(sub(6)),       end: fmt(today)    },
        { label: '30 dias',    start: fmt(sub(29)),      end: fmt(today)    },
        { label: 'Mês atual',  start: fmt(startOfMonth), end: fmt(today)    },
    ];
}

function periodLabel(start: string, end: string): string {
    if (!start || !end) return '';
    const fmt = (s: string) =>
        new Date(s + 'T12:00:00').toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
        });
    return start === end ? fmt(start) : `${fmt(start)} → ${fmt(end)}`;
}

export function DashboardPeriodFilter({
    startDate,
    endDate,
    processing,
    onStartDateChange,
    onEndDateChange,
    onSubmit,
    onApplyPreset,
    onRefresh,
    onExportCsv,
}: Props) {
    const presets = buildPresets();

    const applyPreset = useCallback(
        (preset: Preset) => {
            onStartDateChange(preset.start);
            onEndDateChange(preset.end);
            onApplyPreset(preset.start, preset.end);
        },
        [onStartDateChange, onEndDateChange, onApplyPreset],
    );

    const isActivePreset = (preset: Preset) =>
        preset.start === startDate && preset.end === endDate;

    return (
        <div className="rounded-xl border border-border bg-card px-5 py-4">
            {/* Header row */}
            <div className="mb-3 flex flex-wrap items-start justify-between gap-y-2">
                <div>
                    <p className="text-sm font-medium leading-none text-foreground">
                        Período de análise
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                        {periodLabel(startDate, endDate) || 'Selecione o intervalo'}
                    </p>
                </div>

                {/* Quick presets */}
                <div className="flex flex-wrap gap-1.5">
                    {presets.map((preset) => (
                        <button
                            key={preset.label}
                            type="button"
                            onClick={() => applyPreset(preset)}
                            disabled={processing}
                            className={cn(
                                'cursor-pointer disabled:cursor-not-allowed rounded-full border px-3 py-0.5 text-xs font-medium transition-colors disabled:opacity-50',
                                isActivePreset(preset)
                                    ? 'border-primary/40 bg-primary/10 text-primary'
                                    : 'border-border bg-transparent text-muted-foreground hover:border-border/80 hover:bg-accent hover:text-accent-foreground',
                            )}
                        >
                            {preset.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Divider */}
            <div className="mb-3 border-t border-border/60" />

            {/* Controls row */}
            <form
                onSubmit={onSubmit}
                className="flex flex-wrap items-end gap-2"
            >
                {/* Date range */}
                <div className="flex flex-1 items-end gap-2 min-w-[260px]">
                    <div className="flex flex-1 flex-col gap-1">
                        <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                            De
                        </label>
                        <Input
                            type="date"
                            value={startDate}
                            max={endDate}
                            onChange={(e) => onStartDateChange(e.target.value)}
                            required
                            className="h-9 text-sm"
                        />
                    </div>

                    <span className="mb-1.5 shrink-0 text-muted-foreground/50">→</span>

                    <div className="flex flex-1 flex-col gap-1">
                        <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                            Até
                        </label>
                        <Input
                            type="date"
                            value={endDate}
                            min={startDate}
                            onChange={(e) => onEndDateChange(e.target.value)}
                            required
                            className="h-9 text-sm"
                        />
                    </div>
                </div>

                {/* Action buttons */}
                <div className="flex shrink-0 items-center gap-1.5">
                    <Button
                        type="submit"
                        variant="default"
                        size="sm"
                        disabled={processing}
                        className="h-9 gap-1.5 px-4 text-sm cursor-pointer"
                    >
                        <Search className="size-3.5" />
                        Filtrar
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={onRefresh}
                        disabled={processing}
                        className="h-9 gap-1.5 px-4 text-sm cursor-pointer"
                    >
                        <RefreshCw
                            className={cn('size-3.5', processing && 'animate-spin')}
                        />
                        Atualizar
                    </Button>

                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={onExportCsv}
                        disabled={processing}
                        className="size-9 shrink-0 text-muted-foreground hover:text-foreground cursor-pointer"
                        title="Exportar CSV"
                    >
                        <Download className="size-4" />
                    </Button>
                </div>
            </form>
        </div>
    );
}
