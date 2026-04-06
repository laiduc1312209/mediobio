'use client';

import { useProfile, useCreateProfile } from '@/lib/hooks';
import Link from 'next/link';
import { Link as LinkIcon, User, QrCode, ExternalLink, Copy } from 'lucide-react';

export default function DashboardPage() {
    const { data: profile, isLoading } = useProfile();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Tổng Quan
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Quản lý hồ sơ y tế và thông tin cá nhân của bạn.
                    </p>
                </div>

                {profile && (
                    <Link
                        href={`/bio/${profile.bioSlug}`} // Note: Need to get bioSlug from user or profile
                        target="_blank"
                        className="inline-flex items-center justify-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors gap-2"
                    >
                        <ExternalLink className="w-5 h-5" />
                        Xem Bio Công Khai
                    </Link>
                )}
            </div>

            {profile && (
                <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-xl p-6 mb-8">
                    <h3 className="text-lg font-bold text-indigo-800 dark:text-indigo-300 mb-3 flex items-center gap-2">
                        <LinkIcon className="w-5 h-5" />
                        Chia sẻ hồ sơ y tế của bạn
                    </h3>
                    <p className="text-indigo-700 dark:text-indigo-200 text-sm mb-3">
                        Link này cho phép người khác (bác sĩ, nhân viên y tế, gia đình) xem hồ sơ y tế của bạn trong trường hợp khẩn cấp
                    </p>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            readOnly
                            value={`${window.location.origin}/bio/${profile.bioSlug}`}
                            className="flex-1 px-4 py-2 border border-indigo-200 dark:border-indigo-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                        />
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(`${window.location.origin}/bio/${profile.bioSlug}`);
                                alert('Đã sao chép link!');
                            }}
                            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                        >
                            <Copy className="w-5 h-5" />
                            Sao chép
                        </button>
                    </div>
                </div>
            )}

            {/* Quick Actions Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Profile Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg">
                            <User className="w-6 h-6" />
                        </div>
                        {profile ? (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                Đã tạo
                            </span>
                        ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                                Chưa có
                            </span>
                        )}
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Hồ Sơ Y Tế</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 flex-1">
                        Thông tin cơ bản, nhóm máu, tiền sử bệnh và ghi chú bác sĩ.
                    </p>

                    <Link
                        href={profile ? "/dashboard/profile" : "/dashboard/profile/create"}
                        className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors text-center"
                    >
                        {profile ? "Chỉnh sửa hồ sơ" : "Tạo hồ sơ ngay"}
                    </Link>
                </div>

                {/* QR Code Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg">
                            <QrCode className="w-6 h-6" />
                        </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Mã QR & Thẻ</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 flex-1">
                        Tải mã QR hoặc in thẻ thành viên để mang theo bên mình.
                    </p>

                    <Link
                        href="/dashboard/qr"
                        className={`w-full py-2.5 px-4 font-medium rounded-lg transition-colors text-center ${profile
                            ? "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600"
                            }`}
                        onClick={(e) => !profile && e.preventDefault()}
                    >
                        Xem mã QR
                    </Link>
                </div>
            </div>

            {/* Recent Activity or Status */}
            {!profile && (
                <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-xl p-6">
                    <h4 className="text-lg font-bold text-indigo-800 dark:text-indigo-300 mb-2">
                        Chào mừng bạn mới! 👋
                    </h4>
                    <p className="text-indigo-700 dark:text-indigo-200 mb-4">
                        Để bắt đầu, hãy tạo hồ sơ y tế của bạn. Hồ sơ này sẽ giúp các bác sĩ và nhân viên y tế nắm bắt tình trạng sức khỏe của bạn nhanh chóng trong trường hợp khẩn cấp.
                    </p>
                    <Link href="/dashboard/profile/create" className="text-indigo-700 dark:text-indigo-300 font-semibold hover:underline">
                        Tạo hồ sơ ngay &rarr;
                    </Link>
                </div>
            )}
        </div>
    );
}
