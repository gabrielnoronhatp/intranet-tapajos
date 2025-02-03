import axios from 'axios';

const api = axios.create({
    baseURL: 'http://10.2.10.17:3001/api/', 
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});



export default api;