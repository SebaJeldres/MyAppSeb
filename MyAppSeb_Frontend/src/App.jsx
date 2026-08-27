import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import TodoPage from './components/TodoPage';
import PomodoroTimer from './components/PomodoroTimer';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/todo" element={<TodoPage />} />
        <Route path="/pomodoro" element={<PomodoroTimer />} />
      </Routes>
    </BrowserRouter>
  );
}