"use client";

import React, {useState} from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/images/logo/logo_web.png";
import {
  Heart,
  ShoppingCart,
  UserRound,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Category } from "@/types/category";
import { useCartStore } from "@/store/useCartStore";
import { useWishStore } from "@/store/useWishStore";
import { useAuthStore } from "@/store/useAuthStore";
import { slugify, successToast } from "@/utils";

import SearchBox from "@/components/shared/SearchBox";
import { getUser } from "@/utils";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";


const DeskTopNavbar = ({ categories }: { categories: Category[] }) => {
    const { cartCount} = useCartStore();
  const { wishCount} = useWishStore();
  const { isLogin, logout } = useAuthStore();
  const router = useRouter();

  // State for Custom Category Dropdown
  const [selectedCatName, setSelectedCatName] = useState("All Categories");
  const [isCatOpen, setIsCatOpen] = useState(false);

  const user = getUser();


  const handleLogout = () => {
    const result = logout();
    successToast(result.message);
    router.push("/");
  };

  return (
      <div className="container py-5 hidden lg:flex items-center justify-between gap-8">
          {/* 1. Logo */}
          <div className="shrink-0">
              <Link href="/">
                  <Image src={logo} alt={"Raangalay_logo"} width={170} priority />
              </Link>
          </div>

          {/* 2. Integrated Search Bar with Hoverable Category Dropdown */}
          <div className="flex-1 max-w-2xl">
              <div className="flex items-center border border-gray-200 rounded-sm h-12">
                  {/* Custom Category Selector */}
                  <div
                      className="relative h-full bg-white border-r border-gray-200 min-w-[180px] group/cat"
                      onMouseEnter={() => setIsCatOpen(true)}
                      onMouseLeave={() => setIsCatOpen(false)}
                  >
                      <button className="flex items-center justify-between w-full h-full px-4 text-sm font-medium text-secondary">
                          <span className="truncate">{selectedCatName}</span>
                          <ChevronDown
                              size={14}
                              className={`transition-transform ${isCatOpen ? "rotate-180" : ""}`}
                          />
                      </button>

                      {/* Dropdown Menu - Shows on Hover */}
                      {isCatOpen && (
                          <div className="absolute top-full left-0 w-64 bg-white shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-1">
                              <div
                                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm text-primary font-bold border-b mb-1"
                                  onClick={() => {
                                      setSelectedCatName("All Categories");
                                      setIsCatOpen(false);
                                  }}
                              >
                                  All Categories
                              </div>

                              {categories?.map((cat: Category) => (
                                  <div key={cat.id} className="relative group/item">
                                      <div className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 hover:text-primary cursor-pointer text-sm transition-colors">
                                          <Link href={`/shop/${slugify(cat?.slug)}/${cat?.id}`}>
                                              {cat?.name.toUpperCase()}
                                          </Link>
                                          {cat.all_children?.length > 0 && (
                                              <ChevronRight size={14} />
                                          )}
                                      </div>

                                      {/* Level 2: Subcategories */}
                                      {cat.all_children?.length > 0 && (
                                          <div className="absolute left-full top-0 w-64 bg-white shadow-xl border border-gray-100 py-2 hidden group-hover/item:block">
                                              {cat.all_children.map((sub: Category) => (
                                                  <div
                                                      key={sub?.id}
                                                      className="relative group/subitem"
                                                  >
                                                      <div className="flex items-center justify-between px-4 py-2 text-sm text-secondary hover:bg-gray-50 hover:text-primary transition-colors cursor-pointer">
                                                          <Link
                                                              href={`/shop/${slugify(cat?.slug)}/${slugify(sub?.slug)}/${sub?.id}`}
                                                              onClick={() => {
                                                                  setSelectedCatName(sub.name);
                                                                  setIsCatOpen(false);
                                                              }}
                                                              className="flex-1"
                                                          >
                                                              {sub?.name.toUpperCase()}
                                                          </Link>
                                                          {sub.all_children?.length > 0 && (
                                                              <ChevronRight size={12} />
                                                          )}
                                                      </div>

                                                      {/* Level 3: Nested Children (Fly-out) */}
                                                      {sub.all_children?.length > 0 && (
                                                          <div className="absolute left-full top-0 w-64 bg-white shadow-xl border border-gray-100 py-2 hidden group-hover/subitem:block">
                                                              {sub.all_children.map((child: Category) => (
                                                                  <Link
                                                                      key={child?.id}
                                                                      href={`/shop/${slugify(cat?.slug)}/${slugify(sub?.slug)}/${slugify(child?.slug)}/${child?.id}`}
                                                                      className="block px-4 py-2 text-sm text-secondary hover:bg-gray-50 hover:text-primary transition-colors"
                                                                      onClick={() => {
                                                                          setSelectedCatName(child.name);
                                                                          setIsCatOpen(false);
                                                                      }}
                                                                  >
                                                                      {child?.name.toUpperCase()}
                                                                  </Link>
                                                              ))}
                                                          </div>
                                                      )}
                                                  </div>
                                              ))}
                                          </div>
                                      )}
                                  </div>
                              ))}
                          </div>
                      )}
                  </div>

                  {/* Search Input Area */}
                  <div className="flex-1 h-full overflow-hidden">
                      <SearchBox />
                  </div>
              </div>
          </div>

          <div className="flex items-center gap-4">
              {/* Wishlist */}
              <Link
                  href="/customer/wish-list"
                  className="flex items-center gap-2 group relative"
              >
                  <div className="relative p-2">
                      <Heart
                          size={24}
                          className="text-secondary group-hover:text-primary transition-colors"
                      />
                      <span className="absolute top-1 right-0 bg-primary text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                {String(wishCount).padStart(2, "0")}
              </span>
                  </div>
              </Link>

              {/* My Cart */}
              <Link href="/cart" className="flex items-center gap-3 group">
                  <div className="relative p-2">
                      <ShoppingCart
                          size={24}
                          className="text-secondary group-hover:text-primary transition-colors"
                      />
                      <span className="absolute top-1 right-0 bg-primary text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                {String(cartCount).padStart(2, "0")}
              </span>
                  </div>
              </Link>

              {/* Account Section */}
              <div className="group cursor-pointer border-r border-gray-100 pr-6">
                  {isLogin() ? (
                      <DropdownMenu>
                          <DropdownMenuTrigger className="flex items-center gap-3 focus:outline-none">
                              <div className="p-2 bg-gray-50 rounded-full group-hover:bg-primary/10 transition-colors">
                                  <UserRound
                                      size={22}
                                      className="text-secondary group-hover:text-primary"
                                  />
                              </div>
                              <div className="flex flex-col items-start text-left">
                    <span className="text-[11px] text-gray-500 leading-none">
                      Welcome
                    </span>
                                  <span className="text-sm font-bold text-secondary capitalize">
                      {user?.name || "Guest"}
                    </span>
                              </div>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="mt-2 bg-white border border-gray-100 rounded-none w-44">
                              <DropdownMenuItem className="cursor-pointer hover:bg-primary hover:text-white">
                                  <Link href="/customer/account" className="w-full">
                                      Dashboard
                                  </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                  onClick={handleLogout}
                                  className="cursor-pointer hover:bg-primary hover:text-white"
                              >
                                  Logout
                              </DropdownMenuItem>
                          </DropdownMenuContent>
                      </DropdownMenu>
                  ) : (
                      <Link href="/login" className="flex items-center gap-3">
                          <div className="p-2 bg-gray-50 rounded-full group-hover:bg-primary/10 transition-colors">
                              <UserRound
                                  size={22}
                                  className="text-secondary group-hover:text-primary"
                              />
                          </div>
                          <div className="flex flex-col items-start text-left">
                  <span className="text-[12px] text-gray-500 leading-none">
                    Welcome
                  </span>
                              <span className="text-sm font-bold text-secondary group-hover:text-primary transition-colors">
                    Sign in/Register
                  </span>
                          </div>
                      </Link>
                  )}
              </div>
          </div>
      </div>
  );
};

export default DeskTopNavbar;
