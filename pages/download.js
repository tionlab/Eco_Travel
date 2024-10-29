import Head from "next/head";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Home() {
    const [isMobile, setIsMobile] = useState(true);
    const [currentUrl, setCurrentUrl] = useState("");
    const [copySuccess, setCopySuccess] = useState(false);
    const [showGuide, setShowGuide] = useState(false);

    useEffect(() => {
        setIsMobile(window.innerWidth <= 768);
        setCurrentUrl(window.location.href);

        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(currentUrl);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
            console.error("Failed to copy: ", err);
        }
    };

    const handleDownload = () => {
        window.location.href = "/ecotravel.apk";
        setShowGuide(true);
    };

    const InstallGuide = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
                <h2 className="text-2xl font-bold mb-4 text-center">
                    🔄 다운로드가 진행 중입니다...
                </h2>
                <div className="mb-6 bg-[#f0f0f0] p-4 rounded-lg">
                    <h3 className="font-bold mb-2">📚 APK 설치 가이드</h3>
                    <ol className="list-decimal list-inside space-y-2">
                        <li>📁 다운로드된 APK 파일을 찾습니다.</li>
                        <li>👆 파일을 탭하여 설치를 시작합니다.</li>
                        <li>
                            🔒 알 수 없는 출처 설치 허용을 요청하면 '설정'으로
                            이동하여 허용합니다.
                        </li>
                        <li>✅ '설치' 버튼을 탭합니다.</li>
                        <li>
                            🚀 설치가 완료되면 '열기'를 탭하여 앱을 실행합니다.
                        </li>
                    </ol>
                </div>
                <button
                    onClick={() => setShowGuide(false)}
                    className="w-full bg-[#2c8c5e] text-white font-bold py-2 px-4 rounded-full hover:bg-[#247a50] transition duration-300"
                >
                    닫기
                </button>
            </div>
        </div>
    );

    if (!isMobile) {
        return (
            <div className="min-h-screen bg-[#e6f7ff] flex items-center justify-center">
                <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
                    <h1 className="text-2xl font-bold text-[#2c8c5e] mb-4">
                        모바일 환경에서 접속해주세요!
                    </h1>
                    <p className="text-[#4a5568] mb-4">
                        이 앱은 모바일 기기에 최적화되어 있습니다.
                    </p>
                    <div className="bg-[#f0f0f0] p-2 rounded mb-2 flex items-center">
                        <p className="text-[#4a5568] break-all flex-grow mr-2">
                            {currentUrl}
                        </p>
                        <button
                            onClick={copyToClipboard}
                            className="text-[#4a5568] hover:text-[#2c8c5e] transition duration-300"
                            title="URL 복사"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                />
                            </svg>
                        </button>
                    </div>
                    {copySuccess && (
                        <p className="text-[#2c8c5e] text-sm">
                            URL이 복사되었습니다!
                        </p>
                    )}
                    <p className="text-sm text-[#4a5568] mt-2">
                        위 주소를 복사하여 모바일 기기에서 접속하세요.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#e6fffa]">
            <Head>
                <title>Eco Travel 앱 - 에코트래블</title>
                <meta
                    property="og:title"
                    content="Eco Travel 앱 - 에코트래블"
                />
                <meta
                    property="og:description"
                    content="Eco Travel과 함께 지속 가능하고 환경 친화적인 여행을 경험하세요. 우리의 혁신적인 앱으로 녹색 여행의 새로운 차원을 발견하실 수 있습니다."
                />
                <meta property="og:image" content="/logo2.png" />
                <meta property="og:image:width" content="150" />
                <meta property="og:image:height" content="150" />
            </Head>

            <main className="px-4 py-8">
                <div className="bg-white rounded-2xl shadow-xl p-6">
                    <div className="mb-6 text-center">
                        <Image
                            src="/logo2.png"
                            alt="Eco Travel 로고"
                            width={150}
                            height={150}
                            className="rounded-xl mx-auto"
                        />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold mb-2 text-[#2c8c5e] text-center">
                            에코 트래블
                        </h1>
                        <p className="text-lg text-[#4a5568] mb-4 text-center">
                            Eco Travel
                        </p>
                        <div className="flex items-center justify-center mb-4">
                            <div className="text-[#fbbf24] flex mr-2">
                                {[...Array(5)].map((_, i) => (
                                    <svg
                                        key={i}
                                        className="w-5 h-5"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <span className="text-[#4a5568]">(3 리뷰)</span>
                        </div>
                        <p className="text-[#4a5568] mb-6 text-center">
                            Eco Travel과 함께 지속 가능하고 환경 친화적인 여행을
                            경험하세요. 우리의 혁신적인 앱으로 녹색 여행의
                            새로운 차원을 발견하실 수 있습니다.
                        </p>
                        <button
                            onClick={handleDownload}
                            className="w-full bg-[#2c8c5e] text-white font-bold py-3 px-6 rounded-full hover:bg-[#247a50] transition duration-300 shadow-lg"
                        >
                            지금 설치하기
                        </button>
                    </div>
                </div>

                <div className="mt-8 bg-white rounded-2xl shadow-xl p-6">
                    <h2 className="text-2xl font-bold mb-4 text-[#2c8c5e]">
                        앱 정보
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { label: "버전", value: "1.7.8" },
                            { label: "업데이트", value: "2024년 7월 22일" },
                            { label: "다운로드", value: "3+" },
                            { label: "크기", value: "59.6 MB" },
                        ].map((item, index) => (
                            <div key={index}>
                                <p className="font-semibold">{item.label}</p>
                                <p className="text-[#4a5568]">{item.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mt-8 bg-white rounded-2xl shadow-xl p-6">
                    <h2 className="text-2xl font-bold mb-4 text-[#2c8c5e]">
                        주요 리뷰
                    </h2>
                    <div className="border-t border-gray-200 pt-4">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <div className="w-10 h-10 rounded-full bg-[#f0f0f0] flex items-center justify-center text-[#4a5568] font-bold">
                                    강
                                </div>
                            </div>
                            <div className="ml-3 flex-grow">
                                <p className="font-semibold">강정우</p>
                                <div className="flex items-center mt-1">
                                    <div className="text-[#fbbf24]">
                                        <svg
                                            className="w-5 h-5"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    </div>
                                    <p className="ml-1 text-sm text-[#4a5568]">
                                        1.0
                                    </p>
                                </div>
                                <p className="mt-2 text-[#4a5568]">
                                    나 이 앱 고객센터 올해의 근무자인데 문의로
                                    계속 이상한거 보내는 놈들 IP 싹다 공개해서
                                    신고함 ㅅㄱ
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start mt-5">
                            <div className="flex-shrink-0">
                                <div className="w-10 h-10 rounded-full bg-[#f0f0f0] flex items-center justify-center text-[#4a5568] font-bold">
                                    G
                                </div>
                            </div>
                            <div className="ml-3 flex-grow">
                                <p className="font-semibold">Gemini</p>
                                <div className="flex items-center mt-1">
                                    <div className="text-[#fbbf24]">
                                        <svg
                                            className="w-5 h-5"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    </div>
                                    <p className="ml-1 text-sm text-[#4a5568]">
                                        5.0
                                    </p>
                                </div>
                                <p className="mt-2 text-[#4a5568]">
                                    정말 좋은. 이것은 혁명. 나는 이것을 사용하는
                                    것을 좋아한다. 나는 이것을 사용하는 것을.
                                    정말 믿을 수 없는. 정말 좋은. 이것은 혁명.
                                    나는 이것을 사용하는 것을 좋아한다. 나는
                                    이것을. 놀라운. 정말 믿을 수 없는. 정말
                                    좋은. 이것은 혁명. 나는 이것을 사용하는 것을
                                    좋아한다. 나는
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start mt-5">
                            <div className="flex-shrink-0">
                                <div className="w-10 h-10 rounded-full bg-[#f0f0f0] flex items-center justify-center text-[#4a5568] font-bold">
                                    A
                                </div>
                            </div>
                            <div className="ml-3 flex-grow">
                                <p className="font-semibold">Anonymous</p>
                                <div className="flex items-center mt-1">
                                    <div className="text-[#fbbf24]">
                                        <svg
                                            className="w-5 h-5"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    </div>
                                    <p className="ml-1 text-sm text-[#4a5568]">
                                        5.0
                                    </p>
                                </div>
                                <p className="mt-2 text-[#4a5568]">
                                    녹색 여행을 좋아하는 사람들에게 추천합니다.
                                    더 많은 사람들이 이 앱을 사용하면 좋겠어요.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {showGuide && <InstallGuide />}
        </div>
    );
}
