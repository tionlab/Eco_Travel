import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/outline";

const eventData = {
    "화담숲투어 50%할인 이벤트": [
        {
            link: "http://www.hwadamsup.com",
            img: "https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=670f3a10-a04e-4efc-8991-cb249dc69b95",
        },
    ],
    "연대도 투어 커플체험 이벤트": [
        {
            link: "https://www.utour.go.kr/01198/01963/01210.web?idx=1852&amode=view",
            img: "https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=822a609a-04c8-461f-b796-544e96825feb",
        },
    ],
    "하동 탄소없는마을 탄소제로 이벤트": [
        {
            link: "https://blog.naver.com/c_zero_village_09",
            img: "https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=3bfb424e-e18f-4fee-8eb4-28f96889f1f9",
        },
    ],
    "생태탐방공원 버스비 지원 이벤트": [
        {
            link: "https://blog.naver.com/gayanc",
            img: "https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=4274d975-ee08-43bd-a865-4706be1244f2",
        },
    ],
    "다자녀가족 문경새제 무료 입장 이벤트": [
        {
            link: "http://www.gbmg.go.kr/tour",
            img: "https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=e9919734-f677-4bab-b543-88ac58908aa5",
        },
    ],
    "광주 전통 문화관 부스체험 이벤트": [
        {
            link: "http://www.gtcc.or.kr/",
            img: "https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=8e7b5979-4835-48bb-a169-02dde98f5cae",
        },
    ],
};
export default function HomeBox() {
    const router = useRouter();

    const events = Object.entries(eventData).map(([name, data]) => ({
        name,
        ...data[0],
    }));
    const [current, setCurrent] = useState(0);
    const length = events.length;

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((current) => (current === length - 1 ? 0 : current + 1));
        }, 5000);
        return () => clearInterval(interval);
    }, [length]);

    const nextSlide = () => {
        setCurrent(current === length - 1 ? 0 : current + 1);
    };

    const prevSlide = () => {
        setCurrent(current === 0 ? length - 1 : current - 1);
    };
    const handleWalk = () => {
        router.push("/walk");
    };
    const handleFavor = () => {
        router.push("/favor");
    };
    const handleAIChat = () => {
        router.push("/aichat");
    };

    return (
        <main className="flex justify-center items-center">
            <div className="w-full p-10">
                <div className="relative w-full h-60">
                    {events.map((event, index) => (
                        <div
                            key={index}
                            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000  ${
                                index === current
                                    ? "opacity-100 z-100"
                                    : "opacity-0 -z-10"
                            }`}
                        >
                            <a href={event.link} rel="noopener noreferrer">
                                <img
                                    src={event.img}
                                    alt="Event Image"
                                    className="h-60 w-full object-cover "
                                />
                            </a>
                            <div className="absolute left-0 top-0 p-4">
                                <h2 className="text-4xl font-bold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,255.8)] text-[#8affd2]">
                                    EVENT
                                </h2>
                                <p className="mt-1 text-lg drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,255.8)] text-white">
                                    {event.name}
                                </p>
                            </div>
                        </div>
                    ))}
                    <ChevronLeftIcon
                        onClick={prevSlide}
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 text-white h-10 w-10 cursor-pointer"
                    />
                    <ChevronRightIcon
                        onClick={nextSlide}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white h-10 w-10 cursor-pointer"
                    />
                </div>
                <div className="mt-4 flex justify-center">
                    <div className="mx-1 h-2 w-2 rounded-full"></div>
                    <div className="mx-1 h-2 w-2 rounded-full"></div>
                    <div className="mx-1 h-2 w-2 rounded-full"></div>
                </div>
                <div
                    className="mt-2 md:mt-8 flex items-center justify-center"
                    onClick={handleAIChat}
                >
                    <div className="bg-secondary rounded-full px-3 py-[0.25rem]">
                        <div className="flex items-center">
                            <img
                                src="aiman.jpg"
                                className="w-12 h-12 md:w-16 md:h-16  rounded-full "
                            />
                            <div className="ml-4">
                                <p className="text-sm md:text-lg">
                                    안녕하세요! <br /> 앱 사용에 도움이
                                    필요하신가요?
                                    <br /> 저를 눌러보세요!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-5 md:mt-8 flex justify-center space-x-[3vw] md:space-x-[20vw]">
                    <div className="text-center">
                        <img
                            src="walk.png"
                            className="w-[8rem] h-[8rem] p-5 md:w-[10rem] md:h-[10rem]"
                        />
                        <p className="text-xl">탄소 발자국</p>
                        <Button
                            className="mt-2 px-4 py-2 text-white"
                            onClick={handleWalk}
                        >
                            시작하기
                        </Button>
                    </div>
                    <div className="text-center">
                        <img
                            src="plag.png"
                            className="w-[8rem] h-[8rem] p-5 md:w-[10rem] md:h-[10rem]"
                        />
                        <p className="text-xl">여행 추천 상품</p>
                        <Button
                            className="mt-2 bg-sky px-4 py-2 text-white"
                            onClick={handleFavor}
                        >
                            확인하기
                        </Button>
                    </div>
                </div>
            </div>
        </main>
    );
}
