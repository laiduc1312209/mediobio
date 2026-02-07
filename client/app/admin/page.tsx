'use client';

import { useAdminStats, useAdminUsers, useAdminProfiles, useDeleteUser, useDeleteProfile, useAdminKeys, useGenerateKeys } from '@/lib/hooks';
import { Users, FileText, Phone, Trash2, Eye, RefreshCw, Key, Plus } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
    const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useAdminStats();
    const { data: usersData, isLoading: usersLoading, refetch: refetchUsers } = useAdminUsers();
    const { data: profilesData, isLoading: profilesLoading, refetch: refetchProfiles } = useAdminProfiles();
    const { data: keysData, isLoading: keysLoading, refetch: refetchKeys } = useAdminKeys();

    const deleteUserMutation = useDeleteUser();
    const deleteProfileMutation = useDeleteProfile();
    const generateKeysMutation = useGenerateKeys();

    const [activeTab, setActiveTab] = useState<'users' | 'profiles' | 'keys'>('users');
    const [generateAmount, setGenerateAmount] = useState(5);

    const handleDeleteUser = async (userId: string, username: string) => {
        if (confirm(`Xác nhận xóa user "${username}"? Hành động này không thể hoàn tác.`)) {
            try {
                await deleteUserMutation.mutateAsync(userId);
                refetchStats();
            } catch (error) {
                console.error('Delete failed:', error);
            }
        }
    };

    const handleDeleteProfile = async (profileId: string, fullName: string) => {
        if (confirm(`Xác nhận xóa hồ sơ của "${fullName}"? Hành động này không thể hoàn tác.`)) {
            try {
                await deleteProfileMutation.mutateAsync(profileId);
                refetchStats();
            } catch (error) {
                console.error('Delete failed:', error);
            }
        }
    };

    const handleGenerateKeys = async () => {
        try {
            await generateKeysMutation.mutateAsync(generateAmount);
            refetchKeys();
            alert(`Đã tạo thành công ${generateAmount} key!`);
        } catch (error) {
            console.error('Generate keys failed:', error);
            alert('Có lỗi xảy ra khi tạo mã.');
        }
    };

    const handleRefresh = () => {
        refetchStats();
        refetchUsers();
        refetchProfiles();
        refetchKeys();
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                    <p className="text-gray-400 mt-1">Quản lý users và hồ sơ y tế</p>
                </div>
                <button
                    onClick={handleRefresh}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                    <RefreshCw className="w-4 h-4" />
                    Làm mới
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/20 rounded-xl">
                            <Users className="w-8 h-8" />
                        </div>
                        <div>
                            <div className="text-sm opacity-80">Tổng Users</div>
                            <div className="text-3xl font-bold">
                                {statsLoading ? '...' : stats?.userCount || 0}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-2xl p-6 text-white">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/20 rounded-xl">
                            <FileText className="w-8 h-8" />
                        </div>
                        <div>
                            <div className="text-sm opacity-80">Hồ Sơ Y Tế</div>
                            <div className="text-3xl font-bold">
                                {statsLoading ? '...' : stats?.profileCount || 0}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-6 text-white">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/20 rounded-xl">
                            <Phone className="w-8 h-8" />
                        </div>
                        <div>
                            <div className="text-sm opacity-80">Liên Hệ</div>
                            <div className="text-3xl font-bold">
                                {statsLoading ? '...' : stats?.contactCount || 0}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-orange-600 to-orange-800 rounded-2xl p-6 text-white">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/20 rounded-xl">
                            <Key className="w-8 h-8" />
                        </div>
                        <div>
                            <div className="text-sm opacity-80">Key</div>
                            <div className="text-3xl font-bold">
                                {keysLoading ? '...' : keysData?.total || 0}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-700 pb-4">
                <button
                    onClick={() => setActiveTab('users')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'users'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:text-white'
                        }`}
                >
                    <Users className="w-4 h-4 inline-block mr-2" />
                    Users
                </button>
                <button
                    onClick={() => setActiveTab('profiles')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'profiles'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:text-white'
                        }`}
                >
                    <FileText className="w-4 h-4 inline-block mr-2" />
                    Hồ Sơ
                </button>
                <button
                    onClick={() => setActiveTab('keys')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'keys'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:text-white'
                        }`}
                >
                    <Key className="w-4 h-4 inline-block mr-2" />
                    Key
                </button>
            </div>

            {/* Users Table */}
            {activeTab === 'users' && (
                <div className="bg-gray-800 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-700">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Username</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Bio Slug</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Admin</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Ngày tạo</th>
                                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {usersLoading ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                                            Đang tải...
                                        </td>
                                    </tr>
                                ) : usersData?.users?.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                                            Không có dữ liệu
                                        </td>
                                    </tr>
                                ) : (
                                    usersData?.users?.map((user: any) => (
                                        <tr key={user.id} className="hover:bg-gray-750">
                                            <td className="px-6 py-4 whitespace-nowrap text-white font-medium">
                                                {user.username}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                                                {user.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                                                {user.bio_slug}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {user.is_admin ? (
                                                    <span className="px-2 py-1 bg-purple-600/30 text-purple-400 rounded text-xs">Admin</span>
                                                ) : (
                                                    <span className="px-2 py-1 bg-gray-600/30 text-gray-400 rounded text-xs">User</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-400 text-sm">
                                                {new Date(user.created_at).toLocaleDateString('vi-VN')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <button
                                                    onClick={() => handleDeleteUser(user.id, user.username)}
                                                    disabled={user.is_admin || deleteUserMutation.isPending}
                                                    className="text-red-400 hover:text-red-300 disabled:opacity-30 disabled:cursor-not-allowed"
                                                    title={user.is_admin ? 'Không thể xóa admin' : 'Xóa user'}
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Profiles Table */}
            {activeTab === 'profiles' && (
                <div className="bg-gray-800 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-700">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Họ tên</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Username</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Quyền riêng tư</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Ngày tạo</th>
                                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {profilesLoading ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                                            Đang tải...
                                        </td>
                                    </tr>
                                ) : profilesData?.profiles?.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                                            Không có dữ liệu
                                        </td>
                                    </tr>
                                ) : (
                                    profilesData?.profiles?.map((profile: any) => (
                                        <tr key={profile.id} className="hover:bg-gray-750">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    {profile.avatar_url ? (
                                                        <img src={profile.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                                                            {profile.full_name?.[0] || '?'}
                                                        </div>
                                                    )}
                                                    <span className="text-white font-medium">{profile.full_name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                                                {profile.username}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                                                {profile.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 rounded text-xs ${profile.privacy_level === 'pin_protected'
                                                    ? 'bg-yellow-600/30 text-yellow-400'
                                                    : profile.privacy_level === 'public'
                                                        ? 'bg-green-600/30 text-green-400'
                                                        : 'bg-blue-600/30 text-blue-400'
                                                    }`}>
                                                    {profile.privacy_level === 'pin_protected' ? 'PIN' :
                                                        profile.privacy_level === 'public' ? 'Public' : 'Link only'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-400 text-sm">
                                                {new Date(profile.created_at).toLocaleDateString('vi-VN')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/bio/${profile.username}`}
                                                    target="_blank"
                                                    className="text-blue-400 hover:text-blue-300"
                                                    title="Xem Bio"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteProfile(profile.id, profile.full_name)}
                                                    disabled={deleteProfileMutation.isPending}
                                                    className="text-red-400 hover:text-red-300 disabled:opacity-30"
                                                    title="Xóa hồ sơ"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Keys Table */}
            {activeTab === 'keys' && (
                <div className="space-y-6">
                    {/* Generate Keys Action */}
                    <div className="bg-gray-800 rounded-2xl p-6 flex flex-wrap items-end gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">
                                Số lượng mã cần tạo
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="50"
                                value={generateAmount}
                                onChange={(e) => setGenerateAmount(parseInt(e.target.value) || 1)}
                                className="bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2 w-32 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                        <button
                            onClick={handleGenerateKeys}
                            disabled={generateKeysMutation.isPending}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                            {generateKeysMutation.isPending ? (
                                <RefreshCw className="w-5 h-5 animate-spin" />
                            ) : (
                                <Plus className="w-5 h-5" />
                            )}
                            Tạo Key
                        </button>
                    </div>

                    {/* Keys List */}
                    <div className="bg-gray-800 rounded-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Key</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Trạng Thái</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Người Sử Dụng</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Ngày Sử Dụng</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Ngày Tạo</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                    {keysLoading ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                                                Đang tải...
                                            </td>
                                        </tr>
                                    ) : keysData?.keys?.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                                                Chưa có key
                                            </td>
                                        </tr>
                                    ) : (
                                        keysData?.keys?.map((key: any) => (
                                            <tr key={key.id} className="hover:bg-gray-750">
                                                <td className="px-6 py-4 whitespace-nowrap text-white font-mono font-medium text-lg">
                                                    {key.key_code}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {key.is_used ? (
                                                        <span className="px-2 py-1 bg-red-600/30 text-red-400 rounded text-xs font-medium">Đã dùng</span>
                                                    ) : (
                                                        <span className="px-2 py-1 bg-green-600/30 text-green-400 rounded text-xs font-medium">Có sẵn</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                                                    {key.user_used_name ? (
                                                        <div className="flex items-center gap-2">
                                                            <Users className="w-4 h-4 text-gray-500" />
                                                            {key.user_used_name}
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-500">-</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                                                    {key.used_at ? new Date(key.used_at).toLocaleString('vi-VN') : '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-400 text-sm">
                                                    {new Date(key.created_at).toLocaleDateString('vi-VN')}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
