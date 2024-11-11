import React, {useEffect, useState} from "react";
import {PostData} from "@/components/dashboard/edit-post/EditPostForm";
import NiceSelect from "@/ui/NiceSelect";
import apiInstance from "@/utils/apiInstance";
import {jwtDecode} from "jwt-decode";
import {toast} from "react-toastify";

interface OverviewProps {
    onDataChange: (data: Partial<PostData>) => void;
    postData: PostData;
}

interface Hostel {
    id: string;
    hostelName: string;
}

interface Room {
    id: string;
    roomName: string;
}

interface DecodedToken {
    UserId: string;
}

const Overview: React.FC<OverviewProps> = ({onDataChange, postData}) => {
    const [hostels, setHostels] = useState<Hostel[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [hostelId, setHostelId] = useState<string>(postData.hostelId);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decodedToken: DecodedToken = jwtDecode(token);
                const userId = decodedToken.UserId;

                if (userId) {
                    const fetchHostels = async () => {
                        try {
                            const response = await apiInstance.get(`hostels/getHostelsByLandlordId/${userId}`);
                            if (response.status === 200) {
                                setHostels(response.data.data);
                            }
                        } catch (error: any) {
                            toast.error(`Error fetching hostels data: ${error.response?.data?.message || error.message}`, {position: "top-center"});
                        }
                    };

                    fetchHostels();
                } else {
                    toast.error("User ID not found in token", {position: "top-center"});
                }
            } catch (error) {
                toast.error("Invalid token", {position: "top-center"});
            }
        } else {
            toast.error("Token not found in localStorage", {position: "top-center"});
        }
    }, []);

    useEffect(() => {
        if (hostelId) {
            const fetchRooms = async () => {
                try {
                    const response = await apiInstance.get(`rooms/hostels/${hostelId}`);
                    if (response.status === 200) {
                        setRooms(response.data.data);
                    }
                } catch (error: any) {
                    toast.error(`Chưa thêm phòng cho nhà trọ này`, {position: "top-center"});
                }
            };
            fetchRooms();
        }
    }, [hostelId]);

    const handleSelectChange = (name: string, e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        onDataChange({[name]: value});

        if (name === 'hostelId') {
            setHostelId(value);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        onDataChange({[name]: value});
    };

    return (
        <div className="bg-white card-box border-20">
            <div className="row align-items-end">
                {/* Hostel Selection */}
                <div className="col-md-6">
                    <div className="dash-input-wrapper mb-30">
                        <label htmlFor="hostelId">Chọn nhà trọ*</label>
                        <select
                            name="hostelId"
                            value={postData.hostelId || ''}
                            onChange={(e) => handleSelectChange("hostelId", e)}
                            className="form-control"
                        >
                            <option value="">Chọn nhà trọ</option>
                            {Array.isArray(hostels) && hostels.map((hostel) => (
                                <option key={hostel.id} value={hostel.id}>
                                    {hostel.hostelName}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Room Selection */}
                <div className="col-md-6">
                    <div className="dash-input-wrapper mb-30">
                        <label htmlFor="roomId">Chọn phòng*</label>
                        <select
                            name="roomId"
                            value={postData.roomId || ''}
                            onChange={(e) => handleSelectChange("roomId", e)}
                            className="form-control"
                        >
                            <option value="">Chọn phòng</option>
                            {Array.isArray(rooms) && rooms.map((room) => (
                                <option key={room.id} value={room.id}>
                                    {room.roomName}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Title */}
            <div className="dash-input-wrapper mb-30">
                <label htmlFor="title">Tiêu đề bài đăng*</label>
                <input
                    type="text"
                    name="title"
                    value={postData.title || ''}
                    placeholder="Nhập tiêu đề bài đăng..."
                    onChange={handleInputChange}
                />
            </div>

            {/* Description */}
            <div className="dash-input-wrapper mb-30">
                <label htmlFor="description">Chi tiết*</label>
                <textarea
                    className="size-lg"
                    name="description"
                    value={postData.description || ''}
                    placeholder="Nhập chi tiết bài đăng..."
                    onChange={handleInputChange}
                ></textarea>
            </div>

            <div className="row align-items-end">
                {/* Membership Service ID */}
                <div className="col-md-6">
                    <div className="dash-input-wrapper mb-30">
                        <label htmlFor="membershipServiceId">Mã dịch vụ*</label>
                        <input
                            type="text"
                            name="membershipServiceId"
                            value={postData.membershipServiceId || ''}
                            placeholder="Mã dịch vụ member"
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                {/* Availability */}
                <div className="col-md-6">
                    <div className="dash-input-wrapper mb-30">
                        <label htmlFor="status">Trạng thái*</label>
                        <NiceSelect
                            className="nice-select"
                            options={[
                                {value: "true", text: "Còn trống"},
                                {value: "false", text: "Hết phòng"},
                            ]}
                            defaultCurrent={postData.status ? 0 : 1}
                            onChange={(e) => handleSelectChange("status", e)}
                            name="status"
                            placeholder="Select Availability"
                        />
                    </div>
                </div>

                {/* Date Available */}
                <div className="col-md-6">
                    <div className="dash-input-wrapper mb-30">
                        <label htmlFor="dateAvailable">Ngày trống phòng*</label>
                        <input
                            type="date"
                            name="dateAvailable"
                            value={postData.dateAvailable ? new Date(postData.dateAvailable).toISOString().slice(0, 10) : ''}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Overview;
