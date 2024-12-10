import {useState} from "react";
import Link from "next/link";
import {toast} from 'react-toastify';
import * as yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from '@hookform/resolvers/yup';
import Image from "next/image";
import OpenEye from "@/assets/images/icon/icon_68.svg";
import apiInstance from "@/utils/apiInstance";
import {useRouter} from "next/navigation";

interface FormData {
    userName: string;
    email: string;
    password: string;
    phone: string;
    fullName: string;
}

const RegisterForm = () => {
    const schema = yup.object({
        userName: yup.string()
            .required("Tên đăng nhập là bắt buộc")
            .min(4, "Tên đăng nhập phải có ít nhất 4 ký tự"),
        fullName: yup.string().required("Họ và tên là bắt buộc")
            .label("Full Name"),
        email: yup.string()
            .required("Email là bắt buộc")
            .email("Email không hợp lệ"),
        password: yup.string()
            .required("Mật khẩu là bắt buộc")
            .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
            .matches(/[a-z]/, "Mật khẩu phải chứa ít nhất một chữ cái thường")
            .matches(/[A-Z]/, "Mật khẩu phải chứa ít nhất một chữ cái in hoa")
            .matches(/[0-9]/, "Mật khẩu phải chứa ít nhất một chữ số"),
        phone: yup.string()
            .required("Số điện thoại là bắt buộc")
            .matches(/^\d{10}$/, "Số điện thoại phải gồm 10 chữ số"),
    }).required();

    const {register, handleSubmit, reset, formState: {errors}} = useForm<FormData>({resolver: yupResolver(schema)});

    const [isPasswordVisible, setPasswordVisibility] = useState(false);
    const [isAgreed, setIsAgreed] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisibility(!isPasswordVisible);
    };

    const handleAgreeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsAgreed(e.target.checked);
    };

    const onSubmit = async (data: FormData) => {
        if (!isAgreed) {
            toast.error("Vui lòng đồng ý với các điều khoản của chúng tôi.", {position: "top-center"});
            return;
        }

        try {
            const response = await apiInstance.post("auth/register", data);
            if (response.status === 200 && response.data.succeeded) {
                const {message} = response.data;
                toast.success(message || "Đăng ký thành công", {position: 'top-center'});
                reset();
                if (response.data.data.role === "1") {
                    window.location.href = "/";
                }
            }
        } catch (error: any) {
            if (error.response && error.response.status === 400) {
                const errors = error.response.data.message;
                toast.error(errors, {position: "top-center"});
            } else {
                toast.error("Có lỗi xảy ra. Vui lòng thử lại.", {position: 'top-center'});
            }
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
                <div className="col-12">
                    <div className="input-group-meta position-relative mb-25">
                        <label htmlFor="fullName">Họ và tên<span style={{color: 'red'}}>*</span></label>
                        <input type="text" id="fullName" {...register("fullName")}
                               placeholder="Nhập họ và tên của bạn"/>
                        <p className="form_error">{errors.fullName?.message}</p>
                    </div>
                </div>
                <div className="col-12">
                    <div className="input-group-meta position-relative mb-25">
                        <label htmlFor="userName">Tên đăng nhập<span style={{color: 'red'}}>*</span></label>
                        <input type="text" id="userName" {...register("userName")} placeholder="Nhập tên đăng nhập"/>
                        <p className="form_error">{errors.userName?.message}</p>
                    </div>
                </div>
                <div className="col-12">
                    <div className="input-group-meta position-relative mb-25">
                        <label htmlFor="email">Email<span style={{color: 'red'}}>*</span></label>
                        <input type="email" id="email" {...register("email")} placeholder="Hãy nhập email của bạn"/>
                        <p className="form_error">{errors.email?.message}</p>
                    </div>
                </div>
                <div className="col-12">
                    <div className="input-group-meta position-relative mb-20">
                        <label htmlFor="password">Mật khẩu<span style={{color: 'red'}}>*</span></label>
                        <input type={isPasswordVisible ? "text" : "password"} id="password" {...register("password")}
                               placeholder="Nhập mật khẩu" className="pass_log_id"/>
                        <span className="placeholder_icon">
                     <span className={`passVicon ${isPasswordVisible ? "eye-slash" : ""}`}>
                        <Image onClick={togglePasswordVisibility} src={OpenEye} alt="Toggle Password Visibility"/>
                     </span>
                  </span>
                        <p className="form_error">{errors.password?.message}</p>
                    </div>
                </div>
                <div className="col-12">
                    <div className="input-group-meta position-relative mb-25">
                        <label htmlFor="phone">Số điện thoại<span style={{color: 'red'}}>*</span></label>
                        <input type="tel" id="phone" {...register("phone")} placeholder="Số điện thoại của bạn"/>
                        <p className="form_error">{errors.phone?.message}</p>
                    </div>
                </div>
                <div className="col-12">
                    <div className="agreement-checkbox d-flex justify-content-between align-items-center">
                        <div>
                            <input type="checkbox" id="agree" onChange={handleAgreeChange}/>
                            <label htmlFor="agree">Bằng cách nhấn nút &quot;Đăng ký&quot;, bạn đồng ý với <Link
                                href="#">các điều kiện</Link> & <Link href="#">chính sách</Link></label>
                        </div>
                    </div>
                </div>
                <div className="col-12">
                    <button
                        type="submit"
                        onSubmit={()=>{}}
                        className={`btn-two w-100 text-uppercase d-block mt-20 ${isAgreed ? "enabled-button" : "disabled-button"}`}
                    >
                        ĐĂNG KÝ
                    </button>
                </div>
            </div>
        </form>
    );
};

export default RegisterForm;
