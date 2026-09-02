"use client";

import { JSX, useEffect, useState } from 'react';
import { fetchProductsByRemark } from "@/lib/productApi";
import ProductList from "./ProductList";
import FancyHeading from "@/components/shared/FancyHeading";
import { remarkList } from "@/dummyData/productList";
import { Remark } from "@/types/remark";
import { Product } from "@/types/product";
import ProductsSkeleton from "@/skeleton/productsSkeleton";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import CustomButton from '../ui/CustomButton';
import {ArrowRight} from "lucide-react";


const ProductListByRemark = () => {
    const [remarkState, setRemarkState] = useState(remarkList[0]?.name);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const shouldReduceMotion = useReducedMotion();

    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            try {
                const result = await fetchProductsByRemark(remarkState);
                setProducts(result?.data || []);
            } catch (error) {
                console.error("Failed to fetch products:", error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };
        loadProducts();
    }, [remarkState]);

    return (
        <div className="container mt-6 md:mt-8">
            <div className="flex flex-col items-center space-y-6 md:space-y-10">
                <FancyHeading text={"Featured Collection"} />

                {/* Modern Tab Switcher */}
                <div className="relative flex items-center justify-center p-1 rounded-full border border-slate-100 overflow-x-auto no-scrollbar max-w-full">
                    {remarkList.map((remark: Remark): JSX.Element => {
                        const isActive = remark.name === remarkState;
                        return (
                            <button
                                key={remark.id}
                                onClick={() => setRemarkState(remark.name)}
                                className={`relative px-2.5 sm:px-3 py-2 text-[11px] md:text-sm font-bold uppercase tracking-[0.08em] sm:tracking-widest whitespace-nowrap transition-all duration-300 ${
                                    isActive ? "text-white" : "text-slate-400 hover:text-slate-900"
                                }`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-slate-900 rounded-full -z-10 shadow-lg shadow-slate-900/20"
                                        transition={shouldReduceMotion ? { duration: 0 } : { type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                {remark.name}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Product Grid Area with Fade-In Animation */}
            <div className="relative min-h-[280px] sm:min-h-[360px]">
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            key="skeleton"
                            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
                        >
                            <ProductsSkeleton />
                        </motion.div>
                    ) : products.length === 0 ? (
                        <motion.div
                            key="not-found"
                            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <ProductsSkeleton />
                        </motion.div>
                    ) : (
                        <motion.div
                            key={remarkState}
                            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: shouldReduceMotion ? 0 : 0.4, ease: "easeOut" }}
                        >
                            <ProductList products={products} />

                             {/* See More Button */}
                            <div className="mt-8 md:mt-14 pt-4 md:pt-6 border-t border-slate-100 w-full flex justify-center">
                                <CustomButton 
                                    ctaText={`See All ${remarkState}`}
                                    path={`/shop?remark=${remarkState.toLowerCase()}`}
                                    icon={<ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                                    className="group h-11 sm:h-14 px-6 sm:px-10 bg-white border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white transition-all duration-300 rounded-full font-black uppercase text-[10px] sm:text-[11px] tracking-[0.08em] sm:tracking-[0.2em] shadow-xl hover:shadow-slate-900/20"
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ProductListByRemark;
