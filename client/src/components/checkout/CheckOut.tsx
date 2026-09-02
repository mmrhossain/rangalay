"use client"

import {useCartStore} from "@/store/useCartStore";
import EmptyState from "@/components/checkout/EmptyState";
import CheckOutFrom from "@/components/forms/CheckOutFrom";

import OrderReview from "@/components/checkout/OrderReview";
import CartListSkeleton from "@/skeleton/CartListSkeleton";

const CheckOut = () => {

    const {cart} = useCartStore();

    if(!cart){
        return <CartListSkeleton />
    }

    if (cart?.length === 0) {
        return <EmptyState />
    }

    return (
        <div className="mt-8 md:mt-14 pb-24 md:pb-0">
            <div className="container 2xl:w-[70%]">
                <div className="grid grid-cols-12 gap-8">
                    {/* LEFT */}
                    <CheckOutFrom />
                    {/* RIGHT */}
                    <OrderReview />
                </div>
            </div>
        </div>
    );
};

export default CheckOut;
