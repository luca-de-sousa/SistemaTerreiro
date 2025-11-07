<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /**
     * Faz login e retorna informações básicas + token.
     */
  public function login(Request $request)
{
    // ✅ Validação básica
    $request->validate([
        'usuario' => 'required',
        'senha' => 'required'
    ]);

    // 🔍 Busca pelo usuário
    $usuario = Usuario::where('usuario', $request->usuario)->first();

    // ❗ Verifica se usuário existe e a senha está correta
    if (!$usuario || !Hash::check($request->senha, $usuario->senha)) {
        return response()->json(['erro' => 'Usuário ou senha inválidos'], 401);
    }

    // 🔑 Token simples (podemos trocar por Sanctum mais tarde)
    $token = base64_encode($usuario->id . '|' . now());

    // ✅ Resposta de sucesso
    return response()->json([
        'mensagem' => 'Login realizado com sucesso',
        'usuario' => [
            'id' => $usuario->id,
            'nome' => $usuario->nome,
            'tipo' => $usuario->tipo,
            'id_terreiro' => $usuario->id_terreiro,
        ],
        'token' => $token,
    ]);
}


    /**
     * Faz logout (apenas simbólico neste modelo simples).
     */
    public function logout()
    {
        return response()->json(['mensagem' => 'Logout realizado com sucesso']);
    }
}
