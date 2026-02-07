'use client';

import { useCurrentUser, useProfile } from '@/lib/hooks';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Shield, Home, LogOut } from 'lucide-react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: user, isLoading: userLoading } = useCurrentUser();
    const { data: profile } = useProfile();
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

    useEffect(() => {
        // Check if user is admin - admin1312
        if (!userLoading && user) {
            if (user.username === 'admin1312') {
                setIsAdmin(true);
            } else {
                setIsAdmin(false);
                router.push('/dashboard');
            }
        } else if (!userLoading && !user) {
            router.push('/auth/login');
        }
    }, [user, userLoading, router]);

    if (userLoading || isAdmin === null) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!isAdmin) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col">
            {/* Admin Navbar */}
            <nav className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin" className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                                <Shield className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-bold text-white text-lg">Admin Panel</span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            href="/dashboard"
                            className="text-gray-400 hover:text-white flex items-center gap-2 text-sm"
                        >
                            <Home className="w-4 h-4" />
                            Dashboard
                        </Link>

                        <div className="h-6 w-px bg-gray-700"></div>

                        <div className="flex items-center gap-2">
                            {profile?.avatarUrl ? (
                                <img src={profile.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-sm">
                                    A
                                </div>
                            )}
                            <span className="text-gray-300 text-sm">{user?.username}</span>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
                {children}
            </main>
        </div>
    );
}
