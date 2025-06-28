import { useMutation } from '@tanstack/react-query';
import api from '@/api/api';

interface UserData {
    username: string;
    email: string;
    password: string;
}

interface LoginData {
    username: string;
    password: string;
}

export const useRegisterUser = () => {
    return useMutation({
        mutationFn: async (userData: UserData) => {
            const response = await api.post('/api/auth/register', userData);
            return response.data;
        },
    });
};

export const useLoginUser = () => {
    return useMutation({
        mutationFn: async (userData: LoginData) => {
            const response = await api.post('/api/auth/login', userData);
            return response.data;
        },
    });
};
