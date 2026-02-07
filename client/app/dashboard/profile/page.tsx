'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useProfile, useUpdateProfile, useContacts, useCreateContact, useDeleteContact, useUploadAvatar } from '@/lib/hooks';
import { ArrowLeft, Droplets, Heart, AlertTriangle, Phone, X, Plus, Shield, Lock, Link2, Trash2, Camera, Loader2 } from 'lucide-react';
import { useRef } from 'react';

interface EmergencyContact {
    id?: string;
    name: string;
    relationship: string;
    phone: string;
}

export default function EditProfilePage() {
    const router = useRouter();
    const { data: profile, isLoading } = useProfile();
    const updateProfileMutation = useUpdateProfile();

    // Emergency contacts hooks
    const { data: existingContacts, isLoading: contactsLoading } = useContacts();
    const createContactMutation = useCreateContact();

    // Avatar upload
    const uploadAvatarMutation = useUploadAvatar();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const deleteContactMutation = useDeleteContact();

    const [formData, setFormData] = useState({
        fullName: '',
        dateOfBirth: '',
        bloodType: '',
        allergies: [] as string[],
        firstAidInstructions: '',
        personalMessage: '',
        privacyLevel: 'link_only' as 'public' | 'link_only' | 'pin_protected',
        pin: '',
    });

    const [allergyInput, setAllergyInput] = useState('');
    const [contactInput, setContactInput] = useState<EmergencyContact>({
        name: '',
        relationship: '',
        phone: '',
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Helper to format date to YYYY-MM-DD for input[type="date"]
    const formatDateForInput = (dateString: string | undefined): string => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return '';
            return date.toISOString().split('T')[0];
        } catch {
            return '';
        }
    };

    // Pre-populate form when profile loads
    useEffect(() => {
        if (profile) {
            setFormData({
                fullName: profile.fullName || '',
                dateOfBirth: formatDateForInput(profile.dateOfBirth),
                bloodType: profile.bloodType || '',
                allergies: profile.allergies || [],
                firstAidInstructions: profile.doctorNotes || '',
                personalMessage: profile.personalMessage || '',
                privacyLevel: profile.privacyLevel || 'link_only',
                pin: '',
            });
        }
    }, [profile]);

    const handleAddAllergy = () => {
        if (allergyInput.trim() && !formData.allergies.includes(allergyInput.trim())) {
            setFormData(prev => ({
                ...prev,
                allergies: [...prev.allergies, allergyInput.trim()]
            }));
            setAllergyInput('');
        }
    };

    const handleRemoveAllergy = (index: number) => {
        setFormData(prev => ({
            ...prev,
            allergies: prev.allergies.filter((_, i) => i !== index)
        }));
    };

    const handleAddContact = async () => {
        if (contactInput.name.trim() && contactInput.phone.trim()) {
            try {
                await createContactMutation.mutateAsync({
                    name: contactInput.name.trim(),
                    relationship: contactInput.relationship.trim() || undefined,
                    phone: contactInput.phone.trim(),
                    priority: (existingContacts?.length || 0) + 1,
                });
                setContactInput({ name: '', relationship: '', phone: '' });
            } catch (err: any) {
                setError('Không thể thêm liên hệ. Vui lòng thử lại.');
            }
        }
    };

    const handleRemoveContact = async (contactId: string) => {
        try {
            await deleteContactMutation.mutateAsync(contactId);
        } catch (err: any) {
            setError('Không thể xóa liên hệ. Vui lòng thử lại.');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.fullName.trim()) {
            setError('Vui lòng nhập họ tên');
            return;
        }
        if (!formData.dateOfBirth) {
            setError('Vui lòng chọn ngày sinh');
            return;
        }
        if (formData.privacyLevel === 'pin_protected' && formData.pin && formData.pin.length !== 4) {
            setError('Mã PIN phải có đúng 4 chữ số');
            return;
        }

        try {
            const submitData = {
                fullName: formData.fullName,
                dateOfBirth: formData.dateOfBirth,
                bloodType: formData.bloodType || undefined,
                allergies: formData.allergies,
                firstAidInstructions: formData.firstAidInstructions || undefined,
                personalMessage: formData.personalMessage || undefined,
                privacyLevel: formData.privacyLevel,
                pin: (formData.privacyLevel === 'pin_protected' && formData.pin) ? formData.pin : undefined,
            };

            await updateProfileMutation.mutateAsync(submitData);
            setSuccess('Hồ sơ đã được cập nhật!');
            setTimeout(() => {
                router.push('/dashboard');
            }, 1500);
        } catch (err: any) {
            const serverError = err.response?.data?.error;
            setError(serverError || 'Không thể cập nhật hồ sơ. Vui lòng thử lại.');
        }
    };

    if (isLoading || contactsLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800 rounded-xl p-6 text-center">
                    <p className="text-yellow-800 dark:text-yellow-300 mb-4">Bạn chưa có hồ sơ y tế.</p>
                    <Link href="/dashboard/profile/create" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                        Tạo hồ sơ ngay →
                    </Link>
                </div>
            </div>
        );
    }

    const isDisabled = updateProfileMutation.isPending || !!success;
    const isContactLoading = createContactMutation.isPending || deleteContactMutation.isPending;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <Link href="/dashboard" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2 mb-4">
                    <ArrowLeft className="w-5 h-5" />
                    Quay lại Dashboard
                </Link>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Chỉnh Sửa Hồ Sơ Y Tế</h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Cập nhật thông tin y tế của bạn.
                </p>
            </div>

            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow-sm flex items-start dark:bg-red-900/40 dark:text-red-300">
                    <X className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="font-medium">{error}</span>
                </div>
            )}

            {success && (
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded shadow-sm flex items-start dark:bg-green-900/40 dark:text-green-300">
                    <span className="font-medium">{success}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Avatar Upload */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Ảnh Đại Diện</h2>
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            {profile?.avatarUrl ? (
                                <img
                                    src={profile.avatarUrl}
                                    alt={formData.fullName}
                                    className="w-24 h-24 rounded-full object-cover ring-4 ring-blue-100 dark:ring-blue-900/30"
                                />
                            ) : (
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center ring-4 ring-blue-100 dark:ring-blue-900/30">
                                    <span className="text-3xl font-bold text-white">{formData.fullName?.[0] || '?'}</span>
                                </div>
                            )}
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploadAvatarMutation.isPending || isDisabled}
                                className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg disabled:opacity-50"
                            >
                                {uploadAvatarMutation.isPending ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Camera className="w-4 h-4" />
                                )}
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        try {
                                            await uploadAvatarMutation.mutateAsync(file);
                                        } catch (err: any) {
                                            setError('Không thể tải ảnh lên. Vui lòng thử lại.');
                                        }
                                    }
                                }}
                            />
                        </div>
                        <div className="flex-1">
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                Nhấn vào biểu tượng máy ảnh để thay đổi ảnh đại diện.
                            </p>
                            <p className="text-gray-500 dark:text-gray-500 text-xs mt-1">
                                Hỗ trợ: JPG, PNG, GIF. Tối đa 5MB.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Basic Information */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Thông Tin Cơ Bản</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Họ và tên <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="fullName"
                                type="text"
                                required
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={isDisabled}
                            />
                        </div>
                        <div>
                            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Ngày sinh <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="dateOfBirth"
                                type="date"
                                required
                                value={formData.dateOfBirth}
                                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={isDisabled}
                            />
                        </div>
                    </div>
                </div>

                {/* Blood Type - HIGHLIGHTED */}
                <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl shadow-lg p-6 text-white">
                    <div className="flex items-center gap-3 mb-4">
                        <Droplets className="w-6 h-6" />
                        <h2 className="text-xl font-bold">Nhóm Máu</h2>
                    </div>
                    <p className="text-sm opacity-90 mb-4">Thông tin quan trọng trong trường hợp cấp cứu</p>
                    <select
                        id="bloodType"
                        value={formData.bloodType}
                        onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                        className="w-full px-4 py-3 border-0 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 text-lg font-semibold"
                        disabled={isDisabled}
                    >
                        <option value="" className="text-gray-900">Chọn nhóm máu</option>
                        <option value="A+" className="text-gray-900">A+</option>
                        <option value="A-" className="text-gray-900">A-</option>
                        <option value="B+" className="text-gray-900">B+</option>
                        <option value="B-" className="text-gray-900">B-</option>
                        <option value="AB+" className="text-gray-900">AB+</option>
                        <option value="AB-" className="text-gray-900">AB-</option>
                        <option value="O+" className="text-gray-900">O+</option>
                        <option value="O-" className="text-gray-900">O-</option>
                    </select>
                </div>

                {/* Allergies */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border-l-4 border-yellow-500 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <AlertTriangle className="w-6 h-6 text-yellow-500" />
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Dị Ứng</h2>
                    </div>
                    <div className="flex gap-2 mb-4">
                        <input
                            type="text"
                            value={allergyInput}
                            onChange={(e) => setAllergyInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAllergy())}
                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            placeholder="Ví dụ: Penicillin, Hải sản, Đậu phộng..."
                            disabled={isDisabled}
                        />
                        <button
                            type="button"
                            onClick={handleAddAllergy}
                            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium flex items-center gap-2"
                            disabled={isDisabled}
                        >
                            <Plus className="w-4 h-4" /> Thêm
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {formData.allergies.map((allergy, index) => (
                            <span key={index} className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-full font-medium">
                                {allergy}
                                <button type="button" onClick={() => handleRemoveAllergy(index)} className="hover:text-yellow-900" disabled={isDisabled}>
                                    <X className="w-4 h-4" />
                                </button>
                            </span>
                        ))}
                    </div>
                </div>

                {/* First Aid Instructions - HIGHLIGHTED */}
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl shadow-lg p-6 text-white">
                    <div className="flex items-center gap-3 mb-4">
                        <Heart className="w-6 h-6" />
                        <h2 className="text-xl font-bold">Hướng Dẫn Sơ Cứu</h2>
                    </div>
                    <p className="text-sm opacity-90 mb-4">Ghi lại những hướng dẫn quan trọng khi bạn cần được sơ cứu</p>
                    <textarea
                        id="firstAidInstructions"
                        rows={4}
                        value={formData.firstAidInstructions}
                        onChange={(e) => setFormData({ ...formData, firstAidInstructions: e.target.value })}
                        className="w-full px-4 py-3 border-0 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                        placeholder="Ví dụ: &#10;- Tôi bị tiểu đường, cần kiểm tra đường huyết&#10;- Tôi có thuốc cấp cứu trong túi&#10;- Liên hệ người thân trước khi đưa đến bệnh viện"
                        disabled={isDisabled}
                    />
                </div>

                {/* Emergency Contacts */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Phone className="w-6 h-6 text-blue-600" />
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Số Điện Thoại Khẩn Cấp</h2>
                    </div>

                    <div className="space-y-4 mb-4">
                        <div className="grid md:grid-cols-3 gap-4">
                            <input
                                type="text"
                                value={contactInput.name}
                                onChange={(e) => setContactInput({ ...contactInput, name: e.target.value })}
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Họ tên"
                                disabled={isDisabled || isContactLoading}
                            />
                            <input
                                type="text"
                                value={contactInput.relationship}
                                onChange={(e) => setContactInput({ ...contactInput, relationship: e.target.value })}
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Mối quan hệ (Vợ, Chồng, Bố, Mẹ...)"
                                disabled={isDisabled || isContactLoading}
                            />
                            <input
                                type="tel"
                                value={contactInput.phone}
                                onChange={(e) => setContactInput({ ...contactInput, phone: e.target.value })}
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Số điện thoại"
                                disabled={isDisabled || isContactLoading}
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleAddContact}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 disabled:opacity-50"
                            disabled={isDisabled || isContactLoading || !contactInput.name.trim() || !contactInput.phone.trim()}
                        >
                            {isContactLoading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <Plus className="w-5 h-5" />
                            )}
                            Thêm Liên Hệ
                        </button>
                    </div>

                    {existingContacts && existingContacts.length > 0 && (
                        <div className="space-y-2">
                            {existingContacts.map((contact: any) => (
                                <div key={contact.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <div>
                                        <span className="font-medium text-gray-900 dark:text-white">{contact.name}</span>
                                        {contact.relationship && <span className="text-gray-500 dark:text-gray-400"> ({contact.relationship})</span>}
                                        <span className="text-blue-600 dark:text-blue-400 ml-2">{contact.phone}</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveContact(contact.id)}
                                        className="text-red-500 hover:text-red-700 disabled:opacity-50"
                                        disabled={isDisabled || isContactLoading}
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Personal Message Section */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Heart className="w-6 h-6 text-pink-600" />
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Lời Nhắn</h2>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Ghi chú cá nhân hoặc lời nhắn cho người xem hồ sơ của bạn (VD: nguyện vọng, hiến tạng, dị ứng đặc biệt...)
                    </p>
                    <textarea
                        value={formData.personalMessage}
                        onChange={(e) => setFormData({ ...formData, personalMessage: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                        placeholder="Ví dụ: Tôi đồng ý hiến tạng trong trường hợp khẩn cấp. Liên hệ bác sĩ riêng của tôi trước khi phẫu thuật..."
                        disabled={isDisabled}
                    />
                </div>

                {/* Privacy Settings */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Shield className="w-6 h-6 text-purple-600" />
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Cài Đặt Quyền Riêng Tư</h2>
                    </div>

                    <div className="space-y-3 mb-4">
                        <label className="flex items-start gap-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <input
                                type="radio"
                                name="privacyLevel"
                                value="link_only"
                                checked={formData.privacyLevel === 'link_only'}
                                onChange={(e) => setFormData({ ...formData, privacyLevel: e.target.value as any })}
                                className="mt-1"
                                disabled={isDisabled}
                            />
                            <div className="flex-1">
                                <div className="flex items-center gap-2 font-medium text-gray-900 dark:text-white">
                                    <Link2 className="w-4 h-4" /> Chỉ qua link
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Chỉ người có link hoặc quét mã QR mới xem được</div>
                            </div>
                        </label>

                        <label className="flex items-start gap-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <input
                                type="radio"
                                name="privacyLevel"
                                value="pin_protected"
                                checked={formData.privacyLevel === 'pin_protected'}
                                onChange={(e) => setFormData({ ...formData, privacyLevel: e.target.value as any })}
                                className="mt-1"
                                disabled={isDisabled}
                            />
                            <div className="flex-1">
                                <div className="flex items-center gap-2 font-medium text-gray-900 dark:text-white">
                                    <Lock className="w-4 h-4" /> Bảo vệ bằng PIN
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Yêu cầu nhập mã PIN 4 số để truy cập</div>
                            </div>
                        </label>
                    </div>

                    {formData.privacyLevel === 'pin_protected' && (
                        <div>
                            <label htmlFor="pin" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Mã PIN mới (4 chữ số) {profile.hasPinProtection && <span className="text-gray-500">(để trống nếu không đổi)</span>}
                            </label>
                            <input
                                id="pin"
                                type="password"
                                inputMode="numeric"
                                maxLength={4}
                                value={formData.pin}
                                onChange={(e) => setFormData({ ...formData, pin: e.target.value.replace(/\D/g, '') })}
                                className="w-full max-w-xs px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-center text-2xl tracking-widest"
                                placeholder="****"
                                disabled={isDisabled}
                            />
                        </div>
                    )}
                </div>

                {/* Submit Button */}
                <div className="flex gap-4">
                    <Link
                        href="/dashboard"
                        className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        Hủy
                    </Link>
                    <button
                        type="submit"
                        disabled={isDisabled}
                        className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {updateProfileMutation.isPending || success ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                {success ? 'Đang chuyển hướng...' : 'Đang lưu...'}
                            </>
                        ) : (
                            'Lưu Thay Đổi'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
