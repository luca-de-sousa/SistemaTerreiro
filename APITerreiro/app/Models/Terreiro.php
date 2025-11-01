<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Terreiro extends Model
{
    use HasFactory;

    // nome da tabela
    protected $table = 'terreiros';

    protected $fillable = ['nome_terreiro'];

    // um terreiro tem muitos usuários
    public function usuarios()
    {
        return $this->hasMany(Usuario::class, 'id_terreiro');
    }

    // um terreiro tem muitos itens de estoque
    public function estoque()
    {
        return $this->hasMany(Estoque::class, 'id_terreiro');
    }

    // um terreiro tem muitas finanças
    public function financas()
    {
        return $this->hasMany(Financas::class, 'id_terreiro');
    }
}
