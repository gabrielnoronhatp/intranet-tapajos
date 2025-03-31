'use client';
import axios from 'axios';
import { setToken } from '@/hooks/slices/token/tokenSlice';

// Create a function to get store only on client side
const getStore = () => {
    if (typeof window !== 'undefined') {
        // Dynamic import to avoid SSR issues
        return import('@/hooks/store').then((module) => module.default);
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
        const response = await axios.post('http://10.2.10.202:8000/token', {
            username: 'trade',
            password: '#$%23345',
        });
        const newToken = response.data.access_token;

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

// Função para criar instância de API
const createApiInstance = () => {
    const instance = axios.create({
        baseURL: 'http://10.2.10.202:8000/',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (typeof window !== 'undefined') {
        instance.interceptors.request.use(async (config) => {
            const token = getStoredToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });
    }

    return instance;
};

export const apiInstance = createApiInstance();
