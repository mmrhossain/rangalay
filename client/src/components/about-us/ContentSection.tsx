import React from 'react';
import {ABOUT_CONTENT} from "@/dummyData/about";

const ContentSection = () => {
    return (
        <div className="space-y-6">
            <h3 className="text-primary font-semibold text-xl leading-tight">
                {ABOUT_CONTENT.badge}
            </h3>

            <h2 className="text-xl lg:text-3xl font-bold text-dark-color">
                {ABOUT_CONTENT.title}
            </h2>

            {ABOUT_CONTENT.paragraphs.map((paragraph, index) => (
                <p key={index} className="text-secondary leading-relaxed">
                    {paragraph}
                </p>
            ))}

        </div>
    );
};

export default ContentSection;