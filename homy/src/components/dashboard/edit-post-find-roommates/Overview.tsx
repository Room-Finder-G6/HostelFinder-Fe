import React from 'react';
import {Story} from "@/models/story";
import NiceSelect from "@/ui/NiceSelect";

interface OverviewProps {
    onDataChange: (data: Partial<Story>) => void;
    postData: Story;
    provinces: { value: string; text: string }[];
    districts: { value: string; text: string }[];
    communes: { value: string; text: string }[];
    onSelectProvince: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onSelectDistrict: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onSelectCommune: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}


const Overview: React.FC<OverviewProps> = ({
                                               onDataChange,
                                               postData,
                                               provinces,
                                               districts,
                                               communes,
                                               onSelectProvince,
                                               onSelectCommune,
                                               onSelectDistrict
                                           }) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        onDataChange({[name]: value});
    };

    return (
        <div className="bg-white card-box border-20">
            <div className="row align-items-end">
                <div className="dash-input-wrapper mb-30">
                    <label htmlFor="title">Tiêu đề<span style={{color: "red"}}>*</span></label>
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
                    <label htmlFor="description">Mô tả chi tiết<span style={{color: "red"}}>*</span></label>
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

                <div className="col-md-6">
                    <div className="dash-input-wrapper mb-30">
                        <label htmlFor="monthlyRentCost">Tiền thuê hàng tháng<span
                            style={{color: "red"}}>*</span></label>
                        <input type="number" name="monthlyRentCost" value={postData.monthlyRentCost} min="0" required/>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="dash-input-wrapper mb-30">
                        <label htmlFor="size">Diện tích phòng<span style={{color: "red"}}>*</span></label>
                        <input type="number" name="size" value={postData.size} min="0" required/>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="dash-input-wrapper mb-30">
                        <label htmlFor="hostelId">Loại phòng<span style={{color: "red"}}>*</span></label>
                        <NiceSelect
                            className="nice-select"
                            options={[
                                {value: "1", text: "Phòng trọ"},
                                {value: "2", text: "Chung cư"},
                                {value: "3", text: "Chung cư mini"},
                            ]}
                            placeholder="Chọn loại phòng"
                            onChange={(e) => onDataChange({roomType: Number(e.target.value)})}
                            name="roomType"
                            defaultCurrent={postData.roomType}
                            value={String(postData.roomType)}
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
                            value={postData.dateAvailable}
                            onChange={handleInputChange}
                            className="form-control"
                            required
                        />
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="dash-input-wrapper mb-30">
                        <label htmlFor="province">Tỉnh/Thành phố*</label>
                        <NiceSelect
                            className="nice-select"
                            options={provinces}
                            onChange={onSelectProvince}
                            value={postData.address.province}
                            placeholder="Chọn Tỉnh/Thành phố"
                            name="province"
                            defaultCurrent={0}
                            required
                        />
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="dash-input-wrapper mb-30">
                        <label htmlFor="district">Quận/Huyện*</label>
                        <NiceSelect
                            className="nice-select"
                            options={districts}
                            onChange={onSelectDistrict}
                            value={postData.address.district}
                            placeholder="Chọn Quận/Huyện"
                            name="district"
                            defaultCurrent={0}
                            required
                        />
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="dash-input-wrapper mb-30">
                        <label htmlFor="commune">Xã/Phường*</label>
                        <NiceSelect
                            className="nice-select"
                            options={communes}
                            onChange={onSelectCommune}
                            value={postData.address.commune}
                            placeholder="Chọn Xã/Phường"
                            name="commune"
                            defaultCurrent={0}
                            required
                        />
                    </div>
                </div>
            </div>
        </div>

    );
};

export default Overview;