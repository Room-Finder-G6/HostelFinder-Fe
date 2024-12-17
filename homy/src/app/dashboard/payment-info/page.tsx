import React from 'react';
import Wrapper from "@/layouts/Wrapper";
import PaymentInfo from "@/components/dashboard/payment-info";

export const metadata = {
    title: "Thông tin thanh toán",
};

const Page = () => {
    return (
        <Wrapper>
            <PaymentInfo />
        </Wrapper>
    );
};

export default Page;