<?php

use App\Services\AnomalyDetectionService;

it('detects voltage anomaly based on nominal value', function () {
    $svc = new AnomalyDetectionService();
    $nominal = 220.0;
    // Testando subtensão (-11.3%, que é < -8%)
    $metrics = [
        'tensao_l1_n' => 195.0, 
        'tensao_l2_n' => 220.0, 
        'tensao_l3_n' => 220.0
    ];
    
    $an = $svc->detect($metrics, $nominal);
    
    expect($an)->not->toBeEmpty();
    expect(collect($an)->where('type', 'voltage')->first())->toMatchArray([
        'phase' => 'tensao_l1_n',
        'measured' => 195.0
    ]);
});

it('detects low power factor using actual database keys', function () {
    $svc = new AnomalyDetectionService();
    // Ajustado para 'fator_potencia_total' que é o nome real na sua tabela
    $metrics = ['fator_potencia_total' => 0.90]; 
    
    $an = $svc->detect($metrics);
    
    expect(collect($an)->pluck('type'))->toContain('power_factor');
});

it('detects frequency anomaly outside 59.9Hz - 60.1Hz', function () {
    $svc = new AnomalyDetectionService();
    
    // Teste limite inferior
    $anLow = $svc->detect(['frequencia' => 59.8]);
    // Teste limite superior
    $anHigh = $svc->detect(['frequencia' => 60.2]);
    
    expect(collect($anLow)->pluck('type'))->toContain('frequency');
    expect(collect($anHigh)->pluck('type'))->toContain('frequency');
});

it('returns empty for normal metrics in 220V system', function () {
    $svc = new AnomalyDetectionService();
    $metrics = [
        'tensao_l1_n' => 220, 
        'tensao_l2_n' => 220, 
        'tensao_l3_n' => 220, 
        'fator_potencia_total' => 0.95, 
        'frequencia' => 60.0
    ];
    
    $an = $svc->detect($metrics, 220.0);
    
    expect($an)->toBeArray()->toHaveCount(0);
});