<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUsuarioRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // pode deixar true por enquanto
    }

    public function rules(): array
    {
        return [
            'nome' => 'required|string|max:100',
            'usuario' => 'required|string|unique:usuarios',
            'senha' => 'required|string|min:6',
            'tipo' => 'required|in:adm,auxiliar',
            'id_terreiro' => 'required|exists:terreiros,id',
        ];
    }
}
