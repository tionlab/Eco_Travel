import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import MyPageBox from "../components/mypageBox";
import { useRouter } from "next/router";
import { Navbar } from "../components/navbar";
import BottomBar from "../components/bottombar";

export default function MyPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
            if (!currentUser) {
                router.push("/login");
            }
        });

        return () => unsubscribe();
    }, [router]);

    if (loading) {
        return (
            <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-black"></div>
            </div>
        );
    }

    if (!user) {
        return null;
    }
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-grow overflow-hidden relative">
                <MyPageBox />
            </div>
            <BottomBar />
        </div>
    );
}
