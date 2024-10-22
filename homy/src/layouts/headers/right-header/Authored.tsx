import React from 'react';
import Image from "next/image";
import dashboardAvatar from "@/assets/images/dashboard/avatar_01.jpg";
import Profile from "@/layouts/headers/dashboard/Profile";
import Link from "next/link";

const Authored = () => {
    return (
        <div className="user-data d-flex align-items-center position-relative">
            <button
                className="user-avatar online position-relative rounded-circle dropdown-toggle"
                type="button"
                id="profile-dropdown"
                data-bs-toggle="dropdown"
                data-bs-auto-close="outside"
                aria-expanded="false"
                aria-label="User Profile"
            >
                <Image
                    src={dashboardAvatar}
                    alt="User Avatar"
                    className="lazy-img"
                    width={40}
                    height={40}
                />
            </button>
            <Link href="/dashboard/create-post" className="btn-two ms-3" target="_blank">
                <span>Create Post</span>
                <i className="fa-thin fa-arrow-up-right"></i>
            </Link>
            <Profile />
        </div>
    );
};

export default Authored;