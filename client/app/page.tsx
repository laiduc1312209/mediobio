'use client';

import Link from 'next/link';
import { useCurrentUser } from '@/lib/hooks';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { data: user, isLoading } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (user && !isLoading) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* App Bar */}
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="container-custom">
          <nav className="h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xl font-bold">
                M
              </div>
              <span className="text-xl font-semibold text-gray-900 dark:text-white">MediBio</span>
            </div>
            <div className="flex gap-3">
              <Link href="/auth/login" className="px-6 py-2 text-blue-600 dark:text-blue-400 font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                Đăng nhập
              </Link>
              <Link href="/auth/register" className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition-all">
                Đăng ký
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <section className="bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 py-20">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center">
              {/* Chip Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-8">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                An toàn • Bảo mật • Miễn phí
              </div>

              {/* Heading */}
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Hồ Sơ Y Tế
                <br />
                <span className="text-blue-600 dark:text-blue-400">Luôn Bên Bạn</span>
              </h1>

              <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
                Lưu trữ và chia sẻ thông tin y tế cá nhân một cách an toàn, nhanh chóng.
                Dành cho cấp cứu và khám bệnh.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link href="/auth/register" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:bg-blue-700 transition-all">
                  Tạo Bio Miễn Phí
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <a href="#features" className="inline-flex items-center justify-center px-8 py-3.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold rounded-lg shadow-md hover:shadow-lg transition-all border border-gray-200 dark:border-gray-700">
                  Tìm Hiểu Thêm
                </a>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Mã hóa AES-256</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>100% Miễn phí</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Truy cập nhanh</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Tính Năng Nổi Bật
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Mọi thứ bạn cần cho một hồ sơ y tế an toàn
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              <FeatureCard
                icon="🔐"
                title="Bảo Mật Tuyệt Đối"
                description="Mã hóa AES-256-GCM. Chỉ bạn kiểm soát ai được xem thông tin của mình."
                color="blue"
              />
              <FeatureCard
                icon="⚡"
                title="QR Code Nhanh"
                description="Quét QR để truy cập ngay lập tức trong tình huống khẩn cấp."
                color="green"
              />
              <FeatureCard
                icon="🏥"
                title="Thông Tin Y Tế Đầy Đủ"
                description="Nhóm máu, dị ứng, thuốc đang dùng, bệnh lý - tất cả ở một nơi."
                color="purple"
              />
              <FeatureCard
                icon="🚑"
                title="Tối Ưu Cấp Cứu"
                description="Hiển thị ưu tiên thông tin quan trọng nhất cho bác sĩ."
                color="red"
              />
              <FeatureCard
                icon="☁️"
                title="Cloud Storage"
                description="Ảnh đại diện lưu trữ an toàn, tải nhanh mọi lúc mọi nơi."
                color="cyan"
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-white dark:bg-gray-800">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-2xl p-12 text-center text-white">
                <h2 className="text-4xl font-bold mb-4">
                  Bắt Đầu Ngay Hôm Nay
                </h2>
                <p className="text-xl mb-8 opacity-90">
                  Tạo bio y tế của bạn trong vài phút. Miễn phí mãi mãi.
                </p>
                <Link href="/auth/register" className="inline-block px-10 py-4 bg-white text-blue-600 font-bold text-lg rounded-lg hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all">
                  Tạo Bio Miễn Phí →
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-8">
        <div className="container-custom">
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p className="font-medium mb-2">© 2026 MediBio - Nền tảng hồ sơ y tế an toàn</p>
            <p className="text-sm">Made by PLD, For healthcare</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, color }: {
  icon: string;
  title: string;
  description: string;
  color: string;
}) {
  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
    red: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
    indigo: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400',
    cyan: 'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-shadow p-8 border border-gray-100 dark:border-gray-700">
      <div className={`w-14 h-14 rounded-lg ${colorClasses[color as keyof typeof colorClasses]} flex items-center justify-center text-3xl mb-4`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
