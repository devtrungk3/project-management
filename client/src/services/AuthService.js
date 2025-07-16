import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

export const loginApi = async (formData) => {
    try {
        const response = await api.post('auth/login', formData);
        return response.data;
    } catch (error) {
        console.error('Login error: ', error);
        throw error;
    }
}
export const registerApi = async (formData) => {
    try {
        const response = await api.post('auth/register', formData);
        return response.data;
    } catch (error) {
        console.error('Register error: ', error);
        throw error;
    }
}