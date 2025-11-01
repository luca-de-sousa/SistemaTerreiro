<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Usuario;
use Illuminate\Support\Facades\Hash;

class UsuarioSeeder extends Seeder
{
    public function run(): void
    {
        // 🔑 Administrador
        Usuario::create([
            'id_terreiro' => 1,
            'nome' => 'Administrador Teste',
            'usuario' => 'admin',
            'senha' => Hash::make('123456'),
            'tipo' => 'adm',
        ]);

        // 👥 Auxiliar
        Usuario::create([
            'id_terreiro' => 1,
            'nome' => 'Auxiliar Teste',
            'usuario' => 'aux',
            'senha' => Hash::make('123456'),
            'tipo' => 'auxiliar',
        ]);
    }
}
