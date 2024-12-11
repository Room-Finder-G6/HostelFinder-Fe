"use client";
import { useState, useEffect } from "react";
import DashboardHeaderTwo from "@/layouts/headers/dashboard/DashboardHeaderTwo";
import MailOffcanvas from "./MailOffcanvas";
import Link from "next/link";
import Image from "next/image";
import apiInstance from "@/utils/apiInstance";
import { jwtDecode } from "jwt-decode"; // Đảm bảo jwt-decode đã được cài đặt
import icon_1 from "@/assets/images/dashboard/icon/icon_26.svg";
import icon_2 from "@/assets/images/dashboard/icon/icon_27.svg";
import icon_3 from "@/assets/images/dashboard/icon/icon_43.svg";

// Define Notification Type
type Notification = {
  message: string;
  timeAgo: string;
  icon?: string;
  read: boolean;
};

interface JwtPayload {
  UserId: string;
  Role: string;
}

const MessageBody = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Function to get JWT Token
  const getToken = (): string | null => {
    return localStorage.getItem("token");
  };

  // Decode JWT to get UserId
  const getUserIdFromToken = (): string | null => {
    const token = getToken();
    if (token) {
      try {
        const decodedToken: JwtPayload = jwtDecode<JwtPayload>(token);
        return decodedToken.UserId;
      } catch (error) {
        console.error("Error decoding token:", error);
        setError("Error decoding user token");
        return null;
      }
    }
    setError("No token found");
    return null;
  };

  // Fetch notifications from API
  const fetchNotifications = async (userId: string) => {
    const token = getToken();

    if (userId && token) {
      try {
        const response = await apiInstance.get(`/Notification/messages/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setNotifications(response.data); // Update notifications with response data
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setError("Failed to fetch notifications.");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const userId = getUserIdFromToken();
    if (userId) {
      fetchNotifications(userId); // Fetch notifications when component mounts
    }
  }, []);

  if (loading) {
    return <p>Loading notifications...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="dashboard-body">
      <div className="position-relative">
        <DashboardHeaderTwo title="Messages" />

        <div className="row gx-0 align-items-center">
          <MailOffcanvas />
          <div className="col-lg-4">
            <div className="d-flex align-items-center justify-content-between">
              <h2 className="main-title d-block d-lg-none m0">Messages</h2>
              <Link
                className="new-message-compose rounded-circle"
                data-bs-toggle="offcanvas"
                href="#offcanvasScrolling"
                role="button"
                aria-controls="offcanvasScrolling"
              >
                +
              </Link>
            </div>
          </div>
          <div className="col-lg-8">
            <div className="message-pagination ps-lg-4 ps-xxl-5 d-flex align-items-center justify-content-between md-mt-40">
              <Link href="#" className="prev-msg">
                <Image src={icon_1} alt="prev" className="lazy-img" />
              </Link>
              <div className="d-flex align-items-center">
                <Link href="#">
                  <i className="bi bi-chevron-left"></i>
                </Link>
                <span>1-5 of 120</span>
                <Link href="#">
                  <i className="bi bi-chevron-right"></i>
                </Link>
              </div>
              <Link href="#" className="next-msg">
                <Image src={icon_2} alt="next" className="lazy-img" />
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white card-box border-20 p0 mt-30">
          <div className="message-wrapper">
            <div className="row gx-0">
              <div className="col-lg-4">
                <div className="message-sidebar pt-20">
                  <div className="ps-3 pe-3 ps-xxl-4 pe-xxl-4">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="page-title fw-500">Inbox</div>
                      <div className="action-dots float-end">
                        <button
                          className="action-btn dropdown-toggle"
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <span></span>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end">
                          <li>
                            <Link className="dropdown-item" href="#">
                              Sent
                            </Link>
                          </li>
                          <li>
                            <Link className="dropdown-item" href="#">
                              Important
                            </Link>
                          </li>
                          <li>
                            <Link className="dropdown-item" href="#">
                              Draft
                            </Link>
                          </li>
                          <li>
                            <Link className="dropdown-item" href="#">
                              Trash
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <form onSubmit={(e) => e.preventDefault()} className="search-form mt-20 mb-20">
                      <input type="text" placeholder="Search contacts" />
                      <button>
                        <Image src={icon_3} alt="search" className="lazy-img m-auto" />
                      </button>
                    </form>

                    <div className="message_filter d-flex align-items-center justify-content-between mb-20" id="module_btns">
                      <button className="filter_btn active">All</button>
                      <button className="filter_btn">Important</button>
                      <button className="filter_btn">Read</button>
                    </div>

                    <ul className="message-list">
                      {notifications.length === 0 ? (
                        <li>No messages found</li>
                      ) : (
                        notifications.map((notification, index) => (
                          <li key={index} className={`d-flex align-items-center ${notification.read ? "" : "unread"}`}>
                            <Image
                              src={notification.icon || icon_1} // Use default icon if no icon is provided
                              alt="Notification Icon"
                              className="lazy-img icon"
                            />
                            <div className="flex-fill ps-2">
                              <h6>{notification.message}</h6>
                              <span className="time">{notification.timeAgo || "Just now"}</span>
                            </div>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBody;
