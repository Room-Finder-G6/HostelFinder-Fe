"use client"
import NavMenu from "./Menu/NavMenu"
import Image from "next/image"
import {useState} from "react"
import UseSticky from "@/hooks/UseSticky"
import LoginModal from "@/modals/LoginModal"
import HeaderSearchbar from "./Menu/HeaderSearchbar"
import {useRouter} from "next/navigation";

import logo_1 from "@/assets/images/logo/logo_06.svg";

const HeaderFour = () => {
    const router = useRouter();
    const { sticky } = UseSticky();
    const [isSearch, setIsSearch] = useState<boolean>(false);

    const handleAddListing = () => {
        router.push('/dashboard/add-property');
    };

    return (
        <>
            <header className={`theme-main-menu menu-overlay menu-style-six sticky-menu ${sticky ? "fixed" : ""}`}>
                <div className="inner-content gap-two">
                    <div className="top-header position-relative">
                        <div className="d-flex align-items-center">
                            <div className="logo order-lg-0">
                                <a onClick={() => router.push('/')} className="d-flex align-items-center">
                                    <Image src={logo_1} alt=""/>
                                </a>
                            </div>

                            <div className="right-widget ms-auto me-3 me-lg-0 order-lg-3">
                                <ul className="d-flex align-items-center style-none">
                                    <li className="d-none d-md-inline-block me-4">
                                        <a onClick={handleAddListing} className="btn-ten rounded-0">
                                            <span>Add Listing</span> <i className="bi bi-arrow-up-right"></i>
                                        </a>
                                    </li>
                                    <li>
                                        <a onClick={() => setIsSearch(true)} style={{cursor: "pointer"}}
                                           className="search-btn-one rounded-circle tran3s d-flex align-items-center justify-content-center">
                                            <i className="bi bi-search"></i>
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <nav className="navbar navbar-expand-lg p0 ms-lg-5 order-lg-2">
                                <button className="navbar-toggler d-block d-lg-none" type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false"
                                        aria-label="Toggle navigation">
                                    <span></span>
                                </button>
                                <div id="navbarNav">
                                    <NavMenu/>
                                </div>
                            </nav>
                        </div>
                    </div>
                </div>
            </header>

            <LoginModal/>
            <HeaderSearchbar isSearch={isSearch} setIsSearch={setIsSearch}/>
        </>
    );
};


export default HeaderFour
