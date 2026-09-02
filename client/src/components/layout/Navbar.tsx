"use client"

import dynamic from 'next/dynamic';
import {Category} from "@/types/category";
import {useCartStore} from "@/store/useCartStore";
import {useEffect} from "react";
import {useWishStore} from "@/store/useWishStore";


const MobileNavbar = dynamic(() => import('@/components/layout/MobileNavbar'), { ssr: false });
const DeskTopNavbar = dynamic(() => import('@/components/layout/DeskTopNavbar'), { ssr: false });



export default function Navbar ({categories}: {categories: Category[]}) {

    const {fetchCart} = useCartStore();
    const { fetchWishList } = useWishStore();


    useEffect(() => {
        (async ()=>{
            await Promise.all([
                fetchCart(),
                fetchWishList(),
            ])
        })()
    }, [fetchCart, fetchWishList]);



    return (
        <nav className="sticky top-0 z-50 bg-white shadow-sm">
            {/* Mobile Menu */}
            <MobileNavbar categories={categories} />

            {/* Desktop Menu */}
            <DeskTopNavbar categories={categories} />
        </nav>
    );
}
