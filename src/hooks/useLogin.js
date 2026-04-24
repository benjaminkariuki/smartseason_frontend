// src/hooks/useLogin.js
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuthStore } from "../store/authStore";

export const useLogin = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Bring in the setter from our Zustand store
  const { setUser } = useAuthStore();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
    setError(null);
  };

 const loginMutation = useMutation({
    mutationFn: async (data) => {
      // 1. NO MORE CSRF HANDSHAKE! Just post the credentials directly.
      const response = await api.post("/api/login", data);
      return response.data;
    },
    onSuccess: (data) => {
      // 2. Save the token securely in the browser
      localStorage.setItem('auth_token', data.token);
      
      // 3. Set the user in your Zustand store
      setUser(data.user);

      // Route them based on their role
      if (data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/agent/dashboard");
      }
    },
    onError: (err) => {
      const message =
        err.response?.data?.message || "Invalid login credentials.";
      setError(message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!credentials.email || !credentials.password) {
      setError("Email and password are required.");
      return;
    }
    loginMutation.mutate(credentials);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((s) => !s);
  };

  // React Query v5 uses `isPending`; older versions use `isLoading`.
  // Coalesce the available flags to ensure the UI shows a spinner.
  const isLoading =
    loginMutation.isPending ??
    loginMutation.isLoading ??
    loginMutation.isMutating ??
    false;

  return {
    credentials,
    error,
    isLoading,
    handleChange,
    handleSubmit,
    showPassword,
    togglePasswordVisibility,
  };
};
