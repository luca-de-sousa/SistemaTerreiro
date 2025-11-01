<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('estoque', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_terreiro')
                  ->constrained('terreiro')
                  ->onDelete('cascade');
            $table->string('produto', 100);
            $table->integer('quantidade')->default(0);
            $table->enum('origem', ['compra', 'doacao']);
            $table->timestamp('data_registro')->useCurrent();
            $table->string('anexo', 255)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('estoque');
    }
};
