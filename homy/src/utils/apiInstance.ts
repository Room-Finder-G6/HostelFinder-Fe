import axios from "axios";

const apiInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || http://localhost:8080/api,
    withCredentials: true,
   
});

apiInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiInstance;
