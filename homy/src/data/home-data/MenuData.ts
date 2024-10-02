interface MenuItem {
    id: number;
    title: string;
    class_name?:string;
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
    }[]
}[];

const menu_data: MenuItem[] = [

    // {
    //     id: 1,
    //     has_dropdown: true,
    //     title: "Home",
    //     link: "#",
    //     sub_menus: [
    //         { link: "/", title: "Home" },
           
    //     ],
    // },
    {
        id: 2,
        has_dropdown: true,
        title: "Danh sách",
        class_name:"mega-dropdown-sm",
        link: "#",
        menu_column: [
            {
                id: 1,
                mega_title: "Listing Type",
                mega_menus: [
                    { link: "/listing_04", title: "Grid Sidebar" },
                    { link: "/listing_02", title: "Grid Top Filter" },
                    
                ]
            },
            {
                id: 2,
                mega_title: "Listing Type",
                mega_menus: [
                   
                    { link: "/listing_3", title: "List Banner Filter" },
                    { link: "/listing_4", title: "Grid Fullwidth" },
                    
                    
                ]
            },
            {
                id: 3,
                mega_title: "Single Listing",
                mega_menus: [
                    { link: "/listing_details_01", title: "Listing Details" },
                    
                ]
            },
        ]
    },
    {
        id: 3,
        has_dropdown: true,
        title: "Các dịch vụ",
        class_name:"mega-dropdown-sm",
        link: "#",
        menu_column: [
            {
                id: 1,
                mega_title: "Essential",
                mega_menus: [
                    { link: "/about_us_01", title: "About us -1" },
                    { link: "/agency", title: "Agency" },
                    { link: "/agency_details", title: "Agency Details" },
                    
                ]
            },
            {
                id: 2,
                mega_title: "Features",
                mega_menus: [
                    { link: "/project_01", title: "Project" },
                    { link: "/project_details_01", title: "Project Details" },
                    { link: "/service_01", title: "Service" },
                    { link: "/service_details", title: "Service Details" },
                ]
            },
            {
                id: 3,
                mega_title: "Others",
                mega_menus: [
                    { link: "/compare", title: "Property Compare" },
                    { link: "/pricing_01", title: "Pricing" },
                    { link: "/contact", title: "Contact Us" },
                    { link: "/faq", title: "FAQ's" },
                 
                ]
            },
        ]
    },
    {
        id: 4,
        has_dropdown: true,
        title: "Blog",
        link: "#",
        sub_menus: [
            { link: "/blog_01", title: "Blog Grid" },
            { link: "/blog_02", title: "Blog List" },
            { link: "/blog_03", title: "Blog 2 column" },
            { link: "/blog_details", title: "Blog Details" },
        ],
    },
];
export default menu_data;
