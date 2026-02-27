'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useRegister, useCurrentUser } from '@/lib/hooks';

export default function RegisterPage() {
    const router = useRouter();
    const { data: user, isLoading } = useCurrentUser();

    useEffect(() => {
        if (user && !isLoading) {
            router.push('/dashboard');
        }
    }, [user, isLoading, router]);

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        invitationKey: '',
    });
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const registerMutation = useRegister();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (formData.password !== formData.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }

        if (formData.password.length < 8) {
            setError('Mật khẩu phải có ít nhất 8 ký tự');
            return;
        }

        if (!/^[a-zA-Z0-9_-]+$/.test(formData.username)) {
            setError('Tên đăng nhập chỉ được chứa chữ cái, số, gạch ngang và gạch dưới');
            return;
        }

        if (!agreedToTerms) {
            setError('Bạn phải đồng ý với Điều khoản sử dụng để tiếp tục');
            return;
        }

        if (!formData.invitationKey) {
            setError('Vui lòng nhập mã giới thiệu');
            return;
        }

        if (!formData.invitationKey.startsWith('medi_')) {
            setError('Key không hợp lệ (phải bắt đầu bằng medi_)');
            return;
        }

        try {
            await registerMutation.mutateAsync({
                username: formData.username,
                email: formData.email,
                password: formData.password,
                invitationKey: formData.invitationKey,
            });
            setSuccess('Đăng ký thành công! Đang chuyển hướng...');
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
                setError(serverError || 'Đăng ký thất bại. Vui lòng thử lại.');
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

                {/* Register Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                        Tạo Tài Khoản
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                        Tạo bio y tế an toàn của bạn ngay hôm nay
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

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Invitation Key Input */}
                        <div>
                            <label htmlFor="invitationKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Key
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                    </svg>
                                </div>
                                <input
                                    id="invitationKey"
                                    type="text"
                                    name="invitationKey"
                                    value={formData.invitationKey}
                                    onChange={(e) => setFormData({ ...formData, invitationKey: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="medi_XXXXXXXX"
                                    required
                                    disabled={!!success || registerMutation.isPending}
                                />
                            </div>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Liên hệ Admin để lấy mã</p>
                        </div>

                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Tên người dùng
                            </label>
                            <input
                                id="username"
                                type="text"
                                required
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="nguyenvana (a-z, 0-9, -, _)"
                                disabled={!!success || registerMutation.isPending}
                            />
                        </div>

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
                                disabled={!!success || registerMutation.isPending}
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
                                placeholder="Tối thiểu 8 ký tự"
                                disabled={!!success || registerMutation.isPending}
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Xác nhận mật khẩu
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                required
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="Nhập lại mật khẩu"
                                disabled={!!success || registerMutation.isPending}
                            />
                        </div>

                        {/* Terms Agreement Checkbox */}
                        <div className="flex items-start gap-3 mt-2">
                            <input
                                id="agreedToTerms"
                                type="checkbox"
                                checked={agreedToTerms}
                                onChange={(e) => setAgreedToTerms(e.target.checked)}
                                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer accent-blue-600"
                                disabled={!!success || registerMutation.isPending}
                            />
                            <label htmlFor="agreedToTerms" className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer select-none">
                                Tôi đã đọc và đồng ý với{' '}
                                <Link href="/terms" target="_blank" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                                    Điều khoản sử dụng & Miễn trừ trách nhiệm
                                </Link>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={registerMutation.isPending || !!success || !agreedToTerms}
                            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                        >
                            {registerMutation.isPending || !!success ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    {!!success ? 'Đang chuyển hướng...' : 'Đang tạo tài khoản...'}
                                </>
                            ) : (
                                'Tạo Tài Khoản'
                            )}
                        </button>
                    </form>
                </div>

                {/* Login Link */}
                <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
                    Đã có tài khoản?{' '}
                    <Link href="/auth/login" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                        Đăng nhập
                    </Link>
                </p>
            </div>
        </div>
    );
}
