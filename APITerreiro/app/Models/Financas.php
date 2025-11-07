<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Financas extends Model
{
    use HasFactory;

    protected $table = 'financas';

    protected $fillable = [
        'id_terreiro',
        'tipo',
        'descricao',
        'valor',
        'data',
        'anexo'
    ];

    // cada registro financeiro pertence a um terreiro
    public function terreiro()
    {
        return $this->belongsTo(Terreiro::class, 'id_terreiro');
    }
}
