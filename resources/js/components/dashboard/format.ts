export function formatNumber(value: number | null, digits = 2): string {
    if (value === null || Number.isNaN(value)) {
        return '--';
    }

    return value.toLocaleString('pt-BR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: digits,
    });
}

/** Horário curto para picos (dd/mm, hh:mm). */
export function formatPeakTime(value?: string | null): string {
    if (!value) {
        return '';
    }

    return new Date(value).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
}
