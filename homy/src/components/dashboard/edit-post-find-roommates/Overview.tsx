import React from 'react';
import {Story} from "@/models/story";
import NiceSelect from "@/ui/NiceSelect";

interface OverviewProps {
    onDataChange: (data: Partial<Story>) => void;
    postData: Story;
}

const Overview: React.FC<OverviewProps> = ({onDataChange, postData}) => {
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
                        <label htmlFor="dateAvailable">Ngày có thể chuyển vào<span style={{color: 'red'}}>*</span></label>
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


            </div>

        </div>

    );
};

export default Overview;