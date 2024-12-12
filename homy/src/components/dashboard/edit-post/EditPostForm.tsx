import React, { useEffect, useState } from "react";
import DashboardHeaderTwo from "@/layouts/headers/dashboard/DashboardHeaderTwo";
import Overview from "./Overview";
import apiInstance from "@/utils/apiInstance";
import { toast } from "react-toastify";
import UploadImage from "@/components/UploadImage";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";

interface PostData {
    id: string;
    hostelId: string;
    roomId: string;
    title: string;
    description: string;
    status: boolean;
    imageUrls: string[];
    dateAvailable: string;
    membershipServiceId: string;
}

interface UpdatePostData {
    hostelId: string;
    roomId: string;
    title: string;
    description: string;
    status: boolean;
    dateAvailable: string;
}

interface EditPostFormProps {
    postId: string;
}

const EditPostForm: React.FC<EditPostFormProps> = ({ postId }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [postData, setPostData] = useState<PostData>({
        id: '',
        hostelId: '',
        roomId: '',
        title: '',
        description: '',
        status: true,
        imageUrls: [],
        dateAvailable: '',
        membershipServiceId: ''
    });

    const [imageState, setImageState] = useState({
        selectedFiles: [] as File[],
        currentUrls: [] as string[],
        deletedUrls: [] as string[]
    });

    const fetchPostData = async () => {
        try {
            setIsLoading(true);
            const response = await apiInstance.get(`posts/${postId}`);
            if (response.status === 200) {
                const data = response.data.data;
                setPostData({
                    ...data,
                    dateAvailable: new Date(data.dateAvailable).toISOString().slice(0, 10)
                });
                setImageState(prev => ({
                    ...prev,
                    currentUrls: data.imageUrls
                }));
            }
        } catch (error: any) {
            toast.error(`Lỗi khi tải dữ liệu: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (postId) {
            fetchPostData();
        }
    }, [postId]);

    const handleDataChange = (data: Partial<PostData>) => {
        setPostData(prev => ({
            ...prev,
            ...data,
        }));
    };

    const handleImageChange = (files: File[], newUrls: string[], deletedUrls: string[]) => {
        setImageState({
            selectedFiles: files,
            currentUrls: newUrls,
            deletedUrls: deletedUrls
        });
    };

    const prepareFormData = (updateData: UpdatePostData): FormData => {
        const formData = new FormData();

        // Add basic post data
        Object.entries(updateData).forEach(([key, value]) => {
            formData.append(key, value.toString());
        });

        // Add new images
        imageState.selectedFiles.forEach(file => {
            formData.append('images', file);
        });

        // Add existing image URLs
        imageState.currentUrls
            .filter(url => !url.startsWith("blob:"))
            .forEach(url => formData.append('imageUrls', url));

        // Add deleted image URLs
        imageState.deletedUrls.forEach(url =>
            formData.append('deletedImageUrls', url)
        );

        return formData;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!postData.title || !postData.description) {
            toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
            return;
        }

        try {
            setIsLoading(true);

            const updateData: UpdatePostData = {
                hostelId: postData.hostelId,
                roomId: postData.roomId,
                title: postData.title,
                description: postData.description,
                status: postData.status,
                dateAvailable: new Date(postData.dateAvailable).toISOString()
            };

            const formData = prepareFormData(updateData);

            const response = await apiInstance.put(`posts/${postData.id}`, formData);

            if (response.status === 200) {
                toast.success('Cập nhật bài đăng thành công!');
                setTimeout(() => router.push("/dashboard/manage-post"), 2000);
            }
        } catch (error: any) {
            toast.error(`Lỗi khi cập nhật: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="dashboard-form-container">
            <DashboardHeaderTwo title="Cập nhật thông tin bài đăng"/>

            {isLoading && <Loading />}

            <Overview
                onDataChange={handleDataChange}
                postData={postData}
            />

            <div className="bg-white card-box border-20 mt-40">
                <h4 className="dash-title-three">Thêm ảnh</h4>
                <UploadImage
                    onImageUpload={handleImageChange}
                    multiple={true}
                    existingImages={postData.imageUrls}
                />
            </div>

            <form onSubmit={handleSubmit}>
                <div className="button-group d-inline-flex align-items-center mt-30">
                    <button
                        type="submit"
                        className="dash-btn-two tran3s me-3"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Đang cập nhật...' : 'Cập nhật'}
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
    );
};

export default EditPostForm;