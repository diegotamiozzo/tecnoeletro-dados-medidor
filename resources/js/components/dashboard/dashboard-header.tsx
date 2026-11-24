import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { type ViewOption } from '@/components/dashboard/types';

type Props = {
    deviceName: string;
    macAddress: string;
    view: ViewOption;
    onViewChange: (view: ViewOption) => void;
};

export function DashboardHeader({ deviceName, macAddress, view, onViewChange }: Props) {
    const tabs = [
        { value: "tensoes_fase",  label: "Tensão Fase",  short: "T. Fase"  },
        { value: "tensoes_linha", label: "Tensão Linha", short: "T. Linha" },
        { value: "correntes",     label: "Correntes",    short: "Corr."    },
        { value: "potencias",     label: "Potências",    short: "Pot."     },
        { value: "sistema",       label: "Sistema",      short: "Sist."    },
        { value: "energias",      label: "Energias",     short: "Energ."   },
        { value: "simulacao",     label: "Simulador",    short: "Simu."     },
    ];

    return (
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="shrink-0">
                <h2 className="text-lg font-bold leading-tight tracking-tight sm:text-2xl">
                    {deviceName}
                </h2>
                <p className="text-muted-foreground mt-0.5 text-xs font-mono sm:text-sm">
                    ID: {macAddress}
                </p>
            </div>

            <Tabs
                value={view}
                onValueChange={(v) => onViewChange(v as ViewOption)}
                className="w-full md:w-auto"
            >
                {/* Scrollable wrapper para mobile */}
                <div className="relative -mx-4 px-4 md:mx-0 md:px-0">
                    <div className="overflow-x-auto scrollbar-none">
                        <TabsList
                            className="
                                flex w-max gap-1.5
                                rounded-xl border border-border/60 bg-background/60 p-1
                                backdrop-blur supports-[backdrop-filter]:bg-background/40
                                min-w-full md:min-w-0 md:grid md:w-full md:grid-cols-7 md:gap-1
                            "
                        >
                        {tabs.map((tab) => (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                className="
                                    cursor-pointer
                                    whitespace-nowrap
                                    rounded-xl
                                    px-3 py-2
                                    text-xs font-semibold
                                    text-muted-foreground
                                    transition-colors
                                    hover:text-foreground
                                    data-[state=active]:bg-primary data-[state=active]:text-primary-foreground
                                    data-[state=active]:shadow-sm
                                    md:px-2 md:py-1.5
                                "
                            >
                                {/* Label abreviado no mobile, completo no desktop */}
                                <span className="md:hidden">{tab.short}</span>
                                <span className="hidden md:inline">{tab.label}</span>
                            </TabsTrigger>
                        ))}
                        </TabsList>
                    </div>
                </div>
            </Tabs>
        </div>
    );
}