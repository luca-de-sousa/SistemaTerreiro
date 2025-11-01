<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Usuario extends Model
{
    use HasFactory;

    protected $table = 'usuarios';

    protected $fillable = [
        'id_terreiro',
        'nome',
        'usuario',
        'senha',
        'tipo'
    ];

    protected $hidden = ['senha']; // esconde a senha nas respostas JSON

    // relacionamento: cada usuário pertence a um terreiro
    public function terreiro()
    {
        return $this->belongsTo(Terreiro::class, 'id_terreiro');
    }
}
