<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Financas;

class FinancasSeeder extends Seeder
{
    public function run(): void
    {
        Financas::create([
            'id_terreiro' => 1,
            'tipo' => 'arrecadacao',
            'descricao' => 'Doação inicial',
            'valor' => 250.00,
            'data' => now(),
        ]);

        Financas::create([
            'id_terreiro' => 1,
            'tipo' => 'despesa',
            'descricao' => 'Compra de materiais de limpeza',
            'valor' => 75.50,
            'data' => now(),
        ]);
    }
}
