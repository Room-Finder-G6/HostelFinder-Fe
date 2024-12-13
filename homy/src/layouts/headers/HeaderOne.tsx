"use client"
import NavMenu from "./Menu/NavMenu"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import UseSticky from "@/hooks/UseSticky"
import LoginModal from "@/modals/LoginModal"
import 'bootstrap-icons/font/bootstrap-icons.css';
import Guess from "@/layouts/headers/right-header/Guess";
import Authored from "./right-header/Authored"

const HeaderOne = ({ style }: any) => {
    const { sticky } = UseSticky();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, []);
    return (
        <>
            <header className={`theme-main-menu menu-overlay menu-style-one sticky-menu ${sticky ? "fixed" : ""}`}>
                <div className="inner-content gap-one">
                    <div className="top-header position-relative">
                        <div className="d-flex align-items-center justify-content-between">
                            <div className="logo order-lg-0">
                                <Link href="/" className="d-flex align-items-center">
                                    <Image src="/assets/images/logo/logo_06.svg" alt="PhongTro24/7" width={50}
                                        height={50} />
                                    <span className="logo-text d-none d-lg-block" style={{
                                        fontSize: '25px',
                                        color: 'black',
                                        marginRight: '10px'
                                    }}><strong>&nbsp;PhongTro247</strong></span>
                                </Link>
                            </div>
                            {isLoggedIn ? (
                                <Authored />
                            ) : (
                                <Guess />
                            )}

                            <nav className="navbar navbar-expand-lg p0 order-lg-2">
                                <button className="navbar-toggler d-block d-lg-none" type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false"
                                    aria-label="Toggle navigation">
                                    <span></span>
                                </button>
                                <div className="collapse navbar-collapse" id="navbarNav">
                                    <NavMenu />
                                </div>
                            </nav>
                        </div>
                    </div>
                </div>
            </header>
            <LoginModal />
        </>
    )
}

export default HeaderOne
