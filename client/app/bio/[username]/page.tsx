'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { AlertTriangle, Phone, Mail, Lock, X, Cake, Droplets, Heart, Activity, Pill, ClipboardList } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface BioData {
    fullName: string;
    dateOfBirth: string;
    avatarUrl?: string;
    bloodType?: string;
    allergies: string[];
    medicalConditions?: string[];
    currentMedications?: string[];
    medicalHistory?: string;
    doctorNotes?: string;
    personalMessage?: string;
    emergencyContacts: Array<{
        name: string;
        relationship?: string;
        phone: string;
        email?: string;
        priority: number;
    }>;
    privacyLevel: string;
}

export default function BioPage() {
    const params = useParams();
    const username = params.username as string;

    const [bio, setBio] = useState<BioData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [requiresPin, setRequiresPin] = useState(false);
    const [pin, setPin] = useState('');
    const [pinError, setPinError] = useState('');

    useEffect(() => {
        fetchBio();
    }, [username]);

    const fetchBio = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await axios.get(`${API_URL}/api/bio/${username}`);
            setBio(response.data.bio);
        } catch (err: any) {
            if (err.response?.data?.requiresPin) {
                setRequiresPin(true);
            } else {
                setError(err.response?.data?.error || 'Không tìm thấy hồ sơ y tế');
            }
        } finally {
            setLoading(false);
        }
    };

    const handlePinSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPinError('');

        if (pin.length !== 4) {
            setPinError('Mã PIN phải có 4 chữ số');
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/api/bio/${username}/verify-pin`, { pin });
            setBio(response.data.bio);
            setRequiresPin(false);
        } catch (err: any) {
            setPinError(err.response?.data?.error || 'Mã PIN không đúng');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <X className="w-8 h-8 text-red-600 dark:text-red-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Không Tìm Thấy</h2>
                    <p className="text-gray-600 dark:text-gray-400">{error}</p>
                </div>
            </div>
        );
    }

    if (requiresPin) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">Yêu Cầu Mã PIN</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">Hồ sơ này được bảo vệ bằng mã PIN</p>

                    <form onSubmit={handlePinSubmit} className="space-y-4">
                        <input
                            type="password"
                            inputMode="numeric"
                            maxLength={4}
                            value={pin}
                            onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center text-2xl tracking-widest focus:ring-2 focus:ring-blue-500"
                            placeholder="****"
                            autoFocus
                        />

                        {pinError && (
                            <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-3 rounded text-sm text-center">
                                {pinError}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                        >
                            Xác Nhận
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    if (!bio) return null;

    const age = new Date().getFullYear() - new Date(bio.dateOfBirth).getFullYear();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Header Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                    <div className="flex items-center gap-4">
                        {bio.avatarUrl ? (
                            <img
                                src={bio.avatarUrl}
                                alt={bio.fullName}
                                className="w-20 h-20 rounded-full object-cover ring-4 ring-blue-100 dark:ring-blue-900/30"
                            />
                        ) : (
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center ring-4 ring-blue-100 dark:ring-blue-900/30">
                                <span className="text-3xl font-bold text-white">{bio.fullName[0]}</span>
                            </div>
                        )}
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{bio.fullName}</h1>
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mt-1">
                                <Cake className="w-4 h-4" />
                                <span>{age} tuổi</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Blood Type - HIGHLIGHTED */}
                {bio.bloodType && (
                    <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl shadow-xl p-6 text-white">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/20 rounded-xl">
                                <Droplets className="w-8 h-8" />
                            </div>
                            <div>
                                <div className="text-sm opacity-90">Nhóm Máu</div>
                                <div className="text-4xl font-bold">{bio.bloodType}</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Medical Conditions */}
                {bio.medicalConditions && bio.medicalConditions.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border-l-4 border-indigo-500">
                        <div className="flex items-center gap-3 mb-4">
                            <Activity className="w-6 h-6 text-indigo-500" />
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Tình Trạng Sức Khỏe</h2>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {bio.medicalConditions.map((condition, index) => (
                                <span key={index} className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 rounded-lg font-medium">
                                    {condition}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Current Medications */}
                {bio.currentMedications && bio.currentMedications.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border-l-4 border-purple-500">
                        <div className="flex items-center gap-3 mb-4">
                            <Pill className="w-6 h-6 text-purple-500" />
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Thuốc Đang Dùng</h2>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {bio.currentMedications.map((medication, index) => (
                                <span key={index} className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-lg font-medium">
                                    {medication}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Allergies */}
                {bio.allergies.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border-l-4 border-yellow-500">
                        <div className="flex items-center gap-3 mb-4">
                            <AlertTriangle className="w-6 h-6 text-yellow-500" />
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Dị Ứng</h2>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {bio.allergies.map((allergy, index) => (
                                <span key={index} className="px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-lg font-medium">
                                    {allergy}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Medical History */}
                {bio.medicalHistory && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <ClipboardList className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Tiền Sử Y Tế</h2>
                        </div>
                        <p className="text-lg whitespace-pre-wrap text-gray-700 dark:text-gray-300">{bio.medicalHistory}</p>
                    </div>
                )}

                {/* First Aid Instructions - HIGHLIGHTED */}
                {bio.doctorNotes && (
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl shadow-xl p-6 text-white">
                        <div className="flex items-center gap-3 mb-4">
                            <Heart className="w-6 h-6" />
                            <h2 className="text-xl font-bold">Hướng Dẫn Sơ Cứu</h2>
                        </div>
                        <p className="text-lg whitespace-pre-wrap opacity-95">{bio.doctorNotes}</p>
                    </div>
                )}

                {/* Emergency Contacts */}
                {bio.emergencyContacts.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Phone className="w-6 h-6 text-blue-600" />
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Liên Hệ Khẩn Cấp</h2>
                        </div>
                        <div className="space-y-4">
                            {bio.emergencyContacts.sort((a, b) => a.priority - b.priority).map((contact, index) => (
                                <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <div className="font-bold text-gray-900 dark:text-white">{contact.name}</div>
                                    {contact.relationship && <div className="text-sm text-gray-600 dark:text-gray-400">{contact.relationship}</div>}
                                    <a href={`tel:${contact.phone}`} className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mt-2 text-lg font-medium">
                                        <Phone className="w-5 h-5" /> {contact.phone}
                                    </a>
                                    {contact.email && (
                                        <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:underline mt-1">
                                            <Mail className="w-4 h-4" /> {contact.email}
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Personal Message */}
                {bio.personalMessage && (
                    <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl shadow-xl p-6 text-white">
                        <div className="flex items-center gap-3 mb-4">
                            <Heart className="w-6 h-6" />
                            <h2 className="text-xl font-bold">Lời Nhắn</h2>
                        </div>
                        <p className="text-lg whitespace-pre-wrap opacity-95">{bio.personalMessage}</p>
                    </div>
                )}

                {/* Footer */}
                <div className="text-center text-sm text-gray-600 dark:text-gray-400 py-4">
                    <div className="flex items-center gap-2 justify-center">
                        <Activity className="w-4 h-4" />
                        <span>MediBio - Hồ Sơ Y Tế Điện Tử</span>
                    </div>
                    <p className="mt-1 text-xs">Thông tin này chỉ để tham khảo trong trường hợp khẩn cấp</p>
                </div>
            </div>
        </div>
    );
}
