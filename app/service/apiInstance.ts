import axios from 'axios';
import store from '@/hooks/store';
import { setToken } from '@/hooks/slices/token/tokenSlice';

const api = axios.create({
    baseURL: 'http://10.2.10.202:8000/',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(async (config) => {
    let token = store.getState().token.token;
    
    if (!token) {
        token = await refreshTokenSilently();
    }
    
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
});

// Função independente para refresh do token
const refreshTokenSilently = async () => {
    try {
        const response = await axios.post('http://10.2.10.202:8000/token', {
            username: 'trade',
            password: '#$%23345',
        });
        const newToken = response.data.access_token;
        store.dispatch(setToken({ token: newToken }));
        return newToken;
    } catch (error) {
        console.error('Error refreshing token:', error);
        return null;
    }
};

export const apiCampaing = api;
