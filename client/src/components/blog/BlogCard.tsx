"use client";

import React from "react";
import Image from "next/image";
import { BlogPost } from "@/types/blog";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import {Card, CardFooter, CardHeader} from "@/components/ui/card";

interface BlogCardProps {
    blogItem: BlogPost;
}

const BlogCard: React.FC<BlogCardProps> = ({ blogItem }) => {
    const { id, image, title, date } = blogItem;

    return (
        <div className="group h-full">
            <Card className="flex flex-col h-full border-0 shadow-none p-0 rounded-none bg-transparent overflow-hidden">

                {/* Image Container with Zoom Effect */}
                <Link
                    href={`/blogs/${id}`}
                    className="relative block aspect-[16/11] overflow-hidden mb-5"
                    aria-label={`Read blog: ${title}`}
                >
                    <Image
                        src={image}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                    {/* Subtle Overlay on Hover */}
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>

                {/* Content Area */}
                <CardHeader className="p-0 flex-grow space-y-2">
                    <div className="flex items-center gap-2">
                        <span className="w-8 h-[1px] bg-primary/40" />
                        <time className="text-[11px] md:text-xs font-bold uppercase tracking-[0.12em] md:tracking-[0.2em] text-slate-400">
                            {date}
                        </time>
                    </div>

                    <Link href={`/blogs/${id}`} className="block group/title">
                        <h3 className="text-sm sm:text-lg lg:text-2xl font-bold text-slate-900 leading-tight transition-colors duration-300 group-hover/title:text-primary">
                            {title.length > 30 ? `${title.slice(0, 30)}...` : title}
                        </h3>
                        {/* Interactive Animated Underline */}
                        <div className="mt-2 h-0.5 w-0 bg-primary group-hover/title:w-full transition-all duration-500 ease-in-out" />
                    </Link>
                </CardHeader>

                {/* Footer / CTA */}
                <CardFooter className="p-0">
                    <Link
                        href={`/blogs/${id}`}
                        className="inline-flex items-center gap-2 min-h-11 text-xs md:text-sm font-extrabold uppercase tracking-[0.1em] md:tracking-widest text-slate-900 group/btn"
                    >
                        <span className="relative">
                            Read Article
                            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-slate-100 group-hover/btn:bg-primary transition-colors" />
                        </span>
                        <div className="p-2 rounded-full border border-slate-100 group-hover/btn:bg-primary group-hover/btn:text-white group-hover/btn:border-primary transition-all duration-300">
                            <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                        </div>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
};

export default BlogCard;
