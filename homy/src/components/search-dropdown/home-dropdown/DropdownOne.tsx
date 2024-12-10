import React from "react";
import {useRouter} from "next/navigation";


const DropdownOne = () => {

    const router = useRouter();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        router.push(`/all-posts`);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="row gx-0 align-items-center">
                <div className="input-box-one lg-mt-20">
                    <div className="d-flex align-items-center">
                        <button
                            type="submit"
                            className="fw-500 text-uppercase tran3s search-btn"
                        >
                            Tất cả bài đăng
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default DropdownOne;