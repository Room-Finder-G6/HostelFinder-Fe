"use client";
import { useCallback, useEffect, useState } from "react";
import DashboardHeaderTwo from "@/layouts/headers/dashboard/DashboardHeaderTwo";
import Link from "next/link";
import { toast } from "react-toastify"; // Assuming you're using toast for notifications
import apiInstance from "@/utils/apiInstance"; // Assuming axios instance configuration
import { jwtDecode } from "jwt-decode";
import { signOut } from "next-auth/react";
interface JwtPayload {
  UserId: string;
  Username: string;
}
const PasswordChangeBody = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("token");
    const callbackUrl = window.location.origin;
    signOut({
      callbackUrl: callbackUrl,
    });
  };

  // Hàm lấy userId từ token JWT
  const getUserInfoFromToken = useCallback(() => {
    const token = window.localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken: JwtPayload = jwtDecode<JwtPayload>(token); // Giải mã token để lấy userId
        setUserName(decodedToken.Username);
      } catch (error) {
        console.error("Error decoding token:", error);
        setError("Error decoding user token");
      }
    }
    setError("No token found");
    return null;
  }, []);

  useEffect(() => {
    getUserInfoFromToken();
  }, [getUserInfoFromToken]);

  const [formData, setFormData] = useState({
    username: "", // Replace with actual username from user context or session if available
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  useEffect(() => {
    if (userName) {
      setFormData((prevData) => ({
        ...prevData,
        username: userName,
      }));
    }
  }, [userName]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      toast.error("All fields are required", { position: "top-center" });
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match", { position: "top-center" });
      return;
    }

    try {
      const response = await apiInstance.post("/auth/change-password", {
        username: formData.username,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });

      if (response.status === 200) {
        toast.success(response.data.message, { position: "top-center" });
        setFormData({ ...formData, currentPassword: "", newPassword: "", confirmPassword: "" });
        handleLogout();
      }
    } catch (error: any) {
      toast.error(error.response?.data.message, { position: "top-center" });
    }
  };

  return (
    <div className="dashboard-body">
      <div className="position-relative">
        <DashboardHeaderTwo title="Change Password" />
        <div className="bg-white card-box border-20">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-12">
                <div className="dash-input-wrapper mb-20">
                  <label htmlFor="currentPassword">Mật khẩu cũ <span style={{ color: 'red' }}>*</span></label>
                  <input
                    type="password"
                    name="currentPassword"
                    placeholder="Nhập mật khẩu cũ"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="col-12">
                <div className="dash-input-wrapper mb-20">
                  <label htmlFor="newPassword">Mật khẩu mới <span style={{ color: 'red' }}>*</span></label>
                  <input
                    type="password"
                    name="newPassword"
                    placeholder="Nhập mật khẩu mới"
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="col-12">
                <div className="dash-input-wrapper mb-20">
                  <label htmlFor="Xác nhận mật khẩu">Xác nhận mật khẩu <span style={{ color: 'red' }}>*</span></label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Nhập lại mật khẩu mới"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="button-group d-inline-flex align-items-center">
              <button type="submit" className="dash-btn-two tran3s">Lưu và cập nhật</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PasswordChangeBody;
