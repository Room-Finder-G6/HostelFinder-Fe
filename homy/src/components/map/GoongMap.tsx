import React, { useEffect, useRef, useState } from 'react';

interface GoongMapProps {
    selectedLocation?: [number, number];
}

declare global {
    interface Window {
        goongjs: any;
        initMap: () => void;
    }
}

const GoongMap: React.FC<GoongMapProps> = ({ selectedLocation }) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<any>(null);
    const [marker, setMarker] = useState<any>(null);

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
        if (map && marker && selectedLocation) {
            const [lng, lat] = selectedLocation;
            if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
                // Di chuyển marker tới vị trí mới
                marker.setLngLat(selectedLocation);
                // Di chuyển bản đồ tới vị trí mới
                map.flyTo({ center: selectedLocation });
            } else {
                console.error('Invalid LngLat values:', selectedLocation);
            }
        }
    }, [map, marker, selectedLocation]);

    const initMap = () => {
        if (mapContainerRef.current && window.goongjs) {
            window.goongjs.accessToken = process.env.NEXT_PUBLIC_GOONG_MAPTILES_KEY;
            const initialCenter = selectedLocation || [105.83991, 21.02800]; // [longitude, latitude]
            const newMap = new window.goongjs.Map({
                container: mapContainerRef.current,
                style: 'https://tiles.goong.io/assets/goong_map_web.json',
                center: initialCenter,
                zoom: 12
            });

            // Tạo marker chỉ một lần khi bản đồ được khởi tạo
            const newMarker = new window.goongjs.Marker()
                .setLngLat(initialCenter)
                .addTo(newMap);

            setMarker(newMarker); // Lưu marker vào state
            setMap(newMap); // Lưu bản đồ vào state

            // Lắng nghe sự kiện di chuyển bản đồ
            newMap.on('moveend', () => {
                const center = newMap.getCenter();
                newMarker.setLngLat([center.lng, center.lat]); // Di chuyển marker theo bản đồ
            });
        }
    };

    return <div ref={mapContainerRef} style={{ width: '100%', height: '400px' }} />;
};

export default GoongMap;
