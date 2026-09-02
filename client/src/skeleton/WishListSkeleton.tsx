import React from 'react';
import Skeleton from "react-loading-skeleton";

const WishListSkeleton = () => {
    return (
        <div className="container py-12 space-y-12 2xl:w-[70%] mx-auto">
            <div>
                <Skeleton width={"100%"} height={"30vh"} />
            </div>
        </div>
    );
};

export default WishListSkeleton;