import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import { Toaster, toast } from "react-hot-toast";
import {
    auth,
    createUserWithEmailAndPassword,
    updateProfile,
} from "../firebase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SignUp = () => {
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

    const handleSignin = () => {
        router.push("/login");
    };
    function generateRandomNickname() {
        const adjectives = [
            "자연친화적인",
            "생태적인",
            "환경을지키는",
            "지속가능한",
            "녹색의",
            "생태친화적인",
            "자연을사랑하는",
            "환경보호를위한",
            "지구를지키는",
            "자연속의",
            "환경친화적인",
            "지구를아끼는",
            "생태관련된",
            "자연환경을생각하는",
            "지구를위한",
            "환경을생각하는",
            "환경친화적인",
            "생태계를보호하는",
        ];

        const cuteAnimals = [
            "토끼",
            "나무늘보",
            "고슴도치",
            "팬더",
            "사슴",
            "여우",
            "알파카",
            "오소리",
            "물개",
            "하마",
            "코알라",
            "수달",
            "곰",
            "펭귄",
            "고양이",
            "강아지",
            "돼지",
            "백조",
            "호랑이",
            "사자",
            "오리",
            "기린",
            "라마",
            "프레리독",
            "카피바라",
            "수달",
            "미어캣",
            "족제비",
            "청둥오리",
            "비버",
            "올빼미",
            "날다람쥐",
            "붉은여우",
            "사막여우",
            "상어",
            "돌고래",
        ];

        const objects = [
            "자연길",
            "산책로",
            "하늘",
            "별",
            "태양",
            "초원",
            "수목원",
            "공원",
            "호수",
            "강",
            "바다",
            "해변",
            "섬",
            "정글",
            "강가",
            "계곡",
            "절벽",
            "산",
            "하이킹",
            "캠핑",
            "들판",
            "폭포",
            "온천",
            "수영",
            "빙하",
            "얼음동굴",
            "선착장",
            "클리프",
            "사막",
            "오아시스",
            "사바나",
            "정원",
        ];

        function getRandomElement(arr) {
            const index = Math.floor(Math.random() * arr.length);
            return arr[index];
        }

        const adjective = getRandomElement(adjectives);
        const animal = getRandomElement(cuteAnimals);
        const object = getRandomElement(objects);
        const nickname = `${adjective} ${animal} ${object}`;
        return nickname;
    }

    const handleSignUp = async (e) => {
        e.preventDefault();

        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            const randomName = generateRandomNickname();

            await updateProfile(userCredential.user, {
                displayName: randomName,
                photoURL: `${Math.floor(Math.random() * 6) + 1}`,
            });

            router.push("/home");
        } catch (error) {
            console.error("Error signing in:", error.message);
            let err = getRefinedFirebaseAuthErrorMessage(error.message);
            toast.error(`${err}`, {
                duration: 10000,
                position: "bottom-right",
            });
        }
    };

    return (
        <div className="relative w-full h-full overflow-hidden">
            {" "}
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
                    <Button
                        type="submit"
                        onClick={handleSignUp}
                        className="w-full"
                    >
                        회원 가입
                    </Button>
                    <div className="pt-4 text-center">
                        <p className="text-white">
                            이미 계정이 있으신가요?{" "}
                            <a
                                onClick={handleSignin}
                                className="text-sky drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,255.8)] hover:underline cursor-pointer"
                            >
                                이곳에서 로그인 하세요!
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
};

export default SignUp;
