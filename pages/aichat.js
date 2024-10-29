import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

const Aichat = () => {
    const router = useRouter();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const handleSendMessage = async () => {
        if (input.trim() === "") return;
        let text = input;
        setInput("");

        const userMessage = {
            content: text,
            isUser: true,
        };
        setMessages((prevMessages) => [...prevMessages, userMessage]);
        try {
            // 이곳에 aitext를 받아오는 시스템을 구현하세요.
            // Implement a system to receive aitext here.

            const newMessage = {
                content: aitext,
                isUser: false,
            };

            setMessages((prevMessages) => [...prevMessages, newMessage]);
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div
                onClick={() => {
                    router.back();
                }}
                className="fixed top-0 left-0 m-4 flex items-center rounded-full bg-secondary p-3"
            >
                <svg
                    className="w-6 h-6 mr-1 text-blue-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                    />
                </svg>
                <span className="whitespace-nowrap">돌아가기</span>
            </div>

            <div className="mb-8 flex flex-col items-center text-center">
                <img
                    src="/aiman.jpg"
                    alt="AI"
                    className="w-24 h-24 rounded-full mb-2"
                />
                <h1 className="text-2xl mt-2 font-bold">KJU 강정우</h1>
                <p className="text-[#575757] mt-2">
                    안녕하세요! <br /> KJU팀의 친환경 여행 어플 교육자
                    강정우입니다. <br /> 앱 사용에서 어떤 도움이 필요하신가요?
                </p>
            </div>
            <div className="flex flex-col items-center justify-start w-[90vw] h-96 border border-gray-300 rounded-lg p-4 mb-8 overflow-y-auto">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`p-2 my-2 text-white rounded-lg ${
                            message.isUser ? "self-end" : "self-start"
                        }`}
                        style={{
                            backgroundColor: message.isUser
                                ? "#3B82F6"
                                : "#6B7280",
                        }}
                    >
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div>
                <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    className="border border-[gray] rounded-lg p-2 mr-2"
                />
                <button
                    onClick={handleSendMessage}
                    className="bg-primary text-white px-4 py-2 rounded-lg"
                >
                    전송
                </button>
            </div>
        </div>
    );
};

export default Aichat;
