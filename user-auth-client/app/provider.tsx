// components/Providers.tsx
"use client";

import React, { useContext, useEffect } from "react";
import { AuthContext, AuthProvider } from "./context/authContext";

import { useRouter } from "next/navigation";
import Navbar from "./components/Navbar";

export function Providers({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const authContext = useContext(AuthContext);
    const { user } = authContext || {};
    useEffect(() => {
        if (authContext) {
            if (!user) {
                router.push("/auth/login");
            }
            else if (user) {
                authContext.refreshToken();
            }
            else {
                router.push("/auth/login");
            }
        }
       

    }, [authContext, router, user]);

    return <AuthProvider>
        <Navbar />
        {children}
    </AuthProvider>;
}


