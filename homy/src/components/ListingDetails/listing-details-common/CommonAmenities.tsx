interface Amenity {
    id: string;
    amenityName: string;
    isSelected: boolean;
}

interface CommonAmenitiesProps {
    amenities: Amenity[];
}

const CommonAmenities = ({ amenities }: CommonAmenitiesProps) => {
    return (
        <>
            <h4 className="mb-20">Amenities</h4>
            <p className="fs-20 lh-lg pb-25">Here are the amenities available for this property:</p>
            <ul className="style-none d-flex flex-wrap justify-content-between list-style-two">
                {amenities.map((amenity) => (
                    <li key={amenity.id}>
                        <span>{amenity.amenityName}</span>
                    </li>
                ))}
            </ul>
        </>
    );
}

export default CommonAmenities;