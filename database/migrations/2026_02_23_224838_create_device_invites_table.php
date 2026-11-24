<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('device_invites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('device_id')->constrained()->onDelete('cascade');
            $table->foreignId('invited_by')->constrained('users')->onDelete('cascade');
            $table->string('email');
            $table->timestamp('accepted_at')->nullable();
            $table->timestamps();

            $table->unique(['device_id', 'email']); 
        });
    }

    public function down(): void {
        Schema::dropIfExists('device_invites');
    }
};
