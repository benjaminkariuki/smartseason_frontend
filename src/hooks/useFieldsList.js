// src/hooks/useFieldsList.js
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';

export const useFieldsList = (filters) => {
    return useInfiniteQuery({
        queryKey: ['fields', filters], // Re-fetch when filters change
        queryFn: async ({ pageParam = 1 }) => {
            // Build the query string based on active filters
            const params = new URLSearchParams({ page: pageParam });
            
            if (filters.stage && filters.stage !== 'All Stages') {
                params.append('stage', filters.stage);
            }
            if (filters.agent_id && filters.agent_id !== 'All Assignees') {
                params.append('agent_id', filters.agent_id);
            }
            // NEW: Add the status filter to the URL parameters
            if (filters.status && filters.status !== 'All Statuses') {
                params.append('status', filters.status);
            }

            const response = await api.get(`/api/fields?${params.toString()}`);
            return response.data;
        },
        getNextPageParam: (lastPage) => {
            if (lastPage.current_page < lastPage.last_page) {
                return lastPage.current_page + 1;
            }
            return undefined; // No more pages
        },
        staleTime: 60000, 
    });
};

export const useDeleteField = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (fieldId) => {
            await api.delete(`/api/fields/${fieldId}`);
        },
        onSuccess: () => {
            // Instantly remove the deleted item from the UI
            queryClient.invalidateQueries({ queryKey: ['fields'] });
        }
    });
};