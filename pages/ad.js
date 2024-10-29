import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { useRouter } from "next/router";
import AdBanner from "../components/adBanner";

export default function Coin() {
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
        const storedAd = localStorage.getItem("Adshow");
        if (!storedAd || storedAd === false) {
            router.back();
        }

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
        <div>
            <AdBanner />
            <video
                autoPlay
                playsInline
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    zIndex: -1,
                }}
            >
                <source src="/ad.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
}
