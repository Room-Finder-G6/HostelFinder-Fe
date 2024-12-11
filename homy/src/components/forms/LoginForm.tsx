"use client";

import OpenEye from "@/assets/images/icon/icon_68.svg";
import apiInstance from "../../utils/apiInstance";
import { yupResolver } from "@hookform/resolvers/yup";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import * as yup from "yup";

interface LoginFormProps {
  setShowForgotPassword: React.Dispatch<React.SetStateAction<boolean>>;
}

interface FormData {
  userName: string;
  password: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ setShowForgotPassword }) => {
  const router = useRouter();
  const [isPasswordVisible, setPasswordVisibility] = useState(false);
  const [loading, setLoading] = useState(false);  // Trạng thái loading

  const togglePasswordVisibility = () => {
    setPasswordVisibility((prev) => !prev);
  };

  const schema = yup
    .object({
      userName: yup.string().required("User name is required"),
      password: yup.string().required("Password is required"),
    })
    .required();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: yupResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setLoading(true); // Bắt đầu loading
    try {
      const res = await apiInstance.post("auth/login", data);
      if (res.status === 200 && res.data.succeeded) {
        const { message, data: responseData } = res.data;
        localStorage.setItem("token", responseData.token);
        localStorage.setItem("userName", responseData.userName);
        toast.success(message, { position: "top-center" });

        const backdrops = document.querySelectorAll('.modal-backdrop');
        document.body.style.overflow = '';
        backdrops.forEach(backdrop => backdrop.remove());

        if (responseData.role === "User") {
          window.location.href = '/';
        } else if (responseData.role === "Landlord") {
          router.push("/dashboard/manage-hostels");
        }
        else if (responseData.role === "Admin") {
          router.push("/admin/admin-index");
        }
      }
    } catch (error: any) {
      if (error.response?.status === 400) {
        toast.error(error.response.data.message, { position: "top-center" });
      } else {
        toast.error(error.message, { position: "top-center" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <div className="col-12">
            <div className="input-group-meta position-relative mb-25">
              <label>Tên đăng nhập*</label>
              <input
                type="text"
                {...register("userName")}
                placeholder="Tên đăng nhập"
              />
              <p className="form_error">{errors.userName?.message}</p>
            </div>
          </div>
          <div className="col-12">
            <div className="input-group-meta position-relative mb-20">
              <label>Mật khẩu*</label>
              <input
                type={isPasswordVisible ? "text" : "password"}
                {...register("password")}
                placeholder="Nhập mật khẩu"
                className="pass_log_id"
              />
              <span className="placeholder_icon">
                <span
                  className={`passVicon ${isPasswordVisible ? "eye-slash" : ""}`}
                >
                  <Image
                    onClick={togglePasswordVisibility}
                    src={OpenEye}
                    alt="Toggle Password Visibility"
                  />
                </span>
              </span>
              <p className="form_error">{errors.password?.message}</p>
            </div>
          </div>
          <div className="col-12">
            <div className="agreement-checkbox d-flex justify-content-between align-items-center">
              <div>
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Lưu thông tin đăng nhập</label>
              </div>

              <Link href="#" onClick={() => setShowForgotPassword(true)}>
                Quên mật khẩu?
              </Link>
            </div>
          </div>
          <div className="col-12">
            <button
              type="submit"
              className="btn-two w-100 text-uppercase d-block mt-20"
              disabled={loading} // Vô hiệu hóa nút khi đang loading
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> // Spinner
              ) : (
                "Đăng nhập"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
