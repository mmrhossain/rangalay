"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { slugify } from "@/utils";
import { X } from "lucide-react";

const SearchBox = ({ className = "", onClose }: { className?: string, onClose?: ()=>void }) => {

    const [searchValue, setSearchValue] = useState("");
    const router = useRouter();

    const handleSearchProduct = (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchValue.trim()) return;

        onClose?.();
        router.push(`/search?result=${slugify(searchValue)}`);
        setSearchValue("");
    };

    return (
        <form
            onSubmit={handleSearchProduct}

            className={`border-b lg:border-none h-full flex items-center w-full relative group transition-all duration-300 focus-within:border-primary ${className}`}
        >
            <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="absolute left-0 p-0 hover:bg-transparent text-muted-foreground group-focus-within:text-primary transition-colors"
            >
                <Search className="h-4 w-4 xl:h-5 xl:w-5 2xl:h-6 2xl:w-6" />
            </Button>

            <Input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                type="text"
                placeholder="Search products..."
                className="pl-8 xl:pl-10 pr-4 py-2 2xl:py-6 border-0 rounded-none focus-visible:ring-0 bg-transparent text-[13px] 2xl:text-base placeholder:font-light tracking-wide"
            />

            {searchValue && (
                <X
                    size={18}
                    onClick={()=> setSearchValue("")}
                    className="absolute right-5 cursor-pointer"
                />
            )}
        </form>
    );
};

export default SearchBox;