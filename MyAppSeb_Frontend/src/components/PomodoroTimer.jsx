import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTodos, updateTodo } from '../services/todoService';
import bgPersona from '../assets/bg-persona.jpg';

export default function PomodoroTimer() {
  const navigate = useNavigate();

  // Estados del Reloj
  const [timeLeft, setTimeLeft] = useState(1500); // 25 min por defecto
  const [isRunning, setIsRunning] = useState(false);
  const [inputMinutes, setInputMinutes] = useState(25);
  const [inputSeconds, setInputSeconds] = useState(0);

  // Estado del Modal de Alerta
  const [showModal, setShowModal] = useState(false);

  // Estados de Tareas e Interfaz
  const [pendingTasks, setPendingTasks] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [isTableOpen, setIsTableOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Cargar tareas al montar
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

  // Temporizador en tiempo real
  useEffect(() => {
    let timer = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      setShowModal(true);
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

  // Agregar a la lista de la sesión
  const handleSelectTask = (task) => {
    if (!selectedTasks.some((t) => t.id === task.id)) {
      setSelectedTasks([...selectedTasks, task]);
    }
  };

  // Completar tarea
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
    <div className="min-h-screen w-full overflow-x-hidden text-white relative flex flex-col p-4 sm:p-6 select-none">
      
      {/* Fondo Persona 5  */}
      <div 
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{ backgroundImage: `url(${bgPersona})` }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Header Responsivo */}
      <header className="w-full max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between pt-2 pb-6 z-10 gap-4">
        <div className="transform -rotate-2 bg-black border-2 sm:border-4 border-white px-3 sm:px-6 py-1.5 sm:py-2 shadow-[4px_4px_0px_0px_rgba(220,38,38,1)] sm:shadow-[6px_6px_0px_0px_rgba(220,38,38,1)] flex items-center gap-2 sm:gap-3 max-w-full">
          <span className="text-xl sm:text-3xl font-black tracking-widest text-white italic bg-red-600 px-2 sm:px-3 py-0.5 sm:py-1 font-sans whitespace-nowrap">
            POMODORO
          </span>
          <span className="text-lg sm:text-2xl font-extrabold tracking-wider text-white uppercase italic font-sans whitespace-nowrap">
            // TIMER
          </span>
        </div>

        <button 
          onClick={() => navigate('/')}
          className="transform rotate-2 bg-red-600 hover:bg-red-500 text-white text-xs sm:text-base font-black italic border-2 border-white px-4 sm:px-5 py-1.5 sm:py-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:scale-105 transition-all tracking-wider uppercase font-sans"
        >
          &lt; BACK TO DASHBOARD
        </button>
      </header>

      {/* Contenido Principal */}
      <main className="w-full max-w-2xl mx-auto flex flex-col items-center gap-4 sm:gap-6 z-10 my-auto">
        
        {/* Reloj Digital */}
        <div className="transform -rotate-1 bg-black border-2 sm:border-4 border-white px-4 sm:px-10 py-4 sm:py-6 shadow-[5px_5px_0px_0px_rgba(220,38,38,1)] sm:shadow-[8px_8px_0px_0px_rgba(220,38,38,1)] text-center w-full">
          <h1 className="text-5xl sm:text-8xl font-black tracking-widest text-white italic font-mono drop-shadow-[3px_3px_0px_rgba(220,38,38,1)] sm:drop-shadow-[4px_4px_0px_rgba(220,38,38,1)]">
            {formatTime(timeLeft)}
          </h1>
        </div>

        {/* Botón de Inicio / Pausa */}
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`transform rotate-1 w-full py-3 sm:py-4 border-2 sm:border-3 border-white text-xl sm:text-2xl font-black italic tracking-widest uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:scale-105 transition-all ${
            isRunning ? 'bg-neutral-900 text-white hover:bg-black' : 'bg-red-600 text-white hover:bg-red-500'
          }`}
        >
          {isRunning ? 'PAUSA' : 'INICIO'}
        </button>

        {/* Inputs de Tiempo (Responsivos) */}
        <form onSubmit={handleSetTime} className="flex flex-col sm:flex-row gap-3 w-full justify-center transform -rotate-1">
          <div className="flex items-center justify-center gap-2 bg-black border-2 border-neutral-700 px-4 py-2 shadow-[4px_4px_0px_0px_rgba(220,38,38,1)]">
            <input
              type="number"
              min="0"
              value={inputMinutes}
              onChange={(e) => setInputMinutes(e.target.value)}
              className="bg-transparent w-14 sm:w-16 text-center font-bold text-lg sm:text-xl italic text-white focus:outline-none"
              placeholder="MIN"
            />
            <span className="text-lg sm:text-xl font-black text-white italic">:</span>
            <input
              type="number"
              min="0"
              max="59"
              value={inputSeconds}
              onChange={(e) => setInputSeconds(e.target.value)}
              className="bg-transparent w-14 sm:w-16 text-center font-bold text-lg sm:text-xl italic text-white focus:outline-none"
              placeholder="SEC"
            />
          </div>
          <button
            type="submit"
            className="bg-black hover:bg-neutral-900 text-white border-2 border-white px-4 sm:px-6 py-2 font-black italic text-xs sm:text-base tracking-widest uppercase shadow-[4px_4px_0px_0px_rgba(220,38,38,1)] transition-all font-sans"
          >
            AGREGAR TIEMPO
          </button>
        </form>

        {/* Desplegable de Tabla de Pendientes */}
        <div className="w-full flex flex-col items-center gap-3">
          <button
            onClick={() => setIsTableOpen(!isTableOpen)}
            className="bg-black hover:bg-neutral-900 text-white border border-neutral-700 px-3 sm:px-4 py-2 font-black italic tracking-wider text-xs sm:text-sm uppercase transform rotate-1 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] max-w-full"
          >
            {isTableOpen ? '▲ CERRAR LISTA DE TAREAS' : '▼ SELECCIONAR TAREAS (TO-DO)'}
          </button>

          {isTableOpen && (
            <div className="w-full bg-black/90 border-2 border-red-600 p-3 sm:p-4 max-h-48 overflow-y-auto shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-2">
              <p className="text-[10px] sm:text-xs font-black italic text-neutral-400 tracking-widest uppercase mb-1">
                TAREAS PENDIENTES:
              </p>
              {loading ? (
                <p className="text-xs sm:text-sm font-bold italic text-white">CARGANDO TAREAS...</p>
              ) : pendingTasks.length === 0 ? (
                <p className="text-xs sm:text-sm italic text-neutral-500">NO HAY TAREAS PENDIENTES</p>
              ) : (
                pendingTasks.map((task) => (
                  <div key={task.id} className="flex justify-between items-center bg-neutral-900 border border-neutral-800 p-2 italic gap-2">
                    <span className="font-black text-xs sm:text-sm text-white truncate">{task.name}</span>
                    <button
                      onClick={() => handleSelectTask(task)}
                      className="bg-red-600 hover:bg-red-500 text-white font-black text-[10px] sm:text-xs px-2.5 py-1 uppercase tracking-wider border border-white whitespace-nowrap"
                    >
                      ADD
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Lista de Tareas Asignadas */}
        <div className="w-full bg-neutral-900/90 border-2 border-white p-4 sm:p-5 transform rotate-1 shadow-[4px_4px_0px_0px_rgba(220,38,38,1)] sm:shadow-[6px_6px_0px_0px_rgba(220,38,38,1)]">
          <h3 className="font-black italic text-white text-base sm:text-lg uppercase tracking-wider mb-2 sm:mb-3 font-sans">
            TAREAS ACTIVAS:
          </h3>
          {selectedTasks.length === 0 ? (
            <p className="text-xs sm:text-sm italic text-neutral-500 font-bold">
              NO HAY TAREAS ASIGNADAS.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {selectedTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between bg-black p-2.5 sm:p-3 border border-neutral-700 gap-2">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <button
                      onClick={() => handleCompleteTask(task)}
                      className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white bg-black hover:bg-red-600 text-white font-black flex items-center justify-center text-xs transition-colors shrink-0"
                    >
                      ✓
                    </button>
                    <span className="font-black italic text-white tracking-wide text-xs sm:text-base truncate">{task.name}</span>
                  </div>
                  <span className="bg-red-600 text-white text-[9px] sm:text-[10px] font-black italic px-1.5 sm:px-2 py-0.5 uppercase tracking-widest shrink-0">
                    ACTIVAR
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full text-center text-[10px] sm:text-xs text-white font-bold py-4 uppercase tracking-widest font-mono z-10 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
        SESSION STATUS: {selectedTasks.length} TARGETS IN PROGRESS
      </footer>

      {/* Modal Persona 5 cuando finaliza el tiempo */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-black border-2 sm:border-4 border-white p-5 sm:p-8 max-w-md w-full transform -rotate-2 shadow-[8px_8px_0px_0px_rgba(220,38,38,1)] sm:shadow-[12px_12px_0px_0px_rgba(220,38,38,1)] text-center relative">
            
            <div className="inline-block bg-red-600 text-white px-3 sm:px-4 py-1 font-black italic text-lg sm:text-xl tracking-widest uppercase transform skew-x-12 mb-3 sm:mb-4 border-2 border-white">
              TIME'S UP!
            </div>
            
            <h2 className="text-xl sm:text-2xl font-black italic text-white tracking-wide uppercase font-sans mb-2">
              TAREA COMPLETADA! 
            </h2>
            
            <p className="text-neutral-300 font-bold italic tracking-wide text-xs sm:text-sm mb-5 sm:mb-6">
              El tiempo asignado a esta sesión ha finalizado. Tómate un descanso o inicia una nueva sesión.
            </p>

            <button
              onClick={() => setShowModal(false)}
              className="w-full bg-red-600 hover:bg-red-500 text-white font-black italic text-base sm:text-lg py-2.5 sm:py-3 uppercase tracking-widest border-2 border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:scale-105 transition-transform"
            >
              CERRAR
            </button>
          </div>
        </div>
      )}

    </div>
  );
}