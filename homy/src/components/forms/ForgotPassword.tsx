import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';

interface FormData {
   name: string;
   email: string;
   password: string;
   confirmPassword: string;
   newPassword: string;
}

const ForgotPassword = ({ setShowForgotPassword }: any) => {
   const [step, setStep] = useState(1); // Step 1: Nhập email, Step 2: Đặt mật khẩu mới
   const [email, setEmail] = useState('');

   // Validation schema for email input
   const emailSchema = yup.object({
      email: yup.string().required().email().label("Email"),
   }).required();

   // const passwordSchema = yup.object({
   //    newPassword: yup.string().min(6).required().label("New Password"),
   //    confirmPassword: yup.string().oneOf([yup.ref('newPassword'), null], 'Passwords must match').required().label("Confirm Password")
   // }).required();

   // const { register, handleSubmit, reset, formState: { errors } } = useForm({
   //    resolver: yupResolver(step === 2 ? passwordSchema : emailSchema),
   // });

   const handleEmailSubmit = (data: any) => {
      // Gửi email 
      setEmail(data.email);
      toast('Verification link sent to your email', { position: 'top-center' });
      setStep(2);
   };

   // const handlePasswordSubmit = (data: any) => {
   //    // Xử lý đổi mật khẩu mới
   //    toast('Password successfully changed!', { position: 'top-center' });
   //    reset();
   //    setShowForgotPassword(false); // Quay lại trang đăng nhập
   // };

   return (
      <div>
         {/* {step === 1 && (
            <form onSubmit={handleSubmit(handleEmailSubmit)}>
               <div className="input-group-meta mb-25">
                  <label>Email*</label>
                  <input type="email" {...register("email")} placeholder="Your email" />
                  <p className="form_error">{errors.email?.message}</p>
               </div>
               <button type="submit" className="btn-two w-100 text-uppercase">Send Verification Link</button>
            </form>
         )} */}

         {/* {step === 2 && (
            <form onSubmit={handleSubmit(handlePasswordSubmit)}>
               <div className="input-group-meta mb-25">
                  <label>New Password*</label>
                  <input type="password" {...register("newPassword")} placeholder="Enter new password" />
                  <p className="form_error">{errors.newPassword?.message}</p>
               </div>
               <div className="input-group-meta mb-25">
                  <label>Confirm New Password*</label>
                  <input type="password" {...register("confirmPassword")} placeholder="Confirm new password" />
                  <p className="form_error">{errors.confirmPassword?.message}</p>
               </div>
               <button type="submit" className="btn-two w-100 text-uppercase">Reset Password</button>
            </form> */}
         {/* )} */}
      </div>
   );
};

export default ForgotPassword;
