import Link from "next/link"

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
                    <label htmlFor="fullName">Tên*</label>
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
                    <label htmlFor="username">Tên đăng nhập*</label>
                    <input
                        type="text"
                        name="username"
                        value={username}
                        onChange={onChange}
                        placeholder="Nhập tên đăng nhập"
                        required
                    />
                    {errors.username && (
                        <div className="error-message text-danger mt-1">{errors.username}</div>
                    )}
                </div>
            </div>

            <div className="col-sm-6">
                <div className="dash-input-wrapper mb-30">
                    <label htmlFor="email">Email*</label>
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
                    <label htmlFor="phone">Số điện thoại*</label>
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
                <div className="info-text d-sm-flex align-items-center justify-content-between mt-5">
                    <p className="m0">Đổi mật khẩu?
                        <Link href="/dashboard/account-settings/password-change"> Ấn vào đây</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UserAvatarSetting;