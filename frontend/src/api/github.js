import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '' });

const q = username => username ? `?username=${username}` : '';

export const getUser = (username) => api.get(`/stats/user${q(username)}`).then(r => r.data);
export const getOverview = (username) => api.get(`/stats/overview${q(username)}`).then(r => r.data);
export const getCommits = (range = 30, username) => api.get(`/stats/commits?range=${range}${username ? `&username=${username}` : ''}`).then(r => r.data);
export const getPRs = (username) => api.get(`/stats/prs${q(username)}`).then(r => r.data);
export const getIssues = (username) => api.get(`/stats/issues${q(username)}`).then(r => r.data);
export const getHistory = () => api.get('/stats/history').then(r => r.data);
export const sendEmail = () => api.post('/summary/send-email').then(r => r.data);
