import { useState, useRef, useEffect } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import {
    auth,
    firestore,
    collection,
    addDoc,
    query,
    orderBy,
    serverTimestamp,
} from "../firebase";

const messagesRef = collection(firestore, "messages");
const q = query(messagesRef, orderBy("createdAt"));

const ChatRoom = () => {
    const [messages] = useCollectionData(q, { idField: "id" });
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const sendMessage = async () => {
        if (newMessage.trim() === "") return;

        const { uid, displayName } = auth.currentUser;

        await addDoc(messagesRef, {
            text: newMessage,
            createdAt: serverTimestamp(),
            uid,
            displayName,
        });

        setNewMessage("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-120px)]">
            <div className="flex-grow overflow-y-auto bg-background pb-24">
                <div className="py-5 px-3 md:px-16">
                    <div className="flex justify-center mb-10">
                        <div className="rounded py-2 px-4 bg-primary-foreground">
                            <p className="text-sm md:text-lg uppercase">
                                ECO TRAVEL COMMUNITY
                            </p>
                        </div>
                    </div>
                    {messages &&
                        messages.map((msg) => (
                            <div key={msg.id} className="flex mb-4">
                                <div className="rounded py-2 px-3 bg-secondary">
                                    <p className="text-sm md:text-base text-secondary-foreground">
                                        {msg.displayName}
                                    </p>
                                    <p className="text-sm md:text-base mt-1">
                                        {msg.text}
                                    </p>
                                </div>
                            </div>
                        ))}
                    <div ref={messagesEndRef} />
                </div>
            </div>
            <div className="bg-white p-4 border-t">
                <div className="flex items-center">
                    <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="메세지를 입력해보세요..."
                        className="flex-grow max-h-36 mr-2 md:mr-10 py-3 ps-4 block rounded-lg text-sm border-4 disabled:opacity-50 disabled:pointer-events-none resize-none overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-sm"
                        rows="1"
                    ></textarea>
                    <button
                        onClick={sendMessage}
                        className="py-1 px-5 h-11 inline-flex flex-shrink-0 justify-center items-center text-sm bg-primary font-medium rounded-lg text-white disabled:opacity-50 disabled:pointer-events-none focus:z-10 focus:outline-none focus:ring-2"
                    >
                        전송
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatRoom;
