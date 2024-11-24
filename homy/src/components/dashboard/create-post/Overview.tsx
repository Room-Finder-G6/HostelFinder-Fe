import React, {useEffect, useState} from "react";
import {PostData} from "@/components/dashboard/create-post/AddPostBody";
import NiceSelect from "@/ui/NiceSelect";
import apiInstance from "@/utils/apiInstance";
import {jwtDecode} from "jwt-decode"; // Fixed import statement
import {toast} from "react-toastify";
import {getUserIdFromToken} from "@/utils/tokenUtils";

interface OverviewProps {
    onDataChange: (data: Partial<PostData>) => void;
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

const Overview: React.FC<OverviewProps> = ({onDataChange}) => {
    const [hostels, setHostels] = useState<Hostel[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [hostelId, setHostelId] = useState<string>("");
    const [membershipServices, setMembershipServices] = useState([]);
    const userId = getUserIdFromToken();

    useEffect(() => {
        if (!userId) {
            toast.error("Cannot retrieve user ID", {position: "top-center"});
            return;
        }

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
    }, []);

    // Fetch rooms when hostelId changes
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

    useEffect(() => {
        const fetchMembershipServices = async () => {
            try {
                const response = await apiInstance.get(`membership/membershipServices/${userId}`);
                if (response.status === 200) {
                    setMembershipServices(response.data.data);
                }
            } catch (error: any) {
                toast.error(`Error fetching membership services: ${error.response?.data?.message || error.message}`, {position: "top-center"});
            }
        };

        fetchMembershipServices();
    }, []);

    const handleSelectChange = (name: string, e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        onDataChange({[name]: value});

        if (name === 'hostelId') {
            setHostelId(value); // Update hostelId state when hostel selection changes
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
                    placeholder="Nhập chi tiết bài đăng..."
                    onChange={handleInputChange}
                ></textarea>
            </div>

            <div className="row align-items-end">
                <div className="col-md-6">
                    <div className="dash-input-wrapper mb-30">
                        <label htmlFor="membershipServiceId">Chọn dịch vụ đăng bài*</label>
                        <NiceSelect
                            className="nice-select"
                            options={membershipServices.map((service:any) => ({
                                value: service.id,
                                text: `Bài đăng ${service.typeOfPost} (${service.numberOfPostsRemaining} bài còn lại)`,
                            }))}
                            defaultCurrent={0}
                            onChange={(e) => handleSelectChange("membershipServiceId", e)}
                            name="membershipServiceId"
                            placeholder="Chọn dịch vụ"
                        />
                    </div>
                </div>


                {/* Availability */}
                <div className="col-md-6">
                    <div className="dash-input-wrapper mb-30">
                        <label htmlFor="isAvailable">Trạng thái*</label>
                        <NiceSelect
                            className="nice-select"
                            options={[
                                {value: "true", text: "Còn trống"},
                                {value: "false", text: "Hết phòng"},
                            ]}
                            defaultCurrent={0}
                            onChange={(e) => handleSelectChange("isAvailable", e)}
                            name="isAvailable"
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
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Overview;
