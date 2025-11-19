import { DudiDashboardData } from '@/types/dashboard';
import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
    headers: { 'Content-Type': 'application/json' },
    timeout: 30000,
});

export const dashboardAPI = {
    getDashboardData: async () => {
        const response = await api.get('/dashboard');
        return response.data;
    },
    getDudiStats: async (): Promise<DudiDashboardData> => {
        const response = await api.get('/guru/magang');
        return response.data.data;
    },
};

