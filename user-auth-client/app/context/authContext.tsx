import axios from "axios";
import { useRouter } from "next/navigation";
import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";


export interface User {
    name: string;
    role: string;
    email: string;
    id: number;
}

export interface AuthProps {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    refreshToken: () => Promise<void>;
}

export const AuthContext = createContext<AuthProps | null>(null);


export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true); // Add loading state
    const router = useRouter()

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get("http://localhost:3000/users/profile", {
                    withCredentials: true,
                });

                setUser(response.data.data);
            } catch (error) {

                console.error("Failed to fetch user", error);
                setUser(null);
            } finally {
                setLoading(false); // Ensure loading is false after user fetch attempt
            }
        };
        fetchUser();
    }, []);

    const refreshToken = async () => {
        try {

            const response = await axios.get("http://localhost:3000/users/profile", {
                withCredentials: true,
            });

            console.log(response.data.data)
            setUser(response.data.data);
        } catch (error) {

            console.error("Failed to refresh user token", error);
            setUser(null);
        }
    };

    if (loading) {
        return <div>Loading...</div>; // Optional: Show a loading spinner
    }

    return (
        <AuthContext.Provider value={{ user, setUser, refreshToken }}>
            {children}
        </AuthContext.Provider>
    );
};



export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
