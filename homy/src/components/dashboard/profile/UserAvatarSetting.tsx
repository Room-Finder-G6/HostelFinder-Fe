import Link from "next/link"

interface UserAvatarSettingProps {
    username: string;
    email: string;
    phone: string;
    fullName: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const UserAvatarSetting: React.FC<UserAvatarSettingProps> = ({fullName ,username, email, phone, onChange}) => {

    return (
        <div className="row">
            <div className="col-sm-6">
                <div className="dash-input-wrapper mb-30">
                    <label htmlFor="username">Tên*</label>
                    <input
                        type="text"
                        name="username"
                        value={fullName}
                        onChange={onChange}
                        placeholder="Nhập tên của bạn"
                    />
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
                    />
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
                    />
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
                    />
                </div>
                <div className="info-text d-sm-flex align-items-center justify-content-between mt-5">
                    <p className="m0">Đổi mật khẩu?
                        <Link href="/dashboard/account-settings/password-change">Click here</Link></p>
                </div>
            </div>
        </div>
    );
};

export default UserAvatarSetting;
