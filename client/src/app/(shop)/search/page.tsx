import { Suspense } from "react";
import { searchProduct } from "@/lib/productApi";
import ProductList from "@/components/product/ProductList";
import ProductNotFound from "@/components/product/ProductNotFound";

// Use searchParams instead of params for query strings (?result=...)
interface PageProps {
  searchParams: Promise<{ result?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
    const { result: slug } = await searchParams;

    // Fallback if someone navigates to /search without a query
    if (!slug) return <ProductNotFound slug="" />;

    const result = await searchProduct(slug);
    const data = result?.data ?? [];

    return (
        <div className="min-h-[80vh] 2xl:min-h-[100vh] container">
            <div className="py-4">
                <h1 className="font-medium capitalize">
                    Search results for:{" "}
                    <span className="font-semibold text-primary">{slug}</span>
                </h1>

                {/* Suspense here only works if data fetching happens inside a child component. 
                    Since we await searchProduct above, the page will wait before rendering. */}
                <Suspense>
                    {data.length > 0 ? (
                        <ProductList products={data} />
                    ) : (
                        <ProductNotFound slug={slug} />
                    )}
                </Suspense>
            </div>
        </div>
    );
}