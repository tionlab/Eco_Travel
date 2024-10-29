import { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { auth, firestore, updateProfile } from "../firebase";

const ProfilePage = () => {
    const [profileNumber, setProfileNumber] = useState(1);
    const [nickname, setDisplayName] = useState("");
    const [goal, setGoalSteps] = useState(10000);
    const [loading, setLoading] = useState(true);
    const [joystickEnabled, setJoystickEnabled] = useState(false);

    useEffect(() => {
        async function fetchData() {
            const storedJoystickSetting =
                localStorage.getItem("joystickEnabled");
            setJoystickEnabled(storedJoystickSetting);
            if (storedJoystickSetting) {
                setJoystickEnabled(JSON.parse(storedJoystickSetting));
            }
            const user = auth.currentUser;
            if (user) {
                const userRef = doc(firestore, "users", user.uid);
                const userDoc = await getDoc(userRef);

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    const currentgoalSteps = userData.goalSteps || 10000;
                    setGoalSteps(currentgoalSteps);
                    await updateDoc(userRef, { goalSteps: currentgoalSteps });
                } else {
                    await setDoc(userRef, { goalSteps: 10000 });
                }
            }
            const unsubscribe = auth.onAuthStateChanged((user) => {
                setDisplayName(user.displayName);
                setProfileNumber(user.photoURL);
            });
            setLoading(false);
            return () => unsubscribe();
        }
        fetchData();
    }, []);
    if (loading) {
        return (
            <div className="container mx-auto p-6 h-[calc(100vh-140px)] md:h-[calc(100vh-120px)]">
                <div className="text-center text-2xl">
                    잠시만 기다려주세요...
                </div>
            </div>
        );
    }

    const handleNicknameChange = (e) => setDisplayName(e.target.value);
    const handleGoalChange = (e) => setGoalSteps(Number(e.target.value));
    const handleProfileNumberChange = (e) =>
        setProfileNumber(Number(e.target.value));
    const handleJoystickToggle = () => {
        const newSetting = !joystickEnabled;
        setJoystickEnabled(newSetting);
        localStorage.setItem("joystickEnabled", JSON.stringify(newSetting));
    };
    const toastnoThat = () => {
        toast.success("설정이 저장되었습니다");
    };
    const handleSaveChanges = async () => {
        const user = auth.currentUser;
        if (user) {
            const userRef = doc(firestore, "users", user.uid);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
                await updateDoc(userRef, { goalSteps: goal });
            } else {
                await setDoc(userRef, { goalSteps: goal });
            }
            await updateProfile(user, {
                displayName: nickname,
                photoURL: profileNumber,
            });
            toastnoThat();
        }
    };

    return (
        <div className="h-[calc(100vh-140px)] md:h-[calc(100vh-120px)] flex items-center justify-center">
            <Toaster position="bottom-center" />
            <div className="bg-[#ffffff] p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-semibold mb-6 text-[#000000]">
                    개인 설정
                </h1>
                <div className="mb-4">
                    <label
                        className="block text-[#000000] mb-2"
                        htmlFor="nickname"
                    >
                        이름
                    </label>
                    <input
                        id="nickname"
                        type="text"
                        value={nickname}
                        onChange={handleNicknameChange}
                        className="w-full px-3 py-2 border border-[#a5d6a7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32]"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-[#000000] mb-2" htmlFor="goal">
                        목표 달성 걸음 수
                    </label>
                    <input
                        id="goal"
                        defaultValue={goal}
                        onChange={handleGoalChange}
                        className="w-full px-3 py-2 border border-[#a5d6a7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32]"
                    />
                </div>
                <div className="mb-6">
                    <label
                        className="block text-[#000000] mb-2"
                        htmlFor="profileNumber"
                    >
                        프로필 사진 종류 변경
                    </label>
                    <select
                        id="profileNumber"
                        value={profileNumber}
                        onChange={handleProfileNumberChange}
                        className="w-full px-3 py-2 border border-[#a5d6a7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32]"
                    >
                        {[1, 2, 3, 4, 5, 6].map((num) => (
                            <option key={num} value={num}>
                                {num}
                            </option>
                        ))}
                    </select>
                </div>{" "}
                <div className="mb-6">
                    <label
                        className="block text-[#b11010] mb-2"
                        htmlFor="joystickToggle"
                    >
                        (실험 기능) 지도에서 GPS가 아닌
                        <br />
                        조이스틱을 사용하여 이동
                    </label>
                    <div
                        className={`relative w-14 h-8 bg-[#a5d6a7] rounded-full cursor-pointer transition-colors duration-300 ${
                            joystickEnabled ? "bg-[#105a29]" : "bg-[#60ad64]"
                        }`}
                        onClick={handleJoystickToggle}
                    >
                        <div
                            className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 transform ${
                                joystickEnabled ? "translate-x-6" : ""
                            }`}
                        />
                    </div>
                </div>
                <button
                    onClick={handleSaveChanges}
                    className="w-full bg-[#2e7d32] text-[#ffffff] px-4 py-2 rounded-lg hover:bg-[#1b5e20] focus:outline-none focus:ring-2 focus:ring-[#2e7d32]"
                >
                    저장 하기
                </button>
            </div>
        </div>
    );
};

export default ProfilePage;
