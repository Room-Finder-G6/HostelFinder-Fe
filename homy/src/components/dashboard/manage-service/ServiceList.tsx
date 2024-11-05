// React component to fetch and display list of services with checkboxes from the API endpoint
import React, { useEffect, useState } from 'react';
import apiInstance from '@/utils/apiInstance';

interface Service {
    id: string;
    serviceName: string;
}

interface ServicesListProps {
    onServiceSelect: (selectedServices: string[]) => void;
}

const ServicesList: React.FC<ServicesListProps> = ({ onServiceSelect }) => {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedServices, setSelectedServices] = useState<string[]>([]);

    useEffect(() => {
        // Fetching data from API
        const fetchServices = async () => {
            try {
                const response = await apiInstance.get('/services/GetAllServices');
                console.log(response);
                if (response.data.succeeded) {
                    setServices(response.data.data);
                } else {
                    setError('Failed to load services');
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    const handleServiceChange = (serviceId: string) => {
        setSelectedServices((prevSelected) => {
            if (prevSelected.includes(serviceId)) {
                return prevSelected.filter((id) => id !== serviceId);
            } else {
                return [...prevSelected, serviceId];
            }
        });
    };

    useEffect(() => {
        if (onServiceSelect) {
            onServiceSelect(selectedServices);
        }
    }, [selectedServices, onServiceSelect]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h5>Dịch vụ</h5>
            <div className="row">
                {services.map((service) => (
                    <div key={service.id} className="col-md-3 mb-3">
                        <div className="service-checkbox d-flex align-items-center">
                            <input
                                type="checkbox"
                                className="me-2"
                                checked={selectedServices.includes(service.id)}
                                onChange={() => handleServiceChange(service.id)}
                            />
                            <div className="service-label d-flex align-items-center">
                                {/* <img src={`public/assets/images/service/${service.serviceName.toLowerCase()}.png`} alt={service.serviceName} className="me-2" /> */}
                                <img style={{ maxWidth: '18px', maxHeight: '18px' }} src={`/assets/images/service/${service.serviceName.toLowerCase()}.svg`} alt={service.serviceName} className="me-2" />
                                <span>{service.serviceName}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ServicesList;
