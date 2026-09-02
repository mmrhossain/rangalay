import React from "react";

const FancyHeading = ({text, className}: {text: string, className?: string}) => {
    return (
        <div className="flex justify-center items-center">
            <h1 className={`${className}font-bold text-xl md:text-2xl lg:text-3xl 2xl:text-4xl heading-fancy`}>{text}</h1>
        </div>
    );
};

export default FancyHeading;