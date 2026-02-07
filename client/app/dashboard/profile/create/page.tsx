'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCreateProfile, useCreateContact } from '@/lib/hooks';
import { ArrowLeft, Droplets, AlertTriangle, Phone, Heart, Trash2, Plus, Info } from 'lucide-react';

export default function CreateProfilePage() {
    const router = useRouter();
    const createProfileMutation = useCreateProfile();
    const createContactMutation = useCreateContact();

    const [formData, setFormData] = useState({
        fullName: '',
        dateOfBirth: '',
        bloodType: '',
        allergies: [] as string[],
        firstAidInstructions: '',
        privacyLevel: 'link_only' as 'public' | 'link_only' | 'pin_protected',
        pin: '',
    });

    const [allergyInput, setAllergyInput] = useState('');

    const [emergencyContacts, setEmergencyContacts] = useState<Array<{
        name: string;
        relationship: string;
        phone: string;
    }>>([]);

    const [contactInput, setContactInput] = useState({
        name: '',
        relationship: '',
        phone: '',
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleAddAllergy = () => {
        if (allergyInput.trim()) {
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

    const handleAddContact = () => {
        if (!contactInput.name.trim() || !contactInput.phone.trim()) {
            return;
        }
        setEmergencyContacts(prev => [...prev, { ...contactInput }]);
        setContactInput({ name: '', relationship: '', phone: '' });
    };

    const handleRemoveContact = (index: number) => {
        setEmergencyContacts(prev => prev.filter((_, i) => i !== index));
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
        if (formData.privacyLevel === 'pin_protected' && formData.pin.length !== 4) {
            setError('Mã PIN phải có đúng 4 chữ số');
            return;
        }

        try {
            const submitData = {
                ...formData,
                pin: formData.privacyLevel === 'pin_protected' ? formData.pin : undefined,
            };

            await createProfileMutation.mutateAsync(submitData);

            // Create emergency contacts after profile is created
            for (let i = 0; i < emergencyContacts.length; i++) {
                const contact = emergencyContacts[i];
                try {
                    await createContactMutation.mutateAsync({
                        name: contact.name,
                        relationship: contact.relationship || undefined,
                        phone: contact.phone,
                        priority: i + 1,
                    });
                } catch (contactErr) {
                    console.error('Failed to create contact:', contactErr);
                }
            }

            setSuccess('Hồ sơ đã được tạo thành công!');
            setTimeout(() => {
                router.push('/dashboard');
            }, 1500);
        } catch (err: any) {
            const serverError = err.response?.data?.error;
            setError(serverError || 'Không thể tạo hồ sơ. Vui lòng thử lại.');
        }
    };

    const isDisabled = createProfileMutation.isPending || !!success;

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-8">
                <Link href="/dashboard" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2 mb-4">
                    <ArrowLeft className="w-5 h-5" />
                    Quay lại Dashboard
                </Link>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Tạo Hồ Sơ Y Tế</h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Thông tin quan trọng để hỗ trợ bạn trong trường hợp khẩn cấp
                </p>
            </div>

            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded dark:bg-red-900/40 dark:text-red-300">
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded dark:bg-green-900/40 dark:text-green-300">
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Thông Tin Cơ Bản</h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Họ và tên <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                placeholder="Nguyễn Văn A"
                                disabled={isDisabled}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Ngày sinh <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                required
                                value={formData.dateOfBirth}
                                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                disabled={isDisabled}
                            />
                        </div>
                    </div>
                </div>

                {/* Blood Type - HIGHLIGHTED */}
                <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-2xl shadow-sm border-2 border-red-200 dark:border-red-800 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-red-500 rounded-lg">
                            <Droplets className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-red-800 dark:text-red-300">Nhóm Máu</h2>
                    </div>

                    <select
                        value={formData.bloodType}
                        onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                        className="w-full max-w-xs px-4 py-3 border-2 border-red-300 dark:border-red-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 font-semibold text-lg"
                        disabled={isDisabled}
                    >
                        <option value="">Chọn nhóm máu</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                    </select>
                </div>

                {/* Allergies */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-yellow-500 rounded-lg">
                            <AlertTriangle className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Dị Ứng</h2>
                    </div>

                    <div className="flex gap-2 mb-4">
                        <input
                            type="text"
                            value={allergyInput}
                            onChange={(e) => setAllergyInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAllergy())}
                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="Ví dụ: Penicillin, Hải sản, Đậu phộng..."
                            disabled={isDisabled}
                        />
                        <button
                            type="button"
                            onClick={handleAddAllergy}
                            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium flex items-center gap-1"
                            disabled={isDisabled}
                        >
                            <Plus className="w-5 h-5" /> Thêm
                        </button>
                    </div>

                    {formData.allergies.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {formData.allergies.map((allergy, index) => (
                                <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-full text-sm font-medium">
                                    {allergy}
                                    <button type="button" onClick={() => handleRemoveAllergy(index)} disabled={isDisabled}>
                                        <Trash2 className="w-4 h-4 hover:text-yellow-900" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* First Aid Instructions - HIGHLIGHTED */}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl shadow-sm border-2 border-emerald-300 dark:border-emerald-800 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-emerald-500 rounded-lg">
                            <Heart className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-emerald-800 dark:text-emerald-300">Hướng Dẫn Sơ Cứu</h2>
                    </div>

                    <div className="bg-emerald-100/50 dark:bg-emerald-900/30 p-4 rounded-lg mb-4">
                        <div className="flex items-start gap-2 text-emerald-800 dark:text-emerald-300">
                            <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <div className="text-sm">
                                <p className="font-semibold mb-1">Gợi ý cách ghi:</p>
                                <ul className="list-disc list-inside space-y-1 text-emerald-700 dark:text-emerald-400">
                                    <li>Bệnh tim: "Giúp tôi lấy thuốc trong ví, túi bên trái"</li>
                                    <li>Tiểu đường: "Cho tôi uống nước đường nếu bất tỉnh"</li>
                                    <li>Động kinh: "Đặt tôi nằm nghiêng, không cho gì vào miệng"</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <textarea
                        value={formData.firstAidInstructions}
                        onChange={(e) => setFormData({ ...formData, firstAidInstructions: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-3 border-2 border-emerald-300 dark:border-emerald-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                        placeholder="Mô tả cách người khác có thể giúp bạn trong trường hợp khẩn cấp..."
                        disabled={isDisabled}
                    />
                </div>

                {/* Emergency Contacts */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-500 rounded-lg">
                            <Phone className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Số Điện Thoại Khẩn Cấp</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <input
                            type="text"
                            placeholder="Họ tên *"
                            value={contactInput.name}
                            onChange={(e) => setContactInput({ ...contactInput, name: e.target.value })}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            disabled={isDisabled}
                        />
                        <input
                            type="text"
                            placeholder="Quan hệ (Bố, Mẹ, Vợ...)"
                            value={contactInput.relationship}
                            onChange={(e) => setContactInput({ ...contactInput, relationship: e.target.value })}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            disabled={isDisabled}
                        />
                        <input
                            type="tel"
                            placeholder="Số điện thoại *"
                            value={contactInput.phone}
                            onChange={(e) => setContactInput({ ...contactInput, phone: e.target.value })}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            disabled={isDisabled}
                        />
                    </div>

                    <button
                        type="button"
                        onClick={handleAddContact}
                        className="mb-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-1"
                        disabled={isDisabled}
                    >
                        <Plus className="w-5 h-5" /> Thêm Liên Hệ
                    </button>

                    {emergencyContacts.length > 0 && (
                        <div className="space-y-3">
                            {emergencyContacts.map((contact, index) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <div>
                                        <div className="font-bold text-gray-900 dark:text-white">{contact.name}</div>
                                        {contact.relationship && <div className="text-sm text-gray-600 dark:text-gray-400">{contact.relationship}</div>}
                                        <div className="text-blue-600 dark:text-blue-400">{contact.phone}</div>
                                    </div>
                                    <button type="button" onClick={() => handleRemoveContact(index)} className="text-red-500 hover:text-red-700" disabled={isDisabled}>
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Privacy Settings */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quyền Riêng Tư</h2>

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
                            <div>
                                <div className="font-medium text-gray-900 dark:text-white">Chỉ qua link</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Chỉ người có link mới xem được</div>
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
                            <div>
                                <div className="font-medium text-gray-900 dark:text-white">Bảo vệ bằng PIN</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Yêu cầu mã PIN 4 số để truy cập</div>
                            </div>
                        </label>
                    </div>

                    {formData.privacyLevel === 'pin_protected' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Mã PIN (4 chữ số) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                inputMode="numeric"
                                maxLength={4}
                                value={formData.pin}
                                onChange={(e) => setFormData({ ...formData, pin: e.target.value.replace(/\D/g, '') })}
                                className="w-32 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center text-xl tracking-widest"
                                placeholder="****"
                                disabled={isDisabled}
                            />
                        </div>
                    )}
                </div>

                {/* Submit */}
                <div className="flex gap-4">
                    <Link href="/dashboard" className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700">
                        Hủy
                    </Link>
                    <button
                        type="submit"
                        disabled={isDisabled}
                        className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isDisabled ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                {success ? 'Đang chuyển hướng...' : 'Đang tạo...'}
                            </>
                        ) : (
                            'Tạo Hồ Sơ'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
