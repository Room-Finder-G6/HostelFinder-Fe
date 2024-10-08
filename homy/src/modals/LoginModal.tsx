import Image from "next/image";
import Link from "next/link";
import LoginForm from "@/components/forms/LoginForm";
import { useState } from "react";
import loginIcon_1 from "@/assets/images/icon/google.png";
import loginIcon_2 from "@/assets/images/icon/facebook.png";
import RegisterForm from "@/components/forms/RegisterForm";
import ForgotPassword from "@/components/forms/ForgotPassword";

const tabTitle: string[] = ["Login", "Signup"];

const LoginModal = ({ loginModal, setLoginModal }: any) => {
   const [activeTab, setActiveTab] = useState(0);
   const [showForgotPassword, setShowForgotPassword] = useState(false);

   const handleTabClick = (index: number) => {
      setActiveTab(index);
      setShowForgotPassword(false); // Reset Forgot Password when switching tabs
   };

   return (
      <>
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
                                       <h2>Welcome Back!</h2>
                                       <p className="fs-20 color-dark">
                                          Still don&apos;t have an account? <Link href="#" onClick={() => handleTabClick(1)}>Sign up</Link>
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
                                    <h2>Register</h2>
                                    <p className="fs-20 color-dark">
                                       Already have an account? <Link href="#" onClick={() => handleTabClick(0)}>Login</Link>
                                    </p>
                                 </div>
                                 <RegisterForm />
                              </div>
                           )}
                        </div>

                        <div className="d-flex align-items-center mt-30 mb-10">
                           <div className="line"></div>
                           <span className="pe-3 ps-3 fs-6">OR</span>
                           <div className="line"></div>
                        </div>

                        <div className="row">
                           <div className="col-sm-6">
                              <Link href="#" className="social-use-btn d-flex align-items-center justify-content-center tran3s w-100 mt-10">
                                 <Image src={loginIcon_1} alt="Google Icon" />
                                 <span className="ps-3">Signup with Google</span>
                              </Link>
                           </div>
                           <div className="col-sm-6">
                              <Link href="#" className="social-use-btn d-flex align-items-center justify-content-center tran3s w-100 mt-10">
                                 <Image src={loginIcon_2} alt="Facebook Icon" />
                                 <span className="ps-3">Signup with Facebook</span>
                              </Link>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </>
   );
};

export default LoginModal;
