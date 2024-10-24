import { useState } from "react";
import Link from "next/link";
import { toast } from 'react-toastify';
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import Image from "next/image";
import OpenEye from "@/assets/images/icon/icon_68.svg";
import apiInstance from "@/utils/apiInstance";

interface FormData {
   userName: string;
   email: string;
   password: string;
   phone: string;
}

const RegisterForm = () => {

   const schema = yup
      .object({
         userName: yup.string().required().label("Name"),
         email: yup.string().required().email().label("Email"),
         password: yup.string().required().label("Password"),
         phone: yup.string().required().label("Phone"),
      })
      .required();

   const { register, handleSubmit, reset, formState: { errors }, } = useForm<FormData>({ resolver: yupResolver(schema), });
   
   const onSubmit = async (data: FormData) => {
      try {
         const response = await apiInstance.post("auth/register", data);
         if (response.status === 200 && response.data.succeeded) {
            const { message } = response.data;
            toast.success(message || "Registration successfully", { position: 'top-center' });
            reset();
            if (response.data.data.role === "1") {
               window.location.href = "/";
            }
         }
      } catch (error: any) {
         if (error.response && error.response.status === 400) {
            const errors = error.response.data.errors;
            const errorsMessage = Array.isArray(errors) ? errors.join('\n') : errors;
            toast.error(errorsMessage, { position: "top-center" });
         } else {
            toast.error("Something went wrong. Please try again.", { position: 'top-center' });
         }
      }
   };

   const [isPasswordVisible, setPasswordVisibility] = useState(false);
   const [isAgreed, setIsAgreed] = useState(false);

   const togglePasswordVisibility = () => {
      setPasswordVisibility(!isPasswordVisible);
   };

   const handleAgreeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsAgreed(e.target.checked);
   };

   return (
      <form onSubmit={handleSubmit(onSubmit)}>
         <div className="row">
            <div className="col-12">
               <div className="input-group-meta position-relative mb-25">
                  <label>Người dùng*</label>
                  <input type="text" {...register("userName")} placeholder="Nhập tên người dùng" />
                  <p className="form_error">{errors.userName?.message}</p>
               </div>
            </div>
            <div className="col-12">
               <div className="input-group-meta position-relative mb-25">
                  <label>Email*</label>
                  <input type="email" {...register("email")} placeholder="Hãy nhập email của bạn" />
                  <p className="form_error">{errors.email?.message}</p>
               </div>
            </div>
            <div className="col-12">
               <div className="input-group-meta position-relative mb-20">
                  <label>Mật khẩu*</label>
                  <input type={isPasswordVisible ? "text" : "password"} {...register("password")} placeholder="Nhập mật khẩu" className="pass_log_id" />
                  <span className="placeholder_icon">
                     <span className={`passVicon ${isPasswordVisible ? "eye-slash" : ""}`}>
                        <Image onClick={togglePasswordVisibility} src={OpenEye} alt="" />
                     </span>
                  </span>
                  <p className="form_error">{errors.password?.message}</p>
               </div>
            </div>
            <div className="col-12">
               <div className="input-group-meta position-relative mb-25">
                  <label>Số điện thoại*</label>
                  <input type="number" {...register("phone")} placeholder="Số điện thoại của bạn" />
                  <p className="form_error">{errors.phone?.message}</p>
               </div>
            </div>
            <div className="col-12">
               <div className="agreement-checkbox d-flex justify-content-between align-items-center">
                  <div>
                     <input type="checkbox" id="agree" onChange={handleAgreeChange} /> 
                     <label htmlFor="agree">Bằng cách nhấn nút &quot;Đăng ký&quot; , bạn đồng ý với  <Link href="#">các điều kiện</Link> & <Link href="#">chính sách</Link></label>
                  </div>
               </div>
            </div>
            <div className="col-12">
               <button
                  type="submit"
                  className={`btn-two w-100 text-uppercase d-block mt-20 ${isAgreed ? "enabled-button" : "disabled-button"}`}
                  disabled={!isAgreed}
               >
                  SIGN UP
               </button>
            </div>
         </div>
      </form>
   );
}

export default RegisterForm;
