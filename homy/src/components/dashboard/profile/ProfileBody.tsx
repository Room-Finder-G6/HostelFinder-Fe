import React, { useState, useEffect } from "react";
import DashboardHeaderTwo from "@/layouts/headers/dashboard/DashboardHeaderTwo";
import Image from "next/image";
import UserAvatarSetting from "./UserAvatarSetting";
import Link from "next/link";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import apiInstance from "@/utils/apiInstance";
import { User } from "@/models/user";
import {auto} from "@popperjs/core";

interface CustomJwtPayload {
    UserId: string;
}

interface UpdateUser {
    username: string;
    fullName: string;
    email: string;
    phone: string;
}

const ProfileBody: React.FC = () => {
    const [profileData, setProfileData] = useState<User>({
        id: "",
        username: "",
        fullName: "",
        email: "",
        phone: "",
        avatarUrl: "",
    });

    const [avatarFile, setAvatarFile] = useState<File | null>(null); // Lưu trữ file ảnh

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            try {
                const decodedToken = jwtDecode<CustomJwtPayload>(token);
                if (decodedToken.UserId) {
                    fetchUserProfile(decodedToken.UserId);
                } else {
                    toast.error("User ID not found in token", { position: "top-center" });
                }
            } catch (error) {
                toast.error("Invalid token", { position: "top-center" });
            }
        } else {
            toast.error("Token not found in localStorage", { position: "top-center" });
        }
    }, []);

    const fetchUserProfile = async (userId: string) => {
        try {
            const response = await apiInstance.get(`users/${userId}`);
            if (response.status === 200 && response.data.succeeded) {
                const data = response.data.data;
                setProfileData(data);
            } else {
                toast.error("Failed to load user profile", { position: "top-center" });
            }
        } catch (error) {
            toast.error("Error fetching user profile", { position: "top-center" });
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProfileData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.result) {
                    setProfileData((prevData) => ({
                        ...prevData,
                        avatarUrl: reader.result as string,
                    }));
                }
            };
            reader.readAsDataURL(file);
            setAvatarFile(file); // Lưu file ảnh để gửi lên server
        }
    };

    const handleSubmit = async () => {
        const submissionData = new FormData();
        submissionData.append("username", profileData.username);
        submissionData.append("fullName", profileData.fullName);
        submissionData.append("email", profileData.email);
        submissionData.append("phone", profileData.phone);

        if (avatarFile) {
            submissionData.append("image", avatarFile); // Thêm file ảnh vào FormData
        }

        try {
            const response = await apiInstance.put(`/users/UpdateUser/${profileData.id}`, submissionData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Đặt header cho multipart
                },
            });
            if (response.status === 200) {
                toast.success("Profile updated successfully", { position: "top-center" });
            }
        } catch (error: any) {
            if (error.response && error.response.data) {
                toast.error("Failed to update profile", { position: "top-center" });
            } else {
                toast.error("Failed to update profile", { position: "top-center" });
            }
        }
    };

    return (
        <div className="dashboard-body">
            <div className="position-relative">
                <DashboardHeaderTwo title="Profile" />
                <h2 className="main-title d-block d-lg-none">Profile</h2>

                <div className="bg-white card-box border-20">
                    <div className="user-avatar-setting d-flex align-items-center mb-30">
                        <div className="avatar-wrapper"
                             style={{width: "100px", height: "100px", borderRadius: "50%", overflow: "hidden"}}>
                            <Image
                                src={profileData.avatarUrl}
                                alt="User Avatar"
                                className="lazy-img"
                                width={100}
                                height={100}
                                objectFit={"cover"}
                                style={{width: "100%", height: "100%", objectFit: "cover"}}
                            />
                        </div>
                        <div className="upload-btn position-relative tran3s ms-4 me-3">
                            Upload new photo
                            <input type="file" id="uploadImg" name="uploadImg" onChange={handleAvatarUpload}
                                   accept="image/*"/>
                        </div>
                    </div>

                    <UserAvatarSetting
                        fullName={profileData.fullName}
                        username={profileData.username}
                        email={profileData.email}
                        phone={profileData.phone}
                        onChange={handleInputChange}
                    />

                    <div className="button-group d-inline-flex align-items-center mt-30">
                        <button onClick={handleSubmit} className="dash-btn-two tran3s me-3">
                            Save
                        </button>
                        <Link href="#" className="dash-cancel-btn tran3s">
                            Cancel
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileBody;