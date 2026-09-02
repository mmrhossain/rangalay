"use client";

import { Category } from "@/types/category";
import CategoryCard from "@/components/categories/CategoryCard";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

const Subcategories = ({
    subCategories,
    parent_category,
}: {
    subCategories: Category[];
    parent_category: { name: string; image: string };
}) => {
    const shouldReduceMotion = useReducedMotion();
    const image_url = parent_category?.image;
    const name = parent_category?.name;
    const base_path = process.env.NEXT_PUBLIC_BASE_URL;

    return (
        <section className="w-full">
            {/* 1. HERO BANNER: Sophisticated Overlay & Typography */}
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/8] lg:aspect-[16/6] min-h-[220px] overflow-hidden flex justify-center items-center bg-stone-100">
                <motion.div 
                    initial={shouldReduceMotion ? { scale: 1 } : { scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: shouldReduceMotion ? 0 : 1.5 }}
                    className="absolute inset-0"
                >
                    <Image
                        src={
                            image_url
                                ? `${base_path}/${image_url}`
                                : "https://placehold.net/1200x800.png"
                        }
                        alt={name || "Category banner"}
                        fill
                        priority
                        sizes="100vw"
                        className="object-cover"
                    />
                </motion.div>
                
                {/* Advanced Gradient Overlay for better text legibility */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/20" />

                <div className="relative z-10 text-center px-4 sm:px-6">
                    <motion.p 
                        initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl sm:text-5xl md:text-6xl lg:text-8xl text-white uppercase font-black tracking-tight italic font-serif leading-none break-words"
                    >
                        {name}
                    </motion.p>
                    <motion.div 
                        initial={shouldReduceMotion ? { width: "60px" } : { width: 0 }}
                        animate={{ width: "60px" }}
                        transition={{ delay: shouldReduceMotion ? 0 : 0.5, duration: shouldReduceMotion ? 0 : 0.8 }}
                        className="h-1 bg-primary mx-auto mt-6"
                    />
                </div>
            </div>

            {/* 2. SECTION HEADER: "Shop By Category" */}
            <div className="container mt-6 md:mt-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-4">
                    <div className="space-y-2">
                        <span className="text-primary font-bold uppercase tracking-[0.18em] sm:tracking-[0.3em] text-[10px] md:text-xs">
                            Discover the Collection
                        </span>
                        <h1 className="font-black uppercase text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-slate-900 tracking-tight sm:tracking-tighter">
                            Shop by <span className="text-primary italic font-serif">category</span>
                        </h1>
                    </div>
                    <p className="text-slate-400 text-sm max-w-[320px] font-medium leading-relaxed">
                        Explore our handcrafted pieces rooted in the heritage of Susang Durgapur.
                    </p>
                </div>

                {/* 3. GRID LAYOUT: Clean, Balanced spacing */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                    {subCategories?.map((category, index) => (
                        <motion.div
                            key={category.id}
                            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: shouldReduceMotion ? 0 : index * 0.05 }}
                        >
                            <CategoryCard 
                                category={category} 
                                parent_category={name} 
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Subcategories;
