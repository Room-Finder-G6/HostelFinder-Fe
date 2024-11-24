interface MenuItem {
    id: number;
    title: string;
    class_name?: string;
    link: string;
    has_dropdown: boolean;
    sub_menus?: {
        link: string;
        title: string;
    }[];
    menu_column?: {
        id: number;
        mega_title: string;
        mega_menus: {
            link: string;
            title: string;
        }[];
    }[];
}

const menu_data: MenuItem[] = [
    {
        id: 2,
        has_dropdown: true,
        title: "Danh sách",
        class_name: "mega-dropdown-sm",
        link: "#",
        menu_column: [
            {
                id: 1,
                mega_title: "Loại danh sách",
                mega_menus: [
                    { link: "/listing_04", title: "Bài đăng phòng" },
                    { link: "/listing_02", title: "Bộ lọc hàng đầu" },
                ],
            },
            {
                id: 2,
                mega_title: "Loại danh sách",
                mega_menus: [
                    { link: "/listing_3", title: "Danh sách có Banner" },
                    { link: "/listing_4", title: "Lưới toàn màn hình" },
                ],
            },
            {
                id: 3,
                mega_title: "Danh sách chi tiết",
                mega_menus: [
                    { link: "/listing_details", title: "Chi tiết danh sách" },
                ],
            },
        ],
    },
    {
        id: 3,
        has_dropdown: true,
        title: "Các dịch vụ",
        class_name: "mega-dropdown-sm",
        link: "#",
        menu_column: [
            {
                id: 1,
                mega_title: "Dịch vụ thiết yếu",
                mega_menus: [
                    { link: "/about_us_01", title: "Giới thiệu - 1" },
                    { link: "/agency", title: "Đại lý" },
                    { link: "/agency_details", title: "Chi tiết đại lý" },
                ],
            },
            {
                id: 2,
                mega_title: "Tính năng",
                mega_menus: [
                    { link: "/project_01", title: "Dự án" },
                    { link: "/project_details_01", title: "Chi tiết dự án" },
                    { link: "/service_01", title: "Dịch vụ" },
                    { link: "/service_details", title: "Chi tiết dịch vụ" },
                ],
            },
            {
                id: 3,
                mega_title: "Khác",
                mega_menus: [
                    { link: "/compare", title: "So sánh tài sản" },
                    { link: "/pricing_01", title: "Bảng giá" },
                    { link: "/contact", title: "Liên hệ" },
                    { link: "/faq", title: "Câu hỏi thường gặp" },
                ],
            },
        ],
    },
    {
        id: 4,
        has_dropdown: true,
        title: "Blog",
        link: "#",
        sub_menus: [
            { link: "/blog_01", title: "Lưới blog" },
            { link: "/blog_02", title: "Danh sách blog" },
            { link: "/blog_03", title: "Blog 2 cột" },
            { link: "/blog_details", title: "Chi tiết blog" },
        ],
    },
];

export default menu_data;
