import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTodos, updateTodo } from '../services/todoService';
import bgPersona from '../assets/bg-persona.jpg';

export default function PomodoroTimer() {
  const navigate = useNavigate();

  // Estados del Reloj
  const [timeLeft, setTimeLeft] = useState(1500); // 25 min en segs por defecto
  const [isRunning, setIsRunning] = useState(false);
  const [inputMinutes, setInputMinutes] = useState(25);
  const [inputSeconds, setInputSeconds] = useState(0);

  // Estados de Tareas e Interfaz
  const [pendingTasks, setPendingTasks] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [isTableOpen, setIsTableOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Cargar tareas mediante todoService al montar
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await getTodos();
      const tasksList = Array.isArray(data) ? data : [];
      setPendingTasks(tasksList.filter((task) => !task.status));
    } catch (error) {
      console.error('Error al cargar misiones en Pomodoro:', error);
    } finally {
      setLoading(false);
    }
  };

  // Temporizador en tiempo real con Alerta al llegar a 0
  useEffect(() => {
    let timer = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      alert('¡TIME UP! La sesión de Pomodoro ha terminado.');
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  // Formato MM:SS
  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Ajuste manual de tiempo
  const handleSetTime = (e) => {
    e.preventDefault();
    const total = (parseInt(inputMinutes) || 0) * 60 + (parseInt(inputSeconds) || 0);
    setTimeLeft(total);
    setIsRunning(false);
  };

  // Agregar desde la tabla colapsable a la lista de la sesión
  const handleSelectTask = (task) => {
    if (!selectedTasks.some((t) => t.id === task.id)) {
      setSelectedTasks([...selectedTasks, task]);
    }
  };

  // Completar tarea mediante updateTodo de todoService
  const handleCompleteTask = async (task) => {
    try {
      await updateTodo(task.id, true);
      setSelectedTasks(selectedTasks.filter((t) => t.id !== task.id));
      setPendingTasks(pendingTasks.filter((t) => t.id !== task.id));
    } catch (error) {
      console.error('Error al completar la misión:', error);
    }
  };

  return (
    <div className="min-h-screen text-white relative overflow-hidden flex flex-col p-6 select-none">
      
      {/* Fondo Persona 5 */}
      <div 
        className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{ backgroundImage: `url(${bgPersona})` }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Header */}
      <header className="w-full max-w-5xl mx-auto flex items-center justify-between pt-2 pb-6 z-10">
        <div className="transform -rotate-2 bg-black border-4 border-white px-6 py-2 shadow-[6px_6px_0px_0px_rgba(220,38,38,1)] flex items-center gap-3">
          <span className="text-3xl font-black tracking-widest text-white italic bg-red-600 px-3 py-1 font-sans">
            POMODORO
          </span>
          <span className="text-2xl font-extrabold tracking-wider text-white uppercase italic font-sans">
            // TIMER
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
      <main className="w-full max-w-2xl mx-auto flex flex-col items-center gap-6 z-10 my-auto">
        
        {/* Reloj Digital en Blanco */}
        <div className="transform -rotate-1 bg-black border-4 border-white px-10 py-6 shadow-[8px_8px_0px_0px_rgba(220,38,38,1)] text-center w-full">
          <h1 className="text-7xl sm:text-8xl font-black tracking-widest text-white italic font-mono drop-shadow-[4px_4px_0px_rgba(220,38,38,1)]">
            {formatTime(timeLeft)}
          </h1>
        </div>

        {/* Botón de Inicio / Pausa */}
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`transform rotate-1 w-full py-4 border-3 border-white text-2xl font-black italic tracking-widest uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:scale-105 transition-all ${
            isRunning ? 'bg-neutral-900 text-white hover:bg-black' : 'bg-red-600 text-white hover:bg-red-500'
          }`}
        >
          {isRunning ? 'HOLD UP! (PAUSE)' : 'SHOWTIME! (START)'}
        </button>

        {/* Inputs de Tiempo en Blanco */}
        <form onSubmit={handleSetTime} className="flex gap-3 w-full justify-center transform -rotate-1">
          <div className="flex items-center gap-2 bg-black border-2 border-neutral-700 px-4 py-2 shadow-[4px_4px_0px_0px_rgba(220,38,38,1)]">
            <input
              type="number"
              min="0"
              value={inputMinutes}
              onChange={(e) => setInputMinutes(e.target.value)}
              className="bg-transparent w-16 text-center font-bold text-xl italic text-white focus:outline-none"
              placeholder="MIN"
            />
            <span className="text-xl font-black text-white italic">:</span>
            <input
              type="number"
              min="0"
              max="59"
              value={inputSeconds}
              onChange={(e) => setInputSeconds(e.target.value)}
              className="bg-transparent w-16 text-center font-bold text-xl italic text-white focus:outline-none"
              placeholder="SEC"
            />
          </div>
          <button
            type="submit"
            className="bg-black hover:bg-neutral-900 text-white border-2 border-white px-6 py-2 font-black italic tracking-widest uppercase shadow-[4px_4px_0px_0px_rgba(220,38,38,1)] transition-all font-sans"
          >
            SET TIME
          </button>
        </form>

        {/* Desplegable de Tabla de Pendientes */}
        <div className="w-full flex flex-col items-center gap-3">
          <button
            onClick={() => setIsTableOpen(!isTableOpen)}
            className="bg-black hover:bg-neutral-900 text-white border border-neutral-700 px-4 py-2 font-black italic tracking-wider text-sm uppercase transform rotate-1 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
          >
            {isTableOpen ? '▲ CLOSE TARGET LIST' : '▼ SELECT TARGETS (TO-DO)'}
          </button>

          {isTableOpen && (
            <div className="w-full bg-black/90 border-2 border-red-600 p-4 max-h-48 overflow-y-auto shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-2">
              <p className="text-xs font-black italic text-neutral-400 tracking-widest uppercase mb-1">
                PENDING TARGETS:
              </p>
              {loading ? (
                <p className="text-sm font-bold italic text-white">LOADING TARGETS...</p>
              ) : pendingTasks.length === 0 ? (
                <p className="text-sm italic text-neutral-500">NO PENDING TARGETS FOUND.</p>
              ) : (
                pendingTasks.map((task) => (
                  <div key={task.id} className="flex justify-between items-center bg-neutral-900 border border-neutral-800 p-2 italic">
                    <span className="font-black text-sm text-white">{task.name}</span>
                    <button
                      onClick={() => handleSelectTask(task)}
                      className="bg-red-600 hover:bg-red-500 text-white font-black text-xs px-3 py-1 uppercase tracking-wider border border-white"
                    >
                      ADD
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Lista de Tareas Asignadas al Pomodoro Activo */}
        <div className="w-full bg-neutral-900/90 border-2 border-white p-5 transform rotate-1 shadow-[6px_6px_0px_0px_rgba(220,38,38,1)]">
          <h3 className="font-black italic text-white text-lg uppercase tracking-wider mb-3 font-sans">
            ACTIVE SESSION TARGETS:
          </h3>
          {selectedTasks.length === 0 ? (
            <p className="text-sm italic text-neutral-500 font-bold">
              NO TARGETS ASSIGNED TO THIS SESSION.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {selectedTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between bg-black p-3 border border-neutral-700">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleCompleteTask(task)}
                      className="w-6 h-6 border-2 border-white bg-black hover:bg-red-600 text-white font-black flex items-center justify-center text-xs transition-colors"
                    >
                      ✓
                    </button>
                    <span className="font-black italic text-white tracking-wide">{task.name}</span>
                  </div>
                  <span className="bg-red-600 text-white text-[10px] font-black italic px-2 py-0.5 uppercase tracking-widest">
                    ACTIVE
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full text-center text-xs text-white font-bold py-4 uppercase tracking-widest font-mono z-10 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
        SESSION STATUS: {selectedTasks.length} TARGETS IN PROGRESS
      </footer>

    </div>
  );
}