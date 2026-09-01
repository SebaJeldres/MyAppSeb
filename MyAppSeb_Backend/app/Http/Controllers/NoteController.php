<?php

namespace App\Http\Controllers;

use App\Models\Note;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Throwable;

class NoteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {

            $notes = Note::all();

            return response()->json([
                'message' => 'notas traidas con exito',
                'tasks' => $notes,
                'status' => 200
            ], 200);

        } catch (Throwable $e) {
            
            return response()->json([
                'message' => 'Error al traer las notas',
                'error' => $e->getMessage(),
                'status' => 500
            ], 500);  }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Note $note)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Note $note)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Note $note)
    {
        //
    }
}
