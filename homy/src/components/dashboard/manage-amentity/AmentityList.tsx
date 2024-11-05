import React, { useEffect, useState } from 'react';
import apiInstance from '@/utils/apiInstance';

interface Amenity {
  id: string;
  amenityName: string;
}

interface AmenitiesListProps {
  onAmenitySelect: (selectedAmenities: string[]) => void;
  selectedAmenities: string[];
}

const AmenitiesList: React.FC<AmenitiesListProps> = ({ onAmenitySelect, selectedAmenities }) => {
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetching data from API
    const fetchAmenities = async () => {
      try {
        const response = await apiInstance.get('/amenities');
        if (response.data.succeeded) {
          setAmenities(response.data.data);
        } else {
          setError('Failed to load amenities');
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAmenities();
  }, []);

  const handleAmenityChange = (amenityId: string) => {
    if (selectedAmenities.includes(amenityId)) {
      onAmenitySelect(selectedAmenities.filter((id) => id !== amenityId));
    } else {
      onAmenitySelect([...selectedAmenities, amenityId]);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h5>Tiện nghi</h5>
      <div className="row">
        {amenities.map((amenity) => (
          <div key={amenity.id} className="col-md-3 mb-3">
            <div className="service-checkbox d-flex align-items-center">
              <input
                type="checkbox"
                className="me-2"
                checked={selectedAmenities.includes(amenity.id)} // Sửa lỗi ở đây
                onChange={() => handleAmenityChange(amenity.id)}
              />
              <div className="service-label d-flex align-items-center">
                <img
                  style={{ maxWidth: '18px', maxHeight: '18px' }}
                  src={`/assets/images/amenity/${amenity.amenityName.toLowerCase()}.svg`}
                  alt={amenity.amenityName}
                  className="me-2"
                />
                <span>{amenity.amenityName}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AmenitiesList;
