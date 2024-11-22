"use client";
import React, { useEffect, useState } from "react";
import DashboardHeaderTwo from "@/layouts/headers/dashboard/DashboardHeaderTwo";
import Overview from "./Overview";
import apiInstance from "@/utils/apiInstance";
import { toast } from "react-toastify";
import UploadImage from "@/components/UploadImage";
import { jwtDecode } from "jwt-decode";

export interface PostData {
    hostelId: string;
    roomId: string;
    title: string;
    description: string;
    status: boolean;
    imageUrls: File[];
    dateAvailable: string;
    membershipServiceId: string;
}

interface DecodedToken {
    UserId: string;
}

interface EditPostFormProps {
    postId: string;
}

const EditPostForm: React.FC<EditPostFormProps> = ({ postId }) => {

    const [postData, setPostData] = useState<PostData>({
        hostelId: '',
        roomId: '',
        title: '',
        description: '',
        status: true,
        imageUrls: [],
        dateAvailable: '',
        membershipServiceId: ''
    });

    useEffect(() => {
        const fetchPostData = async () => {
            try {
                const response = await apiInstance.get(`posts/${postId}`);
                if (response.status === 200) {
                    setPostData(response.data.data);
                }
            } catch (error: any) {
                toast.error(`Error fetching post data: ${error.response?.data?.message || error.message}`, { position: "top-center" });
            }
        };

        if (postId) {
            fetchPostData();
        }
    }, [postId]);

    const handleData = (data: Partial<PostData>) => {
        setPostData((prevData) => ({
            ...prevData,
            ...data,
        }));
    };

    const handleImageUpload = (files: File[]) => {
        handleData({ imageUrls: files });
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

        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Token không tìm thấy", { position: "top-center" });
            return;
        }

        let userId = "";
        try {
            const decodedToken: DecodedToken = jwtDecode(token);
            userId = decodedToken.UserId;
            if (!userId) {
                toast.error("Không tìm thấy User ID trong token", { position: "top-center" });
                return;
            }
        } catch (error) {
            toast.error("Token không hợp lệ", { position: "top-center" });
            return;
        }

        for (const image of postData.imageUrls) {
            if (!validateFileSize(image)) {
                return;
            }
        }

        const formData = new FormData();
        formData.append("hostelId", postData.hostelId);
        formData.append("roomId", postData.roomId);
        formData.append("title", postData.title);
        formData.append("status", postData.status ? "true" : "false");
        formData.append("description", postData.description);
        formData.append("dateAvailable", postData.dateAvailable);

        postData.imageUrls.forEach((image) => {
            formData.append("images", image);
        });

        try {
            await apiInstance.put(`/posts/${postId}`, formData);
            toast.success("Cập nhật bài đăng thành công", { position: "top-center" });
        } catch (error: any) {
            toast.error(`Có lỗi xảy ra: ${error.response?.data?.detail || error.message}`, { position: "top-center" });
        }
    };

    return (
        <div>
            <DashboardHeaderTwo title="Chỉnh sửa bài cho thuê" />
            <h2 className="main-title d-block d-lg-none">Chỉnh sửa bài cho thuê</h2>
            <Overview onDataChange={handleData} postData={postData} />

            <div className="bg-white card-box border-20 mt-40">
                <h4 className="dash-title-three">Hình ảnh</h4>
                <UploadImage onImageUpload={handleImageUpload}
                    multiple={true}
                // existingImages={postData.imageUrls}
                />
            </div>

            <form onSubmit={handleSubmit}>
                <div className="button-group d-inline-flex align-items-center mt-30">
                    <button type="submit" className="dash-btn-two tran3s me-3">
                        Cập nhật bài
                    </button>
                    <button type="button" className="dash-cancel-btn tran3s">
                        Hủy
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditPostForm;
