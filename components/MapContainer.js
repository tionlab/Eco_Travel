import { useEffect, useRef, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { Loader } from "@googlemaps/js-api-loader";
import { auth, firestore } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Joystick } from "react-joystick-component";

export default function MapPage() {
    const [stotalSteps, setsTotalSteps] = useState(0);
    const [joystickEnabled, setJoystickEnabled] = useState(false);
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markerRef = useRef(null);
    const polylineRef = useRef(null);
    const watchIdRef = useRef(null);
    const [isTracking, setIsTracking] = useState(false);
    const [totalSteps, setTotalSteps] = useState(0);
    const [totalDistance, setTotalDistance] = useState(0);
    const pathRef = useRef([]);

    const initialCenter = { lat: 37.5665, lng: 126.978 };
    const initialZoom = 14;
    const trackingZoom = 15;

    let lastLat = null;
    let lastLon = null;
    const mapStyles = [
        {
            elementType: "geometry",
            stylers: [
                {
                    color: "#ebe3cd",
                },
            ],
        },
        {
            elementType: "labels.text.fill",
            stylers: [
                {
                    color: "#523735",
                },
            ],
        },
        {
            elementType: "labels.text.stroke",
            stylers: [
                {
                    color: "#f5f1e6",
                },
            ],
        },
        {
            featureType: "administrative",
            elementType: "geometry.stroke",
            stylers: [
                {
                    color: "#c9b2a6",
                },
            ],
        },
        {
            featureType: "administrative.land_parcel",
            elementType: "geometry.stroke",
            stylers: [
                {
                    color: "#dcd2be",
                },
            ],
        },
        {
            featureType: "administrative.land_parcel",
            elementType: "labels.text.fill",
            stylers: [
                {
                    color: "#ae9e90",
                },
            ],
        },
        {
            featureType: "landscape.natural",
            elementType: "geometry",
            stylers: [
                {
                    color: "#dfd2ae",
                },
            ],
        },
        {
            featureType: "poi",
            elementType: "geometry",
            stylers: [
                {
                    color: "#dfd2ae",
                },
            ],
        },
        {
            featureType: "poi",
            elementType: "labels.text.fill",
            stylers: [
                {
                    color: "#93817c",
                },
            ],
        },
        {
            featureType: "poi.park",
            elementType: "geometry.fill",
            stylers: [
                {
                    color: "#a5b076",
                },
            ],
        },
        {
            featureType: "poi.park",
            elementType: "labels.text.fill",
            stylers: [
                {
                    color: "#447530",
                },
            ],
        },
        {
            featureType: "road",
            elementType: "geometry",
            stylers: [
                {
                    color: "#f5f1e6",
                },
            ],
        },
        {
            featureType: "road.arterial",
            elementType: "geometry",
            stylers: [
                {
                    color: "#fdfcf8",
                },
            ],
        },
        {
            featureType: "road.highway",
            elementType: "geometry",
            stylers: [
                {
                    color: "#f8c967",
                },
            ],
        },
        {
            featureType: "road.highway",
            elementType: "geometry.stroke",
            stylers: [
                {
                    color: "#e9bc62",
                },
            ],
        },
        {
            featureType: "road.highway.controlled_access",
            elementType: "geometry",
            stylers: [
                {
                    color: "#e98d58",
                },
            ],
        },
        {
            featureType: "road.highway.controlled_access",
            elementType: "geometry.stroke",
            stylers: [
                {
                    color: "#db8555",
                },
            ],
        },
        {
            featureType: "road.local",
            elementType: "labels.text.fill",
            stylers: [
                {
                    color: "#806b63",
                },
            ],
        },
        {
            featureType: "transit.line",
            elementType: "geometry",
            stylers: [
                {
                    color: "#dfd2ae",
                },
            ],
        },
        {
            featureType: "transit.line",
            elementType: "labels.text.fill",
            stylers: [
                {
                    color: "#8f7d77",
                },
            ],
        },
        {
            featureType: "transit.line",
            elementType: "labels.text.stroke",
            stylers: [
                {
                    color: "#ebe3cd",
                },
            ],
        },
        {
            featureType: "transit.station",
            elementType: "geometry",
            stylers: [
                {
                    color: "#dfd2ae",
                },
            ],
        },
        {
            featureType: "water",
            elementType: "geometry.fill",
            stylers: [
                {
                    color: "#b9d3c2",
                },
            ],
        },
        {
            featureType: "water",
            elementType: "labels.text.fill",
            stylers: [
                {
                    color: "#92998d",
                },
            ],
        },
    ];
    useEffect(() => {
        const storedJoystickSetting = localStorage.getItem("joystickEnabled");
        setJoystickEnabled(storedJoystickSetting === "true");
        const loader = new Loader({
            apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
            version: "weekly",
        });

        loader.load().then(() => {
            const mapOptions = {
                center: initialCenter,
                zoom: initialZoom,
                minZoom: 3,
                streetViewControl: false,
                zoomControl: false,
                gestureHandling: "none",
                disableDefaultUI: true,
                scaleControl: false,
                draggable: false,
                scrollwheel: false,
                mapTypeControl: false,
                scrollwheel: false,
                clickableIcons: false,
                styles: mapStyles,
            };

            mapInstanceRef.current = new google.maps.Map(
                mapRef.current,
                mapOptions
            );
        });

        return () => {
            stopTracking();
        };
    }, []);
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

            setsTotalSteps(steps);
        } else {
            const steps = parsedRecords.reduce((sum, record) => {
                const stepCount = parseInt(record.steps);
                return isNaN(stepCount) ? sum : sum + stepCount;
            }, 0);

            setsTotalSteps(steps);
        }
    };

    useEffect(() => {
        calculateStats();
    }, []);

    const calculateDistance = (lat, lon) => {
        if (lastLat === null || lastLon === null) {
            lastLat = lat;
            lastLon = lon;
            return 0;
        }
        const R = 6371e3;
        const φ1 = (lastLat * Math.PI) / 180;
        const φ2 = (lat * Math.PI) / 180;
        const Δφ = ((lat - lastLat) * Math.PI) / 180;
        const Δλ = ((lon - lastLon) * Math.PI) / 180;
        const a =
            Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        lastLat = lat;
        lastLon = lon;
        return distance;
    };

    const calculateSteps = (meters) => {
        const stepsPerMeter = 1 / 0.762;
        return Math.round(meters * stepsPerMeter);
    };
    const handleJoystickMove = (event) => {
        if (!mapInstanceRef.current || !markerRef.current) return;

        const speed = 0.0001; // 속도 조정
        const newLat = markerRef.current.getPosition().lat() + event.y * speed;
        const newLng = markerRef.current.getPosition().lng() + event.x * speed;
        const newLatLng = new google.maps.LatLng(newLat, newLng);

        markerRef.current.setPosition(newLatLng);
        mapInstanceRef.current.panTo(newLatLng);

        pathRef.current.push(newLatLng);
        if (polylineRef.current) {
            polylineRef.current.setPath(pathRef.current);
        }

        const meters = calculateDistance(newLat, newLng);
        const steps = calculateSteps(meters);
        setTotalSteps((prevSteps) => prevSteps + steps);
        setTotalDistance((prevDistance) => prevDistance + meters);
    };

    const startTracking = () => {
        if (!mapInstanceRef.current) return;

        setIsTracking(true);
        setTotalSteps(0);
        setTotalDistance(0);
        pathRef.current = [];
        lastLat = null;
        lastLon = null;

        mapInstanceRef.current.setCenter(initialCenter);
        mapInstanceRef.current.setZoom(trackingZoom);

        if (polylineRef.current) {
            polylineRef.current.setMap(null);
        }

        polylineRef.current = new google.maps.Polyline({
            path: pathRef.current,
            geodesic: true,
            strokeColor: "#FF0000",
            strokeOpacity: 1.0,
            strokeWeight: 2,
            map: mapInstanceRef.current,
        });
        if (!joystickEnabled) {
            watchIdRef.current = navigator.geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const latLng = new google.maps.LatLng(latitude, longitude);

                    if (!markerRef.current) {
                        markerRef.current = new google.maps.Marker({
                            position: latLng,
                            map: mapInstanceRef.current,
                            icon: {
                                url: "/here.png",
                                scaledSize: new google.maps.Size(32, 32),
                            },
                        });
                    } else {
                        markerRef.current.setPosition(latLng);
                    }

                    pathRef.current.push(latLng);
                    polylineRef.current.setPath(pathRef.current);
                    mapInstanceRef.current.panTo(latLng);

                    const meters = calculateDistance(latitude, longitude);
                    const steps = calculateSteps(meters);
                    setTotalSteps((prevSteps) => prevSteps + steps);
                    setTotalDistance((prevDistance) => prevDistance + meters);
                },
                (error) => {
                    console.error("Error getting location:", error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0,
                }
            );
        } else {
            const initialLatLng = new google.maps.LatLng(
                initialCenter.lat,
                initialCenter.lng
            );
            markerRef.current = new google.maps.Marker({
                position: initialLatLng,
                map: mapInstanceRef.current,
                icon: {
                    url: "/here.png",
                    scaledSize: new google.maps.Size(32, 32),
                },
            });
        }
    };

    const stopTracking = () => {
        setIsTracking(false);
        if (watchIdRef.current) {
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
        }

        if (pathRef.current.length > 0) {
            const bounds = new google.maps.LatLngBounds();
            pathRef.current.forEach((point) => {
                bounds.extend(point);
            });

            mapInstanceRef.current.fitBounds(bounds);

            mapInstanceRef.current.setZoom(
                mapInstanceRef.current.getZoom() - 1
            );
        }
    };
    const saveToLocalStorage = async (steps, distance) => {
        const now = new Date();
        const record = {
            date: now.toLocaleDateString(),
            time: now.toLocaleTimeString(),
            steps: steps,
            distance: (distance / 1000).toFixed(2),
        };
        const user = auth.currentUser;

        if (user) {
            const userRef = doc(firestore, "users", user.uid);
            const userDoc = await getDoc(userRef);

            let currentRecords = [];

            if (userDoc.exists()) {
                const userData = userDoc.data();
                currentRecords = JSON.parse(userData.trackingRecords || "[]");
            }

            currentRecords.push(record);

            await setDoc(
                userRef,
                { trackingRecords: JSON.stringify(currentRecords) },
                { merge: true }
            );
        }
    };

    const handleStopTracking = async () => {
        stopTracking();
        toast.success(
            `${totalSteps} 보, ${(totalDistance / 1000).toFixed(
                2
            )} KM을 걸으셨습니다! \n 수고하셨습니다`,
            {
                duration: 2000,
                position: "bottom-center",
            }
        );
        await saveToLocalStorage(totalSteps, totalDistance);
        await calculateStats();
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
            <Toaster />
            <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between p-3 rounded-lg">
                    <span className="font-semibold">현재 총 걸음 수:</span>
                    <span className="text-2xl font-bold ">
                        {stotalSteps.toLocaleString()}
                    </span>
                </div>
            </div>
            <div className="text-center mb-6">
                {isTracking ? (
                    <p className="text-lg font-semibold  animate-pulse">
                        기록 중 입니다...
                    </p>
                ) : (
                    <p className="text-lg font-semibold">
                        시작 하기를 눌러 시작해보세요!
                    </p>
                )}
            </div>
            <div className="flex justify-center space-x-4 mb-6">
                <button
                    onClick={startTracking}
                    className={`px-6 py-2 rounded-full font-semibold transition-colors duration-300 ${
                        isTracking
                            ? "bg-primary-foreground text-black cursor-not-allowed"
                            : "bg-secondary-foreground text-white"
                    }`}
                    disabled={isTracking}
                >
                    시작
                </button>
                <button
                    onClick={handleStopTracking}
                    className={`px-6 py-2 rounded-full font-semibold transition-colors duration-300 ${
                        !isTracking
                            ? "bg-primary-foreground text-black cursor-not-allowed"
                            : "bg-secondary-foreground text-white "
                    }`}
                    disabled={!isTracking}
                >
                    정지
                </button>
            </div>
            <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between p-3 rounded-lg">
                    <span className="font-semibold">걸음 수:</span>
                    <span className="text-2xl font-bold ">{totalSteps}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg">
                    <span className="font-semibold">걸은 거리:</span>
                    <span className="text-2xl font-bold">
                        {(totalDistance / 1000).toFixed(2)} km
                    </span>
                </div>
            </div>

            <div
                ref={mapRef}
                className="w-full h-72 rounded-lg overflow-hidden shadow-md"
            />
            {joystickEnabled && isTracking && (
                <div className="absolute bottom-[9rem] right-8 z-10">
                    <Joystick
                        size={100}
                        baseColor="rgba(255, 255, 255, 0.7)"
                        stickColor="rgba(0,0,0,1)"
                        move={handleJoystickMove}
                    />
                </div>
            )}
        </div>
    );
}
