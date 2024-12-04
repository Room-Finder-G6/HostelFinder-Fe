import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Sử dụng useRouter trong Next.js 14
import profileIcon_1 from "@/assets/images/dashboard/icon/icon_23.svg";
import profileIcon_2 from "@/assets/images/dashboard/icon/icon_24.svg";
import profileIcon_3 from "@/assets/images/dashboard/icon/icon_25.svg";
import { signOut } from "next-auth/react";

const Profile: React.FC = () => {
   const router = useRouter();

   const handleLogout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
      router.refresh();
      signOut({
         callbackUrl: "/",
      });
   };

   return (
      <>
         <div className="user-name-data">
            <ul className="dropdown-menu" aria-labelledby="profile-dropdown">
               <li>
                  <Link className="dropdown-item d-flex align-items-center" href="/dashboard/profile">
                     <Image src={profileIcon_1} alt="Profile Icon" className="lazy-img" />
                     <span className="ms-2 ps-1">Profile</span>
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
      </>
   );
};

export default Profile;
