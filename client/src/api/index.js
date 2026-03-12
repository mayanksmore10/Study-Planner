import axios from 'axios';

const api = axios.create({ baseURL: 'https://study-planner-v84h.onrender.com/api' });

// TASKS
export const getTasks = () => api.get('/tasks');
export const createTask = (data) => api.post('/tasks', data);
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);

// SUBJECTS
export const getSubjects = () => api.get('/subjects');
export const createSubject = (data) => api.post('/subjects', data);
export const updateSubject = (id, data) => api.put(`/subjects/${id}`, data);
export const deleteSubject = (id) => api.delete(`/subjects/${id}`);

// SCHEDULE
export const getSessions = () => api.get('/schedule');
export const createSession = (data) => api.post('/schedule', data);
export const updateSession = (id, data) => api.put(`/schedule/${id}`, data);
export const deleteSession = (id) => api.delete(`/schedule/${id}`);
