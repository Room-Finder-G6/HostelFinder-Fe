import NiceSelect from "@/ui/NiceSelect";
import React, { useState } from "react";
import { RoomData } from "@/components/dashboard/create-post/AddPropertyBody";
import UploadImage from "@/components/UploadImage";

interface OverviewProps {
    onDataChange: (data: Partial<RoomData>) => void;
}

const Overview: React.FC<OverviewProps> = ({ onDataChange }) => {
    const [primaryImage, setPrimaryImage] = useState<string>("");

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

    const handleImageUpload = (files: File[]) => {
        if (files.length > 0) {
            const imageUrl = URL.createObjectURL(files[0]);
            setPrimaryImage(imageUrl);
            onDataChange({ primaryImage: files[0] }); // Send File object to parent component
        }
    };

    return (
        <div className="bg-white card-box border-20">
            <h4 className="dash-title-three">Overview</h4>

            <div className="col-md-6">
                <div className="dash-input-wrapper mb-30">
                    <label htmlFor="hostelId">HostelId*</label>
                    <input
                        type="string"
                        name="hostelId"
                        placeholder="Hostel"
                        onChange={handleInputChange}
                    />
                </div>
            </div>

            {/* Title */}
            <div className="dash-input-wrapper mb-30">
                <label htmlFor="title">Title*</label>
                <input
                    type="text"
                    name="title"
                    placeholder="Your Title"
                    onChange={handleInputChange}
                />
            </div>

            {/* Description */}
            <div className="dash-input-wrapper mb-30">
                <label htmlFor="description">Description*</label>
                <textarea
                    className="size-lg"
                    name="description"
                    placeholder="Write about property..."
                    onChange={handleInputChange}
                ></textarea>
            </div>

            <div className="row align-items-end">
                {/* Room Type */}
                <div className="col-md-6">
                    <div className="dash-input-wrapper mb-30">
                        <label htmlFor="roomType">Room Type*</label>
                        <NiceSelect
                            className="nice-select"
                            options={[
                                { value: "1", text: "Phòng Trọ" },
                                { value: "2", text: "Chung Cư" },
                                { value: "3", text: "Chung Cư Mini" },
                            ]}
                            defaultCurrent={0}
                            onChange={(e) => handleSelectChange('roomType', e)}
                            name="roomType"
                            placeholder="Select Room Type"
                        />
                    </div>
                </div>

                {/* Monthly Rent Cost */}
                <div className="col-md-6">
                    <div className="dash-input-wrapper mb-30">
                        <label htmlFor="monthlyRentCost">Monthly Rent Cost (VND)*</label>
                        <input
                            type="number"
                            name="monthlyRentCost"
                            placeholder="Monthly Rent Cost"
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                {/* Size */}
                <div className="col-md-6">
                    <div className="dash-input-wrapper mb-30">
                        <label htmlFor="size">Size*</label>
                        <input
                            type="number"
                            name="size"
                            placeholder="Size (m²)"
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                {/* Availability */}
                <div className="col-md-6">
                    <div className="dash-input-wrapper mb-30">
                        <label htmlFor="isAvailable">Is Available*</label>
                        <NiceSelect
                            className="nice-select"
                            options={[
                                { value: "true", text: "Available" },
                                { value: "false", text: "Not Available" },
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
                        <label htmlFor="dateAvailable">Date Available*</label>
                        <input
                            type="date"
                            name="dateAvailable"
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                {/* Primary Image */}
                <div className="col-md-6">
                    <div className="dash-input-wrapper mb-30">
                        <label htmlFor="primaryImageUrl">Primary Image*</label>
                        <UploadImage onImageUpload={handleImageUpload} multiple={true} />
                        {primaryImage && <img src={primaryImage} alt="Primary" style={{ marginTop: '10px', maxWidth: '100%' }} />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Overview;