<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('dados_agregados', function (Blueprint $table) {
            $table->id();
            $table->foreignId('device_id')->constrained()->onDelete('cascade');

            // Período da agregação
            $table->timestamp('periodo_inicio');
            $table->timestamp('periodo_fim');

            // --- TENSÕES DE FASE (L-N) ---
            $table->decimal('tensao_l1_n_media', 10, 2)->nullable();
            $table->decimal('tensao_l1_n_max', 10, 2)->nullable();
            $table->decimal('tensao_l1_n_min', 10, 2)->nullable();
            $table->decimal('tensao_l1_n_ultima', 10, 2)->nullable();

            $table->decimal('tensao_l2_n_media', 10, 2)->nullable();
            $table->decimal('tensao_l2_n_max', 10, 2)->nullable();
            $table->decimal('tensao_l2_n_min', 10, 2)->nullable();
            $table->decimal('tensao_l2_n_ultima', 10, 2)->nullable();

            $table->decimal('tensao_l3_n_media', 10, 2)->nullable();
            $table->decimal('tensao_l3_n_max', 10, 2)->nullable();
            $table->decimal('tensao_l3_n_min', 10, 2)->nullable();
            $table->decimal('tensao_l3_n_ultima', 10, 2)->nullable();

            // --- TENSÕES DE LINHA (L-L) ---
            $table->decimal('tensao_l1_l2_media', 10, 2)->nullable();
            $table->decimal('tensao_l1_l2_max', 10, 2)->nullable();
            $table->decimal('tensao_l1_l2_min', 10, 2)->nullable();
            $table->decimal('tensao_l1_l2_ultima', 10, 2)->nullable();

            $table->decimal('tensao_l2_l3_media', 10, 2)->nullable();
            $table->decimal('tensao_l2_l3_max', 10, 2)->nullable();
            $table->decimal('tensao_l2_l3_min', 10, 2)->nullable();
            $table->decimal('tensao_l2_l3_ultima', 10, 2)->nullable();

            $table->decimal('tensao_l3_l1_media', 10, 2)->nullable();
            $table->decimal('tensao_l3_l1_max', 10, 2)->nullable();
            $table->decimal('tensao_l3_l1_min', 10, 2)->nullable();
            $table->decimal('tensao_l3_l1_ultima', 10, 2)->nullable();

            // --- CORRENTES FASES E NEUTRO ---
            $table->decimal('corrente_l1_media', 10, 2)->nullable();
            $table->decimal('corrente_l1_max', 10, 2)->nullable();
            $table->decimal('corrente_l1_min', 10, 2)->nullable();
            $table->decimal('corrente_l1_ultima', 10, 2)->nullable();

            $table->decimal('corrente_l2_media', 10, 2)->nullable();
            $table->decimal('corrente_l2_max', 10, 2)->nullable();
            $table->decimal('corrente_l2_min', 10, 2)->nullable();
            $table->decimal('corrente_l2_ultima', 10, 2)->nullable();

            $table->decimal('corrente_l3_media', 10, 2)->nullable();
            $table->decimal('corrente_l3_max', 10, 2)->nullable();
            $table->decimal('corrente_l3_min', 10, 2)->nullable();
            $table->decimal('corrente_l3_ultima', 10, 2)->nullable();

            $table->decimal('corrente_neutro_media', 10, 2)->nullable();
            $table->decimal('corrente_neutro_max', 10, 2)->nullable();
            $table->decimal('corrente_neutro_min', 10, 2)->nullable();
            $table->decimal('corrente_neutro_ultima', 10, 2)->nullable();

            // --- POTÊNCIAS, FATOR E FREQUÊNCIA ---
            $table->decimal('potencia_ativa_total_media', 10, 2)->nullable();
            $table->decimal('potencia_ativa_total_max', 10, 2)->nullable(); 
            $table->decimal('potencia_ativa_total_min', 10, 2)->nullable();
            $table->decimal('potencia_ativa_total_ultima', 10, 2)->nullable();

            $table->decimal('potencia_reativa_total_media', 10, 2)->nullable();
            $table->decimal('potencia_reativa_total_max', 10, 2)->nullable(); 
            $table->decimal('potencia_reativa_total_min', 10, 2)->nullable();
            $table->decimal('potencia_reativa_total_ultima', 10, 2)->nullable();

            $table->decimal('potencia_aparente_total_media', 10, 2)->nullable();
            $table->decimal('potencia_aparente_total_max', 10, 2)->nullable(); 
            $table->decimal('potencia_aparente_total_min', 10, 2)->nullable();
            $table->decimal('potencia_aparente_total_ultima', 10, 2)->nullable();

            $table->decimal('fator_potencia_total_media', 8, 4)->nullable();
            $table->decimal('fator_potencia_total_max', 8, 4)->nullable();
            $table->decimal('fator_potencia_total_min', 8, 4)->nullable(); 
            $table->decimal('fator_potencia_total_ultima', 8, 4)->nullable();

            $table->decimal('frequencia_media', 8, 2)->nullable();
            $table->decimal('frequencia_max', 8, 2)->nullable();
            $table->decimal('frequencia_min', 8, 2)->nullable();
            $table->decimal('frequencia_ultima', 8, 2)->nullable();
            
            // --- ENERGIAS (kWh e kVArh) ---
            $energias = [
                'energia_ativa_importada', 'energia_ativa_exportada',
                'energia_reativa_importada', 'energia_reativa_exportada'
            ];

            foreach ($energias as $col) {
                $table->decimal("{$col}_consumo", 12, 2)->nullable();
                $table->decimal("{$col}_ultima", 12, 2)->nullable();
            }

            // Contagem de registros brutos que formaram essa agregação
            $table->integer('registros_contagem');

            // Timestamps do Laravel
            $table->timestamps();

            // Chave Única (Garante 1 agregação por equipamento por hora)
            $table->unique(['device_id', 'periodo_inicio'], 'unique_agregacao');

            // Índices
            $table->index('device_id');
            $table->index('periodo_inicio');
            $table->index('periodo_fim');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dados_agregados');
    }
};