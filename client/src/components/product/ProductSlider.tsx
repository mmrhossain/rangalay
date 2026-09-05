"use client";

import React, { useRef, useState } from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from "@/components/ui/carousel";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { Slider } from "@/types/Slider";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import CustomButton from "@/components/button/Custom.button";

interface ProductSliderProps {
    sliders: Slider[];
}

const ProductSlider: React.FC<ProductSliderProps> = ({ sliders }) => {
    const autoplay = useRef(
        Autoplay({
            delay: 5000,
            stopOnInteraction: false,
            stopOnMouseEnter: true,
        })
    );

    const shouldReduceMotion = useReducedMotion();
    const [api, setApi] = useState<CarouselApi>(); 
    const [activeIndex, setActiveIndex] = useState(0);

    if (!sliders?.length) return null;

    return (
        /* 1. Ensure the section is w-screen and has no padding */
        <section className="relative w-full overflow-hidden left-0 right-0">
            <Carousel
                plugins={[autoplay.current]}
                opts={{ loop: true, align: "start" }}
                setApi={(emblaApi) => {
                    if (!emblaApi) return;
                    setApi(emblaApi);
                    setActiveIndex(emblaApi.selectedScrollSnap());
                    emblaApi.on("select", () => {
                        setActiveIndex(emblaApi.selectedScrollSnap());
                    });
                }}
                className="w-full"
            >
                {/* 2. ml-0 removes the standard gap between slides */}
                <CarouselContent className="ml-0 flex">
                    {sliders.map((slider, index) => (
                        <CarouselItem
                            key={index}
                            /* 3. pl-0 and min-w-full ensures the slide fills the track */
                            className="pl-0 min-w-full relative h-[25vh] sm:h-[70vh] md:h-[80vh] lg:h-[80vh] 2xl:h-[90vh]"
                        >
                            <div className="absolute inset-0 w-full h-full">
                                <Image
                                    src={slider.image_url}
                                    alt="Hero Banner"
                                    fill
                                    priority={index === 0}
                                    sizes="100vw"
                                    /* 4. Use object-cover to ensure no white space/bars on mobile */
                                    className="object-cover object-center"
                                />
                                <div className="hidden sm:block absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
                            </div>

                            {/* Content stays centered via 'container' but image is full-width */}
                            <div className="hidden sm:flex container relative h-full items-center px-4 sm:px-6 md:px-12 mx-auto">
                                <div className="max-w-xl text-white">
                                    <motion.div
                                        initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5 }}
                                        className="flex items-center gap-3 mb-4"
                                    >
                                        <div className="w-8 h-[2px] bg-white" />
                                        <span className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-white/80">
                                            New Collection 2026
                                        </span>
                                    </motion.div>

                                    <motion.h1
                                        initial={shouldReduceMotion ? {} : { opacity: 0, x: -30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.7, delay: 0.2 }}
                                        className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-4"
                                    >
                                        Modern Fashion <br />
                                        <span className="text-primary">Elegance.</span>
                                    </motion.h1>

                                    <motion.p
                                        initial={shouldReduceMotion ? {} : { opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                        className="text-sm sm:text-base md:text-lg text-white/80 mb-6 max-w-md"
                                    >
                                        Upgrade your wardrobe with our latest arrivals.
                                    </motion.p>

                                    <motion.div
                                        initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.6 }}
                                    >
                                        <CustomButton
                                            ctaText="Shop Now"
                                            icon={<ArrowRight size={18} />}
                                            path="/shop"
                                            className="bg-primary hover:bg-black text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-xs font-bold uppercase tracking-widest shadow-xl transition-all hover:scale-105"
                                        />
                                    </motion.div>
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                {/* Indicator Dots */}
                <div className="absolute bottom-3 sm:bottom-4 lg:bottom-16 2xl:bottom-20 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                    {sliders.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => api?.scrollTo(i)}
                            className={`transition-all duration-300 rounded-full ${
                                activeIndex === i
                                    ? "w-6 h-2 bg-white"
                                    : "w-2 h-2 bg-white/50 hover:bg-white"
                            }`}
                        />
                    ))}
                </div>
            </Carousel>
        </section>
    );
};

export default ProductSlider;