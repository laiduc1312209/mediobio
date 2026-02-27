'use client';

import Link from 'next/link';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* App Bar */}
            <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
                <div className="container-custom">
                    <nav className="h-16 flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xl font-bold">
                                M
                            </div>
                            <span className="text-xl font-semibold text-gray-900 dark:text-white">MediBio</span>
                        </Link>
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

            {/* Hero Banner */}
            <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 py-16 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob"></div>
                    <div className="absolute top-20 right-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000"></div>
                </div>
                <div className="container-custom relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-sm text-white/90 rounded-full text-sm font-medium mb-6">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.789l1.599.799L9 4.323V3a1 1 0 011-1zm-5 8.274l-.818 2.552c.25.112.526.174.818.174.292 0 .569-.062.818-.174L5 10.274zm10 0l-.818 2.552c.25.112.526.174.818.174.292 0 .569-.062.818-.174L15 10.274z" clipRule="evenodd" />
                            </svg>
                            Cập nhật lần cuối: 27/02/2026
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                            Điều Khoản Sử Dụng
                            <br />
                            <span className="text-blue-200">& Miễn Trừ Trách Nhiệm</span>
                        </h1>
                        <p className="text-lg text-blue-100 max-w-2xl mx-auto">
                            Vui lòng đọc kỹ các điều khoản dưới đây trước khi sử dụng dịch vụ MediBio.
                        </p>
                    </div>
                </div>
            </section>

            {/* Terms Content */}
            <main className="py-12">
                <div className="container-custom">
                    <div className="max-w-4xl mx-auto space-y-8">

                        {/* Section 1 */}
                        <TermsSection
                            number="1"
                            title="Trách Nhiệm Về Thông Tin"
                            badge="Quan trọng nhất"
                            badgeColor="red"
                        >
                            <TermsItem title="Người dùng tự quản lý">
                                Hệ thống chỉ cung cấp nền tảng lưu trữ. Người dùng hoàn toàn chịu trách nhiệm về tính chính xác, trung thực của các thông tin y tế (nhóm máu, tiền sử bệnh, SĐT liên lạc) được nhập vào.
                            </TermsItem>
                            <TermsItem title="Cảnh báo sai lệch">
                                Chúng tôi không chịu trách nhiệm cho bất kỳ sai sót y khoa nào dẫn đến từ việc người dùng nhập thông tin sai, giả mạo hoặc thông tin đã quá hạn nhưng chưa được cập nhật.
                            </TermsItem>
                        </TermsSection>

                        {/* Section 2 */}
                        <TermsSection
                            number="2"
                            title="Giới Hạn Phạm Vi Hỗ Trợ"
                        >
                            <TermsItem title="Công cụ hỗ trợ, không thay thế">
                                Sản phẩm này là một thiết bị hỗ trợ cung cấp thông tin nhanh, không phải là thiết bị y tế chuyên dụng và không có giá trị thay thế các xét nghiệm chuyên môn tại bệnh viện (như xét nghiệm máu trước khi truyền).
                            </TermsItem>
                            <TermsItem title="Phụ thuộc hạ tầng">
                                Hiệu quả truy xuất thông tin phụ thuộc vào các yếu tố khách quan: chất lượng chip NFC, cấu hình điện thoại của người quét và tình trạng kết nối mạng (Internet). Chúng tôi không đảm bảo hệ thống hoạt động 100% trong mọi điều kiện môi trường.
                            </TermsItem>
                        </TermsSection>

                        {/* Section 3 */}
                        <TermsSection
                            number="3"
                            title="Bảo Mật và Quyền Riêng Tư"
                        >
                            <TermsItem title="Mật khẩu cá nhân">
                                Người dùng có trách nhiệm bảo mật mã PIN/Mật khẩu truy cập hồ sơ chi tiết. Chúng tôi không chịu trách nhiệm nếu người dùng làm lộ mật khẩu hoặc mất vòng tay dẫn đến rò rỉ thông tin cá nhân.
                            </TermsItem>
                            <TermsItem title="Lưu trữ dữ liệu">
                                (Nếu bạn dùng cách nạp link trực tiếp vào chip): Chúng tôi không lưu giữ bản sao dữ liệu của bạn trên máy chủ trung tâm để đảm bảo quyền riêng tư tuyệt đối. Do đó, nếu bạn làm mất vòng tay, dữ liệu đó không thể được khôi phục trừ khi bạn tạo một hồ sơ mới.
                            </TermsItem>
                        </TermsSection>

                        {/* Section 4 */}
                        <TermsSection
                            number="4"
                            title="Cam Kết Người Dùng"
                        >
                            <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800/50 rounded-xl p-6">
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                                    Bằng việc sử dụng sản phẩm, người dùng xác nhận đã đọc và hiểu rằng:
                                </p>
                                <blockquote className="border-l-4 border-amber-500 pl-4 py-2 bg-white/60 dark:bg-gray-800/60 rounded-r-lg">
                                    <p className="text-gray-800 dark:text-gray-200 font-semibold italic">
                                        &ldquo;Thông tin chính xác là chìa khóa để cứu sống chính bạn. Mọi hành vi cố tình làm sai lệch thông tin là tự đặt bản thân vào tình trạng nguy hiểm.&rdquo;
                                    </p>
                                </blockquote>
                            </div>
                        </TermsSection>

                        {/* Section 5 */}
                        <TermsSection
                            number="5"
                            title="Sự Cố Hao Mòn Vật Lý"
                        >
                            <TermsItem title="Tuổi thọ chip NFC">
                                Chip NFC có tuổi thọ và giới hạn số lần đọc/ghi. Người dùng cần kiểm tra định kỳ tính hoạt động của vòng tay. Chúng tôi không chịu trách nhiệm nếu chip bị hỏng do va đập mạnh, tiếp xúc hóa chất, nhiệt độ cao hoặc sự cố hao mòn trong quá trình sử dụng của người dùng.
                            </TermsItem>
                            <TermsItem title="Thiết bị của người quét">
                                Chúng tôi không chịu trách nhiệm nếu điện thoại của người quét bị hỏng, lỗi phần mềm, không có chức năng NFC hoặc không có kết nối Internet tại thời điểm đó.
                            </TermsItem>
                        </TermsSection>

                        {/* Section 6 */}
                        <TermsSection
                            number="6"
                            title="Quyền Giải Thích và Thay Đổi Điều Khoản"
                        >
                            <TermsItem title="Quyền giải thích cuối cùng">
                                Trong mọi trường hợp có sự hiểu nhầm, tranh chấp hoặc các tình huống phát sinh chưa được quy định rõ trong bản điều khoản này, mọi quyền giải thích cuối cùng đều thuộc về Ban quản trị dự án MediBio. Quyết định của chúng tôi là quyết định cuối cùng và có hiệu lực thi hành.
                            </TermsItem>
                            <TermsItem title="Quyền sửa đổi">
                                Chúng tôi có quyền cập nhật, chỉnh sửa hoặc thay đổi bất kỳ nội dung nào trong bản Điều khoản này vào bất kỳ lúc nào để phù hợp với quy định pháp luật hoặc sự phát triển của công nghệ mà không cần thông báo trước.
                            </TermsItem>
                        </TermsSection>

                        {/* Section 7 */}
                        <TermsSection
                            number="7"
                            title="Tính Chất Dự Án & Quyền Dừng Dịch Vụ"
                        >
                            <TermsItem title="Tính chất dự án">
                                Người dùng hiểu và đồng ý rằng đây là một dự án nghiên cứu khoa học trong giai đoạn thử nghiệm (Beta).
                            </TermsItem>
                            <TermsItem title="Quyền dừng dịch vụ">
                                Chúng tôi có quyền tạm ngừng hoặc chấm dứt hoàn toàn việc cung cấp dịch vụ web, lưu trữ dữ liệu và hỗ trợ kỹ thuật vào bất kỳ thời điểm nào mà không cần báo trước và không chịu bất kỳ trách nhiệm pháp lý hay bồi thường nào.
                            </TermsItem>
                            <TermsItem title="Trách nhiệm lưu trữ của người dùng">
                                Trong trường hợp dịch vụ bị chấm dứt, người dùng có trách nhiệm tự ghi nhớ hoặc lưu trữ thông tin y tế của mình bằng các phương thức truyền thống. Chúng tôi không có nghĩa vụ duy trì dữ liệu vĩnh viễn.
                            </TermsItem>
                        </TermsSection>

                        {/* Agreement Banner */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-center shadow-xl animate-slide-up">
                            <div className="max-w-2xl mx-auto">
                                <p className="text-white text-lg font-medium leading-relaxed">
                                    Bằng cách sử dụng thiết bị này, bạn mặc nhiên đồng ý với{' '}
                                    <span className="font-bold underline decoration-2 underline-offset-4">Điều khoản sử dụng</span>{' '}
                                    của chúng tôi.
                                </p>
                                <div className="mt-6">
                                    <Link
                                        href="/auth/register"
                                        className="inline-flex items-center gap-2 px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all"
                                    >
                                        Tạo Bio Miễn Phí
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
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

/* ── Sub-components ── */

function TermsSection({
    number,
    title,
    badge,
    badgeColor,
    children,
}: {
    number: string;
    title: string;
    badge?: string;
    badgeColor?: string;
    children: React.ReactNode;
}) {
    const badgeColorClasses: Record<string, string> = {
        red: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        green: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700 overflow-hidden animate-fade-in">
            {/* Section Header */}
            <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {number}
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {title}
                </h2>
                {badge && (
                    <span className={`ml-auto px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${badgeColorClasses[badgeColor || 'blue']}`}>
                        {badge}
                    </span>
                )}
            </div>
            {/* Section Body */}
            <div className="p-6 space-y-4">
                {children}
            </div>
        </div>
    );
}

function TermsItem({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900/80 transition-colors">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
            <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1.5">
                    {title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                    {children}
                </p>
            </div>
        </div>
    );
}
