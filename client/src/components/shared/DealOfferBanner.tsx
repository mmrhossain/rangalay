"use client";

import React, { useMemo } from "react";
import { useCountDown } from "@/hooks/useCountDown";
import CustomButton from "@/components/ui/CustomButton";
import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import VideoPlayer from "@/components/shared/VideoPlayer";

const DealOfferBanner = () => {
  const targetDate = useMemo(() => Date.now() + 500 * 60 * 60 * 1000, []);
  const [days, hours, minutes, seconds] = useCountDown(targetDate);

  const timeItems = [
    { label: "Days", value: days },
    { label: "Hrs", value: hours },
    { label: "Min", value: minutes },
    { label: "Sec", value: seconds },
  ];

  return (
    <div className="container mt-8 md:mt-12 overflow-hidden">
      <div className="relative overflow-hidden bg-bg">
        {/* 1. Background Enhancement */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <Image
            src="/images/banner/banner_image.webp"
            alt="banner-bg"
            fill
            className="object-cover opacity-60 scale-105"
            sizes="(max-width: 768px) 100vw, 1200px"
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-primary/10 blur-[60px] md:blur-[120px] rounded-full" />
        </div>

        {/* 2. Main Layout */}
        <div className="relative  grid grid-cols-12 gap-y-10 md:gap-8 p-6 sm:p-10 md:p-14 lg:p-20 items-center">
          
          {/* Right Content (Video/Image) - Moved top on Mobile via Order-1 */}
          <div className="col-span-12 md:col-span-5 lg:col-span-6 flex justify-center items-center order-1 md:order-2">
            <div className="relative w-full max-w-[280px] sm:max-w-sm md:max-w-lg">
              <div className="absolute -top-5 -right-5 w-16 h-16 bg-primary/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-5 -left-5 w-16 h-16 bg-indigo-500/10 rounded-full blur-2xl" />

              <div className="relative rounded-2xl overflow-hidden border-[6px] md:border-[10px] border-white shadow-xl">
                <VideoPlayer />
              </div>
            </div>
          </div>

          {/* Left Content */}
          <div className="col-span-12 md:col-span-7 lg:col-span-6 space-y-5 md:space-y-7 text-center md:text-left order-2 md:order-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 rounded-full border border-primary/20">
              <Sparkles size={12} className="text-primary animate-pulse" />
              <span className="text-[10px] md:text-xs font-bold text-primary uppercase tracking-[0.15em]">
                Limited Time Offer
              </span>
            </div>

            <div className="space-y-3">
              <h3 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-secondary tracking-tighter leading-[1.1] md:leading-none">
                Deal of <span className="text-primary italic">the Day.</span>
              </h3>
              <p className="text-secondary/80 text-sm md:text-base lg:text-lg leading-relaxed max-w-md mx-auto md:mx-0">
                Experience luxury at a fraction of the cost. Exclusive discounts on our premium apparel.
              </p>
            </div>

            {/* 3. Modernized Countdown */}
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 sm:gap-4 py-2">
              {timeItems.map(({ label, value }, index) => (
                <div key={label} className="flex items-center">
                  <div className="group relative">
                    <div className="relative w-[60px] h-[75px] sm:w-20 sm:h-24 bg-white/90 backdrop-blur-md rounded-2xl border border-white flex flex-col items-center justify-center shadow-md transition-transform duration-300 motion-reduce:transform-none hover:-translate-y-1">
                      <span className="text-xl sm:text-3xl font-black text-slate-900 leading-none">
                        {value}
                      </span>
                      <span className="text-[9px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mt-1 sm:mt-2">
                        {label}
                      </span>
                    </div>
                  </div>

                  {/* Divider dots - hidden on very small screens to prevent overflow */}
                  {index !== timeItems.length - 1 && (
                    <div className="hidden xs:flex mx-1 sm:mx-2 flex-col gap-1.5 opacity-20">
                      <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-slate-900 rounded-full" />
                      <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-slate-900 rounded-full" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* 4. Action Button */}
            <div className="pt-4 flex justify-center md:justify-start">
              <CustomButton
                icon={<ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                className="group h-14 md:h-16 px-10 rounded-full bg-slate-900 text-white font-bold text-sm uppercase tracking-widest hover:bg-primary transition-all duration-300 shadow-lg w-full sm:w-auto"
                ctaText="Explore Collection"
                path="/shop"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DealOfferBanner;
