"use client";

import React, { useMemo, useState } from "react";
import { SlidersHorizontal, X, ChevronDown, RotateCcw, Check } from "lucide-react";
import { Product } from "@/types/product";
import { Category } from "@/types/category";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerClose,
    DrawerFooter,
} from "@/components/ui/drawer";

// --- Helpers ---
const safeParse = (attr: string | null | undefined): string[] => {
    if (!attr) return [];
    try {
        const parsed = JSON.parse(attr);
        return Array.isArray(parsed) ? parsed : [String(parsed)];
    } catch {
        return [attr];
    }
};

interface FilterState {
    Categories: string[];
    Size: string[];
    Colour: string[];
    priceRange: number;
}

const INITIAL_STATE: FilterState = {
    Categories: [],
    Size: [],
    Colour: [],
    priceRange: 10000,
};

const DynamicFilterBar = ({ products, categories }: { products: Product[], categories: Category[] }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [draftFilters, setDraftFilters] = useState<FilterState>(INITIAL_STATE);

    const filtersData = useMemo(() => ({
        Categories: categories.map(cat => cat.name),
        Size: Array.from(new Set(products.flatMap(p => safeParse(p.sizes)))),
        Colour: Array.from(new Set(products.flatMap(p => safeParse(p.colors)))),
    }), [products, categories]);

    const activeCount = useMemo(() => {
        return (draftFilters.Categories.length + draftFilters.Size.length + draftFilters.Colour.length) +
            (draftFilters.priceRange < 10000 ? 1 : 0);
    }, [draftFilters]);

    const toggleFilter = (group: keyof FilterState, value: string) => {
        setDraftFilters(prev => {
            const currentGroup = prev[group] as string[];
            const isSelected = currentGroup.includes(value);
            return {
                ...prev,
                [group]: isSelected
                    ? currentGroup.filter(item => item !== value)
                    : [...currentGroup, value]
            };
        });
    };

    const handleApply = () => {
        setIsOpen(false);
        // Add your filter application logic here
    };

    return (
        <>
            {/* Filter Bar */}
            <div className="sticky top-[68px] lg:top-[88px] z-40 bg-white/90 backdrop-blur-xl border-b border-zinc-100">
                <div className="container flex items-center justify-between h-16">
                    <button
                        onClick={() => setIsOpen(true)}
                        className="group flex items-center gap-3 px-4 lg:gpx-6 py-2.5 bg-zinc-900 text-white rounded-full transition-all hover:bg-black active:scale-95 shadow-lg shadow-zinc-200"
                    >
                        <SlidersHorizontal size={14} className="group-hover:rotate-180 transition-transform duration-500" />
                        <span className="text-[11px] font-black uppercase tracking-[0.15em]">Filters</span>
                        {activeCount > 0 && (
                            <span className="flex items-center justify-center bg-white text-black text-[9px] font-black w-5 h-5 rounded-full animate-in zoom-in">
                                {activeCount}
                            </span>
                        )}
                    </button>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center gap-2 text-zinc-400">
                            <span className="text-[10px] font-bold uppercase tracking-widest">Sort By:</span>
                        </div>
                        <div className="relative group cursor-pointer">
                            <div className="flex items-center gap-1 border-b-2 border-zinc-900 pb-0.5">
                                <span className="text-xs font-black uppercase tracking-tight">Newest</span>
                                <ChevronDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
                            </div>
                            <select className="absolute inset-0 opacity-0 cursor-pointer">
                                <option>Newest</option>
                                <option>Price: Low to High</option>
                                <option>Price: High to Low</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <Drawer open={isOpen} onOpenChange={setIsOpen} direction="right">
                <DrawerContent className="h-full ml-auto md:max-w-md rounded-none border-l border-zinc-100 bg-white shadow-2xl">
                    <DrawerHeader className="px-8 py-6 border-b">
                        <div className="flex justify-between items-center">
                            <div>
                                <DrawerTitle className="text-2xl font-black uppercase tracking-tighter italic">Filters</DrawerTitle>
                            </div>
                            <DrawerClose className="p-3 hover:bg-zinc-100 rounded-full transition-all">
                                <X size={20} />
                            </DrawerClose>
                        </div>
                    </DrawerHeader>

                    <div className="flex-1 overflow-y-auto px-8 py-4 space-y-12 no-scrollbar">
                        {/* Price Section */}
                        <div className="space-y-6">
                            <div className="flex justify-between items-end">
                                <h3 className="text-[11px] font-black uppercase tracking-widest">Price Limit</h3>
                                <span className="text-sm font-black tracking-tighter">Tk {draftFilters.priceRange.toLocaleString()}</span>
                            </div>
                            <input
                                type="range" min="0" max="10000" step="500"
                                className="w-full h-1 bg-zinc-100 rounded-none appearance-none cursor-pointer accent-black"
                                value={draftFilters.priceRange}
                                onChange={(e) => setDraftFilters(p => ({ ...p, priceRange: parseInt(e.target.value) }))}
                            />
                        </div>

                        {/* Filter Groups */}
                        {Object.entries(filtersData).map(([key, options]) => (
                            options.length > 0 && (
                                <div key={key} className="space-y-5">
                                    <h3 className="text-[11px] font-black uppercase tracking-widest text-zinc-400">{key}</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {options.map((option) => {
                                            const isChecked = (draftFilters[key as keyof FilterState] as string[]).includes(option);
                                            return (
                                                <button
                                                    key={option}
                                                    onClick={() => toggleFilter(key as keyof FilterState, option)}
                                                    className={`group relative px-5 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all
                                                        ${isChecked
                                                        ? "bg-zinc-900 text-white"
                                                        : "bg-white text-zinc-500 border border-zinc-200 hover:border-black hover:text-black"}`}
                                                >
                                                    {isChecked && <Check size={10} className="absolute top-1 right-1" />}
                                                    {option}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )
                        ))}
                    </div>

                    <DrawerFooter className="p-8 bg-zinc-50 grid grid-cols-2 gap-4 border-t border-zinc-100">
                        <button
                            onClick={() => setDraftFilters(INITIAL_STATE)}
                            className="flex items-center justify-center gap-2 h-14 border border-zinc-300 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white transition-all"
                        >
                            <RotateCcw size={12} /> Clear
                        </button>
                        <button
                            onClick={handleApply}
                            className="h-14 bg-black text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200"
                        >
                            Apply
                        </button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    );
};

export default DynamicFilterBar;