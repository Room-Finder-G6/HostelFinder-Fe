"use client";
import { useState } from "react";
import DashboardHeaderTwo from "@/layouts/headers/dashboard/DashboardHeaderTwo";
import Link from "next/link";
import { toast } from "react-toastify"; // Assuming you're using toast for notifications
import apiInstance from "@/utils/apiInstance"; // Assuming axios instance configuration

const PasswordChangeBody = () => {
  const [formData, setFormData] = useState({
    username: "", // Replace with actual username from user context or session if available
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

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
        toast.success("Password updated successfully", { position: "top-center" });
        setFormData({ ...formData, currentPassword: "", newPassword: "", confirmPassword: "" });
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Failed to update password", { position: "top-center" });
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
                  <label htmlFor="currentPassword">Old Password*</label>
                  <input
                    type="password"
                    name="currentPassword"
                    placeholder="Type current password"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="col-12">
                <div className="dash-input-wrapper mb-20">
                  <label htmlFor="newPassword">New Password*</label>
                  <input
                    type="password"
                    name="newPassword"
                    placeholder="Type new password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="col-12">
                <div className="dash-input-wrapper mb-20">
                  <label htmlFor="confirmPassword">Confirm Password*</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm new password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="button-group d-inline-flex align-items-center">
              <button type="submit" className="dash-btn-two tran3s">Save & Updated</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PasswordChangeBody;
