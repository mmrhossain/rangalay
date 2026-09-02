import {NavigationMenuItem} from "@/types/navigationMenu";
import {BannerData} from "@/types/banner";

export const navItems: NavigationMenuItem[]= [
    { label: 'Home', path: "/" },
    { label: 'Shop', path: '/shop' },
    { label: 'About', path: '/about' },
    { label: 'Blog', path: '/blog' },
    { label: 'Contact', path: '/contact'},
];






export const banners: BannerData[] = [
    {
        id: 1,
        title: "Spring Collection Style To",
        subtitle: "17% Discount",
        image: "/images/banner/banner1.png",
        ctaText: "View Discounts"
    },

    {
        id: 2,
        title: "Up to 70% Off & Free Shipping",
        subtitle: "Shop Women",
        image: "/images/banner/banner2.png",
        ctaText: "View Discounts"
    },
    {
        id: 3,
        title: "Free Shipping Over Order $120",
        subtitle: "Shop Women",
        image: "/images/banner/banner3.png",
        ctaText: "View Discounts"
    },
    {
        id: 4,
        title: "Leather Saddle Bag Style",
        subtitle: "25% Discount",
        image: "/images/banner/banner4.png",
        ctaText: "View Discounts"
    },
]
