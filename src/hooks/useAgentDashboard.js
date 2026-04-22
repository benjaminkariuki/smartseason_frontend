// src/hooks/useAgentDashboard.js
import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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

// Hook to fetch paginated tasks (fields) assigned to this specific agent
export const useAgentFields = (filters) => {
    return useInfiniteQuery({
        queryKey: ['agent_fields', filters],
        queryFn: async ({ pageParam = 1 }) => {
            const params = new URLSearchParams({ page: pageParam });
            
            if (filters.stage && filters.stage !== 'Stage: All') {
                params.append('stage', filters.stage);
            }
            // Map the UI "Category" filter to the backend "status" accessor
            if (filters.status && filters.status !== 'Category: All') {
                params.append('status', filters.status);
            }

            // The backend RBAC automatically locks this to only their fields
            const response = await api.get(`/api/fields?${params.toString()}`);
            return response.data;
        },
        getNextPageParam: (lastPage) => {
            if (lastPage.current_page < lastPage.last_page) {
                return lastPage.current_page + 1;
            }
            return undefined;
        },
        staleTime: 60000, 
    });
};

// Hook for the quick-action "Update Stage" button
export const useUpdateFieldStage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, stage, notes }) => {
            // Build the payload matching the Field Agent validation rules
            const payload = { current_stage: stage };
            if (notes) payload.notes = notes;

            const response = await api.patch(`/api/fields/${id}`, payload);
            return response.data;
        },
        onSuccess: () => {
            // Instantly refresh the agent's task list and dashboard stats!
            queryClient.invalidateQueries({ queryKey: ['agent_fields'] });
            queryClient.invalidateQueries({ queryKey: ['agentDashboardStats'] });
        }
    });
};