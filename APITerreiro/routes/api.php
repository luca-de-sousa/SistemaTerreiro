<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

use App\Http\Controller\UsuarioController;
Route::resource('usuario', UsuarioController::class);

use App\Http\Controller\EstoqueController;
Route::resource('estoque', EstoqueController::class);