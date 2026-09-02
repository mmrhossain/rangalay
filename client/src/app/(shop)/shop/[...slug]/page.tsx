import Subcategories from "@/components/categories/Subcategories";
import ProductList from "@/components/product/ProductList";
import { Category } from "@/types/category";
import Features from "@/components/shared/Features";
import { categoryDetails } from "@/lib/categoriesApi";
import { Product } from "@/types/product";
import { notFound } from "next/navigation";
import ProductNotFound from "@/components/product/ProductNotFound";
import DynamicFilterBar from "@/components/product/filter/DynamicFilterBar";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;

  // Get the last segment as ID
  const lastPart = slug?.[slug.length - 1];
  const id = Number(lastPart);

  if (!id) {
    return notFound();
  }

  let details: Category | null = null;
  try {
    details = await categoryDetails(id);
  } catch (error) {
    console.error("Failed to fetch category details:", error);
    return notFound();
  }

  if (!details) {
    return notFound();
  }

  const subcategories: Category[] = details?.all_children ?? [];
  const products: Product[] = details?.products ?? [];

  const parent_category = {
    name: details.name,
    image: details.cat_image,
  };

  if (subcategories?.length === 0 && products.length === 0) {
    return <ProductNotFound />;
  }

  return (
    <div className="min-h-screen">
      {subcategories?.length > 0 ? (
        <Subcategories
          subCategories={subcategories}
          parent_category={parent_category}
        />
      ) : (
        <div className="relative">
          {/* 1. Add the Filter Bar here */}
          <DynamicFilterBar products={products} categories={subcategories} />

          {/* Product List */}
          <div className="container mt-8">
            <ProductList products={products} />
          </div>
        </div>
      )}

      <Features />
    </div>
  );
}
