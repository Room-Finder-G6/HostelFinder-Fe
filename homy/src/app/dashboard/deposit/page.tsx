import React from 'react';
import DashboardDeposit from '@/components/dashboard/deposit';
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
};

const index = () => {
    return (
        <Wrapper>
            <DashboardDeposit/>
        </Wrapper>
    );
};

export default index;