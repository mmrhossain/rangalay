"use client";

import React from "react";
import { blogList } from "@/dummyData/blogList";
import { BlogPost } from "@/types/blog";
import BlogCard from "@/components/blog/BlogCard";
import { usePathname } from "next/navigation";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import FancyHeading from "@/components/shared/FancyHeading";

const BlogList: React.FC = () => {
    const pathname = usePathname();

    const renderGrid = () => (
        <div className="container mt-8">
            <FancyHeading text="Recent Blogs" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8 mt-12">
                {blogList.map((blog: BlogPost) => (
                    <BlogCard key={blog.id} blogItem={blog} />
                ))}
            </div>
        </div>
    );

    const renderCarousel = () => (
        <div className="container mt-8 overflow-x-hidden relative">
            <FancyHeading text="Recent Blogs" />

            {/* Carousel wrapper with group for buttons only */}
            <div className="relative mt-12">
                <Carousel opts={{ align: "start", loop: true }} className="w-full">
                    <CarouselContent className="flex gap-4">
                        {blogList.map((blog: BlogPost) => (
                            <CarouselItem
                                key={blog.id}
                                className="basis-1/2 md:basis-1/3 xl:basis-1/4 group"
                            >
                                <BlogCard blogItem={blog} />
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    {/* Carousel navigation buttons */}
                    <CarouselPrevious
                        aria-label="Previous blog"
                        className="border-0 hover:flex z-0 bg-primary text-white left-0 hover:bg-black transition-all duration-300"
                    />
                    <CarouselNext
                        aria-label="Next blog"
                        className="border-0 hover:flex z-0 bg-primary text-white right-0 hover:bg-black transition-all duration-300"
                    />
                </Carousel>
            </div>
        </div>
    );

    return pathname === "/blogs" ? renderGrid() : renderCarousel();
};

export default BlogList;
