import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Bankroll endpoints
export const bankrollAPI = {
  getAll: () => api.get('/bankrolls'),
  getById: (id: number) => api.get(`/bankrolls/${id}`),
  create: (data: { name: string; initialBalance: number }) => api.post('/bankrolls', data),
  update: (id: number, data: { name: string; initialBalance: number }) => 
    api.put(`/bankrolls/${id}`, data),
  delete: (id: number) => api.delete(`/bankrolls/${id}`),
};

// Bet endpoints
export const betAPI = {
  getAll: () => api.get('/bets'),
  getByBankrollId: (bankrollId: number) => api.get(`/bets/bankroll/${bankrollId}`),
  getById: (id: number) => api.get(`/bets/${id}`),
  create: (data: any) => api.post('/bets', data),
  update: (id: number, data: any) => api.put(`/bets/${id}`, data),
  updateStatus: (id: number, status: string) => 
    api.patch(`/bets/${id}/status?status=${status}`),
  previewImport: (data: FormData) =>
    api.post('/bets/import/preview', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  commitImport: (previewId: string) =>
    api.post(`/bets/import/commit?previewId=${encodeURIComponent(previewId)}`),
  delete: (id: number) => api.delete(`/bets/${id}`),
};

// Dashboard endpoint
export const dashboardAPI = {
  get: (bankrollId: number, startDate?: string, endDate?: string) =>
    api.get(`/dashboard/${bankrollId}`, {
      params: {
        ...(startDate ? { startDate } : {}),
        ...(endDate ? { endDate } : {}),
      },
    }),
};

// =====================================================
// CONFIGURAÇÕES - Novos Endpoints
// =====================================================

// Sport endpoints
export const sportAPI = {
  getAll: () => api.get('/sports'),
  getById: (id: number) => api.get(`/sports/${id}`),
  create: (data: { name: string }) => api.post('/sports', data),
  update: (id: number, data: { name: string }) => api.put(`/sports/${id}`, data),
  delete: (id: number) => api.delete(`/sports/${id}`),
};

// Championship endpoints
export const championshipAPI = {
  getAll: () => api.get('/championships'),
  getBySportId: (sportId: number) => api.get(`/championships/sport/${sportId}`),
  getById: (id: number) => api.get(`/championships/${id}`),
  create: (data: { name: string; sportId: number }) => api.post('/championships', data),
  update: (id: number, data: { name: string; sportId: number }) => 
    api.put(`/championships/${id}`, data),
  delete: (id: number) => api.delete(`/championships/${id}`),
};

// Market endpoints
export const marketAPI = {
  getAll: () => api.get('/markets'),
  getById: (id: number) => api.get(`/markets/${id}`),
  create: (data: { name: string }) => api.post('/markets', data),
  update: (id: number, data: { name: string }) => api.put(`/markets/${id}`, data),
  delete: (id: number) => api.delete(`/markets/${id}`),
};

// Bookmaker endpoints
export const bookmakerAPI = {
  getAll: () => api.get('/bookmakers'),
  getById: (id: number) => api.get(`/bookmakers/${id}`),
  create: (data: { name: string }) => api.post('/bookmakers', data),
  update: (id: number, data: { name: string }) => api.put(`/bookmakers/${id}`, data),
  delete: (id: number) => api.delete(`/bookmakers/${id}`),
};

// Tipster endpoints
export const tipsterAPI = {
  getAll: () => api.get('/tipsters'),
  getById: (id: number) => api.get(`/tipsters/${id}`),
  create: (data: { name: string }) => api.post('/tipsters', data),
  update: (id: number, data: { name: string }) => api.put(`/tipsters/${id}`, data),
  delete: (id: number) => api.delete(`/tipsters/${id}`),
};
