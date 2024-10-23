import React, { useEffect, useState } from "react";
import apiInstance from "@/utils/apiInstance";

interface AmenityResponse {
    id: string;
    amenityName: string;
    isSelected: boolean;
}

interface SelectAmenitiesProps {
    onDataChange: (selectedAmenities: { id: string; isSelected: boolean }[]) => void;
}

const SelectAmenities: React.FC<SelectAmenitiesProps> = ({ onDataChange }) => {
    const [amenities, setAmenities] = useState<AmenityResponse[]>([]);

    useEffect(() => {
        const fetchAmenities = async () => {
            try {
                const response = await apiInstance.get("amenity/amenities");
                // Ensure response data is an array
                if (Array.isArray(response.data)) {
                    setAmenities(response.data);
                } else {
                    console.error("Unexpected response format: data is not an array", response.data);
                    setAmenities([]);
                }
            } catch (error) {
                console.error("Error fetching amenities:", error);
                setAmenities([]); // Fallback to an empty array in case of an error
            }
        };

        fetchAmenities();
    }, []);

    useEffect(() => {
        // Only call onDataChange when amenities is an array
        if (Array.isArray(amenities)) {
            onDataChange(
                amenities.map((amenity) => ({
                    id: amenity.id,
                    isSelected: amenity.isSelected,
                }))
            );
        }
    }, [amenities]);

    const handleSelect = (id: string) => {
        setAmenities((prevAmenities) =>
            prevAmenities.map((amenity) =>
                amenity.id === id ? { ...amenity, isSelected: !amenity.isSelected } : amenity
            )
        );
    };

    return (
        <div className="bg-white card-box border-20 mt-40">
            <h4 className="dash-title-three m0 pb-5">Select Amenities</h4>
            <ul className="style-none d-flex flex-wrap filter-input">
                {/* Ensure amenities is an array before mapping */}
                {Array.isArray(amenities) && amenities.length > 0 ? (
                    amenities.map((amenity) => (
                        <li key={amenity.id}>
                            <input
                                type="checkbox"
                                id={`amenity-${amenity.id}`}
                                name="Amenities"
                                value={amenity.id}
                                checked={amenity.isSelected}
                                onChange={() => handleSelect(amenity.id)}
                            />
                            <label htmlFor={`amenity-${amenity.id}`}>{amenity.amenityName}</label>
                        </li>
                    ))
                ) : (
                    <li>No amenities available</li> // Handle empty or loading state
                )}
            </ul>
        </div>
    );
};

export default SelectAmenities;
