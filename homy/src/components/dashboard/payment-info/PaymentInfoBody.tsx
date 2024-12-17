import DashboardHeaderTwo from "@/layouts/headers/dashboard/DashboardHeaderTwo";
import React, { useState } from "react";
import apiInstance from "@/utils/apiInstance";
import { getUserIdFromToken } from "@/utils/tokenUtils";
import { toast } from "react-toastify";

const PaymentInfoBody = () => {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null); // State for image preview
    const [bankName, setBankName] = useState<string>("");
    const [accountNumber, setAccountNumber] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const landlordId = getUserIdFromToken();

    const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > MAX_FILE_SIZE) {
                setErrorMessage("File size exceeds 3MB. Please select a smaller file.");
            } else {
                setErrorMessage(null);
                setSelectedImage(file);
                setImagePreview(URL.createObjectURL(file)); // Set the preview URL
            }
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        console.log('Selected Image:', selectedImage);
        console.log('Bank Name:', bankName);
        console.log('Account Number:', accountNumber);
        console.log('Landlord ID:', landlordId);
        if (!selectedImage) {
            setErrorMessage("Please upload a QR code image.");
            return;
        }

        const formData = new FormData();
        formData.append("QRCodeImage", selectedImage);
        formData.append("BankName", bankName);
        formData.append("AccountNumber", accountNumber);

        try {
            const response = await apiInstance.post(`/users/uploadQrCode?landlordId=${landlordId}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.data.succeeded) {
                toast.success("Thêm thông tin thanh toán thành công!");
                setSelectedImage(null); // Clear the selected image after successful upload
                setImagePreview(null);  // Clear preview
                setBankName("");
                setAccountNumber("");
            } else {
                toast.error("Lỗi khi tải lên thông tin thanh toán.");
            }
        } catch (error) {
            console.error('Error details:', error);
            toast.error("Có lỗi xảy ra khi tải lên.");
        }
    };

    return (
        <div className="dashboard-body">
            <div className="position-relative">
                <DashboardHeaderTwo title="Thêm thông tin thanh toán" />
                <div className="bg-white card-box border-20">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="bg-white border-20 col-md-12 mb-10">
                                <h4 className="dash-title-three">Thêm mã QR của bạn</h4>
                                <div className="dash-btn-one d-inline-block position-relative me-3">
                                    <i className="bi bi-plus"></i>
                                    Tải ảnh lên
                                    <input
                                        type="file"
                                        id="qrCodeImage"
                                        name="qrCodeImage"
                                        accept="image/*"
                                        required
                                        onChange={handleFileChange}
                                    />
                                </div>
                                <small>Tải lên file .jpg, .png</small>
                                {errorMessage && <p className="text-danger">{errorMessage}</p>}

                                {/* Preview image */}
                                {imagePreview && (
                                    <div className="mt-3">
                                        <img
                                            src={imagePreview}
                                            alt="QR Code Preview"
                                            style={{ width: "200px", height: "auto" }}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="col-12">
                                <div className="dash-input-wrapper mb-20">
                                    <label htmlFor="bankName">
                                        Tên ngân hàng <span style={{ color: 'red' }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="bankName"
                                        placeholder="Nhập tên ngân hàng"
                                        value={bankName}
                                        onChange={(e) => setBankName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="col-12">
                                <div className="dash-input-wrapper mb-20">
                                    <label htmlFor="accountNumber">
                                        Số tài khoản <span style={{ color: 'red' }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="accountNumber"
                                        placeholder="Nhập số tài khoản"
                                        value={accountNumber}
                                        onChange={(e) => setAccountNumber(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="col-12">
                                <button type="submit" className="dash-btn-two">
                                    Lưu thông tin
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PaymentInfoBody;
