import Image from "next/image";
import Link from "next/link";
import LoginForm from "@/components/forms/LoginForm";
import { useEffect, useState } from "react";
import loginIcon_1 from "@/assets/images/icon/google.png";
import loginIcon_2 from "@/assets/images/icon/facebook.png";
import RegisterForm from "@/components/forms/RegisterForm";
import ForgotPassword from "@/components/forms/ForgotPassword";
import { signIn } from "next-auth/react";
import apiInstance from "@/utils/apiInstance";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const tabTitle: string[] = ["Đăng nhập", "Đăng ký"];

const LoginModal = ({ loginModal, setLoginModal }: any) => {
   const router = useRouter();
   const [activeTab, setActiveTab] = useState(0);
   const [showForgotPassword, setShowForgotPassword] = useState(false);


   const handleTabClick = (index: number) => {
      setActiveTab(index);
      setShowForgotPassword(false); // Reset Forgot Password when switching tabs
   };

   const handleGoogleSign = () => {
      signIn("google");
   }
   return (
       <div className="modal fade" id="loginModal" tabIndex={-1} aria-hidden="true">
          <div className="modal-dialog modal-fullscreen modal-dialog-centered">
             <div className="container">
                <div className="user-data-form modal-content">
                   <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                   <div className="form-wrapper m-auto">
                      <ul className="nav nav-tabs w-100">
                         {tabTitle.map((tab, index) => (
                             <li key={index} onClick={() => handleTabClick(index)} className="nav-item">
                                <button className={`nav-link ${activeTab === index ? "active" : ""}`}>{tab}</button>
                             </li>
                         ))}
                      </ul>
                      <div className="tab-content mt-30">
                         {/* If showForgotPassword is true, render ForgotPassword */}
                         {showForgotPassword ? (
                             <ForgotPassword setShowForgotPassword={setShowForgotPassword} />
                         ) : (
                             // Login Tab
                             activeTab === 0 && (
                                 <div className="tab-pane fade show active">
                                    <div className="text-center mb-20">
                                       <h2>Chào mừng bạn!</h2>
                                       <p className="fs-20 color-dark">
                                          Bạn chưa có tài khoản? <Link href="#" onClick={() => handleTabClick(1)}>Đăng ký</Link>
                                       </p>
                                    </div>
                                    <LoginForm setShowForgotPassword={setShowForgotPassword} />
                                 </div>
                             )
                         )}

                         {/* Signup Tab */}
                         {activeTab === 1 && (
                             <div className="tab-pane fade show active">
                                <div className="text-center mb-20">
                                   <h2>Đăng ký</h2>
                                   <p className="fs-20 color-dark">
                                      Bạn đã có tài khoản? <Link href="#" onClick={() => handleTabClick(0)}>Đăng nhập</Link>
                                   </p>
                                </div>
                                <RegisterForm />
                             </div>
                         )}
                      </div>

                      {/* <div className="d-flex align-items-center mt-30 mb-10">
                        <div className="line"></div>
                        <span className="pe-3 ps-3 fs-6">OR</span>
                        <div className="line"></div>
                     </div> */}

                      <div className="row">
                         {/* <div className="col-sm-12">
                           <button
                              onClick={handleGoogleSign}
                              className="social-use-btn d-flex align-items-center justify-content-center tran3s w-100 mt-10"
                           >
                              <Image src={loginIcon_1} alt="Google Icon" />
                              <span className="ps-3">Đăng nhập với google</span>
                           </button>
                        </div> */}
                         {/* <div className="col-sm-6">
                              <Link href="#" className="social-use-btn d-flex align-items-center justify-content-center tran3s w-100 mt-10">
                                 <Image src={loginIcon_2} alt="Facebook Icon" />
                                 <span className="ps-3">Signup with Facebook</span>
                              </Link>
                           </div> */}
                      </div>
                   </div>
                </div>
             </div>
          </div>
       </div >
   );
};

export default LoginModal;