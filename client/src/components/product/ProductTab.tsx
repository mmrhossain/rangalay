"use client";

import React, { useState } from "react";
import { Product } from "@/types/product";
import { Tag } from "lucide-react";
import { formatPrice } from "@/utils";
import ReviewTab from "@/components/product/ReviewTab";

const ProductTabs = ({ product }: { product: Product }) => {
    const [activeTab, setActiveTab] = useState("Description");
    const tabs = ["Description", "Product Reviews"];

    const specRows = [
        { label: "Product Name", value: product?.name },
        { label: "Price", value: `${formatPrice(Number(product?.price))}` },
        { label: "SKU", value: `${product?.sku || ""}` },
        ...(product?.discount && Number(product.discount) > 0
            ? [{ label: "Discount", value: `${product.discount}% OFF`, isHighlight: true }]
            : []),
        { label: "Category", value: product?.category?.name || "" },
        { label: "Brand", value: product?.brand || "Raangalay" },
    ];

    return (
        <div className="container mt-10 md:mt-16 mb-12 md:mb-20 2xl:w-[70%] mx-auto">
            <div className="flex flex-wrap gap-5 sm:gap-8 border-b border-gray-100 pb-3 md:pb-4">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`text-sm sm:text-base md:text-lg font-medium transition-all relative ${
                            activeTab === tab
                                ? "text-primary after:absolute after:bottom-[-13px] md:after:bottom-[-17px] after:left-0 after:w-full after:h-[2px] after:bg-primary"
                                : "text-secondary hover:text-primary"
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="mt-6 md:mt-10 lg:p-8 lg:bg-bg-primary rounded-sm">
                {activeTab === "Description" && (
                    <div className="space-y-6 md:space-y-12 animate-in fade-in duration-500">
                        <div className="bg-white p-4 sm:p-6 border border-gray-100 rounded-2xl shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-teal-50 rounded-lg">
                                    <Tag className="text-primary" size={20} />
                                </div>
                                <h2 className="text-lg sm:text-xl font-bold text-slate-900">Description</h2>
                            </div>
                            <p className="text-secondary leading-relaxed max-w-6xl">
                                {product?.description || "Product description will appear here."}
                            </p>
                        </div>

                        <div className="bg-white p-4 sm:p-6 border border-gray-100 rounded-2xl shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-teal-50 rounded-lg">
                                    <Tag className="text-primary" size={20} />
                                </div>
                                <h2 className="text-lg sm:text-xl font-bold text-slate-900">Specifications</h2>
                            </div>

                            <div className="border border-gray-100 rounded-xl overflow-hidden">
                                {specRows.map((row, index) => (
                                    <div
                                        key={index}
                                        className="grid grid-cols-1 md:grid-cols-2 py-4 px-6 border-b border-gray-100 last:border-0 hover:bg-slate-50 transition-colors"
                                    >
                                        <span className="font-bold text-slate-900 text-sm">{row.label}</span>
                                        <div className="text-sm">
                                            {row.isHighlight ? (
                                                <span className="text-red-500 font-semibold">{row.value}</span>
                                            )
                                            : (
                                                <span className="text-slate-600">{row.value}</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "Product Reviews" && (
                    <div className="animate-in fade-in duration-500">
                        <ReviewTab />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductTabs;
