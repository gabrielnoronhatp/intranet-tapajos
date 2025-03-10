'use client';
import axios from 'axios';
import store from '@/hooks/store';
import { setToken } from '@/hooks/slices/token/tokenSlice';

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
        
        // Salvar no Redux
        store.dispatch(setToken({ token: newToken }));
        
        // Salvar no localStorage para persistência
        saveTokenToStorage(newToken);
        
        return newToken;
    } catch (error) {
        console.error('Error refreshing token:', error);
        return null;
    }
};

const api = (() => {
    const instance = axios.create({
        baseURL: 'http://10.2.10.202:8000/',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    instance.interceptors.request.use(async (config) => {
        // Tentar obter token do Redux
        let token = store.getState().token.token;
        
        // Se não existir no Redux, tentar localStorage
        if (!token) {
            token = getStoredToken();
            
            // Se existir no localStorage, atualizar Redux
            if (token) {
                store.dispatch(setToken({ token }));
            }
        }
        
        // Se ainda não tiver token, obter um novo
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

    return instance;
})();

export const apiCampaing = api;
