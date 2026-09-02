"use client"
import Image from "next/image";

const Banner = () => {


    return (
        <div className="relative w-full aspect-[16/8] sm:aspect-[16/7] md:aspect-[16/6]">
            <Image
                src="/images/banner/banner_image.webp"
                alt="banner image"
                fill
                className="object-cover w-full h-full"
                sizes="100vw"
                loading={"lazy"}
            />
        </div>
    );
};

export default Banner;
