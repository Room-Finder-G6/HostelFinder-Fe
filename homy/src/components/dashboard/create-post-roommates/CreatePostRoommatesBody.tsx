"use client";
import React, { useEffect, useState } from 'react';
import DashboardHeaderTwo from "@/layouts/headers/dashboard/DashboardHeaderTwo";
import Loading from "@/components/Loading";
import { useRouter } from "next/navigation";
import { StoryRequest } from "@/models/storyRequest";
import { getUserIdFromToken } from "@/utils/tokenUtils";
import { toast } from "react-toastify";
import apiInstance from "@/utils/apiInstance";
import Overview from "@/components/dashboard/create-post-roommates/Overview";
import UploadImage from "@/components/UploadImage";

const CreatePostRoommatesBody: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
    const [provinces, setProvinces] = useState<{ value: string; text: string }[]>([]);
    const [districts, setDistricts] = useState<{ value: string; text: string }[]>([]);
    const [communes, setCommunes] = useState<{ value: string; text: string }[]>([]);
    const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
    const userId = getUserIdFromToken();

    const [storyData, setStoryData] = useState<StoryRequest>({
        userId: 0,
        title: "",
        description: "",
        monthlyRentCost: 0,
        size: 0,
        roomType: "",
        addressStory: {
            province: "",
            district: "",
            commune: "",
            detailAddress: "",
        },
        images: [],
        dateAvailable: "",
    });

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
        const province = provinces.find((p) => p.value === provinceCode);
        setSelectedProvince(provinceCode);
        setStoryData({
            ...storyData,
            addressStory: { ...storyData.addressStory, province: province?.text ?? "" },
        });
        setSelectedDistrict(null);
        setCommunes([]);
    };

    const selectDistrictHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const districtCode = e.target.value;
        const district = districts.find((d) => d.value === districtCode);
        setSelectedDistrict(districtCode);
        setStoryData({
            ...storyData,
            addressStory: { ...storyData.addressStory, district: district?.text ?? "" },
        });
    };

    const selectCommuneHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const communeCode = e.target.value;
        const commune = communes.find((c) => c.value === communeCode);
        setStoryData({
            ...storyData,
            addressStory: { ...storyData.addressStory, commune: commune?.text ?? "" },
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        console.log('Story Data before submission:', storyData); // Thêm dòng này

        if (!userId) {
            toast.error("Vui lòng đăng nhập lại.");
            setLoading(false);
            return;
        }

        // Kiểm tra chi tiết từng trường
        if (!storyData.title) {
            toast.error("Vui lòng nhập tiêu đề bài đăng.");
            setLoading(false);
            return;
        }
        if (!storyData.description) {
            toast.error("Vui lòng nhập thông tin mô tả.");
            setLoading(false);
            return;
        }
        if (!storyData.monthlyRentCost) {
            toast.error("Vui lòng nhập giá thuê hàng tháng.");
            setLoading(false);
            return;
        }
        if (!storyData.size) {
            toast.error("Vui lòng nhập diện tích.");
            setLoading(false);
            return;
        }
        if (!storyData.roomType) {
            toast.error("Vui lòng chọn loại phòng.");
            setLoading(false);
            return;
        }
        if (!storyData.dateAvailable) {
            toast.error("Vui lòng chọn ngày có thể thuê.");
            setLoading(false);
            return;
        }
        if (!storyData.addressStory.province) {
            toast.error("Vui lòng chọn tỉnh/thành phố.");
            setLoading(false);
            return;
        }
        if (!storyData.addressStory.district) {
            toast.error("Vui lòng chọn quận/huyện.");
            setLoading(false);
            return;
        }
        if (!storyData.addressStory.commune) {
            toast.error("Vui lòng chọn phường/xã.");
            setLoading(false);
            return;
        }
        if (!storyData.addressStory.detailAddress) {
            toast.error("Vui lòng nhập địa chỉ chi tiết.");
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append("userId", userId.toString());
        formData.append("title", storyData.title);
        formData.append("description", storyData.description);
        formData.append("monthlyRentCost", storyData.monthlyRentCost.toString());
        formData.append("size", storyData.size.toString());
        formData.append("roomType", storyData.roomType.toString());
        formData.append("dateAvailable", storyData.dateAvailable);

        formData.append("addressStory.province", storyData.addressStory.province);
        formData.append("addressStory.district", storyData.addressStory.district);
        formData.append("addressStory.commune", storyData.addressStory.commune);
        formData.append("addressStory.detailAddress", storyData.addressStory.detailAddress);

        for (const image of storyData.images) {
            formData.append("images", image);
        }

        console.log("formData", formData);

        try {
            const response = await apiInstance.post("story/add", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status === 200) {
                toast.success("Tạo bài đăng thành công!");
                setTimeout(() => {
                    router.push("/dashboard/manage-find-roommates");
                }, 2000);
            } else {
                toast.error("Có lỗi xảy ra, vui lòng thử lại.");
            }
        } catch (error) {
            toast.error("Có lỗi xảy ra, vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    const handleDataChange = (data: Partial<StoryRequest>) => {
        setStoryData((prev) => ({
            ...prev,
            ...data,
        }));
    };

    const handleImageUpload = (files: File[]) => {
        const MAX_FILE_SIZE = 3 * 1024 * 1024;
        const validFiles = files.filter((file) => {
            if (file.size > MAX_FILE_SIZE) {
                toast.error(`File ${file.name} vượt quá kích thước tối đa (5MB).`);
                return false;
            }
            return true;
        });

        if (validFiles.length > 0) {
            handleDataChange({ images: validFiles });
        }
    };

    return (
        <div className="dashboard-body">
            <div className="position-relative">
                <DashboardHeaderTwo title="Thêm bài tìm ở ghép"/>
                <h2 className="main-title d-block d-lg-none">Thêm bài tìm ở ghép</h2>
            </div>

            {loading && <Loading/>}

            <Overview
                onDataChange={handleDataChange}
                provinces={provinces}
                districts={districts}
                communes={communes}
                selectProvinceHandler={selectProvinceHandler}
                selectDistrictHandler={selectDistrictHandler}
                selectCommuneHandler={selectCommuneHandler}
                storyData={storyData}
            />

            <div className="bg-white card-box border-20 mt-10">
                <h4 className="dash-title-three">Hình ảnh</h4>
                <UploadImage onImageUpload={handleImageUpload} multiple={true}/>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="button-group d-inline-flex align-items-center mt-30">
                    <button type="submit" className="dash-btn-two tran3s me-3">
                        Đăng bài
                    </button>
                    <button
                        type="button"
                        className="dash-cancel-btn tran3s"
                        onClick={() => router.push("/dashboard/manage-find-roommates")}
                    >
                        Hủy
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreatePostRoommatesBody;