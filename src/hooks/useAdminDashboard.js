// src/hooks/useAdminDashboard.js
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

export const useAdminDashboard = () => {
    return useQuery({
        queryKey: ['adminDashboardStats'],
        queryFn: async () => {
            const response = await api.get('/api/admin/dashboard');
            return response.data;
        },
        // Refetch every 5 minutes automatically to keep the board fresh
        refetchInterval: 300000, 
    });
};