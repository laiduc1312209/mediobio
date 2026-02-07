'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authAPI, profileAPI, bioAPI, contactsAPI, adminAPI } from '@/lib/api';
import Cookies from 'js-cookie';

// Auth hooks
export function useRegister() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: authAPI.register,
        onSuccess: (data) => {
            if (data.data.token) {
                Cookies.set('token', data.data.token, { expires: 7, path: '/' });
                queryClient.setQueryData(['currentUser'], data.data.user);
                queryClient.invalidateQueries({ queryKey: ['currentUser'] });
            }
        },
    });
}

export function useLogin() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: authAPI.login,
        onSuccess: (data) => {
            if (data.data.token) {
                Cookies.set('token', data.data.token, { expires: 7, path: '/' });
                queryClient.setQueryData(['currentUser'], data.data.user);
                queryClient.invalidateQueries({ queryKey: ['currentUser'] });
            }
        },
    });
}

export function useCurrentUser() {
    return useQuery({
        queryKey: ['currentUser'],
        queryFn: async () => {
            const token = Cookies.get('token');
            if (!token) return null;
            try {
                const response = await authAPI.getCurrentUser();
                return response.data.user;
            } catch (error) {
                return null;
            }
        },
        retry: false,
    });
}

export function useLogout() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: authAPI.logout,
        onSuccess: () => {
            Cookies.remove('token', { path: '/' });
            queryClient.clear();
            window.location.href = '/';
        },
    });
}

// Profile hooks
export function useProfile() {
    return useQuery({
        queryKey: ['profile'],
        queryFn: async () => {
            const response = await profileAPI.getProfile();
            return response.data.profile;
        },
    });
}

export function useCreateProfile() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: profileAPI.createProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile'] });
        },
    });
}

export function useUpdateProfile() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: profileAPI.updateProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile'] });
        },
    });
}

export function useUploadAvatar() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: profileAPI.uploadAvatar,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile'] });
        },
    });
}

// Bio hooks
export function useBio(username: string) {
    return useQuery({
        queryKey: ['bio', username],
        queryFn: async () => {
            const response = await bioAPI.getBio(username);
            return response.data.bio;
        },
        retry: false,
    });
}

export function useVerifyPin() {
    return useMutation({
        mutationFn: ({ username, pin }: { username: string; pin: string }) =>
            bioAPI.verifyPin(username, pin),
    });
}

// Contacts hooks
export function useContacts() {
    return useQuery({
        queryKey: ['contacts'],
        queryFn: async () => {
            const response = await contactsAPI.getContacts();
            return response.data.contacts;
        },
    });
}

export function useCreateContact() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: contactsAPI.createContact,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['contacts'] });
        },
    });
}

export function useUpdateContact() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ contactId, data }: { contactId: string; data: any }) =>
            contactsAPI.updateContact(contactId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['contacts'] });
        },
    });
}

export function useDeleteContact() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: contactsAPI.deleteContact,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['contacts'] });
        },
    });
}

// Admin hooks
export function useAdminStats() {
    return useQuery({
        queryKey: ['admin', 'stats'],
        queryFn: async () => {
            const response = await adminAPI.getStats();
            return response.data.stats;
        },
    });
}

export function useAdminUsers() {
    return useQuery({
        queryKey: ['admin', 'users'],
        queryFn: async () => {
            const response = await adminAPI.getUsers();
            return response.data;
        },
    });
}

export function useAdminProfiles() {
    return useQuery({
        queryKey: ['admin', 'profiles'],
        queryFn: async () => {
            const response = await adminAPI.getProfiles();
            return response.data;
        },
    });
}

export function useDeleteUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: adminAPI.deleteUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin'] });
        },
    });
}

export function useDeleteProfile() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: adminAPI.deleteProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin'] });
        },
    });
}

export function useAdminKeys() {
    return useQuery({
        queryKey: ['admin', 'keys'],
        queryFn: async () => {
            const response = await adminAPI.getKeys();
            return response.data;
        },
    });
}

export function useGenerateKeys() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: adminAPI.generateKeys,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'keys'] });
        },
    });
}
