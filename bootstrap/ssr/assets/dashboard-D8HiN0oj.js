import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import * as React from "react";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./card-BhH9ml4h.js";
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, BarChart, Bar } from "recharts";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { c as cn } from "./app-logo-icon-DzE24oHT.js";
import { B as Button } from "./button-DRMeR9Ma.js";
import { I as Input } from "./input-M0YOvWWM.js";
import { Search, RefreshCw, Download, Zap, Minus, Plus, Receipt, FileDown, Sun, CloudRain, MapPin } from "lucide-react";
import { L as Label } from "./label-DRUcbYUF.js";
import { jsPDF } from "jspdf";
import { A as AppLayout } from "./app-layout-DZbn1Lk-.js";
import { usePage, useForm, router, Head } from "@inertiajs/react";
import { toast } from "sonner";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-label";
import "@radix-ui/react-dialog";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-avatar";
const DASHBOARD_CHART_CONFIG = {
  tensoes_fase: {
    title: "Tensões de Fase (V)",
    lines: [
      { key: "tensao_l1_n", color: "#ef4444", name: "L1-N" },
      { key: "tensao_l2_n", color: "#eab308", name: "L2-N" },
      { key: "tensao_l3_n", color: "#3b82f6", name: "L3-N" }
    ]
  },
  tensoes_linha: {
    title: "Tensões de Linha (V)",
    lines: [
      { key: "tensao_l1_l2", color: "#ef4444", name: "L1-L2" },
      { key: "tensao_l2_l3", color: "#eab308", name: "L2-L3" },
      { key: "tensao_l3_l1", color: "#3b82f6", name: "L3-L1" }
    ]
  },
  correntes: {
    title: "Correntes (A)",
    lines: [
      { key: "corrente_l1", color: "#ef4444", name: "Fase 1" },
      { key: "corrente_l2", color: "#eab308", name: "Fase 2" },
      { key: "corrente_l3", color: "#3b82f6", name: "Fase 3" },
      { key: "corrente_neutro", color: "#8b5cf6", name: "Neutro" }
    ]
  },
  potencias: {
    title: "Potências",
    lines: [
      { key: "potencia_ativa", color: "#10b981", name: "Ativa (kW)" },
      { key: "potencia_reativa", color: "#f97316", name: "Reativa (kVAr)" },
      { key: "potencia_aparente", color: "#0ea5e9", name: "Aparente (kVA)" }
    ]
  },
  sistema: {
    title: "Sistema",
    lines: [
      { key: "fator_potencia", color: "#6366f1", name: "Fator de potência" },
      { key: "frequencia", color: "#14b8a6", name: "Frequência (Hz)" }
    ]
  },
  energias: {
    title: "Energias acumuladas",
    lines: [
      { key: "energia_ativa_importada_ultima", color: "#22c55e", name: "Ativa importada (kWh)" },
      { key: "energia_ativa_exportada_ultima", color: "#06b6d4", name: "Ativa exportada (kWh)" },
      { key: "energia_reativa_importada_ultima", color: "#a855f7", name: "Reativa importada (kVArh)" },
      { key: "energia_reativa_exportada_ultima", color: "#f43f5e", name: "Reativa exportada (kVArh)" }
    ]
  },
  simulacao: {
    title: "Simulação de Fatura",
    lines: []
  }
};
const SUMMARY_CARD_KEYS_BY_VIEW = {
  tensoes_fase: ["tensao_l1_n_media", "tensao_l2_n_media", "tensao_l3_n_media"],
  tensoes_linha: ["tensao_l1_l2_media", "tensao_l2_l3_media", "tensao_l3_l1_media"],
  correntes: ["corrente_l1_media", "corrente_l2_media", "corrente_l3_media", "corrente_neutro_media"],
  potencias: ["potencia_ativa_total_media", "potencia_reativa_total_media", "potencia_aparente_total_media"],
  sistema: ["fator_potencia_total_media", "frequencia_media"],
  energias: [],
  simulacao: []
};
function filterSummaryCardsForView(summaryCards, view) {
  const allowed = new Set(SUMMARY_CARD_KEYS_BY_VIEW[view]);
  return summaryCards.filter((card) => allowed.has(card.key));
}
const EXPORT_LINE_KEYS = /* @__PURE__ */ new Set([
  "energia_ativa_exportada_ultima",
  "energia_reativa_exportada_ultima"
]);
function DashboardChart({ view, chartData, hiddenLineKeys, onToggleLine, is_generate }) {
  const { title, lines: allLines } = DASHBOARD_CHART_CONFIG[view];
  const lines = is_generate ? allLines : allLines.filter((line) => !EXPORT_LINE_KEYS.has(line.key));
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const formatDateTime = (value) => new Date(value).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
  if (!chartData || chartData.length === 0) {
    return /* @__PURE__ */ jsxs(Card, { className: "flex-1 w-full", children: [
      /* @__PURE__ */ jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-base sm:text-lg", children: title }) }),
      /* @__PURE__ */ jsx(CardContent, { className: "h-[250px] sm:h-[350px] md:h-[400px] flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "text-muted-foreground text-sm", children: "Sem dados para exibir" }) })
    ] });
  }
  return /* @__PURE__ */ jsxs(Card, { className: "flex-1 min-w-0 w-full", children: [
    /* @__PURE__ */ jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-base sm:text-lg", children: title }) }),
    /* @__PURE__ */ jsx(CardContent, { className: "h-[250px] sm:h-[350px] md:h-[400px] w-full pt-2 sm:pt-4 px-2 sm:px-6", children: /* @__PURE__ */ jsx("div", { className: "w-full h-full min-w-0 min-h-0", children: mounted && /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(
      LineChart,
      {
        data: chartData,
        margin: {
          top: 5,
          right: 8,
          left: -10,
          bottom: 5
        },
        children: [
          /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", vertical: false, strokeOpacity: 0.2 }),
          /* @__PURE__ */ jsx(
            XAxis,
            {
              dataKey: "timestamp",
              fontSize: 10,
              tickLine: false,
              axisLine: false,
              tick: { fontSize: 10 },
              interval: "preserveStartEnd"
            }
          ),
          /* @__PURE__ */ jsx(
            YAxis,
            {
              fontSize: 10,
              tickLine: false,
              axisLine: false,
              tick: { fontSize: 10 },
              width: 60
            }
          ),
          /* @__PURE__ */ jsx(
            Tooltip,
            {
              content: ({ active, payload, label }) => {
                if (!active || !payload || payload.length === 0) {
                  return null;
                }
                const originalData = payload[0].payload;
                const periodoLabel = originalData?.periodo_inicio ? formatDateTime(originalData.periodo_inicio) : label;
                const updatedAtLabel = originalData?.updated_at ? formatDateTime(originalData.updated_at) : null;
                return /* @__PURE__ */ jsxs(
                  "div",
                  {
                    style: {
                      backgroundColor: "#0f172a",
                      border: "none",
                      borderRadius: "8px",
                      padding: "10px 12px"
                    },
                    children: [
                      /* @__PURE__ */ jsx("p", { style: { color: "#38bdf8", fontWeight: 600, marginBottom: "6px" }, children: periodoLabel }),
                      payload.map((entry) => {
                        const value = typeof entry.value === "number" ? entry.value.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        }) : entry.value ?? "0";
                        return /* @__PURE__ */ jsxs("p", { style: { color: "#e2e8f0", margin: 0 }, children: [
                          entry.name,
                          ": ",
                          value
                        ] }, String(entry.dataKey));
                      }),
                      updatedAtLabel && /* @__PURE__ */ jsxs(
                        "p",
                        {
                          style: {
                            color: "#94a3b8",
                            marginTop: "8px",
                            paddingTop: "6px",
                            borderTop: "1px solid rgba(148,163,184,0.2)",
                            fontSize: "11px"
                          },
                          children: [
                            "Última atualização: ",
                            updatedAtLabel
                          ]
                        }
                      )
                    ]
                  }
                );
              }
            }
          ),
          /* @__PURE__ */ jsx(
            Legend,
            {
              verticalAlign: "top",
              height: 36,
              wrapperStyle: { fontSize: "11px", cursor: "pointer" },
              onClick: (entry) => {
                if (entry.dataKey) {
                  onToggleLine(String(entry.dataKey));
                }
              }
            }
          ),
          lines.map((line) => /* @__PURE__ */ jsx(
            Line,
            {
              type: "monotone",
              dataKey: line.key,
              name: line.name,
              stroke: line.color,
              strokeWidth: 2,
              dot: false,
              activeDot: { r: 4 },
              hide: hiddenLineKeys.includes(line.key)
            },
            line.key
          ))
        ]
      }
    ) }, view) }) })
  ] });
}
const Tabs = TabsPrimitive.Root;
const TabsList = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  TabsPrimitive.List,
  {
    ref,
    className: cn(
      "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
      className
    ),
    ...props
  }
));
TabsList.displayName = TabsPrimitive.List.displayName;
const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  TabsPrimitive.Trigger,
  {
    ref,
    className: cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
      className
    ),
    ...props
  }
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;
const TabsContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  TabsPrimitive.Content,
  {
    ref,
    className: cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    ),
    ...props
  }
));
TabsContent.displayName = TabsPrimitive.Content.displayName;
function DashboardHeader({ deviceName, macAddress, view, onViewChange }) {
  const tabs = [
    { value: "tensoes_fase", label: "Tensão Fase", short: "T. Fase" },
    { value: "tensoes_linha", label: "Tensão Linha", short: "T. Linha" },
    { value: "correntes", label: "Correntes", short: "Corr." },
    { value: "potencias", label: "Potências", short: "Pot." },
    { value: "sistema", label: "Sistema", short: "Sist." },
    { value: "energias", label: "Energias", short: "Energ." },
    { value: "simulacao", label: "Simulador", short: "Simu." }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 md:flex-row md:items-center md:justify-between", children: [
    /* @__PURE__ */ jsxs("div", { className: "shrink-0", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold leading-tight tracking-tight sm:text-2xl", children: deviceName }),
      /* @__PURE__ */ jsxs("p", { className: "text-muted-foreground mt-0.5 text-xs font-mono sm:text-sm", children: [
        "ID: ",
        macAddress
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      Tabs,
      {
        value: view,
        onValueChange: (v) => onViewChange(v),
        className: "w-full md:w-auto",
        children: /* @__PURE__ */ jsx("div", { className: "relative -mx-4 px-4 md:mx-0 md:px-0", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto scrollbar-none", children: /* @__PURE__ */ jsx(
          TabsList,
          {
            className: "\n                                flex w-max gap-1.5\n                                rounded-xl border border-border/60 bg-background/60 p-1\n                                backdrop-blur supports-[backdrop-filter]:bg-background/40\n                                min-w-full md:min-w-0 md:grid md:w-full md:grid-cols-7 md:gap-1\n                            ",
            children: tabs.map((tab) => /* @__PURE__ */ jsxs(
              TabsTrigger,
              {
                value: tab.value,
                className: "\n                                    cursor-pointer\n                                    whitespace-nowrap\n                                    rounded-xl\n                                    px-3 py-2\n                                    text-xs font-semibold\n                                    text-muted-foreground\n                                    transition-colors\n                                    hover:text-foreground\n                                    data-[state=active]:bg-primary data-[state=active]:text-primary-foreground\n                                    data-[state=active]:shadow-sm\n                                    md:px-2 md:py-1.5\n                                ",
                children: [
                  /* @__PURE__ */ jsx("span", { className: "md:hidden", children: tab.short }),
                  /* @__PURE__ */ jsx("span", { className: "hidden md:inline", children: tab.label })
                ]
              },
              tab.value
            ))
          }
        ) }) })
      }
    )
  ] });
}
function buildPresets() {
  const today = /* @__PURE__ */ new Date();
  const fmt = (d) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };
  const sub = (days) => {
    const d = new Date(today);
    d.setDate(d.getDate() - days);
    return d;
  };
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  return [
    { label: "Hoje", start: fmt(today), end: fmt(today) },
    { label: "7 dias", start: fmt(sub(6)), end: fmt(today) },
    { label: "30 dias", start: fmt(sub(29)), end: fmt(today) },
    { label: "Mês atual", start: fmt(startOfMonth), end: fmt(today) }
  ];
}
function periodLabel(start, end) {
  if (!start || !end) return "";
  const fmt = (s) => (/* @__PURE__ */ new Date(s + "T12:00:00")).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short"
  });
  return start === end ? fmt(start) : `${fmt(start)} → ${fmt(end)}`;
}
function DashboardPeriodFilter({
  startDate,
  endDate,
  processing,
  onStartDateChange,
  onEndDateChange,
  onSubmit,
  onApplyPreset,
  onRefresh,
  onExportCsv
}) {
  const presets = buildPresets();
  const applyPreset = useCallback(
    (preset) => {
      onStartDateChange(preset.start);
      onEndDateChange(preset.end);
      onApplyPreset(preset.start, preset.end);
    },
    [onStartDateChange, onEndDateChange, onApplyPreset]
  );
  const isActivePreset = (preset) => preset.start === startDate && preset.end === endDate;
  return /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-card px-5 py-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-3 flex flex-wrap items-start justify-between gap-y-2", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium leading-none text-foreground", children: "Período de análise" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: periodLabel(startDate, endDate) || "Selecione o intervalo" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1.5", children: presets.map((preset) => /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => applyPreset(preset),
          disabled: processing,
          className: cn(
            "cursor-pointer disabled:cursor-not-allowed rounded-full border px-3 py-0.5 text-xs font-medium transition-colors disabled:opacity-50",
            isActivePreset(preset) ? "border-primary/40 bg-primary/10 text-primary" : "border-border bg-transparent text-muted-foreground hover:border-border/80 hover:bg-accent hover:text-accent-foreground"
          ),
          children: preset.label
        },
        preset.label
      )) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mb-3 border-t border-border/60" }),
    /* @__PURE__ */ jsxs(
      "form",
      {
        onSubmit,
        className: "flex flex-wrap items-end gap-2",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-1 items-end gap-2 min-w-[260px]", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-1 flex-col gap-1", children: [
              /* @__PURE__ */ jsx("label", { className: "text-[11px] font-semibold uppercase tracking-wide text-muted-foreground", children: "De" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  type: "date",
                  value: startDate,
                  max: endDate,
                  onChange: (e) => onStartDateChange(e.target.value),
                  required: true,
                  className: "h-9 text-sm"
                }
              )
            ] }),
            /* @__PURE__ */ jsx("span", { className: "mb-1.5 shrink-0 text-muted-foreground/50", children: "→" }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-1 flex-col gap-1", children: [
              /* @__PURE__ */ jsx("label", { className: "text-[11px] font-semibold uppercase tracking-wide text-muted-foreground", children: "Até" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  type: "date",
                  value: endDate,
                  min: startDate,
                  onChange: (e) => onEndDateChange(e.target.value),
                  required: true,
                  className: "h-9 text-sm"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex shrink-0 items-center gap-1.5", children: [
            /* @__PURE__ */ jsxs(
              Button,
              {
                type: "submit",
                variant: "default",
                size: "sm",
                disabled: processing,
                className: "h-9 gap-1.5 px-4 text-sm cursor-pointer",
                children: [
                  /* @__PURE__ */ jsx(Search, { className: "size-3.5" }),
                  "Filtrar"
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              Button,
              {
                type: "button",
                variant: "outline",
                size: "sm",
                onClick: onRefresh,
                disabled: processing,
                className: "h-9 gap-1.5 px-4 text-sm cursor-pointer",
                children: [
                  /* @__PURE__ */ jsx(
                    RefreshCw,
                    {
                      className: cn("size-3.5", processing && "animate-spin")
                    }
                  ),
                  "Atualizar"
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                type: "button",
                variant: "ghost",
                size: "icon",
                onClick: onExportCsv,
                disabled: processing,
                className: "size-9 shrink-0 text-muted-foreground hover:text-foreground cursor-pointer",
                title: "Exportar CSV",
                children: /* @__PURE__ */ jsx(Download, { className: "size-4" })
              }
            )
          ] })
        ]
      }
    )
  ] });
}
function formatNumber(value, digits = 2) {
  if (value === null || Number.isNaN(value)) {
    return "--";
  }
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits
  });
}
function formatPeakTime(value) {
  if (!value) {
    return "";
  }
  return new Date(value).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}
