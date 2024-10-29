import { useState, useEffect } from "react";

const ClickIndicator = () => {
    const [clicks, setClicks] = useState([]);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);

        const handleClick = (e) => {
            const newClick = {
                x: e.clientX,
                y: e.clientY,
                id: Date.now(),
            };
            setClicks((prevClicks) => [...prevClicks, newClick]);

            setTimeout(() => {
                setClicks((prevClicks) =>
                    prevClicks.filter((click) => click.id !== newClick.id)
                );
            }, 1000);
        };

        window.addEventListener("click", handleClick);

        return () => {
            window.removeEventListener("click", handleClick);
            window.removeEventListener("resize", checkMobile);
        };
    }, []);

    return (
        <>
            {clicks.map((click) => (
                <div
                    key={click.id}
                    style={{
                        position: "fixed",
                        left: click.x - (isMobile ? 10 : 18),
                        top: click.y - (isMobile ? 10 : 28),
                        width: isMobile ? "20px" : "40px",
                        height: isMobile ? "20px" : "40px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        color: "black",
                        fontSize: isMobile ? "20px" : "40px",
                        pointerEvents: "none",
                        zIndex: 9999,
                        animation: "fadeOut 1s ease-out",
                    }}
                >
                    ✓
                </div>
            ))}
            <style jsx global>{`
                @keyframes fadeOut {
                    from {
                        opacity: 1;
                    }
                    to {
                        opacity: 0;
                    }
                }
            `}</style>
        </>
    );
};

export default ClickIndicator;
