import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import apiInstance from "../../utils/apiInstance"; // Giả sử bạn đã cấu hình apiInstance

interface FormData {
   email: string;
}

const ForgotPassword = ({ setShowForgotPassword }: any) => {
   const [loading, setLoading] = useState(false); // Trạng thái loading khi gọi API
   const [emailSent, setEmailSent] = useState(false); // Trạng thái gửi email thành công

   // Validation schema cho email
   const emailSchema = yup.object({
      email: yup.string().required("Email is required").email("Invalid email address").label("Email"),
   }).required();

   const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
      resolver: yupResolver(emailSchema),
   });

   const handleEmailSubmit = async (data: FormData) => {
      setLoading(true);
      try {
         // Gọi API để reset mật khẩu
         const response = await apiInstance.post("/auth/forgot-password", {
            email: data.email,
         });

         if (response.status === 200) {
            toast.success("Mật khẩu mới đã được gửi tới email của bạn! Vui lòng kiểm tra hòm thư", { position: "top-center" });
            setEmailSent(true);
         } else {
            toast.error("Có lỗi xảy ra, vui lòng thử lại sau!", { position: "top-center" });
         }
      } catch (error) {
         toast.error("Có lỗi xảy ra, vui lòng thử lại sau!", { position: "top-center" });
      } finally {
         setLoading(false);
      }
   };

   return (
      <div>
         {!emailSent ? (
            <form onSubmit={handleSubmit(handleEmailSubmit)}>
               <div className="input-group-meta mb-25">
                  <label>Email*</label>
                  <input
                     type="email"
                     {...register("email")}
                     placeholder="Nhập email của bạn"
                  />
                  <p className="form_error">{errors.email?.message}</p>
               </div>
               <button
                  type="submit"
                  className="btn-two w-100 text-uppercase"
                  disabled={loading}
               >
                  {loading ? "Đang gửi..." : "Gửi email"}
               </button>
            </form>
         ) : (
            <div>
               <p style={{ color: "green" }}>Mật khẩu mới đã được gửi đến email của bạn.</p>
               <button
                  className="btn-two w-100 text-uppercase"
                  onClick={() => setShowForgotPassword(false)} // Quay lại trang đăng nhập
               >
                  Quay lại đăng nhập
               </button>
            </div>
         )}
      </div>
   );
};

export default ForgotPassword;
