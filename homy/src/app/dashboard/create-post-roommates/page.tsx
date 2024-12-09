import Wrapper from "@/layouts/Wrapper";

export const metadata = {
    title: "Tạo bài cho thuê",
};

import React from 'react';
import DashboardCreatePostRoommates from "@/components/dashboard/create-post-roommates";

const index = () => {
    return (
        <Wrapper>
            <DashboardCreatePostRoommates />
        </Wrapper>
    );
};

export default index;