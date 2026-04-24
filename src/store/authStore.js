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
    clearAuth: () => {
        // 1. Clear the token from storage first
        localStorage.removeItem('auth_token');
        
        // 2. Then update the Zustand state
        set({ 
            user: null, 
            isAuthenticated: false, 
            isCheckingAuth: false 
        });
    },
}));