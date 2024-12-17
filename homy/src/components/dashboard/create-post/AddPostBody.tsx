"use client";
import React, {useEffect, useState} from "react";
import DashboardHeaderTwo from "@/layouts/headers/dashboard/DashboardHeaderTwo";
import Overview from "./Overview";
import apiInstance from "@/utils/apiInstance";
import {toast} from "react-toastify";
import UploadImage from "@/components/UploadImage";
import {getUserIdFromToken} from "@/utils/tokenUtils";
import Loading from "@/components/Loading";
import {useRouter} from "next/navigation";

export interface PostData {
    hostelId: string;
    roomId: string;
    title: string;
    description: string;
    status: boolean;
    images: File[];
    dateAvailable: string;
    membershipServiceId: string;
}

const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB

const AddPostBody: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [userId, setUserId] = useState<string | null>(null);
    const router = useRouter();

    const [postData, setPostData] = useState<PostData>({
        hostelId: "",
        roomId: "",
        title: "",
        description: "",
        status: true,
        images: [],
        dateAvailable: new Date().toISOString(),
        membershipServiceId: "",
    });

    const handleDataChange = (data: Partial<PostData>) => {
        setPostData((prev) => ({
            ...prev,
            ...data,
        }));
    };

    const handleImageUpload = (files: File[]) => {
        const validFiles = files.filter((file) => {
            if (file.size > MAX_FILE_SIZE) {
                toast.error(`File ${file.name} vượt quá kích thước tối đa (5MB).`);
                return false;
            }
            return true;
        });

        if (validFiles.length > 0) {
            handleDataChange({images: validFiles});
        }
    };

    const validateForm = (): boolean => {
        if (!postData.hostelId) {
            toast.error("Vui lòng chọn nhà trọ.");
            return false;
        }
        if (!postData.roomId) {
            toast.error("Vui lòng chọn phòng.");
            return false;
        }
        if (!postData.title) {
            toast.error("Tiêu đề bài đăng không được để trống.");
            return false;
        }
        if (postData.images.length === 0) {
            toast.error("Vui lòng tải lên ít nhất một hình ảnh.");
            return false;
        }
        return true;
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            const fetchedUserId = getUserIdFromToken();
            if (fetchedUserId) {
                setUserId(fetchedUserId);
            } else {
                console.error("UserId không tồn tại hoặc không hợp lệ.");
            }
        }
    }, []);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true)

        if (!validateForm()) {
            setLoading(false)
            return;
        }

        if (!userId) {
            toast.error("Vui lòng đăng nhập lại.");
            return;
        }

        const formData = new FormData();
        formData.append("hostelId", postData.hostelId);
        formData.append("roomId", postData.roomId);
        formData.append("title", postData.title);
        formData.append("description", postData.description);
        formData.append("status", postData.status.toString());
        formData.append("dateAvailable", postData.dateAvailable);
        formData.append("membershipServiceId", postData.membershipServiceId);

        postData.images.forEach((image) => formData.append("images", image));

        try {
            await apiInstance.post(`posts?userId=${userId}`, formData);
            toast.success("Tạo bài viết thành công!");
            setPostData({
                hostelId: "",
                roomId: "",
                title: "",
                description: "",
                status: true,
                images: [],
                dateAvailable: new Date().toISOString(),
                membershipServiceId: "",
            });
        } catch (error: any) {
            const errorMessage =
                error.response?.data.message || error.message || "Đã xảy ra lỗi không xác định.";
            toast.error(errorMessage);
        } finally {
            setLoading(false)
            setTimeout(() => {
                router.push("/dashboard/manage-post");
            }, 2000);
        }
    };


    return (
        <div className="dashboard-body">
            <div className="position-relative">
                <DashboardHeaderTwo title="Tạo bài cho thuê"/>
                <h2 className="main-title d-block d-lg-none">Thêm bài cho thuê</h2>

                {loading && <Loading/>}

                <Overview onDataChange={handleDataChange}/>

                <div className="bg-white card-box border-20 mt-10">
                    <h4 className="dash-title-three">Hình ảnh</h4>
                    <UploadImage onImageUpload={handleImageUpload} multiple={true}/>
                    <small>Tải lên file .jpg, .png</small>
                </div>

                <form onSubmit={handleSubmit}>
                <div className="button-group d-inline-flex align-items-center mt-30">
                        <button type="submit" className="dash-btn-two tran3s me-3">
                            Đăng bài
                        </button>
                        <button
                            type="button"
                            className="dash-cancel-btn tran3s"
                            onClick={() => router.push("/dashboard/manage-post")}
                        >
                            Hủy
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPostBody;
