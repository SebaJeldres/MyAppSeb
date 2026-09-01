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
                'message' => 'Notas traidas con exito',
                'notes' => $notes,
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
        try {
            $validator = Validator::make($request->all(), [
                'title' => 'required|string|max:100',
                'description' => 'nullable|string',
                'date' => 'required|date',
                'status' => 'sometimes|boolean',
                'prioridad' => 'sometimes|in:baja,media,alta'
            ]);

            if ($validator->fails()) {

                return response()->json([
                    'message' => 'Datos invalidos',
                    'errors' => $validator->errors(),
                    'status' => 422,
                ], 422);
            }

            $note = Note::create([
                'title' => $request->title,
                'description' => $request->description,
                'date' => $request->date,
                'status' => $request->status,
                'prioridad' => $request->prioridad,
            ]);

            return response()->json([
                'message' => 'Nota creada con exito',
                'notes' => $note,
                'status' => 201
            ], 201);


        } catch (Throwable $e) {
            return response()->json([
                'message' => 'Error al crear la nota',
                'error' => $e->getMessage(),
                'status' => 500
            ], 500);

        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $note = Note::find($id);

            if (!$note) {
                return response()->json([
                    'message' => 'Nota no encontrada',
                    'status' => 404
                ], 404);
            }

            return response()->json([
                'message' => 'Nota extraida con exito',
                'note' => $note,
                'status' => 200
            ], 200);
        


        } catch (Throwable $e) {
            return response()->json([
                'message' => 'Error al traer la nota',
                'error' => $e->getMessage(),
                'status' => 500
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {

            $validator = Validator::make($request->all(), [
                'title' => 'sometimes|string|max:100',
                'description' => 'nullable|string',
                'date' => 'sometimes|date',
                'status' => 'sometimes|boolean',
                'prioridad' => 'sometimes|in:baja,media,alta'
            ]);

            if ($validator->fails()) {

                return response()->json([
                    'message' => 'Datos invalidos',
                    'errors' => $validator->errors(),
                    'status' => 422,
                ], 422);
            }

            $note = Note::find($id);

            if (!$note) {
                return response()->json([
                    'message' => 'Nota no encontrada',
                    'status' => 404
                ], 404);
            }

            $note->update([
                'title' => $request->title,
                'description' => $request->description,
                'date' => $request->date,
                'status' => $request->status,
                'prioridad' => $request->prioridad,
            ]);

            return response()->json([
                'message' => 'Nota actualizada con exito',
                'note' => $note,
                'status' => 200
            ], 200);


        } catch (Throwable $e) {
            return response()->json([
                'message' => 'Error al actualizar la nota',
                'error' => $e->getMessage(),
                'status' => 500
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {

            $note = Note::find($id);

            if (!$note) {
                return response()->json([
                    'message' => 'Nota no encontrada',
                    'status' => 404
                ], 404);
            }

            $note->delete();

            return response()->json([
                'message' => 'Nota eliminada con exito',
                'status' => 200
            ], 200);



        } catch (Throwable $e) {
            return response()->json([
                'message' => 'Error al eliminar la Nota',
                'error' => $e->getMessage(),
                'status' => 500
            ], 500);
        }
    }
}
