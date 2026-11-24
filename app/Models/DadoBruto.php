<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class DadoBruto extends Model
{
    use HasFactory;

    protected $table = 'dados_brutos';

    protected $guarded = [];

    protected $casts = [
        'timestamp_leitura' => 'datetime',
        'tensao_l1_n' => 'float',
        'tensao_l2_n' => 'float',
        'tensao_l3_n' => 'float',
        'tensao_l1_l2' => 'float',
        'tensao_l2_l3' => 'float',
        'tensao_l3_l1' => 'float',
        'corrente_l1' => 'float',
        'corrente_l2' => 'float',
        'corrente_l3' => 'float',
        'corrente_neutro' => 'float',
        'potencia_ativa_total' => 'float',
        'potencia_reativa_total' => 'float',
        'potencia_aparente_total' => 'float',
        'fator_potencia_total' => 'float',
        'frequencia' => 'float',
        'energia_ativa_importada' => 'float',
        'energia_ativa_exportada' => 'float',
        'energia_reativa_importada' => 'float',
        'energia_reativa_exportada' => 'float',
        'processado' => 'boolean',
    ];

    public function device(): BelongsTo
    {
        return $this->belongsTo(Device::class);
    }
}
