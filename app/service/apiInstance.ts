import axios from 'axios';
import store from '@/hooks/store';

const createApiInstance = () => {
    const token = localStorage.getItem('tradeToken');

    return axios.create({
        baseURL: 'http://10.2.10.202:8000/',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
};

export const apiCampaing = createApiInstance();
