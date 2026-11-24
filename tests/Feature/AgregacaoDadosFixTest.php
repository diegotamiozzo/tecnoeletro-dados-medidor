<?php

use App\Models\Device;
use App\Models\DadoBruto;
use App\Models\DadoAgregado;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;

describe('Agregação de Dados - Testes de Correção', function () {
    
    beforeEach(function () {
        // Criar um dispositivo de teste
        $this->device = Device::factory()->create([
            'name' => 'Teste Agregação',
            'is_active' => true,
        ]);
    });

    test('FIX 1: MIN/MAX não devem ser 0 quando há valores válidos', function () {
        $now = now();
        $hour = $now->copy()->setMinute(0)->setSecond(0);
        
        // Criar dados brutos com alguns NULLs misturados
        DadoBruto::factory()->create([
            'device_id' => $this->device->id,
            'timestamp_leitura' => $hour->copy()->addMinutes(0),
            'tensao_l1_n' => 220.5,
            'processado' => 0,
        ]);
        DadoBruto::factory()->create([
            'device_id' => $this->device->id,
            'timestamp_leitura' => $hour->copy()->addMinutes(5),
            'tensao_l1_n' => null, // NULL aqui
            'processado' => 0,
        ]);
        DadoBruto::factory()->create([
            'device_id' => $this->device->id,
            'timestamp_leitura' => $hour->copy()->addMinutes(10),
            'tensao_l1_n' => 225.3,
            'processado' => 0,
        ]);

        // Rodar agregação
        Artisan::call('app:aggregate-hourly-data', [
            '--periodo' => 'hora',
            '--device_id' => $this->device->id,
            '--from' => $hour->format('Y-m-d'),
            '--to' => $hour->format('Y-m-d'),
        ]);

        // Verificar resultado
        $agregado = DadoAgregado::where('device_id', $this->device->id)
            ->where('periodo_inicio', $hour)
            ->first();

        expect($agregado)->not->toBeNull('Agregação deve ter sido criada');
        expect($agregado->tensao_l1_n_min)->toBeGreaterThan(0, 'MIN deve ser > 0');
        expect($agregado->tensao_l1_n_max)->toBeGreaterThan(0, 'MAX deve ser > 0');
        expect($agregado->tensao_l1_n_media)->toBeGreaterThan(0, 'MÉDIA deve ser > 0');
        
        // Verificar que values batem com esperado
        expect($agregado->tensao_l1_n_min)->toEqual(220.5, 'MIN deve ser 220.5');
        expect($agregado->tensao_l1_n_max)->toEqual(225.3, 'MAX deve ser 225.3');
    });

    test('FIX 2: Média deve ser simples, não ponderada por registros', function () {
        $now = now();
        $hour = $now->copy()->setMinute(0)->setSecond(0);
        
        // Simular 2 horas diferentes sendo agregadas juntas
        // Hora 1: media = 220V em 60 registros
        for ($i = 0; $i < 60; $i++) {
            DadoBruto::factory()->create([
                'device_id' => $this->device->id,
                'timestamp_leitura' => $hour->copy()->addMinutes($i),
                'tensao_l1_n' => 220,
                'processado' => 0,
            ]);
        }
        
        // Hora 2: media = 225V em 50 registros
        $nextHour = $hour->copy()->addHour();
        for ($i = 0; $i < 50; $i++) {
            DadoBruto::factory()->create([
                'device_id' => $this->device->id,
                'timestamp_leitura' => $nextHour->copy()->addMinutes($i),
                'tensao_l1_n' => 225,
                'processado' => 0,
            ]);
        }

        // Rodar agregação
        Artisan::call('app:aggregate-hourly-data', [
            '--periodo' => 'hora',
            '--device_id' => $this->device->id,
            '--from' => $hour->format('Y-m-d'),
            '--to' => $nextHour->format('Y-m-d'),
        ]);

        // Verificar agregações
        $agg1 = DadoAgregado::where('device_id', $this->device->id)
            ->where('periodo_inicio', $hour)
            ->first();
        $agg2 = DadoAgregado::where('device_id', $this->device->id)
            ->where('periodo_inicio', $nextHour)
            ->first();

        // Cada um deve ter sua média correta
        expect($agg1->tensao_l1_n_media)->toBeCloseTo(220.0, 0.1, 'Hora 1 média deve ser ~220V');
        expect($agg2->tensao_l1_n_media)->toBeCloseTo(225.0, 0.1, 'Hora 2 média deve ser ~225V');
        
        // Verificar que NÃO está multiplicando por registros_contagem
        expect($agg1->tensao_l1_n_media)->toBeLessThan(225, 'Hora 1 não deve ter valor de Hora 2');
    });

    test('FIX 3: NULL não deve virar 0.0 no banco', function () {
        $now = now();
        $hour = $now->copy()->setMinute(0)->setSecond(0);
        
        // Criar agregação com dados que resultarão em NULL
        DadoBruto::factory()->create([
            'device_id' => $this->device->id,
            'timestamp_leitura' => $hour,
            'tensao_l1_n' => null,
            'processado' => 0,
        ]);

        Artisan::call('app:aggregate-hourly-data', [
            '--periodo' => 'hora',
            '--device_id' => $this->device->id,
            '--from' => $hour->format('Y-m-d'),
            '--to' => $hour->format('Y-m-d'),
        ]);

        $agregado = DadoAgregado::where('device_id', $this->device->id)->first();
        
        // Verificar que é NULL, não 0
        expect($agregado->tensao_l1_n_media)->toBeNull('Média com apenas NULLs deve ser NULL');
        expect($agregado->tensao_l1_n_min)->toBeNull('MIN com apenas NULLs deve ser NULL');
        expect($agregado->tensao_l1_n_max)->toBeNull('MAX com apenas NULLs deve ser NULL');
    });

    test('FIX 4: Consumo de energia negativo deve ser detectado e zerado', function () {
        $now = now();
        $hour = $now->copy()->setMinute(0)->setSecond(0);
        
        // Simular contador que diminuiu (reset do medidor)
        DadoBruto::factory()->create([
            'device_id' => $this->device->id,
            'timestamp_leitura' => $hour->copy()->addMinutes(0),
            'energia_ativa_importada' => 1000.0,
            'processado' => 0,
        ]);
        DadoBruto::factory()->create([
            'device_id' => $this->device->id,
            'timestamp_leitura' => $hour->copy()->addMinutes(30),
            'energia_ativa_importada' => 500.0, // Voltou para baixo!
            'processado' => 0,
        ]);

        Artisan::call('app:aggregate-hourly-data', [
            '--periodo' => 'hora',
            '--device_id' => $this->device->id,
            '--from' => $hour->format('Y-m-d'),
            '--to' => $hour->format('Y-m-d'),
        ]);

        $agregado = DadoAgregado::where('device_id', $this->device->id)->first();
        
        // Consumo não deve ser negativo
        expect($agregado->energia_ativa_importada_consumo)->toBeGreaterThanOrEqual(0, 'Consumo não pode ser negativo');
    });

    test('FIX 5: Último valor deve ser determinístico (mesmo com múltiplas rodadas)', function () {
        $now = now();
        $hour = $now->copy()->setMinute(0)->setSecond(0);
        
        DadoBruto::factory()->create([
            'device_id' => $this->device->id,
            'timestamp_leitura' => $hour,
            'tensao_l1_n' => 220.5,
            'processado' => 0,
        ]);

        Artisan::call('app:aggregate-hourly-data', [
            '--periodo' => 'hora',
            '--device_id' => $this->device->id,
            '--from' => $hour->format('Y-m-d'),
            '--to' => $hour->format('Y-m-d'),
        ]);

        $result1 = DadoAgregado::where('device_id', $this->device->id)
            ->where('periodo_inicio', $hour)
            ->first();
        $ultima1 = $result1->tensao_l1_n_ultima;

        // Rodar novamente (simulando upsert)
        Artisan::call('app:aggregate-hourly-data', [
            '--periodo' => 'hora',
            '--device_id' => $this->device->id,
            '--from' => $hour->format('Y-m-d'),
            '--to' => $hour->format('Y-m-d'),
        ]);

        $result2 = DadoAgregado::where('device_id', $this->device->id)
            ->where('periodo_inicio', $hour)
            ->first();
        $ultima2 = $result2->tensao_l1_n_ultima;

        expect($ultima1)->toEqual($ultima2, 'Último valor deve ser igual em reruns');
        expect($ultima1)->toEqual(220.5, 'Último valor deve estar correto');
    });

    test('FIX 1-5: Integração completa com dados realistas', function () {
        $now = now();
        $hour = $now->copy()->setHour(10)->setMinute(0)->setSecond(0);
        
        // Simular dados de 1 hora completa (60 pontos)
        for ($min = 0; $min < 60; $min++) {
            $tensao = 220 + rand(0, 30) / 10; // Varia de 220 a 223V
            $corrente = 10 + rand(0, 20) / 10; // Varia de 10 a 12A
            
            DadoBruto::factory()->create([
                'device_id' => $this->device->id,
                'timestamp_leitura' => $hour->copy()->addMinutes($min),
                'tensao_l1_n' => $tensao,
                'corrente_l1' => $corrente,
                'potencia_ativa_total' => $tensao * $corrente / 1000,
                'energia_ativa_importada' => 100 + $min * 0.1, // Contador crescente
                'processado' => 0,
            ]);
        }

        Artisan::call('app:aggregate-hourly-data', [
            '--periodo' => 'hora',
            '--device_id' => $this->device->id,
            '--from' => $hour->format('Y-m-d'),
            '--to' => $hour->format('Y-m-d'),
        ]);

        $agregado = DadoAgregado::where('device_id', $this->device->id)->first();

        // Validações gerais
        expect($agregado)->not->toBeNull();
        expect($agregado->registros_contagem)->toEqual(60, 'Deve ter 60 registros');
        
        // Valores de tensão devem estar razoáveis
        expect($agregado->tensao_l1_n_min)->toBeGreaterThanOrEqual(220);
        expect($agregado->tensao_l1_n_max)->toBeLessThanOrEqual(223.5);
        expect($agregado->tensao_l1_n_media)->toBeGreaterThanOrEqual(220);
        expect($agregado->tensao_l1_n_media)->toBeLessThanOrEqual(223.5);
        
        // Min sempre <= media <= max
        expect($agregado->tensao_l1_n_min)->toBeLessThanOrEqual($agregado->tensao_l1_n_media);
        expect($agregado->tensao_l1_n_media)->toBeLessThanOrEqual($agregado->tensao_l1_n_max);
        
        // Consumo deve ser positivo
        expect($agregado->energia_ativa_importada_consumo)->toBeGreaterThanOrEqual(0);
    });
});
