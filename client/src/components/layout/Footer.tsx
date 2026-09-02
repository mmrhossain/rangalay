"use client";

import React from 'react';
import Newsletter from '../shared/Newsletter';
import Image from "next/image";
import { FaFacebookF, FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa";
import Link from "next/link";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full text-secondary mt-14 bg-white">
            <div className="container flex flex-col">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-12 py-12 lg:py-20 border-t border-slate-100">

                    {/* 1. Brand Section */}
                    <div className="sm:col-span-2 lg:col-span-3 space-y-6">
                        <div>
                            <h2 className="text-lg font-black uppercase tracking-[0.2em] text-slate-900 mb-3">
                                About Us
                            </h2>
                            <div className="h-1 w-10 bg-[#8B2312]" />
                        </div>

                        <div className="space-y-4">
                            <span className="block text-primary font-bold text-xl">শেকড়ে ঐতিহ্যের রং</span>
                            <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
                                Celebrating the timeless artistry of handcrafted textiles where every thread tells a story of heritage and soul.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Follow Our Journey</h4>
                            <div className="flex flex-wrap gap-3">
                                {[
                                    { icon: FaFacebookF, url: "https://www.facebook.com/raangalay" },
                                    { icon: FaTiktok, url: "https://www.tiktok.com/@raangalay" },
                                    { icon: FaInstagram, url: "https://www.instagram.com/raangalay" },
                                    { icon: FaYoutube, url: "https://www.youtube.com/@raangalay" }
                                ].map((social, idx) => (
                                    <a
                                        key={idx}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-9 h-9 flex items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-black hover:text-white hover:border-black transition-all duration-300"
                                    >
                                        <social.icon size={14} />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 2. Info Section */}
                    <div className="lg:col-span-2 lg:ml-auto">
                        <h2 className="text-xs font-black uppercase tracking-[0.25em] text-slate-900 mb-6 lg:mb-8">
                            Quick Links
                        </h2>
                        <ul className="grid grid-cols-2 sm:grid-cols-1 gap-y-4 gap-x-2">
                            {['About', 'Contact', 'Blogs', 'Shop', 'Privacy Policy', 'FAQ'].map((item) => (
                                <li key={item}>
                                    <Link
                                        href={`/${item.toLowerCase().replace(' ', '-')}`}
                                        className="text-slate-500 text-sm hover:text-primary transition-all duration-300 flex items-center gap-2 group"
                                    >
                                        <span className="h-[1px] w-0 bg-primary group-hover:w-3 transition-all duration-300" />
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 3. Social Gallery Section */}
                    <div className="lg:col-span-3 lg:ml-auto flex flex-col items-start">
                        <h2 className="text-xs font-black uppercase tracking-[0.25em] text-slate-900 mb-6 lg:mb-8">
                            Instagram Shop
                        </h2>
                        <div className="group relative overflow-hidden rounded-2xl border-4 border-slate-50 shadow-sm w-fit bg-white">
                            <a
                                href="https://www.instagram.com/raangalay"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block p-2"
                            >
                                <Image
                                    width={140}
                                    height={140}
                                    src="/images/other/raangalay_qr.png"
                                    alt="Instagram QR Code"
                                    className="transition-transform duration-700 group-hover:scale-105"
                                />
                            </a>
                        </div>
                        <p className="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Scan to follow @raangalay</p>
                    </div>

                    {/* 4. Newsletter Section */}
                    <div className="sm:col-span-2 lg:col-span-4 bg-slate-50 p-6 lg:p-0 lg:bg-transparent rounded-2xl">
                        <Newsletter />
                    </div>
                </div>
            </div>

            {/* Bottom Credit Section */}
            <div className="w-full border-t border-slate-100">
                <div className="container py-8">
                    <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
                        
                        {/* Copyright & Credits */}
                        <div className="text-center lg:text-left order-2 lg:order-1">
                            <p className="text-slate-500 text-sm leading-relaxed tracking-wide">
                                © {currentYear} <span className="text-slate-900 font-bold">Raangalay</span>. 
                                All rights reserved. 
                                <span className="hidden sm:inline mx-2 text-slate-300">|</span>
                                <br className="sm:hidden" />
                                <span className="text-slate-400">Crafted with precision by Raangalay Team.</span>
                            </p>
                        </div>

                        {/* Payment Gateways */}
                        <div className="order-1 lg:order-2">
                            <div className="grayscale hover:grayscale-0 transition-all duration-500 opacity-70 hover:opacity-100">
                                <Image
                                    width={280}
                                    height={35}
                                    src="/images/other/payment-visa-card.png"
                                    alt="Accepted payment methods"
                                    className="object-contain"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Mobile Navigation Spacer */}
            <div className="h-16 lg:hidden" />
        </footer>
    );
};

export default Footer;