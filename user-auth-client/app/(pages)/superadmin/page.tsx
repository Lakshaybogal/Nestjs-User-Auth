'use client'
import Card from "@/app/components/Card";
import { AuthContext } from "@/app/context/authContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}
export default function UserCards() {

    const authContext = useContext(AuthContext);
    const { user } = authContext || {};
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState<string>("");
    const router = useRouter()

    if (!user) {
        router.push('/auth/login')
    }
    const getUsers = async () => {

        try {
            const res = await axios.get('http://localhost:3000/users/superadmin', {
                withCredentials: true
            });
            console.log(res.data)
            setUsers(res.data.data)
        }
        catch (error) {
            console.log(error)
            setError(error.message)
        }

    }

    useEffect(() => {
        if (!user || user?.role === 'SUPERADMIN') {
            getUsers()
        }
        else {
            router.push('/')
        }
    }, [])


    return (
        <div className="flex flex-col  bg-gray-100 w-full h-screen">
            <div className="container mx-auto p-4 flex flex-col items-center w-full">
                <h2 className="text-3xl font-bold mb-4">
                    SUPER ADMIN DASHBOARD
                </h2>
                <h1 className="text-2xl font-bold mb-4">User Information</h1>
                <Card users={users} />
            </div>
        </div>
    );
}