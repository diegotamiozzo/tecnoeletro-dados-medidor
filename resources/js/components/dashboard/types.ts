export type ViewOption =
    | 'tensoes_fase'
    | 'tensoes_linha'
    | 'correntes'
    | 'potencias'
    | 'sistema'
    | 'energias'
    | 'simulacao';

export type ChartPoint = {
    timestamp: string;
    periodo_inicio: string;
    updated_at?: string | null;
    tensao_l1_n: number;
    tensao_l2_n: number;
    tensao_l3_n: number;
    tensao_l1_l2: number;
    tensao_l2_l3: number;
    tensao_l3_l1: number;
    corrente_l1: number;
    corrente_l2: number;
    corrente_l3: number;
    corrente_neutro: number;
    potencia_ativa: number;
    potencia_reativa: number;
    potencia_aparente: number;
    fator_potencia: number;
    frequencia: number;
    // Energias acumuladas (totais do medidor)
    energia_ativa_importada_ultima: number;
    energia_ativa_exportada_ultima: number;
    energia_reativa_importada_ultima: number;
    energia_reativa_exportada_ultima: number;
    // Consumo do período (deltas calculados para o gráfico)
    // Definidos como opcionais para suportar diferentes retornos da API
    consumo_energia_ativa_importada?: number;
    consumo_energia_ativa_exportada?: number;
    importada?: number; 
    exportada?: number;
};

export type SummaryCard = {
    key: string;
    label: string;
    unit: string;
    min: number | null;
    avg: number | null;
    max: number | null;
    min_at?: string | null;
    max_at?: string | null;
};

export type EnergyCard = {
    key: string;
    label: string;
    unit: string;
    total: number | null;
    consumo: number | null;
};

export type ChartLineConfig = { key: string; color: string; name: string };

export type ChartViewConfig = { title: string; lines: ChartLineConfig[] };

export const DASHBOARD_CHART_CONFIG: Record<ViewOption, ChartViewConfig> = {
    tensoes_fase: {
        title: 'Tensões de Fase (V)',
        lines: [
            { key: 'tensao_l1_n', color: '#ef4444', name: 'L1-N' },
            { key: 'tensao_l2_n', color: '#eab308', name: 'L2-N' },
            { key: 'tensao_l3_n', color: '#3b82f6', name: 'L3-N' },
        ],
    },
    tensoes_linha: {
        title: 'Tensões de Linha (V)',
        lines: [
            { key: 'tensao_l1_l2', color: '#ef4444', name: 'L1-L2' },
            { key: 'tensao_l2_l3', color: '#eab308', name: 'L2-L3' },
            { key: 'tensao_l3_l1', color: '#3b82f6', name: 'L3-L1' },
        ],
    },
    correntes: {
        title: 'Correntes (A)',
        lines: [
            { key: 'corrente_l1', color: '#ef4444', name: 'Fase 1' },
            { key: 'corrente_l2', color: '#eab308', name: 'Fase 2' },
            { key: 'corrente_l3', color: '#3b82f6', name: 'Fase 3' },
            { key: 'corrente_neutro', color: '#8b5cf6', name: 'Neutro' },
        ],
    },
    potencias: {
        title: 'Potências',
        lines: [
            { key: 'potencia_ativa', color: '#10b981', name: 'Ativa (kW)' },
            { key: 'potencia_reativa', color: '#f97316', name: 'Reativa (kVAr)' },
            { key: 'potencia_aparente', color: '#0ea5e9', name: 'Aparente (kVA)' },
        ],
    },
    sistema: {
        title: 'Sistema',
        lines: [
            { key: 'fator_potencia', color: '#6366f1', name: 'Fator de potência' },
            { key: 'frequencia', color: '#14b8a6', name: 'Frequência (Hz)' },
        ],
    },
    energias: {
        title: 'Energias acumuladas',
        lines: [
            { key: 'energia_ativa_importada_ultima', color: '#22c55e', name: 'Ativa importada (kWh)' },
            { key: 'energia_ativa_exportada_ultima', color: '#06b6d4', name: 'Ativa exportada (kWh)' },
            { key: 'energia_reativa_importada_ultima', color: '#a855f7', name: 'Reativa importada (kVArh)' },
            { key: 'energia_reativa_exportada_ultima', color: '#f43f5e', name: 'Reativa exportada (kVArh)' },
        ],
    },
    simulacao: {
        title: 'Simulação de Fatura',
        lines: [],
    },
};

const SUMMARY_CARD_KEYS_BY_VIEW: Record<ViewOption, string[]> = {
    tensoes_fase: ['tensao_l1_n_media', 'tensao_l2_n_media', 'tensao_l3_n_media'],
    tensoes_linha: ['tensao_l1_l2_media', 'tensao_l2_l3_media', 'tensao_l3_l1_media'],
    correntes: ['corrente_l1_media', 'corrente_l2_media', 'corrente_l3_media', 'corrente_neutro_media'],
    potencias: ['potencia_ativa_total_media', 'potencia_reativa_total_media', 'potencia_aparente_total_media'],
    sistema: ['fator_potencia_total_media', 'frequencia_media'],
    energias: [],
    simulacao: [],
};

export function filterSummaryCardsForView(summaryCards: SummaryCard[], view: ViewOption): SummaryCard[] {
    const allowed = new Set(SUMMARY_CARD_KEYS_BY_VIEW[view]);
    return summaryCards.filter((card) => allowed.has(card.key));
}

export const VIEW_OPTIONS: ViewOption[] = [
    'tensoes_fase',
    'tensoes_linha',
    'correntes',
    'potencias',
    'sistema',
    'energias',
    'simulacao'
];