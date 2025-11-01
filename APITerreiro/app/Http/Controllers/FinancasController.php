<?php

namespace App\Http\Controllers;

use App\Models\Financas;
use App\Models\Usuario;
use Illuminate\Http\Request;

class FinancasController extends Controller
{
    /**
     * Lista todos os registros financeiros do terreiro do usuário.
     */
    public function index(Request $request)
    {
        $usuario = Usuario::find($request->id_usuario);

        if (!$usuario) {
            return response()->json(['erro' => 'Usuário não encontrado'], 404);
        }

        // Ambos (adm e auxiliar) podem visualizar as finanças do próprio terreiro
        $financas = Financas::where('id_terreiro', $usuario->id_terreiro)->get();
        return response()->json($financas);
    }

    /**
     * Cadastra uma nova movimentação financeira.
     */
   public function store(Request $request)
{
    $usuario = Usuario::find($request->id_usuario);

    if (!$usuario) {
        return response()->json(['erro' => 'Usuário não encontrado'], 404);
    }

    if (!in_array($usuario->tipo, ['adm', 'auxiliar'])) {
        return response()->json(['erro' => 'Permissão negada'], 403);
    }

    $request->validate([
        'tipo' => 'required|in:arrecadacao,despesa,estoque_entrada,estoque_saida',
        'descricao' => 'required|string|max:150',
        'valor' => 'required|numeric|min:0',
        'data' => 'required|date',
    ]);

    $data = $request->all();
    $data['id_terreiro'] = $usuario->id_terreiro;

    if ($request->hasFile('anexo')) {
        $path = $request->file('anexo')->store('uploads/financas', 'public');
        $data['anexo'] = $path;
    }

    // 🔹 Cria a movimentação
    $financa = Financas::create($data);

    // 🔹 Adiciona a URL completa do arquivo
    $financa->anexo_url = $financa->anexo ? asset('storage/' . $financa->anexo) : null;

    return response()->json($financa, 201);
}


    /**
     * Exibe uma movimentação financeira específica.
     */
    public function show(Request $request, Financas $financa)
    {
        $usuario = Usuario::find($request->id_usuario);

        if (!$usuario) {
            return response()->json(['erro' => 'Usuário não encontrado'], 404);
        }

        // só pode visualizar finanças do próprio terreiro
        if ($usuario->id_terreiro !== $financa->id_terreiro) {
            return response()->json(['erro' => 'Acesso negado'], 403);
        }

        return response()->json($financa);
    }

    /**
     * Atualiza uma movimentação financeira (somente adm).
     */
    public function update(Request $request, Financas $financa)
    {
        $usuario = Usuario::find($request->id_usuario);

        if (!$usuario) {
            return response()->json(['erro' => 'Usuário não encontrado'], 404);
        }

        if ($usuario->tipo !== 'adm') {
            return response()->json(['erro' => 'Apenas administradores podem editar registros'], 403);
        }

        if ($usuario->id_terreiro !== $financa->id_terreiro) {
            return response()->json(['erro' => 'Acesso negado a este registro'], 403);
        }

        $request->validate([
            'tipo' => 'sometimes|in:arrecadacao,despesa,estoque_entrada,estoque_saida',
            'descricao' => 'sometimes|string|max:150',
            'valor' => 'sometimes|numeric|min:0',
            'data' => 'sometimes|date',
        ]);

        $data = $request->all();

        if ($request->hasFile('anexo')) {
            $path = $request->file('anexo')->store('uploads/financas', 'public');
            $data['anexo'] = $path;
        }

       $financa->update($data);
$financa->anexo_url = $financa->anexo ? asset('storage/' . $financa->anexo) : null;
return response()->json($financa, 200);


    }

    /**
     * Remove uma movimentação financeira (somente adm).
     */
    public function destroy(Request $request, Financas $financa)
    {
        $usuario = Usuario::find($request->id_usuario);

        if (!$usuario) {
            return response()->json(['erro' => 'Usuário não encontrado'], 404);
        }

        if ($usuario->tipo !== 'adm') {
            return response()->json(['erro' => 'Apenas administradores podem excluir registros'], 403);
        }

        if ($usuario->id_terreiro !== $financa->id_terreiro) {
            return response()->json(['erro' => 'Acesso negado a este registro'], 403);
        }

        $financa->delete();
        return response()->json(['mensagem' => 'Registro removido com sucesso']);
    }
}
