<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use throwable;

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
        //
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
