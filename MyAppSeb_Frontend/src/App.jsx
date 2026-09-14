import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import TodoPage from './components/TodoPage';
import PomodoroTimer from './components/PomodoroTimer';
import AgendaPage from './components/AgendaPage';
import CalendarPage from './components/CalendarPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/todo" element={<TodoPage />} />
        <Route path="/pomodoro" element={<PomodoroTimer />} />
        <Route path="/agenda" element={<AgendaPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
      </Routes>
    </BrowserRouter>
  );
}