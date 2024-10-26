import React, { useEffect, useRef, useState, useCallback } from 'react';
import debounce from 'lodash/debounce';

interface GoongMapProps {
    selectedLocation: [number, number];
    onCoordinatesChange: (coordinates: string) => void;
}

declare global {
    interface Window {
        goongjs: any;
    }
}

const GoongMap: React.FC<GoongMapProps> = ({
                                               selectedLocation,
                                               onCoordinatesChange,
                                           }) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<any>(null);
    const markerRef = useRef<any>(null);
    const isProgrammaticMoveRef = useRef<boolean>(false);
    const [coordinates, setCoordinates] = useState<string>(
        `${selectedLocation[0]},${selectedLocation[1]}`
    );
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (!window.goongjs) {
                const script = document.createElement('script');
                script.src =
                    'https://cdn.jsdelivr.net/npm/@goongmaps/goong-js@1.0.9/dist/goong-js.js';
                script.async = true;
                document.head.appendChild(script);

                const link = document.createElement('link');
                link.href =
                    'https://cdn.jsdelivr.net/npm/@goongmaps/goong-js@1.0.9/dist/goong-js.css';
                link.rel = 'stylesheet';
                document.head.appendChild(link);

                script.onload = () => {
                    initMap();
                };
            } else {
                initMap();
            }
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null; // Reset lại mapRef.current
            }
        };
    }, []);

    const initMap = () => {
        if (mapRef.current) {
            // Bản đồ đã được khởi tạo
            return;
        }

        if (mapContainerRef.current && window.goongjs) {
            window.goongjs.accessToken =
                process.env.NEXT_PUBLIC_GOONG_MAPTILES_KEY;
            const initialCenter = selectedLocation;
            const map = new window.goongjs.Map({
                container: mapContainerRef.current,
                style: 'https://tiles.goong.io/assets/goong_map_web.json',
                center: initialCenter,
                zoom: 12,
            });

            const marker = new window.goongjs.Marker()
                .setLngLat(initialCenter)
                .addTo(map);

            markerRef.current = marker;
            mapRef.current = map;

            map.on('load', () => {
                setIsMapLoaded(true);
            });

            map.on('moveend', () => {
                const center = map.getCenter();
                if (isProgrammaticMoveRef.current) {
                    isProgrammaticMoveRef.current = false;
                } else {
                    markerRef.current.setLngLat(center);
                    const newCoordinates = `${center.lng},${center.lat}`;
                    if (coordinates !== newCoordinates) {
                        setCoordinates(newCoordinates);
                        onCoordinatesChange(newCoordinates);
                    }
                }
            });
        }
    };

    // Hàm fetchSuggestions với debounce
    const fetchSuggestions = useCallback(
        debounce(async (query: string) => {
            if (query.length > 2) {
                try {
                    const response = await fetch(
                        `https://rsapi.goong.io/Place/AutoComplete?api_key=${process.env.NEXT_PUBLIC_GOONG_API_KEY}&input=${encodeURIComponent(
                            query
                        )}`
                    );
                    const data = await response.json();
                    setSuggestions(data.predictions || []);
                } catch (error) {
                    console.error('Error fetching suggestions:', error);
                }
            } else {
                setSuggestions([]);
            }
        }, 500),
        []
    );

    useEffect(() => {
        fetchSuggestions(searchQuery);

        return () => {
            fetchSuggestions.cancel();
        };
    }, [searchQuery, fetchSuggestions]);

    const handleSuggestionSelect = async (suggestion: any) => {
        setSearchQuery(suggestion.description);
        setSuggestions([]);
        try {
            const response = await fetch(
                `https://rsapi.goong.io/Place/Detail?place_id=${suggestion.place_id}&api_key=${process.env.NEXT_PUBLIC_GOONG_API_KEY}`
            );
            const data = await response.json();

            if (
                data.result &&
                data.result.geometry &&
                data.result.geometry.location
            ) {
                const location = data.result.geometry.location;
                const newCoordinates: [number, number] = [location.lng, location.lat];

                // Cập nhật bản đồ và marker
                if (mapRef.current && markerRef.current) {
                    isProgrammaticMoveRef.current = true;
                    mapRef.current.flyTo({ center: newCoordinates, zoom: 15 });
                    markerRef.current.setLngLat(newCoordinates);

                    const coordinatesStr = `${location.lng},${location.lat}`;
                    setCoordinates(coordinatesStr);
                    onCoordinatesChange(coordinatesStr);
                } else {
                    console.error('Map or marker is not initialized');
                }
            } else {
                console.error('Invalid data from Place Detail API:', data);
            }
        } catch (error) {
            console.error('Error fetching place details:', error);
        }
    };

    return (
        <div>
            {/* Thanh tìm kiếm địa điểm */}
            {isMapLoaded && (
                <div style={{ position: 'relative', marginBottom: '10px' }}>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Tìm kiếm địa điểm..."
                        style={{
                            width: '100%',
                            padding: '8px',
                            boxSizing: 'border-box',
                        }}
                    />
                    {suggestions.length > 0 && (
                        <ul
                            style={{
                                listStyleType: 'none',
                                padding: 0,
                                margin: 0,
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                right: 0,
                                backgroundColor: 'white',
                                maxHeight: '200px',
                                overflowY: 'auto',
                                border: '1px solid #ccc',
                                zIndex: 1000,
                            }}
                        >
                            {suggestions.map((suggestion) => (
                                <li
                                    key={suggestion.place_id}
                                    onClick={() => handleSuggestionSelect(suggestion)}
                                    style={{ padding: '8px', cursor: 'pointer' }}
                                >
                                    {suggestion.description}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
            {/* Bản đồ */}
            <div
                ref={mapContainerRef}
                style={{ width: '100%', height: '400px' }}
            />
        </div>
    );
};

export default GoongMap;
