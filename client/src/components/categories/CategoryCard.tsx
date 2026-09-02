"use client";

import { Category } from "@/types/category";
import { Card } from "@/components/ui/Card";
import Image from "next/image";
import Link from "next/link";
import { slugify } from "@/utils";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";

const CategoryCard = ({
    category,
    parent_category,
}: {
    category: Category;
    parent_category: string;
}) => {
    const shouldReduceMotion = useReducedMotion();
    const pathname = usePathname();
    const basePath = pathname !== "/" ? `/shop/${slugify(parent_category)}` : "";
    const targetHref = `${basePath}/${slugify(category.slug)}/${category.id}`;

    return (
        <motion.div
            whileHover={shouldReduceMotion ? undefined : "hover"}
            initial="initial"
            className="group relative w-full"
        >
            <Link href={targetHref} className="block w-full">
                <Card className="w-full flex flex-col gap-0 rounded-none border-0 shadow-none p-0 bg-transparent overflow-hidden">
                    {/* Image Container with Luxury Zoom Effect */}
                    <div className="relative w-full aspect-[3/4] overflow-hidden bg-stone-100">
                        <motion.div
                            variants={{
                                initial: { scale: 1 },
                                hover: { scale: 1.08 }
                            }}
                            transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
                            className="w-full h-full"
                        >
                            <Image
                                src={
                                    category?.cat_image
                                        ? `https://app.raangalay.com/${category.cat_image}`
                                        : "https://placehold.net/400x400.png"
                                }
                                alt={category?.name}
                                fill
                                className="object-cover transition-opacity duration-500 group-hover:opacity-90"
                                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                            />
                        </motion.div>

                        {/* Subtle Overlay on Hover */}
                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        {/* "View Collection" Slide-up Label */}
                        <div className="absolute inset-x-0 bottom-0 overflow-hidden h-12 flex items-center justify-center translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-white/80 backdrop-blur-sm">
                            <span className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-900">
                                Explore
                            </span>
                        </div>
                    </div>

                    {/* Typography: Centered & Minimalist */}
                    <div className="pt-4 pb-2 text-center space-y-1">
                        <h3 className="text-sm md:text-base font-black uppercase tracking-widest text-slate-800 transition-colors duration-300 group-hover:text-primary">
                            {category?.name}
                        </h3>
                        <div className="flex justify-center">
                            <motion.div 
                                variants={{
                                    initial: { width: 0, opacity: 0 },
                                    hover: { width: 24, opacity: 1 }
                                }}
                                className="h-[1.5px] bg-primary"
                            />
                        </div>
                    </div>
                </Card>
            </Link>
        </motion.div>
    );
};

export default CategoryCard;
