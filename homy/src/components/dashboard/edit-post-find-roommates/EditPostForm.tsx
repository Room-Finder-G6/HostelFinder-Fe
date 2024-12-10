import React, {useEffect, useState} from 'react';
import {Story} from "@/models/story";
import {useRouter} from "next/navigation";
import apiInstance from "@/utils/apiInstance";
import {toast} from "react-toastify";
import {EditStoryRequest} from "@/models/editStoryRequest";
import DashboardHeaderTwo from "@/layouts/headers/dashboard/DashboardHeaderTwo";
import Loading from "@/components/Loading";
import UploadImage from "@/components/UploadImage";
import Overview from "@/components/dashboard/edit-post-find-roommates/Overview";

interface EditPostFormProps {
    postId: string;
}

const EditPostForm: React.FC<EditPostFormProps> = ({postId}) => {
    const [postData, setPostData] = useState<Story>({
        title: '',
        monthlyRentCost: 0,
        description: '',
        size: 0,
        roomType: 0,
        dateAvailable: '',
        address: {
            province: '',
            district: '',
            commune: '',
            detailAddress: ''
        },
        images: []
    })

    const router = useRouter();
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [deletedImageUrls, setDeletedImageUrls] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchPostData = async () => {
            try {
                const response = await apiInstance.get(`story/${postId}`);
                if (response.status === 200) {
                    const data = response.data.data;
                    setPostData({
                        ...data,
                        dateAvailable: new Date(data.dateAvailable).toISOString().slice(0, 10)
                    });
                    setImageUrls(data.imageUrls);
                }
            } catch (error: any) {
                toast.error(`Error fetching post data: ${error.response?.data?.message || error.message}`, {position: "top-center"});
            }
        };

        if (postId) {
            fetchPostData();
        }
    }, [postId]);

    const handleData = (data: Partial<Story>) => {
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

        const updateData: EditStoryRequest = {
            title: postData.title,
            monthlyRentCost: postData.monthlyRentCost,
            description: postData.description,
            size: postData.size,
            roomType: String(postData.roomType),
            dateAvailable: new Date(postData.dateAvailable).toISOString(),
            address: postData.address
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

            const response = await apiInstance.put(`story/${postId}`, formData);
            if (response.status === 200) {
                toast.success('Post updated successfully!', {position: "top-center"});
                setTimeout(() => {
                    router.push("/dashboard/manage-post");
                }, 1000);
            }
        } catch (error: any) {
            toast.error(`Error updating post: ${error.response?.data?.message || error.message}`, {position: "top-center"});
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-form-container">
            <DashboardHeaderTwo title="Cập nhật thông tin bài đăng"/>

            {loading && <Loading/>}

            <Overview onDataChange={handleData} postData={postData}/>

            <div className="bg-white card-box border-20 mt-40">
                <h4 className="dash-title-three">Thêm ảnh</h4>
                <UploadImage
                    onImageUpload={handleImageUpload}
                    multiple={true}
                    existingImages={postData.images}
                />
            </div>

            <form onSubmit={handleSubmit}>
                <div className="button-group d-inline-flex align-items-center mt-30">
                    <button type="submit" className="dash-btn-two tran3s me-3" disabled={loading}>
                        {loading ? 'Đang cập nhật...' : 'Cập nhật'} {/* Show loading text while submitting */}
                    </button>
                    <button onClick={() => router.push("/dashboard/manage-find-rommates")} type="button"
                            className="dash-cancel-btn tran3s">
                        Hủy
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditPostForm;