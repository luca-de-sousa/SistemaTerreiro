<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Estoque extends Model
{
    protected $fillable = ['id', 'id_terreiro', 'produto', 'quantidade', 'origem', 'data_registro'];
}
