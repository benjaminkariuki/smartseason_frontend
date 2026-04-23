import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";

// Fetch all field agents
export const useAgentsList = () => {
  return useQuery({
    queryKey: ["admin_agents"],
    queryFn: async () => {
      const response = await api.get("/api/admin/agents");
      return response.data;
    },
  });
};

// Add a new field agent
export const useAddAgent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userData) => {
      const response = await api.post("/api/admin/agents", userData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_all_users"] });
      // Also invalidate active agents in case field assignment needs them
      queryClient.invalidateQueries({ queryKey: ["activeAgents"] });
    },
  });
};

// Toggle agent active status
export const useUpdateAgentStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, is_active }) => {
      const response = await api.patch(`/api/admin/agents/${userId}/status`, {
        is_active,
      });
      return response.data;
    },
    onSuccess: () => {
      // FIX: Tell React to refetch the master user list!
      queryClient.invalidateQueries({ queryKey: ["admin_all_users"] });
      queryClient.invalidateQueries({ queryKey: ["activeAgents"] });
    },
  });
};

// Fetch absolutely every user for the master admin table
export const useAllUsers = () => {
  return useQuery({
    queryKey: ["admin_all_users"],
    queryFn: async () => {
      const response = await api.get("/api/admin/users/all");
      return response.data;
    },
  });
};
