// components/dashboard/profile/ProfileBody.tsx
import React, {useState, useEffect, useCallback} from "react";
import DashboardHeaderTwo from "@/layouts/headers/dashboard/DashboardHeaderTwo";
import Image from "next/image";
import UserAvatarSetting from "./UserAvatarSetting";
import {toast} from "react-toastify";
import {jwtDecode} from "jwt-decode";
import apiInstance from "@/utils/apiInstance";
import {User} from "@/models/user";
import Loading from "@/components/Loading";
import Link from "next/link";
import {getUserIdFromToken} from "@/utils/tokenUtils";

interface CustomJwtPayload {
    UserId: string;
}

interface ValidationErrors {
    username?: string;
    fullName?: string;
    email?: string;
    phone?: string;
}

interface JwtPayload {
    UserId: string;
    Role: string;
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

    const [errors, setErrors] = useState<ValidationErrors>({});
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [role, setRole] = useState<string | null>(null);

    const getUserIdFromToken = useCallback(() => {
        const token = window.localStorage.getItem("token");
        if (token) {
            try {
                const decodedToken: JwtPayload = jwtDecode<JwtPayload>(token);
                setRole(decodedToken.Role);
                return decodedToken.UserId;
            } catch (error) {
                console.error("Error decoding token:", error);
                return null;
            }
        }
        return null;
    }, []);

    useEffect(() => {
        getUserIdFromToken();
    });

