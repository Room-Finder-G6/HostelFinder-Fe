import NiceSelect from "@/ui/NiceSelect";
import React, { useState } from "react";
import { RoomData } from "@/components/dashboard/create-post/AddPropertyBody";
import UploadImage from "@/components/UploadImage";

interface OverviewProps {
    onDataChange: (data: Partial<RoomData>) => void;
}

const Overview: React.FC<OverviewProps> = ({ onDataChange }) => {
    // const [primaryImage, setPrimaryImage] = useState<string>("");

    const handleSelectChange = (name: string, e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        const convertedValue = name === 'roomType'
            ? parseInt(value)
            : name === 'isAvailable'
                ? JSON.parse(value)  // Convert from string to boolean
                : value;
        onDataChange({ [name]: convertedValue });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const convertedValue = name === 'imagesUrls'
            ? value.split(',').map(url => url.trim())
            : value;
        onDataChange({ [name]: convertedValue });
    };

    // const handleImageUpload = (files: File[]) => {
    //     if (files.length > 0) {
    //         const imageUrl = URL.createObjectURL(files[0]);
    //         setPrimaryImage(imageUrl);
    //         onDataChange({ primaryImage: files[0] }); // Send File object to parent component
    //     }
    // };

    return (
        <div className="bg-white card-box border-20">
            <h4 className="dash-title-three">Overview</h4>
            <div className="row align-items-end">
                <div className="col-md-6">
                    <div className="dash-input-wrapper mb-30">
                        <label htmlFor="hostelId">Mã trọ*</label>
                        <input
                            type="string"
                            name="hostelId"
                            placeholder="Hostel"
                            onChange={handleInputChange}
                        />
                    </div>
                </div>  <div className="col-md-6">
                    <div className="dash-input-wrapper mb-30">
                        <label htmlFor="roomId">Mã phòng*</label>
                        <input
                            type="string"
                            name="roomId"
                            placeholder="Nhập Id Phòng"
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
            </div>

            {/* Title */}
            <div className="dash-input-wrapper mb-30">
                <label htmlFor="title">Tiêu dề bài đăng*</label>
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
                    placeholder="WNhập chi tiết bài đăng..."
                    onChange={handleInputChange}
                ></textarea>
            </div>

            <div className="row align-items-end">
                {/* Room Type */}
                {/* <div className="col-md-6">
                    <div className="dash-input-wrapper mb-30">
                        <label htmlFor="roomType">Trạng thái*</label>
                        <NiceSelect
                            className="nice-select"
                            options={[
                                { value: "0", text: "Đang trống" },
                                { value: "1", text: "Hết phòng" },
                            ]}
                            defaultCurrent={0}
                            onChange={(e) => handleSelectChange('roomType', e)}
                            name="roomType"
                            placeholder="Select Room Type"
                        />
                    </div>
                </div> */}

                {/* Monthly Rent Cost */}
                <div className="col-md-6">
                    <div className="dash-input-wrapper mb-30">
                        <label htmlFor="membershipServiceId">Mã dịch vụ*</label>
                        <input
                            type="string"
                            name="membershipServiceId"
                            placeholder="Mã dịch vụ member"
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                {/* Size */}
                {/* <div className="col-md-6">
                    <div className="dash-input-wrapper mb-30">
                        <label htmlFor="size">Size*</label>
                        <input
                            type="number"
                            name="size"
                            placeholder="Size (m²)"
                            onChange={handleInputChange}
                        />
                    </div>
                </div> */}

                {/* Availability */}
                <div className="col-md-6">
                    <div className="dash-input-wrapper mb-30">
                        <label htmlFor="isAvailable">Trạng thái*</label>
                        <NiceSelect
                            className="nice-select"
                            options={[
                                { value: "true", text: "Còn trống" },
                                { value: "false", text: "Hết phòng" },
                            ]}
                            defaultCurrent={0}
                            onChange={(e) => handleSelectChange('isAvailable', e)}
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

                {/* Primary Image */}
                {/* <div className="col-md-6">
                    <div className="dash-input-wrapper mb-30">
                        <label htmlFor="primaryImageUrl">Primary Image*</label>
                        <UploadImage onImageUpload={handleImageUpload} multiple={true} />
                        {primaryImage && <img src={primaryImage} alt="Primary" style={{ marginTop: '10px', maxWidth: '100%' }} />}
                    </div>
                </div> */}
            </div>
        </div>
    );
};

export default Overview;