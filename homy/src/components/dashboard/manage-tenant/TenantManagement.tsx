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
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [totalPages, setTotalPages] = useState<number>(10); // Tổng số trang
    const [searchQuery, setSearchQuery] = useState<string>(""); // Từ khóa tìm kiếm
    const [page, setPage] = useState<number>(1); // Trang hiện tại
    const [newTenant, setNewTenant] = useState<any>({
        roomId: "",
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

    // Hàm fetch danh sách tenants theo hostelId
    const fetchTenants = async (hostelId: string, page: number, searchQuery: string) => {
        setLoading(true);
        try {
            const response = await apiInstance.get(
                `/Tenants/GetAllTenantsByHostel/${hostelId}?pageNumber=${page}&pageSize=10`
            );
            if (response.data.succeeded) {
                const filteredTenants = response.data.data.filter((tenant: Tenant) => {
                    // Lọc tenant theo phòng nếu `roomName` hoặc `roomId` chứa `searchQuery`
                    return tenant.roomName.includes(searchQuery); // Có thể thay "roomName" bằng trường phù hợp
                });
                setTenants(filteredTenants);
            } else {
                toast.error("Không thể tải danh sách tenants.");
                setTenants([]); // Fallback to an empty array
            }
        } catch (error) {
            toast.error("Lỗi khi tải danh sách tenants.");
            setTenants([]); // Fallback to an empty array
        }
        setLoading(false);
    };





    // Hàm fetch danh sách phòng theo hostelId
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
    // Hàm thay đổi trang
    const handlePageChange = (newPage: number) => {
        // Kiểm tra nếu trang sau có hợp lệ hay không
        if (newPage > totalPages || newPage < 1) return;  // Không thay đổi trang nếu vượt quá số trang hợp lệ
    
        setPage(newPage);
        fetchTenants(selectedHostelId, newPage, searchQuery); // Lấy lại danh sách tenants theo trang mới
    };
    
    // Hàm tìm kiếm phòng trọ theo tên
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        fetchTenants(selectedHostelId, 1, e.target.value); // Tìm kiếm khi thay đổi từ khóa
    };


    // Hàm xử lý thay đổi nhà trọ
    const handleHostelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const hostelId = e.target.value;
        setSelectedHostelId(hostelId);
        setTenants([]); // Reset tenants khi thay đổi hostel
        fetchRooms(hostelId); // Lấy phòng của hostel đã chọn
        fetchTenants(hostelId, 1, searchQuery); // Lấy tenants của hostel đã chọn
    };
    const handleRoomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const roomId = e.target.value;
        setNewTenant((prev: any) => ({
            ...prev,
            roomId, // Cập nhật giá trị roomId vào state
        }));
    };
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const target = e.target;
        const name = target.name;
        const value = target.value;

        if (target instanceof HTMLInputElement && target.type === 'file') {
            const files = target.files;
            if (files && files.length > 0) {
                setNewTenant((prev: any) => ({
                    ...prev,
                    [name]: files[0],
                }));
            }
        } else {
            setNewTenant((prev: any) => ({
                ...prev,
                [name]: value,
            }));
        }
    };



    // Mở/Đóng modal
    const toggleModal = () => setIsModalOpen(!isModalOpen);

    const handleFormSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        const formData = new FormData();

        // Thêm thông tin tenant vào FormData
        formData.append("RoomId", newTenant.roomId); // Sửa theo logic của bạn
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

            if (response.status === 200) {
                toast.success("Thêm thành viên thành công!");
                toggleModal();
                fetchTenants(selectedHostelId, page, searchQuery); // Lấy lại danh sách tenants
            } else {
                toast.error(`Có lỗi khi thêm thành viên: ${response.data.message || 'Không xác định'}`);
            }
        } catch (error) {
            toast.error("Phòng đã đầy, không thể thêm người thuê");
            console.error("Error uploading data:", error);
        }
    };

    useEffect(() => {
        if (selectedHostelId) {
            fetchRooms(selectedHostelId);
            fetchTenants(selectedHostelId, page, searchQuery);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedHostelId, page, searchQuery]); // Chú ý kiểm tra các dependency


    return (
        <div className="dashboard-body">
            <DashboardHeaderTwo title="Quản lý người thuê" />

            <div className="d-flex align-items-center gap-4 mb-4">
                <RoomSelector
                    selectedHostel={selectedHostelId}
                    onHostelChange={handleHostelChange}
                    selectedRoom={""} // Không cần chọn phòng
                    onRoomChange={() => { }} // Không cần xử lý khi thay đổi phòng
                />
            </div>
            {loading && <Loading />}

            {/* Tìm kiếm theo tên phòng trọ */}
            <input
                type="text"
                name="room"
                placeholder="Tìm kiếm phòng"
                value={searchQuery}
                onChange={handleSearchChange}  // Xử lý tìm kiếm khi người dùng nhập
                className="form-control mb-2"
                required
            />
            {loading && <Loading />}

            <button className="btn btn-primary mb-3" onClick={toggleModal} disabled={!selectedHostelId}>
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
                                {/* Form input để thêm thành viên */}
                                <div className="form-group">
                                    <label htmlFor="roomSelect">Chọn phòng:</label>
                                    <select
                                        id="roomSelect"
                                        className="form-select mt-2"
                                        value={newTenant.roomId}
                                        onChange={handleRoomChange}  // Gọi handleRoomChange khi thay đổi
                                        required
                                    >
                                        <option value="">Chọn phòng</option>
                                        {rooms.map((room) => (
                                            <option key={room.id} value={room.id}>
                                                {room.roomName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
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
                                <button type="button" className="btn btn-secondary" onClick={toggleModal}>Đóng</button>
                                <button type="button" className="btn btn-primary" onClick={handleFormSubmit}>Lưu</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
 <div className="bg-white card-box p0 border-20">
 <div className="table-responsive pt-25 pb-25 pe-4 ps-4">
            {tenants && tenants.length > 0 && (
                <>
                  <table className="table property-list-table">
                        <thead>
                            <tr>
                                <th>Ảnh đại diện</th>
                                <th>Tên</th>
                                <th>Email</th>
                                <th>Số điện thoại</th>
                                <th>Phòng</th>
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
                                    <td>{tenant.roomName}</td>
                                    <td>{new Date(tenant.moveInDate).toLocaleDateString()}</td>
                                    <td>{tenant.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination Controls */}
                    <div className="d-flex justify-content-between align-items-center">
                        <button
                            className="btn btn-secondary"
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1}
                        >
                            Trang trước
                        </button>
                        <span>Trang {page} / {totalPages}</span>
                        <button
                            className="btn btn-secondary"
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page === totalPages}
                        >
                            Trang sau
                        </button>
                    </div>
                </>
            )}
            </div>
            </div>
        </div>
    );
};

export default TenantManagement;
