import React, { useEffect, useRef, useState } from 'react';

interface GoongMapProps {
    selectedLocation: [number, number];
    onCoordinatesChange: (coordinates: string) => void;
}

declare global {
    interface Window {
        goongjs: any;
        initMap: () => void;
    }
}

const GoongMap: React.FC<GoongMapProps> = ({ selectedLocation, onCoordinatesChange }) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<any>(null);
    const [marker, setMarker] = useState<any>(null);
    const [coordinates, setCoordinates] = useState<string>('105.83991,21.02800');

    useEffect(() => {
        if (typeof window !== 'undefined' && !window.goongjs) {
            const script = document.createElement('script');
            script.src = `https://cdn.jsdelivr.net/npm/@goongmaps/goong-js@1.0.9/dist/goong-js.js`;
            document.body.appendChild(script);

            script.onload = () => {
                const link = document.createElement('link');
                link.href = 'https://cdn.jsdelivr.net/npm/@goongmaps/goong-js@1.0.9/dist/goong-js.css';
                link.rel = 'stylesheet';
                document.head.appendChild(link);

                window.initMap = initMap;
                if (window.goongjs) {
                    initMap();
                }
            };
        } else if (window.goongjs) {
            initMap();
        }

        return () => {
            if (map) map.remove();
        };
    }, []);

    useEffect(() => {
        if (map && marker) {
            const [lng, lat] = selectedLocation;
            if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
                // Kiểm tra xem tọa độ có thay đổi không trước khi cập nhật
                if (coordinates !== `${lng},${lat}`) {
                    marker.setLngLat(selectedLocation);
                    map.flyTo({ center: selectedLocation });

                    const newCoordinates = `${lng},${lat}`;
                    setCoordinates(newCoordinates);
                    onCoordinatesChange(newCoordinates);
                }
            } else {
                console.error('Invalid LngLat values:', selectedLocation);
            }
        }
    }, [map, marker, selectedLocation]); // Chỉ phụ thuộc vào map, marker và selectedLocation

    const initMap = () => {
        if (mapContainerRef.current && window.goongjs) {
            window.goongjs.accessToken = process.env.NEXT_PUBLIC_GOONG_MAPTILES_KEY;
            const initialCenter = selectedLocation;
            const newMap = new window.goongjs.Map({
                container: mapContainerRef.current,
                style: 'https://tiles.goong.io/assets/goong_map_web.json',
                center: initialCenter,
                zoom: 12
            });

            const newMarker = new window.goongjs.Marker()
                .setLngLat(initialCenter)
                .addTo(newMap);

            setMarker(newMarker);
            setMap(newMap);

            newMap.on('moveend', () => {
                const center = newMap.getCenter();
                const newCoordinates = `${center.lng},${center.lat}`;
                newMarker.setLngLat([center.lng, center.lat]);

                // Chỉ cập nhật nếu tọa độ thay đổi
                if (coordinates !== newCoordinates) {
                    setCoordinates(newCoordinates);
                    onCoordinatesChange(newCoordinates);
                }
            });
        }
    };

    return (
        <div>
            <div ref={mapContainerRef} style={{ width: '100%', height: '400px' }} />
        </div>
    );
};

export default GoongMap;