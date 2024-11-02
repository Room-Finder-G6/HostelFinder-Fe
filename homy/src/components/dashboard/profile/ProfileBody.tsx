"use client";
import React, { useState, useEffect } from "react";
import DashboardHeaderTwo from "@/layouts/headers/dashboard/DashboardHeaderTwo";
import Image from "next/image";
import UserAvatarSetting from "./UserAvatarSetting";
import Link from "next/link";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import apiInstance from "@/utils/apiInstance";
import avatar_1 from "@/assets/images/dashboard/avatar_02.jpg";
interface CustomJwtPayload {
    UserId: string;
}

interface UserProfileData {
    userId: string;
    username: string;
    email: string;
    phone: string;
    avatarUrl: string;

}

const ProfileBody: React.FC = () => {
    const [profileData, setProfileData] = useState<UserProfileData>({
        userId: "",
        username: "",
        email: "",
        phone: "",
        avatarUrl: "",

    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        console.log("Token retrieved from localStorage:", token);

        if (token) {
            try {
                const decodedToken = jwtDecode<CustomJwtPayload>(token);
                console.log("Decoded token:", decodedToken); console.log("Decoded token:", decodedToken);

                if (decodedToken.UserId) {
                    fetchUserProfile(decodedToken.UserId);
                } else {
                    toast.error("User ID not found in token", { position: "top-center" });
                }
            } catch (error) {
                console.error("Error decoding token:", error);
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
                setProfileData({
                    userId: data.id,
                    username: data.username,
                    email: data.email,
                    phone: data.phone,
                    avatarUrl: data.avatarUrl || avatar_1,

                });
            } else {
                toast.error("Failed to load user profile", { position: "top-center" });
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
            toast.error("Error fetching user profile", { position: "top-center" });
        }
    };
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
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
        }
    };

    const handleSubmit = async () => {
        // Ensure avatarUrl is a string before submitting
        const submissionData = {
            ...profileData,
            avatarUrl: typeof profileData.avatarUrl === 'object' ? profileData.avatarUrl.src : profileData.avatarUrl,
        };
    

        try {
            console.log("Profile data being submitted:", submissionData); // Log data to be submitted
            const response = await apiInstance.put(`/users/UpdateUser/${profileData.userId}`, submissionData);
            if (response.status === 200) {
                toast.success("Profile updated successfully", { position: "top-center" });
            }
        } catch (error: any) {
            if (error.response && error.response.data) {
                console.error("Error updating profile:", error.response.data);
                toast.error("Failed to update profile", { position: "top-center" });
            } else {
                console.error("Error updating profile:", error);
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
                        <Image
                            src={profileData.avatarUrl || avatar_1.src}
                            alt="User Avatar"
                            className="lazy-img user-img"
                            width={100}
                            height={100}
                        />

                        <div className="upload-btn position-relative tran3s ms-4 me-3">
                            Upload new photo
                            <input type="file" id="uploadImg" name="uploadImg" onChange={handleAvatarUpload} />
                        </div>
                        <button className="delete-btn tran3s" onClick={() => setProfileData({ ...profileData, avatarUrl: "" })}>
                            Delete
                        </button>
                    </div>

                    <UserAvatarSetting
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
