"use client";

import React, {useState, useEffect} from "react";
import apiInstance from "@/utils/apiInstance";
import {toast} from "react-toastify";
import {useRouter} from "next/navigation";
import GoongMap from "@/components/map/GoongMap";
import Loading from "@/components/Loading";
import ServicesList from "@/components/dashboard/manage-service/ServiceList";

// Type Definitions
interface AddressDto {
    province: string;
    district: string;
    commune: string;
    detailAddress: string;
}

interface Service {
    serviceId: string;
    name: string;
}

interface HostelResponseDto {
    id: string;
    hostelName: string;
    description: string;
    address: AddressDto;
    size: number;
    numberOfRooms: number;
    coordinates: string;
    imageUrl: string;
    services: Service[];
    createdOn: string;
}

interface UpdateHostelRequestDto {
    hostelName: string;
    description: string;
    address: AddressDto;
    size: number;
    numberOfRooms: number;
    coordinates: string;
    serviceId: string[];
    image?: File|null;
}

interface FormData extends Omit<UpdateHostelRequestDto, 'serviceId'> {
    image: File | null;
    imageUrl: string;
}

interface EditHostelFormProps {
    hostelId: string;
}

const EditHostelForm: React.FC<EditHostelFormProps> = ({hostelId}) => {
    const router = useRouter();
    const [coordinates, setCoordinates] = useState<[number, number]>([105.83991, 21.02800]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [markerFix, setMarkerFix] = useState<boolean>(true);

    const [formData, setFormData] = useState<FormData>({
        hostelName: "",
        description: "",
        address: {
            province: "",
            district: "",
            commune: "",
            detailAddress: "",
        },
        size: 0,
        numberOfRooms: 0,
        coordinates: "",
        image: null,
        imageUrl: "",
    });

    // Handlers
    const handleServiceSelect = (serviceIds: string[]): void => {
        setSelectedServices(serviceIds);
    };

    const handleCoordinatesChange = (newCoordinates: string): void => {
        const [lng, lat] = newCoordinates.split(',').map(Number) as [number, number];
        setCoordinates([lng, lat]);
        setFormData(prev => ({
            ...prev,
            coordinates: `${lng},${lat}`
        }));
    };

    // Fetch hostel data
    useEffect(() => {
        const fetchHostelData = async (): Promise<void> => {
            try {
                const response = await apiInstance.get<{ data: HostelResponseDto }>(`/hostels/${hostelId}`);
                const hostelData = response.data.data;

                const coordArray = hostelData.coordinates.split(',').map(Number) as [number, number];
                setCoordinates(coordArray);

                const serviceIds = hostelData.services?.map(service => service.serviceId) || [];
                setSelectedServices(serviceIds);

                setFormData({
                    hostelName: hostelData.hostelName,
                    description: hostelData.description,
                    address: hostelData.address,
                    size: hostelData.size,
                    numberOfRooms: hostelData.numberOfRooms,
                    coordinates: hostelData.coordinates,
                    imageUrl: hostelData.imageUrl,
                    image: null
                });

                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching hostel data:", error);
                toast.error("Có lỗi khi tải thông tin nhà trọ", {position: "top-center"});
                setIsLoading(false);
            }
        };

        if (hostelId) {
            fetchHostelData();
        }
    }, [hostelId]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ): void => {
        const {name, value} = e.target;

        if (name === "size" || name === "numberOfRooms") {
            const numValue = parseInt(value) || 0;
            setFormData(prev => ({...prev, [name]: numValue}));
        } else if (name === "detailAddress") {
            setFormData(prev => ({
                ...prev,
                address: {...prev.address, detailAddress: value},
            }));
        } else if (name === "province" || name === "district" || name === "commune") {
            setFormData(prev => ({
                ...prev,
                address: {...prev.address, [name]: value},
            }));
        } else {
            setFormData(prev => ({...prev, [name]: value}));
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setFormData(prev => ({...prev, image: file, imageUrl}));
        }
    };

    const handleRemoveImage = (): void => {
        setFormData(prev => ({...prev, image: null, imageUrl: ""}));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        if (!formData.address.province || !formData.address.district || !formData.address.commune) {
            toast.error("Vui lòng đầy đủ tỉnh, quận, và xã/phường.", {position: "top-center"});
            return;
        }

        const updateDto: UpdateHostelRequestDto = {
            hostelName: formData.hostelName,
            description: formData.description,
            address: formData.address,
            size: Number(formData.size),
            numberOfRooms: Number(formData.numberOfRooms),
            coordinates: coordinates.join(","),
            serviceId: selectedServices,
            image: formData.image,
        };

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('HostelName', updateDto.hostelName);
            formDataToSend.append('Description', updateDto.description);
            formDataToSend.append('Address.Province', updateDto.address.province);
            formDataToSend.append('Address.District', updateDto.address.district);
            formDataToSend.append('Address.Commune', updateDto.address.commune);
            formDataToSend.append('Address.DetailAddress', updateDto.address.detailAddress);
            formDataToSend.append('Size', updateDto.size.toString());
            formDataToSend.append('NumberOfRooms', updateDto.numberOfRooms.toString());
            formDataToSend.append('Coordinates', updateDto.coordinates);
            updateDto.serviceId.forEach(serviceId => {
                formDataToSend.append('ServiceId', serviceId);
            });
            if (formData.image) {
                formDataToSend.append('image', formData.image);
            }

            await apiInstance.put(`/hostels/${hostelId}`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success("Cập nhật nhà trọ thành công", {position: "top-center"});
            setTimeout(() => {
                router.push("/dashboard/manage-hostels");
            }, 2000);
        } catch (error: any) {
            if (error.response?.data?.message) {
                toast.error(error.response.data.message, {position: "top-center"});
            } else {
                toast.error("Đã xảy ra lỗi khi cập nhật", {position: "top-center"});
            }
        }
    };

    const handleToggleMarkerDrag = (e: React.MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault(); // Prevent form submission
        setMarkerFix(prev => !prev); // Toggle the state
    };

    const handleCancel = (): void => {
        router.push("/dashboard/manage-hostels");
    };

    if (isLoading) {
        return <Loading/>;
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="bg-white card-box border-20">
                <div className="dash-input-wrapper mb-30">
                    <label htmlFor="hostelName">Tên nhà trọ*</label>
                    <input
                        type="text"
                        id="hostelName"
                        placeholder="Nhập tên phòng trọ"
                        name="hostelName"
                        value={formData.hostelName}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="dash-input-wrapper mb-30">
                    <label htmlFor="description">Chi tiết*</label>
                    <textarea
                        id="description"
                        className="size-lg"
                        placeholder="Hãy viết miêu tả chi tiết về phòng trọ..."
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="row align-items-end">
                    <div className="col-md-6">
                        <div className="dash-input-wrapper mb-30">
                            <label htmlFor="size">Diện tích*</label>
                            <input
                                type="number"
                                id="size"
                                placeholder="Diện tích phòng trọ"
                                name="size"
                                value={formData.size}
                                onChange={handleInputChange}
                                min="0"
                                required
                            />
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="dash-input-wrapper mb-30">
                            <label htmlFor="numberOfRooms">Số lượng phòng*</label>
                            <input
                                type="number"
                                id="numberOfRooms"
                                placeholder="Số lượng phòng"
                                name="numberOfRooms"
                                value={formData.numberOfRooms}
                                onChange={handleInputChange}
                                min="0"
                                required
                            />
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="dash-input-wrapper mb-30">
                            <label htmlFor="province">Tỉnh/Thành phố*</label>
                            <input
                                type="text"
                                id="province"
                                placeholder="Nhập Tỉnh/Thành phố"
                                name="province"
                                value={formData.address.province}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="dash-input-wrapper mb-30">
                            <label htmlFor="district">Quận/Huyện*</label>
                            <input
                                type="text"
                                id="district"
                                placeholder="Nhập Quận/Huyện"
                                name="district"
                                value={formData.address.district}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="dash-input-wrapper mb-30">
                            <label htmlFor="commune">Xã/Phường*</label>
                            <input
                                type="text"
                                id="commune"
                                placeholder="Nhập Xã/Phường"
                                name="commune"
                                value={formData.address.commune}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="col-md-12">
                        <div className="dash-input-wrapper mb-30">
                            <label htmlFor="detailAddress">Địa chỉ cụ thể*</label>
                            <input
                                type="text"
                                id="detailAddress"
                                placeholder="Địa chỉ cụ thể"
                                name="detailAddress"
                                value={formData.address.detailAddress}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    <ServicesList
                        onServiceSelect={handleServiceSelect}
                        initialSelectedServices={selectedServices}
                    />

                    <div className="bg-white border-20 col-md-12 mb-10">
                        <h4 className="dash-title-three">Thêm ảnh của nhà trọ</h4>
                        <div className="dash-input-wrapper mb-20">
                            <label>File Attachment*</label>
                            <div className="d-flex align-items-center mb-15">
                                {formData.imageUrl && (
                                    <div
                                        className="image-preview-wrapper position-relative me-3 mb-1"
                                        style={{width: "15%"}}
                                    >
                                        <img
                                            src={formData.imageUrl}
                                            alt="Hostel"
                                            className="image-preview"
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                            }}
                                        />
                                        <button
                                            type="button"
                                            className="remove-btn position-absolute top-0 end-0"
                                            onClick={handleRemoveImage}
                                        >
                                            <i className="bi bi-x"></i>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="dash-btn-one d-inline-block position-relative me-3">
                            <i className="bi bi-plus"></i>
                            Upload Image
                            <input
                                type="file"
                                id="uploadImage"
                                name="uploadImage"
                                onChange={handleImageChange}
                                accept="image/*"
                            />
                        </div>
                        <small>Upload file .jpg, .png</small>
                    </div>

                    <div className="map-frame mb-10">
                        <div className="dash-input-wrapper mb-10">
                            <label>Tọa độ</label>
                            <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                                <input
                                    className="w-25"
                                    type="text"
                                    readOnly
                                    name="coordinates"
                                    value={coordinates.join(", ")}
                                />
                                <button
                                    onClick={handleToggleMarkerDrag}
                                    className={`btn ${markerFix ? 'btn-danger' : 'btn-primary'}`}
                                    style={{minWidth: '120px'}}
                                >
                                    {!markerFix ? (
                                        <>
                                            <i className="bi bi-lock-fill me-2"></i>
                                            Khóa vị trí
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-unlock-fill me-2"></i>
                                            Chỉnh sửa vị trí
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                        <GoongMap
                            key={markerFix ? 'fixed' : 'draggable'}
                            selectedLocation={coordinates}
                            onCoordinatesChange={handleCoordinatesChange}
                            showSearch={true}
                            isMarkerFixed={markerFix}
                        />
                    </div>
                </div>

                <div className="button-group d-inline-flex align-items-center mt-30">
                    <button type="submit" className="dash-btn-two tran3s me-3">
                        Cập nhật
                    </button>
                    <button
                        className="dash-cancel-btn tran3s"
                        type="button"
                        onClick={handleCancel}
                    >
                        Hủy
                    </button>
                </div>
            </div>
        </form>
    );
};

export default EditHostelForm;