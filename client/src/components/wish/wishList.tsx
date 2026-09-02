"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Trash2 } from "lucide-react";
import { useWishStore } from "@/store/useWishStore";
import {
    DeleteAlert,
    errorToast,
    formatPrice, slugify,
    SuccessAlert, successToast,
} from "@/utils";
import { useCartStore } from "@/store/useCartStore";
import WishListSkeleton from "@/skeleton/WishListSkeleton";
import {CartItem} from "@/types/cart";
import {ApiResponse} from "@/types/api";
import {useRouter} from "next/navigation";
import {WishItem} from "@/types/wish";
import EmptyState from "@/components/shared/EmptyState";

const Wishlist = () => {

    const { wishes, wishCount, removeFromWishList, } = useWishStore();
    const { addToCart, cartLoading, setCartLoading } = useCartStore();
    const router = useRouter();

    // product add to wish
    const handleWishRemove = async (id: number) => {
        try {
            const confirmed = await DeleteAlert();
            if (!confirmed) return;

            const result = await removeFromWishList(id);
            if (result?.message) {
                await SuccessAlert(result.message);
            }
        } catch (err: unknown) {
            const errorMessage =
                err instanceof Error ? err.message : "Something went wrong";
            errorToast(errorMessage);
            console.error(err);
        }
    };

    //product add to cart
    const handleAddToCart = async (item: WishItem): Promise<void> => {

        const sizes: string[] = Array.isArray(item?.product?.sizes)
            ? item?.product.sizes
            : item?.product?.sizes
                ? JSON.parse(item?.product.sizes)
                : [];

        const colors: string[] = Array.isArray(item?.product?.colors)
            ? item?.product?.colors
            : item?.product?.colors
                ? JSON.parse(item?.product?.colors)
                : [];

        if (sizes.length > 0 || colors.length > 0) {
            errorToast("You have to choose options for your item");
            router.push(`/product-details/${item?.product?.slug}/${item?.product?.id}?from_source=wishlist`);
            return;
        }

        // find product stock id
        const stock = item?.product?.stocks?.find(
            (s) => Number(s.product_id) === item?.product!.id
        );

        if (!stock) {
            errorToast("Product stock not found");
            return;
        }
        try {

            const data = {
                product_id: item?.product_id,
                product_stock_id: stock!.id,
                quantity: 1,
                size: sizes.length === 0 ? 'N/A' : 'N/A',
                color: colors.length === 0 ? 'N/A' : 'N/A',
                from_source: 'wishlist'
            };

            setCartLoading(item?.product!.id, true);

            const result: ApiResponse<CartItem> = await addToCart(data);

            if (result?.message) {
                successToast(result.message);
            }

            // Validation errors
            if (result.errors) {
                const allErrors: string = Object.values(result.errors)
                    .flat()
                    .join(", ");
                errorToast(allErrors);
            }
        } catch (err: unknown) {
            const errorMessage =
                err instanceof Error ? err.message : "Something went wrong";
            errorToast(errorMessage);
            console.error(err);
        } finally {
            setCartLoading(item?.product!.id, false);
        }
    };



    if (!wishes) return <WishListSkeleton />;
    if (wishCount === 0) return <EmptyState text={"wish"} />

    return (
        <section className="container pb-24 md:pb-0">
            <div className="">
                <div className="mb-6">
                    <h2 className="text-lg lg:text-xl font-semibold text-slate-900 uppercase">
                        Wishlist ({wishCount})
                    </h2>

                    <p className="text-dark-color text-sm">All your save items</p>
                </div>

                {/* Single responsive layout */}
                <div className="flex flex-col gap-4">
                    {wishes?.map((item) => {

                        const stock = item?.product?.stocks?.find(
                            (s) => Number(s.product_id) === item?.product?.id
                        );
                        const productId = item?.product?.id;
                        const isCartLoading = productId ? cartLoading[productId] : false;

                        return (
                            <div
                                key={item.id}
                                className="flex flex-col sm:flex-row sm:items-center gap-4 border border-gray-200 p-4"
                            >
                                {/* Left */}
                                <div className="flex items-start gap-3 flex-1 min-w-0">
                                    <button
                                        onClick={() => handleWishRemove(Number(item.id))}
                                        className="p-2 rounded-md border border-gray-200 hover:bg-gray-100 text-secondary transition"
                                        aria-label="Remove from wishlist"
                                    >
                                        <Trash2 size={16} />
                                    </button>

                                    <div className="w-24 sm:w-28 lg:w-32 h-32 sm:h-40 relative overflow-hidden shrink-0">
                                        <Link href={`/product-details/${slugify(item?.product?.slug)}/${item?.product?.id}?from_source=wishlist`}>
                                            <Image
                                                src={item?.product?.images?.[0]?.image_path ? `https://app.raangalay.com/${item.product.images[0].image_path}` : "/images/placeholder/product_placeholder.jpg"}
                                                alt={item?.product?.name || ""}
                                                fill
                                                sizes="(max-width: 640px) 96px, 128px"
                                                className="object-cover"
                                            />
                                        </Link>
                                    </div>

                                    <div className="min-w-0 space-y-1">
                                        <Link href={`/product-details/${slugify(item?.product?.slug)}/${item?.product?.id}?from_source=wishlist`}>
                                            <p className="text-sm sm:text-base font-semibold text-slate-900 line-clamp-2 hover:text-primary transition-colors cursor-pointer">
                                                {item?.product?.name}
                                            </p>
                                        </Link>
                                        <p className="text-xs sm:text-sm text-secondary">
                                            {item?.product?.price
                                                ? formatPrice(Number(item.product.price))
                                                : ""}
                                        </p>

                                    </div>
                                </div>

                                {/* Action */}
                                <div className="flex justify-end sm:w-40">
                                    <button
                                        disabled={
                                            isCartLoading ||
                                            item?.product?.status === "out_of_stock" ||
                                            !stock ||
                                            Number(stock?.quantity) < 1
                                        }
                                        onClick={() => handleAddToCart(item)}
                                        className={`
    px-4 py-2.5
    text-white text-xs sm:text-sm font-semibold
    transition
    w-full sm:w-auto
    flex items-center justify-center
    ${
                                            Number(stock?.quantity) < 1
                                                ? "bg-danger cursor-not-allowed"
                                                : "bg-primary hover:bg-btn-hover"
                                        }
`}

                                    >
                                        <span className="flex gap-2 items-center">
                                            {!isCartLoading &&
                                                item?.product?.status === "active" &&
                                                Number(stock?.quantity) > 0 && (
                                                    <ShoppingCart size={16} />
                                                )}
                                            {isCartLoading
                                                ? "Processing..." : item?.product?.status === "out_of_stock" || !stock || Number(stock?.quantity) < 1 ? "Out of stock" : "Add to Cart"}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    );
};

export default Wishlist;
