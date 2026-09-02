"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Category } from "@/types/category";
import { slugify } from "@/utils";
import Link from "next/link";

const Banner = ({ categories }: { categories: Category[] }) => {
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://app.raangalay.com";

    if (!categories || categories.length === 0) return null;

    return (
        <div className="container mt-6 md:mt-8">
            <div className="flex flex-col-reverse lg:grid lg:grid-cols-12 gap-5 antialiased">

                {/* --- Main Feature (Left) --- */}
                {categories[0] && (
                    <Link
                        href={`/shop/${slugify(categories[0]?.slug)}/${categories[0]?.id}`}
                        className="lg:col-span-5 w-full group relative overflow-hidden block"
                    >
                        <div className="relative w-full aspect-[4/5] sm:aspect-[16/10] lg:aspect-[5/6] bg-neutral-100 flex items-center justify-center">
                            <Image
                                src={`${BASE_URL}/${categories[0].cat_image}`}
                                alt={categories[0].name}
                                fill
                                sizes="(min-width: 1024px) 40vw, 100vw"
                                className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                                priority
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80" />

                            <div className="absolute bottom-6 left-4 right-4 sm:bottom-10 sm:left-8 sm:right-8">
                                <div className="space-y-3">
                                    <p className="text-white/70 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] animate-pulse">
                                        Trendsetting
                                    </p>
                                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight tracking-tight sm:tracking-tighter">
                                        {categories[0].name}
                                    </h2>

                                    {/* Changed from Link to div to avoid nested anchors */}
                                    <div className="inline-flex items-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 bg-white text-black text-xs sm:text-sm font-bold uppercase tracking-[0.12em] sm:tracking-widest rounded-full group-hover:bg-primary group-hover:text-white transition-all duration-300 transform group-hover:translate-x-2">
                                        View details
                                        <ArrowRight size={16} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                )}

                {/* --- Secondary Grid (Right) --- */}
                <div className="lg:col-span-7 w-full grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {categories.slice(1, 4).map((item: Category, idx: number) => (
                        <Link
                            key={item.id + "-" + idx}
                            href={`/shop/${slugify(item?.slug)}/${item?.id}`}
                            className={`relative w-full group overflow-hidden bg-neutral-100 transition-all duration-500 shadow-sm hover:shadow-xl block ${
                                idx === 2 ? "sm:col-span-2 aspect-[16/8] sm:aspect-[5/2]" : "aspect-[4/3] sm:aspect-[5/4]"
                            }`}
                        >
                            <Image
                                src={`${BASE_URL}/${item.cat_image}`}
                                alt={item.name}
                                fill
                                sizes="(min-width: 1024px) 30vw, 100vw"
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                            />

                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />

                            <div className="absolute inset-0 p-4 sm:p-6 md:p-8 flex flex-col justify-end">
                                <div className="transform translate-y-0 sm:translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    <span className="text-white/90 text-xs sm:text-sm font-bold uppercase tracking-[0.12em] sm:tracking-widest mb-1 block">
                                        {item?.name}
                                    </span>
                                    <span className="text-white text-[11px] sm:text-xs font-medium underline underline-offset-4 sm:underline-offset-8 decoration-primary decoration-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        DISCOVER MORE
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Banner;
