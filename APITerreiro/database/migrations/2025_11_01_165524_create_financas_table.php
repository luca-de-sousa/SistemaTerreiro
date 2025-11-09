<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('financas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_terreiro')
                  ->constrained('terreiros')
                  ->onDelete('cascade');
            $table->enum('tipo', ['arrecadacao', 'despesa']);
            $table->string('descricao', 150);
            $table->decimal('valor', 10, 2);
            $table->date('data');
            $table->string('anexo', 255)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('financas');
    }
};
