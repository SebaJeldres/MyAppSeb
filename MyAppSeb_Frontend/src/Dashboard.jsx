import React from 'react';
import { useNavigate } from 'react-router-dom';

const cardsData = [
  {
    id: 'todo',
    optionNum: '01',
    title: 'ToDo',
    bgColor: 'bg-neutral-900 text-white',
    iconUrl: '/icons/icon-todo.png',
    rotation: '-rotate-3 hover:rotate-1',
    path: '/todo',
  },
  {
    id: 'agenda',
    optionNum: '02',
    title: 'Agenda',
    bgColor: 'bg-red-600 text-white',
    iconUrl: '/icons/icon-notes.png',
    rotation: 'rotate-3 hover:-rotate-1',
    path: '/agenda',
  },
  {
    id: 'habit',
    optionNum: '03',
    title: 'Habit Tracker',
    bgColor: 'bg-red-600 text-white',
    iconUrl: '/icons/icon-habit.png',
    rotation: '-rotate-2 hover:rotate-2',
    path: '/habit',
  },
  {
    id: 'calendar',
    optionNum: '04',
    title: 'Calendario',
    bgColor: 'bg-neutral-900 text-white',
    iconUrl: '/icons/icon-calendar.png',
    rotation: 'rotate-4 hover:rotate-0',
    path: '/calendar',
  },
  {
    id: 'pomodoro',
    optionNum: '05',
    title: 'Pomodoro',
    bgColor: 'bg-red-600 text-white',
    iconUrl: '/icons/icon-clock.png',
    rotation: '-rotate-3 hover:rotate-1',
    path: '/pomodoro',
  },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen text-white relative overflow-hidden flex flex-col items-center justify-between p-6 select-none">
      
      {/* Fondo P5 */}
      <div className="absolute inset-0 -z-10 bg-neutral-950">
        <img 
          src="/bg-persona.jpg" 
          alt="Background Persona 5" 
          className="w-full h-full object-cover object-center opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50 pointer-events-none" />
      </div>

      {/* Header */}
      <header className="w-full max-w-5xl flex items-center justify-start pt-4 pb-6 z-10">
        <div className="transform -rotate-2 bg-black border-4 border-white px-6 py-2 shadow-[6px_6px_0px_0px_rgba(220,38,38,1)] flex items-center gap-3">
          <span className="text-3xl font-black tracking-widest text-white italic bg-red-600 px-3 py-1 font-sans">
            MyAppSeb
          </span>
          <span className="text-2xl font-extrabold tracking-wider text-white uppercase italic font-sans">
            DASHBOARD
          </span>
        </div>
      </header>

      {/* Grid de Cards (2 - 2 - 1) */}
      <main className="w-full max-w-3xl flex flex-col items-center gap-8 my-auto py-4 z-10">
        
        {/* Fila 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full">
          <CardItem item={cardsData[0]} />
          <CardItem item={cardsData[1]} />
        </div>

        {/* Fila 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full">
          <CardItem item={cardsData[2]} />
          <CardItem item={cardsData[3]} />
        </div>

        {/* Fila 3 */}
        <div className="flex justify-center w-full">
          <div className="w-full sm:w-1/2">
            <CardItem item={cardsData[4]} />
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full text-center text-xs text-neutral-400 py-2 uppercase tracking-widest font-mono z-10">
        System: Ready
      </footer>
    </div>
  );
}

function CardItem({ item }) {
  const { title, bgColor, optionNum, iconUrl, rotation, path } = item;
  const navigate = useNavigate();
  
  return (
    <div 
      onClick={() => path && navigate(path)}
      className={`group relative cursor-pointer transform transition-all duration-300 ${rotation} hover:scale-105 hover:z-30 mt-4`}
    >
      <div 
        className="absolute inset-0 bg-black transform translate-x-3 translate-y-3 -z-20 transition-transform duration-200 group-hover:translate-x-4 group-hover:translate-y-4"
        style={{ clipPath: 'polygon(0% 0%, 100% 2%, 97% 98%, 2% 95%)' }}
      />
      
      <div 
        className="absolute -inset-2 bg-neutral-800 border-2 border-neutral-700 -z-10 shadow-lg"
        style={{ clipPath: 'polygon(0 2%, 98% 0, 100% 97%, 2% 100%)' }}
      />

      <div className="absolute -top-5 left-3 z-20 bg-neutral-900 text-neutral-200 border-2 border-neutral-700 px-3 py-0.5 transform -skew-x-12 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)]">
        <span className="text-[10px] font-black tracking-widest uppercase italic block leading-none font-sans text-yellow-400">
          OPTION // {optionNum}
        </span>
      </div>

      <div
        style={{ clipPath: 'polygon(1% 2%, 99% 0%, 97% 97%, 0% 94%)' }}
        className={`w-full h-64 ${bgColor} p-5 flex flex-col justify-between items-center relative overflow-hidden`}
      >
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 transform rotate-45 translate-x-10 -translate-y-10 pointer-events-none" />

        <div className="my-auto transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-200 flex items-center justify-center">
          <img 
            src={iconUrl} 
            alt={title} 
            className="w-32 h-32 object-contain filter drop-shadow-[4px_4px_0px_rgba(0,0,0,0.9)]"
          />
        </div>

        <div className="w-full bg-black text-white py-2 px-3 transform -skew-x-12 border-2 border-neutral-700 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex justify-center items-center">
          <h2 className="text-xl font-black italic tracking-wider uppercase font-sans text-yellow-300 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
            {title}
          </h2>
        </div>

      </div>
    </div>
  );
}