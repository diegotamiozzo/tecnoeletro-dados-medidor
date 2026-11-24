<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Correção de dados agregados: Converter zeros inválidos de volta a NULL
     * 
     * Problema: COALESCE(coluna, 0) convertia NULL em 0 para MIN/MAX
     * Impacto: Gráficos mostravam picos em 0V quando não deveria haver dados
     * 
     * Esta migração limpa dados históricos já afetados
     */
    public function up(): void
    {
        DB::statement("
            UPDATE dados_agregados
            SET tensao_l1_n_min = NULL
            WHERE tensao_l1_n_min = 0 
              AND tensao_l1_n_media > 100
              AND tensao_l1_n_max > 100
        ");

        DB::statement("
            UPDATE dados_agregados
            SET tensao_l2_n_min = NULL
            WHERE tensao_l2_n_min = 0 
              AND tensao_l2_n_media > 100
              AND tensao_l2_n_max > 100
        ");

        DB::statement("
            UPDATE dados_agregados
            SET tensao_l3_n_min = NULL
            WHERE tensao_l3_n_min = 0 
              AND tensao_l3_n_media > 100
              AND tensao_l3_n_max > 100
        ");

        // Linhas (L-L)
        DB::statement("
            UPDATE dados_agregados
            SET tensao_l1_l2_min = NULL
            WHERE tensao_l1_l2_min = 0 
              AND tensao_l1_l2_media > 150
              AND tensao_l1_l2_max > 150
        ");

        DB::statement("
            UPDATE dados_agregados
            SET tensao_l2_l3_min = NULL
            WHERE tensao_l2_l3_min = 0 
              AND tensao_l2_l3_media > 150
              AND tensao_l2_l3_max > 150
        ");

        DB::statement("
            UPDATE dados_agregados
            SET tensao_l3_l1_min = NULL
            WHERE tensao_l3_l1_min = 0 
              AND tensao_l3_l1_media > 150
              AND tensao_l3_l1_max > 150
        ");

        // Correntes
        DB::statement("
            UPDATE dados_agregados
            SET corrente_l1_min = NULL
            WHERE corrente_l1_min = 0 
              AND corrente_l1_media > 0.1
              AND corrente_l1_max > 0.1
        ");

        DB::statement("
            UPDATE dados_agregados
            SET corrente_l2_min = NULL
            WHERE corrente_l2_min = 0 
              AND corrente_l2_media > 0.1
              AND corrente_l2_max > 0.1
        ");

        DB::statement("
            UPDATE dados_agregados
            SET corrente_l3_min = NULL
            WHERE corrente_l3_min = 0 
              AND corrente_l3_media > 0.1
              AND corrente_l3_max > 0.1
        ");

        DB::statement("
            UPDATE dados_agregados
            SET corrente_neutro_min = NULL
            WHERE corrente_neutro_min = 0 
              AND corrente_neutro_media > 0.1
              AND corrente_neutro_max > 0.1
        ");

        // Potências
        DB::statement("
            UPDATE dados_agregados
            SET potencia_ativa_total_min = NULL
            WHERE potencia_ativa_total_min = 0 
              AND potencia_ativa_total_media > 0.1
              AND potencia_ativa_total_max > 0.1
        ");

        DB::statement("
            UPDATE dados_agregados
            SET potencia_reativa_total_min = NULL
            WHERE potencia_reativa_total_min = 0 
              AND potencia_reativa_total_media != 0
              AND potencia_reativa_total_max > 0
        ");

        DB::statement("
            UPDATE dados_agregados
            SET potencia_aparente_total_min = NULL
            WHERE potencia_aparente_total_min = 0 
              AND potencia_aparente_total_media > 0.1
              AND potencia_aparente_total_max > 0.1
        ");

        // Frequência (deve estar entre 59-61 Hz)
        DB::statement("
            UPDATE dados_agregados
            SET frequencia_min = NULL
            WHERE frequencia_min = 0 
              AND frequencia_media > 59
              AND frequencia_media < 61
              AND frequencia_max > 59
              AND frequencia_max < 61
        ");
    }

    public function down(): void
    {
        // Não reverter dados - mudança é apenas de correção
    }
};
