import React from 'react';
import DashboardEditHostel from "@/components/dashboard/edit-hostel";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
    title: "Sửa thông tin nhà trọ",
};

const index = () => {
    return (
        <Wrapper>
            <DashboardEditHostel/>
        </Wrapper>
    );
};

export default index;