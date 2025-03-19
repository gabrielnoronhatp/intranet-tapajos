import axios from 'axios'
import { localeData } from 'moment';
const baseUrl = 'http://10.2.10.17:3001/api/';
const devUrl = 'http://10.2.10.17:3002/api/';
const localUrl = 'http://localhost:3002/api/';

const api = axios.create({
    baseURL: localUrl,
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

export { api, apiDev };
