"use client";

import React, { useEffect, useRef, useState } from "react";
import { Product, ProductImage } from "@/types/product";
import { errorToast, formatPrice, successToast } from "@/utils";

import {
  Heart,
  Minus,
  Plus,
  Facebook,
  Twitter,
  Youtube,
  Share2,
  Tag,
} from "lucide-react";
import ProductGallery from "@/components/product/ProductGallery";
import StickyAddToCart from "@/components/product/StickyAddToCart";

import { useCartStore } from "@/store/useCartStore";
import { CartItem } from "@/types/cart";
import { ApiResponse } from "@/types/api";
import { useWishStore } from "@/store/useWishStore";
import { WishItem } from "@/types/wish";

import { useSearchParams } from "next/navigation";
import { Rating } from "@smastrom/react-rating";
import Link from "next/link";

type ProductDetailsProps = {
  product: Product | null;
};

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [size, setSize] = useState<string>("");
  const [color, setColor] = useState<string>("");
  const [mounted, setMounted] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);

  const { addToCart, cartLoading, setCartLoading } = useCartStore();
  const { fetchWishList, addToWish, setWishLoading, wishLoading } =
    useWishStore();

  const isWishLoading = wishLoading[product!.id];
  const isCartLoading = cartLoading[product!.id];

  const searchParams = useSearchParams();
  const from_source = searchParams.get("from_source") || "";

  useEffect(() => {
    setMounted(true);
  }, []);

  const images: ProductImage[] = product?.images ?? [];
  const status: string = product?.status || "";

  const discountPrice = Math.max(
    0,
    Number(product?.price ?? 0) * (1 - Number(product?.discount ?? 0) / 100),
  );

  const stock = product?.stocks?.find(
    (s) => Number(s.product_id) === product.id,
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

    if ((sizes.length > 0 && !size) || (colors.length > 0 && !color)) {
      errorToast("You have to choose options for your item");
      return;
    }

    try {
      const item: CartItem = {
        product_id: product!.id,
        product_stock_id: stock!.id,
        quantity: quantity,
        size: size ? size : "N/A",
        color: color ? color : "N/A",
        from_source: from_source || "",
      };
      setCartLoading(product?.id, true);

      const result: ApiResponse<CartItem> = await addToCart(item);

      if (result?.message) {
        successToast(result.message);
      }

      if (result.errors) {
        const allErrors: string = Object.values(result.errors)
          .flat()
          .join(", ");
        errorToast(allErrors);
      }
    } catch (err: unknown) {
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
      setCartLoading(product?.id, false);
      if (from_source === "wishlist") {
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

      if (result.errors) {
        const allErrors: string = Object.values(result.errors)
          .flat()
          .join(", ");
        errorToast(allErrors);
      }
    } catch (err: unknown) {
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

  // Social Share Variables
  const shareUrl = mounted ? window.location.href : "";
  const shareTitle = product?.name || "";

  return (
    <>
      <div className="container grid gap-8 md:gap-10 2xl:gap-16 grid-cols-1 md:grid-cols-2 mt-8 md:mt-12 2xl:w-[70%] mx-auto z-0">
        {/* LEFT: Images gallery */}
        <div>
          <ProductGallery images={images} />
        </div>

        {/* RIGHT: Info */}
        <div className="flex flex-col gap-4 md:gap-5">
          <div className="space-y-4 md:space-y-5">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold leading-tight text-primary">
                {product?.name}
              </h1>
            </div>
            <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
              {Number(product?.discount) > 0 ? (
                <>
                  <span className="text-secondary font-semibold">
                    {formatPrice(discountPrice)}{" "}
                  </span>{" "}
                  -{" "}
                  <span className="line-through text-secondary text-sm sm:text-base">
                    {formatPrice(Number(product?.price))}
                  </span>
                </>
              ) : (
                <span className="text-secondary font-semibold">
                  {formatPrice(Number(product?.price))}
                </span>
              )}
            </div>

            <Rating
              value={5}
              readOnly
              style={{ width: "78px" }}
              className="pb-2"
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* Quantity*/}
            <div>
              <p className="text-sm font-semibold tracking-wide text-primary pb-3">
                Quantity
              </p>
              <div className="flex justify-center items-center gap-6 sm:gap-8 overflow-hidden border border-primary w-1/2">
                <div className="flex justify-center items-center">
                  <button
                    type="button"
                    onClick={() => handleDecrement()}
                    className="text-lg font-semibold text-primary p-3 min-w-[44px] min-h-[44px] flex items-center justify-center active:scale-90 transition-transform"
                    aria-label="Decrease quantity"
                  >
                    <Minus />
                  </button>
                </div>
                <div className="text-center text-primary text-sm flex items-center justify-center font-semibold">
                  <span>{quantity}</span>
                </div>
                <div className="flex justify-center items-center">
                  <button
                    type="button"
                    onClick={() => handleIncrement()}
                    className="text-lg font-semibold text-primary p-3 min-w-[44px] min-h-[44px] flex items-center justify-center active:scale-90 transition-transform"
                    aria-label="Increase quantity"
                  >
                    <Plus />
                  </button>
                </div>
              </div>
            </div>

            {/* sizes */}
              {sizes.length > 0 && (
                  <div className="col-span-1">
                      <p className="text-sm font-semibold tracking-wide text-primary pb-2">
                          Size
                      </p>

                      <div className="flex flex-wrap gap-2">
                          {sizes.map((s) => (
                              <button
                                  key={s}
                                  onClick={() => setSize(s)}
                                  className={`px-3 py-2 text-xs sm:text-sm border transition-all
            ${
                                      size === s
                                          ? "bg-primary text-white border-primary"
                                          : "bg-white text-primary border-primary hover:bg-primary hover:text-white"
                                  }
          `}
                              >
                                  {s}
                              </button>
                          ))}
                      </div>
                  </div>
              )}

              {/* color */}
              {colors.length > 0 && (
                  <div className="col-span-1">
                      <p className="text-sm font-semibold tracking-wide text-primary pb-2">
                          Color
                      </p>

                      <div className="flex flex-wrap gap-3">
                          {colors.map((c) => (
                              <button
                                  key={c}
                                  onClick={() => setColor(c)}
                                  className={`relative w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 transition-all
            ${color === c ? "border-primary scale-110" : "border-gray-300"}
          `}
                                  style={{ backgroundColor: c.toLowerCase() }}
                              >
                                  {color === c && (
                                      <span className="absolute inset-0 flex items-center justify-center text-white text-xs">
              ✓
            </span>
                                  )}
                              </button>
                          ))}
                      </div>
                  </div>
              )}
          </div>

          {/* CTA - Preserved logic and styles */}
          <div ref={ctaRef} className="flex w-full md:w-[85%] lg:w-full gap-2 sm:gap-2 md:gap-1 2xl:gap-3 mt-4 md:mt-5">
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
                                    w-full h-11 sm:h-12 px-3 text-sm 2xl:text-lg rounded-none text-white uppercase
                                    transition-all active:scale-[0.98]
                                    ${isCartLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : status === "out_of_stock" ||
                    !stock ||
                    Number(stock?.quantity) < 1
                    ? "bg-danger cursor-not-allowed"
                    : "bg-primary hover:bg-btn-hover"
                }
                                `}
            >
              {isCartLoading
                ? "Processing..."
                : status === "out_of_stock" ||
                  !stock ||
                  Number(stock?.quantity) < 1
                  ? "Out of stock"
                  : "Add to Cart"}
            </button>

            <button
              onClick={handleAddToWishList}
              disabled={isWishLoading}
              className="bg-black text-white border px-3 rounded-sm outline-0 hover:bg-primary transition-all duration-300 flex items-center justify-center min-w-[44px] min-h-[44px] active:scale-95"
              aria-label="Add to wishlist"
            >
              {isWishLoading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              ) : (
                <Heart size={16} />
              )}
            </button>
          </div>

          <div className="space-y-4 pt-5 md:pt-6 border-t border-gray-100">
            {/* SKU/Barcode Display */}
            <div className="mb-4">
              <span className="text-sm font-medium text-slate-500">
                SKU:{" "}
              </span>
              <span className="text-sm font-semibold text-primary">
                {product?.sku || "N/A"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Category Card */}
              <div className="flex items-center gap-3 p-2 bg-[#F9F9F9] border border-gray-100 rounded-lg shadow-sm transition-all hover:shadow-md">
                <div className="p-1.5 bg-white rounded-md text-[#14b8a6] shadow-sm shrink-0">
                  <Tag size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-gray-400 text-[10px] uppercase tracking-wider font-bold leading-none mb-1">
                    Category
                  </p>
                  <h5 className="font-bold text-slate-900 text-sm leading-tight truncate">
                    {product?.category?.name || "General"}
                  </h5>
                </div>
              </div>

              {/* Brand Card */}
              <div className="flex items-center gap-3 p-2 bg-[#F9F9F9] border border-gray-100 rounded-lg shadow-sm transition-all hover:shadow-md">
                <div className="p-1.5 bg-white rounded-md text-[#14b8a6] shadow-sm shrink-0">
                  <Tag size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-gray-400 text-[10px] uppercase tracking-wider font-bold leading-none mb-1">
                    Brand
                  </p>
                  <h5 className="font-bold text-slate-900 text-sm leading-tight truncate">
                    {typeof product?.brand === "object"
                      ? product?.brand
                      : product?.brand || "Raangalay"}
                  </h5>
                </div>
              </div>
            </div>

            {/* Updated Social Share Section */}
            <div className="flex items-center gap-4 pt-6">
              <span className="text-sm font-bold text-primary flex items-center gap-2">
                <Share2 size={18} className="text-[#14b8a6]" /> Share:
              </span>
              <div className="flex gap-5">
                <Link
                  href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                  target="_blank"
                  className="text-secondary hover:text-[#14b8a6] transition-all hover:scale-110"
                >
                  <Facebook size={20} />
                </Link>
                <Link
                  href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`}
                  target="_blank"
                  className="text-secondary hover:text-[#14b8a6] transition-all hover:scale-110"
                >
                  <Twitter size={20} />
                </Link>
                <Link
                  href="https://www.youtube.com/"
                  target="_blank"
                  className="text-secondary hover:text-[#14b8a6] transition-all hover:scale-110"
                >
                  <Youtube size={20} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky mobile Add to Cart bar */}
      <StickyAddToCart
        productName={product?.name || ""}
        price={Number(product?.price ?? 0)}
        discountPrice={discountPrice}
        discount={Number(product?.discount ?? 0)}
        isOutOfStock={status === "out_of_stock" || !stock || Number(stock?.quantity) < 1}
        isLoading={isCartLoading}
        onAddToCart={handleAddToCart}
        ctaRef={ctaRef}
      />
    </>
  );
};

export default ProductDetails;
