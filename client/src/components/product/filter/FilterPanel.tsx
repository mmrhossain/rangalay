import React from "react";
import {formatPrice} from "@/utils";

type FilterPanelProps = {
    categories: string[];
    selectedCategory: string;
    onSelectCategory: (category: string) => void;
    priceMin: number;
    priceMax: number;
    onPriceChange: (min: number, max: number) => void;
    selectedPrice: {min: number; max: number};
    onClearAll: () => void;
};

const FilterPanel = ({
                         // categories,
                         selectedCategory,
                         onSelectCategory,
                         priceMin,
                         priceMax,
                         selectedPrice,
                         onPriceChange,
                         onClearAll,
                     }: FilterPanelProps) => {
    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Filters</h3>
                <button
                    className="text-sm text-primary font-semibold hover:underline"
                    onClick={onClearAll}
                >
                    Reset
                </button>
            </div>

            <div className="border border-gray-200 rounded-xl p-4 space-y-3">
                <h4 className="text-sm font-semibold text-slate-900">Categories</h4>
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm text-secondary">
                        <input
                            type="radio"
                            name="category"
                            value="all"
                            checked={selectedCategory === "all"}
                            onChange={() => onSelectCategory("all")}
                        />
                        All
                    </label>
                    {/*{categories.map(category => (*/}
                    {/*    <label key={category} className="flex items-center gap-2 text-sm text-secondary">*/}
                    {/*        <input*/}
                    {/*            type="radio"*/}
                    {/*            name="category"*/}
                    {/*            value={category}*/}
                    {/*            checked={selectedCategory === category}*/}
                    {/*            onChange={() => onSelectCategory(category)}*/}
                    {/*        />*/}
                    {/*        {category}*/}
                    {/*    </label>*/}
                    {/*))}*/}
                </div>
            </div>

            <div className="border border-gray-200 rounded-xl p-4 space-y-3">
                <h4 className="text-sm font-semibold text-slate-900">Price range</h4>
                <div className="flex gap-3">
                    <div className="flex-1">
                        <label className="text-xs text-secondary">Min</label>
                        <input
                            type="number"
                            min={priceMin}
                            max={selectedPrice.max}
                            value={selectedPrice.min}
                            onChange={e => onPriceChange(Number(e.target.value) || 0, selectedPrice.max)}
                            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="text-xs text-secondary">Max</label>
                        <input
                            type="number"
                            min={selectedPrice.min}
                            max={priceMax}
                            value={selectedPrice.max}
                            onChange={e => onPriceChange(selectedPrice.min, Number(e.target.value) || priceMax)}
                            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                </div>
                <p className="text-xs text-secondary">
                    Showing products between {formatPrice(selectedPrice.min)} and {formatPrice(selectedPrice.max)}.
                </p>
            </div>()

        </div>
    );
};

export default FilterPanel