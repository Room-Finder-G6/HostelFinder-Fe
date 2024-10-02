import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';



interface FormData {
   name: string;
   email: string;
   password: string;
   code: string;
   confirmPassword: string;
   newPassword: string;

}
const ForgotPassword = ({ setShowForgotPassword }: any) => {
   const [step, setStep] = useState(1); // Step 1: Nhập email, Step 2: Nhập mã xác nhận, Step 3: Đặt mật khẩu mới
   const [email, setEmail] = useState('');
   const [verificationCode, setVerificationCode] = useState('');

   // Validation schema for email input
   const emailSchema = yup.object({
      email: yup.string().required().email().label("Email"),
  
   }).required();

   const passwordSchema = yup.object({
      newPassword: yup.string().min(6).required().label("New Password"),
      confirmPassword: yup.string().oneOf([yup.ref('newPassword'), null], 'Passwords must match').required().label("Confirm Password")
   }).required();

   const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: yupResolver(step === 3 ? passwordSchema : emailSchema), });

   const handleEmailSubmit = (data: any) => {
      // Gửi email 
      setEmail(data.email);
      toast('Verification code sent to your email', { position: 'top-center' });
      setStep(2);
   };

   const handleCodeSubmit = (data: any) => {
      // nhập mã
      if (data.code === "123456") { // ví dụ mã xác nhận là 123456
         setVerificationCode(data.code);
         setStep(3);
      } else {
         toast.error('Invalid verification code', { position: 'top-center' });
      }
   };

   const handlePasswordSubmit = (data: any) => {
      // Xử lý đổi mật khẩu mới
      toast('Password successfully changed!', { position: 'top-center' });
      reset();
      setShowForgotPassword(false); // Quay lại trang đăng nhập
   };

   return (
      <div>
         {step === 1 && (
            <form onSubmit={handleSubmit(handleEmailSubmit)}>
               <div className="input-group-meta mb-25">
                  <label>Email*</label>
                  <input type="email" {...register("email")} placeholder="Your email" />
                  <p className="form_error">{errors.email?.message}</p>
               </div>
               <button type="submit" className="btn-two w-100 text-uppercase">Send Verification Code</button>
            </form>
         )}

         {step === 2 && (
            <form onSubmit={handleSubmit(handleCodeSubmit)}>
               <div className="input-group-meta mb-25">
                  <label>Verification Code*</label>
                  <input type="text" {...register("code")} placeholder="Enter the code sent to your email" />
                  <p className="form_error">{errors.code?.message}</p>
               </div>
               <button type="submit" className="btn-two w-100 text-uppercase">Verify Code</button>
            </form>
         )}

         {step === 3 && (
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
            </form>
         )}
      </div>
   );
};

export default ForgotPassword;
