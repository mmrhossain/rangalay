"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, EyeOff, Eye } from "lucide-react";

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

import { LoginFormData, loginSchema } from "@/schemas/loginSchema";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth/auth-client";
import { homeForRole } from "@/lib/auth/routing";

const LoginForm: React.FC = () => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [formError, setFormError] = React.useState<string | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect');

    // Already signed-in users skip the form and go to their role home.
    React.useEffect(() => {
        let cancelled = false;
        authClient.getSession().then(({ data }) => {
            if (cancelled) return;
            const home = homeForRole(data?.user?.role);
            if (home !== "/login") {
                router.replace(home);
            }
        });
        return () => {
            cancelled = true;
        };
    }, [router]);

    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            identifier: "",
            password: "",
            remember: false,
        },
    });

    const onSubmit = async (data: LoginFormData) => {
        setFormError(null);
        setLoading(true);
        try {
            const { error } = await authClient.signIn.email({
                email: data.identifier,
                password: data.password,
            });
            if (error) {
                setFormError(error.message ?? "সাইন ইন ব্যর্থ হয়েছে");
                return;
            }
            router.refresh();
            const session = await authClient.getSession();
            const roleHome = homeForRole(session.data?.user?.role);
            // Prefer the storefront redirect param; fall back to role home.
            if (redirect && redirect.startsWith("/")) {
                router.push(redirect);
            } else {
                router.push(roleHome);
            }
        } catch {
            setFormError("সার্ভারে যোগাযোগ করা যায়নি। আবার চেষ্টা করুন।");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container min-h-[80vh] flex items-center justify-center px-4 py-10 md:py-14">
            {/* Form Card */}
            <div className="bg-white rounded-2xl border border-gray-100 w-full max-w-[420px] p-6 md:p-8 shadow-xl shadow-gray-100/50">
                <div className="text-center md:text-left mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                        Welcome Back
                    </h1>
                    <p className="text-secondary text-sm mt-2">
                        Please enter your details to sign in
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

                        {/* Email */}
                        <FormField
                            control={form.control}
                            name="identifier"
                            render={({ field }) => (
                                <FormItem>
                                    <Label className="text-slate-700 font-medium mb-1.5 inline-block">Email or Phone</Label>
                                    <FormControl>
                                        <div className="relative group">
                                            <Input
                                                type="text"
                                                placeholder="Enter your email or phone"
                                                autoComplete="username"
                                                inputMode="email"
                                                autoCapitalize="none"
                                                spellCheck="false"
                                                className="w-full border-gray-200 focus:border-primary focus:ring-primary/10 rounded-xl py-6 pl-4 pr-12 transition-all"
                                                {...field}
                                            />
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
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
                                    <div className="flex justify-between items-center mb-1.5">
                                        <Label className="text-slate-700 font-medium">Password</Label>
                                        <Link href="#" className="text-xs text-primary hover:underline">Forgot password?</Link>
                                    </div>
                                    <FormControl>
                                        <div className="relative group">
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="********"
                                                className="w-full border-gray-200 focus:border-primary focus:ring-primary/10 rounded-xl py-6 pl-4 pr-12 transition-all"
                                                {...field}
                                            />
                                            <div
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-primary transition-colors"
                                            >
                                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </div>
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-xs text-danger" />
                                </FormItem>
                            )}
                        />

                        {/* Remember Me */}
                        <FormField
                            control={form.control}
                            name="remember"
                            render={({ field }) => (
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                        <Checkbox
                                            id="remember"
                                            className="rounded border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <Label htmlFor="remember" className="text-slate-600 text-sm cursor-pointer select-none">
                                        Keep me logged in
                                    </Label>
                                </FormItem>
                            )}
                        />

                        {formError && (
                            <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                                {formError}
                            </p>
                        )}

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 rounded-xl text-white bg-primary hover:bg-primary/90 font-bold shadow-lg shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>
                </Form>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-100"></span>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-3 text-gray-400">or</span>
                    </div>
                </div>

                <p className="text-center text-sm text-slate-600">
                    Don&apos;t have an account?{" "}
                    <Link
                        href={redirect ? `/register?redirect=${encodeURIComponent(redirect)}` : "/register"}
                        className="text-primary font-bold hover:underline underline-offset-4 ml-1"
                    >
                        Create an account
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

export default LoginForm;
