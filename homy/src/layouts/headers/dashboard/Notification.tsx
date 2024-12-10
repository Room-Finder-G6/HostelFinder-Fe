import { useState, useEffect } from "react";
import Image from "next/image";
import { jwtDecode } from "jwt-decode";
import apiInstance from "@/utils/apiInstance";
import notificationIcon from "@/assets/images/dashboard/icon/icon_36.svg";
import './notification.css';

// Khai báo interface cho JWT Payload
interface JwtPayload {
  UserId: string;
  Role: string;
}

const Notification = () => {
  const [notifications, setNotifications] = useState<any[]>([]); 
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null); 
  const [selectedNotification, setSelectedNotification] = useState<any | null>(null);

  const getUserIdFromToken = (): string | null => {
    const token = localStorage.getItem("token");
    if (!token) {
      return null;
    }
    try {
      const decodedToken: JwtPayload = jwtDecode(token);
      return decodedToken.UserId || null;
    } catch (error) {
      console.error("Invalid token", error);
      return null;
    }
  };

  const fetchNotifications = async (userId: string) => {
    setLoading(true);
    try {
      const response = await apiInstance.get(`/Notification/messages/${userId}`);
      if (response.status === 200) {
        const data = response.data;
        if (Array.isArray(data)) {
          setNotifications(data);
        } else {
          setError("Unexpected response format");
        }
      }
    } catch (error) {
      setError("Failed to fetch notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchedUserId = getUserIdFromToken();
    if (fetchedUserId) {
      setUserId(fetchedUserId);
      fetchNotifications(fetchedUserId);
    } else {
      setError("No user ID found");
    }
  }, []);

  const handleNotificationClick = (notification: any) => {
    setSelectedNotification(notification);
  };

  return (
    <div className="profile-notification">
      {/* Thông báo icon và dropdown */}
    
      <div className="dropdown-menu">
        <ul className="notify-list">
          {loading && <li>Loading notifications...</li>}
          {error && <li>{error}</li>}
          {notifications.length === 0 ? (
            <li>No notifications</li>
          ) : (
            notifications.map((notification, index) => (
              <li key={index} className={`notification-item ${notification.read ? "" : "unread"}`} onClick={() => handleNotificationClick(notification)}>
                <div className="notification-icon">
                  <Image src={notification.icon || notificationIcon} alt="Notification" />
                </div>
                <div className="notification-text">
                  <h6>{notification.message}</h6>
                  <span className="time">{notification.timeAgo || "Just now"}</span>
                </div>
                
              </li>
              
            ))
            
          )}
        </ul>
        {/* Hiển thị chi tiết thông báo khi bấm */}
        {selectedNotification && (
          <div className="notification-detail">
            <p>{selectedNotification.message}</p>
            <p className="time">{selectedNotification.createdOn}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notification;
