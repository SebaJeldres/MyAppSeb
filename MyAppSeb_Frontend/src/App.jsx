import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import TodoPage from './components/TodoPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/todo" element={<TodoPage />} />
      </Routes>
    </BrowserRouter>
  );
}