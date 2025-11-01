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
        $usuario = Usuario::where('usuario', $request->usuario)->first();

        if (!$usuario || !Hash::check($request->senha, $usuario->senha)) {
            return response()->json(['erro' => 'Usuário ou senha inválidos'], 401);
        }

        // 🔐 Se quiser algo mais seguro, aqui futuramente entra o Sanctum.
        $token = base64_encode($usuario->id . '|' . now());

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
