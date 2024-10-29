import { useState, useEffect } from "react";

export default function TouristAttractions() {
    const [query, setQuery] = useState("");
    const [attractions, setAttractions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [recentSearches, setRecentSearches] = useState([]);

    useEffect(() => {
        const savedSearches =
            JSON.parse(localStorage.getItem("recentSearches")) || [];
        setRecentSearches(savedSearches);
    }, []);

    const saveSearchToLocalStorage = (newSearch) => {
        const trimmedSearch = newSearch.trim();
        if (trimmedSearch) {
            const savedSearches =
                JSON.parse(localStorage.getItem("recentSearches")) || [];
            const updatedSearches = [trimmedSearch, ...savedSearches]
                .filter(
                    (search, index, self) =>
                        index === self.findIndex((t) => t === search)
                )
                .slice(0, 10);
            localStorage.setItem(
                "recentSearches",
                JSON.stringify(updatedSearches)
            );
            setRecentSearches(updatedSearches);
        }
    };

    const searchAttractions = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `https://api.tion.kro.kr/google/api/textSearch?query=${encodeURIComponent(
                    query.trim()
                )}`
            );
            const data = await response.json();
            setAttractions(data.results);
            saveSearchToLocalStorage(query);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchClick = () => {
        if (query.trim()) {
            searchAttractions();
        }
    };

    const handleRecentSearchClick = (searchQuery) => {
        setQuery(searchQuery);
        searchAttractions();
    };

    const handleDeleteClick = (searchToDelete) => {
        const updatedSearches = recentSearches.filter(
            (search) => search !== searchToDelete
        );
        localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
        setRecentSearches(updatedSearches);
    };
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-center text-[#111827]">
                관광지 검색
            </h1>
            <div className="flex mb-8 justify-center">
                <div className="flex flex-col sm:flex-row w-full sm:w-[40vw]">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="관광지를 검색하세요"
                        className="flex-grow px-4 py-2 border border-[#D1D5DB] rounded-l-md shadow-sm focus:outline-none"
                    />
                    <button
                        onClick={handleSearchClick}
                        className="px-6 py-2 bg-primary text-white rounded-r-md shadow-md hover:bg-card-foreground focus:outline-none"
                    >
                        검색
                    </button>
                </div>
            </div>
            {loading && (
                <p className="text-center text-[#6B7280]">검색 중...</p>
            )}
            {attractions.length === 0 && !loading && (
                <div className="flex justify-center">
                    <div className="text-left">
                        <p className="text-center text-[#6B7280]">
                            검색 결과가 없습니다
                        </p>
                        {recentSearches.length > 0 && (
                            <div className="mt-8">
                                <h2 className="text-xl font-semibold mb-4 text-center text-[#111827]">
                                    최근 검색어
                                </h2>
                                <ol className="list-decimal pl-5">
                                    {recentSearches.map((search, index) => (
                                        <li
                                            key={index}
                                            className="flex items-center mb-2 relative pl-10"
                                        >
                                            <span
                                                className="flex-1 text-[#3B82F6]  mr-20 cursor-pointer hover:underline"
                                                onClick={() =>
                                                    handleRecentSearchClick(
                                                        search
                                                    )
                                                }
                                            >
                                                {search}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    handleDeleteClick(search)
                                                }
                                                className="absolute right-0 top-1/2 transform -translate-y-1/2 text-[#F87171] hover:text-[#EF4444] focus:outline-none"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className=" h-5 w-5"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M6 18L18 6M6 6l12 12"
                                                    />
                                                </svg>
                                            </button>
                                            <span className="absolute left-0 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                {index + 1}
                                            </span>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        )}
                    </div>
                </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
                {attractions.length > 0 &&
                    !loading &&
                    attractions.map((attraction) => (
                        <div
                            key={attraction.place_id}
                            className="bg-white rounded-lg w-[80vw] sm:w-[40vw] md:w-[25vw] h-40 sm:h-[20rem] overflow-hidden shadow-lg flex flex-row sm:flex-col"
                        >
                            <div className="w-1/3 h-full sm:w-full sm:h-2/3 overflow-hidden">
                                <img
                                    src={
                                        attraction.photos &&
                                        attraction.photos.length > 0
                                            ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${attraction.photos[0].photo_reference}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
                                            : "https://img.freepik.com/free-vector/gradient-world-tourism-day-illustration_52683-129641.jpg"
                                    }
                                    alt={attraction.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-4 flex-1 flex flex-col justify-center">
                                <h2 className="text-xl font-semibold mb-2 text-[#111827]">
                                    {attraction.name}
                                </h2>
                                <p className="text-[#4B5563] mb-4 text-sm">
                                    {attraction.formatted_address}
                                </p>
                                <a
                                    href={`https://www.google.com/maps/place/?q=place_id:${attraction.place_id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#3B82F6] hover:underline"
                                >
                                    Google Maps에서 보기
                                </a>
                            </div>
                        </div>
                    ))}
            </div>
            <br />
            <br />
            <br />
            <br />
        </div>
    );
}
