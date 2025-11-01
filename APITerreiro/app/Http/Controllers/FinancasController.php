<?php

namespace App\Http\Controllers;

use App\Models\Financas;
use Illuminate\Http\Request;

class FinancasController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Financas::all();
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $financas = Financas::create( $request->all() );
        return $financas;
    }

    /**
     * Display the specified resource.
     */
    public function show(Financas $financas)
    {
        return $financas;
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Financas $financas)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Financas $financas)
    {
        $financas->update( $request->all() );
        return $financas;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Financas $financas)
    {
        $financas->delete();
        return $financas;
    }
}
