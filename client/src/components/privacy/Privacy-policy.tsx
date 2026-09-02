import React from "react";
import { ShieldCheck, Lock, Eye, FileText } from "lucide-react";

const PrivacyPolicy = () => {

    const lastUpdated = "January 27, 2026";

    return (
        <div className="bg-white pb-20">
            {/* Header Section */}
            <div className="bg-[#F9F9F9] border-b border-gray-100 py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
                        Privacy Policy
                    </h1>
                    <p className="text-slate-500 max-w-2xl mx-auto">
                        Your privacy is important to us. This policy outlines how we collect,
                        use, and protect your personal data when you use our services.
                    </p>
                    <p className="mt-4 text-xs font-bold text-[#14b8a6] uppercase tracking-widest">
                        Last Updated: {lastUpdated}
                    </p>
                </div>
            </div>

            <div className="container max-w-4xl mx-auto px-4 mt-16">
                <div className="space-y-12">

                    {/* Section 1 */}
                    <section className="flex gap-6">
                        <div className="hidden md:block">
                            <div className="p-3 bg-teal-50 rounded-xl text-[#14b8a6]">
                                <Eye size={24} />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-slate-900">1. Information We Collect</h2>
                            <p className="text-slate-600 leading-relaxed">
                                We collect information you provide directly to us, such as when you create an account,
                                place an order, or contact customer support. This may include your name, email address,
                                shipping address, and payment information.
                            </p>
                        </div>
                    </section>

                    {/* Section 2 */}
                    <section className="flex gap-6">
                        <div className="hidden md:block">
                            <div className="p-3 bg-teal-50 rounded-xl text-[#14b8a6]">
                                <Lock size={24} />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-slate-900">2. How We Use Your Data</h2>
                            <p className="text-slate-600 leading-relaxed">
                                Your data helps us personalize your shopping experience. We use it to:
                            </p>
                            <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
                                <li>Process and deliver your orders efficiently.</li>
                                <li>Send updates regarding your order status.</li>
                                <li>Improve our website functionality and product offerings.</li>
                                <li>Prevent fraudulent transactions and enhance security.</li>
                            </ul>
                        </div>
                    </section>

                    {/* Section 3 */}
                    <section className="flex gap-6">
                        <div className="hidden md:block">
                            <div className="p-3 bg-teal-50 rounded-xl text-[#14b8a6]">
                                <ShieldCheck size={24} />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-slate-900">3. Data Protection</h2>
                            <p className="text-slate-600 leading-relaxed">
                                We implement a variety of security measures to maintain the safety of your personal
                                information. Your sensitive data (like credit card info) is encrypted via Secure
                                Socket Layer (SSL) technology.
                            </p>
                        </div>
                    </section>

                    {/* Section 4 - Simple Contact Card */}
                    <section className="bg-[#F9F9F9] border border-gray-100 p-8 rounded-2xl mt-12">
                        <div className="flex items-center gap-4 mb-4">
                            <FileText className="text-[#14b8a6]" />
                            <h2 className="text-xl font-bold text-slate-900">Contact Us</h2>
                        </div>
                        <p className="text-slate-600 mb-6">
                            If you have any questions regarding this privacy policy, you may contact
                            us using the information below:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white p-4 rounded-lg border border-gray-50 shadow-sm">
                                <p className="text-xs font-bold text-gray-400 uppercase">Email Support</p>
                                <p className="text-slate-900 font-semibold">support@raangalay.com</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg border border-gray-50 shadow-sm">
                                <p className="text-xs font-bold text-gray-400 uppercase">Phone</p>
                                <p className="text-slate-900 font-semibold">+1 (234) 567-890</p>
                            </div>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;