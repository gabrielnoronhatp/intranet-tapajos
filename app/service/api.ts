import axios from 'axios';
import React from 'react';

const baseUrl = 'http://10.2.10.17:3001/api/';
const devUrl = 'http://10.2.10.17:3002/api/';const localUrl = 'http://localhost:3002/api/';

const api = axios.create({
    baseURL: baseUrl,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
    withCredentials: false,
});

const apiDev = axios.create({
    baseURL: devUrl,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
    withCredentials: false,
});

const apiCampaing = axios.create({
    
    baseURL: 'http://10.2.10.202:8000/',
    headers: {
        'Content-Type': 'application/json',
         Accept: 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    },
 
});

export { api, apiDev, apiCampaing };
