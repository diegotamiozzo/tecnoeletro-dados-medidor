import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type EnergyCard, type SummaryCard, type ViewOption } from '@/components/dashboard/types';
import { formatNumber, formatPeakTime } from '@/components/dashboard/format';

const EXPORT_ENERGY_KEYS = new Set([
    'energia_ativa_exportada_ultima',
    'energia_reativa_exportada_ultima',
]);

type Props = {
    view: ViewOption;
    energyCards: EnergyCard[];
    summaryCards: SummaryCard[];
    is_generate: boolean;
};

export function DashboardStatCards({ view, energyCards, summaryCards, is_generate }: Props) {
    if (view === 'energias') {
        // Se o dispositivo não possui geração própria, oculta os cards de exportação (evita exibir ruído)
        const visibleEnergyCards = is_generate
            ? energyCards
            : energyCards.filter((card) => !EXPORT_ENERGY_KEYS.has(card.key));

        return (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {visibleEnergyCards.map((card) => (
                    <Card key={card.key}>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm">{card.label}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-1 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Acumulado</span>
                                <span className="font-medium">
                                    {formatNumber(card.total)} {card.unit}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Parcial</span>
                                <span className="font-medium">
                                    {formatNumber(card.consumo)} {card.unit}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map((card) => (
                <Card key={card.key}>
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-1 text-sm font-medium leading-tight">
                            {card.label}
                            {card.unit ? (
                                <span className="text-muted-foreground text-xs">({card.unit})</span>
                            ) : null}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 pt-0">
                        {/* Grid principal de valores */}
                        <div className="grid grid-cols-3 gap-2 text-center">
                            {/* MÍNIMO */}
                            <div className="flex flex-col items-center">
                                <div className="text-muted-foreground text-[11px] tracking-wide uppercase">Mín.</div>
                                <div className="text-sm font-bold tabular-nums">{formatNumber(card.min)}</div>
                                {formatPeakTime(card.min_at) && (
                                    <div className="text-muted-foreground text-[10px] whitespace-nowrap mt-1" title={card.min_at ?? undefined}>
                                         {formatPeakTime(card.min_at)}
                                    </div>
                                )}
                            </div>

                            {/* MÉDIA */}
                            <div className="flex flex-col items-center">
                                <div className="text-muted-foreground text-[11px] tracking-wide uppercase">Média</div>
                                <div className="text-sm font-bold tabular-nums">{formatNumber(card.avg)}</div>
                            </div>

                            {/* MÁXIMO */}
                            <div className="flex flex-col items-center">
                                <div className="text-muted-foreground text-[11px] tracking-wide uppercase">Máx.</div>
                                <div className="text-sm font-bold tabular-nums">{formatNumber(card.max)}</div>
                                {formatPeakTime(card.max_at) && (
                                    <div className="text-muted-foreground text-[10px] whitespace-nowrap mt-1" title={card.max_at ?? undefined}>
                                         {formatPeakTime(card.max_at)}
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}