const TARIFA_PRESETS = [0.65, 0.75, 0.85, 0.99];
function DashboardSimulation({
  chartData,
  energyCards,
  is_generate,
  deviceName,
  macAddress,
  startDate,
  endDate
}) {
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
      const fallbackImp = prev && typeof point.energia_ativa_importada_ultima === "number" && typeof prev.energia_ativa_importada_ultima === "number" ? Math.max(0, point.energia_ativa_importada_ultima - prev.energia_ativa_importada_ultima) : 0;
      const fallbackExp = prev && typeof point.energia_ativa_exportada_ultima === "number" && typeof prev.energia_ativa_exportada_ultima === "number" ? Math.max(0, point.energia_ativa_exportada_ultima - prev.energia_ativa_exportada_ultima) : 0;
      const imp = Math.max(0, point.consumo_energia_ativa_importada ?? fallbackImp);
      const rawExp = Math.max(0, point.consumo_energia_ativa_exportada ?? fallbackExp);
      const exp = is_generate ? rawExp : 0;
      return { point, imp, exp };
    });
  }, [chartData, is_generate]);
  const dailyData = useMemo(() => {
    const grouped = {};
    computedEnergyDeltas.forEach(({ point, imp, exp }) => {
      const dateKey = point.periodo_inicio.substring(0, 10);
      const [, month, day] = dateKey.split("-");
      if (!grouped[dateKey]) {
        grouped[dateKey] = {
          label: `${day}/${month}`,
          importada: 0,
          exportada: 0
        };
      }
      grouped[dateKey].importada += imp;
      grouped[dateKey].exportada += exp;
    });
    return Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)).map(([, value]) => value);
  }, [computedEnergyDeltas]);
  const totalImportada = useMemo(() => {
    return computedEnergyDeltas.reduce((acc, row) => acc + row.imp, 0);
  }, [computedEnergyDeltas]);
  const totalExportada = useMemo(() => {
    return computedEnergyDeltas.reduce((acc, row) => acc + row.exp, 0);
  }, [computedEnergyDeltas]);
  const creditoUsado = Math.min(totalImportada, totalExportada);
  const saldoLiquido = Math.max(0, totalImportada - totalExportada);
  const valorLiquido = saldoLiquido * tarifa;
  const adjustTarifa = (delta) => {
    setTarifa((prev) => {
      const next = Math.round((prev + delta) * 100) / 100;
      return Math.max(0.01, next);
    });
  };
  const handleTarifaInput = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value > 0) {
      setTarifa(Math.round(value * 100) / 100);
    }
  };
  const hasData = chartData.length > 0;
  const periodLabel2 = `${(/* @__PURE__ */ new Date(startDate + "T12:00:00")).toLocaleDateString("pt-BR")} a ${(/* @__PURE__ */ new Date(endDate + "T12:00:00")).toLocaleDateString("pt-BR")}`;
  const currency = (value) => new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(value);
  const generatePdf = () => {
    const doc = new jsPDF();
    const generatedAt = (/* @__PURE__ */ new Date()).toLocaleString("pt-BR");
    const filenameDate = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
    doc.setFontSize(16);
    doc.text("Simulação de Fatura de Energia", 14, 20);
    doc.setFontSize(11);
    doc.text(`Medidor: ${deviceName}`, 14, 32);
    doc.text(`MAC: ${macAddress}`, 14, 39);
    doc.text(`Periodo: ${periodLabel2}`, 14, 46);
    doc.text(`Gerado em: ${generatedAt}`, 14, 53);
    doc.setDrawColor(220, 220, 220);
    doc.line(14, 58, 196, 58);
    doc.setFontSize(13);
    doc.text("Resumo da simulação", 14, 70);
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
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs(Card, { className: "w-full min-w-[300px]", children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2 text-base font-semibold", children: [
        /* @__PURE__ */ jsx(Zap, { className: "size-4 text-yellow-500 fill-yellow-500" }),
        "Importação ",
        is_generate && "vs Exportação",
        " — Consumo Diário"
      ] }) }),
      /* @__PURE__ */ jsx(CardContent, { className: "h-[320px] pt-4", children: hasData && ready ? /* @__PURE__ */ jsx(ResponsiveContainer, { width: "99%", height: 320, children: /* @__PURE__ */ jsxs(
        BarChart,
        {
          data: dailyData,
          margin: { top: 10, right: 10, left: 0, bottom: 0 },
          barCategoryGap: "35%",
          children: [
            /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", vertical: false, strokeOpacity: 0.1 }),
            /* @__PURE__ */ jsx(XAxis, { dataKey: "label", fontSize: 12, tickLine: false, axisLine: false }),
            /* @__PURE__ */ jsx(
              YAxis,
              {
                fontSize: 12,
                tickLine: false,
                axisLine: false,
                tickFormatter: (v) => `${formatNumber(v, 0)}`
              }
            ),
            /* @__PURE__ */ jsx(
              Tooltip,
              {
                cursor: { fill: "rgba(0,0,0,0.04)" },
                contentStyle: {
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                  fontSize: 13
                },
                formatter: ((value, name) => [
                  `${formatNumber(value)} kWh`,
                  name
                ])
              }
            ),
            /* @__PURE__ */ jsx(Legend, { verticalAlign: "top", align: "right", height: 40 }),
            /* @__PURE__ */ jsx(
              Bar,
              {
                dataKey: "importada",
                name: "Importada (da rede)",
                fill: "#22c55e",
                stackId: "a",
                radius: is_generate ? [0, 0, 0, 0] : [4, 4, 0, 0]
              }
            ),
            is_generate && /* @__PURE__ */ jsx(
              Bar,
              {
                dataKey: "exportada",
                name: "Exportada (geração)",
                fill: "#06b6d4",
                stackId: "a",
                radius: [4, 4, 0, 0]
              }
            )
          ]
        }
      ) }) : /* @__PURE__ */ jsx("div", { className: "flex h-full items-center justify-center text-sm text-muted-foreground italic", children: "Sem dados ou carregando gráfico..." }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { className: "text-base font-medium", children: "Tarifa Aplicada" }) }),
        /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { className: "text-xs text-muted-foreground", children: "Valor por kWh (R$)" }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Button, { variant: "outline", size: "icon", onClick: () => adjustTarifa(-0.01), className: "cursor-pointer", children: /* @__PURE__ */ jsx(Minus, { className: "size-4" }) }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  type: "number",
                  value: tarifa,
                  onChange: handleTarifaInput,
                  className: "text-center font-mono text-lg font-bold"
                }
              ),
              /* @__PURE__ */ jsx(Button, { variant: "outline", size: "icon", onClick: () => adjustTarifa(0.01), className: "cursor-pointer", children: /* @__PURE__ */ jsx(Plus, { className: "size-4" }) })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-4 gap-2", children: TARIFA_PRESETS.map((v) => /* @__PURE__ */ jsx(
            Button,
            {
              variant: tarifa === v ? "default" : "outline",
              size: "sm",
              className: "text-xs cursor-pointer",
              onClick: () => setTarifa(v),
              children: v.toFixed(2)
            },
            v
          )) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, { className: "text-base font-medium", children: [
          /* @__PURE__ */ jsx(Receipt, { className: "inline size-4 mr-1" }),
          "Fatura Estimada"
        ] }) }),
        /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsx("span", { children: "Consumo" }),
            /* @__PURE__ */ jsxs("span", { children: [
              formatNumber(totalImportada),
              " kWh"
            ] })
          ] }),
          is_generate && /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsx("span", { children: "Exportado" }),
            /* @__PURE__ */ jsxs("span", { children: [
              formatNumber(totalExportada),
              " kWh"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "border-t pt-2 flex justify-between font-bold", children: [
            /* @__PURE__ */ jsx("span", { children: "Total a pagar" }),
            /* @__PURE__ */ jsx("span", { children: currency(valorLiquido) })
          ] }),
          /* @__PURE__ */ jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              className: "w-full",
              onClick: generatePdf,
              disabled: !hasData,
              children: [
                /* @__PURE__ */ jsx(FileDown, { className: "size-4" }),
                "Gerar PDF da simulação"
              ]
            }
          )
        ] })
      ] })
    ] })
  ] });
}
const EXPORT_ENERGY_KEYS = /* @__PURE__ */ new Set([
  "energia_ativa_exportada_ultima",
  "energia_reativa_exportada_ultima"
]);
function DashboardStatCards({ view, energyCards, summaryCards, is_generate }) {
  if (view === "energias") {
    const visibleEnergyCards = is_generate ? energyCards : energyCards.filter((card) => !EXPORT_ENERGY_KEYS.has(card.key));
    return /* @__PURE__ */ jsx("div", { className: "grid gap-4 md:grid-cols-2 xl:grid-cols-4", children: visibleEnergyCards.map((card) => /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-sm", children: card.label }) }),
      /* @__PURE__ */ jsxs(CardContent, { className: "space-y-1 text-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Acumulado" }),
          /* @__PURE__ */ jsxs("span", { className: "font-medium", children: [
            formatNumber(card.total),
            " ",
            card.unit
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Parcial" }),
          /* @__PURE__ */ jsxs("span", { className: "font-medium", children: [
            formatNumber(card.consumo),
            " ",
            card.unit
          ] })
        ] })
      ] })
    ] }, card.key)) });
  }
  return /* @__PURE__ */ jsx("div", { className: "grid gap-4 md:grid-cols-2 xl:grid-cols-4", children: summaryCards.map((card) => /* @__PURE__ */ jsxs(Card, { children: [
    /* @__PURE__ */ jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-1 text-sm font-medium leading-tight", children: [
      card.label,
      card.unit ? /* @__PURE__ */ jsxs("span", { className: "text-muted-foreground text-xs", children: [
        "(",
        card.unit,
        ")"
      ] }) : null
    ] }) }),
    /* @__PURE__ */ jsx(CardContent, { className: "space-y-2 pt-0", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2 text-center", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center", children: [
        /* @__PURE__ */ jsx("div", { className: "text-muted-foreground text-[11px] tracking-wide uppercase", children: "Mín." }),
        /* @__PURE__ */ jsx("div", { className: "text-sm font-bold tabular-nums", children: formatNumber(card.min) }),
        formatPeakTime(card.min_at) && /* @__PURE__ */ jsx("div", { className: "text-muted-foreground text-[10px] whitespace-nowrap mt-1", title: card.min_at ?? void 0, children: formatPeakTime(card.min_at) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center", children: [
        /* @__PURE__ */ jsx("div", { className: "text-muted-foreground text-[11px] tracking-wide uppercase", children: "Média" }),
        /* @__PURE__ */ jsx("div", { className: "text-sm font-bold tabular-nums", children: formatNumber(card.avg) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center", children: [
        /* @__PURE__ */ jsx("div", { className: "text-muted-foreground text-[11px] tracking-wide uppercase", children: "Máx." }),
        /* @__PURE__ */ jsx("div", { className: "text-sm font-bold tabular-nums", children: formatNumber(card.max) }),
        formatPeakTime(card.max_at) && /* @__PURE__ */ jsx("div", { className: "text-muted-foreground text-[10px] whitespace-nowrap mt-1", title: card.max_at ?? void 0, children: formatPeakTime(card.max_at) })
      ] })
    ] }) })
  ] }, card.key)) });
}
function AppFooter({ className, hint, children, ...props }) {
  const year = (/* @__PURE__ */ new Date()).getFullYear();
  return /* @__PURE__ */ jsxs(
    "footer",
    {
      className: cn(
        "text-muted-foreground mt-auto border-t px-4 py-4 text-center text-xs sm:flex sm:items-center sm:justify-between sm:text-left",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsxs("p", { children: [
          "Tecnoeletro | © ",
          year
        ] }),
        hint ? /* @__PURE__ */ jsx("p", { className: "mt-2 max-w-xl sm:mt-0", children: hint }) : null,
        children
      ]
    }
  );
}
function Dashboard({
  device,
  chartData = [],
  summaryCards = [],
  energyCards = [],
  filters
}) {
  const appUrl = usePage().props.appUrl;
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState(filters.view || "tensoes_fase");
  const [hiddenLines, setHiddenLines] = useState([]);
  const [weather, setWeather] = useState(null);
  const pollingRef = useRef(null);
  const filterForm = useForm({
    start_date: filters.start_date,
    end_date: filters.end_date,
    view
  });
  const { setData } = filterForm;
  useEffect(() => {
    setMounted(true);
    const fetchWeatherAndCity = async (lat, lon) => {
      try {
        const weatherPromise = fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m`
        ).then((res) => res.json());
        const geoPromise = fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`,
          { headers: { "Accept-Language": "pt-BR" } }
        ).then((res) => res.json());
        const [weatherData, geoData] = await Promise.all([weatherPromise, geoPromise]);
        const cityLabel = geoData.address?.city || geoData.address?.town || geoData.address?.village || geoData.address?.suburb;
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
  useEffect(() => {
    if (!mounted) return;
    setHiddenLines([]);
    setData("view", view);
    const url = new URL(window.location.href);
    if (url.searchParams.get("view") !== view) {
      url.searchParams.set("view", view);
      window.history.replaceState({}, "", url.toString());
    }
  }, [view, setData, mounted]);
  useEffect(() => {
    const autoReloadInterval = setInterval(() => {
      router.reload({
        preserveScroll: true,
        only: ["chartData", "summaryCards", "energyCards"]
      });
    }, 5 * 60 * 1e3);
    return () => {
      clearInterval(autoReloadInterval);
      if (pollingRef.current) window.clearInterval(pollingRef.current);
    };
  }, []);
  const breadcrumbs = [
    { title: "Meus Dispositivos", href: "/devices" },
    { title: device.name, href: "#" }
  ];
  const visibleSummaryCards = useMemo(
    () => filterSummaryCardsForView(summaryCards, view),
    [summaryCards, view]
  );
  const isPartialLastPoint = useMemo(() => {
    const lastPoint = chartData[chartData.length - 1];
    if (!lastPoint) return false;
    const pointHour = new Date(lastPoint.periodo_inicio);
    const nowDate = /* @__PURE__ */ new Date();
    return pointHour.getFullYear() === nowDate.getFullYear() && pointHour.getMonth() === nowDate.getMonth() && pointHour.getDate() === nowDate.getDate() && pointHour.getHours() === nowDate.getHours();
  }, [chartData]);
  const lastUpdateLabel = useMemo(() => {
    const lastPoint = chartData[chartData.length - 1];
    if (!lastPoint?.updated_at) return lastPoint?.timestamp || "";
    return new Date(lastPoint.updated_at).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }, [chartData]);
  const toggleLine = (lineKey) => {
    setHiddenLines(
      (current) => current.includes(lineKey) ? current.filter((key) => key !== lineKey) : [...current, lineKey]
    );
  };
  const submitFilter = (e) => {
    e.preventDefault();
    router.get(
      `${appUrl}/devices/${device.id}/dashboard`,
      {
        start_date: filterForm.data.start_date,
        end_date: filterForm.data.end_date,
        view
      },
      { preserveScroll: true }
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
            const res = await fetch(statusUrl, { headers: { Accept: "application/json" } });
            const status = await res.json();
            if (status?.state === "done") {
              if (pollingRef.current) window.clearInterval(pollingRef.current);
              pollingRef.current = null;
              toast.success("Dados atualizados.");
              router.reload({ preserveScroll: true });
              return;
            }
            if (status?.state === "failed") {
              if (pollingRef.current) window.clearInterval(pollingRef.current);
              pollingRef.current = null;
              toast.error("Falha ao atualizar os dados.");
              return;
            }
          } catch {
          }
          if (tries >= maxTries) {
            if (pollingRef.current) window.clearInterval(pollingRef.current);
            pollingRef.current = null;
            toast.info("Atualização ainda em andamento. Recarregue em instantes.");
          }
        }, 2e3);
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
      view
    });
    window.open(`${appUrl}/devices/${device.id}/dashboard/export?${params.toString()}`, "_blank");
  };
  const isSimulation = view === "simulacao";
  return /* @__PURE__ */ jsxs(AppLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsx(Head, { title: `Dashboard - ${device.name}` }),
    mounted && weather && /* @__PURE__ */ jsxs("div", { className: "fixed top-4 right-6 z-[60] hidden md:flex items-center gap-3 px-3 py-1 bg-background/50 backdrop-blur-sm border rounded-full shadow-sm animate-in fade-in duration-500", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-orange-500", children: [
        /* @__PURE__ */ jsx(Sun, { className: "size-4" }),
        /* @__PURE__ */ jsxs("span", { className: "text-xs font-bold text-foreground", children: [
          weather.temp.toFixed(1),
          "°C"
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "w-px h-3 bg-border" }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-blue-500", children: [
        /* @__PURE__ */ jsx(CloudRain, { className: "size-4" }),
        /* @__PURE__ */ jsxs("span", { className: "text-xs font-bold text-foreground", children: [
          weather.humidity,
          "%"
        ] })
      ] }),
      weather.locationLabel && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 ml-1 text-muted-foreground border-l pl-2 max-w-[150px]", children: [
        /* @__PURE__ */ jsx(MapPin, { className: "size-3 flex-shrink-0" }),
        /* @__PURE__ */ jsx("span", { className: "text-[9px] font-bold uppercase truncate", children: weather.locationLabel })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-1 flex-col gap-4 p-4 w-full", children: [
      /* @__PURE__ */ jsx(
        DashboardHeader,
        {
          deviceName: device.name,
          macAddress: device.mac_address,
          view,
          onViewChange: setView
        }
      ),
      /* @__PURE__ */ jsx(
        DashboardPeriodFilter,
        {
          startDate: filterForm.data.start_date,
          endDate: filterForm.data.end_date,
          processing: filterForm.processing,
          onStartDateChange: (v) => filterForm.setData("start_date", v),
          onEndDateChange: (v) => filterForm.setData("end_date", v),
          onSubmit: submitFilter,
          onApplyPreset: (start, end) => {
            router.get(
              `${appUrl}/devices/${device.id}/dashboard`,
              { start_date: start, end_date: end, view },
              { preserveScroll: true }
            );
          },
          onRefresh: refreshData,
          onExportCsv: exportCsv
        }
      ),
      isSimulation ? /* @__PURE__ */ jsx(
        DashboardSimulation,
        {
          chartData,
          energyCards,
          is_generate: !!device.is_generate,
          deviceName: device.name,
          macAddress: device.mac_address,
          startDate: filterForm.data.start_date,
          endDate: filterForm.data.end_date
        }
      ) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(
          DashboardStatCards,
          {
            view,
            energyCards,
            summaryCards: visibleSummaryCards,
            is_generate: !!device.is_generate
          }
        ),
        mounted && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(
            DashboardChart,
            {
              view,
              chartData,
              hiddenLineKeys: hiddenLines,
              onToggleLine: toggleLine,
              is_generate: !!device.is_generate
            }
          ),
          isPartialLastPoint && /* @__PURE__ */ jsxs("p", { className: "mt-1 text-right text-xs text-muted-foreground", children: [
            "* Último período parcial, (atualizado em ",
            lastUpdateLabel,
            ") - dados em atualização"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx(AppFooter, { hint: isSimulation ? "Simulação baseada no consumo do período filtrado." : "Clique na legenda do gráfico para ocultar/exibir séries." })
    ] })
  ] });
}
export {
  Dashboard as default
};
