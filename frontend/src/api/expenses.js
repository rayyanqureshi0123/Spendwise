import API from './axios';

export const getExpensesAPI = (params) => API.get('/expenses', { params });
export const addExpenseAPI = (data) => API.post('/expenses', data);
export const updateExpenseAPI = (id, data) => API.put(`/expenses/${id}`, data);
export const deleteExpenseAPI = (id) => API.delete(`/expenses/${id}`);

export const getMonthlySummaryAPI = () => API.get('/expenses/summary/monthly');
export const getYearlySummaryAPI = () => API.get('/expenses/summary/yearly');
export const getCategorySummaryAPI = () => API.get('/expenses/summary/category');
