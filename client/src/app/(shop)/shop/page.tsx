import ProductNotFound from "@/components/product/ProductNotFound";

import { fetchProducts,} from "@/lib/productApi";
import ProductList from "@/components/product/ProductList";
import DynamicFilterBar from "@/components/product/filter/DynamicFilterBar";
import {getCategories} from "@/lib/categoriesApi";

const Page = async () => {
    // Fetch both Products and Categories in parallel
    const [productResponse, categoryResponse] = await Promise.all([
        fetchProducts(),
        getCategories(),
    ]);

    const productsArray = productResponse?.data || [];
    const categoriesArray = categoryResponse?.data || [];

    if (!productsArray || productsArray.length === 0) {
        return <ProductNotFound />;
    }

    return (
        <div className="relative">
        
            <DynamicFilterBar
                products={productsArray}
                categories={categoriesArray}
            />

            {/* Product List */}
            <div className="container mt-8">
                <ProductList products={productsArray} />
            </div>
        </div>
    );
};

export default Page;