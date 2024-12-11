import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Sử dụng useRouter trong Next.js 14
import profileIcon_1 from "@/assets/images/dashboard/icon/icon_23.svg";
import profileIcon_2 from "@/assets/images/dashboard/icon/icon_24.svg";
import profileIcon_3 from "@/assets/images/dashboard/icon/icon_25.svg";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";

const Profile: React.FC = () => {
    const router = useRouter();

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined' && localStorage.getItem('token')) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogout = async () => {
        localStorage.removeItem("userName");
        localStorage.removeItem("token");
        // Đăng xuất khỏi NextAuth
        await signOut({
            redirect: false,
        });
        const callbackUrl = process.env.NEXTAUTH_URL || "/";
        window.location.href = callbackUrl;
    };

    return (
        <>
            {isLoggedIn ? (
                <div className="user-name-data">
                    <ul className="dropdown-menu" aria-labelledby="profile-dropdown">
                        <li>
                            <Link className="dropdown-item d-flex align-items-center" href="/profile">
                                <Image src={profileIcon_1} alt="Profile Icon" className="lazy-img" />
                                <span className="ms-2 ps-1">Trang cá nhân</span>
                            </Link>
                        </li>
                        <li>
                            <button
                                type="button"
                                className="dropdown-item d-flex align-items-center"
                                onClick={handleLogout}
                            >
                                <Image src={profileIcon_3} alt="Logout Icon" className="lazy-img" />
                                <span className="ms-2 ps-1">Đăng xuất</span>
                            </button>
                        </li>
                    </ul>
                </div>
            ) : (
                <li>
                    <Link href="#" data-bs-toggle="modal" data-bs-target="#loginModal"
                        className="btn-one"><i className="fa-regular fa-lock"></i> <span
                            style={{ fontFamily: "'Fira Code', sans-serif" }}>Đăng nhập</span></Link>
                </li>
            )}
        </>
    );
};

export default Profile;
