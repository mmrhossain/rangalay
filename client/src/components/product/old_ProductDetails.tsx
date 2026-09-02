"use client";

import React, {useState} from "react";

import {Product, ProductImage} from "@/types/product";
import {errorToast, formatPrice, successToast} from "@/utils";

import {Heart, Minus, Plus} from "lucide-react";
import ProductGallery from "@/components/product/ProductGallery";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {useCartStore} from "@/store/useCartStore";
import {CartItem} from "@/types/cart";
import {ApiResponse} from "@/types/api";
import {useWishStore} from "@/store/useWishStore";
import {WishItem} from "@/types/wish";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import { useSearchParams } from "next/navigation";


type ProductDetailsProps = {
    product: Product | null;
};


const ProductDetails: React.FC<ProductDetailsProps> = ({product}) => {
    const [quantity, setQuantity] = useState<number>(1);
    const [size, setSize] = useState<string>("");
    const [color, setColor] = useState<string>("");
    const {addToCart, cartLoading, setCartLoading} = useCartStore();
    const {fetchWishList,addToWish, setWishLoading, wishLoading} = useWishStore();
    const isWishLoading = wishLoading[product!.id];
    const isCartLoading = cartLoading[product!.id];
    const searchParams = useSearchParams(); 
    const from_source = searchParams.get("from_source") || ""; 

    const images: ProductImage[] = product?.images ?? [];
    const status: string = product?.status || "";

    const discountPrice = Math.max(
        0,
        Number(product?.price ?? 0) * (1 - Number(product?.discount ?? 0) / 100)
    );

    const stock = product?.stocks?.find(
        (s) => Number(s.product_id) === product.id
    );

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



    const handleAddToCart = async (): Promise<void> => {
        if (!product) return;

        try {
           
            const item: CartItem = {
                product_id: product!.id,
                product_stock_id: stock!.id,
                quantity: quantity,
                size: size ? size : 'N/A',
                color: color ? color : 'N/A',
                from_source: from_source || ""
            };
            console.log(item);
            setCartLoading(product?.id, true);

            const result: ApiResponse<CartItem> = await addToCart(item);

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
            setCartLoading(product?.id, false);
            if (from_source === "wishlist") {
                // refresh wishlist items in the store
                await fetchWishList();
            }
        }
    };

    const handleAddToWishList = async (): Promise<void> => {
        if (!product) return;

        try {

            const item: WishItem = {
                product_id: product!.id,
                product_stock_id: stock && stock!.id,
                quantity: quantity,
            };

            setWishLoading(product?.id, true);

            const result: ApiResponse<WishItem> = await addToWish(item);

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
            setWishLoading(product?.id, false);
        }
    };

    const handleIncrement = () => {
        setQuantity((quantity: number): number => quantity + 1);
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity((quantity: number): number => quantity - 1);
        }
    };

    return (
        <main className="">
            <section>
                <div
                    className="container grid gap-10 2xl:gap-20 grid-cols-1 md:grid-cols-2 mt-14 2xl:w-[70%] mx-auto z-0">
                    {/* LEFT: Images gallery */}
                    <div>
                        <ProductGallery images={images}/>
                    </div>

                    {/* RIGHT: Info */}
                    <div className="flex flex-col gap-5">
                        <div className="space-y-8">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-semibold leading-tight text-primary">
                                    {product?.name}
                                </h1>
                            </div>
                            <div className="flex flex-wrap items-baseline gap-3">
                                {Number(product?.discount) > 0 ? (
                                    <>
                                        <span className="text-secondary">{formatPrice(discountPrice)} </span> -{" "}
                                        <span className="line-through text-secondary">
                                            {formatPrice(Number(product?.price))}
                                        </span>
                                    </>
                                ) : (
                                    <span className="text-secondary">{formatPrice(Number(product?.price))}</span>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4  lg:gap-6">
                            {/* Quantity*/}
                            <div>
                                <p className="text-sm font-semibold tracking-wide text-primary pb-3">
                                    Quantity
                                </p>
                                <div
                                    className="flex justify-center items-center gap-8 overflow-hidden  border border-primary py-2">
                                    <div className="flex justify-center items-center">
                                        <button
                                            type="button"
                                            onClick={() => handleDecrement()}
                                            className="text-lg font-semibold text-primary"
                                        >
                                            <Minus/>
                                        </button>
                                    </div>
                                    <div
                                        className="text-center text-primary text-sm flex items-center justify-center font-semibold">
                                        <span>{quantity}</span>
                                    </div>
                                    <div className="flex justify-center items-center">
                                        <button
                                            type="button"
                                            onClick={() => handleIncrement()}
                                            className="text-lg font-semibold text-primary"
                                        >
                                            <Plus/>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/*sizes*/}
                            {
                                sizes.length > 0 && (
                                    <div>
                                        <p className="text-sm font-semibold tracking-wide text-primary pb-3">
                                            Size
                                        </p>
                                        <Select
                                            defaultValue={size}
                                            onValueChange={(value) => setSize(value)}>
                                            <SelectTrigger className="w-full border border-primary py-5 px-2 rounded-none focus-visible:ring-0">
                                                <SelectValue placeholder="Choose an option..."/>
                                            </SelectTrigger>

                                            <SelectContent className="border border-primary py-1 z-10 bg-white rounded-none">
                                                {sizes.map((size) => (
                                                    <SelectItem key={size} value={size}
                                                                className="hover:bg-primary text-dark-color hover:text-white">
                                                        {size}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                    </div>
                                )
                            }

                            {/*color*/}

                            {
                                colors.length > 0 && (
                                    <div>
                                        <p className="text-sm font-medium tracking-wide text-primary pb-3">
                                            Color
                                        </p>
                                        <Select
                                            defaultValue={color}
                                            onValueChange={(value) => setColor(value)}>
                                            <SelectTrigger className="w-full border border-primary py-5 px-2 rounded-none focus-visible:ring-0">
                                                <SelectValue placeholder="Choose an option..."/>
                                            </SelectTrigger>

                                            <SelectContent className="border border-primary py-1 z-10 bg-white rounded-none">
                                                {colors.map((color) => (
                                                    <SelectItem key={color} value={color}
                                                                className="hover:bg-primary text-dark-color hover:text-white">
                                                        {color}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                    </div>
                                )
                            }


                        </div>
                        {/*accordion item*/}
                        <div>
                            <Accordion
                                type="single"
                                collapsible
                                className={"border-b border-gray-200"}
                            >
                                <AccordionItem value="item-1">
                                    <AccordionTrigger
                                        className={"hover:no-underline text-primary  font-semibold"}
                                    >
                                        Product code
                                    </AccordionTrigger>
                                    <AccordionContent className="text-primary">
                                        {product?.sku}
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-2">
                                    <AccordionTrigger
                                        className={"hover:no-underline text-primary font-semibold"}
                                    >
                                        Product Description
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <p className="whitespace-pre-line text-sm leading-relaxed text-dark-color">
                                            {product?.description}
                                        </p>

                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-3">
                                    <AccordionTrigger
                                        className={"hover:no-underline text-primary font-semibold"}
                                    >
                                        Reviews
                                    </AccordionTrigger>
                                    <AccordionContent className="text-primary">
                                        <span>This product have no reviews</span>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>

                        {/*CTA*/}

                        <div className="flex w-full md:w-[85%] lg:w-full gap-2 sm:gap-2 md:gap-1 2xl:gap-3 mt-5">
                            <button
                                type="button"
                                onClick={handleAddToCart}
                                disabled={
                                    isCartLoading ||
                                    status === "out_of_stock" ||
                                    !stock ||
                                    Number(stock?.quantity) < 1
                                }
                                className={`
        w-full py-1.5 2xl:text-lg rounded-none text-white uppercase
        transition
        ${
                                    isCartLoading
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : status === "out_of_stock" || !stock || Number(stock?.quantity) < 1
                                            ? "bg-danger cursor-not-allowed"
                                            : "bg-primary hover:bg-btn-hover"
                                }
    `}
                            >
                                {isCartLoading
                                    ? "Processing..."
                                    : status === "out_of_stock" || !stock || Number(stock?.quantity) < 1
                                        ? "Out of stock"
                                        : "Add to Cart"}
                            </button>


                            <button
                                onClick={handleAddToWishList}
                                disabled={isWishLoading}
                                className="bg-black text-white border px-2 rounded-sm outline-0 hover:bg-primary transition-all duration-300 flex items-center justify-center"
                            >
                                {isWishLoading ? (
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                                ) : (
                                    <Heart size={16} />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default ProductDetails;
