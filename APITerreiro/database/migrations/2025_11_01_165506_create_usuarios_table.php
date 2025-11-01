<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('usuarios', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_terreiro')
                  ->constrained('terreiro')
                  ->onDelete('cascade');
            $table->string('nome', 100);
            $table->string('usuario', 50)->unique();
            $table->string('senha', 255);
            $table->enum('tipo', ['adm', 'auxiliar']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('usuarios');
    }
};
