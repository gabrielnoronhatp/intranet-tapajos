'use client';
import axios from 'axios';
import { setToken } from '@/hooks/slices/token/tokenSlice';

// Create a function to get store only on client side
const getStore = () => {
    if (typeof window !== 'undefined') {
        // Dynamic import to avoid SSR issues
        return import('@/hooks/store').then(module => module.default);
    }
    return null;
};

// Função para obter token do localStorage (client-side)
const getStoredToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('auth_token');
    }
    return null;
};

// Função para salvar token no localStorage (client-side)
const saveTokenToStorage = (token: string) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', token);
    }
};

const refreshTokenSilently = async () => {
    try {
        console.log('Refreshing token silently...');
        const response = await axios.post('http://10.2.10.202:8000/token', {
            username: 'trade',
            password: '#$%23345',
        });
        const newToken = response.data.access_token;
        console.log('New token obtained:', newToken ? 'Yes (token exists)' : 'No');
        
        // Salvar no Redux (apenas no cliente)
        if (typeof window !== 'undefined') {
            const store = await getStore();
            if (store) {
                store.dispatch(setToken({ token: newToken }));
            }
        }
        
        // Salvar no localStorage para persistência
        saveTokenToStorage(newToken);
        
        return newToken;
    } catch (error) {
        console.error('Error refreshing token:', error);
        return null;
    }
};

// Create API instance factory function
const createApiInstance = () => {
    const instance = axios.create({
        baseURL: 'http://10.2.10.202:8000/',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // Only add interceptors on the client side
    if (typeof window !== 'undefined') {
        instance.interceptors.request.use(async (config) => {
            let token = null;
            
            // Try to get token from localStorage first
            token = getStoredToken();
            
            // If no token in localStorage, refresh it
            if (!token) {
                console.log('No token found, refreshing...');
                token = await refreshTokenSilently();
            }
            
            if (token) {
                console.log('Setting Authorization header with token');
                config.headers.Authorization = `Bearer ${token}`;
            } else {
                console.warn('No token available for request');
            }
            
            return config;
        });
    }

    return instance;
};

// Export a lazy-initialized API instance
export const apiCampaing = createApiInstance();
