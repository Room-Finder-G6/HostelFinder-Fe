"use client";
import React, { useState, useEffect } from "react";
import NiceSelect from "@/ui/NiceSelect";
import apiInstance from "@/utils/apiInstance";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import GoongMap from "@/components/map/GoongMap";
import { useRouter } from "next/navigation";
import ServicesList from "../../manage-service/ServiceList";

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
    coordinates: string
}

const AddHostelForm: React.FC = () => {
    const [provinces, setProvinces] = useState<{ value: string; text: string }[]>([]);
    const [districts, setDistricts] = useState<{ value: string; text: string }[]>([]);
    const [communes, setCommunes] = useState<{ value: string; text: string }[]>([]);
    const [coordinates, setCoordinates] = useState<[number, number]>([105.83991, 21.02800]);
    const router = useRouter();



    const handleCoordinatesChange = (newCoordinates: string) => {
        const [lng, lat] = newCoordinates.split(',').map(Number) as [number, number];
        const newCoords: [number, number] = [lng, lat];

        if (
            coordinates[0] !== newCoords[0] ||
            coordinates[1] !== newCoords[1]
        ) {
            setCoordinates(newCoords);
        }
    };


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

    const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token"); // Adjust key based on how you store the token
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
        if (selectedProvince) {
            fetchDistricts(selectedProvince);
        }
    }, [selectedProvince]);

    useEffect(() => {
        if (selectedDistrict) {
            fetchCommunes(selectedDistrict);
        }
    }, [selectedDistrict]);

    const fetchProvinces = async () => {
        const response = await fetch("https://provinces.open-api.vn/api");
        const data = await response.json();
        setProvinces(
            data.map((province: any) => ({
                value: province.code,
                text: province.name,
            }))
        );
    };


    const fetchDistricts = async (provinceCode: string) => {
        const response = await fetch(
            `https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`
        );
        const data = await response.json();
        setDistricts(
            data.districts.map((district: any) => ({
                value: district.code,
                text: district.name,
            }))
        );
    };


    const fetchCommunes = async (districtCode: string) => {
        const response = await fetch(
            `https://provinces.open-api.vn/api/d/${districtCode}?depth=2`
        );
        const data = await response.json();
        setCommunes(
            data.wards.map((ward: any) => ({
                value: ward.code,
                text: ward.name,
            }))
        );
    };


    const selectProvinceHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const provinceCode = e.target.value;
        console.log(provinceCode)
        const province = provinces.find((p) => p.value === provinceCode);
        console.log(province);
        console.log(province?.text);
        setSelectedProvince(provinceCode);
        setFormData({
            ...formData,
            address: { ...formData.address, province: province?.text ?? "" },
        });
        setSelectedDistrict(null);
        setCommunes([]);
    };

    const selectDistrictHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const districtCode = e.target.value;
        const district = districts.find((d) => d.value === districtCode);
        setSelectedDistrict(districtCode);
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
            coordinates: coordinates.join(', '), // Chuyển đổi tọa độ thành chuỗi
        };

        try {
            const response = await apiInstance.post("/hostels", updatedFormData);
            if (response.status === 200 || response.data.succeeded) {
                const { message } = response.data;
                toast.success(message, { position: "top-center" });
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
        router.push('/dashboard/manage-hostels');
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="bg-white card-box border-20">
                <div className="dash-input-wrapper mb-30">
                    <label htmlFor="">Tên nhà trọ*</label>
                    <input
                        type="text"
                        placeholder="Nhập tên phòng trọ"
                        name="hostelName"
                        value={formData.hostelName}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="dash-input-wrapper mb-30">
                    <label htmlFor="">Chi tiết*</label>
                    <textarea
                        className="size-lg"
                        placeholder="Hãy viết miêu tả chi tiết về phòng trọ..."
                        name="description"
                        value={formData.description.toString()}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="row align-items-end">
                    <div className="col-md-6">
                        <div className="dash-input-wrapper mb-30">
                            <label htmlFor="">Diện tích*</label>
                            <input
                                type="number"
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
                            <label htmlFor="">Số lượng phòng*</label>
                            <input
                                type="number"
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
                            <label htmlFor="">Tỉnh/Thành phố*</label>
                            <NiceSelect
                                className="nice-select"
                                options={provinces}
                                onChange={selectProvinceHandler}
                                placeholder="Chọn Tỉnh/Thành phố"
                                name={"province"}
                                defaultCurrent={0}
                                required
                            />
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="dash-input-wrapper mb-30">
                            <label htmlFor="">Quận/Huyện*</label>
                            <NiceSelect
                                className="nice-select"
                                options={districts}
                                onChange={selectDistrictHandler}
                                placeholder="Chọn Quận/Huyện"
                                disabled={!selectedProvince}
                                name={"district"}
                                defaultCurrent={0}
                                required
                            />
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="dash-input-wrapper mb-30">
                            <label htmlFor="">Xã/Phường*</label>
                            <NiceSelect
                                className="nice-select"
                                options={communes}
                                onChange={selectCommuneHandler}
                                placeholder="Chọn Xã/Phường"
                                disabled={!selectedDistrict}
                                name={"commune"}
                                defaultCurrent={0}
                            />
                        </div>
                    </div>

                    <div className="col-md-12">
                        <div className="dash-input-wrapper mb-30">
                            <label htmlFor="">Địa chỉ cụ thể*</label>
                            <input
                                type="text"
                                placeholder="Địa chỉ cụ thể"
                                name="detailAddress"
                                value={formData.address.detailAddress}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="map-frame mb-10">
                        <div className="dash-input-wrapper mb-30">
                            <label htmlFor="">Tọa độ</label>
                            <input
                                className={'w-25'}
                                type="text"
                                readOnly
                                name="coordinates"
                                value={coordinates.join(', ')}
                                onChange={handleInputChange}
                            />
                        </div>
                        <GoongMap selectedLocation={coordinates} onCoordinatesChange={handleCoordinatesChange} />
                        <ServicesList />
                    </div>

                </div>
                <div className="button-group d-inline-flex align-items-center mt-30">
                    <button type="submit" className="dash-btn-two tran3s me-3">
                        Lưu
                    </button>
                    <button className="dash-cancel-btn tran3s" type="button" onClick={handleCancel}>
                        Thoát
                    </button>
                </div>
            </div>
        </form>
    );
};

export default AddHostelForm;
