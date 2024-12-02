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
            if (timeRange === 'custom' && startDate && endDate) {
                params.customStartDate = startDate.toISOString();
                params.customEndDate = endDate.toISOString();
            }

            const response = await apiInstance.get('/UserMembership/statistics', {
                params: { timeRange },
              });

            if (response.data && response.data.data) {
                setStatistics(response.data.data);
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
        if (customDates.start && customDates.end) {
            fetchStatistics('custom', customDates.start, customDates.end);
            setIsPopupVisible(false);
        }
    };

    const togglePopup = () => setIsPopupVisible(!isPopupVisible);

    useEffect(() => {
        fetchStatistics(timeRange);
    }, [timeRange]);

    // Lấy ngày hiện tại dưới dạng chuỗi yyyy-mm-dd
    const currentDate = new Date().toISOString().split('T')[0];

    return (
        <div className="dashboard">
            <h2>Thống Kê Doanh Thu {selectedTimeRange}</h2>
            <div className="filters">
                <button onClick={() => handleTimeRangeChange('yesterday')}>Hôm Qua</button>
                <button onClick={() => handleTimeRangeChange('today')}>Hôm Nay</button>
                <button onClick={() => handleTimeRangeChange('thisweek')}>Tuần Này</button>
                <button onClick={() => handleTimeRangeChange('thismonth')}>Tháng Này</button>
                <button onClick={() => handleTimeRangeChange('lastmonth')}>Tháng Trước</button>
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
                            max={currentDate} // Giới hạn ngày bắt đầu không được quá ngày hiện tại
                        />
                        <input
                            type="date"
                            value={customDates.end?.toISOString().split('T')[0] || ''}
                            onChange={handleEndDateChange}
                            max={currentDate} // Giới hạn ngày kết thúc không được quá ngày hiện tại
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
                        <h3>Tổng Doanh Thu {selectedTimeRange} {dateRangeText && <span>({dateRangeText})</span>}</h3>
                        <p>{statistics?.totalPrice?.toLocaleString()} VND</p>
                    </div>
                    <div className="stat">
                        <h3>Tổng Gói {selectedTimeRange} {dateRangeText && <span>({dateRangeText})</span>}</h3>
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
                        <h3>Tổng Lượt Push Top Sử Dụng</h3>
                        <p>{statistics?.totalPushTopUsed}</p>
                    </div>

                    <div className="membership-details">
                        <h3>Chi Tiết Các Gói</h3>
                        {statistics?.membershipDetails?.map((membership: any, index: number) => (
                            <div key={index} className="membership-item">
                                <p><strong>{membership.membershipName}</strong></p>
                                <p>Giá: {membership.totalPrice?.toLocaleString()} VND</p>
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
