"use client"
import { useState } from "react";
import Link from "next/link";
import { toast } from 'react-toastify';
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import Image from "next/image";
import apiInstance from "@/utils/apiInstance";
import OpenEye from "@/assets/images/icon/icon_68.svg";
import agent from "@/data/agent";

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

   const { register, handleSubmit, reset, 
      formState: { errors }, } = useForm<FormData>({ resolver: yupResolver(schema), });
   
   const onSubmit = async (data: FormData) => {
      try{
         const response = await apiInstance.post("auth/register", data);
         console.log(response);
         if(response.status === 200 && response.data.succeeded) {
            const {message} = response.data;
            toast.success(message || "Registration successfully", { position: 'top-center' });
         }
         reset();
         if(response.data.data.role === "1") {
            window.location.href = "/";
         }
         console.log(response.data.data.role);
      }catch(error : any) {
         if(error.status === 400) {
            toast.error(error.response.data.message,  {position: "top-center" });
         }
         else{
         toast.error("Something went wrong. Please try again.", {position : 'top-center'});
         }
      }
   };

   const [isPasswordVisible, setPasswordVisibility] = useState(false);

   const togglePasswordVisibility = () => {
      setPasswordVisibility(!isPasswordVisible);
   };

   return (
      <form onSubmit={handleSubmit(onSubmit)}>
         <div className="row">
            <div className="col-12">
               <div className="input-group-meta position-relative mb-25">
                  <label>User Name*</label>
                  <input type="text" {...register("userName")} placeholder="Zubayer Hasan" />
                  <p className="form_error">{errors.userName?.message}</p>
               </div>
            </div>
            <div className="col-12">
               <div className="input-group-meta position-relative mb-25">
                  <label>Email*</label>
                  <input type="email" {...register("email")} placeholder="Youremail@gmail.com" />
                  <p className="form_error">{errors.email?.message}</p>
               </div>
            </div>
            <div className="col-12">
               <div className="input-group-meta position-relative mb-20">
                  <label>Password*</label>
                  <input type={isPasswordVisible ? "text" : "password"} {...register("password")} placeholder="Enter Password" className="pass_log_id" />
                  <span className="placeholder_icon"><span className={`passVicon ${isPasswordVisible ? "eye-slash" : ""}`}><Image onClick={togglePasswordVisibility} src={OpenEye} alt="" /></span></span>
                  <p className="form_error">{errors.password?.message}</p>
               </div>
            </div>
            <div className="col-12">
               <div className="input-group-meta position-relative mb-25">
                  <label>Phone*</label>
                  <input type="text" {...register("phone")} placeholder="Your phone number" />
                  <p className="form_error">{errors.phone?.message}</p>
               </div>
            </div>
            <div className="col-12">
               <div className="agreement-checkbox d-flex justify-content-between align-items-center">
                  <div>
                     <input type="checkbox" id="remember2" />
                     <label htmlFor="remember2">By hitting the &quot;Register&quot; button, you agree to the <Link href="#">Terms conditions</Link> & <Link href="#">Privacy Policy</Link></label>
                  </div>
               </div>
            </div>
            <div className="col-12">
               <button type="submit" className="btn-two w-100 text-uppercase d-block mt-20">SIGN UP</button>
            </div>
         </div>
      </form>
   )
}

export default RegisterForm;