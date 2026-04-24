// src/store/authStore.js
import { create } from 'zustand';

export const useAuthStore = create((set) => ({
    user: null, // Will hold { email, role, etc. }
    isAuthenticated: false,
    isCheckingAuth: true, // True by default so we wait for the backend check on refresh
    
    // Actions
    setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user, 
        isCheckingAuth: false 
    }),
    clearAuth: () => set({ 
        user: null, 
        isAuthenticated: false, 
        isCheckingAuth: false,
     localStorage.removeItem('auth_token');

    }),
}));