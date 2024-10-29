import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { auth, firestore } from "../firebase";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";

export default function AdBanner() {
    const [timeLeft, setTimeLeft] = useState(30);
    const [isActive, setIsActive] = useState(false);
    const [message, setMessage] = useState("");
    const router = useRouter();

    useEffect(() => {
        setMessage(`30초 후 100원이 적립됩니다.`);
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    setIsActive(true);
                    setMessage("100원이 적립되었습니다.");
                    return 0;
                }
                setMessage(`${prevTime - 1}초 후 100원이 적립됩니다.`);
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);
    const handleClick = async () => {
        if (!isActive) return;

        const user = auth.currentUser;
        if (user) {
            const userRef = doc(firestore, "users", user.uid);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                const currentEcoCoin = userData.EcoCoin || 0;
                await updateDoc(userRef, { EcoCoin: currentEcoCoin + 1 });
            } else {
                await setDoc(userRef, { EcoCoin: 1 });
            }
        }
        if (user) {
            const userRef = doc(firestore, "users", user.uid);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                const currentgoalSteps = userData.goalSteps + 10000 || 20000;
                await updateDoc(userRef, { goalSteps: currentgoalSteps });
            } else {
                await setDoc(userRef, { goalSteps: 20000 });
            }
        }

        router.push("/mypage");
    };

    return (
        <div className="fixed left-0 top-0 bg-[white] text-black p-2 m-4 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.7)] flex items-center space-x-2">
            <button
                onClick={handleClick}
                className={`w-6 h-6 flex items-center rounded-full shadow-[0_0_10px_rgba(0,0,0,0.4)] justify-center ${
                    isActive
                        ? "bg-[white] text-black hover:bg-[white]"
                        : "bg-[white] text-[#bbbbbb] cursor-not-allowed"
                } transition-colors duration-300`}
                disabled={!isActive}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={4}
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </button>
            <p className="text-sm">{message}</p>
        </div>
    );
}
