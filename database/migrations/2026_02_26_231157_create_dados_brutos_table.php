<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('dados_brutos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('device_id')->constrained()->onDelete('cascade');
            
            // Momento exato da leitura enviada pelo ESP32/TCP
            $table->timestamp('timestamp_leitura');

            $table->boolean('processado')->default(0)->index();

            // --- GRANDEZAS INSTANTÂNEAS ---
            // Tensão (V)
            $table->decimal('tensao_l1_n', 10, 2)->nullable();
            $table->decimal('tensao_l2_n', 10, 2)->nullable();
            $table->decimal('tensao_l3_n', 10, 2)->nullable();
            $table->decimal('tensao_l1_l2', 10, 2)->nullable();
            $table->decimal('tensao_l2_l3', 10, 2)->nullable();
            $table->decimal('tensao_l3_l1', 10, 2)->nullable();

            // Corrente (A)
            $table->decimal('corrente_l1', 10, 2)->nullable();
            $table->decimal('corrente_l2', 10, 2)->nullable();
            $table->decimal('corrente_l3', 10, 2)->nullable();
            $table->decimal('corrente_neutro', 10, 2)->nullable();

            // Potência e Sistema
            $table->decimal('potencia_ativa_total', 10, 2)->nullable();      // kW
            $table->decimal('potencia_reativa_total', 10, 2)->nullable();    // kVAr
            $table->decimal('potencia_aparente_total', 10, 2)->nullable();   // kVA
            $table->decimal('fator_potencia_total', 8, 4)->nullable(); 
            $table->decimal('frequencia', 8, 2)->nullable();                 // Hz

            // --- ENERGIAS INSTANTÂNEAS ---
            $table->decimal('energia_ativa_importada', 12, 2)->nullable();   // kWh
            $table->decimal('energia_ativa_exportada', 12, 2)->nullable();   // kWh
            $table->decimal('energia_reativa_importada', 12, 2)->nullable(); // kVArh
            $table->decimal('energia_reativa_exportada', 12, 2)->nullable(); // kVArh

            $table->timestamps();

            // Índice vital
            $table->index(['processado', 'timestamp_leitura', 'device_id'], 'idx_dados_pendentes');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dados_brutos');
    }
};