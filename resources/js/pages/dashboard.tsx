import { DashboardChart } from '@/components/dashboard/dashboard-chart';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { DashboardPeriodFilter } from '@/components/dashboard/dashboard-period-filter';
import { DashboardSimulation } from '@/components/dashboard/dashboard-simulation';
import { DashboardStatCards } from '@/components/dashboard/dashboard-stat-cards';
import {
    filterSummaryCardsForView,
    type ChartPoint,
    type EnergyCard,
    type SummaryCard,
    type ViewOption,
} from '@/components/dashboard/types';
import { AppFooter } from '@/components/layout/app-footer';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { CloudRain, Sun, MapPin } from 'lucide-react';
import { type FormEvent, useEffect, useMemo, useState, useRef } from 'react';
import { toast } from 'sonner';

interface DashboardProps {
    device: {
        id: number;
        name: string;
        mac_address: string;
        is_generate: boolean;
        latitude?: number;
        longitude?: number;
        city?: string;
    };
    chartData: ChartPoint[];
    summaryCards: SummaryCard[];
    energyCards: EnergyCard[];
    filters: {
        start_date: string;
        end_date: string;
        view?: string;
    };
}

export default function Dashboard({
    device,
    chartData = [],
    summaryCards = [],
    energyCards = [],
    filters,
}: DashboardProps) {
    const appUrl = usePage().props.appUrl as string;
    const [mounted, setMounted] = useState(false);
    const [view, setView] = useState<ViewOption>((filters.view as ViewOption) || 'tensoes_fase');
    const [hiddenLines, setHiddenLines] = useState<string[]>([]);
    const [weather, setWeather] = useState<{ 
        temp: number; 
        humidity: number; 
        locationLabel?: string 
    } | null>(null);

    // Referência para limpar o polling de refresh se o componente desmontar
    const pollingRef = useRef<number | null>(null);

    const filterForm = useForm({
        start_date: filters.start_date,
        end_date: filters.end_date,
        view: view,
    });

    const { setData } = filterForm;

    // Hook de inicialização e busca de localização/clima
    useEffect(() => {
        setMounted(true);

        const fetchWeatherAndCity = async (lat: number, lon: number) => {
            try {
                const weatherPromise = fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m`
                ).then(res => res.json());

                const geoPromise = fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`,
                    { headers: { 'Accept-Language': 'pt-BR' } }
                ).then(res => res.json());

                const [weatherData, geoData] = await Promise.all([weatherPromise, geoPromise]);

                const cityLabel = geoData.address?.city || 
                                 geoData.address?.town || 
                                 geoData.address?.village || 
                                 geoData.address?.suburb;

                setWeather({
                    temp: weatherData.current.temperature_2m,
                    humidity: weatherData.current.relative_humidity_2m,
                    locationLabel: cityLabel
                });
            } catch (error) {
                console.error("Erro ao sincronizar dados de clima/local:", error);
            }
        };

        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => fetchWeatherAndCity(pos.coords.latitude, pos.coords.longitude),
                () => {
                    if (device.latitude && device.longitude) {
                        fetchWeatherAndCity(device.latitude, device.longitude);
                    }
                }
            );
        } else if (device.latitude && device.longitude) {
            fetchWeatherAndCity(device.latitude, device.longitude);
        }
    }, [device.id, device.latitude, device.longitude]);

    // Sincronização da View com URL e Form (Corrigido para evitar loop)
    useEffect(() => {
        if (!mounted) return;

        setHiddenLines([]);
        setData('view', view);

        const url = new URL(window.location.href);
        if (url.searchParams.get('view') !== view) {
            url.searchParams.set('view', view);
            window.history.replaceState({}, '', url.toString());
        }
    }, [view, setData, mounted]);

    // Intervalo de recarregamento automático e limpeza de segurança
    useEffect(() => {
        const autoReloadInterval = setInterval(() => {
            router.reload({
                preserveScroll: true,
                only: ['chartData', 'summaryCards', 'energyCards'],
            } as any);
        }, 5 * 60 * 1000);

        return () => {
            clearInterval(autoReloadInterval);
            if (pollingRef.current) window.clearInterval(pollingRef.current);
        };
    }, []);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Meus Dispositivos', href: '/devices' },
        { title: device.name, href: '#' },
    ];

    const visibleSummaryCards = useMemo(
        () => filterSummaryCardsForView(summaryCards, view),
        [summaryCards, view]
    );

    const isPartialLastPoint = useMemo(() => {
        const lastPoint = chartData[chartData.length - 1];
        if (!lastPoint) return false;

        const pointHour = new Date(lastPoint.periodo_inicio);
        const nowDate = new Date();

        return (
            pointHour.getFullYear() === nowDate.getFullYear() &&
            pointHour.getMonth() === nowDate.getMonth() &&
            pointHour.getDate() === nowDate.getDate() &&
            pointHour.getHours() === nowDate.getHours()
        );
    }, [chartData]);

    const lastUpdateLabel = useMemo(() => {
        const lastPoint = chartData[chartData.length - 1];
        if (!lastPoint?.updated_at) return lastPoint?.timestamp || '';
        return new Date(lastPoint.updated_at).toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    }, [chartData]);

    const toggleLine = (lineKey: string) => {
        setHiddenLines((current) =>
            current.includes(lineKey)
                ? current.filter((key) => key !== lineKey)
                : [...current, lineKey]
        );
    };

    const submitFilter = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.get(
            `${appUrl}/devices/${device.id}/dashboard`,
            {
                start_date: filterForm.data.start_date,
                end_date: filterForm.data.end_date,
                view,
            },
            { preserveScroll: true },
        );
    };

    const refreshData = () => {
        filterForm.post(`${appUrl}/devices/${device.id}/dashboard/refresh`, {
            preserveScroll: true,
            onBefore: () => {
                toast.info("Solicitando atualização dos dados...");
            },
            onSuccess: () => {
                toast.success("Processamento iniciado!", {
                    description: "Os gráficos serão atualizados em breve em segundo plano."
                });

                if (pollingRef.current) window.clearInterval(pollingRef.current);

                const statusUrl = `${appUrl}/devices/${device.id}/dashboard/refresh/status`;
                let tries = 0;
                const maxTries = 60;

                pollingRef.current = window.setInterval(async () => {
                    tries += 1;
                    try {
                        const res = await fetch(statusUrl, { headers: { Accept: 'application/json' } });
                        const status = await res.json();

                        if (status?.state === 'done') {
                            if (pollingRef.current) window.clearInterval(pollingRef.current);
                            pollingRef.current = null;
                            toast.success('Dados atualizados.');
                            router.reload({ preserveScroll: true } as any);
                            return;
                        }

                        if (status?.state === 'failed') {
                            if (pollingRef.current) window.clearInterval(pollingRef.current);
                            pollingRef.current = null;
                            toast.error('Falha ao atualizar os dados.');
                            return;
                        }
                    } catch {
                        // erro de rede ignorado para manter polling
                    }

                    if (tries >= maxTries) {
                        if (pollingRef.current) window.clearInterval(pollingRef.current);
                        pollingRef.current = null;
                        toast.info('Atualização ainda em andamento. Recarregue em instantes.');
                    }
                }, 2000);
            },
            onError: () => {
                toast.error("Erro ao solicitar atualização.");
            }
        });
    };

        const exportCsv = () => {
            const params = new URLSearchParams({
                start_date: filterForm.data.start_date,
                end_date: filterForm.data.end_date,
                view: view,
            });
            window.open(`${appUrl}/devices/${device.id}/dashboard/export?${params.toString()}`, '_blank');
        };

    const isSimulation = view === 'simulacao';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Dashboard - ${device.name}`} />

            {mounted && weather && (
                <div className="fixed top-4 right-6 z-[60] hidden md:flex items-center gap-3 px-3 py-1 bg-background/50 backdrop-blur-sm border rounded-full shadow-sm animate-in fade-in duration-500">
                    <div className="flex items-center gap-1.5 text-orange-500">
                        <Sun className="size-4" />
                        <span className="text-xs font-bold text-foreground">{weather.temp.toFixed(1)}°C</span>
                    </div>
                    <div className="w-px h-3 bg-border" />
                    <div className="flex items-center gap-1.5 text-blue-500">
                        <CloudRain className="size-4" />
                        <span className="text-xs font-bold text-foreground">{weather.humidity}%</span>
                    </div>
                    {weather.locationLabel && (
                        <div className="flex items-center gap-1 ml-1 text-muted-foreground border-l pl-2 max-w-[150px]">
                            <MapPin className="size-3 flex-shrink-0" />
                            <span className="text-[9px] font-bold uppercase truncate">
                                {weather.locationLabel}
                            </span>
                        </div>
                    )}
                </div>
            )}

            <div className="flex flex-1 flex-col gap-4 p-4 w-full">
                <DashboardHeader
                    deviceName={device.name}
                    macAddress={device.mac_address}
                    view={view}
                    onViewChange={setView}
                />

                <DashboardPeriodFilter
                    startDate={filterForm.data.start_date}
                    endDate={filterForm.data.end_date}
                    processing={filterForm.processing}
                    onStartDateChange={(v) => filterForm.setData('start_date', v)}
                    onEndDateChange={(v) => filterForm.setData('end_date', v)}
                    onSubmit={submitFilter}
                    onApplyPreset={(start, end) => {
                        router.get(
                            `${appUrl}/devices/${device.id}/dashboard`,
                            { start_date: start, end_date: end, view },
                            { preserveScroll: true },
                        );
                    }}
                    onRefresh={refreshData}
                    onExportCsv={exportCsv}
                />

                {isSimulation ? (
                    <DashboardSimulation 
                        chartData={chartData} 
                        energyCards={energyCards} 
                        is_generate={!!device.is_generate}
                        deviceName={device.name}
                        macAddress={device.mac_address}
                        startDate={filterForm.data.start_date}
                        endDate={filterForm.data.end_date}
                    />
                ) : (
                    <>
                        <DashboardStatCards
                            view={view}
                            energyCards={energyCards}
                            summaryCards={visibleSummaryCards}
                            is_generate={!!device.is_generate}
                        />

                        {mounted && (
                            <>
                                <DashboardChart
                                    view={view}
                                    chartData={chartData}
                                    hiddenLineKeys={hiddenLines}
                                    onToggleLine={toggleLine}
                                    is_generate={!!device.is_generate}
                                />
                                {isPartialLastPoint && (
                                    <p className="mt-1 text-right text-xs text-muted-foreground">
                                        * Último período parcial, (atualizado em {lastUpdateLabel}) - dados em atualização
                                    </p>
                                )}
                            </>
                        )}
                    </>
                )}

                <AppFooter hint={
                    isSimulation
                        ? 'Simulação baseada no consumo do período filtrado.'
                        : 'Clique na legenda do gráfico para ocultar/exibir séries.'
                } />
            </div>
        </AppLayout>
    );
}