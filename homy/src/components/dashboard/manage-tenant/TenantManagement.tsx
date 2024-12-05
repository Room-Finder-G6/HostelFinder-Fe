import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import apiInstance from "@/utils/apiInstance";
import Loading from "@/components/Loading";
import DashboardHeaderTwo from "@/layouts/headers/dashboard/DashboardHeaderTwo";
import RoomSelector from "./RoomSelector";

interface Room {
    id: string;
    roomName: string;
}

interface Hostel {
    id: string;
    hostelName: string;
}

interface Tenant {
    id: string;
    roomName: string;
    fullName: string;
    avatarUrl: string;
    email: string;
    phone: string;
    moveInDate: string;
    status: string;
}

const TenantManagement = () => {
    const [hostels, setHostels] = useState<Hostel[]>([]);
    const [selectedHostelId, setSelectedHostelId] = useState<string>("");
    const [rooms, setRooms] = useState<Room[]>([]);
    const [selectedRoomId, setSelectedRoomId] = useState<string>("");
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [newTenant, setNewTenant] = useState<any>({
        fullName: "",
        avatarImage: null,
        email: "",
        phone: "",
        description: "",
        dateOfBirth: "",
        province: "",
        district: "",
        commune: "",
        detailAddress: "",
        identityCardNumber: "",
        frontImage: null,
        backImage: null,
        temporaryResidenceStatus: 0,
    });

    const fetchRooms = async (hostelId: string) => {
        setLoading(true);
        try {
            const response = await apiInstance.get(`/rooms/hostels/${hostelId}`);
            if (response.data.succeeded) {
                setRooms(response.data.data);
            } else {
                toast.error("Không thể tải danh sách phòng trọ.");
            }
        } catch (error) {
            toast.error("Lỗi khi tải danh sách phòng trọ.");
        }
        setLoading(false);
    };

    const fetchTenants = async (hostelId: string, roomName: string) => {
        setLoading(true);
        try {
            const response = await apiInstance.get(
                `/Tenants/GetAllTenantsByHostel/${hostelId}?roomName=${roomName}&pageNumber=1&pageSize=10`
            );
            if (response.data.succeeded) {
                setTenants(response.data.data);
            } else {
                toast.error("Không thể tải danh sách tenants.");
            }
        } catch (error) {
            toast.error("Lỗi khi tải danh sách tenants.");
        }
        setLoading(false);
    };

    const handleHostelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const hostelId = e.target.value;
        setSelectedHostelId(hostelId);
        setSelectedRoomId(""); // Reset phòng khi chọn nhà trọ mới
        setTenants([]); // Reset tenants khi thay đổi hostel
        fetchRooms(hostelId); // Lấy phòng của hostel đã chọn
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, files } = e.target as HTMLInputElement;

        if (files && files.length > 0) {
            setNewTenant((prev: any) => ({
                ...prev,
                [name]: files[0], // Lưu file vào state
            }));
        } else {
            setNewTenant((prev: any) => ({
                ...prev,
                [name]: value, // Lưu giá trị input vào state
            }));
        }
    };
    const handleRoomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const roomId = e.target.value;
        const room = rooms.find((r) => r.id === roomId);
        if (room) {
            setSelectedRoomId(roomId);
            if (selectedHostelId && room.roomName) {
                fetchTenants(selectedHostelId, room.roomName); // Gọi API với roomName thay vì roomId
            }
        }
    };

    const toggleModal = () => setIsModalOpen(!isModalOpen);

    const handleFormSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
    
        const formData = new FormData();
    
        // Thêm thông tin tenant vào FormData
        formData.append("RoomId", selectedRoomId);
        formData.append("FullName", newTenant.fullName);
        formData.append("Email", newTenant.email);
        formData.append("Phone", newTenant.phone);
        formData.append("DateOfBirth", newTenant.dateOfBirth);
        formData.append("Description", newTenant.description || "");
        formData.append("Province", newTenant.province);
        formData.append("District", newTenant.district);
        formData.append("Commune", newTenant.commune);
        formData.append("DetailAddress", newTenant.detailAddress);
        formData.append("IdentityCardNumber", newTenant.identityCardNumber);
        formData.append("TemporaryResidenceStatus", newTenant.temporaryResidenceStatus);
    
        // Kiểm tra và thêm ảnh vào FormData nếu có
        if (newTenant.avatarImage) {
            formData.append("AvatarImage", newTenant.avatarImage); // File Avatar
        } else {
            formData.append("AvatarImage", "https://hostel-finder-images.s3.ap-southeast-1.amazonaws.com/Default-Avatar.png"); // Avatar mặc định
        }
    
        if (newTenant.frontImage) {
            formData.append("FrontImageImage", newTenant.frontImage); // File FrontImage
        } else {
            formData.append("FrontImageImage", "https://hostel-finder-images.s3.ap-southeast-1.amazonaws.com/Default-Front.png"); // Front Image mặc định
        }
    
        if (newTenant.backImage) {
            formData.append("BackImageImage", newTenant.backImage); // File BackImage
        } else {
            formData.append("BackImageImage", "https://hostel-finder-images.s3.ap-southeast-1.amazonaws.com/Default-Back.png"); // Back Image mặc định
        }
    
        try {
            const response = await apiInstance.post("/rooms/AddRoommate", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
    
            // Xử lý phản hồi từ server
            console.log(response.data); // Kiểm tra nội dung phản hồi
            if (response.status === 200) {
                toast.success("Thêm thành viên thành công!");
                toggleModal();
                fetchTenants(selectedHostelId, rooms.find((r) => r.id === selectedRoomId)?.roomName || "");
            } else {
                toast.error(`Có lỗi khi thêm thành viên: ${response.data.message || 'Không xác định'}`);
            }
        } catch (error) {
            toast.error("Phòng đã đầy, không thể thêm người thuê");
            console.error("Error uploading data:", error);
        }
    };
    

    return (
        <div className="dashboard-body">
            <DashboardHeaderTwo title="Quản lý tenant" />

            <div className="d-flex align-items-center gap-4 mb-4">
                <RoomSelector
                    selectedHostel={selectedHostelId}
                    onHostelChange={handleHostelChange}
                    selectedRoom={selectedRoomId}
                    onRoomChange={handleRoomChange}
                />
            </div>

            {loading && <Loading />}

            <button className="btn btn-primary mb-3" onClick={toggleModal} disabled={!selectedRoomId}>
                Thêm thành viên
            </button>

            {isModalOpen && (
                <div className="modal show d-block" tabIndex={-1}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Thêm thành viên</h5>
                                <button type="button" className="btn-close" onClick={toggleModal}></button>
                            </div>
                            <div className="modal-body">
                                <input
                                    type="text"
                                    name="fullName"
                                    placeholder="Họ và tên"
                                    value={newTenant.fullName}
                                    onChange={handleInputChange}
                                    className="form-control mb-2"
                                    required
                                />
                                <input
                                    type="file"
                                    name="avatarImage"
                                    onChange={handleInputChange}
                                    className="form-control mb-2"
                                    required
                                />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={newTenant.email}
                                    onChange={handleInputChange}
                                    className="form-control mb-2"
                                    required
                                />
                                <input
                                    type="text"
                                    name="phone"
                                    placeholder="Số điện thoại"
                                    value={newTenant.phone}
                                    onChange={handleInputChange}
                                    className="form-control mb-2"
                                    required
                                />
                                <input
                                    type="text"
                                    name="description"
                                    placeholder="Mô tả"
                                    value={newTenant.description}
                                    onChange={handleInputChange}
                                    className="form-control mb-2"
                                />
                                <input
                                    type="date"
                                    name="dateOfBirth"
                                    value={newTenant.dateOfBirth}
                                    onChange={handleInputChange}
                                    className="form-control mb-2"
                                    required
                                />
                                <input
                                    type="text"
                                    name="province"
                                    placeholder="Tỉnh"
                                    value={newTenant.province}
                                    onChange={handleInputChange}
                                    className="form-control mb-2"
                                    required
                                />
                                <input
                                    type="text"
                                    name="district"
                                    placeholder="Quận/Huyện"
                                    value={newTenant.district}
                                    onChange={handleInputChange}
                                    className="form-control mb-2"
                                    required
                                />
                                <input
                                    type="text"
                                    name="commune"
                                    placeholder="Xã/Phường"
                                    value={newTenant.commune}
                                    onChange={handleInputChange}
                                    className="form-control mb-2"
                                    required
                                />
                                <input
                                    type="text"
                                    name="detailAddress"
                                    placeholder="Địa chỉ cụ thể"
                                    value={newTenant.detailAddress}
                                    onChange={handleInputChange}
                                    className="form-control mb-2"
                                    required
                                />
                                <input
                                    type="text"
                                    name="identityCardNumber"
                                    placeholder="Số CCCD"
                                    value={newTenant.identityCardNumber}
                                    onChange={handleInputChange}
                                    className="form-control mb-2"
                                    required
                                />
                                <input
                                    type="file"
                                    name="frontImage"
                                    accept="image/*"
                                    onChange={handleInputChange}
                                />
                                <input
                                    type="file"
                                    name="backImage"
                                    accept="image/*"
                                    onChange={handleInputChange}
                                />


                                <input
                                    type="number"
                                    name="temporaryResidenceStatus"
                                    value={newTenant.temporaryResidenceStatus}
                                    onChange={handleInputChange}
                                    className="form-control mb-2"
                                    required
                                />
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={toggleModal}>
                                    Hủy
                                </button>
                                <button type="button" className="btn btn-primary" onClick={handleFormSubmit}>
                                    Thêm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {tenants.length > 0 && (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Ảnh đại diện</th>
                            <th>Tên</th>
                            <th>Email</th>
                            <th>Số điện thoại</th>
                            <th>Ngày vào</th>
                            <th>Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tenants.map((tenant) => (
                            <tr key={tenant.id}>
                                <td>
                                    <img
                                        src={tenant.avatarUrl}
                                        alt={tenant.fullName}
                                        style={{ width: "150px", height: "100px", borderRadius: "10%" }}
                                    />
                                </td>
                                <td>{tenant.fullName}</td>
                                <td>{tenant.email}</td>
                                <td>{tenant.phone}</td>
                                <td>{new Date(tenant.moveInDate).toLocaleDateString()}</td>
                                <td>{tenant.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};


export default TenantManagement;
