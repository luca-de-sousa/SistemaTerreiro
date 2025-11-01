<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('usuarios', function (Blueprint $table) {
    $table->id();
    $table->foreignId('id_terreiro')->constrained('terreiros')->onDelete('cascade');
    $table->string('nome');
    $table->string('usuario')->unique();
    $table->string('senha');
    $table->enum('tipo', ['adm', 'auxiliar']);
    $table->timestamps();

    // 🔒 Garante 1 adm e 1 auxiliar por terreiro
    $table->unique(['id_terreiro', 'tipo']);
});

    }

    public function down(): void
    {
        Schema::dropIfExists('usuarios');
    }
};
