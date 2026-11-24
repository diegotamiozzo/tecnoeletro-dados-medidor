import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileDown, Minus, Plus, Receipt, Zap } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { jsPDF } from 'jspdf';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { formatNumber } from '@/components/dashboard/format';
import { type ChartPoint, type EnergyCard } from '@/components/dashboard/types';


type Props = {
    chartData: ChartPoint[];
    energyCards: EnergyCard[];
    is_generate: boolean;
    deviceName: string;
    macAddress: string;
    startDate: string;
    endDate: string;
};

const TARIFA_PRESETS = [0.65, 0.75, 0.85, 0.99];

export function DashboardSimulation({
    chartData,
    energyCards,
    is_generate,
    deviceName,
    macAddress,
    startDate,
    endDate,
}: Props) {

    const [ready, setReady] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setReady(true), 50);
        return () => clearTimeout(t);
    }, []);

    const [tarifa, setTarifa] = useState(0.75);

    const computedEnergyDeltas = useMemo(() => {
        const sorted = [...chartData].sort((a, b) => a.periodo_inicio.localeCompare(b.periodo_inicio));
        
        return sorted.map((point, idx) => {
            const prev = idx > 0 ? sorted[idx - 1] : null;

            // Lógica de Importação (Consumo)
            const fallbackImp =
                prev && typeof point.energia_ativa_importada_ultima === 'number' && typeof prev.energia_ativa_importada_ultima === 'number'
                    ? Math.max(0, point.energia_ativa_importada_ultima - prev.energia_ativa_importada_ultima)
                    : 0;

            // Lógica de Exportação (Geração)
            const fallbackExp =
                prev && typeof point.energia_ativa_exportada_ultima === 'number' && typeof prev.energia_ativa_exportada_ultima === 'number'
                    ? Math.max(0, point.energia_ativa_exportada_ultima - prev.energia_ativa_exportada_ultima)
                    : 0;

            const imp = Math.max(0, point.consumo_energia_ativa_importada ?? fallbackImp);
            
            //  AJUSTE: Se is_generate for falso, ignoramos qualquer leitura de exportação (ruído)
            const rawExp = Math.max(0, point.consumo_energia_ativa_exportada ?? fallbackExp);
            const exp = is_generate ? rawExp : 0;

            return { point, imp, exp };
        });
    }, [chartData, is_generate]); // 

    const dailyData = useMemo(() => {
        const grouped: Record<string, { label: string; importada: number; exportada: number }> = {};

        computedEnergyDeltas.forEach(({ point, imp, exp }) => {
            const dateKey = point.periodo_inicio.substring(0, 10);
            const [, month, day] = dateKey.split('-');

            if (!grouped[dateKey]) {
                grouped[dateKey] = {
                    label: `${day}/${month}`,
                    importada: 0,
                    exportada: 0,
                };
            }

            grouped[dateKey].importada += imp;
            grouped[dateKey].exportada += exp;
        });

        return Object.entries(grouped)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([, value]) => value);
    }, [computedEnergyDeltas]);

    const totalImportada = useMemo(() => {
        return computedEnergyDeltas.reduce((acc, row) => acc + row.imp, 0);
    }, [computedEnergyDeltas]);

    const totalExportada = useMemo(() => {
        return computedEnergyDeltas.reduce((acc, row) => acc + row.exp, 0);
    }, [computedEnergyDeltas]);

    // Cálculos de saldo baseados nos valores já filtrados pela lógica is_generate
    const creditoUsado = Math.min(totalImportada, totalExportada);
    const saldoLiquido = Math.max(0, totalImportada - totalExportada);
    const valorLiquido = saldoLiquido * tarifa;

    const adjustTarifa = (delta: number) => {
        setTarifa((prev) => {
            const next = Math.round((prev + delta) * 100) / 100;
            return Math.max(0.01, next);
        });
    };

    const handleTarifaInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        if (!isNaN(value) && value > 0) {
            setTarifa(Math.round(value * 100) / 100);
        }
    };

    const hasData = chartData.length > 0;
    const periodLabel = `${new Date(startDate + 'T12:00:00').toLocaleDateString('pt-BR')} a ${new Date(endDate + 'T12:00:00').toLocaleDateString('pt-BR')}`;

    const currency = (value: number) =>
        new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);

    const generatePdf = () => {
        const doc = new jsPDF();
        const generatedAt = new Date().toLocaleString('pt-BR');
        const filenameDate = new Date().toISOString().slice(0, 10);

        doc.setFontSize(16);
        doc.text('Simulação de Fatura de Energia', 14, 20);

        doc.setFontSize(11);
        doc.text(`Medidor: ${deviceName}`, 14, 32);
        doc.text(`MAC: ${macAddress}`, 14, 39);
        doc.text(`Periodo: ${periodLabel}`, 14, 46);
        doc.text(`Gerado em: ${generatedAt}`, 14, 53);

        doc.setDrawColor(220, 220, 220);
        doc.line(14, 58, 196, 58);

        doc.setFontSize(13);
        doc.text('Resumo da simulação', 14, 70);

        doc.setFontSize(11);
        doc.text(`Consumo importado: ${formatNumber(totalImportada)} kWh`, 14, 80);
        if (is_generate) {
            doc.text(`Energia exportada: ${formatNumber(totalExportada)} kWh`, 14, 87);
            doc.text(`Credito utilizado: ${formatNumber(creditoUsado)} kWh`, 14, 94);
            doc.text(`Saldo liquido: ${formatNumber(saldoLiquido)} kWh`, 14, 101);
            doc.text(`Tarifa aplicada: R$ ${tarifa.toFixed(2)}/kWh`, 14, 108);
            doc.setFontSize(13);
            doc.text(`Total estimado: ${currency(valorLiquido)}`, 14, 120);
        } else {
            doc.text(`Saldo liquido: ${formatNumber(saldoLiquido)} kWh`, 14, 87);
            doc.text(`Tarifa aplicada: R$ ${tarifa.toFixed(2)}/kWh`, 14, 94);
            doc.setFontSize(13);
            doc.text(`Total estimado: ${currency(valorLiquido)}`, 14, 106);
        }

        doc.save(`simulação-${macAddress}-${filenameDate}.pdf`);
    };

    return (
        <div className="space-y-4">
            {/* GRÁFICO */}
            <Card className="w-full min-w-[300px]">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base font-semibold">
                        <Zap className="size-4 text-yellow-500 fill-yellow-500" />
                        Importação {is_generate && "vs Exportação"} — Consumo Diário
                    </CardTitle>
                </CardHeader>

                <CardContent className="h-[320px] pt-4">
                    {hasData && ready ? (
                        <ResponsiveContainer width="99%" height={320}>
                            <BarChart
                                data={dailyData}
                                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                                barCategoryGap="35%"
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                                <XAxis dataKey="label" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false} 
                                    tickFormatter={(v) => `${formatNumber(v, 0)}`} 
                                />
                                <Tooltip
                                    cursor={{ fill: 'rgba(0,0,0,0.04)' }}
                                    contentStyle={{
                                        borderRadius: '12px',
                                        border: 'none',
                                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                                        fontSize: 13
                                    }}
                                    formatter={((value: number, name: string) => [
                                        `${formatNumber(value)} kWh`,
                                        name
                                    ]) as any}
                                />
                                <Legend verticalAlign="top" align="right" height={40} />
                                <Bar
                                    dataKey="importada"
                                    name="Importada (da rede)"
                                    fill="#22c55e"
                                    stackId="a"
                                    radius={is_generate ? [0, 0, 0, 0] : [4, 4, 0, 0]}
                                />
                                {is_generate && (
                                    <Bar
                                        dataKey="exportada"
                                        name="Exportada (geração)"
                                        fill="#06b6d4"
                                        stackId="a"
                                        radius={[4, 4, 0, 0]}
                                    />
                                )}
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex h-full items-center justify-center text-sm text-muted-foreground italic">
                            Sem dados ou carregando gráfico...
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
                {/* TARIFA */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base font-medium">Tarifa Aplicada</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">Valor por kWh (R$)</Label>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="icon" onClick={() => adjustTarifa(-0.01)} className="cursor-pointer">
                                    <Minus className="size-4" />
                                </Button>
                                <Input
                                    type="number"
                                    value={tarifa}
                                    onChange={handleTarifaInput}
                                    className="text-center font-mono text-lg font-bold"
                                />
                                <Button variant="outline" size="icon" onClick={() => adjustTarifa(0.01)} className="cursor-pointer">
                                    <Plus className="size-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                            {TARIFA_PRESETS.map((v) => (
                                <Button
                                    key={v}
                                    variant={tarifa === v ? 'default' : 'outline'}
                                    size="sm"
                                    className="text-xs cursor-pointer"
                                    onClick={() => setTarifa(v)}
                                >
                                    {v.toFixed(2)}
                                </Button>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* RESULTADO */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base font-medium">
                            <Receipt className="inline size-4 mr-1" />
                            Fatura Estimada
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between">
                            <span>Consumo</span>
                            <span>{formatNumber(totalImportada)} kWh</span>
                        </div>

                        {is_generate && (
                            <div className="flex justify-between">
                                <span>Exportado</span>
                                <span>{formatNumber(totalExportada)} kWh</span>
                            </div>
                        )}

                        <div className="border-t pt-2 flex justify-between font-bold">
                            <span>Total a pagar</span>
                            <span>
                                {currency(valorLiquido)}
                            </span>
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            onClick={generatePdf}
                            disabled={!hasData}
                        >
                            <FileDown className="size-4" />
                            Gerar PDF da simulação
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}