import api from './api';

export const getTodos = async () => {
  const response = await api.get('/tasks');
  return response.data.tasks;
};

export const createTodo = async (taskName) => {
  const response = await api.post('/tasks', {
    name: taskName,
    status: false,
  });
  return response.data.task;
};

export const updateTodo = async (id, status) => {
  const response = await api.put(`/tasks/${id}`, {
    status: status,
  });
  return response.data.task;
};

export const deleteTodo = async (id) => {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
};