"use client";
import React, {useState} from 'react';
import DashboardHeaderOne from "@/layouts/headers/dashboard/DashboardHeaderOne";
import PaymentInfoBody from "@/components/dashboard/payment-info/PaymentInfoBody";

const Index = () => {
    const [isActive, setIsActive] = useState(false);

    return (
        <div>
            <DashboardHeaderOne isActive={isActive} setIsActive={setIsActive}/>
            <PaymentInfoBody/>
        </div>
    );
};

export default Index;