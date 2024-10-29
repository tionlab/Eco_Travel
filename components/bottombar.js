import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
    HomeIcon,
    SearchIcon,
    ChatIcon,
    UserIcon,
} from "@heroicons/react/outline";

const BottomBar = () => {
    const [activeIcon, setActiveIcon] = useState(null);
    const router = useRouter();

    const handleClick = (path) => {
        router.push(path);
    };

    useEffect(() => {
        setActiveIcon(router.pathname);
    }, []);

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg">
            <div className="flex justify-around items-center h-16">
                <button
                    className="relative p-2 rounded-full  transition-colors"
                    onClick={() => handleClick("home", "/home")}
                >
                    {activeIcon === "/home" && (
                        <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4 text-black text-3xl">
                            ✓
                        </span>
                    )}
                    <HomeIcon className="h-6 w-6" />
                </button>
                <button
                    className="relative p-2 rounded-full  transition-colors"
                    onClick={() => handleClick("chat", "/chat")}
                >
                    {activeIcon === "/chat" && (
                        <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4 text-black text-3xl">
                            ✓
                        </span>
                    )}
                    <ChatIcon className="h-6 w-6" />
                </button>
                <button
                    className="relative p-2 rounded-full  transition-colors"
                    onClick={() => handleClick("walk", "/walk")}
                >
                    {activeIcon === "/walk" && (
                        <span className="absolute top-0 left-1/2 transform -translate-x-1/3 -translate-y-4 text-black text-3xl">
                            ✓
                        </span>
                    )}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                    </svg>
                </button>
                <button
                    className="relative p-2 rounded-full  transition-colors"
                    onClick={() => handleClick("coin", "/coin")}
                >
                    {activeIcon === "/coin" && (
                        <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4 text-black text-3xl">
                            ✓
                        </span>
                    )}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                </button>
                <button
                    className="relative p-2 rounded-full  transition-colors"
                    onClick={() => handleClick("ask", "/ask")}
                >
                    {activeIcon === "/ask" && (
                        <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4 text-black text-3xl">
                            ✓
                        </span>
                    )}
                    <SearchIcon className="h-6 w-6" />
                </button>
                <button
                    className="relative p-2 rounded-full  transition-colors"
                    onClick={() => handleClick("mypage", "/mypage")}
                >
                    {activeIcon === "/mypage" && (
                        <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4 text-black text-3xl">
                            ✓
                        </span>
                    )}
                    <UserIcon className="h-6 w-6" />
                </button>
            </div>
        </div>
    );
};

export default BottomBar;
