"use client";

import React from 'react';
import { User, Mail, Phone, Calendar, Camera, ShieldCheck } from "lucide-react";
import { getUser } from "@/utils";

const AccountDetails = () => {
    const user = getUser();
    if (!user) return null;

    return (
        <div className="space-y-8 md:space-y-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 pb-6 md:pb-8 border-b border-slate-100">
                <div className="flex items-center gap-4 sm:gap-5">
                    <div className="relative group">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary border-2 border-white shadow-md">
                            <User size={32} strokeWidth={1.5} />
                        </div>
                        <button className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-sm border border-slate-100 text-slate-600 hover:text-primary transition-colors">
                            <Camera size={14} />
                        </button>
                    </div>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{user.name}</h1>
                        <p className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                            <Calendar size={14} />
                            Member since {user.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider">
                    <ShieldCheck size={14} />
                    Verified Account
                </div>
            </div>

            {/* Form Section */}
            <form className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                        Full Name
                    </label>
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            defaultValue={user.name}
                            className="w-full pl-12 pr-4 h-11 sm:h-[52px] bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-slate-700"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                        Email Address
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="email" 
                            defaultValue={user.email}
                            disabled
                            className="w-full pl-12 pr-4 h-11 sm:h-[52px] bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed font-medium"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                        Phone Number
                    </label>
                    <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="tel" 
                            placeholder='+880'
                            defaultValue={user.phone}
                            className="w-full pl-12 pr-4 h-11 sm:h-[52px] bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-slate-700"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                        Date of Birth
                    </label>
                    <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="date" 
                            className="w-full pl-12 pr-4 h-11 sm:h-[52px] bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-slate-700"
                        />
                    </div>
                </div>

                <div className="md:col-span-2 pt-4">
                    <button 
                        type="submit"
                        className="px-6 sm:px-8 h-11 sm:h-12 bg-slate-900 text-white rounded-xl font-bold text-xs sm:text-sm tracking-[0.08em] sm:tracking-widest uppercase hover:bg-primary transition-all shadow-lg shadow-slate-200 active:scale-95"
                    >
                        Save Changes
                    </button>
                </div>
            </form>

            {/* Security Note */}
            <div className="p-4 sm:p-6 bg-slate-50 rounded-2xl border border-slate-100 flex gap-3 sm:gap-4 items-start">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                    <ShieldCheck className="text-primary" size={20} />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-slate-900">Security Note</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        To change your verified email address or identity details, please contact our support team. These changes require manual verification for your security.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AccountDetails;
