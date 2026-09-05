"use client";

import React, {Suspense, useState, useEffect} from 'react';
import Image from "next/image";
import logo from "../../../public/images/logo/logo_web.png";
import {LogOut, TextAlignJustify, CircleUserRound, X, Globe, Search} from "lucide-react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import engIcon from "../../../public/images/icon/language-icon.png";
import banIcon from "../../../public/images/icon/flag.png";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Category } from "@/types/category";
import { slugify, successToast } from "@/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import SearchDrawer from "@/components/shared/Search.drawer";

const MobileNavbar = ({ categories }: { categories: Category[] }) => {
    const [open, setOpen] = useState<boolean>(false);
    const [searchDrawerOpen, setSearchDrawerOpen] = useState<boolean>(false);
    const [value, setValue] = useState<string>("English");
    const shouldReduceMotion = useReducedMotion();
    const { isLogin, logout } = useAuthStore();
    const router = useRouter();


    useEffect(() => {
        if (open) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }

        return () => {
            document.body.classList.remove("overflow-hidden");
        };
    }, [open]);

    const handleLogout = () => {
        const result = logout();
        successToast(result.message);
        setOpen(false);
        router.push("/");
    };

    return (
        <div className="lg:hidden bg-white border-b border-gray-100 shadow-sm">
            <div className="container flex justify-between items-center py-3">
                {/* Trigger */}
                <button
                    onClick={() => setOpen(true)}
                    className="min-h-11 min-w-11 flex items-center hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Open navigation menu"
                >
                    <TextAlignJustify size={22} strokeWidth={1.7} />
                </button>

                <div>
                    <Link href="/" className="block">
                        <Image src={logo} alt="logo" width={118} priority />
                    </Link>
                </div>

                <div className="flex gap-2 items-center">
                    <button
                        onClick={() => setSearchDrawerOpen(true)}
                        className="relative group h-11 w-11 flex items-center justify-end">
                        <Search size={22} strokeWidth={1.7} />
                    </button>
                    {!isLogin() && (
                        <Link href="/login" className="h-11 w-11 flex items-center justify-end text-slate-700 hover:text-primary transition-colors">

                            <CircleUserRound size={22} strokeWidth={1.7} />
                        </Link>
                    )}
                </div>
            </div>

            {/* Drawer */}
            <AnimatePresence>
                {open && (
                    <div className="fixed inset-0 z-[10000] no-scroll">
                        {/* Overlay */}
                        <motion.div
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
                            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
                            onClick={() => setOpen(false)}
                        />

                        {/* Sidebar */}
                        <motion.div
                            className="absolute top-0 left-0 h-full w-[88%] max-w-sm bg-white shadow-2xl flex flex-col"
                            initial={shouldReduceMotion ? { x: 0 } : { x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={shouldReduceMotion ? { x: 0 } : { x: "-100%" }}
                            transition={
                                shouldReduceMotion
                                    ? { duration: 0 }
                                    : { type: "spring", damping: 25, stiffness: 200 }
                            }
                        >
                            {/* Header */}
                            <div className="flex justify-between items-center p-5 border-b">
                                <Link href="/" onClick={() => setOpen(false)}>
                                    <Image src={logo} alt="logo" width={120}/>
                                </Link>
                                <button
                                    className="p-2 bg-gray-50 rounded-full text-gray-500 hover:text-black transition-colors"
                                    onClick={() => setOpen(false)}
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Nav Items Scrollable Area */}
                            <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
                                {isLogin() && (
                                    <div className="bg-slate-50 p-5 border-b flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                            <CircleUserRound size={20} />
                                        </div>
                                        <Link href="/customer/account" onClick={() => setOpen(false)} className="font-bold text-sm text-slate-900 uppercase tracking-tight">
                                            My Dashboard
                                        </Link>
                                    </div>
                                )}

                                <ul className="flex flex-col text-slate-800">
                                    <li className="px-5 pt-6 pb-2 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                                        Collections
                                    </li>

                                    {categories?.map((category: Category) => (
                                        <li key={category?.id} className="group">
                                            {category?.all_children?.length > 0 ? (
                                                <Accordion type="single" collapsible className="w-full">
                                                    <AccordionItem value={`cat-${category?.id}`} className="border-none">
                                                        <AccordionTrigger className="uppercase px-5 text-sm font-semibold hover:no-underline py-4 hover:bg-slate-50 transition-colors">
                                                            <Link href={`/shop/${slugify(category?.slug)}/${category?.id}`} onClick={() => setOpen(false)}>
                                                                {category?.name}
                                                            </Link>
                                                        </AccordionTrigger>
                                                        <AccordionContent className="bg-slate-50/50 pb-0">
                                                            {category?.all_children?.map((sub: Category) => (
                                                                <div key={sub?.id} className="border-t border-gray-100">
                                                                    {sub?.all_children?.length > 0 ? (
                                                                        <Accordion type="single" collapsible className="w-full">
                                                                            <AccordionItem value={`sub-${sub?.id}`} className="border-none">
                                                                                <AccordionTrigger className="uppercase px-8 py-3 text-[13px] font-medium text-slate-700 hover:no-underline">
                                                                                    <Link href={`/shop/${slugify(category?.slug)}/${slugify(sub?.slug)}/${sub?.id}`} onClick={() => setOpen(false)}>{sub?.name}</Link>
                                                                                </AccordionTrigger>
                                                                                <AccordionContent className="pl-10 pb-2 space-y-3">
                                                                                    {sub?.all_children?.map((child: Category) => (
                                                                                        <Link
                                                                                            key={child?.id}
                                                                                            onClick={() => setOpen(false)}
                                                                                            href={`/shop/${slugify(category?.slug ?? "")}/${slugify(sub?.slug)}/${slugify(child?.slug ?? "")}/${child?.id}`}
                                                                                            className="block py-1 text-sm text-slate-500 hover:text-primary transition-colors capitalize"
                                                                                        >
                                                                                            {child?.name}
                                                                                        </Link>
                                                                                    ))}
                                                                                </AccordionContent>
                                                                            </AccordionItem>
                                                                        </Accordion>
                                                                    ) : (
                                                                        <Link
                                                                            onClick={() => setOpen(false)}
                                                                            href={`/shop/${slugify(category?.slug ?? "")}/${slugify(sub?.slug)}/${sub?.id}`}
                                                                            className="px-8 py-4 block text-[13px] font-medium text-slate-700 hover:text-primary"
                                                                        >
                                                                            {sub?.name}
                                                                        </Link>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </AccordionContent>
                                                    </AccordionItem>
                                                </Accordion>
                                            ) : (
                                                <Link
                                                    onClick={() => setOpen(false)}
                                                    href={`/product-details/${slugify(category?.name ?? "")}`}
                                                    className="px-5 py-4 block text-sm font-semibold uppercase hover:bg-slate-50"
                                                >
                                                    {category?.name}
                                                </Link>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Footer Section */}
                            <div className="p-5 border-t space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <Globe size={16} />
                                        <span className="text-xs font-bold uppercase tracking-wider">Region</span>
                                    </div>
                                    <Select defaultValue={value} onValueChange={(val) => setValue(val)}>
                                        <SelectTrigger className="w-[120px] h-11 border-none bg-slate-100 font-bold text-xs">
                                            <div className="flex items-center gap-2">
                                                <Image src={value === "English" ? engIcon : banIcon} alt="lang" width={16} />
                                                <SelectValue />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent className="z-[10001] bg-white">
                                            <SelectItem value="English">English</SelectItem>
                                            <SelectItem value="Bangla">Bangla</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {isLogin() ? (
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center justify-center gap-2 py-3.5 bg-slate-900 text-white rounded-xl font-bold text-sm tracking-wide active:scale-95 transition-all"
                                    >
                                        <LogOut size={18} />
                                        LOGOUT
                                    </button>
                                ) : (
                                    <Link
                                        onClick={() => setOpen(false)}
                                        href="/login"
                                        className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary text-white rounded-xl font-bold text-sm tracking-wide shadow-lg shadow-primary/20 active:scale-95 transition-all"
                                    >
                                        <CircleUserRound size={18} />
                                        LOGIN / SIGNUP
                                    </Link>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <Suspense fallback={null}>
                {searchDrawerOpen && <SearchDrawer onClose={() => setSearchDrawerOpen(false)} />}
            </Suspense>
        </div>
    );
};

export default MobileNavbar;

