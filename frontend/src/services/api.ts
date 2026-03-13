import axios from 'axios';
import { Transaction } from '@/types/transaction';

// Configure the base axios client
export const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// API helper functions
export const fetchTransactions = async (symbol?: string): Promise<Transaction[]> => {
  const { data } = await api.get('/api/transactions', {
    params: { symbol }
  });
  return data;
};

export const fetchDashboard = async (method: string) => {
  const { data } = await api.get('/api/dashboard', {
    params: { method },
  });
  return data;
};

export const uploadHistoryCsv = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const { data } = await api.post('/api/upload-csv', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};
