// components/CreateContractModal.tsx

import React, { useState, useEffect } from "react";
import apiInstance from "@/utils/apiInstance";
import { useForm } from "react-hook-form";
import { Modal, Button, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import CurrencyInput from 'react-currency-input-field';
import "./../rentralContract.css";
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
    const [services, setServices] = useState([]);
    const [showDetails, setShowDetails] = useState(false);
    const [previewImages, setPreviewImages] = useState<Record<string, string>>({});
    const [roomData, setRoomData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (roomId && isOpen) {
            fetchRoomData();
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
    useEffect(() => {
        if (hostelId) {
            apiInstance
                .get(`/ServiceCost/hostels?hostelId=${hostelId}`)
                .then((response) => {
                    setServices(response.data.data || []);
                })
                .catch((error) => {
                    console.error("Error fetching services:", error);
                });
        }
    }, [hostelId]);

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
        formData.append("EndDate", data.endDate);
        formData.append("MonthlyRent", data.monthlyRent);
        formData.append("DepositAmount", data.depositAmount);
        formData.append("PaymentCycleDays", data.paymentCycleDays);
        formData.append("ContractTerms", data.contractTerms || "");

        // Thông tin người thuê
        formData.append("AddTenantDto.FullName", data.tenant.fullName);
        formData.append("AddTenantDto.Email", data.tenant.email);
        formData.append("AddTenantDto.Phone", data.tenant.phone);

        if (data.tenant.avatarImage?.[0]) {
            formData.append("AddTenantDto.AvatarImage", data.tenant.avatarImage[0]);
        }
        if (data.tenant.frontImageImage?.[0]) {
            formData.append("AddTenantDto.FrontImageImage", data.tenant.frontImageImage[0]);
        }
        if (data.tenant.backImageImage?.[0]) {
            formData.append("AddTenantDto.BackImageImage", data.tenant.backImageImage[0]);
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

        // Ghi số liệu dịch vụ
        data.services.forEach((service: any, index: number) => {
            formData.append(
                `AddMeterReadingServiceDto[${index}].ServiceId`,
                service.serviceId
            );
            formData.append(
                `AddMeterReadingServiceDto[${index}].Reading`,
                service.reading
            );
        });

        try {
            const response = await apiInstance.post(`/rental-contracts`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            if (response.status === 200 && response.data.succeeded) {
                toast.success(response.data.message);
                onSuccess();
                resetForm(); // Reset form sau khi tạo thành công
                onClose();   // Đóng modal
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
                <Modal.Title>Tạo Hợp Đồng</Modal.Title>
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
                            <label className="form-label">Ngày bắt đầu *</label>
                            <input
                                type="date"
                                {...register("startDate")}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Ngày kết thúc *</label>
                            <input
                                type="date"
                                {...register("endDate")}
                                className="form-control"
                                required
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
                                onValueChange={(value) => setValue('monthlyRent', value)}
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
                                onValueChange={(value) => setValue('depositAmount', value)}
                                required
                            />
                            <div className="alert alert-warning mt-2" role="alert">
                                Chú ý: Đây là số tiền cọc ở phòng trọ và sẽ không được tính vào hóa đơn.
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Kỳ thanh toán (ngày) *</label>
                            <input
                                type="number"
                                {...register("paymentCycleDays")}
                                className="form-control"
                                required
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
                            <label className="form-label">Họ tên *</label>
                            <input
                                type="text"
                                {...register("tenant.fullName")}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Email *</label>
                            <input
                                type="email"
                                {...register("tenant.email")}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Số điện thoại *</label>
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
                            <label className="form-label">CCCD *</label>
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
                    {/* Nút hiển thị trường chi tiết */}
                    <Button
                        variant="link"
                        onClick={() => setShowDetails(!showDetails)}
                        className="mb-3"
                    >
                        {showDetails ? "Ẩn thông tin chi tiết" : "Thêm thông tin chi tiết"}
                    </Button>

                    {showDetails && (
                        <section className="mb-4">
                            <div className="mb-3">
                                <label className="form-label">Ngày sinh</label>
                                <input
                                    type="date"
                                    {...register("tenant.dateOfBirth")}
                                    className="form-control"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Tỉnh/Thành</label>
                                <input
                                    type="text"
                                    {...register("tenant.province")}
                                    className="form-control"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Quận/Huyện</label>
                                <input
                                    type="text"
                                    {...register("tenant.district")}
                                    className="form-control"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Phường/Xã</label>
                                <input
                                    type="text"
                                    {...register("tenant.commune")}
                                    className="form-control"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Địa chỉ chi tiết</label>
                                <textarea
                                    {...register("tenant.detailAddress")}
                                    className="form-control"
                                ></textarea>
                            </div>
                        </section>
                    )}

                    {/* Dịch vụ */}
                    <section className="mb-4">
                        <h5>Số Liệu Dịch Vụ</h5>
                        <Table bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>Tên Dịch Vụ</th>
                                    <th>Giá Đơn Vị</th>
                                    <th>Đơn Vị</th>
                                    <th>Ngày Hiệu Lực</th>
                                    <th>Nhập Số Liệu</th>
                                </tr>
                            </thead>
                            <tbody>
                                {services.map((service: any, index: number) => {
                                    return (
                                        <tr key={service.serviceId}>
                                            <td>{service.serviceName}</td>
                                            <td>{service.unitCost ? `${service.unitCost} đ` : "Miễn phí"}</td>
                                            <td>{service.unit || "N/A"}</td>
                                            <td>
                                                {service.effectiveFrom
                                                    ? new Date(service.effectiveFrom).toLocaleDateString("vi-VN")
                                                    : "N/A"}
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    placeholder="Nhập số liệu"
                                                    {...register(`services.${index}.reading`)}
                                                    className="form-control"
                                                />
                                                <input
                                                    type="hidden"
                                                    defaultValue={service.serviceId}
                                                    {...register(`services.${index}.serviceId`)}
                                                />
                                            </td>
                                        </tr>
                                    );
                                })}
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
