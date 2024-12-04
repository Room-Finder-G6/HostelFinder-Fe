import React, { useEffect, useState } from "react";
import DashboardHeaderTwo from "@/layouts/headers/dashboard/DashboardHeaderTwo";
import Overview from "./Overview";
import apiInstance from "@/utils/apiInstance";
import { toast } from "react-toastify";
import UploadImage from "@/components/UploadImage";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading"; // Import component Loading

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

    const router = useRouter();
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [deletedImageUrls, setDeletedImageUrls] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false); // State for loading

    useEffect(() => {
        const fetchPostData = async () => {
            try {
                const response = await apiInstance.get(`posts/${postId}`);
                if (response.status === 200) {
                    const data = response.data.data;
                    setPostData({
                        ...data,
                        dateAvailable: new Date(data.dateAvailable).toISOString().slice(0, 10)
                    });
                    setImageUrls(data.imageUrls);
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
        setPostData(prevData => ({
            ...prevData,
            ...data,
        }));
    };

    const handleImageUpload = (files: File[], newImageUrls: string[], deletedImageUrls: string[]) => {
        setSelectedFiles(files);
        setImageUrls(newImageUrls);
        setDeletedImageUrls(deletedImageUrls);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true); // Show loading spinner

        const updateData: UpdatePostData = {
            hostelId: postData.hostelId,
            roomId: postData.roomId,
            title: postData.title,
            description: postData.description,
            status: postData.status,
            dateAvailable: new Date(postData.dateAvailable).toISOString()
        };

        try {
            const formData = new FormData();

            Object.entries(updateData).forEach(([key, value]) => {
                formData.append(key, value.toString());
            });

            if (selectedFiles.length > 0) {
                selectedFiles.forEach(file => {
                    formData.append('images', file);
                });
            }

            if (imageUrls && imageUrls.length > 0) {
                imageUrls.forEach(url => {
                    if (!url.startsWith("blob:")) {
                        formData.append('imageUrls', url);
                    }
                });
            }

            if (deletedImageUrls && deletedImageUrls.length > 0) {
                deletedImageUrls.forEach(url => formData.append('deletedImageUrls', url));
            }

            const response = await apiInstance.put(`posts/${postData.id}`, formData);
            if (response.status === 200) {
                toast.success('Post updated successfully!', { position: "top-center" });
                router.push("/dashboard/manage-post");
            }
        } catch (error: any) {
            toast.error(`Error updating post: ${error.response?.data?.message || error.message}`, { position: "top-center" });
        } finally {
            setLoading(false); // Hide loading spinner once done
        }
    };

    return (
        <div className="dashboard-form-container">
            <DashboardHeaderTwo title="Cập nhật thông tin bài đăng"/>

            <Overview onDataChange={handleData} postData={postData} />

            {loading && <Loading />} {/* Show loading overlay if loading is true */}

            <div className="bg-white card-box border-20 mt-40">
                <h4 className="dash-title-three">Thêm ảnh</h4>
                <UploadImage
                    onImageUpload={handleImageUpload}
                    multiple={true}
                    existingImages={postData.imageUrls}
                />
            </div>

            <form onSubmit={handleSubmit}>
                <div className="button-group d-inline-flex align-items-center mt-30">
                    <button type="submit" className="dash-btn-two tran3s me-3" disabled={loading}>
                        {loading ? 'Đang cập nhật...' : 'Cập nhật'} {/* Show loading text while submitting */}
                    </button>
                    <button onClick={() => router.push("/dashboard/manage-post")} type="button" className="dash-cancel-btn tran3s">
                        Hủy
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditPostForm;
