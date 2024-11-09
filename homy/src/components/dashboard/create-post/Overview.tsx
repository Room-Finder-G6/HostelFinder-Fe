import React, {useEffect, useState} from "react";
import {RoomData} from "@/components/dashboard/create-post/AddPropertyBody";
import NiceSelect from "@/ui/NiceSelect";
import apiInstance from "@/utils/apiInstance";
import {jwtDecode} from "jwt-decode";
import {toast} from "react-toastify";

interface OverviewProps {
    onDataChange: (data: Partial<RoomData>) => void;
}

interface Hostel {
    id: string;
    hostelName: string;
}

interface DecodedToken {
    UserId: string;
}

const Overview: React.FC<OverviewProps> = ({onDataChange}) => {
    const [hostels, setHostels] = useState<Hostel[]>([]);

    useEffect(() => {
        const token = localStorage.getItem("token"); // Giả sử token được lưu trong localStorage với key là 'token'
        if (token) {
            try {
                const decodedToken: DecodedToken = jwtDecode(token);
                const userId = decodedToken.UserId;
                console.log(userId);

                if (userId) {
                    const fetchHostels = async () => {
                        try {
                            const response = await apiInstance.get(`hostels/getHostelsByLandlordId/${userId}`);
                            if (response.status === 200) {
                                setHostels(response.data.data); // Giả sử response.data là danh sách các nhà trọ
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

    const handleSelectChange = (name: string, e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        onDataChange({[name]: value});
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        onDataChange({[name]: value});
    };

    return (
        <div className="bg-white card-box border-20">
            {/*<h4 className="dash-title-three">Overview</h4>*/}
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

                {/* Room ID */}
                <div className="col-md-6">
                    <div className="dash-input-wrapper mb-30">
                        <label htmlFor="roomId">Mã phòng*</label>
                        <input
                            type="text"
                            name="roomId"
                            placeholder="Nhập Id Phòng"
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
            </div>

            {/* Title */}
            <div className="dash-input-wrapper mb-30">
                <label htmlFor="title">Tiêu đề bài đăng*</label>
                <input
                    type="text"
                    name="title"
                    placeholder="Your Title"
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
                {/* Membership Service ID */}
                <div className="col-md-6">
                    <div className="dash-input-wrapper mb-30">
                        <label htmlFor="membershipServiceId">Mã dịch vụ*</label>
                        <input
                            type="text"
                            name="membershipServiceId"
                            placeholder="Mã dịch vụ member"
                            onChange={handleInputChange}
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
