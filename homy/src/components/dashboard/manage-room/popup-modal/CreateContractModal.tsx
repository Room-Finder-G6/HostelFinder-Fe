import React, { useState, useEffect } from "react";
import apiInstance from "@/utils/apiInstance";
import { useForm } from "react-hook-form";
import { Modal, Button, Table } from "react-bootstrap"
import { toast } from "react-toastify";
import CurrencyInput from 'react-currency-input-field';
import "./../rentralContract.css";
import { useRouter } from "next/navigation";
import { FaCogs, FaFileContract, FaUserAlt } from "react-icons/fa";
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

    const getUnitTypeText = (value: number): string => {
        switch (value) {
            case 0:
                return "None";
            case 1:
                return "Kwh";
            case 2:
                return "Khối";
            case 3:
                return "Người";
            case 4:
                return "Tháng";
            default:
                return "N/A";
        }
    };

    return (
        <Modal
            show={isOpen}
            onHide={handleClose}
            dialogClassName="modal-90w"
            contentClassName="modal-custom"
            centered
        >
            <Modal.Header closeButton className="modal-header-custom">
                <Modal.Title>
                    <div className="d-flex align-items-center">
                        <FaFileContract className="text-primary me-2 fs-4" />
                        <span className="modal-title-text" style={{color:'black'}}>Tạo Hợp Đồng</span>
                    </div>
                </Modal.Title>
            </Modal.Header>

            <form onSubmit={handleSubmit(onSubmit)}>
                <Modal.Body className="modal-body-custom">
                    {/* Loading Overlay */}
                    {isLoading && (
                        <div className="loading-overlay">
                            <div className="spinner-wrapper">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="form-sections">
                        {/* Contract Information Section */}
                        <div className="form-section">
                            <div className="section-header">
                                <FaFileContract className="section-icon" />
                                <h5 className="section-title">Thông tin hợp đồng</h5>
                            </div>

                            <div className="row g-3">
                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input
                                            type="date"
                                            {...register("startDate")}
                                            className="form-control"
                                            id="startDate"
                                            required
                                        />
                                        <label htmlFor="startDate">Ngày bắt đầu <span className="text-danger">*</span></label>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input
                                            type="date"
                                            {...register("endDate")}
                                            className="form-control"
                                            id="endDate"
                                        />
                                        <label htmlFor="endDate">Ngày kết thúc</label>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <CurrencyInput
                                            className="form-control"
                                            id="monthlyRent"
                                            placeholder=" "
                                            defaultValue={roomData?.monthlyRentCost}
                                            decimalsLimit={0}
                                            groupSeparator="."
                                            decimalSeparator=","
                                            onValueChange={(value) => {
                                                const numericValue = value ? parseInt(value.replace(/\./g, '')) : 0;
                                                setValue('monthlyRent', numericValue);
                                            }}
                                        />
                                        <label htmlFor="monthlyRent">Tiền thuê <span className="text-danger">*</span></label>
                                    </div>
                                    <small className="text-muted mt-1 d-block">
                                        Giá thuê hiện tại: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(watch('monthlyRentNow') || 0)}
                                    </small>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <CurrencyInput
                                            className="form-control"
                                            id="depositAmount"
                                            placeholder=" "
                                            defaultValue={roomData?.monthlyRentCost}
                                            decimalsLimit={0}
                                            groupSeparator="."
                                            decimalSeparator=","
                                            onValueChange={(value) => {
                                                const numericValue = value ? parseInt(value.replace(/\./g, '')) : 0;
                                                setValue('depositAmount', numericValue);
                                            }}
                                        />
                                        <label htmlFor="depositAmount">Tiền đặt cọc <span className="text-danger">*</span></label>
                                    </div>
                                    <div className="alert alert-warning mt-2 py-2 px-3 small">
                                        <i className="bi bi-exclamation-triangle me-2"></i>
                                        Số tiền cọc không được tính vào hóa đơn
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input
                                            type="number"
                                            {...register("paymentCycleDays")}
                                            className="form-control"
                                            id="paymentCycle"
                                            min="1"
                                            required
                                        />
                                        <label htmlFor="paymentCycle">Kỳ thanh toán (tháng) <span className="text-danger">*</span></label>
                                    </div>
                                </div>

                                <div className="col-12">
                                    <div className="form-floating">
                                        <textarea
                                            {...register("contractTerms")}
                                            className="form-control"
                                            id="terms"
                                            style={{ height: "100px" }}
                                        ></textarea>
                                        <label htmlFor="terms">Điều khoản hợp đồng</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tenant Information Section */}
                        <div className="form-section">
                            <div className="section-header">
                                <FaUserAlt className="section-icon" />
                                <h5 className="section-title">Thông tin người thuê</h5>
                            </div>

                            <div className="row g-3">
                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input
                                            type="text"
                                            {...register("tenant.fullName")}
                                            className="form-control"
                                            id="fullName"
                                            required
                                        />
                                        <label htmlFor="fullName">Họ tên <span className="text-danger">*</span></label>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input
                                            type="email"
                                            {...register("tenant.email")}
                                            className="form-control"
                                            id="email"
                                            required
                                        />
                                        <label htmlFor="email">Email <span className="text-danger">*</span></label>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input
                                            type="text"
                                            {...register("tenant.phone")}
                                            className="form-control"
                                            id="phone"
                                            required
                                        />
                                        <label htmlFor="phone">Số điện thoại <span className="text-danger">*</span></label>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input
                                            type="text"
                                            {...register("tenant.identityCard")}
                                            className="form-control"
                                            id="identityCard"
                                            required
                                        />
                                        <label htmlFor="identityCard">CCCD <span className="text-danger">*</span></label>
                                    </div>
                                </div>

                                {/* Image Upload Section */}
                                <div className="col-12">
                                    <div className="upload-section">
                                        <div className="row g-3">
                                            <div className="col-md-4">
                                                <div className="upload-card">
                                                    <div className="upload-header">
                                                        <i className="bi bi-person-circle"></i>
                                                        <span>Ảnh đại diện</span>
                                                    </div>
                                                    <div className="upload-content">
                                                        <input
                                                            type="file"
                                                            {...register("tenant.avatarImage")}
                                                            className="form-control"
                                                            onChange={(e) => onFileChange(e, "avatar")}
                                                        />
                                                        {previewImages.avatar && (
                                                            <div className="image-preview">
                                                                <img src={previewImages.avatar} alt="Avatar" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-md-4">
                                                <div className="upload-card">
                                                    <div className="upload-header">
                                                        <i className="bi bi-credit-card-front"></i>
                                                        <span>Mặt trước CCCD</span>
                                                    </div>
                                                    <div className="upload-content">
                                                        <input
                                                            type="file"
                                                            {...register("tenant.frontImageImage")}
                                                            className="form-control"
                                                            onChange={(e) => onFileChange(e, "frontImage")}
                                                        />
                                                        {previewImages.frontImage && (
                                                            <div className="image-preview">
                                                                <img src={previewImages.frontImage} alt="Front ID" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-md-4">
                                                <div className="upload-card">
                                                    <div className="upload-header">
                                                        <i className="bi bi-credit-card-back"></i>
                                                        <span>Mặt sau CCCD</span>
                                                    </div>
                                                    <div className="upload-content">
                                                        <input
                                                            type="file"
                                                            {...register("tenant.backImageImage")}
                                                            className="form-control"
                                                            onChange={(e) => onFileChange(e, "backImage")}
                                                        />
                                                        {previewImages.backImage && (
                                                            <div className="image-preview">
                                                                <img src={previewImages.backImage} alt="Back ID" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Services Section */}
                        <div className="form-section">
                            <div className="section-header">
                                <FaCogs className="section-icon" />
                                <h5 className="section-title">Số Liệu Dịch Vụ</h5>
                            </div>

                            <div className="table-responsive">
                                <table className="table table-hover">
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
                                        {services.map((service) => (
                                            <tr key={service.serviceId}>
                                                <td>{service.serviceName}</td>
                                                <td>
                                                    {service.unitCost
                                                        ? `${service.unitCost.toLocaleString('vi-VN')} đ`
                                                        : <span className="badge bg-success">Miễn phí</span>
                                                    }
                                                </td>
                                                <td>{service.unit ? getUnitTypeText(service.unit) : "N/A"}</td>
                                                <td>{service.previousReading}</td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        {...register(`reading_${service.serviceId}`)}
                                                        className="form-control form-control-sm"
                                                        defaultValue={service.previousReading}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </Modal.Body>

                <Modal.Footer className="modal-footer-custom">
                    <Button variant="light" onClick={handleClose} disabled={isLoading}>
                        Hủy bỏ
                    </Button>
                    <Button
                        variant="primary"
                        type="submit"
                        disabled={isLoading}
                        className="btn-with-icon"
                    >
                        {isLoading ? (
                            <>
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                <span>Đang lưu...</span>
                            </>
                        ) : (
                            <>
                                <i className="bi bi-check-lg"></i>
                                <span>Lưu hợp đồng</span>
                            </>
                        )}
                    </Button>
                </Modal.Footer>
            </form>
        </Modal>
    );
};

export default CreateContractModal;
