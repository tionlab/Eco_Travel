import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth, firestore } from "../firebase";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";

export default function CoinBox() {
    const [stotalSteps, setsTotalSteps] = useState(0);
    const [totalCalories, setTotalCalories] = useState(0);
    const [totalSavings, setTotalSavings] = useState(0);
    const [totalCarbonSaved, setTotalCarbonSaved] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [goalSteps, setGoalSteps] = useState(10000);
    const [picNum, setpicNum] = useState(1);
    const router = useRouter();

    const handleClick = () => {
        const storedAd = localStorage.getItem("Adshow");
        if (storedAd) {
            localStorage.setItem("Adshow", true);
        } else {
            localStorage.setItem("Adshow", true);
        }

        router.push("/ad");
    };
    useEffect(() => {
        async function fetchData() {
            const storedAd = localStorage.getItem("Adshow");
            if (storedAd) {
                localStorage.setItem("Adshow", false);
            } else {
                localStorage.setItem("Adshow", false);
            }

            const unsubscribe = auth.onAuthStateChanged((user) => {
                setpicNum(user.photoURL);
            });

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
            return () => unsubscribe();
        }
        fetchData();
    }, []);
    useEffect(() => {
        if (stotalSteps >= goalSteps) {
            setIsFinished(true);
        }
    }, [stotalSteps, goalSteps]);
    const progressPercentage =
        stotalSteps >= goalSteps
            ? 100
            : Math.min((stotalSteps / goalSteps) * 100, 100);
    const progressColor =
        stotalSteps >= goalSteps ? "bg-[purple]" : "bg-primary";

    useEffect(() => {
        const calculateStats = async () => {
            const user = auth.currentUser;
            let records = "";
            if (user) {
                const userRef = doc(firestore, "users", user.uid);
                const userDoc = await getDoc(userRef);

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    const currentrecords = userData.trackingRecords || "[]";
                    records = currentrecords;
                } else {
                    records = "[]";
                }
            }

            let parsedRecords;
            try {
                parsedRecords = JSON.parse(records);
            } catch (error) {
                console.error("Error parsing records:", error);
                parsedRecords = [];
            }

            if (!Array.isArray(parsedRecords)) {
                console.error("Parsed records is not an array:", parsedRecords);
                parsedRecords = [];
            }

            if (parsedRecords.length === 0) {
                const steps = 0;

                const calories = steps * 0.04;
                const distance = steps * 0.000804672;
                const carbonSaved = distance * 0.1062;
                const savings = distance * 0.79;

                setsTotalSteps(steps);
                setTotalCalories(calories);
                setTotalSavings(savings);
                setTotalCarbonSaved(carbonSaved);
            } else {
                const steps = parsedRecords.reduce((sum, record) => {
                    const stepCount = parseInt(record.steps);
                    return isNaN(stepCount) ? sum : sum + stepCount;
                }, 0);

                const calories = steps * 0.04;
                const distance = steps * 0.000804672;
                const carbonSaved = distance * 0.1062;
                const savings = distance * 0.79;

                setsTotalSteps(steps);
                setTotalCalories(calories);
                setTotalSavings(savings);
                setTotalCarbonSaved(carbonSaved);
            }
        };

        calculateStats();
    }, []);

    return (
        <div className="h-[calc(100vh-140px)] md:h-[calc(100vh-120px)] p-4 flex justify-center items-center">
            <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
                <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="flex items-center p-4">
                        <img
                            className="w-[6rem] h-[6rem] rounded-full"
                            src={`/pfi/pfi (${picNum}).jpg`}
                            alt="Profile Picture"
                        />
                        <div className="ml-4">
                            <h2 className="text-xl font-bold">
                                목표 걸음수 {goalSteps}보
                            </h2>
                            <p>{totalCalories.toFixed(2)}kcal 소모</p>
                            <p>{totalSavings.toFixed(2)}원 절약</p>
                            <p>{totalCarbonSaved.toFixed(2)}kg 탄소 절약</p>
                        </div>
                    </div>
                    <div className="px-4 py-2">
                        <div
                            className={`h-2 ${progressColor} rounded-full`}
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                    <div className="px-4 py-2 text-center text-2xl font-bold">
                        현재 걸음 수: {stotalSteps.toLocaleString()}보
                    </div>
                </div>
                <div className="relative mx-auto mt-10 max-w-md overflow-hidden rounded-lg bg-white shadow-lg">
                    <img
                        src="save.jpg"
                        alt="Placeholder Image"
                        className="h-full w-full"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <button
                            className={`rounded bg-primary px-4 py-2 font-bold ${
                                isFinished
                                    ? "bg-secondary-foreground text-white"
                                    : "bg-primary-foreground text-[gray] cursor-not-allowed"
                            }`}
                            onClick={isFinished ? handleClick : null}
                        >
                            FINISH
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
