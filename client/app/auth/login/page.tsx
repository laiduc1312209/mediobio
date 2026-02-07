'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLogin, useCurrentUser } from '@/lib/hooks';

export default function LoginPage() {
    const router = useRouter();
    const { data: user, isLoading } = useCurrentUser();

    useEffect(() => {
        if (user && !isLoading) {
            router.push('/dashboard');
        }
    }, [user, isLoading, router]);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const loginMutation = useLogin();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            await loginMutation.mutateAsync(formData);
            setSuccess('Đăng nhập thành công! Đang chuyển hướng...');
            setTimeout(() => {
                router.push('/dashboard');
            }, 1500);
        } catch (err: any) {
            const serverError = err.response?.data?.error;
            const details = err.response?.data?.details;

            if (details) {
                const firstError = details[0];
                setError(`${firstError.path.join('.')}: ${firstError.message}`);
            } else {
                setError(serverError || 'Đăng nhập thất bại. Vui lòng thử lại.');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                            M
                        </div>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">MediBio</span>
                    </Link>
                </div>

                {/* Login Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                        Đăng Nhập
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                        Chào mừng trở lại! Vui lòng đăng nhập để tiếp tục.
                    </p>

                    {error && (
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow-sm flex items-start dark:bg-red-900/40 dark:text-red-300">
                            <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <span className="font-medium">{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded shadow-sm flex items-start dark:bg-green-900/40 dark:text-green-300">
                            <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="font-medium">{success}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="example@email.com"
                                disabled={!!success || loginMutation.isPending}
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Mật khẩu
                            </label>
                            <input
                                id="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="••••••••"
                                disabled={!!success || loginMutation.isPending}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loginMutation.isPending || !!success}
                            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loginMutation.isPending || !!success ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    {!!success ? 'Đang chuyển hướng...' : 'Đang đăng nhập...'}
                                </>
                            ) : (
                                'Đăng Nhập'
                            )}
                        </button>
                    </form>
                </div>

                {/* Register Link */}
                <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
                    Chưa có tài khoản?{' '}
                    <Link href="/auth/register" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                        Đăng ký ngay
                    </Link>
                </p>
            </div>
        </div>
    );
}
