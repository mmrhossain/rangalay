import { Metadata } from "next";
import { fetchProduct } from "@/lib/productApi";
import { Product } from "@/types/product";
import Features from "@/components/shared/Features";
import ProductDetails from "@/components/product/ProductDetails";
import ProductTab from "@/components/product/ProductTab";
import RelatedProduct from "@/components/product/RelatedProduct";

type Props = {
    params: Promise<{ slug: string; id: number }>;
};



export async function generateMetadata(
    { params }: Props
): Promise<Metadata> {

    const { slug, id } = await params;

    const product: Product | null = await fetchProduct(Number(id));

    if (!product) {
        return {
            title: "Product Not Found | Raangalay",
            description: "The requested product could not be found.",
        };
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://raangalay.com";
    const mediaBase = process.env.NEXT_PUBLIC_BASE_URL || "https://app.raangalay.com";
    const productUrl = `${siteUrl}/product-details/${slug}/${id}`;
    const firstImage = product.images?.[0]?.image_path;
    const imageUrl = firstImage
        ? `${mediaBase}/${firstImage}`
        : `${siteUrl}/images/placeholder/product_placeholder.jpg`;

    const cleanDescription =
        product.description?.replace(/<[^>]*>?/gm, "").slice(0, 160) ||
        "Discover premium quality products at Raangalay.";

    return {
        title: `${product.name} | Raangalay`,
        description: cleanDescription,

        alternates: {
            canonical: productUrl,
        },

        openGraph: {
            title: product.name,
            description: cleanDescription,
            url: productUrl,
            siteName: "Raangalay",
            images: [
                {
                    url: imageUrl,
                    width: 800,
                    height: 600,
                    alt: product.name,
                },
            ],
            type: "website",
        },

        twitter: {
            card: "summary_large_image",
            title: product.name,
            description: cleanDescription,
            images: imageUrl,
        },
    };
}

export default async function Page({ params }: Props) {
    const {id} = await params;
    const result: Product | null = await fetchProduct(Number(id));

    if (!result) return null;

    return (
        <div>
            <ProductDetails product={result} />
            <ProductTab product={result} />
            <RelatedProduct
                remark={result?.remarks as string}
                currentProductId={Number(id)}
            />
            <Features />
        </div>
    );
}
