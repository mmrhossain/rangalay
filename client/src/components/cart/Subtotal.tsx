import {TicketPercent} from "lucide-react";
import Link from "next/link";
import {useCartStore} from "@/store/useCartStore";
import {formatPrice} from "@/utils";
import {Input} from "@/components/ui/input";
import {useAuthStore} from "@/store/useAuthStore";
import {useRouter} from "next/navigation";

const Subtotal = () => {

    const {totalAmount, discountAmount, payableAmount, vatAmount}  = useCartStore();
    const {isLogin} = useAuthStore();
    const router = useRouter();



    return (
        <div>
            <aside className="bg-gray-50 p-6 space-y-10">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary">
                        <TicketPercent className="w-5 h-5 text-primary"/>
                        <h3 className="text-lg font-semibold">Coupon</h3>
                    </div>
                    <p className="text-sm text-secondary">Enter a coupon code to unlock savings.</p>
                    <div className="flex gap-3">
                        <Input
                            type="text"
                            placeholder="Coupon code"
                            className="bg-white rounded-none"
                        />
                        <button
                            type="button"
                            className="px-4 py-2 text-sm font-semibold rounded-lg bg-primary text-white hover:bg-btn-hover"
                        >
                            Apply
                        </button>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between font-semibold text-secondary">
                        <span>Subtotal</span>
                        <span className="font-semibold text-slate-900 text-sm">{formatPrice(Number(totalAmount))}</span>
                    </div>
                    {/*<div className="flex justify-between text-secondary">*/}
                    {/*    <span className="text-sm">Shipping (Standard Shipping : within 3-4 days inside Dhaka, within 4-7 days outside Dhaka)</span>*/}
                    {/*    <span className="font-semibold text-slate-900 flex gap-1"><span>৳</span>{shippingCost}</span>*/}
                    {/*</div>*/}

                    {
                        Number(discountAmount) > 0 && (
                            <div className="flex justify-between text-secondary font-semibold">
                                <span>Discount</span>
                                <span className="text-slate-900 text-sm">{formatPrice(Number(discountAmount))}</span>

                            </div>
                        )
                    }

                    {Number(vatAmount) > 0 && (
                        <div className="flex justify-between text-secondary font-semibold">
                            <span>Vat (5%)</span>
                            <span className="text-slate-900 text-sm">{formatPrice(Number(vatAmount))}</span>
                        </div>
                    )

                    }
                    <div className="flex justify-between text-base font-semibold text-primary pt-2 border-t border-gray-200">
                        <span>Grand total</span>
                        <span className="text-slate-900 text-sm">{formatPrice(Number(payableAmount))}</span>
                    </div>
                </div>
                <div className="w-full">
                    <p className="text-sm text-secondary pb-2">
                        Shipping & taxes calculated at checkout.
                    </p>
                    <Link
                        href="/checkout"
                        onClick={(e) => {
                            if (!isLogin()) {
                                e.preventDefault();
                                router.push("/login?redirect=/checkout");
                            }
                        }}
                        className="block w-full px-4 py-3 bg-primary text-white text-center text-sm font-semibold hover:bg-btn-hover transition"
                    >
                        Checkout
                    </Link>
                </div>
            </aside>
        </div>
    );
};

export default Subtotal;