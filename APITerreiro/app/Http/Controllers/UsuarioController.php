<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UsuarioController extends Controller
{
    /**
     * Lista usuários do mesmo terreiro (somente adm).
     */
    public function index(Request $request)
    {
        $usuario = Usuario::find($request->id_usuario);

        if (!$usuario) {
            return response()->json(['erro' => 'Usuário não encontrado'], 404);
        }

        // Somente adm pode listar usuários
        if ($usuario->tipo !== 'adm') {
            return response()->json(['erro' => 'Apenas administradores podem visualizar usuários'], 403);
        }

        // Exibe apenas os usuários do mesmo terreiro
        $usuarios = Usuario::where('id_terreiro', $usuario->id_terreiro)->get();

        return response()->json($usuarios);
    }

    /**
     * Cadastra um novo usuário (somente adm do terreiro pode).
     * 🔒 Garante no máximo 1 adm e 1 auxiliar por terreiro.
     */
   public function store(StoreUsuarioRequest $request)
{
    $usuarioAutenticado = Usuario::find($request->id_usuario);

    if (!$usuarioAutenticado) {
        return response()->json(['erro' => 'Usuário não encontrado'], 404);
    }

    if ($usuarioAutenticado->tipo !== 'adm') {
        return response()->json(['erro' => 'Apenas administradores podem cadastrar usuários'], 403);
    }

    // Garante apenas 1 adm e 1 auxiliar por terreiro
    $existeMesmoTipo = Usuario::where('id_terreiro', $usuarioAutenticado->id_terreiro)
        ->where('tipo', $request->tipo)
        ->exists();

    if ($existeMesmoTipo) {
        return response()->json([
            'erro' => "Já existe um usuário do tipo '{$request->tipo}' neste terreiro"
        ], 422);
    }

    $data = $request->validated(); // ✅ dados já validados automaticamente
    $data['id_terreiro'] = $usuarioAutenticado->id_terreiro;
    $data['senha'] = Hash::make($data['senha']);

    $novoUsuario = Usuario::create($data);
    return response()->json($novoUsuario, 201);
}


    /**
     * Mostra um usuário específico.
     * adm pode ver qualquer um do terreiro, auxiliar só a si mesmo.
     */
    public function show(Request $request, Usuario $usuario)
    {
        $usuarioAutenticado = Usuario::find($request->id_usuario);

        if (!$usuarioAutenticado) {
            return response()->json(['erro' => 'Usuário não encontrado'], 404);
        }

        if (
            $usuarioAutenticado->tipo !== 'adm' &&
            $usuarioAutenticado->id !== $usuario->id
        ) {
            return response()->json(['erro' => 'Sem permissão para visualizar este usuário'], 403);
        }

        // Garante que sejam do mesmo terreiro
        if ($usuarioAutenticado->id_terreiro !== $usuario->id_terreiro) {
            return response()->json(['erro' => 'Usuário de outro terreiro'], 403);
        }

        return response()->json($usuario);
    }

    /**
     * Atualiza dados do usuário (adm pode editar todos; auxiliar só ele mesmo).
     */
    public function update(Request $request, Usuario $usuario)
    {
        $usuarioAutenticado = Usuario::find($request->id_usuario);

        if (!$usuarioAutenticado) {
            return response()->json(['erro' => 'Usuário não encontrado'], 404);
        }

        // Restringe quem pode atualizar
        if (
            $usuarioAutenticado->tipo !== 'adm' &&
            $usuarioAutenticado->id !== $usuario->id
        ) {
            return response()->json(['erro' => 'Sem permissão para editar este usuário'], 403);
        }

        // Impede mudar tipo/id_terreiro manualmente
        $data = $request->except(['id_terreiro', 'tipo']);

        // Criptografa a senha se for alterada
        if (!empty($data['senha'])) {
            $data['senha'] = Hash::make($data['senha']);
        }

        $usuario->update($data);
        return response()->json($usuario, 200);
    }

    /**
     * Exclui um usuário (somente adm do mesmo terreiro).
     */
    public function destroy(Request $request, Usuario $usuario)
    {
        $usuarioAutenticado = Usuario::find($request->id_usuario);

        if (!$usuarioAutenticado) {
            return response()->json(['erro' => 'Usuário não encontrado'], 404);
        }

        if ($usuarioAutenticado->tipo !== 'adm') {
            return response()->json(['erro' => 'Apenas administradores podem excluir usuários'], 403);
        }

        if ($usuarioAutenticado->id_terreiro !== $usuario->id_terreiro) {
            return response()->json(['erro' => 'Usuário pertence a outro terreiro'], 403);
        }

        $usuario->delete();
        return response()->json(['mensagem' => 'Usuário removido com sucesso']);
    }
}
