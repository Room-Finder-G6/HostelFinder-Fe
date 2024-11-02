"use client";
import React, { useState } from "react";
import DashboardHeaderTwo from "@/layouts/headers/dashboard/DashboardHeaderTwo";
import Overview from "./Overview";
import apiInstance from "@/utils/apiInstance";
import { toast } from "react-toastify";
import UploadImage from "@/components/UploadImage";

export interface RoomData {
    hostelId: string;
    roomId: string;
    title: string;
    description: string;
    status: boolean;
    images: File[];
    dateAvailable: string;
    membershipServiceId: string;
}

const AddPropertyBody: React.FC = () => {
    const [roomData, setRoomData] = useState<RoomData>({
        hostelId: '',
        roomId: '',
        title: '',
        description: '',
        status: true,
        images: [],
        dateAvailable: new Date().toISOString(),
        membershipServiceId: ''
    });

    const handleData = (data: Partial<RoomData>) => {
        setRoomData((prevData) => ({
            ...prevData,
            ...data,
        }));
    };

    const handleImageUpload = (files: File[]) => {
        handleData({ images: files });
    };

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    const validateFileSize = (file: File): boolean => {
        if (file.size > MAX_FILE_SIZE) {
            toast.error(`File ${file.name} vượt quá kích thước cho phép (5MB)`);
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();


        for (const image of roomData.images) {
            if (!validateFileSize(image)) {
                return;
            }
        }

        const formData = new FormData();
        formData.append("hostelId", roomData.hostelId);
        formData.append("roomId", roomData.roomId);
        formData.append("title", roomData.title);
        formData.append("status", roomData.status.toString());
        formData.append("description", roomData.description);
        formData.append("dateAvailable", roomData.dateAvailable);
        formData.append("membershipServiceId", roomData.membershipServiceId);



        roomData.images.forEach((image) => {
            formData.append("images", image);
        });

        try {
            const response = await apiInstance.post("posts", formData);
            toast.success("Tạo bài đăng thành công", { position: "top-center" });
        } catch (error: any) {
            toast.error(`Có lỗi xảy ra: ${error.response?.data?.detail || error.message}`, { position: "top-center" });
        }
    };

    return (
        <div className="dashboard-body">
            <div className="position-relative">
                <DashboardHeaderTwo title="Add New Post" />
                <h2 className="main-title d-block d-lg-none">Add New Property</h2>
                <Overview onDataChange={handleData} />

                <div className="bg-white card-box border-20 mt-40">
                    <h4 className="dash-title-three">Photo</h4>
                    <UploadImage onImageUpload={handleImageUpload} multiple={true} />
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="button-group d-inline-flex align-items-center mt-30">
                        <button type="submit" className="dash-btn-two tran3s me-3">
                            Submit Property
                        </button>
                        <button type="button" className="dash-cancel-btn tran3s">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPropertyBody;
