<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Terreiro;

class TerreiroSeeder extends Seeder
{
    public function run(): void
    {
        Terreiro::create([
            'nome_terreiro' => 'Terreiro de Teste',
        ]);
    }
}
