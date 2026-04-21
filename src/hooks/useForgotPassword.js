// src/hooks/useForgotPassword.js
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import api from '../api/axios';

export const useForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState({ type: 'idle', message: null });

    const forgotPasswordMutation = useMutation({
        mutationFn: async (data) => {
            // Fetch CSRF cookie to prevent 419 errors on the POST request
            await api.get('/sanctum/csrf-cookie');
            const response = await api.post('/api/forgot-password', data);
            return response.data;
        },
        onSuccess: (data) => {
            setStatus({ 
                type: 'success', 
                // Use Laravel's default message or a custom one
                message: data.message || 'If an account exists with that email, a password reset link has been sent.' 
            });
            setEmail(''); // Clear the input
        },
        onError: (err) => {
            const message = err.response?.data?.message || 'Something went wrong. Please try again.';
            setStatus({ type: 'error', message });
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email) {
            setStatus({ type: 'error', message: 'Please enter your email address.' });
            return;
        }
        
        // Reset status to idle before submitting
        setStatus({ type: 'idle', message: null });
        forgotPasswordMutation.mutate({ email });
    };

    return {
        email,
        setEmail,
        status,
        isLoading: forgotPasswordMutation.isPending,
        handleSubmit
    };
};