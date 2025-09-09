import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

export const loginApi = async (formData) => {
    try {
        const csrf = await getCsrfToken();
        const response = await api.post(
            'auth/login', 
            formData,
            {
                headers: {
                "X-XSRF-TOKEN": csrf?.token || ""
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Login error: ', error);
        throw error;
    }
}
export const registerApi = async (formData) => {
    try {
        const csrf = await getCsrfToken();
        const response = await api.post(
            'auth/register', 
            formData,
            {
                headers: {
                "X-XSRF-TOKEN": csrf?.token || ""
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Register error: ', error);
        throw error;
    }
}
export const getCsrfToken = async () => {
    try {
        const response = await api.get('auth/csrf-token');
        return response.data;
    } catch (error) {
        console.error('Get csrf token error: ', error);
        throw error;
    }
}