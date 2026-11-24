<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
public function up(): void
{
    Schema::table('devices', function (Blueprint $table) {
        // Adiciona o campo, geralmente após o 'is_active'
        $table->boolean('is_generate')->default(true)->after('is_active');
    });
}

public function down(): void
{
    Schema::table('devices', function (Blueprint $table) {
        $table->dropColumn('is_generate');
    });
}
};
