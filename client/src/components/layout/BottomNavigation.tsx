"use client";

import Link from "next/link";
import { HiOutlineHome } from "react-icons/hi";
import {Heart, ShoppingBag, Store} from "lucide-react";
import { BottomNavbar } from "@/types/bottomNavbar";
import { JSX, useState, useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useWishStore } from "@/store/useWishStore";
import { usePathname } from "next/navigation";

export const bottomNavItems: BottomNavbar[] = [
    { label: "Home", path: "/", icon: <HiOutlineHome size={22} /> },
    { label: "Shop", path: "/shop", icon: <Store size={22}  /> },
    { label: "Cart", path: "/cart", icon: <ShoppingBag size={22} /> },
    { label: "Wishlist", path: "/customer/wish-list", icon: <Heart size={22} /> },
];

const BottomNavigation = () => {
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();
    const { cartCount } = useCartStore();
    const { wishCount } = useWishStore();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <>
            <nav
                aria-label="Bottom Navigation"
                className="fixed bottom-0 left-0 w-full lg:hidden bg-white/90 backdrop-blur-lg border-t border-slate-100 pb-safe z-40 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]"
            >
                <ul className="grid grid-cols-4 items-center h-16 w-full mx-auto">
                    {bottomNavItems.map((item: BottomNavbar, index: number): JSX.Element => {
                        const { label, path, icon } = item;
                        const isActive = path === pathname;

                        const count = label === "Cart" ? cartCount : label === "Wishlist" ? wishCount : 0;
                        const shouldShowBadge = count > 0;

                        const Content = (
                            <div className="flex flex-col items-center justify-center transition-all duration-300">
                                <div className="relative">
                                    <div className={`p-2 rounded-xl transition-all duration-300 ${isActive
                                            ? "bg-primary text-white shadow-lg shadow-primary/20 scale-110"
                                            : "text-slate-500 group-hover:text-primary"
                                        }`}>
                                        {icon}
                                    </div>

                                    {shouldShowBadge && (
                                        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-secondary text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                                            {count > 99 ? "99+" : count}
                                        </span>
                                    )}
                                </div>
                                <span className={`text-[10px] mt-1 font-black uppercase tracking-[0.1em] transition-colors duration-300 ${isActive ? "text-primary opacity-100" : "text-slate-400 opacity-70"
                                    }`}>
                                    {label}
                                </span>
                            </div>
                        );

                        return (
                            <li key={index} className="flex justify-center group">
                                {path ? (
                                    <Link
                                        href={path}
                                        className="w-full py-1 focus:outline-none active:scale-95 transition-transform"
                                    >
                                        {Content}
                                    </Link>
                                ) : (
                                   ""
                                )}
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </>
    );
};

export default BottomNavigation;
