"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, EyeOff, Eye, UserRound } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";

import {
    RegistrationFormData,
    registrationSchema,
} from "@/schemas/registrationSchema";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth/auth-client";

const RegistrationForm: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect');

    const form = useForm<RegistrationFormData>({
        resolver: zodResolver(registrationSchema),
        defaultValues: {
            fullName: "",
            identifier: "",
            password: "",
            password_confirmation: "",
            remember: false,
        },
    });

    const onSubmit = async (data: RegistrationFormData) => {
        setFormError(null);
        setLoading(true);
        try {
            const { error } = await authClient.signUp.email({
                email: data.identifier,
                password: data.password,
                name: data.fullName,
            });
            if (error) {
                setFormError(error.message ?? "নিবন্ধন ব্যর্থ হয়েছে");
                return;
            }
            router.push(redirect ? `/login?redirect=${encodeURIComponent(redirect)}` : "/login");
            router.refresh();
        } catch {
            setFormError("সার্ভারে যোগাযোগ করা যায়নি। আবার চেষ্টা করুন।");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container min-h-[90vh] flex items-center justify-center px-4 py-10 md:py-14">
            <div className="bg-white rounded-2xl border border-gray-100 w-full max-w-[480px] p-6 md:p-8 shadow-xl shadow-gray-100/50">
                <div className="text-center md:text-left mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                        Create an Account
                    </h1>
                    <p className="text-secondary text-sm mt-2">
                        Join us today and start shopping
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

                        {/* Full Name */}
                        <FormField
                            control={form.control}
                            name="fullName"
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

                        {/* Email */}
                        <FormField
                            control={form.control}
                            name="identifier"
                            render={({ field }) => (
                                <FormItem>
                                    <Label className="text-slate-700 font-medium mb-1.5 inline-block">Email</Label>
                                    <FormControl>
                                        <div className="relative group">
                                            <Input
                                                type="text"
                                                placeholder="Enter your email"
                                                autoComplete="username"
                                                inputMode="email"
                                                autoCapitalize="none"
                                                spellCheck="false"
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

                        {/* Confirm Password */}
                        <FormField
                            control={form.control}
                            name="password_confirmation"
                            render={({ field }) => (
                                <FormItem>
                                    <Label className="text-slate-700 font-medium mb-1.5 inline-block">Confirm Password</Label>
                                    <FormControl>
                                        <div className="relative group">
                                            <Input
                                                type={showConfirmPassword ? "text" : "password"}
                                                placeholder="********"
                                                autoComplete="new-password"
                                                className="w-full border-gray-200 focus:border-primary focus:ring-primary/10 rounded-xl py-6 pl-4 pr-12 transition-all"
                                                {...field}
                                            />
                                            <div
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-primary"
                                            >
                                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </div>
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-xs text-danger" />
                                </FormItem>
                            )}
                        />

                        {/* Terms */}
                        <FormField
                            control={form.control}
                            name="remember"
                            render={({ field }) => (
                                <FormItem className="flex items-start space-x-2 space-y-0 pt-2">
                                    <FormControl>
                                        <Checkbox
                                            id="terms"
                                            className="mt-1 rounded border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <Label htmlFor="terms" className="text-slate-600 text-sm leading-relaxed cursor-pointer select-none">
                                        I have read and agree to the <span className="text-primary hover:underline">terms & conditions</span>
                                    </Label>
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
                                "Register"
                            )}
                        </button>
                    </form>
                </Form>

                <p className="text-center text-sm text-slate-600 mt-8">
                    Already have an account?{" "}
                    <Link
                        href={redirect ? `/login?redirect=${encodeURIComponent(redirect)}` : "/login"}
                        className="text-primary font-bold hover:underline underline-offset-4 ml-1"
                    >
                        Login
                    </Link>
                </p>

                <p className="text-center text-xs text-slate-400 mt-4">
                    Selling your products?{" "}
                    <Link href="/vendor-register" className="text-primary font-semibold hover:underline underline-offset-4">
                        Register as a vendor
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegistrationForm;
