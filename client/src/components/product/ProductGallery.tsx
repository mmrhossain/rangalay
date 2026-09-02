"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi
} from "@/components/ui/carousel";
import { ProductImage } from "@/types/product";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
    images: ProductImage[];
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ images }) => {
    const [api, setApi] = useState<CarouselApi>();
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Sync thumbnail click with carousel
    const onThumbClick = (index: number) => {
        if (!api) return;
        api.scrollTo(index);
        setSelectedIndex(index);
    };

    // Sync carousel swipe with thumbnail highlight
    React.useEffect(() => {
        if (!api) return;
        api.on("select", () => {
            setSelectedIndex(api.selectedScrollSnap());
        });
    }, [api]);

    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

    return (
        <div className="flex flex-col-reverse lg:flex-row gap-3 sm:gap-4 w-full">
            {/* Thumbnails Sidebar - Desktop: Vertical | Mobile: Horizontal */}
            <div className="flex lg:flex-col gap-2 sm:gap-3 overflow-x-auto lg:overflow-y-auto no-scrollbar lg:max-h-[600px] py-1">
                {images.map((image, index) => (
                    <button
                        key={`thumb-${image.id}`}
                        onClick={() => onThumbClick(index)}
                        className={cn(
                            "relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 border-2 transition-all duration-200 overflow-hidden rounded-md",
                            selectedIndex === index
                                ? "border-primary ring-2 ring-primary/20"
                                : "border-transparent hover:border-gray-300"
                        )}
                    >
                        <Image
                            src={`${BASE_URL}/${image.image_path}`}
                            alt="thumbnail"
                            fill
                            sizes="80px"
                            className="object-cover"
                        />
                    </button>
                ))}
            </div>

            {/* Main Display Area */}
            <div className="relative flex-1 group">
                <Carousel
                    setApi={setApi}
                    className="w-full"
                    opts={{ align: "start", loop: true }}
                >
                    <CarouselContent>
                        {images.map((image, index) => (
                            <CarouselItem key={image.id}>
                                <div className="relative aspect-square w-full max-h-[560px] sm:max-h-[700px] overflow-hidden rounded-lg bg-gray-50">
                                    <Image
                                        src={`${BASE_URL}/${image.image_path}`}
                                        alt={`Product image ${index + 1}`}
                                        fill
                                        className="object-cover"
                                        priority={index === 0}
                                        sizes="(max-width: 1024px) 100vw, 60vw"
                                    />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    {/* Navigation - Hidden on mobile, visible on hover for desktop */}
                    <CarouselPrevious
                        className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white text-black border-none shadow-lg"
                    />
                    <CarouselNext
                        className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white text-black border-none shadow-lg"
                    />
                </Carousel>

                {/* Counter Badge */}
                <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-black/60 text-white px-2.5 py-1 sm:px-3 rounded-full text-[11px] sm:text-xs backdrop-blur-md">
                    {selectedIndex + 1} / {images.length}
                </div>
            </div>
        </div>
    );
};

export default ProductGallery;
