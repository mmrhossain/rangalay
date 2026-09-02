"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

interface Props {
    children: ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const { isLogin } = useAuthStore();
    const [authenticated, setAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const loggedIn = isLogin(); // call the function
        if (loggedIn) {
            setAuthenticated(true);
        } else {
            setAuthenticated(false);
            router.replace(`/login?redirect=${encodeURIComponent(pathname)}`); // redirect to login with redirect param
        }
    }, [isLogin, router, pathname]);

    // prevent rendering children until we know auth status
    if (authenticated === null) return null; // or loading spinner

    return <>{authenticated && children}</>;
}
