<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use App\Models\Terreiro;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UsuarioController extends Controller
{
    /**
     * Cadastro inicial do sistema — cria Terreiro + Adm + (auxiliar opcional)
     */
    public function cadastroInicial(Request $request)
    {
        $request->validate([
            'nome_terreiro' => 'required|string|max:100',
            'nome_adm' => 'required|string|max:100',
            'usuario_adm' => 'required|string|unique:usuarios,usuario',
            'senha_adm' => 'required|string|min:4',
            'nome_aux' => 'nullable|string|max:100',
            'usuario_aux' => 'nullable|string|unique:usuarios,usuario',
            'senha_aux' => 'nullable|string|min:4',
        ]);

        // Cria o terreiro
        $terreiro = Terreiro::create([
            'nome_terreiro' => $request->nome_terreiro,
        ]);

        // Cria o administrador
        $adm = Usuario::create([
            'id_terreiro' => $terreiro->id,
            'nome' => $request->nome_adm,
            'usuario' => $request->usuario_adm,
            'senha' => Hash::make($request->senha_adm),
            'tipo' => 'adm',
        ]);

        // Cria o auxiliar, se os dados foram informados
        if ($request->filled(['nome_aux', 'usuario_aux', 'senha_aux'])) {
            Usuario::create([
                'id_terreiro' => $terreiro->id,
                'nome' => $request->nome_aux,
                'usuario' => $request->usuario_aux,
                'senha' => Hash::make($request->senha_aux),
                'tipo' => 'auxiliar',
            ]);
        }

        return response()->json([
            'mensagem' => 'Cadastro realizado com sucesso!',
            'terreiro' => $terreiro,
            'administrador' => $adm,
        ], 201);
    }

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
    public function store(Request $request)
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

        $data = $request->all();
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

        if (
            $usuarioAutenticado->tipo !== 'adm' &&
            $usuarioAutenticado->id !== $usuario->id
        ) {
            return response()->json(['erro' => 'Sem permissão para editar este usuário'], 403);
        }

        $data = $request->except(['id_terreiro', 'tipo']);

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
