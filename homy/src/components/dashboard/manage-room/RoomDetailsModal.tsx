"use client";

import React, { useEffect, useState } from "react";
import { FaClipboardList, FaFileInvoiceDollar, FaTimes, FaUser, FaWrench } from "react-icons/fa";
import apiInstance from "@/utils/apiInstance";
import { toast } from "react-toastify";

interface RoomDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    roomId: string;
}

interface RoomInfoDetail {
    roomName: string;
    floor: number;
    maxRenters: number;
    numberOfCustomer: number;
    size: number;
    isAvailable: boolean;
    monthlyRentCost: number;
    roomType: number;
}

interface Tenant {
    fullName: string;
    avatarUrl: string;
    email: string;
    phone: string;
    province: string;
    identityCardNumber: string;
    description: string | null;
    moveInDate: string;
}

interface InvoiceDetail {
    // Define the structure based on your API's invoice details
}

interface ContractDetail {
    // Define the structure based on your API's contract details
}

interface RoomRepairHistory {
    // Define the structure based on your API's repair history
}

interface RoomDetailsData {
    roomInfoDetail: RoomInfoDetail;
    pictureRoom: string[];
    infomationTenacy: Tenant[];
    invoiceDetailInRoom: InvoiceDetail | null;
    contractDetailInRoom: ContractDetail | null;
    roomRepairHostory: RoomRepairHistory | null;
}

