'use client';

import { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { useCurrentUser, useProfile } from '@/lib/hooks';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Download, Share2, ArrowLeft, User, Droplet, Calendar } from 'lucide-react';

export default function QRCodePage() {
    const { data: user } = useCurrentUser();
    const { data: profile, isLoading } = useProfile();
    const router = useRouter();
    const qrRef = useRef<HTMLDivElement>(null);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!profile || !user) {
        return (
            <div className="max-w-2xl mx-auto">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800 rounded-xl p-6 text-center">
                    <p className="text-yellow-800 dark:text-yellow-300 mb-4">Bạn cần tạo hồ sơ y tế trước</p>
                    <Link href="/dashboard/profile/create" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                        Tạo hồ sơ ngay →
                    </Link>
                </div>
            </div>
        );
    }

    const bioUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/bio/${user.bioSlug}`;
    const age = new Date().getFullYear() - new Date(profile.dateOfBirth).getFullYear();

    const handleDownload = () => {
        const canvas = qrRef.current?.querySelector('canvas');
        if (!canvas) return;

        // Create a larger canvas for better quality
        const scale = 4;
        const largeCanvas = document.createElement('canvas');
        const ctx = largeCanvas.getContext('2d');

        largeCanvas.width = canvas.width * scale;
        largeCanvas.height = canvas.height * scale;

        if (ctx) {
            ctx.scale(scale, scale);
            ctx.drawImage(canvas, 0, 0);

            largeCanvas.toBlob((blob) => {
                if (blob) {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `medibio-qr-${user.username}.png`;
                    a.click();
                    URL.revokeObjectURL(url);
                }
            });
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Hồ Sơ Y Tế - MediBio',
                text: `Hồ sơ y tế của ${profile.fullName}`,
                url: bioUrl,
            });
        } else {
            navigator.clipboard.writeText(bioUrl);
            alert('Đã sao chép link!');
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <Link href="/dashboard" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2 mb-4">
                    <ArrowLeft className="w-5 h-5" />
                    Quay lại Dashboard
                </Link>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Mã QR Hồ Sơ Y Tế</h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Tải xuống hoặc in mã QR để mang theo bên mình trong trường hợp khẩn cấp
                </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* QR Code Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
                    <div ref={qrRef} className="inline-block p-6 bg-white rounded-xl mb-6">
                        <QRCodeCanvas
                            value={bioUrl}
                            size={300}
                            level="H"
                            includeMargin={true}
                        />
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={handleDownload}
                            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            <Download className="w-5 h-5" />
                            Tải Xuống QR Code
                        </button>

                        <button
                            onClick={handleShare}
                            className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            <Share2 className="w-5 h-5" />
                            Chia Sẻ Link
                        </button>
                    </div>
                </div>

                {/* Medical Card Preview */}
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-xl p-8 text-white">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <div className="text-sm opacity-90 mb-1">MediBio - Hồ Sơ Y Tế</div>
                            <div className="text-2xl font-bold">{profile.fullName}</div>
                        </div>
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                            <User className="w-8 h-8" />
                        </div>
                    </div>

                    <div className="space-y-4 mb-6">
                        <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 opacity-80" />
                            <span>{age} tuổi</span>
                        </div>

                        {profile.bloodType && (
                            <div className="flex items-center gap-3">
                                <Droplet className="w-5 h-5 opacity-80" />
                                <span className="font-bold">Nhóm máu: {profile.bloodType}</span>
                            </div>
                        )}
                    </div>

                    <div className="border-t border-white/20 pt-4">
                        <div className="text-sm opacity-90 mb-2">Scan mã QR để xem chi tiết</div>
                        <div className="text-xs opacity-75">
                            Thông tin y tế được mã hóa và bảo vệ
                        </div>
                    </div>
                </div>
            </div>

            {/* Instructions */}
            <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-6">
                <h3 className="text-lg font-bold text-blue-800 dark:text-blue-300 mb-4">📝 Hướng Dẫn Sử Dụng</h3>
                <ul className="space-y-3 text-blue-700 dark:text-blue-200">
                    <li className="flex items-start gap-2">
                        <span className="font-bold">1.</span>
                        <span>Tải xuống và in mã QR, dán vào thẻ căn cước hoặc ví</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="font-bold">2.</span>
                        <span>Khi cần, bác sĩ hoặc nhân viên y tế có thể quét mã để xem hồ sơ</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="font-bold">3.</span>
                        <span>Bạn cũng có thể chia sẻ link trực tiếp cho người thân</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="font-bold">4.</span>
                        <span>Thông tin được bảo vệ theo chế độ riêng tư bạn đã chọn</span>
                    </li>
                </ul>
            </div>
        </div>
    );
}
