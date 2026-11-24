import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DASHBOARD_CHART_CONFIG, type ChartPoint, type ViewOption } from '@/components/dashboard/types';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const EXPORT_LINE_KEYS = new Set([
    'energia_ativa_exportada_ultima',
    'energia_reativa_exportada_ultima',
]);

type Props = {
    view: ViewOption;
    chartData: ChartPoint[];
    hiddenLineKeys: string[];
    onToggleLine: (lineKey: string) => void;
    is_generate: boolean;
};

export function DashboardChart({ view, chartData, hiddenLineKeys, onToggleLine, is_generate }: Props) {
    const { title, lines: allLines } = DASHBOARD_CHART_CONFIG[view];

    // Se o dispositivo não possui geração própria, remove as linhas de exportação (evita exibir ruído)
    const lines = is_generate
        ? allLines
        : allLines.filter((line) => !EXPORT_LINE_KEYS.has(line.key));

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const formatDateTime = (value: string) =>
        new Date(value).toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });

    if (!chartData || chartData.length === 0) {
        return (
            <Card className="flex-1 w-full">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base sm:text-lg">{title}</CardTitle>
                </CardHeader>
                <CardContent className="h-[250px] sm:h-[350px] md:h-[400px] flex items-center justify-center">
                    <span className="text-muted-foreground text-sm">Sem dados para exibir</span>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="flex-1 min-w-0 w-full">
            <CardHeader className="pb-2">
                <CardTitle className="text-base sm:text-lg">{title}</CardTitle>
            </CardHeader>

            <CardContent className="h-[250px] sm:h-[350px] md:h-[400px] w-full pt-2 sm:pt-4 px-2 sm:px-6">
                <div className="w-full h-full min-w-0 min-h-0">
                    {mounted && (
                        <ResponsiveContainer width="100%" height="100%" key={view}>
                            <LineChart
                                data={chartData}
                                margin={{
                                    top: 5,
                                    right: 8,
                                    left: -10,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.2} />

                                <XAxis
                                    dataKey="timestamp"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fontSize: 10 }}
                                    interval="preserveStartEnd"
                                />
                                <YAxis
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fontSize: 10 }}
                                    width={60}
                                />

                                <Tooltip
                                    content={({ active, payload, label }: any) => {
                                        if (!active || !payload || payload.length === 0) {
                                            return null;
                                        }

                                        const originalData = payload[0].payload as ChartPoint;
                                        const periodoLabel = originalData?.periodo_inicio
                                            ? formatDateTime(originalData.periodo_inicio)
                                            : label;
                                        const updatedAtLabel = originalData?.updated_at
                                            ? formatDateTime(originalData.updated_at)
                                            : null;

                                        return (
                                            <div
                                                style={{
                                                    backgroundColor: '#0f172a',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    padding: '10px 12px',
                                                }}
                                            >
                                                <p style={{ color: '#38bdf8', fontWeight: 600, marginBottom: '6px' }}>
                                                    {periodoLabel}
                                                </p>
                                                {payload.map((entry: any) => {
                                                    const value =
                                                        typeof entry.value === 'number'
                                                            ? entry.value.toLocaleString('pt-BR', {
                                                                minimumFractionDigits: 2,
                                                                maximumFractionDigits: 2,
                                                            })
                                                            : entry.value ?? '0';
                                                    return (
                                                        <p key={String(entry.dataKey)} style={{ color: '#e2e8f0', margin: 0 }}>
                                                            {entry.name}: {value}
                                                        </p>
                                                    );
                                                })}
                                                {updatedAtLabel && (
                                                    <p
                                                        style={{
                                                            color: '#94a3b8',
                                                            marginTop: '8px',
                                                            paddingTop: '6px',
                                                            borderTop: '1px solid rgba(148,163,184,0.2)',
                                                            fontSize: '11px',
                                                        }}
                                                    >
                                                        Última atualização: {updatedAtLabel}
                                                    </p>
                                                )}
                                            </div>
                                        );
                                    }}
                                />

                                <Legend
                                    verticalAlign="top"
                                    height={36}
                                    wrapperStyle={{ fontSize: '11px', cursor: 'pointer' }}
                                    onClick={(entry) => {
                                        if (entry.dataKey) {
                                            onToggleLine(String(entry.dataKey));
                                        }
                                    }}
                                />

                                {lines.map((line) => (
                                    <Line
                                        key={line.key}
                                        type="monotone"
                                        dataKey={line.key}
                                        name={line.name}
                                        stroke={line.color}
                                        strokeWidth={2}
                                        dot={false}
                                        activeDot={{ r: 4 }}
                                        hide={hiddenLineKeys.includes(line.key)}
                                    />
                                ))}
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}