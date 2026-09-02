"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, EyeOff, Eye, UserRound, Store } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api/client";

const vendorRegisterSchema = z.object({
    email: z.string().trim().email("সঠিক ইমেইল দিন"),
    password: z.string().min(8, "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে"),
    name: z.string().min(2, "নাম কমপক্ষে ২ অক্ষরের হতে হবে"),
    phone: z.string().optional(),
    shopName: z.string().min(2, "দোকানের নাম কমপক্ষে ২ অক্ষরের হতে হবে"),
    shopSlug: z
        .string()
        .min(2, "স্লাগ কমপক্ষে ২ অক্ষরের হতে হবে")
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "ছোট হাতের অক্ষর/সংখ্যা, মাঝে ড্যাশ ব্যবহার করুন"),
    description: z.string().max(2000).optional(),
    address: z.string().max(500).optional(),
});

type VendorRegisterValues = z.infer<typeof vendorRegisterSchema>;

const VendorRegistrationForm: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const router = useRouter();

    const form = useForm<VendorRegisterValues>({
        resolver: zodResolver(vendorRegisterSchema),
        defaultValues: {
            email: "",
            password: "",
            name: "",
            phone: "",
            shopName: "",
            shopSlug: "",
            description: "",
            address: "",
        },
    });

    const onSubmit = async (data: VendorRegisterValues) => {
        setFormError(null);
        setLoading(true);
        try {
            await api.post("/api/v1/auth/register/vendor", {
                body: data,
            });
            router.push("/login?registered=vendor");
            router.refresh();
        } catch (err) {
            const message =
                err instanceof Error
                    ? err.message
                    : "নিবন্ধন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।";
            setFormError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container min-h-[90vh] flex items-center justify-center px-4 py-10 md:py-14">
            <div className="bg-white rounded-2xl border border-gray-100 w-full max-w-[480px] p-6 md:p-8 shadow-xl shadow-gray-100/50">
                <div className="text-center md:text-left mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                        Sell on Store
                    </h1>
                    <p className="text-secondary text-sm mt-2">
                        Register as a vendor - আপনার দোকান চালু হবে অ্যাডমিন অনুমোদনের পর
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

                        {/* Email */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <Label className="text-slate-700 font-medium mb-1.5 inline-block">Email</Label>
                                    <FormControl>
                                        <div className="relative group">
                                            <Input
                                                type="email"
                                                placeholder="you@example.com"
                                                autoComplete="email"
                                                className="w-full border-gray-200 focus:border-primary focus:ring-primary/10 rounded-xl py-6 pl-4 pr-12 transition-all"
                                                {...field}
                                            />
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary">
                                                <Mail size={20} />
                                            </div>
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-xs text-danger" />
                                </FormItem>
                            )}
                        />

                        {/* Password */}
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <Label className="text-slate-700 font-medium mb-1.5 inline-block">Password</Label>
                                    <FormControl>
                                        <div className="relative group">
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="********"
                                                autoComplete="new-password"
                                                className="w-full border-gray-200 focus:border-primary focus:ring-primary/10 rounded-xl py-6 pl-4 pr-12 transition-all"
                                                {...field}
                                            />
                                            <div
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-primary"
                                            >
                                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </div>
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-xs text-danger" />
                                </FormItem>
                            )}
                        />

                        {/* Name */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <Label className="text-slate-700 font-medium mb-1.5 inline-block">Full Name</Label>
                                    <FormControl>
                                        <div className="relative group">
                                            <Input
                                                type="text"
                                                placeholder="Enter your full name"
                                                autoComplete="name"
                                                className="w-full border-gray-200 focus:border-primary focus:ring-primary/10 rounded-xl py-6 pl-4 pr-12 transition-all"
                                                {...field}
                                            />
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary">
                                                <UserRound size={20} />
                                            </div>
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-xs text-danger" />
                                </FormItem>
                            )}
                        />

                        {/* Phone */}
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <Label className="text-slate-700 font-medium mb-1.5 inline-block">Phone (optional)</Label>
                                    <FormControl>
                                        <Input
                                            type="tel"
                                            placeholder="01XXXXXXXXX"
                                            autoComplete="tel"
                                            className="w-full border-gray-200 focus:border-primary focus:ring-primary/10 rounded-xl py-6 pl-4 pr-4 transition-all"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-xs text-danger" />
                                </FormItem>
                            )}
                        />

                        {/* Shop Name */}
                        <FormField
                            control={form.control}
                            name="shopName"
                            render={({ field }) => (
                                <FormItem>
                                    <Label className="text-slate-700 font-medium mb-1.5 inline-block">Shop Name</Label>
                                    <FormControl>
                                        <div className="relative group">
                                            <Input
                                                type="text"
                                                placeholder="Your shop name"
                                                className="w-full border-gray-200 focus:border-primary focus:ring-primary/10 rounded-xl py-6 pl-4 pr-12 transition-all"
                                                {...field}
                                            />
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary">
                                                <Store size={20} />
                                            </div>
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-xs text-danger" />
                                </FormItem>
                            )}
                        />

                        {/* Shop Slug */}
                        <FormField
                            control={form.control}
                            name="shopSlug"
                            render={({ field }) => (
                                <FormItem>
                                    <Label className="text-slate-700 font-medium mb-1.5 inline-block">Shop Slug</Label>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="my-shop"
                                            className="w-full border-gray-200 focus:border-primary focus:ring-primary/10 rounded-xl py-6 pl-4 pr-4 transition-all"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-xs text-danger" />
                                </FormItem>
                            )}
                        />

                        {/* Description */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <Label className="text-slate-700 font-medium mb-1.5 inline-block">Shop Description (optional)</Label>
                                    <FormControl>
                                        <textarea
                                            rows={3}
                                            placeholder="Tell customers about your shop"
                                            className="w-full border border-gray-200 focus:border-primary focus:ring-primary/10 rounded-xl py-3 px-4 transition-all text-sm"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-xs text-danger" />
                                </FormItem>
                            )}
                        />

                        {/* Address */}
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <Label className="text-slate-700 font-medium mb-1.5 inline-block">Address (optional)</Label>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="Shop address"
                                            className="w-full border-gray-200 focus:border-primary focus:ring-primary/10 rounded-xl py-6 pl-4 pr-4 transition-all"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-xs text-danger" />
                                </FormItem>
                            )}
                        />

                        {formError && (
                            <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                                {formError}
                            </p>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 rounded-xl text-white bg-primary hover:bg-primary/90 font-bold shadow-lg shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                "Register as Vendor"
                            )}
                        </button>
                    </form>
                </Form>

                <p className="text-center text-sm text-slate-600 mt-8">
                    Already have an account?{" "}
                    <Link href="/login" className="text-primary font-bold hover:underline underline-offset-4 ml-1">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default VendorRegistrationForm;
