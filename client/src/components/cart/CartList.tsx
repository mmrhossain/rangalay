"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";

import { CartItem } from "@/types/cart";
import {
    DeleteAlert,
    errorToast,
    formatPrice, slugify,
    SuccessAlert,
    successToast,
} from "@/utils";
import { useCartStore } from "@/store/useCartStore";
import Subtotal from "@/components/cart/Subtotal";
import CartListSkeleton from "@/skeleton/CartListSkeleton";
import EmptyState from "@/components/shared/EmptyState";

const CartList = () => {

    const { cart, cartCount, cartLoading, setCartLoading, removeFromCart, updateCart, fetchCart } = useCartStore();


    const handleCartRemove = async (id: number) => {
        try {
            const confirmed = await DeleteAlert();
            if (!confirmed) return;
            const result = await removeFromCart(id);
            if (result?.message) {
                await SuccessAlert(result.message);
                await fetchCart();
            }
        } catch (err) {
            if (err && typeof err === "object" && "errors" in err) {
                const errorObj = err as { errors: Record<string, string[]> };
                Object.values(errorObj.errors)
                    .flat()
                    .forEach((msg) => errorToast(msg));
            } else if (err && typeof err === "object" && "message" in err) {
                errorToast((err as { message: string }).message);
            } else {
                errorToast(typeof err === "string" ? err : "Something went wrong");
            }
            console.error(err);
        }
    };

    const handleCartUpdate = async (
        id: number,
        quantity: number | string,
        size: string,
        color: string
    ) => {
        try {
            setCartLoading(id, true)
            const result = await updateCart(id, { quantity, size, color });
            if (result?.message) {
                successToast(result.message);
                await fetchCart();
            }
        } catch (err) {
            if (err && typeof err === "object" && "errors" in err) {
                const errorObj = err as { errors: Record<string, string[]> };
                Object.values(errorObj.errors)
                    .flat()
                    .forEach((msg) => errorToast(msg));
            } else if (err && typeof err === "object" && "message" in err) {
                errorToast((err as { message: string }).message);
            } else {
                errorToast(typeof err === "string" ? err : "Something went wrong");
            }
            console.error(err);
        } finally {
            setCartLoading(id, false)
        }
    };


    if (!cart) {
        return <CartListSkeleton />
    }

    if (cartCount === 0) {
        return <EmptyState text={"cart"} />;
    }

    return (
        <section className="container py-8 md:py-12 pb-24 md:pb-12 space-y-8 md:space-y-12 2xl:w-[70%] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)] gap-8">
                <div >
                    <div className="flex items-center justify-between mb-4 md:mb-6 gap-3">
                        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-secondary">Shopping Cart</h2>
                        <span className="px-3 py-1 text-xs sm:text-sm rounded-full bg-primary text-white whitespace-nowrap">{cartCount} items</span>
                    </div>

                    <div className="space-y-4">
                        {cart?.map((item: CartItem) => {
                            const { id, quantity, product, size, color } = item;
                            const price = Number(product?.price ?? 0);
                            const discount = Number(product?.discount ?? 0);
                            const discountPrice = Math.max(0, price * (1 - discount / 100));
                            const img_url = product?.images?.[0]?.image_path;
                            const isCartLoading = cartLoading[id!];

                            return (
                                <div
                                    key={id}
                                    className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 border-b border-gray-200 py-4"
                                >
                                    {/* Product Info */}
                                    <div className="flex items-start gap-3 sm:gap-4 w-full sm:w-2/3 min-w-0">
                                        <button
                                            onClick={() => handleCartRemove(Number(id))}
                                            className="border p-2 min-w-[44px] min-h-[44px] flex items-center justify-center hover:text-danger shrink-0 active:scale-95 transition-transform"
                                            aria-label="Remove from cart"
                                        >
                                            <X size={18} />
                                        </button>
                                        <div className="w-24 h-32 sm:w-28 sm:h-40 lg:w-32 relative overflow-hidden shrink-0">
                                            <Link href={`/product-details/${slugify(product?.slug)}/${product?.id}`}>
                                                <Image
                                                    src={img_url ? `https://app.raangalay.com/${img_url}` : "/images/product/product1.png"}
                                                    alt={product?.name || ""}
                                                    fill
                                                    sizes="(max-width: 640px) 96px, 128px"
                                                    className="object-cover"
                                                />
                                            </Link>
                                        </div>

                                        <div className="space-y-1 min-w-0">
                                            <div className="min-w-0">
                                                <Link href={`/product-details/${slugify(product?.slug)}/${product?.id}`} className="text-sm lg:text-base font-medium text-dark-color hover:underline line-clamp-2">
                                                    {product?.name || ""}
                                                </Link>
                                            </div>
                                            {size && size !== "null" && <p className="text-xs sm:text-sm text-secondary">Size: {size}</p>}
                                            {color && color !== "null" && <p className="text-xs sm:text-sm text-secondary">Color: {color}</p>}

                                            <div className="space-y-1">
                                                <div>
                                                    <span className="text-xs sm:text-sm">Quantity</span>
                                                </div>
                                                <div className="inline-flex items-center border border-gray-200 overflow-hidden p-1">
                                                    <button
                                                        type="button"
                                                        className="min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 active:scale-90 transition-transform"
                                                        onClick={() => handleCartUpdate(Number(id), Number(quantity) - 1, size!, color!)}
                                                        disabled={Number(quantity) === 1 || isCartLoading}
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="flex items-center justify-center w-10 h-8">
                                                        {isCartLoading ? (
                                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-900 border-t-transparent" />
                                                        ) : (
                                                            <span className="text-sm font-semibold text-slate-900">
                                                                {quantity}
                                                            </span>
                                                        )}
                                                    </span>

                                                    <button
                                                        disabled={isCartLoading}
                                                        type="button"
                                                        className="min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-gray-100 active:scale-90 transition-transform"
                                                        onClick={() => handleCartUpdate(Number(id), Number(quantity) + 1, size!, color!)}
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-full sm:w-auto text-left sm:text-right font-medium text-dark-color text-sm lg:text-base">
                                        {formatPrice(discountPrice * Number(quantity))}
                                    </div>

                                </div>
                            );
                        })}
                    </div>
                </div>
                <Subtotal />
            </div>
        </section>
    );
};

export default CartList;
