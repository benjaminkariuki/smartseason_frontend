// src/hooks/useFieldManagement.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

// Hook to fetch the active agents for the dropdown
export const useActiveAgents = () => {
    return useQuery({
        queryKey: ['activeAgents'],
        queryFn: async () => {
            const response = await api.get('/api/admin/agents/active');
            return response.data;
        },
        staleTime: 5 * 60 * 1000, // Keep data fresh for 5 minutes
    });
};

// Hook to handle the form submission
export const useCreateField = () => {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: async (fieldData) => {
            const response = await api.post('/api/fields', fieldData);
            return response.data;
        },
        onSuccess: () => {
            // After successful creation, redirect back to the dashboard
            navigate('/admin/dashboard');
        }
    });
};

export const useUpdateField = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }) => {
            const response = await api.patch(`/api/fields/${id}`, data);
            return response.data;
        },
        onSuccess: () => {
            // Instantly refresh the field list so the changes appear immediately
            queryClient.invalidateQueries({ queryKey: ['fields'] });
        }
    });
};