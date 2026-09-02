
import { create } from "zustand";
import { postData } from "@/lib/api";
import { ApiResponse } from "@/types/api";
import {Auth, AuthState} from "@/types/auth";
import {getUserId} from "@/utils";
import { useCartStore } from "./useCartStore";
import { useWishStore } from "./useWishStore";

export const useAuthStore = create<AuthState>((set, get) => ({

    user: (() => {
        // Initialize user from localStorage
        if (typeof window !== "undefined") {
            const storedUser = localStorage.getItem("login_user");
            if (storedUser) {
                try {
                    return JSON.parse(storedUser);
                } catch (error) {
                    console.error("Error parsing stored user:", error);
                    localStorage.removeItem("login_user");
                }
            }
        }
        return null;
    })(),

    setUser: (user) => set({ user }),

    loading: false,

    setLoading: (value: boolean) => {
        set({loading: value});
    },

    isLogin: () => !!get().user,

    login: async (data) => {
        try {
            // Get guest user_id before login
            const guestStr = localStorage.getItem("guest_user");
            let guestUserId: number | null = null;
            const userId = getUserId();
            console.log('Logging in with user id:', userId);
            if (guestStr) {
                try {
                    const guest = JSON.parse(guestStr);
                    if (Date.now() <= guest.expiry) {
                        guestUserId = Number(guest.value);
                    } else {
                        localStorage.removeItem("guest_user");
                    }
                } catch {
                    localStorage.removeItem("guest_user");
                }
            }

            get().setLoading(true);
            const res = await postData<ApiResponse<Auth>>("/user-login", {
                params: {
                    email: data.email,
                    password: data.password,
                    isGuestData: 1,
                    user_id: userId ? userId : null,
                },
            });

            if(res.success === true){
                set({ user: res.data });
                localStorage.removeItem("user_id");
                localStorage.setItem("login_user", JSON.stringify(res.data?.user));

                // Transfer guest cart to logged-in user
                if (guestUserId) {
                    localStorage.setItem("transfer_guest", guestUserId.toString());
                    localStorage.removeItem("guest_user");
                }

                // Fetch the updated cart and wishlist
                await useCartStore.getState().fetchCart();
                await useWishStore.getState().fetchWishList();
            }

            return res;
        }catch (err) {
            console.log("login failed: ", err);
            throw err;

        }finally {
            get().setLoading(false);
        }
    },

    signup: async (data: Auth) => {
       try {
           const userId = getUserId();

           const res = await postData<ApiResponse<Auth>>("/signup", {
               params: {
                   name: data.fullName,
                   user_id: userId ? userId : null,
                   isGuestData: 1,
                   email: data.email,
                   password: data.password,
                   password_confirmation: data.password_confirmation,
               },
           });

           return res;
       }catch (err) {
           console.log("Sign up failed: ", err);
           throw err;
       }
    },

    logout: () => {
        localStorage.removeItem("login_user");
        // Clear cart and wishlist state on logout
        useCartStore.getState().clearCart();
        useWishStore.getState().clearWish();
        set({ user: null });
        return {
            message: "Logged out",
        };
    },

}));
