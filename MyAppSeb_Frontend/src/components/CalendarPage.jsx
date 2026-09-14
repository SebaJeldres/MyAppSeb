import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAgendas } from '../services/agendaService';
import bgPersona from '../assets/bg-persona.jpg';

export default function CalendarPage() {
  const navigate = useNavigate();
  const [agendas, setAgendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    fetchCalendarData();
  }, []);

  const fetchCalendarData = async () => {
    try {
      setLoading(true);
      const data = await getAgendas();
      setAgendas(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al obtener los datos del calendario:', error);
    } finally {
      setLoading(false);
    }
  };

  // Agrupar eventos por la fecha en formato YYYY-MM-DD
  const getEventsForDate = (dayNumber) => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(dayNumber).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;

    return agendas.filter((item) => {
      if (!item.date) return false;
      const itemDateFormatted = item.date.split('T')[0];
      return itemDateFormatted === dateString;
    });
  };

  const getPriorityBadge = (prioridad) => {
    switch (prioridad) {
      case 'alta':
        return 'bg-red-600 text-white border-white';
      case 'media':
        return 'bg-black text-white border-white';
      case 'baja':
        return 'bg-neutral-800 text-neutral-300 border-neutral-600';
      default:
        return 'bg-black text-white border-white';
    }
  };

  // Cálculo de la cuadrícula mensual
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = currentDate.toLocaleString('es-ES', { month: 'long' }).toUpperCase();

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  return (
    <div className="min-h-screen w-full overflow-x-hidden text-white relative flex flex-col p-4 sm:p-6 select-none">
      
      {/* Fondo Persona 5 Ciudad */}
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
            CALENDARIO
          </span>
          <span className="text-sm sm:text-2xl font-extrabold tracking-wider text-white uppercase italic font-sans whitespace-nowrap">
            // {monthName} {year}
          </span>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => navigate('/agenda')}
            className="transform rotate-2 bg-red-600 hover:bg-red-500 text-white text-xs sm:text-base font-black italic border-2 border-white px-4 sm:px-5 py-1.5 sm:py-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:scale-105 transition-all tracking-wider uppercase font-sans"
          >
            &lt; VOLVER A AGENDA
          </button>
        </div>
      </header>

      {/* Contenido Principal / Grilla de Calendario */}
      <main className="w-full max-w-5xl mx-auto flex flex-col gap-4 z-10 my-auto">
        
        {/* Controles del Mes */}
        <div className="flex justify-between items-center bg-black border-2 border-white p-3 transform -rotate-1 shadow-[4px_4px_0px_0px_rgba(220,38,38,1)]">
          <button
            onClick={handlePrevMonth}
            className="bg-red-600 hover:bg-red-500 text-white font-black italic px-3 py-1 border border-white text-xs sm:text-sm uppercase tracking-wider font-sans"
          >
            &lt; MES ANTERIOR
          </button>

          <span className="font-black italic text-base sm:text-xl tracking-widest font-sans uppercase">
            {monthName} {year}
          </span>

          <button
            onClick={handleNextMonth}
            className="bg-red-600 hover:bg-red-500 text-white font-black italic px-3 py-1 border border-white text-xs sm:text-sm uppercase tracking-wider font-sans"
          >
            SIGUIENTE MES &gt;
          </button>
        </div>

        {/* Grilla del Calendario */}
        <div className="bg-black border-2 sm:border-3 border-white p-2 sm:p-4 transform rotate-1 shadow-[6px_6px_0px_0px_rgba(220,38,38,1)]">
          {loading ? (
            <div className="text-center font-black italic text-white text-lg sm:text-xl tracking-widest py-20 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
              CARGANDO EVENTOS DEL CALENDARIO...
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {/* Cabecera Días de la Semana */}
              {['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'].map((day) => (
                <div
                  key={day}
                  className="bg-red-600 border border-white text-center font-black text-xs sm:text-sm tracking-widest py-1 italic font-sans"
                >
                  {day}
                </div>
              ))}

              {/* Celdas Vacías del Inicio */}
              {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                <div
                  key={`empty-${index}`}
                  className="min-h-[70px] sm:min-h-[100px] bg-neutral-900/40 border border-neutral-800 opacity-30"
                />
              ))}

              {/* Celdas de los Días del Mes */}
              {Array.from({ length: daysInMonth }).map((_, index) => {
                const dayNumber = index + 1;
                const dayEvents = getEventsForDate(dayNumber);

                return (
                  <div
                    key={dayNumber}
                    className="min-h-[70px] sm:min-h-[100px] bg-neutral-950 border border-neutral-800 p-1 flex flex-col justify-between hover:border-red-600 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-xs sm:text-sm font-black italic text-neutral-400 font-mono">
                        {dayNumber}
                      </span>
                    </div>

                    {/* Lista de Eventos en el día */}
                    <div className="flex flex-col gap-1 overflow-y-auto max-h-[55px] sm:max-h-[75px] pr-0.5">
                      {dayEvents.map((event) => (
                        <div
                          key={event.id}
                          onClick={() => navigate(`/agenda`)}
                          className={`text-[9px] sm:text-[11px] p-1 font-sans font-black italic border cursor-pointer truncate transition-transform hover:scale-105 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${getPriorityBadge(
                            event.prioridad
                          )}`}
                          title={`${event.title} - ${event.description || ''}`}
                        >
                          {event.title}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full text-center text-[10px] sm:text-xs text-white font-bold py-4 uppercase tracking-widest font-mono z-10 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
        CALENDAR STATUS: {agendas.length} TOTAL EVENTS LOADED
      </footer>

    </div>
  );
}