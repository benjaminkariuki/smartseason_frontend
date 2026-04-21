// src/hooks/useResetPassword.js
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import api from '../api/axios';

export const useResetPassword = () => {
    const [passwords, setPasswords] = useState({ password: '', password_confirmation: '' });
    const [status, setStatus] = useState({ type: 'idle', message: null });
    
    const navigate = useNavigate();
    
    // Grab the token from the URL path (/password-reset/:token)
    const { token } = useParams(); 
    
    // Grab the email from the URL query string (?email=...)
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email');

    const handleChange = (e) => {
        setPasswords({
            ...passwords,
            [e.target.name]: e.target.value
        });
        setStatus({ type: 'idle', message: null });
    };

    const resetMutation = useMutation({
        mutationFn: async (data) => {
            await api.get('/sanctum/csrf-cookie');
            // Combine the URL data with the form data
            const payload = { ...data, token, email };
            const response = await api.post('/api/reset-password', payload);
            return response.data;
        },
        onSuccess: (data) => {
            setStatus({ type: 'success', message: data.message });
            // Redirect to login after 3 seconds so they can read the success message
            setTimeout(() => navigate('/'), 3000);
        },
        onError: (err) => {
            const message = err.response?.data?.message || 'Failed to reset password. The link may have expired.';
            setStatus({ type: 'error', message });
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!email || !token) {
            setStatus({ type: 'error', message: 'Invalid password reset link.' });
            return;
        }

        if (passwords.password.length < 8) {
            setStatus({ type: 'error', message: 'Password must be at least 8 characters.' });
            return;
        }

        if (passwords.password !== passwords.password_confirmation) {
            setStatus({ type: 'error', message: 'Passwords do not match.' });
            return;
        }

        resetMutation.mutate(passwords);
    };

    return {
        passwords,
        status,
        isLoading: resetMutation.isPending,
        handleChange,
        handleSubmit
    };
};