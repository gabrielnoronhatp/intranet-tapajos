import axios from 'axios';
import React from 'react';

const baseUrl = 'http://10.2.10.17:3001/api/';
const localUrl = 'http://localhost:3002/api/';

const api = axios.create({
    baseURL: baseUrl,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

export default api;
