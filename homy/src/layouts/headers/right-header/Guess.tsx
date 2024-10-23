import React from 'react';
import Link from "next/link";

const Guess = () => {
    return (
        <div className="right-widget ms-auto ms-lg-0 me-3 me-lg-0 order-lg-3">
            <ul className="d-flex align-items-center style-none">
                <li>
                    <Link href="#" data-bs-toggle="modal" data-bs-target="#loginModal"
                          className="btn-one"><i className="fa-regular fa-lock"></i> <span
                        style={{fontFamily: "'Fira Code', sans-serif"}}>Đăng nhập</span></Link>
                </li>
                {/*<li className="d-none d-md-inline-block ms-3">
                    <Link href="/dashboard/create-post" className="btn-two" target="_blank"><span>Create Post</span>
                        <i className="fa-thin fa-arrow-up-right"></i></Link>
                </li>*/}
            </ul>
        </div>
    );
};

export default Guess;