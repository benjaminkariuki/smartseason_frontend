// src/hooks/useAgentDashboard.js
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

export const useAgentDashboard = () => {
    return useQuery({
        queryKey: ['agentDashboardStats'],
        queryFn: async () => {
            const response = await api.get('/api/agent/dashboard');
            return response.data;
        },
        // Agents are moving around, so we keep the data fresh every 2 minutes
        refetchInterval: 120000, 
    });
};