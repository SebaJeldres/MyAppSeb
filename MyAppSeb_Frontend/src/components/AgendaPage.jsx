import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAgendas, createAgenda, updateAgenda, deleteAgenda } from '../services/agendaService';
import bgPersona from '../assets/bg-persona.jpg';

export default function AgendaPage() {
  const navigate = useNavigate();
  const [agendas, setAgendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    status: false,
    prioridad: 'media'
  });

  useEffect(() => {
    fetchAgendas();
  }, []);

  const fetchAgendas = async () => {
    try {
      setLoading(true);
      const data = await getAgendas();
      setAgendas(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al obtener la agenda:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const updated = await updateAgenda(editingId, formData);
        setAgendas(agendas.map(item => item.id === editingId ? updated : item));
        setEditingId(null);
      } else {
        const created = await createAgenda(formData);
        setAgendas([created, ...agendas]);
      }
      resetForm();
    } catch (error) {
      console.error('Error al guardar en la agenda:', error);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      description: item.description || '',
      date: item.date,
      status: Boolean(item.status),
      prioridad: item.prioridad || 'media'
    });
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await deleteAgenda(id);
      setAgendas(agendas.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error al eliminar evento:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      status: false,
      prioridad: 'media'
    });
    setEditingId(null);
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
            AGENDA
          </span>
          <span className="text-sm sm:text-2xl font-extrabold tracking-wider text-white uppercase italic font-sans whitespace-nowrap">
            // CALENDAR & TASKS
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
      <main className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 z-10 my-auto">
        
        {/* Formulario (Crear / Editar) */}
        <form 
          onSubmit={handleSubmit} 
          className="md:col-span-1 bg-black border-2 sm:border-3 border-white p-4 sm:p-5 transform -rotate-1 shadow-[4px_4px_0px_0px_rgba(220,38,38,1)] sm:shadow-[6px_6px_0px_0px_rgba(220,38,38,1)] flex flex-col gap-3 sm:gap-4"
        >
          <h2 className="text-lg sm:text-xl font-black italic text-white tracking-wider uppercase border-b-2 border-red-600 pb-2 font-sans">
            {editingId ? 'EDITAR EVENTO' : 'NUEVO EVENTO'}
          </h2>

          <div>
            <label className="text-[10px] sm:text-xs font-black italic text-neutral-400 uppercase tracking-widest block mb-1 font-mono">TÍTULO</label>
            <input
              type="text"
              name="title"
              required
              placeholder="NOMBRE DEL EVENTO..."
              value={formData.title}
              onChange={handleInputChange}
              className="w-full bg-black text-white placeholder-neutral-500 font-bold italic tracking-wider p-2 text-sm sm:text-base border-2 border-neutral-700 focus:border-red-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[10px] sm:text-xs font-black italic text-neutral-400 uppercase tracking-widest block mb-1 font-mono">DESCRIPCIÓN</label>
            <textarea
              name="description"
              rows="3"
              placeholder="DETALLES O NOTAS..."
              value={formData.description}
              onChange={handleInputChange}
              className="w-full bg-black text-white placeholder-neutral-500 font-bold italic tracking-wider p-2 text-sm sm:text-base border-2 border-neutral-700 focus:border-red-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[10px] sm:text-xs font-black italic text-neutral-400 uppercase tracking-widest block mb-1 font-mono">FECHA</label>
            <input
              type="date"
              name="date"
              required
              value={formData.date}
              onChange={handleInputChange}
              className="w-full bg-black text-white font-bold italic tracking-wider p-2 text-sm sm:text-base border-2 border-neutral-700 focus:border-red-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[10px] sm:text-xs font-black italic text-neutral-400 uppercase tracking-widest block mb-1 font-mono">PRIORIDAD</label>
            <select
              name="prioridad"
              value={formData.prioridad}
              onChange={handleInputChange}
              className="w-full bg-black text-white font-bold italic tracking-wider p-2 text-sm sm:text-base border-2 border-neutral-700 focus:border-red-600 focus:outline-none uppercase"
            >
              <option value="baja">BAJA</option>
              <option value="media">MEDIA</option>
              <option value="alta">ALTA</option>
            </select>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <input
              type="checkbox"
              id="status"
              name="status"
              checked={formData.status}
              onChange={handleInputChange}
              className="w-4 h-4 accent-red-600 cursor-pointer"
            />
            <label htmlFor="status" className="text-xs sm:text-sm font-black italic uppercase cursor-pointer text-white font-sans">
              COMPLETADO
            </label>
          </div>

          <div className="flex gap-2 mt-2">
            <button
              type="submit"
              className="flex-1 bg-black hover:bg-neutral-900 text-white border-2 border-white font-black italic py-2 text-xs sm:text-sm uppercase tracking-widest shadow-[3px_3px_0px_0px_rgba(220,38,38,1)] transition-all font-sans"
            >
              {editingId ? 'ACTUALIZAR' : 'GUARDAR'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-red-600 hover:bg-red-500 text-white font-black italic px-3 sm:px-4 py-2 text-xs sm:text-sm uppercase tracking-wider border border-white font-sans"
              >
                CANCELAR
              </button>
            )}
          </div>
        </form>

        {/* Lista de Eventos */}
        <div className="md:col-span-2 flex flex-col gap-3 sm:gap-4 max-h-[520px] overflow-y-auto pr-1 sm:pr-2">
          {loading ? (
            <div className="text-center font-black italic text-white text-lg sm:text-xl tracking-widest py-10 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
              CARGANDO AGENDA...
            </div>
          ) : agendas.length === 0 ? (
            <div className="text-center font-black italic text-neutral-400 text-lg sm:text-xl tracking-widest py-10 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
              NO HAY EVENTOS REGISTRADOS
            </div>
          ) : (
            agendas.map((item, index) => {
              const rotationClass = index % 2 === 0 ? '-rotate-1' : 'rotate-1';
              const isCompleted = Boolean(item.status);

              return (
                <div 
                  key={item.id}
                  className={`group relative transform transition-all duration-200 ${rotationClass} hover:scale-[1.01] hover:z-20`}
                >
                  <div className="absolute inset-0 bg-black translate-x-1.5 sm:translate-x-2 translate-y-1.5 sm:translate-y-2 -z-10" />

                  <div 
                    className={`w-full border-2 border-neutral-800 p-3 sm:p-4 flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4 transition-colors ${
                      isCompleted ? 'bg-neutral-900/95 text-neutral-500' : 'bg-red-600 text-white'
                    }`}
                    style={{ clipPath: 'polygon(0% 0%, 99% 1%, 98% 98%, 1% 96%)' }}
                  >
                    <div className="flex flex-col gap-1.5 sm:gap-2 flex-1 w-full">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <span className={`px-2 py-0.5 font-mono text-[10px] sm:text-xs font-black tracking-widest italic uppercase border transform -skew-x-12 ${getPriorityBadge(item.prioridad)}`}>
                          {item.prioridad || 'MEDIA'}
                        </span>
                        <span className="text-[10px] sm:text-xs font-mono font-bold tracking-wider italic text-white drop-shadow-[1px_1px_0px_rgba(0,0,0,1)]">
                          {item.date}
                        </span>
                      </div>

                      <h3 className={`text-base sm:text-xl font-black italic tracking-wide font-sans ${
                        isCompleted ? 'line-through text-neutral-500' : 'text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)]'
                      }`}>
                        {item.title}
                      </h3>

                      {item.description && (
                        <p className={`text-xs sm:text-sm font-bold italic font-sans ${
                          isCompleted ? 'text-neutral-600' : 'text-white/90 drop-shadow-[1px_1px_0px_rgba(0,0,0,0.8)]'
                        }`}>
                          {item.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-start">
                      <button
                        onClick={() => handleEdit(item)}
                        className="bg-black text-white hover:bg-neutral-900 border border-white px-2.5 sm:px-3 py-1 font-sans font-black text-xs uppercase italic transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      >
                        EDIT
                      </button>
                      <button
                        onClick={(e) => handleDelete(e, item.id)}
                        className="bg-black text-red-500 hover:bg-red-700 hover:text-white border border-red-600 px-2.5 sm:px-3 py-1 font-sans font-black text-xs uppercase italic transition-colors"
                      >
                        X
                      </button>
                    </div>

                  </div>
                </div>
              );
            })
          )}
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full text-center text-[10px] sm:text-xs text-white font-bold py-4 uppercase tracking-widest font-mono z-10 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
        AGENDA STATUS: {agendas.filter(a => !a.status).length} EVENTS PENDING
      </footer>

    </div>
  );
}