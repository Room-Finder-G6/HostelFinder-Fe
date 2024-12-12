// components/CreateContractModal.tsx

import React, { useState, useEffect } from "react";
import apiInstance from "@/utils/apiInstance";
import { useForm } from "react-hook-form";
import { Modal, Button, Table } from "react-bootstrap"
import { toast } from "react-toastify";
import CurrencyInput from 'react-currency-input-field';
import "./../rentralContract.css";
import { useRouter } from "next/navigation";
interface CreateContractModalProps {
    isOpen: boolean;
    onClose: () => void;
    roomId: string;
    hostelId: string;
    onSuccess: () => void;
}

const CreateContractModal: React.FC<CreateContractModalProps> = ({
    isOpen,
    onClose,
    roomId,
    hostelId,
    onSuccess,
}) => {
    const { register, handleSubmit, reset, watch, formState: { errors }, setValue } = useForm();
    const [services, setServices] = useState<any[]>([]);
    const [showDetails, setShowDetails] = useState(false);
    const [previewImages, setPreviewImages] = useState<Record<string, string>>({});
    const [roomData, setRoomData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (roomId && isOpen) {
            fetchRoomData();
            fetchServiceData();
        }
    }, [roomId, isOpen]);

    // Hàm reset form và các state liên quan
    const resetForm = () => {
        reset();
        setShowDetails(false);
        setPreviewImages({});
    };

    // Hàm xử lý khi đóng modal
    const handleClose = () => {
        resetForm();
        onClose();
    };

    // Fetch dữ liệu phòng
    const fetchRoomData = async () => {
        try {
            const response = await apiInstance.get(`/rooms/${roomId}`);
            if (response.data.succeeded) {
                setRoomData(response.data.data);
                setValue('monthlyRentNow', response.data.data.monthlyRentCost);
                setValue('monthlyRent', response.data.data.monthlyRentCost);
                setValue('depositAmount', response.data.data.monthlyRentCost);
            }
        } catch (error: any) {
            toast.error(error.message, { position: "top-center" });
        }
    };

    // Fetch danh sách dịch vụ
    const fetchServiceData = async () => {
        try {
            const response = await apiInstance.get(`/meterReadings/${hostelId}/${roomId}`);
            if (response.data.succeeded) {
                setServices(response.data.data || []);
            }
        } catch (error: any) {
            console.error("Error fetching service data:", error);
            toast.error("Failed to fetch service data", { position: "top-center" });
        }
    };


    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewImages((prev) => ({ ...prev, [key]: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        const formData = new FormData();

        // Thông tin hợp đồng
        formData.append("RoomId", roomId);
        formData.append("StartDate", data.startDate);
        if (data.endDate) {
            formData.append("EndDate", data.endDate);
        } else {
            formData.append("EndDate", "");
        }
        formData.append("MonthlyRent", data.monthlyRent);
        formData.append("DepositAmount", data.depositAmount);
        formData.append("PaymentCycleDays", data.paymentCycleDays);
        formData.append("ContractTerms", data.contractTerms || "");

        // Thông tin người thuê
        formData.append("AddTenantDto.FullName", data.tenant.fullName);
        formData.append("AddTenantDto.Email", data.tenant.email);
        formData.append("AddTenantDto.Phone", data.tenant.phone);

        if (data.tenant.avatarImage?.[0]) {
            formData.append("AddTenantDto.AvatarImage", data.tenant.avatarImage[0] || null);
        }
        if (data.tenant.frontImageImage?.[0]) {
            formData.append("AddTenantDto.FrontImageImage", data.tenant.frontImageImage[0] || null);
        }
        if (data.tenant.backImageImage?.[0]) {
            formData.append("AddTenantDto.BackImageImage", data.tenant.backImageImage[0] || null);
        }

        formData.append("AddTenantDto.IdentityCardNumber", data.tenant.identityCard);

        // Các trường chi tiết tùy chọn
        if (showDetails) {
            formData.append("AddTenantDto.DateOfBirth", data.tenant.dateOfBirth || "");
            formData.append("AddTenantDto.Province", data.tenant.province || "");
            formData.append("AddTenantDto.District", data.tenant.district || "");
            formData.append("AddTenantDto.Commune", data.tenant.commune || "");
            formData.append("AddTenantDto.DetailAddress", data.tenant.detailAddress || "");
            formData.append(
                "AddTenantDto.TemporaryResidenceStatus",
                data.tenant.temporaryResidenceStatus || ""
            );
        }
        // Collect meter readings
        const meterReadings = services.map((service: any, index: number) => ({
            roomId,
            serviceId: service.serviceId,
            currentReading: data[`reading_${service.serviceId}`], // Get reading from form data
            billingMonth: new Date(data.startDate).getMonth() + 1, // Use start date month
            billingYear: new Date(data.startDate).getFullYear(), // Use start date year
        }));

        try {
            const response = await apiInstance.post(`/meterReadings/list`, meterReadings, {
                headers: { "Content-Type": "application/json" },
            });
            if (response.status === 200 && response.data.succeeded) {
            }
        } catch (error: any) {
            console.error("Error creating contract:", error.response?.data || error);
            toast.error(error.response?.data.message);
        }

        try {
            const response = await apiInstance.post(`/rental-contracts`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            if (response.status === 200 && response.data.succeeded) {
                toast.success(response.data.message);
                onSuccess();
                resetForm(); // Reset form sau khi tạo thành công
                onClose();   // Đóng modal
                router.replace(`/dashboard/manage-room?hostelId=${hostelId}`);
            }
        } catch (error: any) {
            console.error("Error creating contract:", error.response?.data || error);
            toast.error(error.response?.data.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal show={isOpen} onHide={handleClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title className="text-dark fw-bold">Tạo Hợp Đồng</Modal.Title>
            </Modal.Header>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    {isLoading && (
                        <div className="loading-overlay">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    )}
                    {/* Thông tin hợp đồng */}
                    <section className="mb-4">
                        <h5>Thông tin hợp đồng</h5>
                        <div className="mb-3">
                            <label className="form-label">Ngày bắt đầu <span style={{ color: 'red' }}>*</span></label>
                            <input
                                type="date"
                                {...register("startDate")}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Ngày kết thúc</label>
                            <input
                                type="date"
                                {...register("endDate")}
                                className="form-control"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Tiền thuê *</label>
                            <CurrencyInput
                                className="form-control"
                                id="monthlyRent"
                                name="monthlyRent"
                                placeholder="Nhập tiền thuê"
                                defaultValue={roomData?.monthlyRentCost}
                                decimalsLimit={0}
                                groupSeparator="."
                                decimalSeparator=","
                                onValueChange={(value: string | undefined) => {
                                    const numericValue = value ? parseInt(value.replace(/\./g, '').replace(/,/g, '')) : 0;
                                    setValue('monthlyRent', numericValue);
                                }}
                                onKeyDown={(e) => {
                                    // Ngăn không cho nhập dấu "-"
                                    if (e.key === '-') {
                                        e.preventDefault(); // Ngăn chặn hành động nhập
                                    }
                                }}
                                required
                            />
                            {errors.monthlyRent && (
                                <span className="text-danger">Vui lòng nhập tiền thuê</span>
                            )}
                            <small>
                                Giá thuê phòng hiện tại: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(watch('monthlyRentNow') || 0)}
                            </small>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Tiền đặt cọc <span style={{ color: 'red' }}>*</span></label>
                            <CurrencyInput
                                className="form-control"
                                id="depositAmount"
                                name="depositAmount"
                                placeholder="Nhập tiền đặt cọc"
                                defaultValue={roomData?.monthlyRentCost}
                                decimalsLimit={0}
                                groupSeparator="."
                                decimalSeparator=","
                                onValueChange={(value: string | undefined) => {
                                    const numericValue = value ? parseInt(value.replace(/\./g, '').replace(/,/g, '')) : 0;
                                    setValue('depositAmount', numericValue);
                                }}
                                onKeyDown={(e) => {
                                    // Ngăn không cho nhập dấu "-"
                                    if (e.key === '-') {
                                        e.preventDefault(); // Ngăn chặn hành động nhập
                                    }
                                }}
                                required
                            />
                            <div className="alert alert-warning mt-2" role="alert">
                                Chú ý: Đây là số tiền cọc ở phòng trọ và sẽ không được tính vào hóa đơn.
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Kỳ thanh toán (tháng)<span style={{ color: 'red' }}>*</span></label>
                            <input
                                type="number"
                                {...register("paymentCycleDays")}
                                className="form-control"
                                required
                                min="1"
                                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                    // Ngăn không cho nhập dấu "-"
                                    if (e.key === '-') {
                                        e.preventDefault(); // Ngăn chặn hành động nhập
                                    }
                                }}
                            />
                        </div>


                        <div className="mb-3">
                            <label className="form-label">Điều khoản hợp đồng</label>
                            <textarea
                                {...register("contractTerms")}
                                className="form-control"
                            ></textarea>
                        </div>
                    </section>
                    {/* Thông tin người thuê */}
                    <section className="mb-4">
                        <h5>Thông tin người thuê</h5>
                        <div className="mb-3">
                            <label className="form-label">Họ tên <span style={{ color: 'red' }}>*</span></label>
                            <input
                                type="text"
                                {...register("tenant.fullName")}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Email <span style={{ color: 'red' }}>*</span></label>
                            <input
                                type="email"
                                {...register("tenant.email")}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Số điện thoại <span style={{ color: 'red' }}>*</span></label>
                            <input
                                type="text"
                                {...register("tenant.phone")}
                                className="form-control"
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Ảnh đại diện</label>
                            <input
                                type="file"
                                {...register("tenant.avatarImage")}
                                className="form-control"
                                onChange={(e) => onFileChange(e, "avatar")}
                            />
                            {previewImages.avatar && (
                                <img
                                    src={previewImages.avatar}
                                    alt="Avatar preview"
                                    className="img-thumbnail mt-2"
                                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                />
                            )}
                        </div>
                        <div className="mb-3">
                            <label className="form-label">CCCD <span style={{ color: 'red' }}>*</span></label>
                            <input
                                type="text"
                                {...register("tenant.identityCard")}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Mặt trước CCCD</label>
                            <input
                                type="file"
                                {...register("tenant.frontImageImage")}
                                className="form-control"
                                onChange={(e) => onFileChange(e, "frontImage")}
                            />
                            {previewImages.frontImage && (
                                <img
                                    src={previewImages.frontImage}
                                    alt="Front image preview"
                                    className="img-thumbnail mt-2"
                                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                />
                            )}
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Mặt sau CCCD</label>
                            <input
                                type="file"
                                {...register("tenant.backImageImage")}
                                className="form-control"
                                onChange={(e) => onFileChange(e, "backImage")}
                            />
                            {previewImages.backImage && (
                                <img
                                    src={previewImages.backImage}
                                    alt="Back image preview"
                                    className="img-thumbnail mt-2"
                                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                />
                            )}
                        </div>
                    </section>


                    {/* Dịch vụ */}
                    <section className="mb-4">
                        <h5>Số Liệu Dịch Vụ</h5>
                        <Table bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>Tên Dịch Vụ</th>
                                    <th>Giá Đơn Vị</th>
                                    <th>Đơn Vị</th>
                                    <th>Chỉ Số Cũ</th>
                                    <th>Nhập Số Liệu</th>
                                </tr>
                            </thead>
                            <tbody>
                                {services.map((service: any) => (
                                    <tr key={service.serviceId}>
                                        <td>{service.serviceName}</td>
                                        <td>{service.unitCost ? `${service.unitCost.toLocaleString('vi-VN')} đ` : "Miễn phí"}</td>
                                        <td>{service.unit || "N/A"}</td>
                                        <td>{service.previousReading}</td>
                                        <td>
                                            <input
                                                type="number"
                                                {...register(`reading_${service.serviceId}`)} // Register dynamic field
                                                className="form-control"
                                                defaultValue={service.previousReading}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </section>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" type="submit" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                {' '}Đang lưu...
                            </>
                        ) : (
                            'Lưu'
                        )}
                    </Button>
                    <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
                        Thoát
                    </Button>
                </Modal.Footer>
            </form>
        </Modal>
    );
};

export default CreateContractModal;
