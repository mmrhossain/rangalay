"use client"

import React from 'react';
import Skeleton from "react-loading-skeleton";


const NavMenuSkeleton = () => {

    return (
        <>
            {
                Array.from({ length: 5 }).map((_, i) => {
                    return (
                        <div key={i} className="z-30">
                            <Skeleton key={i} width={80} height={20} style={{ backgroundColor: "#e5e7eb" }} />
                        </div>
                    )
                })
            }
        </>
    );
};

export default NavMenuSkeleton;