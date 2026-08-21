<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Throwable;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {

            $tasks = Task::all();

            return response()->json([
                'message' => 'Tareas traidas con exito',
                'tasks' => $tasks,
                'status' => 200
            ], 200);

        } catch (Throwable $e) {
            
            return response()->json([
                'message' => 'Error al traer las tareas',
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
                'name' => 'required|string|max:100',
                'status' => 'sometimes|boolean',
            ]);

            if ($validator->fails()) {

                return response()->json([
                    'message' => 'Datos invalidos',
                    'errors' => $validator->errors(),
                    'status' => 422,
                ], 422);
            }

            $task = Task::create([
                'name' => $request->name,
                'status' => $request->status,
            ]);

            return response()->json([
                'message' => 'Tarea creada con exito',
                'task' => $task,
                'status' => 201
            ], 201);


        } catch (Throwable $e) {
            return response()->json([
                'message' => 'Error al crear la tarea',
                'error' => $e->getMessage(),
                'status' => 500
            ], 500);

        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $task)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Task $task)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        //
    }
}
