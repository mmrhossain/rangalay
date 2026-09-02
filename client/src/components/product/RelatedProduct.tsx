import { fetchProductsByRemark } from "@/lib/productApi";
import { ApiResponse } from "@/types/api";
import { Product } from "@/types/product";
import ProductNotFound from "@/components/product/ProductNotFound";
import { Tag } from "lucide-react";
import React from "react";
import CustomButton from "@/components/ui/CustomButton";
import ProductList from "@/components/product/ProductList";

// Added currentProductId to props
const RelatedProduct = async ({ remark, currentProductId }: { remark: string, currentProductId?: number }) => {
    const result: ApiResponse<Product[]> | null = await fetchProductsByRemark(remark);

    if (!result || !result.data) return <ProductNotFound slug={remark} />;

    // 1. Filter out the specific product being viewed
    // 2. Then slice to show the first 10
    const filteredProducts = result.data
        .filter((p) => p.id !== Number(currentProductId))
        .slice(0, 10);

    // If after filtering we have no products, don't show the section
    if (filteredProducts.length === 0) return null;

    return (
        <div className="container">
            <div className="bg-bg-primary rounded-md p-4 sm:p-5 mt-6 md:mt-8">
                <div className="flex items-center justify-between mb-4 md:mb-6 gap-3">
                    <div className="flex items-center gap-2">
                    <span className="bg-white p-2 rounded-md">
                        <Tag size={20} className="text-primary" />
                    </span>
                        <h2 className="text-sm sm:text-lg md:text-2xl font-bold capitalize text-primary">
                            {remark} Products
                        </h2>
                    </div>

                    <CustomButton
                        className="bg-bg-primary text-primary hover:bg-bg-primary underline"
                        ctaText={"View all"}
                        path={`/shop?category=${remark.toLowerCase()}`}
                    />
                </div>

                <div className="">
                    <ProductList products={filteredProducts} />
                </div>
            </div>
        </div>
    );
};

export default RelatedProduct;