    // Validation functions
    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phone: string): boolean => {
        // Định dạng số điện thoại Việt Nam
        const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
        return phoneRegex.test(phone);
    };

    const validateUsername = (username: string): boolean => {
        // Username ít nhất 3 ký tự, chỉ chứa chữ cái, số và dấu gạch dưới
        const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
        return usernameRegex.test(username);
    };

    const validateFullName = (fullName: string): boolean => {
        // Tên đầy đủ ít nhất 2 ký tự và không chứa ký tự đặc biệt
        const fullNameRegex = /^[a-zA-ZÀ-ỹ\s]{2,}$/;
        return fullNameRegex.test(fullName);
    };

    const validateForm = (): boolean => {
        const newErrors: ValidationErrors = {};
        let isValid = true;

        if (!profileData.username) {
            newErrors.username = "Username không được để trống";
            isValid = false;
        } else if (!validateUsername(profileData.username)) {
            newErrors.username = "Username phải có ít nhất 3 ký tự và chỉ chứa chữ cái, số hoặc dấu gạch dưới";
            isValid = false;
        }

        if (!profileData.fullName) {
            newErrors.fullName = "Tên không được để trống";
            isValid = false;
        } else if (!validateFullName(profileData.fullName)) {
            newErrors.fullName = "Tên đầy đủ không hợp lệ";
            isValid = false;
        }

        if (!profileData.email) {
            newErrors.email = "Email không được để trống";
            isValid = false;
        } else if (!validateEmail(profileData.email)) {
            newErrors.email = "Email không hợp lệ";
            isValid = false;
        }

        if (!profileData.phone) {
            newErrors.phone = "Số điện thoại không được để trống";
            isValid = false;
        } else if (!validatePhone(profileData.phone)) {
            newErrors.phone = "Số điện thoại không hợp lệ";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            try {
                const decodedToken = jwtDecode<CustomJwtPayload>(token);
                if (decodedToken.UserId) {
                    fetchUserProfile(decodedToken.UserId);
                } else {
                    toast.error("User ID not found in token", {position: "top-center"});
                }
            } catch (error) {
                toast.error("Invalid token", {position: "top-center"});
            }
        } else {
            toast.error("Token not found in localStorage", {position: "top-center"});
        }
    }, []);

    const fetchUserProfile = async (userId: string) => {
        setIsLoading(true);
        try {
            const response = await apiInstance.get(`users/${userId}`);
            if (response.status === 200 && response.data.succeeded) {
                const data = response.data.data;
                setProfileData({
                    ...data,
                    avatarUrl: data.avatarUrl
                });
            } else {
                toast.error("Failed to load user profile", {position: "top-center"});
            }
        } catch (error) {
            toast.error("Error fetching user profile", {position: "top-center"});
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setProfileData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        setErrors(prev => ({
            ...prev,
            [name]: undefined
        }));
    };

    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error("File size should not exceed 5MB", {position: "top-center"});
                return;
            }

            // Kiểm tra loại file
            if (!file.type.startsWith('image/')) {
                toast.error("Please upload an image file", {position: "top-center"});
                return;
            }

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
            setAvatarFile(file);
        }
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            toast.error("Vui lòng kiểm tra lại thông tin nhập vào", {position: "top-center"});
            return;
        }

        setIsLoading(true);
        const submissionData = new FormData();
        submissionData.append("username", profileData.username);
        submissionData.append("fullName", profileData.fullName);
        submissionData.append("email", profileData.email);
        submissionData.append("phone", profileData.phone);

        if (avatarFile) {
            submissionData.append("image", avatarFile);
        }

        try {
            const response = await apiInstance.put(`/users/UpdateUser/${profileData.id}`, submissionData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status === 200) {
                toast.success("Thông tin cá nhân đã được cập nhật thành công", {position: "top-center"});
            }
        } catch (error: any) {
            if (error.response && error.response.data) {
                const errorMessage = error.response.data.message || "Cập nhật thông tin thất bại";
                toast.error(errorMessage, {position: "top-center"});
            } else if (error.request) {
                toast.error("Không có phản hồi từ máy chủ. Vui lòng thử lại sau.", {position: "top-center"});
            } else {
                toast.error("Đã xảy ra lỗi không mong muốn.", {position: "top-center"});
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decodedToken = jwtDecode<CustomJwtPayload>(token);
                if (decodedToken.UserId) {
                    fetchUserProfile(decodedToken.UserId);
                }
            } catch (error) {
                toast.error("Error resetting form", {position: "top-center"});
            }
        }
        setErrors({});
        setAvatarFile(null);
    };

    return (
        <div className="dashboard-body">
            <div className="position-relative">
                <DashboardHeaderTwo title="Thông tin cá nhân"/>
                <h2 className="main-title d-block d-lg-none">Thông tin cá nhân</h2>

                <div className="bg-white card-box border-20">
                    <div className="user-avatar-setting d-flex align-items-center mb-30">
                        <div className="avatar-wrapper position-relative"
                             style={{width: "100px", height: "100px", borderRadius: "50%", overflow: "hidden"}}>
                            <Image
                                src={profileData.avatarUrl}
                                alt="User Avatar"
                                className="lazy-img"
                                width={100}
                                height={100}
                                style={{width: "100%", height: "100%", objectFit: "cover"}}
                            />
                            {isLoading && (
                                <div
                                    className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-light bg-opacity-50">
                                    <Loading/>
                                </div>
                            )}
                        </div>
                        <div className="upload-btn position-relative tran3s ms-4 me-3">
                            Tải ảnh lên
                            <input
                                type="file"
                                id="uploadImg"
                                name="uploadImg"
                                onChange={handleAvatarUpload}
                                accept="image/*"
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <UserAvatarSetting
                        fullName={profileData.fullName}
                        username={profileData.username}
                        email={profileData.email}
                        phone={profileData.phone}
                        onChange={handleInputChange}
                        errors={errors}
                    />

                    <div className="button-group d-inline-flex align-items-center mt-30">
                        <button
                            onClick={handleSubmit}
                            className="dash-btn-two tran3s me-3"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status"
                                          aria-hidden="true"></span>
                                    Đang lưu...
                                </>
                            ) : 'Lưu'}
                        </button>
                        <button
                            onClick={handleCancel}
                            className="dash-cancel-btn tran3s"
                            disabled={isLoading}
                        >
                            Hủy
                        </button>
                        <div className="info-text d-sm-flex align-items-center mt-5 ms-5">
                            <p className="m0">
                                <Link href="/dashboard/account-settings/password-change" passHref>
                                    <span className="btn-link">Đổi mật khẩu</span>
                                </Link>
                            </p>
                            {role === "Landlord" && (
                                <Link className="ms-5" href="/dashboard/payment-info" passHref>
                                    <span className="btn-link">Thêm thông tin thanh toán</span>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileBody;