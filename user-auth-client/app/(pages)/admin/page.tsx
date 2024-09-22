'use client'
import { AuthContext, useAuth, User } from "@/app/context/authContext";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import Card from "@/app/components/Card";
import { useRouter } from "next/navigation";
export default function UserCards() {

    const authContext = useContext(AuthContext);
    const router = useRouter()
    const { user } = authContext || {};
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState<string>("");

    if (!user) {
        router.push('/auth/login')
    }
    const getUsers = async () => {

        try {
            const res = await axios.get('http://localhost:3000/users/admin', {
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
        if (!user || user?.role === 'ADMIN' || user?.role === 'SUPERADMIN') {
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
                    ADMIN DASHBOARD
                </h2>
                <h1 className="text-2xl font-bold mb-4">User Information</h1>
                <Card users={users} />
            </div>
        </div>
    );
}