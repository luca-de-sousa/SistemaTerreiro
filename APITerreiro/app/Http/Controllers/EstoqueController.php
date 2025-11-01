<?php

namespace App\Http\Controllers;

use App\Models\Estoque;
use App\Models\Usuario;
use Illuminate\Http\Request;

class EstoqueController extends Controller
{
    /**
     * Lista todos os registros de estoque (adm e auxiliar podem visualizar)
     */
    public function index(Request $request)
    {
        $usuario = Usuario::find($request->id_usuario);

        if (!$usuario) {
            return response()->json(['erro' => 'Usuário não encontrado'], 404);
        }

        // Ambos podem visualizar apenas o próprio terreiro
        $estoques = Estoque::where('id_terreiro', $usuario->id_terreiro)->get();
        return response()->json($estoques);
    }

    /**
     * Cadastra um novo item de estoque (adm e auxiliar podem cadastrar)
     */
   public function store(Request $request)
{
    $usuario = Usuario::find($request->id_usuario);

    if (!$usuario) {
        return response()->json(['erro' => 'Usuário não encontrado'], 404);
    }

    $request->validate([
        'produto' => 'required|string|max:100',
        'quantidade' => 'required|integer|min:0',
        'origem' => 'required|in:compra,doacao',
    ]);

    $data = $request->all();
    $data['id_terreiro'] = $usuario->id_terreiro;

    if ($request->hasFile('anexo')) {
        $path = $request->file('anexo')->store('uploads/estoque', 'public');
        $data['anexo'] = $path;
    }

    // 🔹 Cria o registro no banco
    $estoque = Estoque::create($data);

    // 🔹 Adiciona a URL completa do arquivo
    $estoque->anexo_url = $estoque->anexo ? asset('storage/' . $estoque->anexo) : null;

    return response()->json($estoque, 201);
}


    /**
     * Mostra um item de estoque específico (ambos podem ver)
     */
    public function show(Request $request, Estoque $estoque)
    {
        $usuario = Usuario::find($request->id_usuario);

        if (!$usuario) {
            return response()->json(['erro' => 'Usuário não encontrado'], 404);
        }

        if ($usuario->id_terreiro !== $estoque->id_terreiro) {
            return response()->json(['erro' => 'Acesso negado'], 403);
        }

        return response()->json($estoque);
    }

    /**
     * Atualiza um item (somente adm)
     */
    public function update(Request $request, Estoque $estoque)
    {
        $usuario = Usuario::find($request->id_usuario);

        if (!$usuario) {
            return response()->json(['erro' => 'Usuário não encontrado'], 404);
        }

        if ($usuario->tipo !== 'adm') {
            return response()->json(['erro' => 'Apenas administradores podem editar itens'], 403);
        }

        if ($usuario->id_terreiro !== $estoque->id_terreiro) {
            return response()->json(['erro' => 'Acesso negado a este item'], 403);
        }

        $request->validate([
            'produto' => 'sometimes|string|max:100',
            'quantidade' => 'sometimes|integer|min:0',
            'origem' => 'sometimes|in:compra,doacao',
        ]);

        $data = $request->all();

        if ($request->hasFile('anexo')) {
            $path = $request->file('anexo')->store('uploads/estoque', 'public');
            $data['anexo'] = $path;
        }

    $estoque->update($data);
$estoque->anexo_url = $estoque->anexo ? asset('storage/' . $estoque->anexo) : null;
return response()->json($estoque, 200);


    }

    /**
     * Remove um item (somente adm)
     */
    public function destroy(Request $request, Estoque $estoque)
    {
        $usuario = Usuario::find($request->id_usuario);

        if (!$usuario) {
            return response()->json(['erro' => 'Usuário não encontrado'], 404);
        }

        if ($usuario->tipo !== 'adm') {
            return response()->json(['erro' => 'Apenas administradores podem excluir itens'], 403);
        }

        if ($usuario->id_terreiro !== $estoque->id_terreiro) {
            return response()->json(['erro' => 'Acesso negado a este item'], 403);
        }

        $estoque->delete();
        return response()->json(['mensagem' => 'Item removido com sucesso']);
    }
}
