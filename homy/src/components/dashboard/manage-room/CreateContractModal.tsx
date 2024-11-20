import React, { useState, useEffect } from "react";
import apiInstance from "@/utils/apiInstance";
import { useForm } from "react-hook-form";
import "./rentralContract.css";
import { toast } from "react-toastify";

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
    const { register, handleSubmit, reset, setValue } = useForm();
    const [services, setServices] = useState([]);
    const [showDetails, setShowDetails] = useState(false); // Điều khiển hiển thị trường chi tiết
    const [previewImages, setPreviewImages] = useState<Record<string, string>>({});
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
        const formData = new FormData();

        // Thông tin hợp đồng
        formData.append("RoomId", roomId);
        formData.append("StartDate", data.startDate);
        formData.append("EndDate", data.endDate || "");
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
            await apiInstance.post(`/rental-contracts`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            toast("Hợp đồng tạo thành công");
            onSuccess();
            reset();
            onClose();
        } catch (error: any) {
            console.error("Error creating contract:", error.response?.data || error);
            alert("Có lỗi xảy ra khi tạo hợp đồng");
        }
    };

    return isOpen ? (
        <div className="modal-overlay">
            <div className="modal-content">
                <button
                    type="button"
                    className="close-button"
                    onClick={onClose}
                >
                    &times;
                </button>
                <h1 className="modal-title">Tạo Hợp Đồng</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="modal-form">
                    {/* Thông tin hợp đồng */}
                    <section className="section mb-5">
                        <h2 className="text-lg font-semibold">Thông tin hợp đồng</h2>
                        <div className="modal-form-group">
                            <label>Ngày bắt đầu *</label>
                            <input
                                type="date"
                                {...register("startDate")}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="modal-form-group">
                            <label>Tiền thuê *</label>
                            <input
                                type="number"
                                {...register("monthlyRent")}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="modal-form-group">
                            <label>Tiền đặt cọc *</label>
                            <input
                                type="number"
                                {...register("depositAmount")}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="modal-form-group">
                            <label>Kỳ thanh toán (ngày) *</label>
                            <input
                                type="number"
                                {...register("paymentCycleDays")}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="modal-form-group">
                            <label>Điều khoản hợp đồng</label>
                            <textarea
                                {...register("contractTerms")}
                                className="form-control"
                            ></textarea>
                        </div>
                    </section>
                    {/* Thông tin người thuê */}
                    <section className="section mb-5">
                        <h3 className="text-lg font-semibold">Thông tin người thuê</h3>
                        <div className="modal-form-group">
                            <label>Họ tên *</label>
                            <input
                                type="text"
                                {...register("tenant.fullName")}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="modal-form-group">
                            <label>Email <span className="text-red-500" style={{ color: 'red' }}>*</span></label>
                            <input
                                type="email"
                                {...register("tenant.email")}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="modal-form-group">
                            <label>Số điện thoại *</label>
                            <input
                                type="text"
                                {...register("tenant.phone")}
                                className="form-control"
                                required
                            />
                        </div>

                        <div className="modal-form-group">
                            <label>Ảnh đại diện</label>
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
                                    className="preview-image"
                                />
                            )}
                        </div>
                        <div className="modal-form-group">
                            <label>CCCD *</label>
                            <input
                                type="text"
                                {...register("tenant.IdentityCardNumber")}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="modal-form-group">
                            <label>Mặt trước CCCD</label>
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
                                    className="preview-image"
                                />
                            )}
                        </div>

                        <div className="modal-form-group">
                            <label>Mặt sau CCCD</label>
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
                                    className="preview-image"
                                />
                            )}
                        </div>
                    </section>
                    {/* Thêm nút để hiển thị trường chi tiết */}
                    <button
                        type="button"
                        className="btn btn-link"
                        onClick={() => setShowDetails(!showDetails)}
                    >
                        {showDetails ? "Ẩn thông tin chi tiết" : "Thêm thông tin chi tiết"}
                    </button>

                    {showDetails && (
                        <>
                            <div className="modal-form-group">
                                <label>Ngày sinh</label>
                                <input
                                    type="date"
                                    {...register("tenant.dateOfBirth")}
                                    className="form-control"
                                />
                            </div>
                            <div className="modal-form-group">
                                <label>Tỉnh/Thành</label>
                                <input
                                    type="text"
                                    {...register("tenant.province")}
                                    className="form-control"
                                />
                            </div>
                            <div className="modal-form-group">
                                <label>Quận/Huyện</label>
                                <input
                                    type="text"
                                    {...register("tenant.district")}
                                    className="form-control"
                                />
                            </div>
                            <div className="modal-form-group">
                                <label>Phường/Xã</label>
                                <input
                                    type="text"
                                    {...register("tenant.commune")}
                                    className="form-control"
                                />
                            </div>
                            <div className="modal-form-group">
                                <label>Địa chỉ chi tiết</label>
                                <textarea
                                    {...register("tenant.detailAddress")}
                                    className="form-control"
                                ></textarea>
                            </div>
                        </>
                    )}

                    {/* Dịch vụ */}
                    <section className="section">
                        <h3 className="text-lg font-semibold">Số Liệu Dịch Vụ</h3>
                        <table className="table-auto w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border border-gray-300 px-4 py-2 text-left">Tên Dịch Vụ</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Giá Đơn Vị</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Đơn Vị</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Ngày Hiệu Lực</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Nhập Số Liệu</th>
                                </tr>
                            </thead>
                            <tbody>
                                {services.map((service: any, index: number) => {
                                    return (
                                        <tr key={service.serviceId}>
                                            <td className="border border-gray-300 px-4 py-2">{service.serviceName
                                            }</td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {service.unitCost ? `${service.unitCost} đ` : "Miễn phí"}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {service.unit || "N/A"}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {service.effectiveFrom
                                                    ? new Date(service.effectiveFrom).toLocaleDateString("vi-VN")
                                                    : "N/A"}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                <input
                                                    type="number"
                                                    placeholder="Nhập số liệu"
                                                    {...register(`services.${index}.reading`)}
                                                    className="w-full border p-2 rounded"
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
                        </table>
                    </section>
                    <div className="modal-footer">
                        <button type="submit" className="btn btn-primary">
                            Lưu
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onClose}
                        >
                            Thoát
                        </button>
                    </div>
                </form>
            </div>
        </div>
    ) : null;
};

export default CreateContractModal;
