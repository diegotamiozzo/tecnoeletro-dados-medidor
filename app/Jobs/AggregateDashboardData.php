<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use App\Models\DadoAgregado;
use App\Models\Device;
use App\Services\AnomalyDetectionService;
use Illuminate\Support\Carbon;

class AggregateDashboardData implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public readonly int $deviceId,
        public readonly string $startDate, // YYYY-MM-DD
        public readonly string $endDate,   // YYYY-MM-DD
        public readonly string $periodo = 'hora',
    ) {}

    public static function statusKey(int $deviceId): string
    {
        return "dashboard:refresh:status:{$deviceId}";
    }

    public static function lockKey(int $deviceId): string
    {
        return "dashboard:refresh:lock:{$deviceId}";
    }

    public function handle(): void
    {
        $statusKey = self::statusKey($this->deviceId);
        $lock = Cache::lock(self::lockKey($this->deviceId), 300);

        if (! $lock->get()) {
            // Já existe uma agregação rodando para esse device.
            Cache::put($statusKey, [
                'state' => 'running',
                'device_id' => $this->deviceId,
                'started_at' => now()->toISOString(),
                'message' => 'Agregação já está em execução.',
            ], now()->addMinutes(10));
            return;
        }

        try {
            Cache::put($statusKey, [
                'state' => 'running',
                'device_id' => $this->deviceId,
                'started_at' => now()->toISOString(),
                'message' => 'Processando...',
            ], now()->addMinutes(10));

            $exitCode = Artisan::call('app:aggregate-hourly-data', [
                '--periodo' => $this->periodo,
                '--device_id' => (string) $this->deviceId,
                '--from' => $this->startDate,
                '--to' => $this->endDate,
            ]);

            Log::info('dashboard aggregation job finished', [
                'device_id' => $this->deviceId,
                'exit_code' => $exitCode,
                'from' => $this->startDate,
                'to' => $this->endDate,
                'artisan_output' => Artisan::output(),
            ]);

            // Run anomaly detection on newly created aggregated records
            if ($exitCode === 0) {
                try {
                    $device = Device::find($this->deviceId);
                    if ($device) {
                        $dados = DadoAgregado::where('device_id', $this->deviceId)
                            ->whereBetween('periodo_inicio', [Carbon::parse($this->startDate)->startOfDay(), Carbon::parse($this->endDate)->endOfDay()])
                            ->get();

                        $svc = app(AnomalyDetectionService::class);

                        foreach ($dados as $d) {
                            $metrics = [
                                'tensao_l1_n' => $d->tensao_l1_n_media,
                                'tensao_l2_n' => $d->tensao_l2_n_media,
                                'tensao_l3_n' => $d->tensao_l3_n_media,
                                'tensao_l1_l2' => $d->tensao_l1_l2_media,
                                'tensao_l2_l3' => $d->tensao_l2_l3_media,
                                'tensao_l3_l1' => $d->tensao_l3_l1_media,
                                                            // Use key expected by AnomalyDetectionService
                                                            'fator_potencia_total' => $d->fator_potencia_total_media,
                                                            'frequencia' => $d->frequencia_media,
                                                        ];

                                                        $anomalies = $svc->detectAndNotify($device, $metrics);
                                                        if (!empty($anomalies)) {
                                                            Log::info('anomaly detection found in AggregateDashboardData', ['device_id' => $this->deviceId, 'periodo' => $d->periodo_inicio, 'anomalies' => $anomalies]);
                                                        }
                        }
                    }
                } catch (\Throwable $e) {
                    Log::error('anomaly detection failed', ['device_id' => $this->deviceId, 'error' => $e->getMessage()]);
                }
            }

            Cache::put($statusKey, [
                'state' => $exitCode === 0 ? 'done' : 'failed',
                'device_id' => $this->deviceId,
                'finished_at' => now()->toISOString(),
                'exit_code' => $exitCode,
            ], now()->addMinutes(10));
        } catch (\Throwable $e) {
            Log::error('dashboard aggregation job failed', [
                'device_id' => $this->deviceId,
                'from' => $this->startDate,
                'to' => $this->endDate,
                'error' => $e->getMessage(),
            ]);

            Cache::put($statusKey, [
                'state' => 'failed',
                'device_id' => $this->deviceId,
                'finished_at' => now()->toISOString(),
                'message' => $e->getMessage(),
            ], now()->addMinutes(10));

            throw $e;
        } finally {
            optional($lock)->release();
        }
    }
}
