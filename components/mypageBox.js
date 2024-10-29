import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { Toaster, toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { signOut } from "firebase/auth";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { auth, firestore } from "../firebase";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function MyPageBox() {
    const router = useRouter();
    const [City, setCity] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [trackingRecords, setTrackingRecords] = useState([]);
    const [goalSteps, setGoalSteps] = useState(10000);
    const [ecoCoin, setecoCoin] = useState(0);
    const [stotalSteps, setsTotalSteps] = useState(0);
    const [totalCalories, setTotalCalories] = useState(0);
    const [totalSavings, setTotalSavings] = useState(0);
    const [totalCarbonSaved, setTotalCarbonSaved] = useState(0);
    const [loading, setLoading] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [picNum, setpicNum] = useState(1);

    useEffect(() => {
        async function fetchData() {
            const storedAd = localStorage.getItem("Adshow");
            if (storedAd) {
                localStorage.setItem("Adshow", false);
            } else {
                localStorage.setItem("Adshow", false);
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

            if (user) {
                const userRef = doc(firestore, "users", user.uid);
                const userDoc = await getDoc(userRef);

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    const currentEcoCoin = userData.EcoCoin || 0;
                    setecoCoin(currentEcoCoin);
                } else {
                    setecoCoin(0);
                }
            }
            const calculateStats = async () => {
                const user = auth.currentUser;
                let records = "";
                if (user) {
                    const userRef = doc(firestore, "users", user.uid);
                    const userDoc = await getDoc(userRef);

                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        const currentrecords = userData.trackingRecords || "[]";
                        records = JSON.parse(currentrecords);
                    } else {
                        records = "[]";
                    }
                }
                const steps = records.reduce(
                    (sum, record) => sum + parseInt(record.steps),
                    0
                );

                setsTotalSteps(steps);
            };

            calculateStats();

            const unsubscribe = auth.onAuthStateChanged((user) => {
                setDisplayName(user.displayName);
                setpicNum(user.photoURL);
            });

            let storedRecords = "";
            if (user) {
                const userRef = doc(firestore, "users", user.uid);
                const userDoc = await getDoc(userRef);

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    const currentrecords = userData.trackingRecords || "[]";
                    storedRecords = JSON.parse(currentrecords);
                } else {
                    storedRecords = "[]";
                }
            }
            setTrackingRecords(
                storedRecords.filter(
                    (record) => record.steps > 0 || record.distance > 0
                )
            );
            const calculateStats2 = async () => {
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
                    console.error(
                        "Parsed records is not an array:",
                        parsedRecords
                    );
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

            calculateStats2();
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    successCallback,
                    errorCallback
                );
            } else {
                console.error("Geolocation is not supported by this browser.");
            }

            function successCallback(position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                getLocationName(latitude, longitude);
            }

            function errorCallback(error) {
                console.error("Error getting location: " + error.message);
            }
            function translateDistrictName(text) {
                const gu_dict = {
                    중구: "JUNGGU",
                    종로구: "JONGNOGU",
                    동대문구: "DONGDAEMUNGU",
                    성동구: "SEONGDONGGU",
                    서대문구: "SEODAEMUNGU",
                    용산구: "YONGSANGU",
                    영등포구: "YEONGDEUNGPOGU",
                    마포구: "MAPOGU",
                    성북구: "SEONGBUKGU",
                    도봉구: "DOBONGGU",
                    관악구: "GWANAKGU",
                    강남구: "GANGNAMGU",
                    강서구: "GANGSEOGU",
                    은평구: "EUNPYEONGGU",
                    강동구: "GANGDONGGU",
                    구로구: "GUROGU",
                    동작구: "DONGJAKGU",
                    송파구: "SONPGAGU",
                    중랑구: "JUNGNANGGU",
                    노원구: "NOWONGU",
                    서초구: "SEOCHOGU",
                    양천구: "YANGCHEONGU",
                    서구: "SEOGU",
                    영도구: "YEONGDOGU",
                    동구: "DONGGU",
                    부산진구: "BUSANJINGU",
                    동래구: "DONGNAEGU",
                    남구: "NAMGU",
                    북구: "BUKGU",
                    해운대구: "HAEUNDAEGU",
                    사하구: "SAHAGU",
                    연제구: "YEONJEGU",
                    수영구: "SUYEONGGU",
                    사상구: "SASANGGU",
                    미추홀구: "MICHUHOLGU",
                    부평구: "BUPYEONGGU",
                    계양구: "GYEYANGGU",
                    유성구: "YUSEONGGU",
                    대덕구: "DAEDEOKGU",
                    수성구: "SUSEONGGU",
                    달서구: "DALSEOGU",
                    청원구: "CHEONGWONGU",
                    서원구: "SEOWONGU",
                    상당구: "SANGDANGGU",
                    흥덕구: "HEUNGDEOKGU",
                    덕양구: "DEOGYANGGU",
                    일산동구: "ILSANDONGGU",
                    일산서구: "ILSANSEOGU",
                    상록구: "SANGNOKGU",
                    단원구: "DANWONGU",
                    처인구: "CHEOINGU",
                    기흥구: "GIHEUNGGU",
                    수지구: "SUJIGU",
                    동남구: "DONGNAMGU",
                    서북구: "SEOBUKGU",
                    의창구: "UICHANGGU",
                    성산구: "SEONGSANGU",
                    합포구: "HAPPOGU",
                    회원구: "HOECHONGU",
                    진해구: "JINHAEGU",
                    완산구: "WANSANGU",
                    덕진구: "DEOKJINGU",
                    중원구: "JUNGWONGU",
                    팔달구: "PALDALGU",
                    원미구: "WONMIGU",
                    소사구: "SOSAGU",
                    오정구: "OJEONGGU",
                };
                return gu_dict[text];
            }

            function getLocationName(latitude, longitude) {
                const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
                const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

                fetch(url)
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.status === "OK") {
                            const results = data.results;
                            if (results.length > 0) {
                                const addressComponents =
                                    results[0].address_components;
                                let districtName = "";
                                addressComponents.forEach((component) => {
                                    if (
                                        component.types.includes(
                                            "sublocality_level_1"
                                        )
                                    ) {
                                        districtName = component.long_name;
                                    }
                                });

                                if (districtName) {
                                    const districtNameEnglish =
                                        translateDistrictName(districtName);
                                    setCity(districtNameEnglish);
                                }
                            }
                        } else {
                            console.error("Geocoding failed: " + data.status);
                        }
                    })
                    .catch((error) => {
                        console.error("Error fetching location data: " + error);
                    });
            }
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
    const progressPercentage =
        stotalSteps >= goalSteps
            ? 100
            : Math.min((stotalSteps / goalSteps) * 100, 100);
    const progressColor =
        stotalSteps >= goalSteps ? "bg-[purple]" : "bg-primary";

    const chartData = {
        labels: trackingRecords.map((record) => record.date),
        datasets: [
            {
                label: "걸음 수",
                data: trackingRecords.map((record) => record.steps),
                backgroundColor: "rgba(59, 130, 246, 0.6)",
            },
            {
                label: "거리 (km)",
                data: trackingRecords.map((record) =>
                    parseFloat(record.distance)
                ),
                backgroundColor: "rgba(16, 185, 129, 0.6)",
            },
        ],
    };
    const handleSet = () => {
        router.push("/set");
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: { stacked: true },
            y: { stacked: false },
        },
        plugins: {
            legend: { position: "top" },
        },
    };
    const totalSlides = 3;

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    };
    const handleSignOut = async () => {
        try {
            await signOut(auth);
            router.push("/login");
        } catch (error) {
            console.error("Error signing out:", error.message);
        }
    };

    const toastnoThat = () => {
        toast.success("구란데 ㅋ", {
            icon: "🤣",
            style: {
                border: "1px solid #713200",
                padding: "16px",
                color: "#713200",
            },
            iconTheme: {
                primary: "#713200",
                secondary: "#FFFAEE",
            },
        });
    };
    return (
        <div className="container mx-auto p-6 h-[calc(100vh-140px)] md:h-[calc(100vh-120px)]">
            <Toaster position="bottom-center" />
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8 relative">
                <div className="absolute top-0 left-0 bg-secondary rounded-full m-6 p-2 text-2xl md:text-4xl md:p-4 font-bold">
                    LV. {ecoCoin}
                </div>
                <Button
                    onClick={handleSet}
                    className="absolute top-0 right-0 m-6 p-2 text-lg bg-black md:p-4 font-bold"
                >
                    설정
                </Button>
                <Button
                    onClick={handleSignOut}
                    className="absolute top-0 right-0 m-6 mt-[4.5rem] p-2 text-base bg-[#d3d3d3] text-[#2b2b2b] md:p-4 font-bold"
                >
                    로그아웃
                </Button>
                <div className="flex flex-col items-center mb-6">
                    <Image
                        src={`/pfi/pfi (${picNum}).jpg`}
                        alt="Profile"
                        width={100}
                        height={100}
                        className="rounded-full mb-4"
                    />
                    <h2 className="text-base md:text-3xl font-bold">
                        {displayName}
                    </h2>
                    <p className="text-xl">{`${City} KOREA`}</p>
                </div>
                <div className="flex flex-col mb-6 items-center">
                    <div className="flex flex-col mb-1 w-full max-w-xs">
                        <h3 className="text-sm text-center font-semibold mb-1">
                            다음 레벨까지 {100 - progressPercentage.toFixed(0)}%
                            남았습니다.
                        </h3>
                        <div className="rounded-full h-4 mb-1 bg-gray-200">
                            <div
                                className={`h-4 rounded-full ${progressColor} transition-all duration-500 ease-in-out`}
                                style={{ width: `${progressPercentage}%` }}
                            ></div>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>0보</span>
                            <span>{goalSteps}보</span>
                        </div>
                    </div>
                </div>
                <div className="relative">
                    <div className="overflow-hidden">
                        <div
                            className="flex transition-transform duration-300 ease-in-out"
                            style={{
                                transform: `translateX(-${
                                    currentSlide * 100
                                }%)`,
                            }}
                        >
                            <div className="w-full flex-shrink-0 px-4">
                                <h3 className="text-lg font-semibold mb-2">
                                    스탯
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <StatCard
                                        title="총 걸음 수"
                                        value={stotalSteps.toLocaleString()}
                                        unit="보"
                                    />
                                    <StatCard
                                        title="칼로리 소모량"
                                        value={totalCalories.toFixed(2)}
                                        unit="kcal"
                                    />
                                    <StatCard
                                        title="절약한 금액"
                                        value={totalSavings.toFixed(2)}
                                        unit="원"
                                    />
                                    <StatCard
                                        title="절약한 탄소량"
                                        value={totalCarbonSaved.toFixed(2)}
                                        unit="kg"
                                    />
                                </div>
                            </div>
                            <div className="w-full flex-shrink-0 px-4">
                                <h3 className="text-lg font-semibold mb-2">
                                    활동 기록
                                </h3>
                                <div className="h-[13rem]">
                                    <Bar
                                        data={chartData}
                                        options={chartOptions}
                                    />
                                </div>
                            </div>
                            <div className="w-full flex-shrink-0 px-4 ">
                                <h3 className="text-lg font-semibold ">
                                    현재 누적 적립금
                                </h3>
                                <div className="justify-center items-center text-center">
                                    <div className="flex justify-center items-center text-center">
                                        <img
                                            src="money.gif"
                                            className="w-[8rem] h-[8rem]"
                                        />
                                    </div>
                                    <h3 className="text-lg text-center font-semibold">
                                        {ecoCoin * 100}원
                                    </h3>
                                    <Button
                                        onClick={toastnoThat}
                                        className="w-full justify-center items-center text-center md:w-[20vw]"
                                    >
                                        인출 하기
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between mt-4">
                    <button
                        onClick={prevSlide}
                        className="bg-white rounded-full p-2 shadow-md"
                    >
                        <ChevronLeftIcon className="h-6 w-6" />
                    </button>
                    <div className="flex justify-center">
                        {[...Array(totalSlides)].map((_, index) => (
                            <div
                                key={index}
                                className={`h-2 w-2 rounded-full mx-1 ${
                                    currentSlide === index
                                        ? "bg-[blue]"
                                        : "bg-[gray]"
                                }`}
                            ></div>
                        ))}
                    </div>
                    <button
                        onClick={nextSlide}
                        className="bg-white rounded-full p-2 shadow-md"
                    >
                        <ChevronRightIcon className="h-6 w-6 " />
                    </button>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, unit }) {
    return (
        <div className="bg-white shadow rounded-lg my-2 p-3">
            <h2 className="text-base font-semibold">{title}</h2>
            <p className="text-lg font-bold">
                {value} <span className="text-xs font-normal">{unit}</span>
            </p>
        </div>
    );
}
