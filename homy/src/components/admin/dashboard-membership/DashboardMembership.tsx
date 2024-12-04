"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DashboardMembership.css';
import apiInstance from "@/utils/apiInstance";
const DashboardMembership = () => {
    const [statistics, setStatistics] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [timeRange, setTimeRange] = useState('today');
    const [selectedTimeRange, setSelectedTimeRange] = useState('Hôm Nay');
    const [customDates, setCustomDates] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });
    const [dateRangeText, setDateRangeText] = useState<string>('');
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const fetchStatistics = async (timeRange: string, startDate?: Date, endDate?: Date) => {
        setLoading(true);
        setErrorMessage('');
        try {
            const params: any = { timeRange };

            // Nếu timeRange là 'custom' và người dùng đã chọn ngày bắt đầu và kết thúc
            if (timeRange === 'custom' && startDate && endDate) {
                // Nếu ngày bắt đầu lớn hơn ngày kết thúc, thì trả về lỗi
                if (startDate > endDate) {
                    setErrorMessage('Ngày bắt đầu không thể lớn hơn ngày kết thúc.');
                    return;
                }
                params.customStartDate = startDate.toISOString();
                params.customEndDate = endDate.toISOString();
            }

            // Gửi request API
            const response = await apiInstance.get('/UserMembership/statistics', {
                params: { ...params }
            });

            if (response.data && response.data.data) {
                setStatistics(response.data.data);
                // Nếu là thời gian tùy chỉnh, cập nhật thông tin khoảng thời gian
                if (timeRange === 'custom') {
                    setDateRangeText(`Từ ${startDate?.toLocaleDateString()} đến ${endDate?.toLocaleDateString()}`);
                } else {
                    setDateRangeText('');
                }
            } else {
                setErrorMessage('Dữ liệu trả về không hợp lệ');
            }
        } catch (error) {
            console.error('Error fetching statistics', error);
            setErrorMessage('Không có dữ liệu.');
        } finally {
            setLoading(false);
        }
    };


    const handleTimeRangeChange = (range: string) => {
        let timeLabel = '';
        switch (range) {
            case 'yesterday': timeLabel = 'Hôm Qua'; break;
            case 'today': timeLabel = 'Hôm Nay'; break;
            case 'thisweek': timeLabel = 'Tuần Này'; break;
            case 'thismonth': timeLabel = 'Tháng Này'; break;
            case 'lastmonth': timeLabel = 'Tháng Trước'; break;
            case 'thisyear': timeLabel = 'Năm Này'; break;
            case 'custom': timeLabel = 'Tùy Chỉnh'; break;
            default: timeLabel = 'Hôm Nay'; break;
        }
        setSelectedTimeRange(timeLabel);
        setTimeRange(range);
        fetchStatistics(range);
    };

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newStartDate = e.target.value ? new Date(e.target.value) : null;
        setCustomDates((prevDates) => ({ ...prevDates, start: newStartDate }));
    };

    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newEndDate = e.target.value ? new Date(e.target.value) : null;
        setCustomDates((prevDates) => ({ ...prevDates, end: newEndDate }));
    };

    const handleCustomDateChange = () => {
        // Kiểm tra xem người dùng có chọn ngày bắt đầu và kết thúc không
        if (customDates.start && customDates.end) {
            fetchStatistics('custom', customDates.start, customDates.end);
            setIsPopupVisible(false);
        } else {
            // Nếu chưa chọn ngày, chọn ngày hiện tại
            const currentDate = new Date();
            setCustomDates({ start: currentDate, end: currentDate });
            fetchStatistics('custom', currentDate, currentDate);
            setIsPopupVisible(false);
        }
    };



    const togglePopup = () => setIsPopupVisible(!isPopupVisible);

    useEffect(() => {
        fetchStatistics(timeRange);
    }, [timeRange]);
    const currentDate = new Date().toISOString().split('T')[0];

    return (
        <div className="dashboard">
            <h2>Thống Kê Doanh Thu {selectedTimeRange}</h2>
            <div className="filters">
                <button onClick={() => handleTimeRangeChange('yesterday')}>Hôm Qua</button>
                <button onClick={() => handleTimeRangeChange('today')}>Hôm Nay</button>
                <button onClick={() => handleTimeRangeChange('thisweek')}>Tuần Này</button>
                <button onClick={() => handleTimeRangeChange('thismonth')}>Tháng Này</button>
                <button onClick={() => handleTimeRangeChange('thisyear')}>Năm Này</button>
                <button onClick={togglePopup}>Tùy Chỉnh</button>
            </div>

            {isPopupVisible && (
                <div className="popup">
                    <div className="popup-content">
                        <input
                            type="date"
                            value={customDates.start?.toISOString().split('T')[0] || ''}
                            onChange={handleStartDateChange}
                            max={currentDate} // Giới hạn ngày bắt đầu không quá ngày hiện tại
                        />

                        <input
                            type="date"
                            value={customDates.end?.toISOString().split('T')[0] || ''}
                            onChange={handleEndDateChange}
                            max={currentDate} // Giới hạn ngày kết thúc không quá ngày hiện tại
                        />

                        <button onClick={togglePopup}>Đóng</button>
                        <button onClick={handleCustomDateChange}>Xác Nhận</button>

                    </div>
                </div>
            )}

            {loading ? (
                <div>Loading...</div>
            ) : errorMessage ? (
                <div className="error">{errorMessage}</div>
            ) : (
                <div className="statistics">
                    <div className="stat">
                        <h3>Tổng Doanh Thu  {dateRangeText && <span>({dateRangeText})</span>}</h3>
                        <p>{statistics?.totalPrice?.toLocaleString()} VND</p>
                    </div>

                    <div className="stat">
                        <h3>Tổng Gói  {dateRangeText && <span>({dateRangeText})</span>}</h3>
                        <p>{statistics?.totalMemberships}</p>
                    </div>
                    <div className="stat">
                        <h3>Tổng Gói Đã Thanh Toán</h3>
                        <p>{statistics?.totalPaidMemberships}</p>
                    </div>
                    <div className="stat">
                        <h3>Tổng Bài Đăng Sử Dụng</h3>
                        <p>{statistics?.totalPostsUsed}</p>
                    </div>
                    <div className="stat">
                        <h3>Tổng Lượt Đẩy Bài Sử Dụng</h3>
                        <p>{statistics?.totalPushTopUsed}</p>
                    </div>

                    <div className="membership-details">
                        <h3>Chi Tiết Các Gói</h3>
                        {statistics?.membershipDetails?.map((membership: any, index: number) => (
                            <div key={index} className="membership-item">
                                <p><strong>{membership.membershipName}</strong></p>
                                <p>Doanh Thu: {membership.totalPrice?.toLocaleString()} VND</p>
                                <p>Số Người: {membership.totalUsers}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardMembership;
