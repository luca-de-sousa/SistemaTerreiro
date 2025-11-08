<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\EstoqueController;
use App\Http\Controllers\FinancasController;
use App\Http\Controllers\TerreiroController;
use App\Http\Controllers\AuthController;

// 🔐 Rotas de autenticação
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);
Route::post('/cadastro', [UsuarioController::class, 'cadastroInicial']);


// 🌍 Rotas principais da API
Route::apiResource('usuarios', UsuarioController::class);
Route::apiResource('estoque', EstoqueController::class);
Route::apiResource('financas', FinancasController::class);
Route::apiResource('terreiros', TerreiroController::class);
