import React, {Suspense} from "react";
import type {Metadata} from "next";
import {Jost} from "next/font/google";

// external css file
import "./globals.css";
import 'react-loading-skeleton/dist/skeleton.css'
import 'react-toastify/dist/ReactToastify.css';
import '@smastrom/react-rating/style.css'
import {ScrollToTop} from "@/components/shared/ScrollToTop";
import "./globals.css";

import {ToastContainer} from "react-toastify";
import Header from "@/components/layout/Header";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BottomNavigation from "@/components/layout/BottomNavigation";
import {Category} from "@/types/category";
import {getCategories} from "@/lib/categoriesApi";
import ScrollToTopOnNavigation from "@/components/shared/ScrollToTopOnNavigation";
import SocialContact from "@/components/shared/SocialContact";
import ThemeColorManager from "@/hooks/ThemeColorManager";

// Font configuration
const jost = Jost({
    subsets: ["latin"],
    weight: ["200", "300", "400", "500", "600", "700"],
    variable: "--font-jost",
    display: "swap", // Optimize font loading
});


// seo metadata
export const metadata: Metadata = {
    metadataBase: new URL("https://raangalay.com"),
    // 1. Basic Metadata
    title: "Raangalay | Modern Online Shopping in Bangladesh",
    description:
        "Shop the latest fashion, home decor, and lifestyle essentials at Raangalay. Bangladesh's premier modern e-commerce platform for affordable, trendy products with fast delivery.",
    keywords: ["e-commerce Bangladesh", "online shopping BD", "Raangalay fashion", "home decor Bangladesh", "trendy lifestyle products"],
    authors: [{ name: "Raangalay Team" }],

    // 2. OpenGraph (Facebook, LinkedIn, Discord)
    openGraph: {
        title: "Raangalay | Modern Online Shopping in Bangladesh",
        description: "Trendsetting fashion and lifestyle products delivered across Bangladesh. Discover Raangalay today.",
        url: "https://raangalay.com",
        siteName: "Raangalay",
        images: [
            {
                url: "/images/banner/banner_image.webp", // Create this 1200x630 image
                width: 1200,
                height: 630,
                alt: "Raangalay Online Shopping Bangladesh",
            },
        ],
        locale: "en_BN", // Bangladesh English
        type: "website",
    },

    // 3. Twitter (X)
    twitter: {
        card: "summary_large_image",
        title: "Raangalay | Modern Online Shopping in Bangladesh",
        description: "Affordable fashion and lifestyle essentials with fast delivery in BD.",
        images: ["/images/banner/banner_image.webp"],
    },

    // 4. Robots & Canonical
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    alternates: {
        canonical: "https://raangalay.com",
    }
};




export default async function RootLayout({ children }: { children: React.ReactNode }) {

    const categoriesResult = await getCategories();
    const categories: Category[] = categoriesResult?.data || [];

    return (
        <html lang="en" className={jost.variable} suppressHydrationWarning>
        <body className={`${jost.className} antialiased pb-16 lg:pb-0`}
              suppressHydrationWarning
        >

        <ThemeColorManager />

        <SocialContact />

        <Suspense fallback={null}>
            <ScrollToTopOnNavigation />
        </Suspense>
        <ScrollToTop />

        {/* Wrap the ENTIRE APP inside Providers */}
        <Header />
        <Navbar categories={categories}/>
        {children}
        <Footer/>
        <BottomNavigation/>

        <ToastContainer
            position="top-center"
            autoClose={2000}
            limit={1}
            className="text-sm w-5"
            newestOnTop
            pauseOnHover={true}
            closeOnClick
        
        />
        </body>
        </html>
    );
}
