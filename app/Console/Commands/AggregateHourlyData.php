<?php

namespace App\Console\Commands;

use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AggregateHourlyData extends Command
{
    protected $signature = 'app:aggregate-hourly-data
        {--periodo=hora : hora|dia}
        {--device_id= : Restringe a um dispositivo}
        {--from= : Data inicial (YYYY-MM-DD)}
        {--to= : Data final (YYYY-MM-DD)}';

    protected $description = 'Agrega leituras do medidor (hora ou dia) e move para tabela de dados agregados';

    public function handle()
    {
        $this->info('Iniciando agregação...');
        $inicioProcesso = microtime(true);

        $periodo = $this->option('periodo');
        if (! in_array($periodo, ['hora', 'dia'], true)) {
            $this->error('Período inválido. Use --periodo=hora ou --periodo=dia.');

            return self::FAILURE;
        }

        // Define o formato de agrupamento (hora ou dia)
        $formato = match ($periodo) {
            'hora' => '%Y-%m-%d %H:00:00',
            'dia' => '%Y-%m-%d 00:00:00',
        };

        // Grandezas instantâneas: calculam média, máximo, mínimo e última leitura
        $colunasInstantaneas = [
            'tensao_l1_n', 'tensao_l2_n', 'tensao_l3_n',
            'tensao_l1_l2', 'tensao_l2_l3', 'tensao_l3_l1',
            'corrente_l1', 'corrente_l2', 'corrente_l3', 'corrente_neutro',
            'potencia_ativa_total', 'potencia_reativa_total',
            'potencia_aparente_total', 'fator_potencia_total', 'frequencia',
        ];

        // Grandezas acumulativas de energia: calcula consumo e última leitura
        $colunasEnergia = [
            'energia_ativa_importada',
            'energia_ativa_exportada',
            'energia_reativa_importada',
            'energia_reativa_exportada',
        ];

        // Monta SELECT das métricas instantâneas
        // FIX 1: Usar CASE WHEN em vez de COALESCE para evitar MIN/MAX = 0 com NULLs
        // FIX 5: Adicionar ORDER BY DESC para determinismo no último valor
        $selectInstant = collect($colunasInstantaneas)
            ->map(fn ($c) => "
                AVG(CASE WHEN $c IS NOT NULL THEN $c END) as {$c}_media,
                MAX(CASE WHEN $c IS NOT NULL THEN $c END) as {$c}_max,
                MIN(CASE WHEN $c IS NOT NULL THEN $c END) as {$c}_min,
                (SELECT t_u.$c FROM dados_brutos t_u 
                 WHERE t_u.device_id = t1.device_id 
                 AND t_u.timestamp_leitura = MAX(t1.timestamp_leitura) 
                 ORDER BY t_u.id DESC
                 LIMIT 1) as {$c}_ultima
            ")
            ->implode(',');

        // Monta SELECT das métricas de energia
        // FIX 3: Usar CASE WHEN para evitar problemas com NULL em consumo
        // FIX 4: Validação de valores negativos será feita posteriormente
        $selectEnergia = collect($colunasEnergia)
            ->map(fn ($c) => "
                (MAX(CASE WHEN $c IS NOT NULL THEN $c END) - MIN(CASE WHEN $c IS NOT NULL THEN $c END)) as {$c}_consumo,
                MAX(CASE WHEN $c IS NOT NULL THEN $c END) as {$c}_ultima
            ")
            ->implode(',');

        // Define até que ponto os dados podem ser agregados
        $dataCorte = now();

        $deviceId = $this->option('device_id') ? (int) $this->option('device_id') : null;
        $from = $this->option('from');
        $to = $this->option('to');

        $fromDt = $from ? Carbon::createFromFormat('Y-m-d', $from, config('app.timezone'))->startOfDay() : null;
        $toDt = $to ? Carbon::createFromFormat('Y-m-d', $to, config('app.timezone'))->endOfDay() : null;

        if (($from && ! $fromDt) || ($to && ! $toDt)) {
            $this->error('Datas inválidas. Use YYYY-MM-DD para --from e --to.');

            return self::FAILURE;
        }

        // Query de agregação
        $where = '
            processado = 0
            AND timestamp_leitura < ?
        ';
        $bindings = [$dataCorte->toDateTimeString()];

        if ($deviceId) {
            $where .= ' AND device_id = ? ';
            $bindings[] = $deviceId;
        }

        if ($fromDt) {
            $where .= ' AND timestamp_leitura >= ? ';
            $bindings[] = $fromDt->toDateTimeString();
        }

        if ($toDt) {
            $where .= ' AND timestamp_leitura <= ? ';
            $bindings[] = $toDt->toDateTimeString();
        }

        $sql = "
            SELECT
                device_id,
                DATE_FORMAT(timestamp_leitura,'$formato') as periodo_inicio,
                COUNT(*) as registros_contagem,
                $selectInstant,
                $selectEnergia
            FROM dados_brutos t1
            WHERE $where
            GROUP BY device_id, periodo_inicio
        ";

        $dados = DB::select($sql, $bindings);

        if (empty($dados)) {
            $this->warn('Nada para processar.');
        } else {

            // Prepara dados para inserção/atualização
            $upsert = [];
            foreach ($dados as $d) {
                $linha = (array) $d;
                $linha['periodo_fim'] = $periodo === 'dia'
                    ? Carbon::parse($d->periodo_inicio)->endOfDay()->toDateTimeString()
                    : Carbon::parse($d->periodo_inicio)->endOfHour()->toDateTimeString();
                $linha['created_at'] = now();
                $linha['updated_at'] = now();
                
                // FIX 3: Manter NULL em vez de converter para 0.0
                // Isso previne picos artificiais em 0 no gráfico
                foreach ($linha as $key => $val) {
                    if (!in_array($key, ['device_id', 'periodo_inicio', 'periodo_fim', 'created_at', 'updated_at', 'registros_contagem'])) {
                        $linha[$key] = $val !== null ? (float) $val : null;
                    }
                }
                
                // FIX 4: Validar e prevenir consumo de energia negativo
                // (pode ocorrer se o contador do medidor resetou)
                $consumoCols = [
                    'energia_ativa_importada_consumo',
                    'energia_ativa_exportada_consumo',
                    'energia_reativa_importada_consumo',
                    'energia_reativa_exportada_consumo',
                ];
                
                foreach ($consumoCols as $col) {
                    if (isset($linha[$col]) && $linha[$col] < 0) {
                        Log::warning("Consumo de energia negativo detectado", [
                            'device_id' => $linha['device_id'],
                            'periodo' => $linha['periodo_inicio'],
                            'coluna' => $col,
                            'valor' => $linha[$col],
                        ]);
                        $linha[$col] = 0;
                    }
                }
                
                $upsert[] = $linha;
            }

            // Anomaly Detection integrada com o método correto (detectAndNotify)
            try {
                $svc = app(\App\Services\AnomalyDetectionService::class);
                foreach ($upsert as $linha) {
                    $deviceIdLinha = $linha['device_id'];
                    
                    // Carrega o Model do Device conforme esperado pelo Service
                    $deviceModel = \App\Models\Device::find($deviceIdLinha);
                    
                    if ($deviceModel) {
                        // Monta o mapa de métricas que o seu AnomalyDetectionService->detect() precisa ler
                        $metricsForDetection = [
                            'tensao_l1_n' => $linha['tensao_l1_n_media'],
                            'tensao_l2_n' => $linha['tensao_l2_n_media'],
                            'tensao_l3_n' => $linha['tensao_l3_n_media'],
                            'fator_potencia_total' => $linha['fator_potencia_total_media'],
                            'frequencia' => $linha['frequencia_media'],
                        ];

                        // Dispara a detecção usando o método existente e correto!
                        $svc->detectAndNotify($deviceModel, $metricsForDetection);
                    }
                }
            } catch (\Throwable $e) {
                $this->error('Anomaly detection during aggregation failed: ' . $e->getMessage());
                Log::error('anomaly detection during aggregation failed', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            }

            DB::transaction(function () use ($upsert, $dataCorte, $deviceId, $fromDt, $toDt) {

                // Insere ou atualiza conforme chave única (device_id + periodo_inicio)
                DB::table('dados_agregados')->upsert(
                    $upsert,
                    ['device_id', 'periodo_inicio'],
                    array_keys($upsert[0])
                );

                // Marca os registros brutos como processados
                $q = DB::table('dados_brutos')
                    ->where('processado', 0)
                    ->where('timestamp_leitura', '<', $dataCorte);

                if ($deviceId) {
                    $q->where('device_id', $deviceId);
                }
                if ($fromDt) {
                    $q->where('timestamp_leitura', '>=', $fromDt);
                }
                if ($toDt) {
                    $q->where('timestamp_leitura', '<=', $toDt);
                }

                $q->update(['processado' => 1]);
            });

            $this->info('✓ Agregação concluída.');
        }

        // Limpeza de dados brutos antigos (mantém apenas últimos 30 dias)
        $dataLimiteLimpeza = now()->subDays(30)->startOfDay();
        $totalRemovidos = 0;

        do {
            $removidos = DB::table('dados_brutos')
                ->where('processado', 1)
                ->where('timestamp_leitura', '<', $dataLimiteLimpeza->toDateTimeString())
                ->limit(5000)
                ->delete();

            $totalRemovidos += $removidos;

        } while ($removidos > 0);

        if ($totalRemovidos > 0) {
            $this->info("✓ {$totalRemovidos} registros brutos antigos removidos.");
        }

        $tempo = round(microtime(true) - $inicioProcesso, 2);
        $this->info("✓ Processo finalizado em {$tempo}s");
    }
}