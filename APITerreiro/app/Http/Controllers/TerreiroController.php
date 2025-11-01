<?php

namespace App\Http\Controllers;

use App\Models\Terreiro;
use Illuminate\Http\Request;

class TerreiroController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Terreiro::all();
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
        $terreiro = Terreiro::create( $request->all() );
        return $terreiro;
    }

    /**
     * Display the specified resource.
     */
    public function show(Terreiro $terreiro)
    {
        return $terreiro;
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Terreiro $terreiro)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Usuario $terreiro)
    {
        $terreiro->update( $request->all() );
        return $terreiro;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Usuario $terreiro)
    {
        $terreiro->delete();
        return $terreiro;
    }
}
