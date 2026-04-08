import API from './axios';

export const getExpensesAPI = (params) => API.get('api/expenses', { params });
export const addExpenseAPI = (data) => API.post('api/expenses', data);
export const updateExpenseAPI = (id, data) => API.put(`api/expenses/${id}`, data);
export const deleteExpenseAPI = (id) => API.delete(`api/expenses/${id}`);

export const getMonthlySummaryAPI = () => API.get('api/expenses/summary/monthly');
export const getYearlySummaryAPI = () => API.get('api/expenses/summary/yearly');
export const getCategorySummaryAPI = () => API.get('api/expenses/summary/category');
