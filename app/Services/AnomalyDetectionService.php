<?php

namespace App\Services;

use App\Models\Device;
use Illuminate\Support\Facades\Notification;
use App\Notifications\AnomalyDetectedNotification;

class AnomalyDetectionService
{
    /**
     * Detecta anomalias nas métricas fornecidas.
     * Foco de notificação: Tensões de fase (Fase-Neutro).
     */
    public function detect(array $metrics, ?float $nominalVoltage = null): array
    {
        $anomalies = [];

        // 1. Definição da Tensão Nominal
        // Prefer explicit nominalVoltage if provided. Otherwise, prefer a configured default
        // (DEFAULT_NOMINAL_VOLTAGE env or 220.0). Using a fixed nominal avoids missing
        // global under-voltage events when all phases are reduced together.
        if ($nominalVoltage === null) {
            $nominalVoltage = (float) env('DEFAULT_NOMINAL_VOLTAGE', 220.0);
        }

        /**
         * 2. Verificação de Tensão: SOMENTE para tensões de fase (_n)
         * Ignoramos tensões de linha (_l1_l2, etc.) para fins de notificação de anomalia de rede.
         */
        foreach (['tensao_l1_n', 'tensao_l2_n', 'tensao_l3_n'] as $phase) {
            if (isset($metrics[$phase]) && is_numeric($metrics[$phase])) {
                $measured = (float) $metrics[$phase];
                $pct = (($measured - $nominalVoltage) / $nominalVoltage) * 100.0;

                // Regra: -8% inferior e +5% superior
                if ($pct < -8.0 || $pct > 5.0) {
                    $anomalies[] = [
                        'type' => 'voltage',
                        'phase' => $phase,
                        'measured' => round($measured, 2),
                        'nominal' => round($nominalVoltage, 2),
                        'deviation_pct' => round($pct, 2),
                    ];
                }
            }
        }

        // 3. Fator de Potência Total (Limite 0.92)
        $fp = null;
        if (isset($metrics['fator_potencia_total']) && is_numeric($metrics['fator_potencia_total'])) {
            $fp = (float) $metrics['fator_potencia_total'];
        }

        if ($fp !== null && $fp < 0.92) {
            $anomalies[] = [
                'type' => 'power_factor',
                'measured' => $fp,
            ];
        }

        // 4. Frequência (Limite 59.9Hz a 60.1Hz)
        if (isset($metrics['frequencia']) && is_numeric($metrics['frequencia'])) {
            $hz = (float) $metrics['frequencia'];
            if ($hz < 59.9 || $hz > 60.1) {
                $anomalies[] = [
                    'type' => 'frequency',
                    'measured' => $hz,
                ];
            }
        }

        return $anomalies;
    }

    public function detectAndNotify(Device $device, array $metrics, ?float $nominalVoltage = null): array
    {
        // If no explicit nominalVoltage was passed, try device attribute or env default inside detect().
        // Prefer passed nominalVoltage, otherwise use device-specific nominal_voltage when available,
        // falling back to env/default inside detect().
        $deviceNominal = $device->nominal_voltage ?? null;
        $anomalies = $this->detect($metrics, $nominalVoltage ?? $deviceNominal);

        if (!empty($anomalies)) {
                // Throttle notifications per device to avoid spamming users.
                // Configure via ANOMALY_NOTIFICATION_THROTTLE_MINUTES in .env (default: 30 minutes)
                $throttleMinutes = (int) env('ANOMALY_NOTIFICATION_THROTTLE_MINUTES', 30);
                $cacheKey = "anomaly_notification_sent:device:{$device->id}";

                if (cache()->has($cacheKey)) {
                    // Already sent recently — skip notification but still return anomalies
                    return $anomalies;
                }

                $users = $device->users()->get();
                if ($users->isNotEmpty()) {
                    Notification::send($users, new AnomalyDetectedNotification($device, $anomalies, $metrics));

                    // Mark last sent time in cache to throttle further notifications
                    cache()->put($cacheKey, now()->toDateTimeString(), $throttleMinutes * 60);
                }
            }

            return $anomalies;
        }
}