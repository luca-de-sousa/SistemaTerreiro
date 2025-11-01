<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Estoque;

class EstoqueSeeder extends Seeder
{
    public function run(): void
    {
        Estoque::create([
            'id_terreiro' => 1,
            'produto' => 'Velas Brancas',
            'quantidade' => 20,
            'origem' => 'doacao',
        ]);

        Estoque::create([
            'id_terreiro' => 1,
            'produto' => 'Incensos',
            'quantidade' => 10,
            'origem' => 'compra',
        ]);
    }
}
