'use client';
import axios from 'axios';

const getStoredToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('auth_token');
    }
    return null;
};

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
