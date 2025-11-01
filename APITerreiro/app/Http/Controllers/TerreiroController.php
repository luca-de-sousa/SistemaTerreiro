<?php

namespace App\Http\Controllers;

use App\Models\Terreiro;
use App\Models\Usuario;
use Illuminate\Http\Request;

class TerreiroController extends Controller
{
    /**
     * Lista o terreiro do usuário logado.
     */
    public function index(Request $request)
    {
        $usuario = Usuario::find($request->id_usuario);

        if (!$usuario) {
            return response()->json(['erro' => 'Usuário não encontrado'], 404);
        }

        // O auxiliar e o adm veem apenas o próprio terreiro
        $terreiro = Terreiro::where('id', $usuario->id_terreiro)->first();

        if (!$terreiro) {
            return response()->json(['erro' => 'Terreiro não encontrado'], 404);
        }

        return response()->json($terreiro);
    }

    /**
     * Cadastra um novo terreiro (somente adm geral do sistema).
     * Obs: se teu sistema não tem "adm geral", mantenha assim para segurança.
     */
    public function store(Request $request)
    {
        $usuario = Usuario::find($request->id_usuario);

        if (!$usuario) {
            return response()->json(['erro' => 'Usuário não encontrado'], 404);
        }

        // Somente administradores podem criar novos terreiros
        if ($usuario->tipo !== 'adm') {
            return response()->json(['erro' => 'Apenas administradores podem criar terreiros'], 403);
        }

        $request->validate([
            'nome_terreiro' => 'required|string|max:100'
        ]);

        $terreiro = Terreiro::create($request->all());
        return response()->json($terreiro, 201);
    }

    /**
     * Exibe o terreiro, desde que pertença ao usuário.
     */
    public function show(Request $request, Terreiro $terreiro)
    {
        $usuario = Usuario::find($request->id_usuario);

        if (!$usuario) {
            return response()->json(['erro' => 'Usuário não encontrado'], 404);
        }

        if ($usuario->id_terreiro !== $terreiro->id) {
            return response()->json(['erro' => 'Acesso negado a este terreiro'], 403);
        }

        return response()->json($terreiro);
    }

    /**
     * Atualiza o terreiro (somente adm do próprio terreiro).
     */
    public function update(Request $request, Terreiro $terreiro)
    {
        $usuario = Usuario::find($request->id_usuario);

        if (!$usuario) {
            return response()->json(['erro' => 'Usuário não encontrado'], 404);
        }

        if ($usuario->tipo !== 'adm' || $usuario->id_terreiro !== $terreiro->id) {
            return response()->json(['erro' => 'Apenas o administrador do próprio terreiro pode editar'], 403);
        }

        $request->validate([
            'nome_terreiro' => 'sometimes|string|max:100'
        ]);

        $terreiro->update($request->all());
        return response()->json($terreiro, 200);
    }

    /**
     * Remove um terreiro (somente adm do próprio terreiro).
     */
    public function destroy(Request $request, Terreiro $terreiro)
    {
        $usuario = Usuario::find($request->id_usuario);

        if (!$usuario) {
            return response()->json(['erro' => 'Usuário não encontrado'], 404);
        }

        if ($usuario->tipo !== 'adm' || $usuario->id_terreiro !== $terreiro->id) {
            return response()->json(['erro' => 'Apenas o administrador do próprio terreiro pode excluir'], 403);
        }

        $terreiro->delete();
        return response()->json(['mensagem' => 'Terreiro removido com sucesso']);
    }
}
