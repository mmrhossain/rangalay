"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import clsx from "clsx";
import { formatPrice, statusColor } from "@/utils";
import { useOrderStore } from "@/store/useOrderStore";
import { ChevronLeft, Printer, Package  } from "lucide-react";

const Order = () => {
    const { id } = useParams();
    const router = useRouter();
    const { orders, loading } = useOrderStore();

    const order = orders?.find((o) => String(o.id) === String(id));

    const handleDownload = () => {
        window.print();
    };

    if (loading) return <div className="p-8 animate-pulse text-slate-400">Loading Order...</div>;

    if (!order) {
        return (
            <div className="text-center py-24 bg-white rounded-2xl border border-dashed">
                <Package className="mx-auto text-slate-300 mb-4" size={48} />
                <h3 className="text-lg font-bold text-slate-900">Order not found</h3>
                <button onClick={() => router.back()} className="mt-4 text-primary font-bold text-sm">Go Back</button>
            </div>
        );
    }

    const items = order.items || [];
    const subtotal = items.reduce((sum: number, item) => 
        sum + Number(item?.product?.price || 0) * Number(item.quantity), 0
    );

    const shipping = 80;
    const vat = subtotal * 0.1;
    const grandTotal = subtotal + shipping + vat;

    return (
        <>
            {/* This style block ensures ONLY the #printable-invoice area 
                is visible when the print dialog opens.
            */}
            <style jsx global>{`
                @media print {
                    /* Hide everything by default */
                    body * {
                        visibility: hidden;
                    }
                    /* Show only the invoice container and its children */
                    #printable-invoice, #printable-invoice * {
                        visibility: visible;
                    }
                    /* Position the invoice at the very top-left of the page */
                    #printable-invoice {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        padding: 0;
                        margin: 0;
                    }
                    @page {
                        margin: 15mm;
                    }
                    body {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                }
            `}</style>

            <div className="space-y-6">
                {/* Action Buttons - These will be hidden automatically by the print CSS above */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
                    <button 
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors text-sm font-semibold"
                    >
                        <ChevronLeft size={18} />
                        Back to Orders
                    </button>
                    <button 
                        onClick={handleDownload}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 hover:bg-primary text-white rounded-xl text-xs font-bold transition-all shadow-lg active:scale-95"
                    >
                        <Printer size={16} />
                        Download Invoice
                    </button>
                </div>

                {/* START OF PRINTABLE AREA */}
                <div id="printable-invoice" className="bg-white p-2 space-y-8">
                    {/* Header */}
                    <div className="flex justify-between items-start border-b border-slate-100 pb-8">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-black tracking-tighter text-slate-900">RAANGALAY</h1>
                            <div className="text-sm text-slate-500">
                                <p>Order Number: <span className="font-bold text-slate-900">#{order.order_number}</span></p>
                                <p>Date: {new Date(order.created_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className={clsx(
                                "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                                statusColor(order.status)
                            )}>
                                {order.status}
                            </span>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="space-y-4">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                                    <th className="text-left py-4">Item Details</th>
                                    <th className="text-right py-4">Price</th>
                                    <th className="text-right py-4">Qty</th>
                                    <th className="text-right py-4">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {items.map((item) => (
                                    <tr key={item.id}>
                                        <td className="py-5">
                                            <p className="font-bold text-slate-900">{item.product?.name}</p>
                                            <p className="text-xs text-slate-400 font-mono">{item.product?.sku}</p>
                                        </td>
                                        <td className="text-right py-5 text-slate-600">{formatPrice(Number(item?.product?.price))}</td>
                                        <td className="text-right py-5 font-medium">{item.quantity}</td>
                                        <td className="text-right py-5 font-bold text-slate-900">
                                            {formatPrice(Number(item?.product?.price) * Number(item?.quantity))}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Bottom Section */}
                    <div className="grid grid-cols-2 gap-12 pt-8 border-t border-slate-100">
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Payment Info</h4>
                                <p className="text-xs text-slate-600">Method: Cash on Delivery / Online</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-xl">
                                <p className="text-[10px] leading-relaxed text-slate-500">
                                    Thank you for your purchase. Please keep this invoice for your records. 
                                    For support, contact support@raangalay.com.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Subtotal</span>
                                <span className="font-semibold">{formatPrice(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Shipping</span>
                                <span className="font-semibold">{formatPrice(shipping)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">VAT (10%)</span>
                                <span className="font-semibold">{formatPrice(vat)}</span>
                            </div>
                            <div className="pt-3 border-t border-slate-900 flex justify-between items-center">
                                <span className="font-black text-xs uppercase tracking-tighter">Amount Due</span>
                                <span className="text-2xl font-black text-slate-900">{formatPrice(grandTotal)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Order;