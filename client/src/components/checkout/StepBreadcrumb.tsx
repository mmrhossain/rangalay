"use client";

import React from "react";
import Link from "next/link";

type Step = "cart" | "information" | "shipping" | "payment";

const labels: Record<Step, string> = {
    cart: "Cart",
    information: "Information",
    shipping: "Shipping",
    payment: "Payment",
};

export const StepBreadcrumb = ({current}: { current: Step }) => {
    const order: Step[] = ["cart", "information", "shipping", "payment"];
    return (
        <nav className="flex flex-wrap items-center gap-2 text-sm">
            {order.map((step, idx) => {
                const isCurrent = step === current;
                const isCompleted = order.indexOf(current) > idx;
                const color = isCurrent ? "text-slate-900 font-semibold" : isCompleted ? "text-primary font-semibold" : "text-secondary";
                const href =
                    step === "cart" ? "/cart" :
                    step === "information" ? "/checkout" :
                    step === "shipping" ? "/checkout/payment" :
                    "/checkout/payment";

                return (
                    <React.Fragment key={step}>
                        <Link href={href} className={`${color} hover:text-primary`}>
                            {labels[step]}
                        </Link>
                        {idx < order.length - 1 && (
                            <svg className="w-4 h-4 text-secondary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        )}
                    </React.Fragment>
                );
            })}
        </nav>
    );
};
