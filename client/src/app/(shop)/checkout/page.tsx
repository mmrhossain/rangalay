
import React from "react";

import CheckOut from "@/components/checkout/CheckOut";
import ProtectedRoute from "@/components/protect/ProtectedRoute";

const CheckoutPage = () => {

    return (
        <ProtectedRoute>
            <CheckOut />
        </ProtectedRoute>
    );
};


export default CheckoutPage;
