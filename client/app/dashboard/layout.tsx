'use client';

import { useCurrentUser, useLogout, useProfile } from '@/lib/hooks';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Shield } from 'lucide-react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: user, isLoading, isError } = useCurrentUser();
    const { data: profile } = useProfile();
    const logoutMutation = useLogout();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/auth/login');
        }
    }, [user, isLoading, router]);

    const handleLogout = () => {
        if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
            logoutMutation.mutate();
        }
    };

    // Skeleton Loading State
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
                {/* Navbar Skeleton */}
                <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-100 dark:border-gray-700 sticky top-0 z-10">
                    <div className="container-custom h-16 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                            <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse hidden sm:block"></div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse hidden sm:block"></div>
                            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                        </div>
                    </div>
                </nav>

                <main className="flex-1 container-custom py-8">
                    {/* Content Skeleton */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        <div className="h-40 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 animate-pulse">
                            <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                            <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                            <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                        <div className="h-40 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 animate-pulse">
                            <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                            <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                            <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                        <div className="h-40 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 animate-pulse">
                            <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                            <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                            <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    if (!user) {
        return null; // Will redirect
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
            {/* Navbar */}
            <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-100 dark:border-gray-700 sticky top-0 z-10">
                <div className="container-custom h-16 flex items-center justify-between">
                    <Link href="/dashboard" className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/20">
                            M
                        </div>
                        <span className="font-bold text-gray-900 dark:text-white text-lg hidden sm:block">MediBio</span>
                    </Link>

                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600 dark:text-gray-300 hidden sm:block">
                            Xin chào, <strong>{user.username}</strong>
                        </span>
                        {profile?.avatarUrl ? (
                            <img
                                src={profile.avatarUrl}
                                alt={user.username}
                                className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-100 dark:ring-indigo-900/30"
                            />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-sm">
                                {user.username[0].toUpperCase()}
                            </div>
                        )}

                        {/* Admin Button - only for admin1312 */}
                        {user.username === 'admin1312' && (
                            <Link
                                href="/admin"
                                className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                            >
                                <Shield className="w-4 h-4" />
                                <span className="hidden sm:inline">Admin</span>
                            </Link>
                        )}

                        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>

                        <button
                            onClick={handleLogout}
                            disabled={logoutMutation.isPending}
                            className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                            title="Đăng xuất"
                        >
                            <span className="hidden sm:inline">Đăng xuất</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </button>
                    </div>
                </div>
            </nav>

            <main className="flex-1 container-custom py-8">
                {children}
            </main>
        </div>
    );
}
