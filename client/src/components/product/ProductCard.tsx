"use client";

import React from "react";
import { Product } from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import { Eye, Heart, ShoppingCart, Loader2 } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { errorToast, formatPrice, slugify, successToast } from "@/utils";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { CartItem } from "@/types/cart";
import { ApiResponse } from "@/types/api";
import { useWishStore } from "@/store/useWishStore";
import { WishItem } from "@/types/wish";
import { Rating } from "@smastrom/react-rating";

const ProductCard = ({ product }: { product: Product }) => {
    const shouldReduceMotion = useReducedMotion();
    const { name, id, images, discount, price, status } = product;
    const { addToCart, cartLoading, setCartLoading } = useCartStore();
    const { addToWish, setWishLoading, wishLoading } = useWishStore();

    const isWishLoading = wishLoading[product.id];
    const isCartLoading = cartLoading[product.id];
    const router = useRouter();

    const sizes: string[] = Array.isArray(product?.sizes)
        ? product.sizes
        : product?.sizes
            ? JSON.parse(product.sizes)
            : [];

    const colors: string[] = Array.isArray(product?.colors)
        ? product.colors
        : product?.colors
            ? JSON.parse(product.colors)
            : [];

    const stockProduct = product?.stocks?.find(
        (s) => Number(s.product_id) === product!.id
    );

    const handleAddToCart = async (): Promise<void> => {
        if (!product) return;
        if (sizes.length > 0 || colors.length > 0) {
            errorToast("You have to choose options for your item");
            router.push(`/product-details/${product.slug}/${product.id}`);
            return;
        }
        if (!stockProduct) {
            errorToast("Product stock not found");
            return;
        }

        try {
            const item: CartItem = {
                product_id: product.id,
                product_stock_id: stockProduct!.id,
                quantity: 1,
                size: sizes.length === 0 ? null : null,
                color: colors.length === 0 ? null : null
            };
            setCartLoading(product!.id, true);
            const result: ApiResponse<CartItem> = await addToCart(item);
            if (result?.message) {
                successToast(result.message);
            }
            if (result.errors) {
                const allErrors: string = Object.values(result.errors).flat().join(", ");
                errorToast(allErrors);
            }
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Something went wrong";
            errorToast(errorMessage);
        } finally {
            setCartLoading(product!.id, false);
        }
    };

    const handleAddToWishList = async (): Promise<void> => {
        if (!product) return;
        try {
            const item: WishItem = {
                product_id: product!.id,
                product_stock_id: stockProduct && stockProduct!.id,
                quantity: 1,
            };
            setWishLoading(product!.id, true);
            const result: ApiResponse<WishItem> = await addToWish(item);
            if (result?.message) {
                successToast(result.message);
            }
            if (result.errors) {
                const allErrors: string = Object.values(result.errors).flat().join(", ");
                errorToast(allErrors);
            }
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Something went wrong";
            errorToast(errorMessage);
        } finally {
            setWishLoading(product!.id, false);
        }
    };

    const firstImage = `https://app.raangalay.com/${images[0]?.image_path}`
    const discountPrice = Math.max(0, Number(price ?? 0) * (1 - Number(discount ?? 0) / 100));
    const isOutOfStock = status === "out_of_stock" || !stockProduct || Number(stockProduct?.quantity) < 1;

    return (
        <motion.div
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
            viewport={{ once: true }}
            className="group relative flex flex-col h-full bg-white"
        >
            <div className="relative aspect-[4/5] overflow-hidden bg-slate-50">
                <Link href={`/product-details/${slugify(product?.name)}/${id}`}>
                    <Image
                        src={images[0]?.image_path ? firstImage : "https://placehold.jp/400x400.png"}
                        alt={name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                </Link>

                <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex flex-col gap-1.5 sm:gap-2 z-[5]">
                    {isOutOfStock && (
                        <span className="bg-slate-900/90 backdrop-blur-md text-white px-2 py-1 sm:px-3 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.12em] sm:tracking-widest rounded-full">
                            Sold Out
                        </span>
                    )}
                    {Number(discount) > 0 && !isOutOfStock && (
                        <span className="bg-primary text-white px-2 py-1 sm:px-3 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.12em] sm:tracking-widest rounded-full shadow-lg">
                            {Math.floor(Number(discount))}% Off
                        </span>
                    )}
                </div>

                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 translate-y-0 opacity-100 lg:translate-y-12 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 transition-all duration-300 z-[5]">
                    <button
                        onClick={handleAddToWishList}
                        disabled={isWishLoading}
                        className="p-2.5 sm:p-3 bg-white text-dark-color hover:bg-primary hover:text-white rounded-full shadow-xl transition-all duration-300 active:scale-95"
                    >
                        {isWishLoading ? <Loader2 size={16} className="animate-spin" /> : <Heart size={16} />}
                    </button>
                    <Link
                        href={`/product-details/${slugify(product?.name)}/${id}`}
                        className="p-2.5 sm:p-3 bg-white text-dark-color hover:bg-slate-900 hover:text-white rounded-full shadow-xl transition-all duration-300 active:scale-95"
                    >
                        <Eye size={16} />
                    </Link>
                </div>
            </div>

            <div className="pt-3 sm:pt-4 flex flex-col flex-grow space-y-1.5 sm:space-y-2">
                <h2 className="text-[11px] sm:text-sm md:text-base font-bold text-slate-800 line-clamp-2 sm:line-clamp-1 group-hover:text-primary transition-colors uppercase tracking-tight leading-snug">
                    {name}
                </h2>

                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    {Number(discount) > 0 ? (
                        <>
                            <span className="text-base sm:text-lg font-black text-slate-900">{formatPrice(discountPrice)}</span>
                            <span className="text-[11px] sm:text-xs text-slate-400 line-through font-medium">{formatPrice(Number(price))}</span>
                        </>
                    ) : (
                        <span className="text-[11px] sm:text-sm md:text-base font-black text-slate-900">{formatPrice(Number(price))}</span>
                    )}
                </div>

                <div className="pb-2">
                    <Rating value={5} readOnly style={{ maxWidth: 64 }} />
                </div>

                <button
                    disabled={isCartLoading || isOutOfStock}
                    onClick={handleAddToCart}
                    className={`w-full h-11 sm:h-12 flex items-center justify-center gap-2 text-[11px] sm:text-xs font-bold uppercase tracking-[0.1em] sm:tracking-widest transition-all duration-300 active:scale-[0.98]
                        ${isCartLoading || isOutOfStock
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                            : "bg-slate-900 text-white hover:bg-primary hover:shadow-xl hover:shadow-primary/30"
                        }`}
                >
                    {isCartLoading ? (
                        <Loader2 size={16} className="animate-spin" />
                    ) : (
                        <>
                            {!isOutOfStock && <ShoppingCart size={16} />}
                            <span className="whitespace-nowrap">
                                {isOutOfStock ? "Unavailable" : "Add to Bag"}
                            </span>
                        </>
                    )}
                </button>
            </div>
        </motion.div>
    );
};

export default ProductCard;
