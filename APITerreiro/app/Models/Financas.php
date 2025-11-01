<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Financas extends Model
{
    protected $fillable = ['id', 'id_terreiro', 'tipo', 'descricao', 'valor', 'data'];
}
