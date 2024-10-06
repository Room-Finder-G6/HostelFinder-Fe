"use client";
import OpenEye from "@/assets/images/icon/icon_68.svg";
// import apiInstance from "@/utils/apiInstance";
import apiInstance from "../../utils/apiInstance";
import { yupResolver } from "@hookform/resolvers/yup";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";

interface LoginFormProps {
  setShowForgotPassword: React.Dispatch<React.SetStateAction<boolean>>;
}

interface FormData {
  userName: string;
  password: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ setShowForgotPassword }) => {
  const [isPasswordVisible, setPasswordVisibility] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisibility(!isPasswordVisible);
  };

  const schema = yup
    .object({
      userName: yup.string().required().label("UserName"),
      password: yup.string().required().label("Password"),
    })
    .required();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: yupResolver(schema) });

  const onSubmit = async (data: FormData) => {
    console.log(data);

    const res = await apiInstance.post("v1/auth/login", data).then((res) => {
      if (res.status === 200) {
        localStorage.setItem("token", res.data.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.data.user));
      }
      if (res.status === 400) {
        toast("Login failed", { position: "top-center" });
      }
    });
    const notify = () =>
      toast("Login successfully", { position: "top-center" });
    notify();
    reset();
  };

  return ( 
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <div className="col-12">
            <div className="input-group-meta position-relative mb-25">
              <label>UserName*</label>
              <input
                type="text"
                {...register("userName")}
                placeholder="User Name"
              />
              <p className="form_error">{errors.userName?.message}</p>
            </div>
          </div>
          <div className="col-12">
            <div className="input-group-meta position-relative mb-20">
              <label>Password*</label>
              <input
                type={isPasswordVisible ? "text" : "password"}
                {...register("password")}
                placeholder="Enter Password"
                className="pass_log_id"
              />
              <span className="placeholder_icon">
                <span
                  className={`passVicon ${
                    isPasswordVisible ? "eye-slash" : ""
                  }`}
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
                <label htmlFor="remember">Keep me logged in</label>
              </div>

              <Link href="#" onClick={() => setShowForgotPassword(true)}>
                Forgot Password?
              </Link>
            </div>
          </div>
          <div className="col-12">
            <button
              type="submit"
              className="btn-two w-100 text-uppercase d-block mt-20"
            >
              Login
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;