const RoomDetailsModal: React.FC<RoomDetailsModalProps> = ({ isOpen, onClose, roomId }) => {
    const [roomDetails, setRoomDetails] = useState<RoomDetailsData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<string>("general");
    useEffect(() => {
        if (isOpen && roomId) {
            fetchRoomDetails();
        }
    }, [isOpen, roomId]);

    const fetchRoomDetails = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiInstance.get(`/rooms/info-detail`, {
                params: { roomId }
            });
            if (response.data.succeeded) {
                setRoomDetails(response.data.data);
            } else {
                setError('Không thể tải thông tin phòng.');
                toast.error("Không thể tải thông tin phòng.", { position: "top-center" });
            }
        } catch (error: any) {
            console.error("Error fetching room details:", error);
            setError('Có lỗi xảy ra khi tải thông tin phòng.');
            toast.error("Có lỗi xảy ra khi tải thông tin phòng.", { position: "top-center" });
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    function getRoomType(roomType: number): React.ReactNode {
        switch (roomType) {
            case 1:
                return "Phòng đơn";
            case 2:
                return "Phòng đôi";
            case 3:
                return "Phòng gia đình";
            // Add more cases as needed
            default:
                return "Không xác định";
        }
    }

    return (
        <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="modal-content bg-white rounded-lg w-11/12 max-w-4xl p-6 relative overflow-y-auto max-h-screen">
                <button className="absolute top-4 right-4 text-gray-600 hover:text-gray-800" onClick={onClose}>
                    <FaTimes size={20} />
                </button>
                <h2 className="text-2xl mb-4">Thông tin phòng</h2>

                {loading ? (
                    <p>Đang tải...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : roomDetails ? (
                    <div>
                        {/* Tab Buttons */}
                        <div className="flex space-x-4 mb-4">
                            <button
                                className={`flex items-center space-x-2 px-3 py-2 rounded ${activeTab === "general" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
                                    }`}
                                onClick={() => setActiveTab("general")}
                            >
                                <FaClipboardList />
                                <span>Thông tin chung</span>
                            </button>
                            <button
                                className={`flex items-center space-x-2 px-3 py-2 rounded ${activeTab === "tenants" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
                                    }`}
                                onClick={() => setActiveTab("tenants")}
                            >
                                <FaUser />
                                <span>Khách thuê trọ</span>
                            </button>
                            <button
                                className={`flex items-center space-x-2 px-3 py-2 rounded ${activeTab === "invoices" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
                                    }`}
                                onClick={() => setActiveTab("invoices")}
                            >
                                <FaFileInvoiceDollar />
                                <span>Lịch sử hóa đơn</span>
                            </button>
                            <button
                                className={`flex items-center space-x-2 px-3 py-2 rounded ${activeTab === "contracts" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
                                    }`}
                                onClick={() => setActiveTab("contracts")}
                            >
                                <FaClipboardList />
                                <span>Lịch sử hợp đồng</span>
                            </button>
                            <button
                                className={`flex items-center space-x-2 px-3 py-2 rounded ${activeTab === "repairs" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
                                    }`}
                                onClick={() => setActiveTab("repairs")}
                            >
                                <FaWrench />
                                <span>Lịch sử sửa chữa</span>
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div>
                            {activeTab === "general" && (
                                <section className="mb-6">
                                    <h3 className="text-xl font-semibold mb-2">Thông tin chung</h3>
                                    <p><strong>Tên phòng:</strong> {roomDetails.roomInfoDetail.roomName}</p>
                                    <p><strong>Tầng:</strong> {roomDetails.roomInfoDetail.floor}</p>
                                    <p><strong>Số người tối đa:</strong> {roomDetails.roomInfoDetail.maxRenters}</p>
                                    <p><strong>Số khách hiện tại:</strong> {roomDetails.roomInfoDetail.numberOfCustomer}</p>
                                    <p><strong>Diện tích:</strong> {roomDetails.roomInfoDetail.size} m²</p>
                                    <p><strong>Trạng thái:</strong> {roomDetails.roomInfoDetail.isAvailable ? "Còn trống" : "Đã thuê"}</p>
                                    <p><strong>Giá thuê hàng tháng:</strong> {new Intl.NumberFormat('vi-VN').format(roomDetails.roomInfoDetail.monthlyRentCost)} đ</p>
                                    <p><strong>Loại phòng:</strong> {getRoomType(roomDetails.roomInfoDetail.roomType)}</p>
                                    {/* Hình ảnh phòng (Always visible or can be moved to a separate tab) */}
                                    <div className="mb-6">
                                        <h3 className="text-xl font-semibold mb-2">Hình ảnh phòng</h3>
                                        <div className="flex flex-wrap gap-4 room-images">
                                            {roomDetails.pictureRoom.map((url, index) => (
                                                <img
                                                    key={index}
                                                    src={url}
                                                    alt={`Hình ảnh phòng ${index + 1}`}
                                                    className="w-32 h-32 object-cover rounded"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </section>
                            )}
                            {activeTab === "tenants" && (
                                <section className="mb-6">
                                    <h3 className="text-xl font-semibold mb-2">Khách thuê trọ</h3>
                                    {roomDetails.infomationTenacy.length > 0 ? (
                                        <div className="space-y-4">
                                            {roomDetails.infomationTenacy.map((tenant, index) => (
                                                <div key={index} className="flex items-center space-x-4">
                                                    <img
                                                        src={tenant.avatarUrl}
                                                        alt={tenant.fullName}
                                                        className="w-16 h-16 rounded-full object-cover"
                                                    />
                                                    <div>
                                                        <p><strong>Tên:</strong> {tenant.fullName}</p>
                                                        <p><strong>Email:</strong> {tenant.email}</p>
                                                        <p><strong>Điện thoại:</strong> {tenant.phone}</p>
                                                        <p><strong>Tỉnh/Thành phố:</strong> {tenant.province}</p>
                                                        <p><strong>Số CMND:</strong> {tenant.identityCardNumber}</p>
                                                        <p><strong>Ngày vào:</strong> {new Date(tenant.moveInDate).toLocaleDateString()}</p>
                                                        {tenant.description && <p><strong>Mô tả:</strong> {tenant.description}</p>}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p>Không có khách thuê trọ.</p>
                                    )}
                                </section>
                            )}

                            {activeTab === "invoices" && (
                                <section className="mb-6">
                                    <h3 className="text-xl font-semibold mb-2">Lịch sử hóa đơn</h3>
                                    {roomDetails.invoiceDetailInRoom ? (
                                        // Render invoice details here
                                        <div>
                                            {/* Example: */}
                                            {/* <p><strong>Mã hóa đơn:</strong> {roomDetails.invoiceDetailInRoom.invoiceId}</p>
                                            <p><strong>Số tiền:</strong> {new Intl.NumberFormat('vi-VN').format(roomDetails.invoiceDetailInRoom.amount)} đ</p>
                                            <p><strong>Ngày tạo:</strong> {new Date(roomDetails.invoiceDetailInRoom.createdDate).toLocaleDateString()}</p> */}
                                            {/* Add more fields as necessary */}
                                        </div>
                                    ) : (
                                        <p>Không có lịch sử hóa đơn.</p>
                                    )}
                                </section>
                            )}

                            {activeTab === "contracts" && (
                                <section className="mb-6">
                                    <h3 className="text-xl font-semibold mb-2">Lịch sử hợp đồng</h3>
                                    {roomDetails.contractDetailInRoom ? (
                                        // Render contract details here
                                        <div>
                                            {/* Example: */}
                                            {/* <p><strong>Mã hợp đồng:</strong> {roomDetails.contractDetailInRoom.contractId}</p>
                                            <p><strong>Ngày bắt đầu:</strong> {new Date(roomDetails.contractDetailInRoom.startDate).toLocaleDateString()}</p>
                                            <p><strong>Ngày kết thúc:</strong> {new Date(roomDetails.contractDetailInRoom.endDate).toLocaleDateString()}</p> */}
                                            {/* Add more fields as necessary */}
                                        </div>
                                    ) : (
                                        <p>Không có lịch sử hợp đồng.</p>
                                    )}
                                </section>
                            )}

                            {activeTab === "repairs" && (
                                <section className="mb-6">
                                    <h3 className="text-xl font-semibold mb-2">Lịch sử sửa chữa</h3>
                                    {roomDetails.roomRepairHostory ? (
                                        // Render repair history here
                                        <div>
                                            {/* Example: */}
                                            {/* <p><strong>Mã sửa chữa:</strong> {roomDetails.roomRepairHostory.repairId}</p>
                                            <p><strong>Mô tả:</strong> {roomDetails.roomRepairHostory.description}</p>
                                            <p><strong>Ngày sửa chữa:</strong> {new Date(roomDetails.roomRepairHostory.repairDate).toLocaleDateString()}</p> */}
                                            {/* Add more fields as necessary */}
                                        </div>
                                    ) : (
                                        <p>Không có lịch sử sửa chữa.</p>
                                    )}
                                </section>
                            )}
                        </div>


                    </div>
                ) : (
                    <p>Không có dữ liệu để hiển thị.</p>
                )}
            </div>
        </div>
    );
};

export default RoomDetailsModal;