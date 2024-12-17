interface ContentType {
    sub_title: string;
    desc_1: JSX.Element;
    title_1: string;
    title_2: string;
    desc_2: JSX.Element;
    desc_3: JSX.Element;
}

const feature_content: ContentType = {
    sub_title: "Về chúng tôi",
    desc_1: (<>Chào mừng bạn đến với Hostel Finder – đối tác đáng tin cậy của bạn trong việc tìm kiếm nơi ở lý tưởng.
        Chúng tôi cam kết đơn giản hóa quá trình tìm kiếm và quản lý bất động sản cho thuê, kết nối người thuê và chủ
        nhà một cách dễ dàng và hiệu quả.</>),
    title_1: "Chúng tôi là ai?",
    title_2: "Sứ Mệnh Của Chúng Tôi",
    desc_2: (<>Hostel Finder với những con người năng động, sáng tạo luôn hết mình trong công việc và cuộc sống.
        Chúng tôi không nhừng tìm tòi, học hỏi và cải tiến từng ngày để mang đến cho khách hàng những trải nghiệm tuyệt vời nhất.</>),
    desc_3: (<>Sứ mệnh của chúng tôi là tạo ra một nền tảng giúp việc tìm kiếm và quản lý nhà cho thuê trở nên dễ dàng,
        minh bạch và hiệu quả.
        Chúng tôi hướng tới xây dựng một cộng đồng nơi chủ nhà có thể dễ dàng đăng tin, còn người thuê có thể nhanh
        chóng tìm được nơi ở phù hợp và an toàn.</>),
}

const {sub_title, desc_1, title_1, title_2, desc_2, desc_3} = feature_content;

const BLockFeatureOne = () => {
    return (
        <div className="block-feature-two mt-150 xl-mt-100">
            <div className="container">
                <div className="row gx-xl-5">
                    <div className="col-lg-6 wow fadeInLeft">
                        <div className="me-xxl-4">
                            <div className="title-one mb-60 lg-mb-40">
                                <div className="upper-title">{sub_title}</div>
                                <h3>Tìm kiếm và quản lý nhà trọ của bạn.</h3>
                                <p className="fs-22">{desc_1}</p>
                            </div>
                            {/*<Link href="/contact" className="btn-two">Contact Us</Link>*/}
                        </div>
                    </div>

                    <div className="col-lg-6 wow fadeInRight">
                        <div className="block-two md-mt-40">
                            <div className="bg-wrapper">
                                <h5>{title_1}</h5>
                                <p className="fs-22 lh-lg mt-20">{desc_2}</p>
                                <h5 className="top-line">{title_2} </h5>
                                <p className="fs-22 lh-lg mt-20">{desc_3}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BLockFeatureOne
