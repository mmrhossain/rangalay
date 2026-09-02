"use client";

import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const BannerSkeleton = () => {
    return (
        <div className="container mt-6 md:mt-8">
            <div className="flex flex-col-reverse lg:grid lg:grid-cols-12 gap-5">

                {/* 🔹 Left Main */}
                <div className="lg:col-span-5 w-full rounded-2xl overflow-hidden">
                    <div className="relative w-full aspect-[4/5] sm:aspect-[16/10] lg:aspect-[5/6]">

                        {/* Image Skeleton */}
                        <Skeleton height="100%" />

                        {/* Text Overlay */}
                        <div className="absolute bottom-6 left-4 right-4 sm:bottom-10 sm:left-8 sm:right-8 space-y-3">
                            <Skeleton width={80} height={10} />
                            <Skeleton width="70%" height={24} />
                            <Skeleton width="50%" height={24} />
                            <Skeleton width={140} height={40} borderRadius={999} />
                        </div>
                    </div>
                </div>

                {/* 🔹 Right Grid */}
                <div className="lg:col-span-7 w-full grid grid-cols-1 sm:grid-cols-2 gap-5">

                    {/* Top 2 cards */}
                    {[1, 2].map((_, i) => (
                        <div
                            key={i}
                            className="relative w-full rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-[5/4]"
                        >
                            <Skeleton height="100%" />

                            <div className="absolute inset-0 p-4 sm:p-6 md:p-8 flex flex-col justify-end space-y-2">
                                <Skeleton width="60%" height={14} />
                                <Skeleton width="30%" height={12} />
                            </div>
                        </div>
                    ))}

                    {/* Bottom wide card */}
                    <div className="relative w-full rounded-2xl overflow-hidden sm:col-span-2 aspect-[16/8] sm:aspect-[5/2]">
                        <Skeleton height="100%" />

                        <div className="absolute inset-0 p-4 sm:p-6 md:p-8 flex flex-col justify-end space-y-2">
                            <Skeleton width="40%" height={14} />
                            <Skeleton width="20%" height={12} />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default BannerSkeleton;