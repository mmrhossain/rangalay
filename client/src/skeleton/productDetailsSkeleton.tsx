import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ProductSkeleton = () => {
    return (
        <div className="container grid gap-10 2xl:gap-20 grid-cols-1 md:grid-cols-2 mt-8 2xl:w-[70%] mx-auto">

            {/* LEFT: Product Gallery Skeleton */}
            <div className="space-y-4">
                <div className="aspect-square w-full">
                    <Skeleton height="100%" borderRadius={8} />
                </div>
                <div className="flex gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} width={80} height={80} borderRadius={4} />
                    ))}
                </div>
            </div>

            {/* RIGHT: Product Info Skeleton */}
            <div className="flex flex-col gap-5">
                <div className="space-y-4">
                    {/* Title and Price */}
                    <Skeleton height={40} width="80%" />
                    <Skeleton height={30} width="40%" />
                    <Skeleton height={20} width="20%" />
                </div>

                {/* Grid for Quantity, Size, Color */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mt-4">
                    <div className="space-y-2">
                        <Skeleton height={15} width="50%" />
                        <Skeleton height={45} />
                    </div>
                    <div className="space-y-2">
                        <Skeleton height={15} width="50%" />
                        <Skeleton height={45} />
                    </div>
                    <div className="space-y-2">
                        <Skeleton height={15} width="50%" />
                        <Skeleton height={45} />
                    </div>
                </div>

                {/* Buttons (Add to Cart / Wishlist) */}
                <div className="flex w-full md:w-[85%] lg:w-full gap-2 mt-5">
                    <div className="flex-1">
                        <Skeleton height={48} />
                    </div>
                    <div className="w-12">
                        <Skeleton height={48} />
                    </div>
                </div>

                {/* Metadata Cards (Category / Brand) */}
                <div className="space-y-4 pt-6 border-t border-gray-100">
                    <Skeleton height={20} width="30%" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Skeleton height={60} borderRadius={8} />
                        <Skeleton height={60} borderRadius={8} />
                    </div>
                </div>

                {/* Social Share */}
                <div className="flex items-center gap-4 pt-6">
                    <Skeleton width={100} height={20} />
                    <div className="flex gap-4">
                        <Skeleton circle width={30} height={30} />
                        <Skeleton circle width={30} height={30} />
                        <Skeleton circle width={30} height={30} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductSkeleton;