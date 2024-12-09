import Link from "next/link"
import React from "react";

interface UserAvatarSettingProps {
    username: string;
    email: string;
    phone: string;
    fullName: string;
    errors?: {
        username?: string;
        fullName?: string;
        email?: string;
        phone?: string;
    };
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const UserAvatarSetting: React.FC<UserAvatarSettingProps> = ({
                                                                 fullName,
                                                                 username,
                                                                 email,
                                                                 phone,
                                                                 errors = {},
                                                                 onChange
                                                             }) => {
    return (
        <div className="row">
            <div className="col-sm-6">
                <div className="dash-input-wrapper mb-30">
                    <label htmlFor="fullName">Tên<span style={{color: 'red'}}>*</span></label>
                    <input
                        type="text"
                        name="fullName"
                        value={fullName}
                        onChange={onChange}
                        placeholder="Nhập tên của bạn"
                        required
                    />
                    {errors.fullName && (
                        <div className="error-message text-danger mt-1">{errors.fullName}</div>
                    )}
                </div>
            </div>

            <div className="col-sm-6">
                <div className="dash-input-wrapper mb-30">
                    <label htmlFor="username">Tên đăng nhập<span style={{color: 'red'}}>*</span></label>
                    <input
                        type="text"
                        name="username"
                        value={username}
                        onChange={onChange}
                        placeholder="Nhập tên đăng nhập"
                        required
                        disabled={true}
                    />
                    {errors.username && (
                        <div className="error-message text-danger mt-1">{errors.username}</div>
                    )}
                </div>
            </div>

            <div className="col-sm-6">
                <div className="dash-input-wrapper mb-30">
                    <label htmlFor="email">Email<span style={{color: 'red'}}>*</span></label>
                    <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={onChange}
                        placeholder="Nhập email"
                        required
                    />
                    {errors.email && (
                        <div className="error-message text-danger mt-1">{errors.email}</div>
                    )}
                </div>
            </div>

            <div className="col-sm-6">
                <div className="dash-input-wrapper mb-30">
                    <label htmlFor="phone">Số điện thoại<span style={{color: 'red'}}>*</span></label>
                    <input
                        type="tel"
                        name="phone"
                        value={phone}
                        onChange={onChange}
                        placeholder="Nhập số điện thoại"
                        required
                    />
                    {errors.phone && (
                        <div className="error-message text-danger mt-1">{errors.phone}</div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default UserAvatarSetting;