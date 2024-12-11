import React, {useState} from "react";
import {StoryRequest} from "@/models/storyRequest";
import NiceSelect from "@/ui/NiceSelect";

interface OverviewProps {
    onDataChange: (data: Partial<StoryRequest>) => void;
    provinces: { value: string; text: string }[];
    districts: { value: string; text: string }[];
    communes: { value: string; text: string }[];
    selectProvinceHandler: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    selectDistrictHandler: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    selectCommuneHandler: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    storyData: StoryRequest;
}

const Overview: React.FC<OverviewProps> = ({
                                               onDataChange,
                                               provinces,
                                               districts,
                                               communes,
                                               selectProvinceHandler,
                                               selectDistrictHandler,
                                               selectCommuneHandler,
                                               storyData,
                                           }) => {
    const [title, setTitle] = useState<string>(storyData.title);
    const [description, setDescription] = useState<string>(storyData.description);
    const [monthlyRentCost, setMonthlyRentCost] = useState<number>(storyData.monthlyRentCost);
    const [size, setSize] = useState<number>(storyData.size);
    const [roomType, setRoomType] = useState<string>(storyData.roomType);
    const [dateAvailable, setDateAvailable] = useState<string>(storyData.dateAvailable);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        let updatedData: Partial<StoryRequest> = {};

        switch (name) {
            case "title":
                setTitle(value);
                updatedData = {title: value};
                break;
            case "description":
                setDescription(value);
                updatedData = {description: value};
                break;
            case "monthlyRentCost":
                setMonthlyRentCost(Number(value));
                updatedData = {monthlyRentCost: Number(value)};
                break;
            case "size":
                setSize(Number(value));
                updatedData = {size: Number(value)};
                break;
            case "roomType":
                setRoomType(value);
                updatedData = {roomType: value};
                break;
            case "dateAvailable":
                setDateAvailable(value);
                updatedData = {dateAvailable: value};
                break;
            default:
                break;
        }

        onDataChange(updatedData);
    };

    return (
        <div className="bg-white card-box border-20">
            <div className="dash-input-wrapper mb-30">
                <label htmlFor="title">Tiêu đề bài đăng<span style={{color: 'red'}}>*</span></label>
                <input
                    type="text"
                    name="title"
                    placeholder="Nhập tiêu đề bài đăng..."
                    value={title}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                />
            </div>

            <div className="dash-input-wrapper mb-30">
                <label htmlFor="description">Thông tin mô tả<span style={{color: 'red'}}>*</span></label>
                <textarea
                    className="form-control size-lg"
                    name="description"
                    placeholder="Nhập chi tiết bài đăng..."
                    value={description}
                    onChange={handleInputChange}
                    rows={6}
                    required
                ></textarea>
            </div>

            <div className="row align-items-end">
                <div className="col-md-6">
                    <div className="dash-input-wrapper mb-30">
                        <label htmlFor="monthlyRentCost">Giá thuê hàng tháng<span
                            style={{color: 'red'}}>*</span></label>
                        <input
                            type="number"
                            name="monthlyRentCost"
                            placeholder="Nhập giá thuê hàng tháng..."
                            value={monthlyRentCost}
                            onChange={handleInputChange}
                            className="form-control"
                            required
                            min={0}
                        />
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="dash-input-wrapper mb-30">
                        <label htmlFor="size">Diện tích (m²)<span style={{color: 'red'}}>*</span></label>
                        <input
                            type="number"
                            name="size"
                            min={0}
                            placeholder="Nhập diện tích..."
                            value={size}
                            onChange={handleInputChange}
                            required
                            className="form-control"
                        />
                    </div>
                </div>
            </div>
            <div className="row align-items-end">
                <div className="col-md-6">
                    <div className="dash-input-wrapper mb-30">
                        <label htmlFor="roomType">Loại phòng<span style={{color: 'red'}}>*</span></label>
                        <NiceSelect
                            className="nice-select"
                            options={[
                                {value: "1", text: "Phòng trọ"},
                                {value: "2", text: "Chung cư"},
                                {value: "3", text: "Chung cư mini"},
                            ]}
                            placeholder="Chọn loại phòng"
                            onChange={(e) => onDataChange({roomType: e.target.value})}
                            name="roomType"
                            value={roomType}
                        />
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="dash-input-wrapper mb-30">
                        <label htmlFor="dateAvailable">Ngày có thể chuyển vào<span
                            style={{color: 'red'}}>*</span></label>
                        <input
                            type="date"
                            name="dateAvailable"
                            value={dateAvailable}
                            onChange={handleInputChange}
                            className="form-control"
                            required
                        />
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-md-4">
                    <div className="dash-input-wrapper mb-30">
                        <label htmlFor="province">Tỉnh/Thành Phố<span style={{color: 'red'}}>*</span></label>
                        <NiceSelect
                            options={provinces}
                            placeholder="Chọn tỉnh"
                            onChange={selectProvinceHandler}
                            name="province"
                            value={storyData.addressStory.province}
                        />
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="dash-input-wrapper mb-30">
                        <label htmlFor="district">Quận/Huyện<span style={{color: 'red'}}>*</span></label>
                        <NiceSelect
                            options={districts}
                            placeholder="Chọn quận"
                            onChange={selectDistrictHandler}
                            name="district"
                            value={storyData.addressStory.district}
                        />
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="dash-input-wrapper mb-30">
                        <label htmlFor="commune">Phường/Xã<span style={{color: 'red'}}>*</span></label>
                        <NiceSelect
                            options={communes}
                            placeholder="Chọn phường"
                            onChange={selectCommuneHandler}
                            name="commune"
                            value={storyData.addressStory.commune}
                        />
                    </div>
                </div>

                <div className="col-12">
                    <div className="dash-input-wrapper mb-30">
                        <label htmlFor="detailAddress">Địa chỉ chi tiết<span style={{color: 'red'}}>*</span></label>
                        <input
                            type="text"
                            name="detailAddress"
                            placeholder="Nhập địa chỉ chi tiết..."
                            value={storyData.addressStory.detailAddress}
                            onChange={(e) => onDataChange({
                                addressStory: {
                                    ...storyData.addressStory,
                                    detailAddress: e.target.value
                                }
                            })}
                            className="form-control"
                            required
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Overview;