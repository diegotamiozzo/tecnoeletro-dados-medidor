<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DadoAgregado extends Model
{
    protected $table = 'dados_agregados';

    /**
     * Em vez de $fillable com 80 campos, usamos $guarded vazio.
     * Isso permite que o Eloquent aceite qualquer coluna da tabela.
     */
    protected $guarded = [];

    /**
     * Os casts são CRÍTICO aqui. 
     * Sem eles, o Eloquent retorna números como strings do banco,
     * o que pode quebrar cálculos no PHP ou eixos no seu gráfico JS.
     */
    protected $casts = [
        'periodo_inicio' => 'datetime',
        'periodo_fim' => 'datetime',
        'tensao_l1_n_media' => 'float',
        'tensao_l2_n_media' => 'float',
        'tensao_l3_n_media' => 'float',
        'tensao_l1_l2_media' => 'float',
        'tensao_l2_l3_media' => 'float',
        'tensao_l3_l1_media' => 'float',
        'corrente_l1_media' => 'float',
        'corrente_l2_media' => 'float',
        'corrente_l3_media' => 'float',
        'corrente_neutro_media' => 'float',
        'potencia_ativa_total_media' => 'float',
        'potencia_reativa_total_media' => 'float',
        'potencia_aparente_total_media' => 'float',
        'fator_potencia_total_media' => 'float',
        'frequencia_media' => 'float',
        'energia_ativa_importada_consumo' => 'float',
        'energia_ativa_exportada_consumo' => 'float',
        'energia_ativa_importada_ultima' => 'float',
        'energia_ativa_exportada_ultima' => 'float',
        'registros_contagem' => 'integer',
    ];

    /**
     * Relacionamento com o Dispositivo
     */
    public function device(): BelongsTo
    {
        return $this->belongsTo(Device::class);
    }
}