import React from 'react';
import Image from "next/image";

const ImageCard: React.FC<
    {
        src: string;
        alt: string;
        width: number;
        height: number;
        className?: string;
        priority?: boolean;
    }
> = ({ src, alt, width, height, className = "", priority = false }) => {
    return (
        <div className="flex-1">
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] lg:aspect-[3/2] overflow-hidden rounded-2xl">
                <Image
                    width={width}
                    height={height}
                    src={src}
                    alt={alt}
                    className={`w-full h-full object-cover ${className}`}
                    priority={priority}
                    quality={85}
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
            </div>
        </div>
    );
};

export default ImageCard;
