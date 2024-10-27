import React, {useEffect, useRef, useState, useCallback} from 'react';
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

const GOONG_MAP_URL = 'https://cdn.jsdelivr.net/npm/@goongmaps/goong-js@1.0.9/dist/goong-js.js';
const GOONG_CSS_URL = 'https://cdn.jsdelivr.net/npm/@goongmaps/goong-js@1.0.9/dist/goong-js.css';

const GoongMap: React.FC<GoongMapProps> = ({selectedLocation, onCoordinatesChange}) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<any>(null);
    const markerRef = useRef<any>(null);
    const isProgrammaticMoveRef = useRef<boolean>(false);
    const [coordinates, setCoordinates] = useState<string>(`${selectedLocation[0]},${selectedLocation[1]}`);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [suggestionSelected, setSuggestionSelected] = useState<boolean>(false); // Flag to prevent fetching after selection

    useEffect(() => {
        if (!window.goongjs) {
            loadGoongJS();
        } else {
            initMap();
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    const loadGoongJS = () => {
        const script = document.createElement('script');
        script.src = GOONG_MAP_URL;
        script.async = true;
        document.head.appendChild(script);

        const link = document.createElement('link');
        link.href = GOONG_CSS_URL;
        link.rel = 'stylesheet';
        document.head.appendChild(link);

        script.onload = initMap;
    };

    const initMap = () => {
        if (mapRef.current || !mapContainerRef.current || !window.goongjs) return;

        window.goongjs.accessToken = process.env.NEXT_PUBLIC_GOONG_MAPTILES_KEY;
        mapRef.current = new window.goongjs.Map({
            container: mapContainerRef.current,
            style: 'https://tiles.goong.io/assets/goong_map_web.json',
            center: selectedLocation,
            zoom: 12,
        });

        markerRef.current = new window.goongjs.Marker().setLngLat(selectedLocation).addTo(mapRef.current);

        mapRef.current.on('move', handleMapMoveEnd);
    };

    const handleMapMoveEnd = () => {
        const center = mapRef.current.getCenter();
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
    };

    const fetchSuggestions = useCallback(
        debounce(async (query: string) => {
            if (query.length <= 2 || suggestionSelected) return setSuggestions([]);

            try {
                const response = await fetch(
                    `https://rsapi.goong.io/Place/AutoComplete?api_key=${process.env.NEXT_PUBLIC_GOONG_API_KEY}&input=${encodeURIComponent(query)}`
                );
                const data = await response.json();
                setSuggestions(data.predictions || []);
            } catch (error) {
                console.error('Error fetching suggestions:', error);
            }
        }, 500),
        [suggestionSelected] // Dependency to re-run fetch when flag changes
    );

    useEffect(() => {
        fetchSuggestions(searchQuery);
        return () => fetchSuggestions.cancel();
    }, [searchQuery, fetchSuggestions]);

    const handleSuggestionSelect = async (suggestion: any) => {
        setSearchQuery(suggestion.description); // Keep selected location in input
        setSuggestions([]); // Clear suggestions immediately
        setSuggestionSelected(true); // Set flag to prevent further suggestions

        try {
            const response = await fetch(
                `https://rsapi.goong.io/Place/Detail?place_id=${suggestion.place_id}&api_key=${process.env.NEXT_PUBLIC_GOONG_API_KEY}`
            );
            const data = await response.json();
            const location = data?.result?.geometry?.location;

            if (location) {
                updateMap([location.lng, location.lat]);
            } else {
                console.error('Invalid data from Place Detail API:', data);
            }
        } catch (error) {
            console.error('Error fetching place details:', error);
        }
    };

    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setSuggestionSelected(false); // Reset flag so suggestions can appear again
    };

    const updateMap = (newCoordinates: [number, number]) => {
        if (!mapRef.current || !markerRef.current) return console.error('Map or marker is not initialized');

        isProgrammaticMoveRef.current = true;
        mapRef.current.flyTo({center: newCoordinates, zoom: 15});
        markerRef.current.setLngLat(newCoordinates);

        const coordinatesStr = `${newCoordinates[0]},${newCoordinates[1]}`;
        setCoordinates(coordinatesStr);
        onCoordinatesChange(coordinatesStr);
    };

    return (
        <div>
            <div className="dash-input-wrapper" style={{position: 'relative', marginBottom: '15px'}}>
                <label style={{display: 'block', marginBottom: '5px'}}>Tìm kiếm địa điểm</label>
                <input
                    className="w-50 p-2 border rounded"
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    placeholder="Search for a location..."
                    style={{width: '100%', padding: '8px', boxSizing: 'border-box'}}
                />
                {suggestions.length > 0 && (
                    <ul style={{
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
                        zIndex: 1000
                    }}>
                        {suggestions.map((suggestion) => (
                            <li key={suggestion.place_id} onClick={() => handleSuggestionSelect(suggestion)}
                                style={{padding: '8px', cursor: 'pointer'}}>
                                {suggestion.description}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div ref={mapContainerRef} style={{width: '100%', height: '400px'}}/>
        </div>
    );
};

export default GoongMap;

