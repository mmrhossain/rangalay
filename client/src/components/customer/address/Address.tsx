"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeft, Save, MapPin, CheckCircle2, Home, Plus, Edit2 } from "lucide-react";

import { locationStore } from "@/store/location.store";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { getUser } from "@/utils";

const Address = () => {
    const [view, setView] = useState<'list' | 'form'>('list');
    const [initialLoad, setInitialLoad] = useState(true);
    
    const user = getUser();
    const user_address = user?.customer_address || null;

    const {
        formState,
        handleChange,
        fetchDivisionList,
        fetchDistrictList,
        fetchPostList,
        divisionList,
        districtList,
        postList,
    } = locationStore();

    useEffect(() => {
        if (initialLoad && user) {
            setInitialLoad(false);
            if (user.name && !formState.name) handleChange("name", user.name);
            if (user.email && !formState.email) handleChange("email", user.email);
            if (user.phone && !formState.phone) handleChange("phone", user.phone);

            if (user_address) {
                handleChange("address", user_address.address || "");
                handleChange("country", user_address.country || "Bangladesh");
                handleChange("postal_code", user_address.postal_code || "");
            }
        }
    }, [user, user_address, initialLoad, formState.name, formState.email, formState.phone, handleChange]);

    useEffect(() => { fetchDivisionList(); }, [fetchDivisionList]);

    useEffect(() => {
        const list = divisionList ?? [];
        if (user_address?.division && list.length > 0) {
            const division = list.find(d => d.name === user_address.division);
            if (division) {
                handleChange("division", division.name);
                fetchDistrictList(division._id);
            }
        }
    }, [divisionList, user_address?.division, fetchDistrictList, handleChange]);

    useEffect(() => {
        const list = districtList ?? [];
        if (user_address?.district && list.length > 0) {
            const district = list.find(d => d.name === user_address.district);
            if (district) {
                handleChange("district", district.name);
                fetchPostList(district._id);
            }
        }
    }, [districtList, user_address?.district, fetchPostList, handleChange]);

    useEffect(() => {
        const list = postList ?? [];
        if (user_address?.thana && list.length > 0) {
            const thana = list.find(p => p.name === user_address.thana);
            if (thana) handleChange("thana", thana.name);
        }
    }, [postList, user_address?.thana, handleChange]);

    const handleDivisionChange = async (value: string) => {
        const selected = (divisionList ?? []).find(d => d._id === value);
        handleChange("division", selected?.name || "");
        handleChange("district", "");
        handleChange("thana", "");
        if (value) await fetchDistrictList(value);
    };

    const handleDistrictChange = async (value: string) => {
        const selected = (districtList ?? []).find(d => d._id === value);
        handleChange("district", selected?.name || "");
        handleChange("thana", "");
        if (value) await fetchPostList(value);
    };

    const handleThanaChange = (value: string) => {
        const selected = (postList ?? []).find(p => p._id === value);
        handleChange("thana", selected?.name || "");
    };

    return (
        <div className="space-y-8">
            {view === 'list' ? (
                <div className="animate-in fade-in duration-500">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">My Addresses</h2>
                            <p className="text-sm text-slate-500 mt-1">Manage delivery locations for your Raangalay orders</p>
                        </div>
                        <button 
                            onClick={() => setView('form')}
                            className="flex items-center justify-center gap-2 px-6 h-11 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary transition-all shadow-xl shadow-slate-200 active:scale-95"
                        >
                            <Plus size={16} />
                            Add New Address
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                        {user_address ? (
                            <div className="group relative p-6 rounded-3xl border border-primary bg-primary/[0.02] ring-1 ring-primary/10 transition-all">
                                <div className="flex justify-between items-start mb-5">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2.5 rounded-xl bg-primary text-white">
                                            <Home size={18} />
                                        </div>
                                        <span className="text-xs font-bold text-slate-900 uppercase tracking-widest">Primary Address</span>
                                    </div>
                                    <button onClick={() => setView('form')} className="p-2 text-slate-400 hover:text-primary transition-colors hover:bg-white rounded-lg">
                                        <Edit2 size={16} />
                                    </button>
                                </div>
                                <div className="space-y-1.5">
                                    <h4 className="font-bold text-slate-900 flex items-center gap-2">
                                        {formState.name || user?.name}
                                        <CheckCircle2 size={14} className="text-primary" />
                                    </h4>
                                    <p className="text-sm text-slate-500 leading-relaxed">
                                        {user_address.address}<br />
                                        {user_address.thana}, {user_address.district}<br />
                                        {user_address.division}, {user_address.country} - {user_address.postal_code}
                                    </p>
                                    <div className="pt-3 border-t border-primary/10 mt-3 text-xs font-bold text-slate-600">
                                        {formState.phone || user?.phone}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 rounded-3xl">
                                <MapPin className="mx-auto text-slate-300 mb-4" size={48} />
                                <p className="text-slate-500 font-medium">No addresses saved yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <form className="space-y-8 md:space-y-10 p-4 sm:p-6 md:p-8 rounded-[1.25rem] md:rounded-[2rem] border border-slate-100 shadow-sm bg-white">
                    <section className="space-y-6">
                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            Contact information
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-slate-600 font-medium ml-1">Customer Name <span className="text-red-500">*</span></Label>
                                <Input className="h-11 rounded-xl bg-slate-50/50 border-slate-200 focus:bg-white transition-all ring-offset-0 focus-visible:ring-primary/20" value={formState.name ?? ""} onChange={(e) => handleChange("name", e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-600 font-medium ml-1">Email Address</Label>
                                <Input className="h-11 rounded-xl bg-slate-50/50 border-slate-200 focus:bg-white transition-all" value={formState.email} onChange={(e) => handleChange("email", e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-600 font-medium ml-1">Phone Number</Label>
                                <Input className="h-11 rounded-xl bg-slate-50/50 border-slate-200 focus:bg-white transition-all" value={formState.phone} onChange={(e) => handleChange("phone", e.target.value)} />
                            </div>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-xl font-bold text-slate-900">Shipping address</h2>
                        <div className="space-y-2">
                            <Label className="text-slate-600 font-medium ml-1">Street Address <span className="text-red-500">*</span></Label>
                            <Input className="h-11 rounded-xl bg-slate-50/50 border-slate-200 focus:bg-white transition-all" value={formState.address} onChange={(e) => handleChange("address", e.target.value)} required />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-slate-600 font-medium ml-1">Division <span className="text-red-500">*</span></Label>
                                <Select onValueChange={handleDivisionChange} value={divisionList?.find(d => d.name === formState.division)?._id || ""}>
                                    <SelectTrigger className="w-full h-11 px-4 rounded-xl bg-slate-50/50 border-slate-200 focus:ring-0">
                                        <SelectValue placeholder="Select division" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl bg-bg-primary">
                                        {(divisionList ?? []).map((div) => (
                                            <SelectItem key={div._id} value={div._id}>{div.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-slate-600 font-medium ml-1">District <span className="text-red-500">*</span></Label>
                                <Select onValueChange={handleDistrictChange} disabled={!formState.division} value={districtList?.find(d => d.name === formState.district)?._id || ""}>
                                    <SelectTrigger className="w-full h-11 px-4 rounded-xl bg-slate-50/50 border-slate-200 focus:ring-0">
                                        <SelectValue placeholder="Select district" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl bg-bg-primary">
                                        {(districtList ?? []).map((dist) => (
                                            <SelectItem key={dist._id} value={dist._id}>{dist.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-slate-600 font-medium ml-1">Thana <span className="text-red-500">*</span></Label>
                                <Select onValueChange={handleThanaChange} disabled={!formState.district} value={postList?.find(p => p.name === formState.thana)?._id || ""}>
                                    <SelectTrigger className="w-full h-11 px-4 rounded-xl bg-slate-50/50 border-slate-200 focus:ring-0">
                                        <SelectValue placeholder="Select thana" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl bg-bg-primary">
                                        {(postList ?? []).map((post) => (
                                            <SelectItem key={post._id} value={post._id}>{post.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-slate-600 font-medium ml-1">Postal Code <span className="text-red-500">*</span></Label>
                                <Input className="h-11 rounded-xl bg-slate-50/50 border-slate-200" value={formState.postal_code} onChange={(e) => handleChange("postal_code", e.target.value)} required />
                            </div>
                        </div>
                    </section>

                    <div className="flex justify-between items-center pt-8 border-t border-slate-50">
                        <button type="button" onClick={() => setView('list')} className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-primary transition-colors">
                            <ArrowLeft size={18} /> Back
                        </button>
                        <button type="submit" className="bg-slate-900 text-white px-6 md:px-10 h-11 md:h-12 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-primary transition-all shadow-lg active:scale-95 flex items-center gap-2">
                            <Save size={18} /> Save Address
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default Address;
