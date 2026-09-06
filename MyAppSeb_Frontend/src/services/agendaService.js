import api from './api';

export const getAgendas = async () => {
  const response = await api.get('/notes');
  return response.data.notes || response.data;
};

export const createAgenda = async (agendaData) => {
  const response = await api.post('/notes', agendaData);
  return response.data.note || response.data;
};

export const updateAgenda = async (id, agendaData) => {
  const response = await api.put(`/notes/${id}`, agendaData);
  return response.data.note || response.data;
};

export const deleteAgenda = async (id) => {
  const response = await api.delete(`/notes/${id}`);
  return response.data;
};