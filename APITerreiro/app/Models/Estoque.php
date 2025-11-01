<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Estoque extends Model
{
    use HasFactory;

    protected $table = 'estoques';

    protected $fillable = [
        'id_terreiro',
        'produto',
        'quantidade',
        'origem',
        'data_registro',
        'anexo'
    ];

    // cada item de estoque pertence a um terreiro
    public function terreiro()
    {
        return $this->belongsTo(Terreiro::class, 'id_terreiro');
    }
}
