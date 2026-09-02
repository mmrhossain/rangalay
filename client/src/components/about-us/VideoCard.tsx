import React from 'react';
import Image from "next/image";
import VideoPlayer from "@/components/shared/VideoPlayer";

const VideoCard: React.FC<{
    src: string;
    alt: string;
    width: number;
    height: number;
}> = ({src, alt, width, height}) => {
    return (
        <div className="flex-1">
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] lg:aspect-[3/2] overflow-hidden rounded-2xl">
                <Image
                    width={width}
                    height={height}
                    src={src}
                    alt={alt}
                    className="w-full h-full object-cover"
                    quality={85}
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="rounded-full p-6 transition-transform hover:scale-110">
                        <VideoPlayer />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoCard;
