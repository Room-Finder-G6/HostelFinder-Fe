"use client";
import React, { useState, useEffect } from "react";
import NiceSelect from "@/ui/NiceSelect";
import apiInstance from "@/utils/apiInstance";
import { toast } from "react-toastify";
import jwtDecode from "jwt-decode";
import GoongMap from "@/components/map/GoongMap";
import { useRouter } from "next/navigation";

interface CustomJwtPayload {
    landlordId: string;
    UserId: string;
}

interface Address {
    province: string;
    district: string;
    commune: string;
    detailAddress: string;
}

interface FormData {
    landlordId: string;
    hostelName: string;
    description: string;
    address: Address;
    size: number | string;
    numberOfRooms: number | string;
    coordinates: string;
}

const AddHostelForm: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [provinces, setProvinces] = useState<{ value: string; text: string }[]>([]);
    const [districts, setDistricts] = useState<{ value: string; text: string }[]>([]);
    const [communes, setCommunes] = useState<{ value: string; text: string }[]>([]);
    const [coordinates, setCoordinates] = useState<[number, number]>([105.83991, 21.02800]);
    const router = useRouter();

    const [formData, setFormData] = useState<FormData>({
        landlordId: "",
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
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decodedToken = jwtDecode<CustomJwtPayload>(token);
                if (decodedToken.UserId) {
                    setFormData((prevData) => ({
                        ...prevData,
                        landlordId: decodedToken.UserId,
                    }));
                }
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }
    }, []);

    useEffect(() => {
        fetchProvinces();
    }, []);

    useEffect(() => {
        if (formData.address.province) {
            fetchDistricts(formData.address.province);
        }
    }, [formData.address.province]);

    useEffect(() => {
        if (formData.address.district) {
            fetchCommunes(formData.address.district);
        }
    }, [formData.address.district]);

    const fetchProvinces = async () => {
        const response = await fetch("https://open.oapi.vn/location/provinces?page=0&size=100");
        const data = await response.json();
        setProvinces(
            data.data.map((province: any) => ({
                value: province.id,
                text: province.name,
            }))
        );
    };

    const fetchDistricts = async (provinceCode: string) => {
        const response = await fetch(
            `https://open.oapi.vn/location/districts?page=0&size=100&provinceId=${provinceCode}`
        );
        const data = await response.json();
        setDistricts(
            data.data.map((district: any) => ({
                value: district.id,
                text: district.name,
            }))
        );
    };

    const fetchCommunes = async (districtCode: string) => {
        const response = await fetch(
            `https://open.oapi.vn/location/wards?page=0&size=100&districtId=${districtCode}`
        );
        const data = await response.json();
        setCommunes(
            data.data.map((ward: any) => ({
                value: ward.id,
                text: ward.name,
            }))
        );
    };

    const selectProvinceHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const provinceCode = e.target.value;
        const province = provinces.find((p) => p.value === provinceCode);
        setFormData({
            ...formData,
            address: { ...formData.address, province: province?.text ?? "" },
        });
        setDistricts([]);
        setCommunes([]);
    };

    const selectDistrictHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const districtCode = e.target.value;
        const district = districts.find((d) => d.value === districtCode);
        setFormData({
            ...formData,
            address: { ...formData.address, district: district?.text ?? "" },
        });
    };

    const selectCommuneHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const communeCode = e.target.value;
        const commune = communes.find((c) => c.value === communeCode);
        setFormData({
            ...formData,
            address: { ...formData.address, commune: commune?.text ?? "" },
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === "size" || name === "numberOfRooms") {
            setFormData({ ...formData, [name]: parseInt(value) });
        } else if (name === "detailAddress") {
            setFormData({
                ...formData,
                address: { ...formData.address, detailAddress: value },
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.address.province || !formData.address.district || !formData.address.commune) {
            toast.error("Vui lòng chọn đầy đủ tỉnh, quận, và xã/phường.", { position: "top-center" });
            return;
        }

        const updatedFormData: FormData = {
            ...formData,
            coordinates: coordinates.join(", "),
        };

        try {
            const response = await apiInstance.post("/hostels", updatedFormData);
            if (response.status === 200 || response.data.succeeded) {
                const { message } = response.data;
                toast.success(message, { position: "top-center" });
                toggleModal(); // Close the modal on success
            }
        } catch (error: any) {
            if (error.response && error.response.status === 400) {
                toast.error(error.response.data.message, { position: "top-center" });
            } else {
                toast.error("Something went wrong", { position: "top-center" });
            }
        }
    };

    const handleCancel = () => {
        router.push("/dashboard/manage-hostels");
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    return (
        <>
            <button onClick={toggleModal} className="btn btn-primary">Thêm trọ</button>
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3 className="modal-title">Thêm trọ</h3>
                        <form onSubmit={handleSubmit} className="modal-form">
                            <div className="modal-form-group">
                                <label>Tên nhà trọ*</label>
                                <input
                                    type="text"
                                    placeholder="Nhập tên phòng trọ"
                                    name="hostelName"
                                    value={formData.hostelName}
                                    onChange={handleInputChange}
                                    required
                                    className="form-control"
                                />
                            </div>
                            <div className="modal-form-group">
                                <label>Chi tiết*</label>
                                <textarea
                                    placeholder="Hãy viết miêu tả chi tiết về phòng trọ..."
                                    name="description"
                                    value={formData.description.toString()}
                                    onChange={handleInputChange}
                                    required
                                    className="form-control"
                                />
                            </div>
                            {/* Add other form fields similarly */}
                            <div className="modal-footer">
                                <button type="submit" className="btn btn-primary">Lưu</button>
                                <button type="button" className="btn btn-secondary" onClick={toggleModal}>Thoát</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default AddHostelForm;
