import { useState } from "react";

const data = {
    경기: [
        {
            name: "화담숲(사람과 자연이 조화된 열린 수목원",
            img: "https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=8bccd65b-5a71-47d6-b16c-454beedda694",
            hashtag:
                "#곤지암,서울근교,연인과함께,친환경여행,모노레일,겨울가볼만한 곳",
            주소: "경기도 광주시 도척면 도척윗로 278-1 ",
            연락처: "031-8026-6666",
            홈페이지: " http://www.hwadamsup.com ",
            추가: "추천숙박업소:곤지암리조트",
        },
    ],
    경남: [
        {
            name: "하동 탄소없는 마을",
            img: "https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=f8dda4de-b42f-40d6-abe0-153ab6561c1f",
            hashtag:
                "#경남,친환경 가치 확산 여행지,탄소없는마을,친환경 추천 여행지",
            주소: "경상남도 하동군 화개로 1425 ",
            연락처: "055-883-3580",
            홈페이지: "https://blog.naver.com/c_zero_village_09 ",
            추가: "추천숙박업소:연우펜션",
        },
        {
            name: "통영시 연대도",
            img: "https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=6dbbf98a-748f-4121-a460-f53ab42ca35c",
            hashtag:
                "#가볼래터,경상권,자연,봉화대,섬,피서,통영가볼만한 곳,통영섬여행",
            주소: "경기도 광주시 도척면 도척윗로 278-1 ",
            홈페이지:
                "https://www.utour.go.kr/01198/01963/01210.web?idx=1852&amode=view ",
            추가: "추천숙박업소:연대섬 펜션",
        },
    ],
    경북: [
        {
            name: "국립공원 가야생태탐방원",
            img: "https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=0cc49bba-11af-4ec6-b884-a8be4142edde",
            hashtag:
                "#가야산숲길걷기,가야산탐방,국립공원,성주가볼만한곳,에코프로그램,친환경 숙소",
            주소: "경상북도 성주군 수륜면 봉양로1길 313 ",
            연락처: "054-930-7000",
            홈페이지: " https://blog.naver.com/gayanc ",
            추가: "추천숙박업소:가야호텔",
        },
        {
            name: "문경새재도립공원",
            img: "https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=91d52b42-4db7-49cf-8483-40b97e2f9242",
            hashtag:
                "#KBS드라마촬영장,가족여행,경상권,관광지,등산,문경미로공원",
            주소: "경상북도 문경시 문경읍 새재로 932 ",
            연락처: "054-571-0709",
            홈페이지: "http://www.gbmg.go.kr/tour",
            추가: "추천숙박업소:문경관광호텔",
        },
    ],
    광주: [
        {
            name: "광주 전통문화관",
            img: "https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=be54538d-375d-4d8e-86fa-ec8f1f1ba6b9",
            hashtag: "#문화시설,문화관광지",
            주소: "광주광역시 동구 의재로 222 ",
            연락처: "062-670-8508",
            홈페이지: "http://www.gtcc.or.kr/",
            추가: "추천숙박업소:탑캐슬호텔",
        },
    ],
};

export default function FavorBox() {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 1;
    const totalItems = Object.keys(data).reduce(
        (acc, key) => acc + data[key].length,
        0
    );
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const getCurrentPageData = () => {
        let count = 0;
        for (const [region, items] of Object.entries(data)) {
            for (const item of items) {
                count++;
                if (count === currentPage) {
                    return { region, item };
                }
            }
        }
        return null;
    };
    const currentData = getCurrentPageData();

    const formatHashtags = (hashtags) => {
        return hashtags
            .split(",")
            .map((tag) =>
                tag.trim().startsWith("#") ? tag.trim() : `#${tag.trim()}`
            );
    };

    return (
        <div className="h-[calc(100vh-140px)] md:h-[calc(100vh-120px)] p-4 flex justify-center items-center">
            <div className="w-full">
                <div className="flex justify-center mb-10">
                    <div className="rounded py-2 px-4 bg-primary-foreground">
                        <p className="text-2xl md:text-4xl uppercase">
                            여행 추천상품
                        </p>
                    </div>
                </div>
                {currentData && (
                    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
                        <div className="relative">
                            <img
                                src={currentData.item.img}
                                alt={currentData.item.name}
                                className="w-full h-64 md:h-96 object-cover"
                            />
                            <div className="absolute top-2 left-2 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,255.8)] text-white px-2 py-1 rounded">
                                {currentData.region}
                            </div>
                        </div>
                        <div className="p-4">
                            <h2 className="text-xl font-semibold mb-2">
                                {currentData.item.name}
                            </h2>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {formatHashtags(currentData.item.hashtag).map(
                                    (tag, index) => (
                                        <span
                                            key={index}
                                            className="bg-primary-foreground text-black px-2 py-1 rounded text-sm"
                                        >
                                            {tag}
                                        </span>
                                    )
                                )}
                            </div>
                            <p className="text-sm mb-1">
                                <strong>주소:</strong> {currentData.item.주소}
                            </p>
                            {currentData.item.연락처 && (
                                <p className="text-sm mb-1">
                                    <strong>연락처:</strong>{" "}
                                    {currentData.item.연락처}
                                </p>
                            )}
                            <p className="text-sm mb-1">
                                <strong>홈페이지:</strong>{" "}
                                <a
                                    href={currentData.item.홈페이지}
                                    className="text-sky hover:underline"
                                >
                                    {currentData.item.홈페이지}
                                </a>
                            </p>
                            <p className="text-sm">
                                <strong>
                                    {currentData.item.추가.split(":")[0]}:
                                </strong>{" "}
                                {currentData.item.추가.split(":")[1]}
                            </p>
                        </div>
                    </div>
                )}
                <div className="flex justify-center space-x-2">
                    <button
                        onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        className="px-3 py-1 rounded"
                        disabled={currentPage === 1}
                    >
                        &lt;
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`px-3 py-1 rounded ${
                                currentPage === i + 1
                                    ? "bg-secondary text-black"
                                    : ""
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        onClick={() =>
                            setCurrentPage((prev) =>
                                Math.min(prev + 1, totalPages)
                            )
                        }
                        className="px-3 py-1 rounded"
                        disabled={currentPage === totalPages}
                    >
                        &gt;
                    </button>
                </div>
            </div>
        </div>
    );
}
