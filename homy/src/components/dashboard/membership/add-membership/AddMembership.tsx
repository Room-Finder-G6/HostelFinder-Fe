"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import apiInstance from "@/utils/apiInstance";
import { useRouter } from "next/navigation"; // Đổi import từ next/router sang next/navigation
import styles from "./AddMembership.module.css";
import DashboardHeaderTwo from "@/layouts/headers/dashboard/DashboardHeaderTwo";
import AdminHeaderTwo from "@/layouts/headers/admin/AdminHeaderTwo";
const AddMembership = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const [service, setService] = useState<{ serviceName: string; maxPushTopAllowed: number; maxPostsAllowed: number }>({
        serviceName: "",
        maxPushTopAllowed: 0,
        maxPostsAllowed: 0,
    });
    const router = useRouter(); // Cập nhật router từ next/navigation
    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(0, Number(e.target.value));
        setPrice(value);
    };

    const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(0, Number(e.target.value));
        setDuration(value);
    };

    // Hàm thay đổi thông tin dịch vụ
    const handleServiceChange = (
        field: 'serviceName' | 'maxPushTopAllowed' | 'maxPostsAllowed',
        value: any
    ) => {
        if (field === 'maxPushTopAllowed' || field === 'maxPostsAllowed') {
            const parsedValue = Number(value);
            if (isNaN(parsedValue) || parsedValue < 0) {
                return;
            }
        }

        setService({
            ...service,
            [field]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newMembership = {
            name,
            description,
            price,
            duration,
            membershipServices: [service], // Dịch vụ sẽ luôn có 1 phần tử
        };

        try {
            const response = await apiInstance.post("/Membership/AddMembership", newMembership);

            if (response.data.succeeded) {
                toast.success("Thêm Gói Thành Viên Thành Công!");
                router.push("/dashboard/membership"); // Chuyển hướng đến trang quản lý Membership
            } else {
                toast.error(response.data.message || "Có lỗi khi thêm gói thành viên.");
            }
        } catch (error) {
            toast.error("Có lỗi khi thêm gói thành viên.");
            console.error("Error adding membership:", error);
        }
    };

    return (



        <div className="dashboard-body">
            <div className="position-relative">
                <AdminHeaderTwo title="Thêm gói thành viên" />
                <h2 className="main-title d-block d-lg-none">Thêm gói thành viên</h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className="bg-white card-box border-20">
                        <div className="dash-input-wrapper mb-30">
                            <label htmlFor="name">Tên Gói</label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                placeholder="Nhập tên gói"
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="description">Miêu Tả</label>
                            <input
                                id="description"
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                placeholder="Nhập miêu tả"
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="price">Giá</label>
                            <input
                                id="price"
                                type="number"
                                value={price}
                                onChange={handlePriceChange}
                                required
                                placeholder="Nhập giá"
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="duration">Thời Gian</label>
                            <input
                                id="duration"
                                type="number"
                                value={duration}
                                onChange={handleDurationChange}
                                required
                                placeholder="Nhập thời gian"
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.servicesContainer}>
                            <label className={styles.servicesLabel}>Dịch Vụ</label>
                            <div className={styles.serviceItem}>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="serviceName">Tên Dịch Vụ</label>
                                    <input
                                        id="serviceName"
                                        type="text"
                                        value={service.serviceName}
                                        onChange={(e) => handleServiceChange('serviceName', e.target.value)}
                                        placeholder="Nhập tên dịch vụ"
                                        className={styles.input}
                                        required
                                    />
                                </div>

                                <div className={styles.inputGroup}>
                                    <label htmlFor="maxPushTopAllowed">Số Lượng Push Top Cho Phép</label>
                                    <input
                                        id="maxPushTopAllowed"
                                        type="number"
                                        value={service.maxPushTopAllowed}
                                        onChange={(e) => handleServiceChange('maxPushTopAllowed', e.target.value)}
                                        placeholder="Nhập số lượng"
                                        className={styles.input}
                                        required
                                    />
                                </div>

                                <div className={styles.inputGroup}>
                                    <label htmlFor="maxPostsAllowed">Số Lượng Bài Viết Cho Phép</label>
                                    <input
                                        id="maxPostsAllowed"
                                        type="number"
                                        value={service.maxPostsAllowed}
                                        onChange={(e) => handleServiceChange('maxPostsAllowed', e.target.value)}
                                        placeholder="Nhập số lượng"
                                        className={styles.input}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="button-group d-inline-flex align-items-center mt-30">
                    <button type="submit" className="dash-btn-two tran3s me-3">Thêm Gói Thành Viên</button>
                    </div>
                    </div>
                    
                </form>
            </div>
        </div>


    );
};

export default AddMembership;
