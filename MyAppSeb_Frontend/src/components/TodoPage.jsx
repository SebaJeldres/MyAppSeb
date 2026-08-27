import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTodos, createTodo, updateTodo, deleteTodo } from '../services/todoService';
import bgPersona from '../assets/bg-persona.jpg';

export default function TodoPage() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await getTodos();
      setTasks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al obtener las tareas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      const created = await createTodo(newTask);
      setTasks([created, ...tasks]);
      setNewTask('');
    } catch (error) {
      console.error('Error al crear la tarea:', error);
    }
  };

  const toggleTask = async (task) => {
    try {
      const updated = await updateTodo(task.id, !task.status);
      setTasks(tasks.map(t => t.id === task.id ? updated : t));
    } catch (error) {
      console.error('Error al actualizar la tarea:', error);
    }
  };

  const handleDeleteTask = async (e, id) => {
    e.stopPropagation();
    try {
      await deleteTodo(id);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error al eliminar la tarea:', error);
    }
  };

  return (
    <div className="min-h-screen text-white relative overflow-hidden flex flex-col p-6 select-none">
      
      {/* Fondo Persona 5 Ciudad */}
      <div 
        className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{ 
          backgroundImage: `url(${bgPersona})` 
        }}
      >
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Header */}
      <header className="w-full max-w-5xl mx-auto flex items-center justify-between pt-2 pb-6 z-10">
        <div className="transform -rotate-2 bg-black border-4 border-white px-6 py-2 shadow-[6px_6px_0px_0px_rgba(220,38,38,1)] flex items-center gap-3">
          <span className="text-3xl font-black tracking-widest text-white italic bg-red-600 px-3 py-1 font-sans">
            TAREA
          </span>
          <span className="text-2xl font-extrabold tracking-wider text-white uppercase italic font-sans">
            // TO-DO LIST
          </span>
        </div>

        <button 
          onClick={() => navigate('/')}
          className="transform rotate-2 bg-red-600 hover:bg-red-500 text-white font-black italic border-2 border-white px-5 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:scale-105 transition-all tracking-wider uppercase font-sans"
        >
          &lt; BACK TO DASHBOARD
        </button>
      </header>

      {/* Contenido Principal */}
      <main className="w-full max-w-4xl mx-auto flex flex-col gap-6 z-10 my-auto">
        
        {/* Formulario */}
        <form onSubmit={handleAddTask} className="flex gap-3 w-full transform -rotate-1">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="ESCRIBE UNA NUEVA TAREA..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="w-full bg-black text-white placeholder-neutral-500 font-bold italic tracking-wider px-5 py-3 border-3 border-neutral-700 focus:border-red-600 focus:outline-none shadow-[4px_4px_0px_0px_rgba(220,38,38,1)] text-lg"
            />
          </div>
          <button
            type="submit"
            className="bg-black hover:bg-neutral-900 text-white border-3 border-white px-8 py-3 font-black italic tracking-widest uppercase shadow-[4px_4px_0px_0px_rgba(220,38,38,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-lg font-sans"
          >
            AÑADIR
          </button>
        </form>

        {/* Lista de Tareas */}
        {loading ? (
          <div className="text-center font-black italic text-yellow-400 text-xl tracking-widest py-10 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
            CARGANDO TAREAS...
          </div>
        ) : (
          <div className="flex flex-col gap-4 mt-4">
            {tasks.map((task, index) => {
              const rotationClass = index % 2 === 0 ? '-rotate-1' : 'rotate-1';
              const isCompleted = Boolean(task.status);
              
              return (
                <div 
                  key={task.id}
                  onClick={() => toggleTask(task)}
                  className={`group relative cursor-pointer transform transition-all duration-200 ${rotationClass} hover:scale-[1.02] hover:z-20`}
                >
                  <div className="absolute inset-0 bg-black translate-x-2 translate-y-2 -z-10" />

                  <div 
                    className={`w-full border-2 border-neutral-800 p-4 flex items-center justify-between transition-colors ${
                      isCompleted ? 'bg-neutral-900/95 text-neutral-500 line-through' : 'bg-red-600 text-white'
                    }`}
                    style={{ clipPath: 'polygon(0% 0%, 99% 1%, 98% 98%, 1% 96%)' }}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 border-2 flex items-center justify-center font-black text-xl italic ${
                        isCompleted 
                          ? 'bg-neutral-800 border-neutral-600 text-red-500' 
                          : 'bg-black border-white text-yellow-400'
                      }`}>
                        {isCompleted ? '✓' : ''}
                      </div>

                      <span className={`text-lg font-black italic tracking-wide font-sans ${
                        isCompleted ? 'text-neutral-500' : 'text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)]'
                      }`}>
                        {task.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className={`px-3 py-1 font-mono text-xs font-bold tracking-widest italic uppercase transform -skew-x-12 ${
                        isCompleted 
                          ? 'bg-neutral-800 text-neutral-600 border border-neutral-700' 
                          : 'bg-black text-yellow-300 border border-red-500 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                      }`}>
                        {isCompleted ? 'LISTA' : 'PENDIENTE'}
                      </div>

                      <button
                        onClick={(e) => handleDeleteTask(e, task.id)}
                        className="bg-black text-red-500 hover:bg-red-700 hover:text-white border border-red-600 px-2 py-0.5 font-sans font-black text-xs uppercase italic transition-colors"
                      >
                        X
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="w-full text-center text-xs text-white font-bold py-4 uppercase tracking-widest font-mono z-10 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
        MISSION STATUS: {tasks.filter(t => !t.status).length} TARGETS REMAINING
      </footer>

    </div>
  );
}