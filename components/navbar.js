import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsMenuOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleHome = () => {
        router.push("/home");
    };
    const handleChat = () => {
        router.push("/chat");
    };
    const handleWalk = () => {
        router.push("/walk");
    };
    const handleAsk = () => {
        router.push("/ask");
    };
    const handleMy = () => {
        router.push("/mypage");
    };
    const handleCoin = () => {
        router.push("/coin");
    };
    const handleFavor = () => {
        router.push("/favor");
    };
    const handleSet = () => {
        router.push("/set");
    };

    return (
        <nav className="relative px-5 py-3 flex justify-between items-center bg-white">
            <img
                src="/logo3.png"
                className="w-35 h-12 cursor-pointer"
                onClick={handleHome}
            />
            <div className="lg:hidden">
                <button
                    onClick={toggleMenu}
                    className="navbar-burger flex items-center  p-3"
                >
                    <svg
                        className="block h-6 w-6"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                </button>
            </div>
            <ul
                className={`lg:flex lg:items-center lg:w-auto lg:space-x-6 ${
                    isMenuOpen ? "block" : "hidden"
                } absolute lg:relative top-full left-0 right-0 bg-white lg:bg-transparent z-20`}
            >
                <li>
                    <a
                        className="block py-2 px-4 text-base cursor-pointer"
                        onClick={handleHome}
                    >
                        홈
                    </a>
                </li>
                <li>
                    <a
                        className="block py-2 px-4 text-base cursor-pointer"
                        onClick={handleAsk}
                    >
                        질문
                    </a>
                </li>
                <li>
                    <a
                        className="block py-2 px-4 text-base cursor-pointer"
                        onClick={handleChat}
                    >
                        소통관
                    </a>
                </li>
                <li>
                    <a
                        className="block py-2 px-4 text-base cursor-pointer"
                        onClick={handleCoin}
                    >
                        에코코인
                    </a>
                </li>
                <li>
                    <a
                        className="block py-2 px-4 text-base cursor-pointer"
                        onClick={handleWalk}
                    >
                        탄소발자국
                    </a>
                </li>
                <li>
                    <a
                        className="block py-2 px-4 text-base cursor-pointer"
                        onClick={handleFavor}
                    >
                        여행추천상품
                    </a>
                </li>
                <li>
                    <a
                        className="block py-2 px-4 text-base cursor-pointer"
                        onClick={handleMy}
                    >
                        마이페이지
                    </a>
                </li>
                <li>
                    <a
                        className="block py-2 px-4 text-base cursor-pointer"
                        onClick={handleSet}
                    >
                        개인설정
                    </a>
                </li>
            </ul>
            {isMenuOpen && (
                <div
                    className="navbar-backdrop fixed inset-0 opacity-25 lg:hidden"
                    onClick={toggleMenu}
                ></div>
            )}
        </nav>
    );
};

export { Navbar };
