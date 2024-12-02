"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import apiInstance from "@/utils/apiInstance";
import { useRouter } from "next/navigation"; // Đổi import từ next/router sang next/navigation
import styles from "./AddMembership.module.css";

const AddMembership = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const [services, setServices] = useState<{
        serviceName: string;
        maxPushTopAllowed: number;
        maxPostsAllowed: number;
    }[]>([]);
    const router = useRouter(); // Cập nhật router từ next/navigation

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(0, Number(e.target.value));
        setPrice(value);
    };

    const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(0, Number(e.target.value));
        setDuration(value);
    };

    const handleAddService = () => {
        setServices([...services, { serviceName: "", maxPushTopAllowed: 0, maxPostsAllowed: 0 }]);
    };

    const handleServiceChange = (
        index: number, 
        field: 'serviceName' | 'maxPushTopAllowed' | 'maxPostsAllowed', 
        value: any
    ) => {
        if (field === 'maxPushTopAllowed' || field === 'maxPostsAllowed') {
            const parsedValue = Number(value);
            if (isNaN(parsedValue) || parsedValue < 0) {
                return;
            }
        }
        
        const updatedServices = [...services]; 
        updatedServices[index] = {
            ...updatedServices[index],
            [field]: value,
        };
        setServices(updatedServices);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newMembership = {
            name,
            description,
            price,
            duration,
            membershipServices: services,
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
        <div className={styles.container}>
            <div className={styles.formWrapper}>
                <h2 className={styles.title}>Thêm Gói Thành Viên Mới</h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
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
                        {services.map((service, index) => (
                            <div key={index} className={styles.serviceItem}>
                                <div className={styles.inputGroup}>
                                    <label htmlFor={`serviceName_${index}`}>Tên Dịch Vụ</label>
                                    <input
                                        id={`serviceName_${index}`}
                                        type="text"
                                        value={service.serviceName}
                                        onChange={(e) => handleServiceChange(index, 'serviceName', e.target.value)}
                                        required
                                        placeholder="Nhập tên dịch vụ"
                                        className={styles.input}
                                    />
                                </div>

                                <div className={styles.inputGroup}>
                                    <label htmlFor={`maxPushTopAllowed_${index}`}>Số Push Top tối đa</label>
                                    <input
                                        id={`maxPushTopAllowed_${index}`}
                                        type="number"
                                        value={service.maxPushTopAllowed}
                                        onChange={(e) => handleServiceChange(index, 'maxPushTopAllowed', Number(e.target.value))}
                                        required
                                        placeholder="Nhập số Push Top tối đa"
                                        className={styles.input}
                                    />
                                </div>

                                <div className={styles.inputGroup}>
                                    <label htmlFor={`maxPostsAllowed_${index}`}>Số Bài Đăng tối đa</label>
                                    <input
                                        id={`maxPostsAllowed_${index}`}
                                        type="number"
                                        value={service.maxPostsAllowed}
                                        onChange={(e) => handleServiceChange(index, 'maxPostsAllowed', Number(e.target.value))}
                                        required
                                        placeholder="Nhập số bài đăng tối đa"
                                        className={styles.input}
                                    />
                                </div>
                            </div>
                        ))}

                        <button type="button" onClick={handleAddService} className={styles.addServiceBtn}>
                            Thêm Dịch Vụ
                        </button>
                    </div>

                    <button type="submit" className={styles.submitBtn}>Thêm Gói Thành Viên</button>
                </form>
            </div>
        </div>
    );
};

export default AddMembership;
