import { useState, useEffect } from "react";
import { auth, signInWithEmailAndPassword } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Input } from "@/components/ui/input";
import { Toaster, toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
function getRefinedFirebaseAuthErrorMessage(errorMesssage) {
    let errcode = errorMesssage.match(/\((.*?)\)/)[1];
    switch (errcode) {
        case "auth/user-not-found":
            return "등록되지 않은 계정입니다.";
        case "auth/wrong-password":
            return "이메일 혹은 비밀번호가 일치하지 않습니다.";
        case "auth/email-already-in-use":
            return "이미 사용 중인 이메일입니다.";
        case "auth/weak-password":
            return "비밀번호는 6글자 이상이어야 합니다.";
        case "auth/network-request-failed":
            return "네트워크 연결에 실패 하였습니다.";
        case "auth/invalid-email":
            return "잘못된 이메일 형식입니다.";
        case "auth/internal-error":
            return "잘못된 요청입니다.";
        default:
            return "로그인에 실패 하였습니다.";
    }
}
export default function Login() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
            if (currentUser) {
                router.push("/home");
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

    if (user) {
        return null;
    }

    const signIn = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.error("Error signing in:", error.message);
            let err = getRefinedFirebaseAuthErrorMessage(error.message);
            toast.error(`${err}`, {
                duration: 10000,
                position: "bottom-right",
            });
        }
    };

    const handleSignUp = () => {
        router.push("/signup");
    };

    return (
        <div className="relative w-full h-full overflow-hidden">
            <Toaster />
            <div className="mx-auto p-5 max-w-md flex flex-col justify-center h-screen relative z-10">
                <img src="/logo.png" />
                <div className="mt-1 space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-white ">
                            이메일
                        </label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="example@ecotravel.com"
                            required
                            className="w-full px-4 py-2 rounded-md bg-white bg-opacity-25 text-white"
                        />
                    </div>
                    <div className="space-y-2 pb-6">
                        <label htmlFor="password" className="text-white">
                            비밀번호
                        </label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 rounded-md bg-white bg-opacity-25 text-white"
                        />
                    </div>
                    <Button type="submit" onClick={signIn} className="w-full">
                        로그인
                    </Button>
                    <div className="pt-4 text-center">
                        <p className="text-white">
                            Eco Travel에 처음 오셨나요?{" "}
                            <a
                                onClick={handleSignUp}
                                className="text-sky drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,255.8)] hover:underline cursor-pointer"
                            >
                                이곳에서 가입 하세요!
                            </a>
                        </p>
                    </div>
                </div>
            </div>

            <div className="CrossFade z-0">
                <img
                    src="/1.png"
                    className="object-cover object-center h-screen w-full"
                />
                <img
                    src="/2.png"
                    className="object-cover object-center h-screen w-full"
                />
                <img
                    src="/3.png"
                    className="object-cover object-center h-screen w-full"
                />
                <img
                    src="/4.png"
                    className="object-cover object-center h-screen w-full"
                />
            </div>
        </div>
    );
}
