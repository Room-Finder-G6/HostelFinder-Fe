import React, { useEffect, useState } from "react";
import NiceSelect from "@/ui/NiceSelect";
import apiInstance from "@/utils/apiInstance";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

interface PostData {
    id: string;
    hostelId: string;
    roomId: string;
    title: string;
    description: string;
    status: boolean;
    imageUrls: string[];
    dateAvailable: string;
    membershipServiceId: string;
}

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

const Overview: React.FC<OverviewProps> = ({ onDataChange, postData }) => {
    const [hostels, setHostels] = useState<Hostel[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);

    useEffect(() => {
        const fetchHostels = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Token not found", { position: "top-center" });
                return;
            }

            try {
                const decodedToken: DecodedToken = jwtDecode(token);
                const response = await apiInstance.get(`hostels/getHostelsByLandlordId/${decodedToken.UserId}`);
                if (response.status === 200) {
                    setHostels(response.data.data);
                }
            } catch (error: any) {
                toast.error(`Error fetching hostels: ${error.response?.data?.message || error.message}`, { position: "top-center" });
            }
        };

        fetchHostels();
    }, []);

    useEffect(() => {
        const fetchRooms = async () => {
            if (postData.hostelId) {
                try {
                    const response = await apiInstance.get(`rooms/hostels/${postData.hostelId}`);
                    if (response.status === 200) {
                        setRooms(response.data.data);
                    }
                } catch (error: any) {
                    toast.error("No rooms found for this hostel", { position: "top-center" });
                }
            }
        };

        fetchRooms();
    }, [postData.hostelId]);

    const handleSelectChange = (name: string, e: any) => {
        const value = typeof e === 'object' ? e.target.value : e;
        onDataChange({ [name]: value });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        onDataChange({ [name]: value });
    };

    return (
        <div className="bg-white card-box border-20">
            <div className="row align-items-end">
                <div className="col-md-6">
                    <div className="dash-input-wrapper mb-30">
                        <label htmlFor="hostelId">Chọn nhà trọ*</label>
                        <select
                            name="hostelId"
                            value={postData.hostelId}
                            onChange={(e) => handleSelectChange("hostelId", e)}
                            className="form-control"
                        >
                            <option value="">Chọn nhà trọ</option>
                            {hostels.map((hostel) => (
                                <option key={hostel.id} value={hostel.id}>
                                    {hostel.hostelName}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="dash-input-wrapper mb-30">
                        <label htmlFor="roomId">Chọn phòng*</label>
                        <select
                            name="roomId"
                            value={postData.roomId}
                            onChange={(e) => handleSelectChange("roomId", e)}
                            className="form-control"
                            required
                        >
                            {rooms.map((room) => (
                                <option key={room.id} value={room.id}>
                                    {room.roomName}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="dash-input-wrapper mb-30">
                <label htmlFor="title">Tiêu đề*</label>
                <input
                    type="text"
                    name="title"
                    id="title"
                    value={postData.title}
                    maxLength={255}
                    placeholder="Nhập tiêu đề..."
                    onChange={handleInputChange}
                    required
                />
            </div>

            <div className="dash-input-wrapper mb-30">
                <label htmlFor="description">Mô tả chi tiết*</label>
                <textarea
                    className="size-lg"
                    name="description"
                    maxLength={1000}
                    value={postData.description}
                    placeholder="Nhập mô tả chi tiết..."
                    onChange={handleInputChange}
                    required
                ></textarea>
            </div>

            <div className="row align-items-end">
                <div className="col-md-6">
                    <div className="dash-input-wrapper mb-30">
                        <label htmlFor="status">Trạng thái bài đăng*</label>
                        <NiceSelect
                            options={[
                                { value: "true", text: "Đang hoạt động" },
                                { value: "false", text: "Ẩn bài đăng" },
                            ]}
                            value={postData.status ? "true" : "false"}
                            onChange={(e) => handleSelectChange("status", e)}
                            name="status"
                            placeholder={"Chọn trạng thái bài đăng"}
                            required
                        />
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="dash-input-wrapper mb-30">
                        <label htmlFor="dateAvailable">Available Date*</label>
                        <input
                            type="date"
                            name="dateAvailable"
                            value={postData.dateAvailable}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Overview;