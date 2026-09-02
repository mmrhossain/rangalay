"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeft, CreditCard } from "lucide-react";
import Link from "next/link";

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

const CheckOutForm = () => {
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

    // 1. Prepopulate basic form fields (Fixed dependencies)
    useEffect(() => {
        if (initialLoad && user) {
            setInitialLoad(false);
            if (user.name && !formState.name) handleChange("name", user.name);
            if (user.email && !formState.email) handleChange("email", user.email);
            if (user.phone && !formState.phone) handleChange("phone", user.phone);

            if (user_address) {
                handleChange("address", user_address.address || "");
                handleChange("country", user_address.country || "");
                handleChange("postal_code", user_address.postal_code || "");
            }
        }
    }, [user, user_address, initialLoad, formState.name, formState.email, formState.phone, handleChange]);

    // 2. Fetch divisions on mount
    useEffect(() => {
        fetchDivisionList();
    }, [fetchDivisionList]);

    // 3. Prepopulate division (Fixed dependencies)
    useEffect(() => {
        if (user_address?.division && Array.isArray(divisionList) && divisionList.length > 0) {
            const division = divisionList.find(d => d.name === user_address.division);
            if (division) {
                handleChange("division", division.name);
                fetchDistrictList(division._id);
            }
        }
    }, [divisionList, user_address?.division, fetchDistrictList, handleChange]);

    // 4. Prepopulate district (Fixed dependencies)
    useEffect(() => {
        if (user_address?.district && Array.isArray(districtList) && districtList.length > 0) {
            const district = districtList.find(d => d.name === user_address.district);
            if (district) {
                handleChange("district", district.name);
                fetchPostList(district._id);
            }
        }
    }, [districtList, user_address?.district, fetchPostList, handleChange]);

    // 5. Prepopulate thana (Fixed dependencies)
    useEffect(() => {
        if (user_address?.thana && Array.isArray(postList) && postList.length > 0) {
            const thana = postList.find(p => p.name === user_address.thana);
            if (thana) {
                handleChange("thana", thana.name);
            }
        }
    }, [postList, user_address?.thana, handleChange]);

    const handleDivisionChange = async (value: string) => {
        const selected = divisionList?.find(d => d._id === value);
        handleChange("division", selected?.name || "");
        handleChange("district", "");
        handleChange("thana", "");
        if (value) await fetchDistrictList(value);
    };

    const handleDistrictChange = async (value: string) => {
        const selected = districtList?.find(d => d._id === value);
        handleChange("district", selected?.name || "");
        handleChange("thana", "");
        if (value) await fetchPostList(value);
    };

    const handleThanaChange = (value: string) => {
        const selected = postList?.find(p => p._id === value);
        handleChange("thana", selected?.name || "");
    };

    return (
        <div className="col-span-12 md:col-span-7 bg-white border border-gray-200 shadow-sm p-4 sm:p-6 md:p-8">
            <header className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                        <CreditCard />
                    </div>
                    <p className="text-base sm:text-lg uppercase tracking-[0.08em] sm:tracking-[0.10em] text-secondary">
                        Checkout
                    </p>
                </div>
            </header>

            <form className="mt-6 space-y-7 md:space-y-8">
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-base sm:text-lg font-semibold text-slate-900">
                            Contact information
                        </h2>
                        {!user && (
                            <Link href="/login" className="text-sm text-primary hover:underline">
                                Log in
                            </Link>
                        )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <Label className="text-sm">Customer Name <span className="text-red-500">*</span></Label>
                            <Input
                                className="h-11 sm:h-12 rounded-none"
                                placeholder="Customer Name"
                                value={formState.name ?? ""}
                                onChange={(e) => handleChange("name", e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-3">
                            <Label className="text-sm">Email Address</Label>
                            <Input
                                className="h-11 sm:h-12 rounded-none"
                                placeholder="example@email.com"
                                inputMode="email"
                                value={formState.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-3">
                            <Label className="text-sm">Phone Number</Label>
                            <Input
                                className="h-11 sm:h-12 rounded-none"
                                placeholder="01XXXXXXXXX"
                                inputMode="tel"
                                value={formState.phone}
                                onChange={(e) => handleChange("phone", e.target.value)}
                            />
                        </div>
                    </div>
                </section>

                <section className="space-y-5">
                    <h2 className="text-base sm:text-lg font-semibold text-slate-900">
                        Shipping address
                    </h2>

                    <div className="space-y-3">
                        <Label className="text-sm">Country <span className="text-red-500">*</span></Label>
                        <Input
                            className="h-11 sm:h-12 rounded-none"
                            placeholder="Bangladesh"
                            value={formState.country}
                            onChange={(e) => handleChange("country", e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-3">
                        <Label className="text-sm">Street Address <span className="text-red-500">*</span></Label>
                        <Input
                            className="h-11 sm:h-12 rounded-none"
                            placeholder="House, Road, Area"
                            value={formState.address}
                            onChange={(e) => handleChange("address", e.target.value)}
                            required
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <Label className="text-sm">Division <span className="text-red-500">*</span></Label>
                            <Select
                                onValueChange={handleDivisionChange}
                                value={divisionList?.find(d => d.name === formState.division)?._id || ""}
                            >
                                <SelectTrigger className="w-full h-11 sm:h-12 px-2 rounded-none focus-visible:ring-0">
                                    <SelectValue placeholder="Select division" />
                                </SelectTrigger>
                                <SelectContent className="border border-primary bg-white">
                                    {divisionList?.map((div) => (
                                        <SelectItem key={div._id} value={div._id} className="bg-gray-100 hover:bg-primary hover:text-white">
                                            {div.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-sm">District <span className="text-red-500">*</span></Label>
                            <Select
                                onValueChange={handleDistrictChange}
                                disabled={!formState.division}
                                value={districtList?.find(d => d.name === formState.district)?._id || ""}
                            >
                                <SelectTrigger className="w-full h-11 sm:h-12 px-2 rounded-none focus-visible:ring-0">
                                    <SelectValue placeholder="Select district" />
                                </SelectTrigger>
                                <SelectContent className="border border-primary bg-white">
                                    {districtList?.map((dist) => (
                                        <SelectItem key={dist._id} value={dist._id} className="bg-gray-100 hover:bg-primary hover:text-white">
                                            {dist.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <Label className="text-sm">Thana <span className="text-red-500">*</span></Label>
                            <Select
                                onValueChange={handleThanaChange}
                                disabled={!formState.district}
                                value={postList?.find(p => p.name === formState.thana)?._id || ""}
                            >
                                <SelectTrigger className="w-full h-11 sm:h-12 px-2 rounded-none focus-visible:ring-0">
                                    <SelectValue placeholder="Select thana" />
                                </SelectTrigger>
                                <SelectContent className="border border-primary bg-white">
                                    {postList?.map((post) => (
                                        <SelectItem key={post._id} value={post._id} className="bg-gray-100 hover:bg-primary hover:text-white">
                                            {post.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-sm">Postal Code <span className="text-red-500">*</span></Label>
                            <Input
                                className="h-11 sm:h-12 rounded-none"
                                placeholder="Postal code"
                                inputMode="numeric"
                                value={formState.postal_code}
                                onChange={(e) => handleChange("postal_code", e.target.value)}
                                required
                            />
                        </div>
                    </div>
                </section>

                <div className="flex justify-between">
                    <Link
                        href="/cart"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-secondary"
                    >
                        <ArrowLeft size={16} />
                        Return to cart
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default CheckOutForm;
