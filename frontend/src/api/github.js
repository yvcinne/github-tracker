import axios from 'axios';

const api = axios.create({ baseURL: '' });

export const getOverview = () => api.get('/stats/overview').then(r => r.data);
export const getCommits = (range = 30) => api.get(`/stats/commits?range=${range}`).then(r => r.data);
export const getHistory = () => api.get('/stats/history').then(r => r.data);
export const sendEmail = () => api.post('/summary/send-email').then(r => r.data);
