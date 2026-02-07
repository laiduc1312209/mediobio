import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Create axios instance
const api = axios.create({
    baseURL: `${API_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = Cookies.get('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            // Don't redirect if we're already on login page or if it's a login request
            const isLoginRequest = error.config?.url?.includes('/auth/login');

            if (!isLoginRequest) {
                Cookies.remove('token');
                if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth/login')) {
                    window.location.href = '/auth/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;

// Auth API
export const authAPI = {
    register: (data: { email: string; password: string; username: string; invitationKey?: string }) =>
        api.post('/auth/register', data),

    login: (data: { email: string; password: string }) =>
        api.post('/auth/login', data),

    getCurrentUser: () =>
        api.get('/auth/me'),

    logout: () =>
        api.post('/auth/logout'),
};

// Profile API
export const profileAPI = {
    createProfile: (data: any) =>
        api.post('/profile', data),

    getProfile: () =>
        api.get('/profile'),

    updateProfile: (data: any) =>
        api.put('/profile', data),

    deleteProfile: () =>
        api.delete('/profile'),

    uploadAvatar: (file: File) => {
        const formData = new FormData();
        formData.append('avatar', file);
        return api.post('/profile/avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
};

// Bio API
export const bioAPI = {
    getBio: (username: string) =>
        api.get(`/bio/${username}`),

    verifyPin: (username: string, pin: string) =>
        api.post(`/bio/${username}/verify-pin`, { pin }),
};

// Contacts API
export const contactsAPI = {
    getContacts: () =>
        api.get('/contacts'),

    createContact: (data: any) =>
        api.post('/contacts', data),

    updateContact: (contactId: string, data: any) =>
        api.put(`/contacts/${contactId}`, data),

    deleteContact: (contactId: string) =>
        api.delete(`/contacts/${contactId}`),
};

// Admin API
export const adminAPI = {
    getStats: () =>
        api.get('/admin/stats'),

    getUsers: (limit: number = 50, offset: number = 0) =>
        api.get(`/admin/users?limit=${limit}&offset=${offset}`),

    getProfiles: (limit: number = 50, offset: number = 0) =>
        api.get(`/admin/profiles?limit=${limit}&offset=${offset}`),

    deleteUser: (userId: string) =>
        api.delete(`/admin/users/${userId}`),

    deleteProfile: (profileId: string) =>
        api.delete(`/admin/profiles/${profileId}`),

    generateKeys: (amount: number) =>
        api.post('/admin/keys/generate', { amount }),

    getKeys: (limit: number = 50, offset: number = 0) =>
        api.get(`/admin/keys?limit=${limit}&offset=${offset}`),
};
