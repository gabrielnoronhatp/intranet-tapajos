'use client';
import { useEffect } from 'react';
import axios from 'axios';

import { useDispatch } from 'react-redux';
import { setToken } from './slices/token/tokenSlice';
import { AppDispatch } from './store';

const useTokenRefresh = () => {
    const dispatch = useDispatch<AppDispatch>();

    const tokenCall = async () => {
        try {
            const response = await axios.post('http://10.2.10.202:8000/token', {
                username: 'trade',
                password: '#$%23345',
            });
            const newToken = response.data.access_token;
            dispatch(setToken(newToken as never));
            if (typeof window !== 'undefined') {
                localStorage.setItem('auth_token', newToken);
            }

            return newToken;
        } catch (error) {
            console.error('Error fetching token:', error);
            return null;
        }
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            tokenCall();
            const intervalId = setInterval(() => {
                tokenCall();
            }, 1800000);

            return () => clearInterval(intervalId);
        }
    }, [dispatch]);

    return tokenCall;
};

export default useTokenRefresh;
