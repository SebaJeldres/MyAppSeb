import React, { useState, useEffect } from 'react';
import api from '../api';

const PomodoroTimer = () => {
  // 1. Estados del Reloj
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [inputMinutes, setInputMinutes] = useState(25);
  const [inputSeconds, setInputSeconds] = useState(0);

  // 2. Estados de Tareas e Interfaz
  const [pendingTasks, setPendingTasks] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [isTableOpen, setIsTableOpen] = useState(false);

  // Cargar tareas al montar el componente
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      // Consume tu cliente api.js usando la VITE_API_BASE_URL
      const response = await api.get('/tasks');
      const tasks = response.data.tasks || [];
      // Filtrar únicamente tareas pendientes (status: false / 0)
      const pending = tasks.filter((task) => !task.status);
      setPendingTasks(pending);
    } catch (error) {
      console.error("Error al obtener las tareas desde Laravel:", error);
    }
  };

  // 3. Temporizador en Tiempo Real
  useEffect(() => {
    let timer = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  // Formatear segundos a MM:SS
  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Ajustar tiempo manual
  const handleSetTime = (e) => {
    e.preventDefault();
    const total = (parseInt(inputMinutes) || 0) * 60 + (parseInt(inputSeconds) || 0);
    setTimeLeft(total);
    setIsRunning(false);
  };

  // Agregar tareas desde la tabla colapsable a la lista activa del Pomodoro
  const handleSelectTask = (task) => {
    if (!selectedTasks.some((t) => t.id === task.id)) {
      setSelectedTasks([...selectedTasks, task]);
    }
  };

  // Tachar tarea: Envía PUT /tasks/{id} con status = true
  const handleCompleteTask = async (taskId) => {
    try {
      await api.put(`/tasks/${taskId}`, {
        status: true,
      });

      // Actualizar estado local removiendo la tarea completada
      setSelectedTasks(selectedTasks.filter((t) => t.id !== taskId));
      setPendingTasks(pendingTasks.filter((t) => t.id !== taskId));
    } catch (error) {
      console.error("Error al actualizar la tarea:", error);
    }
  };

  return (
    <div className="pomodoro-container p-6 max-w-md mx-auto text-center border rounded-lg shadow-md bg-white">
      {/* Reloj Digital Central */}
      <h1 className="text-6xl font-bold my-4 font-mono text-gray-800">
        {formatTime(timeLeft)}
      </h1>

      {/* Control Iniciar / Pausar */}
      <button 
        onClick={() => setIsRunning(!isRunning)}
        className={`px-6 py-2 rounded text-white font-bold mb-4 transition ${
          isRunning ? 'bg-amber-600 hover:bg-amber-700' : 'bg-red-600 hover:bg-red-700'
        }`}
      >
        {isRunning ? 'Pausar' : 'Iniciar'}
      </button>

      {/* Input para fijar Minutos y Segundos */}
      <form onSubmit={handleSetTime} className="flex justify-center items-center gap-2 mb-6">
        <input
          type="number"
          min="0"
          value={inputMinutes}
          onChange={(e) => setInputMinutes(e.target.value)}
          className="border p-2 w-16 text-center rounded focus:outline-none focus:ring-2 focus:ring-red-500"
          placeholder="Min"
        />
        <span className="text-xl font-bold">:</span>
        <input
          type="number"
          min="0"
          max="59"
          value={inputSeconds}
          onChange={(e) => setInputSeconds(e.target.value)}
          className="border p-2 w-16 text-center rounded focus:outline-none focus:ring-2 focus:ring-red-500"
          placeholder="Seg"
        />
        <button type="submit" className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded">
          Fijar
        </button>
      </form>

      {/* Botón y Tabla Colapsable de Tareas Pendientes */}
      <button
        onClick={() => setIsTableOpen(!isTableOpen)}
        className="mb-4 text-sm font-medium text-blue-600 hover:underline block mx-auto"
      >
        {isTableOpen ? '▲ Ocultar tareas pendientes' : '▼ Ver tareas pendientes'}
      </button>

      {isTableOpen && (
        <div className="border rounded p-3 mb-6 bg-gray-50 max-h-40 overflow-y-auto text-left shadow-inner">
          <p className="font-semibold text-xs mb-2 text-gray-500">Pendientes (status: false):</p>
          {pendingTasks.length === 0 ? (
            <p className="text-xs text-gray-400 italic">No hay tareas pendientes.</p>
          ) : (
            pendingTasks.map((task) => (
              <div key={task.id} className="flex justify-between items-center py-1.5 border-b last:border-0">
                <span className="text-sm font-medium text-gray-700">{task.name}</span>
                <button
                  onClick={() => handleSelectTask(task)}
                  className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-1 rounded"
                >
                  Agregar
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Lista de Tareas Seleccionadas para la Sesión Activa */}
      <div className="selected-tasks text-left border-t pt-4">
        <h3 className="font-bold text-gray-800 mb-2">Tareas de la Sesión:</h3>
        {selectedTasks.length === 0 ? (
          <p className="text-xs text-gray-400 italic">Sin tareas asignadas a este bloque.</p>
        ) : (
          selectedTasks.map((task) => (
            <div key={task.id} className="flex items-center gap-3 py-1">
              <input
                type="checkbox"
                onChange={() => handleCompleteTask(task.id)}
                className="w-4 h-4 text-red-600 rounded cursor-pointer"
              />
              <span className="text-sm text-gray-800 font-medium">{task.name}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PomodoroTimer;