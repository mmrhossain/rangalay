

import Image from "next/image";
import { errorToast, formatPrice, getUser, successToast } from "@/utils";
import React from "react";
import { useCartStore } from "@/store/useCartStore";
import { useOrderStore } from "@/store/useOrderStore";
import { locationStore } from "@/store/location.store";
import { Order } from "@/types/order";
import { useRouter } from "next/navigation";

const OrderReview = () => {

    const { cart, vatAmount, totalAmount, payableAmount, discountAmount, fetchCart } = useCartStore();
    const { createOrder, loading } = useOrderStore();
    const { formState } = locationStore();
    const router = useRouter();


    const handlePlaceOrder = async () => {
        const user = getUser();
        const user_id = user?.id;

        const {
            name,
            phone,
            address,
            country,
            division,
            district,
            thana,
            postal_code,
        } = formState;

        if (
            !name ||
            !address ||
            !country ||
            !division ||
            !district ||
            !thana ||
            !postal_code
        ) {
            errorToast("Please complete your shipping address");
            return;
        }

        if (!user_id) {
            errorToast("You have to login first to place orders!");
            return;
        }

        try {
            const data: Order = {
                user_id,
                name,
                phone,
                address,
                country,
                division,
                district,
                thana,
                postal_code,
            };

            const result = await createOrder(data);
            if (result) {
                successToast(result.message);
                router.push("/customer/orders");
                await fetchCart();
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
        }
    };


    return (
        <div className="col-span-12 md:col-span-5 bg-white border border-gray-200 shadow-sm h-fit self-start md:sticky md:top-24">
            <h1 className="py-2.5 px-3 uppercase tracking-[0.08em] text-sm sm:text-base text-white bg-primary">Order Preview</h1>

            <div className="px-3">
                <div className="flex items-center justify-between text-primary uppercase border-b py-2 text-xs sm:text-sm">
                    <div>Product</div>
                    <div>Subtotal</div>
                </div>
                {cart?.map((item) => {
                    const productName =
                        item.product?.name ?? "Unknown product";
                    const imageUrl = `https://app.raangalay.com/${item?.product?.images[0]?.image_path}`;

                    return (
                        <div key={item?.id} className="flex gap-3 sm:gap-4 border-b py-4">
                            <div className="relative w-16 h-20 sm:w-20 sm:h-24 border overflow-hidden shrink-0">
                                <Image
                                    src={imageUrl || "https://placehold.net/400x400.png"}
                                    alt={productName}
                                    fill
                                    sizes="(max-width: 640px) 64px, 80px"
                                    className="object-cover"
                                />
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-primary text-sm sm:text-base line-clamp-2">{productName}</p>
                                <div className="text-primary text-xs sm:text-sm flex gap-1 mt-1">
                                    <span>Quantity:</span>
                                    <span>{item.quantity}</span>
                                </div>
                                {item?.size && item.size !== "null" && (
                                    <p className="text-xs sm:text-sm text-secondary">Size: {item.size}</p>
                                )}

                                {item?.color && item.color !== "null" && (
                                    <p className="text-xs sm:text-sm text-secondary">Color: {item.color}</p>
                                )}
                            </div>
                            <span className="font-semibold text-xs sm:text-sm whitespace-nowrap">
                                {formatPrice(Number(item?.product?.price) * Number(item.quantity))}
                            </span>
                        </div>
                    );
                })}

                <div className="space-y-2 pb-3">
                    <div className="py-2 border-b">
                        <div className="flex justify-between font-medium text-secondary text-sm">
                            <span className="uppercase">Subtotal</span>
                            <span className="text-slate-900 text-sm">{formatPrice(Number(totalAmount))}</span>
                        </div>
                    </div>

                    {
                        Number(discountAmount) > 0 && (
                            <div className="flex justify-between text-secondary font-medium py-2 border-b text-sm">
                                <span className="uppercase">Discount</span>
                                <span className="text-slate-900 text-sm">{formatPrice(Number(discountAmount))}</span>

                            </div>
                        )
                    }
                    {Number(vatAmount) > 0 && (
                        <div className="flex justify-between text-secondary font-medium py-2 text-sm">
                            <span className="uppercase">Vat (5%)</span>
                            <span className="text-slate-900 text-sm">{formatPrice(Number(vatAmount))}</span>
                        </div>
                    )}

                    <div className="flex justify-between text-primary font-medium py-2 bg-gray-100 px-1 text-sm">
                        <span className="uppercase">total</span>
                        <span >{formatPrice(Number(payableAmount))}</span>
                    </div>
                </div>
            </div>
            <div className="sticky bottom-0 md:static bg-white border-t md:border-t-0 border-gray-100 p-3 md:p-0">
                <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="bg-primary hover:bg-btn-hover text-white w-full py-3 md:mt-6 uppercase text-sm font-medium active:scale-[0.98] transition-all">
                    {loading ? (<span className="capitalize">Processing...</span>) : "Place Order"}
                </button>
            </div>
        </div>
    );
};

export default OrderReview;
